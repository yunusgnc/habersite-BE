import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import {
  LoginReaderDto,
  RegisterReaderDto,
  UpdateReaderDto,
} from './dto/reader.dto';

@Injectable()
export class ReadersService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  // ─── Auth ────────────────────────────────────────────────

  private async issueToken(readerId: string, tenantId: string) {
    // Personel token'ı ile karışmaması için `type: 'reader'`. Süre 30g;
    // yorum/bookmark kritik değil, kısa değil.
    return this.jwt.signAsync(
      { sub: readerId, tenantId, type: 'reader' },
      {
        secret: this.config.get<string>('JWT_SECRET', 'changeme'),
        expiresIn: '30d',
      },
    );
  }

  async register(tenantId: string, dto: RegisterReaderDto) {
    const email = dto.email.toLowerCase().trim();
    const clash = await this.prisma.reader.findUnique({
      where: { tenantId_email: { tenantId, email } },
      select: { id: true },
    });
    if (clash) {
      throw new ConflictException('Bu e-posta ile kayıtlı bir hesap var');
    }
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const reader = await this.prisma.reader.create({
      data: {
        tenantId,
        email,
        passwordHash,
        name: dto.name,
      },
    });
    const token = await this.issueToken(reader.id, tenantId);
    return this.serialize(reader, token);
  }

  async login(tenantId: string, dto: LoginReaderDto) {
    const email = dto.email.toLowerCase().trim();
    const reader = await this.prisma.reader.findUnique({
      where: { tenantId_email: { tenantId, email } },
    });
    if (!reader || !reader.active) {
      throw new UnauthorizedException('E-posta veya şifre hatalı');
    }
    const ok = await bcrypt.compare(dto.password, reader.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('E-posta veya şifre hatalı');
    }
    await this.prisma.reader.update({
      where: { id: reader.id },
      data: { lastLoginAt: new Date() },
    });
    const token = await this.issueToken(reader.id, tenantId);
    return this.serialize(reader, token);
  }

  async me(readerId: string) {
    const reader = await this.prisma.reader.findUnique({
      where: { id: readerId },
    });
    if (!reader) throw new NotFoundException('Hesap bulunamadı');
    return this.serialize(reader);
  }

  async updateMe(readerId: string, dto: UpdateReaderDto) {
    const reader = await this.prisma.reader.findUnique({
      where: { id: readerId },
    });
    if (!reader) throw new NotFoundException('Hesap bulunamadı');
    const data: {
      name?: string;
      passwordHash?: string;
    } = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.password) data.passwordHash = await bcrypt.hash(dto.password, 10);
    const updated = await this.prisma.reader.update({
      where: { id: reader.id },
      data,
    });
    return this.serialize(updated);
  }

  // ─── Bookmark ────────────────────────────────────────────

  async listBookmarks(readerId: string, tenantId: string) {
    return this.prisma.bookmark.findMany({
      where: {
        readerId,
        // Cross-tenant güvenliği — okuyucu yanlış tenant'a bağlı bir bookmark'ı
        // görmesin (silinmiş/taşınmış tenant senaryosu).
        article: { tenantId },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        article: {
          select: {
            id: true,
            title: true,
            slug: true,
            featuredImage: true,
            spot: true,
            publishedAt: true,
            categories: {
              select: {
                category: { select: { name: true, slug: true } },
              },
              take: 1,
            },
          },
        },
      },
    });
  }

  async addBookmark(readerId: string, tenantId: string, articleId: string) {
    // Article aynı tenant'a mı ait, PUBLISHED mi kontrol et.
    const article = await this.prisma.article.findFirst({
      where: { id: articleId, tenantId, status: 'PUBLISHED' },
      select: { id: true },
    });
    if (!article) throw new NotFoundException('Haber bulunamadı');
    try {
      return await this.prisma.bookmark.create({
        data: { readerId, articleId },
      });
    } catch (e: any) {
      if (e?.code === 'P2002') {
        throw new ConflictException('Bu haber zaten kaydedilmiş');
      }
      throw e;
    }
  }

  async removeBookmark(readerId: string, articleId: string) {
    const b = await this.prisma.bookmark.findUnique({
      where: { readerId_articleId: { readerId, articleId } },
    });
    if (!b) throw new NotFoundException('Kaydedilmemiş');
    await this.prisma.bookmark.delete({ where: { id: b.id } });
    return { deleted: true };
  }

  async isBookmarked(readerId: string, articleId: string) {
    if (!articleId) throw new BadRequestException('articleId zorunlu');
    const b = await this.prisma.bookmark.findUnique({
      where: { readerId_articleId: { readerId, articleId } },
      select: { id: true },
    });
    return { bookmarked: !!b };
  }

  private serialize(
    reader: {
      id: string;
      email: string;
      name: string;
      active: boolean;
      emailVerified: boolean;
      createdAt: Date;
    },
    token?: string,
  ) {
    return {
      id: reader.id,
      email: reader.email,
      name: reader.name,
      active: reader.active,
      emailVerified: reader.emailVerified,
      createdAt: reader.createdAt,
      ...(token && { token }),
    };
  }
}
