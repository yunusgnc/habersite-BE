"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var NewslettersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewslettersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const newsletter_campaign_dto_1 = require("./dto/newsletter-campaign.dto");
let NewslettersService = NewslettersService_1 = class NewslettersService {
    prisma;
    logger = new common_1.Logger(NewslettersService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(tenantId) {
        return this.prisma.newsletterSubscriber.findMany({
            where: { tenantId, unsubscribed: false },
            orderBy: { createdAt: 'desc' },
        });
    }
    async subscribe(tenantId, email, name) {
        const normalized = (email ?? '').trim().toLowerCase();
        if (!normalized || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
            throw new common_1.BadRequestException('Geçersiz e-posta adresi');
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
            throw new common_1.ConflictException('Already subscribed');
        }
        return this.prisma.newsletterSubscriber.create({
            data: { tenantId, email: normalized, name },
        });
    }
    async unsubscribe(tenantId, email) {
        const normalized = (email ?? '').trim().toLowerCase();
        return this.prisma.newsletterSubscriber.updateMany({
            where: { tenantId, email: normalized },
            data: { unsubscribed: true },
        });
    }
    async remove(tenantId, id) {
        const found = await this.prisma.newsletterSubscriber.findFirst({
            where: { id, tenantId },
            select: { id: true },
        });
        if (!found)
            throw new common_1.NotFoundException('Abone bulunamadı');
        await this.prisma.newsletterSubscriber.delete({ where: { id } });
        return { deleted: true };
    }
    async getCount(tenantId) {
        return this.prisma.newsletterSubscriber.count({
            where: { tenantId, unsubscribed: false },
        });
    }
    async listCampaigns(tenantId, query) {
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
    async getCampaign(tenantId, id) {
        const c = await this.prisma.newsletterCampaign.findFirst({
            where: { id, tenantId },
        });
        if (!c)
            throw new common_1.NotFoundException('Kampanya bulunamadı');
        return c;
    }
    async createCampaign(tenantId, userId, dto) {
        if (dto.status === newsletter_campaign_dto_1.NewsletterCampaignStatus.SCHEDULED &&
            !dto.scheduledAt) {
            throw new common_1.BadRequestException('Zamanlanmış kampanya için scheduledAt zorunlu');
        }
        return this.prisma.newsletterCampaign.create({
            data: {
                tenantId,
                createdBy: userId,
                subject: dto.subject,
                preheader: dto.preheader,
                htmlBody: dto.htmlBody,
                textBody: dto.textBody,
                status: dto.status ?? newsletter_campaign_dto_1.NewsletterCampaignStatus.DRAFT,
                scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
            },
        });
    }
    async updateCampaign(tenantId, id, dto) {
        const existing = await this.getCampaign(tenantId, id);
        if (existing.status === newsletter_campaign_dto_1.NewsletterCampaignStatus.SENT ||
            existing.status === newsletter_campaign_dto_1.NewsletterCampaignStatus.SENDING) {
            throw new common_1.BadRequestException('Gönderilmiş veya gönderim halindeki kampanya düzenlenemez');
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
    async removeCampaign(tenantId, id) {
        const existing = await this.getCampaign(tenantId, id);
        if (existing.status === newsletter_campaign_dto_1.NewsletterCampaignStatus.SENDING) {
            throw new common_1.BadRequestException('Gönderim halindeki kampanya silinemez');
        }
        await this.prisma.newsletterCampaign.delete({ where: { id } });
        return { deleted: true };
    }
    async sendCampaign(tenantId, id, dryRun = true) {
        const campaign = await this.getCampaign(tenantId, id);
        if (campaign.status === newsletter_campaign_dto_1.NewsletterCampaignStatus.SENT) {
            throw new common_1.BadRequestException('Bu kampanya zaten gönderilmiş');
        }
        const recipients = await this.getCount(tenantId);
        if (recipients === 0) {
            throw new common_1.BadRequestException('Aktif abone yok');
        }
        if (dryRun) {
            return {
                dryRun: true,
                recipients,
                message: 'SMTP altyapısı henüz aktif değil; gerçek gönderim yapılmadı.',
            };
        }
        this.logger.warn(`[Campaign ${id}] gerçek gönderim isteği alındı ama SMTP entegre değil — sadece kayıt.`);
        return this.prisma.newsletterCampaign.update({
            where: { id },
            data: {
                status: newsletter_campaign_dto_1.NewsletterCampaignStatus.SENT,
                sentAt: new Date(),
                recipients,
                failed: 0,
            },
        });
    }
};
exports.NewslettersService = NewslettersService;
exports.NewslettersService = NewslettersService = NewslettersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NewslettersService);
//# sourceMappingURL=newsletters.service.js.map