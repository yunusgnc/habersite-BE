"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiProviderError = void 0;
class AiProviderError extends Error {
    provider;
    constructor(message, provider) {
        super(message);
        this.provider = provider;
    }
}
exports.AiProviderError = AiProviderError;
//# sourceMappingURL=ai.types.js.map