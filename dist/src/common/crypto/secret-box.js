"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEncrypted = isEncrypted;
exports.encryptSecret = encryptSecret;
exports.decryptSecret = decryptSecret;
exports.isEncryptionConfigured = isEncryptionConfigured;
const crypto_1 = require("crypto");
const ALGORITHM = 'aes-256-gcm';
const VERSION = 'v1';
const IV_BYTES = 12;
function loadKey() {
    const raw = process.env.SETTINGS_ENCRYPTION_KEY?.trim();
    if (!raw) {
        throw new Error('SETTINGS_ENCRYPTION_KEY tanımlı değil — sır saklanamaz. ' +
            'Üretmek için: openssl rand -hex 32');
    }
    const key = /^[0-9a-fA-F]{64}$/.test(raw)
        ? Buffer.from(raw, 'hex')
        : Buffer.from(raw, 'base64');
    if (key.length !== 32) {
        throw new Error(`SETTINGS_ENCRYPTION_KEY 32 bayt olmalı (şu an ${key.length}). ` +
            'Üretmek için: openssl rand -hex 32');
    }
    return key;
}
function isEncrypted(value) {
    return typeof value === 'string' && value.startsWith(`${VERSION}:`);
}
function encryptSecret(plain) {
    const key = loadKey();
    const iv = (0, crypto_1.randomBytes)(IV_BYTES);
    const cipher = (0, crypto_1.createCipheriv)(ALGORITHM, key, iv);
    const ciphertext = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return [
        VERSION,
        iv.toString('base64'),
        tag.toString('base64'),
        ciphertext.toString('base64'),
    ].join(':');
}
function decryptSecret(stored) {
    if (!isEncrypted(stored)) {
        return stored;
    }
    const [, ivB64, tagB64, dataB64] = stored.split(':');
    const decipher = (0, crypto_1.createDecipheriv)(ALGORITHM, loadKey(), Buffer.from(ivB64, 'base64'));
    decipher.setAuthTag(Buffer.from(tagB64, 'base64'));
    return Buffer.concat([
        decipher.update(Buffer.from(dataB64, 'base64')),
        decipher.final(),
    ]).toString('utf8');
}
function isEncryptionConfigured() {
    try {
        loadKey();
        return true;
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=secret-box.js.map