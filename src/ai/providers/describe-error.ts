import { Logger } from '@nestjs/common';

const logger = new Logger('AiProvider');

/**
 * Sağlayıcı SDK hatasını kullanıcının ne yapacağını anlayacağı bir cümleye çevirir.
 *
 * Neden sağlayıcının kendi metnini de ekliyoruz: HTTP durumu tek başına yeterli
 * değil. Anthropic 429'u hem "dakikalık istek sınırını aştın" hem "aylık harcama
 * limitin doldu" için döndürüyor; ilkinde beklemek çözüyor, ikincisinde beklemek
 * hiçbir şeyi değiştirmiyor. İkisini aynı cümleye indirgemek kullanıcıyı boşuna
 * bekletir. Sağlayıcı mesajları API anahtarı içermiyor, güvenle gösterilebilir.
 */
export function describeProviderError(
  err: any,
  provider: string,
  model: string,
): string {
  const status: number | undefined = err?.status;
  const detail = providerMessage(err);

  // Sunucu tarafında tam bağlam kalsın — kullanıcıya kısaltılmış cümle gitse de
  // günlükte durum kodu ve hata tipi aranabilir olsun.
  logger.warn(
    `[${provider}] status=${status ?? '-'} type=${errorType(err) ?? '-'} model=${model} :: ${detail ?? err?.message ?? 'bilinmiyor'}`,
  );

  const withDetail = (base: string) => (detail ? `${base} (${detail})` : base);

  if (status === 401)
    return withDetail('API anahtarı geçersiz. Ayarlardan kontrol edin.');
  if (status === 403)
    return withDetail('API anahtarının bu model için yetkisi yok.');
  if (status === 404)
    return withDetail(
      `"${model}" modeli bulunamadı ya da hesabınızın bu modele erişimi yok. Ayarlardan model adını değiştirin.`,
    );
  if (status === 400)
    // Anthropic yetersiz bakiyeyi 400 + invalid_request_error olarak döndürüyor.
    return withDetail('İstek sağlayıcı tarafından reddedildi.');
  if (status === 429)
    return withDetail(
      'Sağlayıcı istek sınırına takıldı ya da bakiyeniz/limitiniz doldu.',
    );
  if (typeof status === 'number' && status >= 500)
    return withDetail('Sağlayıcıda geçici bir sorun var. Tekrar deneyin.');

  return detail ?? err?.message ?? 'Sağlayıcıya bağlanılamadı.';
}

/** SDK'lar hata gövdesini farklı derinliklerde saklıyor; ikisini de yokluyoruz. */
function providerMessage(err: any): string | undefined {
  const raw =
    err?.error?.error?.message ?? // Anthropic: { error: { error: { message } } }
    err?.error?.message ?? // OpenAI: { error: { message } }
    undefined;
  return typeof raw === 'string' && raw.trim() ? raw.trim() : undefined;
}

function errorType(err: any): string | undefined {
  return err?.error?.error?.type ?? err?.error?.type ?? err?.code ?? undefined;
}
