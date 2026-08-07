import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { TenantGuard } from '../common/guards/tenant.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard, Roles } from './guards/roles.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { PrismaService } from '../prisma/prisma.service';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  // Brute-force koruması: 5 deneme/dakika/IP.
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Headers('x-tenant-id') tenantIdHeader?: string,
    @Headers('host') host?: string,
  ): Promise<AuthResponseDto> {
    const user = await this.authService.validateUserFlexible(
      dto.identifier,
      dto.password,
      tenantIdHeader || undefined,
      host,
    );
    return this.authService.login(user, dto.rememberMe ?? false);
  }

  /**
   * Şifremi unuttum — e-postaya sıfırlama tokenı gönderir. Anonim, throttled.
   * Güvenlik: e-posta var/yok bilgisini sızdırmamak için her zaman `ok:true`.
   */
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  @Post('forgot-password')
  @UseGuards(TenantGuard)
  async forgotPassword(
    @CurrentTenant() tenantId: string,
    @Body() body: { email: string },
  ) {
    const { token } = await this.authService.createPasswordResetToken(
      tenantId,
      body.email,
    );
    // Prod'da e-posta gönder — dev'de token log'a düşer.
    // TODO: SMTP entegrasyonu — nodemailer + tenant-specific from address.
    return { ok: true, ...(process.env.NODE_ENV !== 'production' && { devToken: token }) };
  }

  /**
   * Token ile şifre sıfırla — token bir kez kullanılabilir.
   */
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('reset-password')
  async resetPassword(
    @Body() body: { token: string; password: string },
  ) {
    return this.authService.resetPasswordWithToken(body.token, body.password);
  }

  /**
   * Yeni kullanıcı kaydı — anonim internet kullanıcılarına AÇIK DEĞİL.
   * Yalnızca ADMIN ve üstü, kendi tenant'ları için yeni hesap oluşturabilir.
   * Genel amaçlı hesap yaratma `POST /users` üzerinden yapılır; bu uç,
   * onboarding sırasında ilk admin oluşturmak için kullanılır.
   */
  @Post('register')
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('ADMIN')
  async register(
    @CurrentTenant() tenantId: string,
    @Body() dto: RegisterDto,
  ): Promise<AuthResponseDto> {
    return this.authService.register(tenantId, dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Request() req: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        tenantId: true,
      },
    });

    return { user };
  }
}
