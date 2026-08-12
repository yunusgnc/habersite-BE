import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { QueryCommentsDto } from './dto/query-comments.dto';
import { CommentStatus } from '@prisma/client';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByArticle(tenantId: string, articleId: string) {
    return this.prisma.comment.findMany({
      where: {
        tenantId,
        articleId,
        status: CommentStatus.APPROVED,
        parentId: null,
      },
      include: {
        replies: {
          where: { status: CommentStatus.APPROVED },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll(tenantId: string, query: QueryCommentsDto) {
    const { articleId, status, cursor, limit = 20 } = query;

    const where: any = { tenantId };
    if (articleId) where.articleId = articleId;
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      this.prisma.comment.findMany({
        where,
        take: limit + 1,
        ...(cursor && {
          skip: 1,
          cursor: { id: cursor },
        }),
        // id tiebreaker: createdAt unique degil, cursor pagination deterministik siralama ister.
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      }),
      this.prisma.comment.count({ where }),
    ]);
    let nextCursor: string | undefined;
    if (items.length > limit) {
      const next = items.pop();
      nextCursor = next!.id;
    }
    return { items, nextCursor, total };
  }

  async create(tenantId: string, dto: CreateCommentDto, ipAddress: string) {
    // Spam heuristik: skor >= 3 ise otomatik SPAM olarak işaretle; 1-2 arası
    // PENDING (elle onay); 0 ise PENDING (yayına almadan önce yine editör
    // onaylıyor ama admin liste "Onaylanmaya hazır" chip'i gösterebilir).
    const score = this.spamScore(dto.content, dto.name, dto.email);
    const status = score >= 3 ? CommentStatus.SPAM : CommentStatus.PENDING;

    const comment = await this.prisma.comment.create({
      data: {
        tenantId,
        articleId: dto.articleId,
        parentId: dto.parentId,
        name: dto.name,
        email: dto.email,
        content: dto.content,
        ipAddress,
        status,
      },
    });

    await this.prisma.article.update({
      where: { id: dto.articleId },
      data: { commentCount: { increment: 1 } },
    });

    return comment;
  }

  async updateStatus(tenantId: string, id: string, status: CommentStatus) {
    const comment = await this.prisma.comment.findFirst({
      where: { id, tenantId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return this.prisma.comment.update({
      where: { id },
      data: { status },
    });
  }

  async bulkUpdateStatus(tenantId: string, ids: string[], status: CommentStatus) {
    return this.prisma.comment.updateMany({
      where: { id: { in: ids }, tenantId },
      data: { status },
    });
  }

  async remove(tenantId: string, id: string) {
    const comment = await this.prisma.comment.findFirst({
      where: { id, tenantId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    await this.prisma.comment.delete({ where: { id } });

    await this.prisma.article.update({
      where: { id: comment.articleId },
      data: { commentCount: { decrement: 1 } },
    });

    return { deleted: true };
  }

  /**
   * Basit içerik-tabanlı spam skoru (0..∞). Herhangi bir sinyal +1 puan.
   * 0 = temiz, 1-2 = şüpheli (elle onay), 3+ = otomatik SPAM.
   */
  private spamScore(content: string, name: string, email: string): number {
    let score = 0;
    const text = (content ?? '').trim();
    const nText = text.toLowerCase();

    // 1) URL sayısı — 2'den fazla ise spam
    const links = text.match(/https?:\/\/[^\s]+/gi) ?? [];
    if (links.length >= 2) score += 2;
    else if (links.length === 1) score += 1;

    // 2) Kısaltma URL veya yaygın spam host
    if (/(bit\.ly|goo\.gl|tinyurl\.com|t\.co|is\.gd)/i.test(text)) score += 2;

    // 3) BAŞLIK olarak CAPS oranı — %60+ ise spam
    const letters = text.replace(/[^a-zA-ZçğıöşüÇĞİÖŞÜ]/g, '');
    if (letters.length > 20) {
      const upper = letters.replace(/[^A-ZÇĞİÖŞÜ]/g, '').length;
      if (upper / letters.length > 0.6) score += 1;
    }

    // 4) Yaygın spam kelimeleri (TR + EN karma)
    const spamWords = [
      'viagra',
      'cialis',
      'casino',
      'bahis',
      'kredi',
      'takipçi satın al',
      'seo hizmeti',
      'porno',
      'crypto pump',
      'nft giveaway',
    ];
    for (const w of spamWords) {
      if (nText.includes(w)) score += 1;
    }

    // 5) Aynı karakterin 6+ kez tekrarı: "aaaaaa", "!!!!!"
    if (/(.)\1{5,}/.test(text)) score += 1;

    // 6) İsim = email = boş veya tek karakter
    if ((name ?? '').trim().length < 2) score += 1;
    if (!/^[^@]+@[^@]+\.[^@]{2,}$/.test((email ?? '').trim())) score += 1;

    // 7) Çok uzun (5000+) veya çok kısa (< 3) içerik
    if (text.length > 5000 || text.length < 3) score += 1;

    return score;
  }
}
