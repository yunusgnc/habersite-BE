import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { randomBytes, createHash } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(tenantId: string, identifier: string, password: string) {
    const normalized = identifier.trim().toLowerCase();
    const user = await this.prisma.user.findFirst({
      where: {
        tenantId,
        OR: [{ email: normalized }, { username: normalized }],
      },
    });

    if (!user || !user.active) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login timestamp
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const { passwordHash, ...result } = user;
    return result;
  }

  /**
   * Tenant bilinmeden giriş — tek admin paneli tüm müşterilere hizmet verir.
   * Sıra: x-tenant-id varsa onunla; yoksa kimliği TÜM tenant'larda arar,
   * şifresi doğrulanan tam olarak BİR hesap varsa onu kullanır.
   * Aynı kimlik + şifre birden fazla tenant'ta eşleşirse Host domaini
   * üzerinden ayrıştırmayı dener; yine de belirsizse girişi reddeder.
   */
  async validateUserFlexible(
    identifier: string,
    password: string,
    tenantIdHint?: string,
    host?: string,
  ) {
    if (tenantIdHint) {
      return this.validateUser(tenantIdHint, identifier, password);
    }

    const normalized = identifier.trim().toLowerCase();
    const candidates = await this.prisma.user.findMany({
      where: {
        active: true,
        OR: [{ email: normalized }, { username: normalized }],
        tenant: { active: true },
      },
      include: { tenant: { select: { domain: true, subdomain: true } } },
    });

    const verified: typeof candidates = [];
    for (const candidate of candidates) {
      if (await bcrypt.compare(password, candidate.passwordHash)) {
        verified.push(candidate);
      }
    }

    let user = verified.length === 1 ? verified[0] : null;

    if (!user && verified.length > 1 && host) {
      const domain = host.split(':')[0];
      const byHost = verified.filter(
        (u) =>
          u.tenant.domain === domain ||
          (u.tenant.subdomain && domain.startsWith(`${u.tenant.subdomain}.`)),
      );
      if (byHost.length === 1) user = byHost[0];
    }

    if (!user) {
      throw new UnauthorizedException(
        verified.length > 1
          ? 'Birden fazla hesap eşleşti — lütfen size verilen panel adresinden giriş yapın'
          : 'Invalid credentials',
      );
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const { passwordHash, tenant, ...result } = user;
    return result;
  }

  login(
    user: {
      id: string;
      tenantId: string;
      role: string;
      name: string;
      email: string;
      avatar: string | null;
    },
    rememberMe = false,
  ): AuthResponseDto {
    const payload = {
      sub: user.id,
      tenantId: user.tenantId,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: rememberMe ? '30d' : '1d',
      }),
      tenantId: user.tenantId,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    };
  }

  async register(
    tenantId: string,
    dto: RegisterDto,
  ): Promise<AuthResponseDto> {
    const existing = await this.prisma.user.findFirst({
      where: { tenantId, email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        tenantId,
        email: dto.email,
        username: dto.username,
        passwordHash,
        name: dto.name,
        role: 'REPORTER',
      },
    });

    const { passwordHash: _, ...userWithoutPassword } = user;
    return this.login(userWithoutPassword);
  }

  // ─── Password Reset ─────────────────────────────────────────────────
  private readonly logger = new Logger(AuthService.name);

  /**
   * Şifre sıfırlama tokenı oluştur ve DB'ye hash'ini yaz. E-posta göndermek
   * (SMTP) bu fonksiyonun sorumluluğunda değil; caller (controller) dönen
   * plain-text tokenı e-postaya koyar. E-posta setup yoksa dev'de log'a
   * düşer.
   *
   * Güvenlik notu: aynı e-postanın var olup olmadığını dışa sızdırmıyoruz —
   * her durumda `{ ok: true }` döneriz.
   */
  async createPasswordResetToken(
    tenantId: string,
    email: string,
  ): Promise<{ ok: true; token?: string }> {
    const user = await this.prisma.user.findFirst({
      where: { tenantId, email: email.trim().toLowerCase(), active: true },
    });
    if (!user) return { ok: true };

    // 32 byte random → 43 char base64url
    const token = randomBytes(32).toString('base64url');
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 saat

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetTokenHash: tokenHash,
        passwordResetExpiresAt: expiresAt,
      },
    });

    // Dev/test: token'ı log'a düş — prod'da e-posta gönder.
    if (process.env.NODE_ENV !== 'production') {
      this.logger.log(
        `[DEV] Password reset for ${email}: token=${token} (expires ${expiresAt.toISOString()})`,
      );
    }
    return { ok: true, token };
  }

  /**
   * Token'ı doğrular ve yeni şifreyi kaydeder. Token bir kez kullanılabilir.
   */
  async resetPasswordWithToken(
    token: string,
    newPassword: string,
  ): Promise<{ ok: true }> {
    if (!token || newPassword.length < 6) {
      throw new BadRequestException('Geçersiz token veya şifre');
    }
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetTokenHash: tokenHash,
        passwordResetExpiresAt: { gt: new Date() },
      },
    });
    if (!user) {
      throw new BadRequestException('Token geçersiz veya süresi dolmuş');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetTokenHash: null,
        passwordResetExpiresAt: null,
      },
    });
    return { ok: true };
  }
}
