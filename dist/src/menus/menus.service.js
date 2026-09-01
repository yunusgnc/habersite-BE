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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenusService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const revalidation_service_1 = require("../common/revalidation/revalidation.service");
const STATIC_MENU_DEFAULTS = {
    'header-corporate': {
        label: null,
        items: [
            { label: 'İhbar Hattı', url: '/ihbar', order: 0 },
            { label: 'Resmi İlanlar', url: '/resmi-ilanlar', order: 1 },
            { label: 'Haber Arşivi', url: '/arsiv', order: 2 },
            { label: 'Künye', url: '/kunye', order: 3 },
        ],
    },
    'footer-servisler': {
        label: 'Servisler',
        items: [
            { label: 'Nöbetçi Eczaneler', url: '/nobetci-eczaneler', order: 0 },
            { label: 'Hava Durumu', url: '/hava-durumu', order: 1 },
            { label: 'Namaz Vakitleri', url: '/namaz-vakitleri', order: 2 },
            { label: 'Gazete Manşetleri', url: '/gazete-arsivi', order: 3 },
            { label: 'Resmi İlanlar', url: '/resmi-ilanlar', order: 4 },
        ],
    },
    'footer-icerik': {
        label: 'İçerik',
        items: [
            { label: 'Video Galeri', url: '/video-galeri', order: 0 },
            { label: 'Foto Galeri', url: '/foto-galeri', order: 1 },
            { label: 'Köşe Yazarları', url: '/kose-yazarlari', order: 2 },
            { label: 'Haber Arşivi', url: '/arsiv', order: 3 },
            { label: 'İhbar Hattı', url: '/ihbar', order: 4 },
        ],
    },
    'footer-kurumsal': {
        label: 'Kurumsal',
        items: [
            { label: 'Künye', url: '/kunye', order: 0 },
            { label: 'İletişim', url: '/iletisim', order: 1 },
            { label: 'İçerik Kaldırma Talebi', url: '/icerik-kaldirma', order: 2 },
        ],
    },
};
let MenusService = class MenusService {
    prisma;
    revalidation;
    constructor(prisma, revalidation) {
        this.prisma = prisma;
        this.revalidation = revalidation;
    }
    async findAll(tenantId) {
        return this.prisma.menu.findMany({
            where: { tenantId },
            orderBy: { location: 'asc' },
        });
    }
    async findByLocation(tenantId, location) {
        const menu = await this.prisma.menu.findUnique({
            where: { tenantId_location: { tenantId, location } },
        });
        const items = this.normalizeItems(menu?.items);
        if (items.length > 0)
            return { ...menu, items };
        const fallback = await this.defaultForLocation(tenantId, location);
        return {
            ...(menu ?? {}),
            location,
            label: menu?.label ?? fallback.label,
            items: fallback.items,
        };
    }
    normalizeItems(value) {
        if (!Array.isArray(value))
            return [];
        return value
            .filter((item) => !!item &&
            typeof item === 'object' &&
            typeof item.label === 'string' &&
            typeof item.url === 'string' &&
            item.label.trim().length > 0 &&
            item.url.trim().length > 0)
            .map((item, index) => ({
            label: item.label.trim(),
            url: item.url.trim(),
            order: Number.isInteger(item.order) ? item.order : index,
        }))
            .sort((a, b) => a.order - b.order)
            .map((item, order) => ({ ...item, order }));
    }
    async defaultForLocation(tenantId, location) {
        if (location === 'header-main' || location === 'footer-kategoriler') {
            const categories = await this.prisma.category.findMany({
                where: { tenantId, active: true },
                orderBy: { sortOrder: 'asc' },
                select: { name: true, slug: true },
            });
            return {
                label: location === 'footer-kategoriler' ? 'Kategoriler' : null,
                items: categories.map((category, order) => ({
                    label: category.name,
                    url: `/kategori/${category.slug}`,
                    order,
                })),
            };
        }
        return STATIC_MENU_DEFAULTS[location] ?? { label: null, items: [] };
    }
    async upsert(tenantId, dto) {
        const items = dto.items;
        const result = await this.prisma.menu.upsert({
            where: { tenantId_location: { tenantId, location: dto.location } },
            update: { items, label: dto.label ?? null },
            create: { tenantId, location: dto.location, items, label: dto.label ?? null },
        });
        this.revalidation.revalidateTenant(tenantId, ['menus']);
        return result;
    }
    async update(tenantId, location, dto) {
        const updateData = {};
        if (dto.items !== undefined)
            updateData.items = dto.items;
        if (dto.label !== undefined)
            updateData.label = dto.label || null;
        const result = await this.prisma.menu.upsert({
            where: { tenantId_location: { tenantId, location } },
            update: updateData,
            create: {
                tenantId,
                location,
                items: (dto.items ?? []),
                label: dto.label ?? null,
            },
        });
        this.revalidation.revalidateTenant(tenantId, ['menus']);
        return result;
    }
    async remove(tenantId, location) {
        const menu = await this.prisma.menu.findUnique({
            where: { tenantId_location: { tenantId, location } },
        });
        if (!menu)
            throw new common_1.NotFoundException('Menu not found');
        const result = await this.prisma.menu.delete({
            where: { tenantId_location: { tenantId, location } },
        });
        this.revalidation.revalidateTenant(tenantId, ['menus']);
        return result;
    }
};
exports.MenusService = MenusService;
exports.MenusService = MenusService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, revalidation_service_1.RevalidationService])
], MenusService);
//# sourceMappingURL=menus.service.js.map