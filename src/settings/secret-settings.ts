/**
 * Gizli ayar anahtarlarının tek kaynağı.
 *
 * Tasarım notu — neden kara liste DEĞİL: herkese açık ayar ucu (`/api/public/
 * settings`) eskiden `SENSITIVE_KEYS` listesinde olmayan her şeyi yayınlıyordu.
 * Bir API anahtarı için bu yanlış güvenlik duruşu: birinin listeye eklemeyi
 * unutması sırrı internete açar.
 *
 * Bunun yerine burada sayılan anahtarlar `SettingsService.getAll()` sonucuna
 * HİÇ girmiyor. Herkese açık uç `getAll` üzerinden çalıştığı için, listeyi
 * güncellemeyi unutan biri olsa bile sızıntı olamaz — sır o kod yoluna hiç
 * ulaşmıyor. Okumak için ayrı ve açıkça adlandırılmış `getSecret()` var.
 */
export const SECRET_SETTING_KEYS = new Set<string>([
  'anthropicApiKey',
  'openaiApiKey',
  // Otomatik sosyal paylaşım kimlik bilgileri — panelde yalnızca
  // "kayıtlı mı" durumu görünür, değer tarayıcıya hiç inmez.
  'telegramBotToken',
  'facebookPageToken',
  'instagramToken',
]);

/**
 * Hangi sağlayıcının kullanılacağı — sır değil, sadece bir tercih. Gizli
 * anahtarların yanında değil normal ayarlarda duruyor ki panel okuyabilsin.
 */
export type AiProvider = 'anthropic' | 'openai';

export const AI_PROVIDER_SETTING_KEY = 'aiProvider';

/** Sağlayıcı → o sağlayıcının anahtarını tutan ayar adı. */
export const AI_PROVIDER_KEY_SETTING: Record<AiProvider, string> = {
  anthropic: 'anthropicApiKey',
  openai: 'openaiApiKey',
};

export function normalizeAiProvider(value: unknown): AiProvider {
  return value === 'openai' ? 'openai' : 'anthropic';
}

export function isSecretSettingKey(key: string): boolean {
  return SECRET_SETTING_KEYS.has(key);
}

/**
 * Panelde "kayıtlı" olduğunu göstermek için son 4 karakter. Anahtarın kendisi
 * asla tarayıcıya inmiyor; bu ipucu yalnızca hangi anahtarın kayıtlı olduğunu
 * ayırt etmeye yarıyor.
 */
export function secretHint(plain: string): string {
  const trimmed = plain.trim();
  if (trimmed.length <= 4) return '••••';
  return `••••${trimmed.slice(-4)}`;
}
