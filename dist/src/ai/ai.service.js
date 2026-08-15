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
var AiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const settings_service_1 = require("../settings/settings.service");
const secret_settings_1 = require("../settings/secret-settings");
const ai_types_1 = require("./ai.types");
const anthropic_adapter_1 = require("./providers/anthropic.adapter");
const openai_adapter_1 = require("./providers/openai.adapter");
const ai_tasks_1 = require("./ai.tasks");
const MAX_CONTENT_CHARS = 6000;
let AiService = AiService_1 = class AiService {
    settings;
    logger = new common_1.Logger(AiService_1.name);
    constructor(settings) {
        this.settings = settings;
    }
    async resolveAdapter(tenantId) {
        const all = await this.settings.getAll(tenantId);
        const provider = (0, secret_settings_1.normalizeAiProvider)(all[secret_settings_1.AI_PROVIDER_SETTING_KEY]);
        const apiKey = await this.settings.getSecret(tenantId, secret_settings_1.AI_PROVIDER_KEY_SETTING[provider]);
        if (!apiKey) {
            throw new common_1.BadRequestException(provider === 'openai'
                ? 'OpenAI API anahtarı tanımlı değil. Ayarlar → Yapay Zekâ bölümünden ekleyin.'
                : 'Anthropic API anahtarı tanımlı değil. Ayarlar → Yapay Zekâ bölümünden ekleyin.');
        }
        const override = typeof all.aiModel === 'string' ? all.aiModel.trim() : '';
        return provider === 'openai'
            ? new openai_adapter_1.OpenAiAdapter(apiKey, override || openai_adapter_1.OPENAI_DEFAULT_MODEL)
            : new anthropic_adapter_1.AnthropicAdapter(apiKey, override || anthropic_adapter_1.ANTHROPIC_DEFAULT_MODEL);
    }
    async assist(tenantId, task, input) {
        const spec = ai_tasks_1.AI_TASKS[task];
        if (!spec)
            throw new common_1.BadRequestException(`Bilinmeyen görev: ${task}`);
        const body = stripHtml(input.content ?? '');
        if (!input.title?.trim() && !body) {
            throw new common_1.BadRequestException('Önce başlık veya içerik girin — yardımcının çalışacağı bir metin yok.');
        }
        const parts = [`BAŞLIK: ${input.title?.trim() || '(boş)'}`];
        if (input.spot?.trim())
            parts.push(`MEVCUT SPOT: ${input.spot.trim()}`);
        if (body)
            parts.push(`İÇERİK:\n${body.slice(0, MAX_CONTENT_CHARS)}`);
        const adapter = await this.resolveAdapter(tenantId);
        try {
            return await adapter.complete({
                system: spec.system,
                user: parts.join('\n\n'),
                schema: spec.schema,
                maxTokens: spec.maxTokens,
            });
        }
        catch (err) {
            if (err instanceof ai_types_1.AiProviderError) {
                this.logger.warn(`[ai:${err.provider}] ${err.message}`);
                throw new common_1.ServiceUnavailableException(err.message);
            }
            throw err;
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = AiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], AiService);
function stripHtml(html) {
    return html
        .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
        .replace(/<\/(p|div|h[1-6]|li|br)[^>]*>/gi, '\n')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/[ \t]+/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}
//# sourceMappingURL=ai.service.js.map