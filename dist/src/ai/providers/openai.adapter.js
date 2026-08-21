"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAiAdapter = exports.OPENAI_DEFAULT_MODEL = void 0;
const openai_1 = __importDefault(require("openai"));
const ai_types_1 = require("../ai.types");
const describe_error_1 = require("./describe-error");
exports.OPENAI_DEFAULT_MODEL = 'gpt-4o-mini';
class OpenAiAdapter {
    apiKey;
    model;
    name = 'openai';
    defaultModel = exports.OPENAI_DEFAULT_MODEL;
    constructor(apiKey, model) {
        this.apiKey = apiKey;
        this.model = model;
    }
    async complete(req) {
        const client = new openai_1.default({ apiKey: this.apiKey });
        const system = `${req.system}\n\n` +
            'Yanıtını YALNIZCA şu JSON şemasına uyan tek bir JSON nesnesi olarak ver. ' +
            'Açıklama, kod bloğu işareti veya ek metin ekleme.\n' +
            JSON.stringify(req.schema);
        let raw;
        try {
            const completion = await client.chat.completions.create({
                model: this.model,
                max_completion_tokens: req.maxTokens,
                response_format: { type: 'json_object' },
                messages: [
                    { role: 'system', content: system },
                    { role: 'user', content: req.user },
                ],
            });
            raw = completion.choices[0]?.message?.content;
        }
        catch (err) {
            throw new ai_types_1.AiProviderError((0, describe_error_1.describeProviderError)(err, this.name, this.model), this.name);
        }
        if (!raw) {
            throw new ai_types_1.AiProviderError('Sağlayıcı boş yanıt döndürdü.', this.name);
        }
        try {
            return JSON.parse(raw);
        }
        catch {
            throw new ai_types_1.AiProviderError('Sağlayıcı beklenen biçimde yanıt vermedi.', this.name);
        }
    }
}
exports.OpenAiAdapter = OpenAiAdapter;
//# sourceMappingURL=openai.adapter.js.map