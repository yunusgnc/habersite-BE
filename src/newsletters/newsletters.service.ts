import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateCampaignDto,
  ListCampaignsQuery,
  NewsletterCampaignStatus,
  UpdateCampaignDto,
} from './dto/newsletter-campaign.dto';

@Injectable()
export class NewslettersService {
  private readonly logger = new Logger(NewslettersService.name);

  constructor(private prisma: PrismaService) {}

  // ─── Aboneler ────────────────────────────────────────────

  async findAll(tenantId: string) {
    return this.prisma.newsletterSubscriber.findMany({
      where: { tenantId, unsubscribed: false },
      orderBy: { createdAt: 'desc' },
    });
  }

  async subscribe(tenantId: string, email: string, name?: string) {
    const normalized = (email ?? '').trim().toLowerCase();
    if (!normalized || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      throw new BadRequestException('Geçersiz e-posta adresi');
    }
    const existing = await this.prisma.newsletterSubscriber.findUnique({
      where: { tenantId_email: { tenantId, email: normalized } },
    });

    if (existing) {
      if (existing.unsubscribed) {
        return this.prisma.newsletterSubscriber.update({
          where: { id: existing.id },
          data: { unsubscribed: false, name: name ?? existing.name },
        });
      }
      throw new ConflictException('Already subscribed');
    }

    return this.prisma.newsletterSubscriber.create({
      data: { tenantId, email: normalized, name },
    });
  }

  async unsubscribe(tenantId: string, email: string) {
    const normalized = (email ?? '').trim().toLowerCase();
    return this.prisma.newsletterSubscriber.updateMany({
      where: { tenantId, email: normalized },
      data: { unsubscribed: true },
    });
  }

  async remove(tenantId: string, id: string) {
    // Sadece kendi tenant'ının abonesini silebilsin — id serbest bırakılırsa
    // başka bir müşterinin listesine dokunulmaz.
    const found = await this.prisma.newsletterSubscriber.findFirst({
      where: { id, tenantId },
      select: { id: true },
    });
    if (!found) throw new NotFoundException('Abone bulunamadı');
    await this.prisma.newsletterSubscriber.delete({ where: { id } });
    return { deleted: true };
  }

  async getCount(tenantId: string) {
    return this.prisma.newsletterSubscriber.count({
      where: { tenantId, unsubscribed: false },
    });
  }

  // ─── Kampanyalar ─────────────────────────────────────────

  async listCampaigns(tenantId: string, query: ListCampaignsQuery) {
    const page = Math.max(1, query.page ?? 1);
    const perPage = Math.min(100, Math.max(1, query.perPage ?? 25));
    const where = {
      tenantId,
      ...(query.status ? { status: query.status } : {}),
    };
    const [items, total] = await Promise.all([
      this.prisma.newsletterCampaign.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.prisma.newsletterCampaign.count({ where }),
    ]);
    return { items, total, page, perPage };
  }

  async getCampaign(tenantId: string, id: string) {
    const c = await this.prisma.newsletterCampaign.findFirst({
      where: { id, tenantId },
    });
    if (!c) throw new NotFoundException('Kampanya bulunamadı');
    return c;
  }

  async createCampaign(
    tenantId: string,
    userId: string | null,
    dto: CreateCampaignDto,
  ) {
    // SCHEDULED durumu için tarih olmalı; DRAFT'tan tarihsiz kaydedilebilir.
    if (
      dto.status === NewsletterCampaignStatus.SCHEDULED &&
      !dto.scheduledAt
    ) {
      throw new BadRequestException(
        'Zamanlanmış kampanya için scheduledAt zorunlu',
      );
    }
    return this.prisma.newsletterCampaign.create({
      data: {
        tenantId,
        createdBy: userId,
        subject: dto.subject,
        preheader: dto.preheader,
        htmlBody: dto.htmlBody,
        textBody: dto.textBody,
        status: dto.status ?? NewsletterCampaignStatus.DRAFT,
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
      },
    });
  }

  async updateCampaign(
    tenantId: string,
    id: string,
    dto: UpdateCampaignDto,
  ) {
    const existing = await this.getCampaign(tenantId, id);
    if (
      existing.status === NewsletterCampaignStatus.SENT ||
      existing.status === NewsletterCampaignStatus.SENDING
    ) {
      throw new BadRequestException(
        'Gönderilmiş veya gönderim halindeki kampanya düzenlenemez',
      );
    }
    return this.prisma.newsletterCampaign.update({
      where: { id },
      data: {
        ...(dto.subject !== undefined && { subject: dto.subject }),
        ...(dto.preheader !== undefined && { preheader: dto.preheader }),
        ...(dto.htmlBody !== undefined && { htmlBody: dto.htmlBody }),
        ...(dto.textBody !== undefined && { textBody: dto.textBody }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.scheduledAt !== undefined && {
          scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
        }),
      },
    });
  }

  async removeCampaign(tenantId: string, id: string) {
    const existing = await this.getCampaign(tenantId, id);
    if (existing.status === NewsletterCampaignStatus.SENDING) {
      throw new BadRequestException(
        'Gönderim halindeki kampanya silinemez',
      );
    }
    await this.prisma.newsletterCampaign.delete({ where: { id } });
    return { deleted: true };
  }

  /**
   * Kampanyayı manuel "gönder"e alır. SMTP altyapısı henüz yok; şu an sadece
   * durumu ve sayaçları güncelliyoruz — gerçek gönderim SMTP eklenince
   * BullMQ kuyruğuyla bağlanacak. Bu endpoint şimdilik dryRun modunda
   * çalışır: durumu SENT'e taşır ve kaç aboneye gitmesi gerektiğini
   * kaydeder ki kullanıcı sağlığından emin olsun.
   */
  async sendCampaign(tenantId: string, id: string, dryRun = true) {
    const campaign = await this.getCampaign(tenantId, id);
    if (campaign.status === NewsletterCampaignStatus.SENT) {
      throw new BadRequestException('Bu kampanya zaten gönderilmiş');
    }
    const recipients = await this.getCount(tenantId);
    if (recipients === 0) {
      throw new BadRequestException('Aktif abone yok');
    }
    if (dryRun) {
      // SMTP hazır olmadığı için değişiklik yok — sadece kaç kişiye gider bilgisi döner.
      return {
        dryRun: true,
        recipients,
        message: 'SMTP altyapısı henüz aktif değil; gerçek gönderim yapılmadı.',
      };
    }
    // İleride BullMQ job'una bırakılacak — şimdilik dryRun=false çağrısı da
    // sadece kayıt bırakır; asıl posta gönderimi yok.
    this.logger.warn(
      `[Campaign ${id}] gerçek gönderim isteği alındı ama SMTP entegre değil — sadece kayıt.`,
    );
    return this.prisma.newsletterCampaign.update({
      where: { id },
      data: {
        status: NewsletterCampaignStatus.SENT,
        sentAt: new Date(),
        recipients,
        failed: 0,
      },
    });
  }
}
