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
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const revalidation_service_1 = require("../common/revalidation/revalidation.service");
const secret_box_1 = require("../common/crypto/secret-box");
const secret_settings_1 = require("./secret-settings");
let SettingsService = class SettingsService {
    prisma;
    revalidation;
    constructor(prisma, revalidation) {
        this.prisma = prisma;
        this.revalidation = revalidation;
    }
    async getAll(tenantId) {
        const settings = await this.prisma.setting.findMany({
            where: { tenantId },
        });
        return settings.reduce((acc, setting) => {
            if ((0, secret_settings_1.isSecretSettingKey)(setting.key))
                return acc;
            acc[setting.key] = setting.value;
            return acc;
        }, {});
    }
    async get(tenantId, key) {
        if ((0, secret_settings_1.isSecretSettingKey)(key)) {
            return null;
        }
        const setting = await this.prisma.setting.findUnique({
            where: {
                tenantId_key: { tenantId, key },
            },
        });
        return setting?.value ?? null;
    }
    async getSecret(tenantId, key) {
        const setting = await this.prisma.setting.findUnique({
            where: { tenantId_key: { tenantId, key } },
        });
        const raw = setting?.value;
        if (typeof raw !== 'string' || !raw)
            return null;
        try {
            return (0, secret_box_1.decryptSecret)(raw);
        }
        catch {
            return null;
        }
    }
    async getSecretStatus(tenantId) {
        const rows = await this.prisma.setting.findMany({ where: { tenantId } });
        const out = {};
        for (const row of rows) {
            if (!(0, secret_settings_1.isSecretSettingKey)(row.key))
                continue;
            let hint = null;
            if (typeof row.value === 'string' && row.value) {
                try {
                    hint = (0, secret_settings_1.secretHint)((0, secret_box_1.decryptSecret)(row.value));
                }
                catch {
                    hint = null;
                }
            }
            out[row.key] = { configured: hint !== null, hint };
        }
        return out;
    }
    prepareValue(key, value) {
        if (value === null || value === undefined)
            return { value: null, remove: true };
        if (!(0, secret_settings_1.isSecretSettingKey)(key))
            return { value, remove: false };
        const plain = typeof value === 'string' ? value.trim() : '';
        if (!plain)
            return { value: null, remove: true };
        if (!(0, secret_box_1.isEncryptionConfigured)()) {
            throw new common_1.BadRequestException('Sunucuda SETTINGS_ENCRYPTION_KEY tanımlı olmadığı için API anahtarı ' +
                'kaydedilemiyor. Şifrelenmeden saklamıyoruz. Üretmek için: openssl rand -hex 32');
        }
        return { value: (0, secret_box_1.encryptSecret)(plain), remove: false };
    }
    async upsert(tenantId, key, value) {
        const prepared = this.prepareValue(key, value);
        if (prepared.remove) {
            await this.prisma.setting.deleteMany({ where: { tenantId, key } });
            this.revalidation.revalidateTenant(tenantId, ['settings']);
            return { tenantId, key, removed: true };
        }
        const result = await this.prisma.setting.upsert({
            where: {
                tenantId_key: { tenantId, key },
            },
            update: { value: prepared.value },
            create: { tenantId, key, value: prepared.value },
        });
        this.revalidation.revalidateTenant(tenantId, ['settings']);
        return (0, secret_settings_1.isSecretSettingKey)(key) ? { tenantId, key, saved: true } : result;
    }
    async bulkUpsert(tenantId, settings) {
        const removals = [];
        const writes = [];
        for (const [key, value] of Object.entries(settings)) {
            const prepared = this.prepareValue(key, value);
            if (prepared.remove)
                removals.push(key);
            else
                writes.push({ key, value: prepared.value });
        }
        await this.prisma.$transaction([
            ...removals.map((key) => this.prisma.setting.deleteMany({ where: { tenantId, key } })),
            ...writes.map(({ key, value }) => this.prisma.setting.upsert({
                where: {
                    tenantId_key: { tenantId, key },
                },
                update: { value },
                create: { tenantId, key, value },
            })),
        ]);
        this.revalidation.revalidateTenant(tenantId, ['settings']);
        return { updated: writes.map((w) => w.key), removed: removals };
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, revalidation_service_1.RevalidationService])
], SettingsService);
//# sourceMappingURL=settings.service.js.map