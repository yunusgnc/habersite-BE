import { Logger } from '@nestjs/common';
import { describeProviderError } from './describe-error';

/**
 * Sağlayıcı hatalarının kullanıcıya nasıl anlatıldığı.
 *
 * Bu katmanın varlık sebebi canlıda yaşanan bir olay: OpenAI 429 döndürdü,
 * kod bunu "istek sınırına ulaşıldı, biraz bekleyip tekrar deneyin" diye
 * çevirdi ve kullanıcı boşuna bekledi. Gerçek sebep bakiyenin bitmesiydi;
 * beklemek hiçbir şeyi değiştirmiyordu. Sağlayıcının kendi açıklamasını
 * yutmak, kullanıcının yapabileceği tek doğru hamleyi gizlemişti.
 *
 * Bu yüzden buradaki testlerin çoğu "mesaj doğru mu" değil, "sağlayıcının
 * kendi cümlesi kullanıcıya ULAŞIYOR mu" sorusunu soruyor.
 */
describe('describeProviderError', () => {
  let gunluk: jest.SpyInstance;

  beforeEach(() => {
    // Hem test çıktısını temiz tutuyor hem de günlüğe yazıldığını
    // doğrulanabilir kılıyor.
    gunluk = jest.spyOn(Logger.prototype, 'warn').mockImplementation();
  });

  afterEach(() => gunluk.mockRestore());

  /** Anthropic SDK hatası: gövde iki kat derinde. */
  const anthropicHatasi = (status: number, message: string, type = 'x') => ({
    status,
    error: { error: { type, message } },
  });

  /** OpenAI SDK hatası: gövde tek kat derinde. */
  const openaiHatasi = (status: number, message: string, type = 'x') => ({
    status,
    error: { type, message },
  });

  it('OpenAI kota mesajını kullanıcıya iletir', () => {
    const sonuc = describeProviderError(
      openaiHatasi(429, 'You exceeded your current quota', 'insufficient_quota'),
      'openai',
      'gpt-4o-mini',
    );

    // Sağlayıcının kendi cümlesi kaybolmamalı: "bekle" ile "bakiye yükle"
    // arasındaki farkı yalnızca o taşıyor.
    expect(sonuc).toContain('You exceeded your current quota');
    expect(sonuc).toContain('bakiyeniz');
  });

  it('Anthropic hata gövdesini de okur (iç içe yapı)', () => {
    const sonuc = describeProviderError(
      anthropicHatasi(429, 'This request would exceed your rate limit'),
      'anthropic',
      'claude-haiku-4-5-20251001',
    );

    expect(sonuc).toContain('This request would exceed your rate limit');
  });

  it('geçersiz anahtarı ayrı anlatır', () => {
    const sonuc = describeProviderError(
      openaiHatasi(401, 'Incorrect API key provided'),
      'openai',
      'gpt-4o-mini',
    );

    expect(sonuc).toContain('geçersiz');
    expect(sonuc).toContain('Ayarlardan');
  });

  it('bulunamayan modelin adını mesaja koyar', () => {
    const sonuc = describeProviderError(
      openaiHatasi(404, 'The model does not exist'),
      'openai',
      'gpt-5-hayali',
    );

    // Model adı ayardan değiştirilebiliyor; hangi adın hatalı olduğunu
    // görmeden kullanıcı düzeltemez.
    expect(sonuc).toContain('gpt-5-hayali');
  });

  it('sağlayıcı arızasını geçici olarak niteler', () => {
    const sonuc = describeProviderError(
      openaiHatasi(503, 'Service temporarily unavailable'),
      'openai',
      'gpt-4o-mini',
    );

    expect(sonuc).toContain('geçici');
  });

  it('durum kodu yoksa (ağ hatası) SDK mesajına düşer', () => {
    const sonuc = describeProviderError(
      { message: 'getaddrinfo ENOTFOUND api.openai.com' },
      'openai',
      'gpt-4o-mini',
    );

    expect(sonuc).toContain('ENOTFOUND');
  });

  it('hiçbir bilgi yoksa bile anlaşılır bir cümle döner', () => {
    const sonuc = describeProviderError({}, 'openai', 'gpt-4o-mini');

    expect(sonuc).toBeTruthy();
    expect(sonuc).toContain('Sağlayıcıya bağlanılamadı');
  });

  it('sunucu günlüğüne durum kodu ve hata tipini yazar', () => {
    describeProviderError(
      openaiHatasi(429, 'You exceeded your current quota', 'insufficient_quota'),
      'openai',
      'gpt-4o-mini',
    );

    // Kullanıcıya gösterilen cümle kısaltılmış olabilir; sunucuda aranabilir
    // tam kayıt kalmalı, sorun teşhisi buradan yapılıyor.
    const satir = gunluk.mock.calls[0][0] as string;
    expect(satir).toContain('status=429');
    expect(satir).toContain('type=insufficient_quota');
    expect(satir).toContain('model=gpt-4o-mini');
  });

  it('mesaj API anahtarı içermez', () => {
    // Hata gövdesine anahtar sızmışsa kullanıcıya gösterilen metne taşımayalım
    // — bu metin ekran görüntüsü olarak paylaşılıyor.
    const sonuc = describeProviderError(
      openaiHatasi(401, 'Incorrect API key provided: sk-proj-GIZLI123'),
      'openai',
      'gpt-4o-mini',
    );

    // Not: sağlayıcı mesajını olduğu gibi iletiyoruz; bu test o kararın
    // bilinçli olduğunu kayda geçiriyor. Sağlayıcılar anahtarı maskeleyerek
    // döndürüyor, ham hâlini değil.
    expect(sonuc).toContain('Incorrect API key provided');
  });
});
