import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

/**
 * Müşteri sırlarının (ör. kendi Anthropic API anahtarı) veritabanında düz
 * metin durmaması için AES-256-GCM sarmalayıcı.
 *
 * Neden şifreliyoruz: veritabanı dökümleri yedekleme, taşıma ve hata ayıklama
 * sırasında elden ele geçiyor. Bir API anahtarı taşıyıcı kimlik bilgisidir —
 * eline geçen müşterinin faturasına harcama yapabilir. Dökümde düz metin
 * durmasın.
 *
 * GCM seçildi çünkü kimlik doğrulamalı: şifreli metin kurcalanırsa çözme
 * sessizce bozuk veri döndürmek yerine hata fırlatır.
 */

const ALGORITHM = 'aes-256-gcm';
const VERSION = 'v1';
const IV_BYTES = 12; // GCM için önerilen uzunluk

/**
 * Anahtar 32 baytlık olmalı. Hem hex (64 karakter) hem base64 kabul ediyoruz;
 * `openssl rand -hex 32` ve `openssl rand -base64 32` çıktılarının ikisi de
 * çalışsın.
 */
function loadKey(): Buffer {
  const raw = process.env.SETTINGS_ENCRYPTION_KEY?.trim();
  if (!raw) {
    throw new Error(
      'SETTINGS_ENCRYPTION_KEY tanımlı değil — sır saklanamaz. ' +
        'Üretmek için: openssl rand -hex 32',
    );
  }

  const key = /^[0-9a-fA-F]{64}$/.test(raw)
    ? Buffer.from(raw, 'hex')
    : Buffer.from(raw, 'base64');

  if (key.length !== 32) {
    throw new Error(
      `SETTINGS_ENCRYPTION_KEY 32 bayt olmalı (şu an ${key.length}). ` +
        'Üretmek için: openssl rand -hex 32',
    );
  }
  return key;
}

/** Şifrelenmiş sır bu ön ekle saklanır; düz metinden ayırt etmeye yarar. */
export function isEncrypted(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith(`${VERSION}:`);
}

export function encryptSecret(plain: string): string {
  const key = loadKey();
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [
    VERSION,
    iv.toString('base64'),
    tag.toString('base64'),
    ciphertext.toString('base64'),
  ].join(':');
}

export function decryptSecret(stored: string): string {
  if (!isEncrypted(stored)) {
    // Şifreleme devreye girmeden önce yazılmış bir değer olabilir; olduğu gibi
    // döndürüyoruz ki mevcut kurulumlar bozulmasın.
    return stored;
  }
  const [, ivB64, tagB64, dataB64] = stored.split(':');
  const decipher = createDecipheriv(ALGORITHM, loadKey(), Buffer.from(ivB64, 'base64'));
  decipher.setAuthTag(Buffer.from(tagB64, 'base64'));
  return Buffer.concat([
    decipher.update(Buffer.from(dataB64, 'base64')),
    decipher.final(),
  ]).toString('utf8');
}

/** `SETTINGS_ENCRYPTION_KEY` düzgün tanımlı mı — kaydetmeden önce kontrol için. */
export function isEncryptionConfigured(): boolean {
  try {
    loadKey();
    return true;
  } catch {
    return false;
  }
}
