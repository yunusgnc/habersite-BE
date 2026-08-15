"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnthropicAdapter = exports.ANTHROPIC_DEFAULT_MODEL = void 0;
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const ai_types_1 = require("../ai.types");
exports.ANTHROPIC_DEFAULT_MODEL = 'claude-opus-5';
class AnthropicAdapter {
    apiKey;
    model;
    name = 'anthropic';
    defaultModel = exports.ANTHROPIC_DEFAULT_MODEL;
    constructor(apiKey, model) {
        this.apiKey = apiKey;
        this.model = model;
    }
    async complete(req) {
        const client = new sdk_1.default({ apiKey: this.apiKey });
        let response;
        try {
            response = await client.messages.create({
                model: this.model,
                max_tokens: req.maxTokens,
                system: req.system,
                output_config: {
                    effort: 'low',
                    format: { type: 'json_schema', schema: req.schema },
                },
                messages: [{ role: 'user', content: req.user }],
            });
        }
        catch (err) {
            throw new ai_types_1.AiProviderError(this.describe(err), this.name);
        }
        if (response.stop_reason === 'refusal') {
            throw new ai_types_1.AiProviderError('Sağlayıcı bu içerik için isteği reddetti. Metni gözden geçirip tekrar deneyin.', this.name);
        }
        const text = response.content.find((b) => b.type === 'text');
        if (!text || text.type !== 'text') {
            throw new ai_types_1.AiProviderError('Sağlayıcı boş yanıt döndürdü.', this.name);
        }
        try {
            return JSON.parse(text.text);
        }
        catch {
            throw new ai_types_1.AiProviderError('Sağlayıcı beklenen biçimde yanıt vermedi.', this.name);
        }
    }
    describe(err) {
        const status = err?.status;
        if (status === 401)
            return 'API anahtarı geçersiz. Ayarlardan kontrol edin.';
        if (status === 403)
            return 'API anahtarının bu model için yetkisi yok.';
        if (status === 404)
            return `"${this.model}" modeli bulunamadı. Ayarlardan model adını güncelleyin.`;
        if (status === 429)
            return 'Sağlayıcı istek sınırına ulaşıldı ya da kotanız bitti. Biraz bekleyip tekrar deneyin.';
        if (status >= 500)
            return 'Sağlayıcıda geçici bir sorun var. Tekrar deneyin.';
        return err?.message ?? 'Sağlayıcıya bağlanılamadı.';
    }
}
exports.AnthropicAdapter = AnthropicAdapter;
//# sourceMappingURL=anthropic.adapter.js.map