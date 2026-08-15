"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECRET_SETTING_KEYS = void 0;
exports.isSecretSettingKey = isSecretSettingKey;
exports.secretHint = secretHint;
exports.SECRET_SETTING_KEYS = new Set(['anthropicApiKey']);
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