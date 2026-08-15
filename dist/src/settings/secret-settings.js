"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AI_PROVIDER_KEY_SETTING = exports.AI_PROVIDER_SETTING_KEY = exports.SECRET_SETTING_KEYS = void 0;
exports.normalizeAiProvider = normalizeAiProvider;
exports.isSecretSettingKey = isSecretSettingKey;
exports.secretHint = secretHint;
exports.SECRET_SETTING_KEYS = new Set([
    'anthropicApiKey',
    'openaiApiKey',
]);
exports.AI_PROVIDER_SETTING_KEY = 'aiProvider';
exports.AI_PROVIDER_KEY_SETTING = {
    anthropic: 'anthropicApiKey',
    openai: 'openaiApiKey',
};
function normalizeAiProvider(value) {
    return value === 'openai' ? 'openai' : 'anthropic';
}
function isSecretSettingKey(key) {
    return exports.SECRET_SETTING_KEYS.has(key);
}
function secretHint(plain) {
    const trimmed = plain.trim();
    if (trimmed.length <= 4)
        return '••••';
    return `••••${trimmed.slice(-4)}`;
}
//# sourceMappingURL=secret-settings.js.map