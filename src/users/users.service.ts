import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { sayfaliListe } from '../common/pagination/sayfali-liste';
import { ArticleStatus, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { normalizePermissionOverrides } from '../auth/permissions';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private readonly selectFields = {
    id: true,
    name: true,
    email: true,
    role: true,
    avatar: true,
    active: true,
    permissions: true,
    lastLoginAt: true,
    createdAt: true,
  };

  private async actorRole(actorId: string): Promise<UserRole> {
    const actor = await this.prisma.user.findUnique({
      where: { id: actorId },
      select: { role: true, active: true },
    });
    if (!actor?.active) {
      throw new ForbiddenException('Kullanıcı yönetimi için yetkiniz bulunmuyor');
    }
    return actor.role;
  }

  private superAdminKoruması(actorRole: UserRole, targetRole?: UserRole) {
    if (targetRole === 'SUPER_ADMIN' && actorRole !== 'SUPER_ADMIN') {
      throw new ForbiddenException(
        'Süper Admin hesabını yalnızca başka bir Süper Admin yönetebilir',
      );
    }
  }

  async findAll(
    tenantId: string,
    opts: {
      cursor?: string;
      page?: number;
      limit?: number;
      search?: string;
      role?: string;
      /** Paylaşım sayımı penceresi (gün). Verilmezse son 30 gün. */
      shareDays?: number;
    } = {},
  ) {
    const limit = Math.min(100, opts.limit ?? 30);
    const where: any = { tenantId };
    if (opts.search?.trim()) {
      const q = opts.search.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { username: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (opts.role) where.role = opts.role;

    const sonuc = await sayfaliListe({
      limit,
      page: opts.page,
      cursor: opts.cursor,
      say: () => this.prisma.user.count({ where }),
      bul: (args) =>
        this.prisma.user.findMany({
          where,
          select: this.selectFields,
          // id tiebreaker: createdAt unique degil, deterministik siralama sart.
          orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
          ...args,
        }),
    });

    // Paylaşım sayıları yalnızca GÖSTERİLEN sayfa için hesaplanır; tüm
    // kullanıcıları taramak gereksiz. Uç zaten ADMIN korumalı (controller).
    const shareDays = this.paylasimPenceresi(opts.shareDays);
    const sayimlar = await this.paylasimSayilari(
      tenantId,
      sonuc.items.map((u) => u.id),
      shareDays,
    );

    return {
      ...sonuc,
      shareDays,
      items: sonuc.items.map((u) => ({
        ...u,
        shareCount: sayimlar.get(u.id) ?? 0,
      })),
    };
  }

  /** Paylaşım sayımı için gün penceresi: 1–365 arası, varsayılan 30. */
  private paylasimPenceresi(gun?: number): number {
    if (!gun || !Number.isFinite(gun)) return 30;
    return Math.min(365, Math.max(1, Math.trunc(gun)));
  }

  /**
   * Kullanıcı başına PAYLAŞILAN HABER sayısı.
   *
   * Sayım `social_share_logs` tablosundan DEĞİL haberlerden yapılıyor. İki
   * sebebi var:
   *
   * 1. Soru "kaç haber paylaştı" — üç ağa giden bir haber tek paylaşımdır.
   *    Gönderim kaydı ağ başına satır tuttuğu için aynı haberi üçe katlıyordu.
   * 2. Gönderim kaydı sonradan eklendi ve boş başladı; ondan saymak bütün
   *    geçmişi sıfır gösteriyordu. Haberler ise ilk günden beri duruyor.
   *
   * Sayılan: kullanıcının o aralıkta YAYINLANAN ve en az bir ağa işaretli
   * haberi. Ağ seçimi boş dizi olan haber editörün bilinçli olarak paylaşımı
   * kapattığı haberdir, sayılmaz; seçim yoksa (null) "ayarlarda açık olan her
   * ağ" demektir ve sayılır.
   */
  private async paylasimSayilari(
    tenantId: string,
    userIds: string[],
    gun: number,
  ): Promise<Map<string, number>> {
    if (userIds.length === 0) return new Map();
    const baslangic = new Date(Date.now() - gun * 24 * 60 * 60 * 1000);
    const kosul = {
      tenantId,
      createdById: { in: userIds },
      status: ArticleStatus.PUBLISHED,
      publishedAt: { gte: baslangic },
    };

    // "En az bir ağa işaretli" koşulu JSON sütununda doğrudan ifade edilemiyor.
    // Ham SQL yerine iki sayım çıkarıp farkını alıyoruz: toplam yayın eksi
    // ağ seçimi BOŞ DİZİ olanlar. Boş dizi editörün paylaşımı bilinçli olarak
    // kapattığı haberdir; seçim yoksa (null) "her ağ" demek ve sayılır.
    const [toplam, paylasimsiz] = await Promise.all([
      this.prisma.article.groupBy({
        by: ['createdById'],
        where: kosul,
        _count: { _all: true },
      }),
      this.prisma.article.groupBy({
        by: ['createdById'],
        where: { ...kosul, shareTargets: { equals: [] } },
        _count: { _all: true },
      }),
    ]);

    const dusulecek = new Map(
      paylasimsiz.map((s) => [s.createdById, s._count._all]),
    );
    return new Map(
      toplam.map((s) => [
        s.createdById,
        s._count._all - (dusulecek.get(s.createdById) ?? 0),
      ]),
    );
  }

  async findById(tenantId: string, id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, tenantId },
      select: this.selectFields,
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(
    tenantId: string,
    data: {
      name: string;
      email: string;
      password: string;
      role?: UserRole;
      active?: boolean;
      permissions?: unknown;
    },
    actorId: string,
  ) {
    const actorRole = await this.actorRole(actorId);
    this.superAdminKoruması(actorRole, data.role);
    // E-posta DAİMA küçük harfle saklanır: giriş kimliği lowercase'e
    // çekildiği için büyük harfle kaydedilen hesap giriş yapamıyordu.
    const email = data.email.trim().toLowerCase();
    const existing = await this.prisma.user.findFirst({
      where: { tenantId, email: { equals: email, mode: 'insensitive' } },
    });
    if (existing) {
      throw new ConflictException('Bu e-posta adresi zaten kullanılıyor');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        tenantId,
        name: data.name,
        email,
        passwordHash,
        role: data.role ?? 'REPORTER',
        active: data.active ?? true,
        permissions: normalizePermissionOverrides(data.permissions),
      },
      select: this.selectFields,
    });
  }

  async update(
    tenantId: string,
    id: string,
    data: {
      name?: string;
      email?: string;
      password?: string;
      role?: UserRole;
      active?: boolean;
      permissions?: unknown;
    },
    actorId: string,
  ) {
    const [target, actorRole] = await Promise.all([
      this.findById(tenantId, id),
      this.actorRole(actorId),
    ]);
    // Admin, mevcut Süper Adminin parolasını/e-postasını da değiştiremez;
    // yalnızca rol alanını korumak hesap ele geçirmeyi engellemezdi.
    this.superAdminKoruması(actorRole, target.role);
    this.superAdminKoruması(actorRole, data.role);

    const updateData: Record<string, any> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email.trim().toLowerCase();
    if (data.role !== undefined) updateData.role = data.role;
    if (data.active !== undefined) updateData.active = data.active;
    if (data.permissions !== undefined) {
      updateData.permissions = normalizePermissionOverrides(data.permissions);
    }
    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(data.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: this.selectFields,
    });
  }

  async updateRole(tenantId: string, id: string, role: UserRole, actorId: string) {
    const [target, actorRole] = await Promise.all([
      this.findById(tenantId, id),
      this.actorRole(actorId),
    ]);
    this.superAdminKoruması(actorRole, target.role);
    this.superAdminKoruması(actorRole, role);
    return this.prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });
  }

  async toggleActive(tenantId: string, id: string, actorId: string) {
    const user = await this.prisma.user.findFirst({ where: { id, tenantId } });
    if (!user) throw new NotFoundException('User not found');
    this.superAdminKoruması(await this.actorRole(actorId), user.role);
    return this.prisma.user.update({
      where: { id },
      data: { active: !user.active },
      select: { id: true, name: true, active: true },
    });
  }

  async remove(tenantId: string, id: string, actorId: string) {
    const [target, actorRole] = await Promise.all([
      this.findById(tenantId, id),
      this.actorRole(actorId),
    ]);
    this.superAdminKoruması(actorRole, target.role);
    return this.prisma.user.delete({ where: { id } });
  }
}
