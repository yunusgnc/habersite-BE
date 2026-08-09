import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Prisma } from '@prisma/client';

export type ReportType =
  | 'articles'
  | 'comments'
  | 'authors'
  | 'categories'
  | 'newsletter'
  | 'media'
  | 'messages'
  | 'videos'
  | 'galleries'
  | 'users';

export type ReportColumn = {
  key: string;
  label: string;
  /** Default columns shown when the report loads for the first time. */
  defaultVisible?: boolean;
};

export type ReportFilters = {
  search?: string;
  from?: string; // ISO date
  to?: string;   // ISO date
  status?: string;
};

type ReportRow = Record<string, string | number | boolean | null>;

type ReportResponse = {
  type: ReportType;
  columns: ReportColumn[];
  rows: ReportRow[];
  total: number;
};

const REPORT_META: Record<ReportType, { title: string; columns: ReportColumn[] }> = {
  articles: {
    title: 'Haberler',
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'title', label: 'Başlık', defaultVisible: true },
      { key: 'slug', label: 'Slug' },
      { key: 'status', label: 'Durum', defaultVisible: true },
      { key: 'type', label: 'Tip' },
      { key: 'category', label: 'Kategori', defaultVisible: true },
      { key: 'author', label: 'Yazar', defaultVisible: true },
      { key: 'views', label: 'Görüntülenme', defaultVisible: true },
      { key: 'comments', label: 'Yorum' },
      { key: 'featured', label: 'Öne Çıkan' },
      { key: 'publishedAt', label: 'Yayın Tarihi', defaultVisible: true },
      { key: 'createdAt', label: 'Oluşturulma' },
      { key: 'createdBy', label: 'Ekleyen' },
    ],
  },
  comments: {
    title: 'Yorumlar',
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'articleTitle', label: 'Haber', defaultVisible: true },
      { key: 'authorName', label: 'Yazan', defaultVisible: true },
      { key: 'email', label: 'E-posta' },
      { key: 'content', label: 'İçerik', defaultVisible: true },
      { key: 'status', label: 'Durum', defaultVisible: true },
      { key: 'createdAt', label: 'Tarih', defaultVisible: true },
    ],
  },
  authors: {
    title: 'Yazarlar',
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Ad Soyad', defaultVisible: true },
      { key: 'slug', label: 'Slug' },
      { key: 'email', label: 'E-posta', defaultVisible: true },
      { key: 'articleCount', label: 'Haber Sayısı', defaultVisible: true },
      { key: 'active', label: 'Aktif', defaultVisible: true },
      { key: 'createdAt', label: 'Oluşturulma', defaultVisible: true },
    ],
  },
  categories: {
    title: 'Kategoriler',
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Ad', defaultVisible: true },
      { key: 'slug', label: 'Slug', defaultVisible: true },
      { key: 'parent', label: 'Üst Kategori' },
      { key: 'articleCount', label: 'Haber Sayısı', defaultVisible: true },
      { key: 'active', label: 'Aktif', defaultVisible: true },
      { key: 'createdAt', label: 'Oluşturulma' },
    ],
  },
  newsletter: {
    title: 'Bülten Aboneleri',
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'email', label: 'E-posta', defaultVisible: true },
      { key: 'createdAt', label: 'Abone Tarihi', defaultVisible: true },
    ],
  },
  media: {
    title: 'Medya',
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'filename', label: 'Dosya', defaultVisible: true },
      { key: 'title', label: 'Başlık', defaultVisible: true },
      { key: 'mimeType', label: 'Tip', defaultVisible: true },
      { key: 'size', label: 'Boyut (KB)', defaultVisible: true },
      { key: 'url', label: 'URL' },
      { key: 'createdAt', label: 'Yüklenme', defaultVisible: true },
    ],
  },
  messages: {
    title: 'İletişim Mesajları',
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Ad Soyad', defaultVisible: true },
      { key: 'email', label: 'E-posta', defaultVisible: true },
      { key: 'phone', label: 'Telefon' },
      { key: 'subject', label: 'Konu', defaultVisible: true },
      { key: 'message', label: 'Mesaj' },
      { key: 'read', label: 'Okundu', defaultVisible: true },
      { key: 'createdAt', label: 'Tarih', defaultVisible: true },
    ],
  },
  videos: {
    title: 'Videolar',
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'title', label: 'Başlık', defaultVisible: true },
      { key: 'slug', label: 'Slug' },
      { key: 'source', label: 'Kaynak', defaultVisible: true },
      { key: 'duration', label: 'Süre (sn)', defaultVisible: true },
      { key: 'views', label: 'Görüntülenme', defaultVisible: true },
      { key: 'status', label: 'Durum', defaultVisible: true },
      { key: 'publishedAt', label: 'Yayın Tarihi', defaultVisible: true },
    ],
  },
  galleries: {
    title: 'Foto Galeriler',
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'title', label: 'Başlık', defaultVisible: true },
      { key: 'slug', label: 'Slug' },
      { key: 'imageCount', label: 'Görsel Sayısı', defaultVisible: true },
      { key: 'views', label: 'Görüntülenme', defaultVisible: true },
      { key: 'status', label: 'Durum', defaultVisible: true },
      { key: 'publishedAt', label: 'Yayın Tarihi', defaultVisible: true },
    ],
  },
  users: {
    title: 'Kullanıcılar',
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Ad Soyad', defaultVisible: true },
      { key: 'email', label: 'E-posta', defaultVisible: true },
      { key: 'username', label: 'Kullanıcı Adı' },
      { key: 'role', label: 'Rol', defaultVisible: true },
      { key: 'active', label: 'Aktif', defaultVisible: true },
      { key: 'createdAt', label: 'Kayıt Tarihi', defaultVisible: true },
      { key: 'lastLoginAt', label: 'Son Giriş' },
    ],
  },
};

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  meta() {
    return Object.entries(REPORT_META).map(([type, m]) => ({
      type,
      title: m.title,
      columns: m.columns,
    }));
  }

  async run(
    tenantId: string,
    type: ReportType,
    filters: ReportFilters = {},
  ): Promise<ReportResponse> {
    const meta = REPORT_META[type];
    if (!meta) throw new BadRequestException(`Unknown report type: ${type}`);

    const rows = await this.fetch(tenantId, type, filters);
    return {
      type,
      columns: meta.columns,
      rows,
      total: rows.length,
    };
  }

  async csv(
    tenantId: string,
    type: ReportType,
    filters: ReportFilters,
    columns: string[],
  ): Promise<{ filename: string; body: string }> {
    const meta = REPORT_META[type];
    if (!meta) throw new BadRequestException(`Unknown report type: ${type}`);

    const rows = await this.fetch(tenantId, type, filters);
    const selectedColumns = columns.length
      ? meta.columns.filter((c) => columns.includes(c.key))
      : meta.columns.filter((c) => c.defaultVisible);

    const headers = selectedColumns.map((c) => c.label);
    const csvRows = rows.map((r) => selectedColumns.map((c) => r[c.key] ?? ''));

    const stamp = new Date().toISOString().slice(0, 10);
    return {
      filename: `${type}-${stamp}.csv`,
      body: toCsv(headers, csvRows),
    };
  }

  // ---------- fetch per type ----------

  private async fetch(
    tenantId: string,
    type: ReportType,
    f: ReportFilters,
  ): Promise<ReportRow[]> {
    const dateFilter = this.dateRange(f);

    switch (type) {
      case 'articles': {
        const where: Prisma.ArticleWhereInput = { tenantId };
        if (f.search) where.title = { contains: f.search, mode: 'insensitive' };
        if (f.status) where.status = f.status as any;
        if (dateFilter) where.createdAt = dateFilter;

        const rows = await this.prisma.article.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: 5000,
          select: {
            id: true,
            title: true,
            slug: true,
            status: true,
            type: true,
            viewCount: true,
            commentCount: true,
            featured: true,
            publishedAt: true,
            createdAt: true,
            author: { select: { name: true } },
            createdBy: { select: { name: true } },
            categories: {
              select: {
                primary: true,
                category: { select: { name: true } },
              },
            },
          },
        });
        return rows.map((a) => {
          const primary =
            a.categories.find((c) => c.primary) ?? a.categories[0] ?? null;
          return {
            id: a.id,
            title: a.title,
            slug: a.slug,
            status: a.status,
            type: a.type,
            category: primary?.category?.name ?? null,
            author: a.author?.name ?? null,
            views: a.viewCount,
            comments: a.commentCount,
            featured: a.featured ? 'Evet' : 'Hayır',
            publishedAt: iso(a.publishedAt),
            createdAt: iso(a.createdAt),
            createdBy: a.createdBy?.name ?? null,
          };
        });
      }

      case 'comments': {
        const where: Prisma.CommentWhereInput = { tenantId };
        if (f.search)
          where.OR = [
            { content: { contains: f.search, mode: 'insensitive' } },
            { name: { contains: f.search, mode: 'insensitive' } },
            { email: { contains: f.search, mode: 'insensitive' } },
          ];
        if (f.status) where.status = f.status as any;
        if (dateFilter) where.createdAt = dateFilter;

        // Fetch comments then batch-load article titles for the referenced ids.
        const comments = await this.prisma.comment.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: 5000,
          select: {
            id: true,
            name: true,
            email: true,
            content: true,
            status: true,
            createdAt: true,
            articleId: true,
          },
        });
        const articleIds = [...new Set(comments.map((c) => c.articleId))];
        const articles = await this.prisma.article.findMany({
          where: { id: { in: articleIds } },
          select: { id: true, title: true },
        });
        const titleById = new Map(articles.map((a) => [a.id, a.title]));

        return comments.map((c) => ({
          id: c.id,
          articleTitle: titleById.get(c.articleId) ?? null,
          authorName: c.name,
          email: c.email,
          content: c.content,
          status: c.status,
          createdAt: iso(c.createdAt),
        }));
      }

      case 'authors': {
        const where: Prisma.AuthorWhereInput = { tenantId };
        if (f.search)
          where.OR = [
            { name: { contains: f.search, mode: 'insensitive' } },
            { email: { contains: f.search, mode: 'insensitive' } },
          ];
        if (dateFilter) where.createdAt = dateFilter;

        const rows = await this.prisma.author.findMany({
          where,
          orderBy: { name: 'asc' },
          take: 5000,
          select: {
            id: true,
            name: true,
            slug: true,
            email: true,
            active: true,
            createdAt: true,
            _count: { select: { articles: true } },
          },
        });
        return rows.map((a) => ({
          id: a.id,
          name: a.name,
          slug: a.slug,
          email: a.email,
          articleCount: a._count.articles,
          active: a.active ? 'Evet' : 'Hayır',
          createdAt: iso(a.createdAt),
        }));
      }

      case 'categories': {
        const where: Prisma.CategoryWhereInput = { tenantId };
        if (f.search)
          where.name = { contains: f.search, mode: 'insensitive' };

        const rows = await this.prisma.category.findMany({
          where,
          orderBy: { name: 'asc' },
          take: 2000,
          select: {
            id: true,
            name: true,
            slug: true,
            active: true,
            createdAt: true,
            parent: { select: { name: true } },
            _count: { select: { articles: true } },
          },
        });
        return rows.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          parent: c.parent?.name ?? null,
          articleCount: c._count.articles,
          active: c.active ? 'Evet' : 'Hayır',
          createdAt: iso(c.createdAt),
        }));
      }

      case 'newsletter': {
        const where: Prisma.NewsletterSubscriberWhereInput = { tenantId };
        if (f.search)
          where.email = { contains: f.search, mode: 'insensitive' };
        if (dateFilter) where.createdAt = dateFilter;

        const rows = await this.prisma.newsletterSubscriber.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: 20000,
          select: { id: true, email: true, createdAt: true },
        });
        return rows.map((s) => ({
          id: s.id,
          email: s.email,
          createdAt: iso(s.createdAt),
        }));
      }

      case 'media': {
        const where: Prisma.MediaWhereInput = { tenantId };
        if (f.search)
          where.OR = [
            { filename: { contains: f.search, mode: 'insensitive' } },
            { title: { contains: f.search, mode: 'insensitive' } },
          ];
        if (dateFilter) where.createdAt = dateFilter;

        const rows = await this.prisma.media.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: 5000,
          select: {
            id: true,
            filename: true,
            title: true,
            mimeType: true,
            size: true,
            url: true,
            createdAt: true,
          },
        });
        return rows.map((m) => ({
          id: m.id,
          filename: m.filename,
          title: m.title ?? null,
          mimeType: m.mimeType,
          size: m.size ? Math.round(m.size / 1024) : null,
          url: m.url,
          createdAt: iso(m.createdAt),
        }));
      }

      case 'messages': {
        const where: Prisma.ContactMessageWhereInput = { tenantId };
        if (f.search)
          where.OR = [
            { name: { contains: f.search, mode: 'insensitive' } },
            { email: { contains: f.search, mode: 'insensitive' } },
            { message: { contains: f.search, mode: 'insensitive' } },
          ];
        if (dateFilter) where.createdAt = dateFilter;

        const rows = await this.prisma.contactMessage.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: 5000,
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            subject: true,
            message: true,
            read: true,
            createdAt: true,
          },
        });
        return rows.map((m) => ({
          id: m.id,
          name: m.name,
          email: m.email,
          phone: m.phone,
          subject: m.subject,
          message: m.message,
          read: m.read ? 'Evet' : 'Hayır',
          createdAt: iso(m.createdAt),
        }));
      }

      case 'videos': {
        const where: Prisma.VideoWhereInput = { tenantId };
        if (f.search)
          where.title = { contains: f.search, mode: 'insensitive' };
        if (f.status) where.status = f.status as any;
        if (dateFilter) where.createdAt = dateFilter;

        const rows = await this.prisma.video.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: 5000,
          select: {
            id: true,
            title: true,
            slug: true,
            source: true,
            duration: true,
            viewCount: true,
            status: true,
            publishedAt: true,
          },
        });
        return rows.map((v) => ({
          id: v.id,
          title: v.title,
          slug: v.slug,
          source: v.source,
          duration: v.duration,
          views: v.viewCount,
          status: v.status,
          publishedAt: iso(v.publishedAt),
        }));
      }

      case 'galleries': {
        const where: Prisma.GalleryWhereInput = { tenantId };
        if (f.search)
          where.title = { contains: f.search, mode: 'insensitive' };
        if (f.status) where.status = f.status as any;
        if (dateFilter) where.createdAt = dateFilter;

        const rows = await this.prisma.gallery.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: 5000,
          select: {
            id: true,
            title: true,
            slug: true,
            viewCount: true,
            status: true,
            publishedAt: true,
            _count: { select: { images: true } },
          },
        });
        return rows.map((g) => ({
          id: g.id,
          title: g.title,
          slug: g.slug,
          imageCount: g._count.images,
          views: g.viewCount,
          status: g.status,
          publishedAt: iso(g.publishedAt),
        }));
      }

      case 'users': {
        const where: Prisma.UserWhereInput = { tenantId };
        if (f.search)
          where.OR = [
            { name: { contains: f.search, mode: 'insensitive' } },
            { email: { contains: f.search, mode: 'insensitive' } },
            { username: { contains: f.search, mode: 'insensitive' } },
          ];
        if (dateFilter) where.createdAt = dateFilter;

        const rows = await this.prisma.user.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: 5000,
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
            role: true,
            active: true,
            createdAt: true,
            lastLoginAt: true,
          },
        });
        return rows.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          username: u.username,
          role: u.role,
          active: u.active ? 'Evet' : 'Hayır',
          createdAt: iso(u.createdAt),
          lastLoginAt: iso(u.lastLoginAt),
        }));
      }
    }
  }

  private dateRange(f: ReportFilters): { gte?: Date; lte?: Date } | undefined {
    if (!f.from && !f.to) return undefined;
    const range: { gte?: Date; lte?: Date } = {};
    if (f.from) range.gte = new Date(f.from);
    if (f.to) {
      const to = new Date(f.to);
      to.setHours(23, 59, 59, 999);
      range.lte = to;
    }
    return range;
  }
}

// ---------- helpers ----------

/**
 * Format dates in a way Excel/Numbers won't auto-convert to serial numbers.
 * Turkish-style dd.MM.yyyy HH:mm — always as text.
 */
function iso(d: Date | null | undefined): string | null {
  if (!d) return null;
  const date = new Date(d);
  if (isNaN(date.getTime())) return null;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return '';
  const s = String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function toCsv(headers: string[], rows: unknown[][]): string {
  const lines = [
    headers.map(csvEscape).join(','),
    ...rows.map((r) => r.map(csvEscape).join(',')),
  ];
  // UTF-8 BOM so Excel picks up Turkish characters.
  return '﻿' + lines.join('\n');
}
