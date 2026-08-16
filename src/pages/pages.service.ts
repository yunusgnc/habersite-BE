import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RevalidationService } from '../common/revalidation/revalidation.service';
import { CreatePageDto, UpdatePageDto } from './dto/create-page.dto';
import slugify from 'slugify';

@Injectable()
export class PagesService {
  constructor(private prisma: PrismaService, private readonly revalidation: RevalidationService) {}

  async findAll(tenantId: string) {
    return this.prisma.page.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPublished(tenantId: string) {
    return this.prisma.page.findMany({
      where: { tenantId, published: true },
      orderBy: { title: 'asc' },
    });
  }

  /**
   * Sayfayı slug VEYA kimlikle bulur.
   *
   * Neden ikisi de: site sayfaları slug ile açıyor (`/kunye`), panel ise
   * listede kimlikle bağlantı veriyor (`/pages/<id>`). Uç yalnızca slug ile
   * arıyordu, dolayısıyla panelden hiçbir sayfa açılamıyordu — "Sayfa
   * bulunamadı" çıkıyordu. Sessiz bir hataydı: kimse hata görmüyor, sadece
   * düzenleme ekranı boş dönüyordu.
   *
   * Önce slug deniyoruz çünkü sık olan yol o (site tarafı, her ziyaret).
   */
  async findBySlug(tenantId: string, slugYaDaId: string) {
    const page = await this.prisma.page.findFirst({
      where: {
        tenantId,
        OR: [{ slug: slugYaDaId }, { id: slugYaDaId }],
      },
    });
    if (!page) throw new NotFoundException('Page not found');
    return page;
  }

  async create(tenantId: string, dto: CreatePageDto) {
    const baseSlug =
      dto.slug?.trim() ||
      slugify(dto.title, { lower: true, strict: true, locale: 'tr' });
    const slug = await this.ensureUniqueSlug(tenantId, baseSlug);
    const content = this.normalizeContent(dto.content);
    const result = await this.prisma.page.create({
      data: {
        tenantId,
        slug,
        title: dto.title,
        content,
        seoTitle: dto.seoTitle,
        seoDesc: dto.seoDesc,
        published: dto.published ?? true,
      },
    });
    this.revalidation.revalidateTenant(tenantId, ['pages']);
    return result;
  }

  async update(tenantId: string, id: string, dto: UpdatePageDto) {
    const data: Record<string, any> = { ...dto };
    if (dto.content !== undefined) {
      data.content = this.normalizeContent(dto.content);
    }
    // If slug is being changed, make sure it stays unique per tenant.
    if (dto.slug) {
      data.slug = await this.ensureUniqueSlug(tenantId, dto.slug, id);
    }
    const result = await this.prisma.page.update({ where: { id }, data });
    this.revalidation.revalidateTenant(tenantId, ['pages']);
    return result;
  }

  /**
   * Postgres has a unique index on (tenantId, slug). Append -2, -3, … until
   * we find a free slot so the user doesn't get a 500 for typing an
   * already-used title.
   */
  private async ensureUniqueSlug(
    tenantId: string,
    baseSlug: string,
    ignoreId?: string,
  ): Promise<string> {
    let candidate = baseSlug;
    let n = 1;
    while (true) {
      const clash = await this.prisma.page.findFirst({
        where: {
          tenantId,
          slug: candidate,
          ...(ignoreId ? { NOT: { id: ignoreId } } : {}),
        },
        select: { id: true },
      });
      if (!clash) return candidate;
      n += 1;
      candidate = `${baseSlug}-${n}`;
    }
  }

  /**
   * Content column is `Json`. Callers may send a Tiptap HTML string OR an
   * object — Prisma's Json column rejects raw strings unless wrapped, so
   * strings become `{ html }` for a stable shape downstream.
   */
  private normalizeContent(content: unknown): any {
    if (typeof content === 'string') return { html: content };
    return content ?? {};
  }

  async remove(tenantId: string, id: string) {
    const result = await this.prisma.page.delete({ where: { id } });
    this.revalidation.revalidateTenant(tenantId, ['pages']);
    return result;
  }
}
