import { Logger } from '@nestjs/common';
import { SocialShareService } from './social-share.service';

/**
 * Ağa hiç çıkmadan sözleşmeyi sınar: hangi ayarda hangi uca ne gönderilir,
 * kapalıyken hiçbir istek atılmaz ve ağ hatası asla dışarı sızmaz
 * (paylaşım yayını bloklayamaz — servisin bir numaralı kuralı).
 */

/** Görsel yoklamasının (HEAD) "evet, bu bir görsel" yanıtı. */
const GORSEL_YANITI = {
  ok: true,
  status: 200,
  headers: new Headers({ 'content-type': 'image/jpeg' }),
  body: null,
};

/** Yoklamaya görsel, diğer her şeye başarılı JSON dönen varsayılan mock. */
function varsayilanFetch(): jest.Mock {
  return jest.fn().mockImplementation((_adres: string, secenekler?: any) =>
    Promise.resolve(
      secenekler?.method === 'HEAD'
        ? { ...GORSEL_YANITI }
        : {
            ok: true,
            status: 200,
            json: async () => ({ ok: true, id: 'kap-1' }),
          },
    ),
  );
}

describe('SocialShareService', () => {
  const HABER = {
    id: 'h1',
    title: 'Örnek Başlık',
    slug: 'ornek-baslik',
    type: 'NEWS',
    featuredImage: 'https://cdn.example.com/kapak.jpg',
  };

  let settings: { getAll: jest.Mock; getSecret: jest.Mock; upsert: jest.Mock };
  let servis: SocialShareService;
  let fetchMock: jest.Mock;

  /** Görsel yoklaması hariç, ağlara giden gerçek istekler. */
  const istekler = () =>
    fetchMock.mock.calls.filter(
      ([, secenekler]) => secenekler?.method !== 'HEAD',
    );

  beforeEach(() => {
    delete process.env.META_GRAPH_VERSION;
    settings = { getAll: jest.fn(), getSecret: jest.fn(), upsert: jest.fn() };
    servis = new SocialShareService(settings as any);
    fetchMock = varsayilanFetch();
    global.fetch = fetchMock as any;
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => jest.restoreAllMocks());

  it('hiçbir ağ açık değilse istek atılmaz', async () => {
    settings.getAll.mockResolvedValue({ siteUrl: 'https://ornek.com' });
    await servis.paylas('t1', HABER);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('siteUrl yoksa hiç paylaşmaz — bağlantısız gönderi olmaz', async () => {
    settings.getAll.mockResolvedValue({
      autoShareTelegram: 'on',
      telegramChatId: '@kanal',
    });
    settings.getSecret.mockResolvedValue('token');
    await servis.paylas('t1', HABER);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('telegram: görselli haber sendPhoto ile kanala gider', async () => {
    settings.getAll.mockResolvedValue({
      siteUrl: 'https://ornek.com/',
      autoShareTelegram: 'on',
      telegramChatId: '@kanal',
    });
    settings.getSecret.mockResolvedValue('BOT_TOKEN');

    await servis.paylas('t1', HABER);

    expect(istekler()).toHaveLength(1);
    const [adres, secenekler] = istekler()[0];
    expect(adres).toBe('https://api.telegram.org/botBOT_TOKEN/sendPhoto');
    const govde = JSON.parse(secenekler.body);
    expect(govde.chat_id).toBe('@kanal');
    expect(govde.photo).toBe('https://ornek.com/api/social-image/ornek-baslik');
    expect(govde.caption).toContain('https://ornek.com/haber/ornek-baslik');
  });

  it('telegram: kapaksız makale de üretilen JPEG ile /makale yoluna gider', async () => {
    settings.getAll.mockResolvedValue({
      siteUrl: 'https://ornek.com',
      autoShareTelegram: 'on',
      telegramChatId: '@kanal',
    });
    settings.getSecret.mockResolvedValue('BOT_TOKEN');

    await servis.paylas('t1', {
      ...HABER,
      type: 'COLUMN',
      featuredImage: null,
    });

    const [adres, secenekler] = istekler()[0];
    expect(adres).toBe('https://api.telegram.org/botBOT_TOKEN/sendPhoto');
    expect(JSON.parse(secenekler.body).caption).toContain(
      '/makale/ornek-baslik',
    );
  });

  it('facebook: sayfaya doğrudan fotoğraf + haber bağlantısı gönderir', async () => {
    settings.getAll.mockResolvedValue({
      siteUrl: 'https://ornek.com',
      autoShareFacebook: 'on',
      facebookPageId: '12345',
    });
    settings.getSecret.mockResolvedValue('FB_TOKEN');

    await servis.paylas('t1', HABER);

    const [adres, secenekler] = istekler()[0];
    expect(adres).toBe('https://graph.facebook.com/v25.0/12345/photos');
    const govde = Object.fromEntries(
      (secenekler.body as URLSearchParams).entries(),
    );
    expect(govde.url).toBe('https://ornek.com/api/social-image/ornek-baslik');
    expect(govde.caption).toContain('https://ornek.com/haber/ornek-baslik');
    expect(govde.access_token).toBe('FB_TOKEN');
  });

  it('instagram: iki aşama — önce medya kabı, sonra yayınlama', async () => {
    settings.getAll.mockResolvedValue({
      siteUrl: 'https://ornek.com',
      autoShareInstagram: 'on',
      instagramUserId: '999',
    });
    settings.getSecret.mockResolvedValue('IG_TOKEN');

    await servis.paylas('t1', HABER);

    expect(istekler()).toHaveLength(2);
    expect(istekler()[0][0]).toBe('https://graph.facebook.com/v25.0/999/media');
    expect(
      Object.fromEntries((istekler()[0][1].body as URLSearchParams).entries())
        .image_url,
    ).toBe('https://ornek.com/api/social-image/ornek-baslik');
    expect(istekler()[1][0]).toBe(
      'https://graph.facebook.com/v25.0/999/media_publish',
    );
    expect(
      Object.fromEntries((istekler()[1][1].body as URLSearchParams).entries())
        .creation_id,
    ).toBe('kap-1');
  });

  it('instagram: kapaksız haberde de site tarafından üretilen JPEG kullanılır', async () => {
    settings.getAll.mockResolvedValue({
      siteUrl: 'https://ornek.com',
      autoShareInstagram: 'on',
      instagramUserId: '999',
    });
    settings.getSecret.mockResolvedValue('IG_TOKEN');

    await servis.paylas('t1', { ...HABER, featuredImage: null });
    expect(istekler()).toHaveLength(2);
    const govde = Object.fromEntries(
      (istekler()[0][1].body as URLSearchParams).entries(),
    );
    expect(govde.image_url).toBe(
      'https://ornek.com/api/social-image/ornek-baslik',
    );
  });

  it('x: JPEG önce media/upload ile yüklenir, sonra gönderiye bağlanır', async () => {
    settings.getAll.mockResolvedValue({
      siteUrl: 'https://ornek.com',
      autoShareTwitter: 'on',
    });
    settings.getSecret.mockImplementation((_tenantId: string, key: string) =>
      Promise.resolve(key === 'twitterAccessToken' ? 'X_USER_TOKEN' : null),
    );
    fetchMock
      .mockResolvedValueOnce({ ...GORSEL_YANITI }) // görsel yoklaması
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'image/jpeg' }),
        arrayBuffer: async () => Buffer.from('jpeg'),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: { id: 'media-1' } }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({ data: { id: 'post-1' } }),
      });

    await servis.paylas('t1', HABER);

    expect(istekler()[0][0]).toBe(
      'https://ornek.com/api/social-image/ornek-baslik',
    );
    expect(istekler()[1][0]).toBe('https://api.x.com/2/media/upload');
    expect(istekler()[2][0]).toBe('https://api.x.com/2/tweets');
    const post = JSON.parse(istekler()[2][1].body);
    expect(post.media.media_ids).toEqual(['media-1']);
    expect(post.text).toContain('https://ornek.com/haber/ornek-baslik');
  });

  it('x: offline.access anahtarını yeniler ve rotasyonlu değerleri şifreli ayara yazar', async () => {
    settings.getAll.mockResolvedValue({
      siteUrl: 'https://ornek.com',
      autoShareTwitter: 'on',
    });
    const sirlar: Record<string, string> = {
      twitterAccessToken: 'ESKI_TOKEN',
      twitterRefreshToken: 'ESKI_REFRESH',
      twitterClientId: 'CLIENT_ID',
      twitterClientSecret: 'CLIENT_SECRET',
    };
    settings.getSecret.mockImplementation((_tenantId: string, key: string) =>
      Promise.resolve(sirlar[key] ?? null),
    );
    fetchMock
      .mockResolvedValueOnce({ ...GORSEL_YANITI }) // görsel yoklaması
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          access_token: 'YENI_TOKEN',
          refresh_token: 'YENI_REFRESH',
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'image/jpeg' }),
        arrayBuffer: async () => Buffer.from('jpeg'),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: { id: 'media-1' } }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({ data: { id: 'post-1' } }),
      });

    await servis.paylas('t1', HABER);

    expect(istekler()[0][0]).toBe('https://api.x.com/2/oauth2/token');
    expect(istekler()[0][1].headers.Authorization).toBe(
      `Basic ${Buffer.from('CLIENT_ID:CLIENT_SECRET').toString('base64')}`,
    );
    expect(settings.upsert).toHaveBeenCalledWith(
      't1',
      'twitterAccessToken',
      'YENI_TOKEN',
    );
    expect(settings.upsert).toHaveBeenCalledWith(
      't1',
      'twitterRefreshToken',
      'YENI_REFRESH',
    );
    expect(istekler()[2][1].headers.Authorization).toBe('Bearer YENI_TOKEN');
  });

  it('ağ hatası dışarı sızmaz — yayın akışını bloklayamaz', async () => {
    settings.getAll.mockResolvedValue({
      siteUrl: 'https://ornek.com',
      autoShareTelegram: 'on',
      autoShareFacebook: 'on',
      telegramChatId: '@kanal',
      facebookPageId: '12345',
    });
    settings.getSecret.mockResolvedValue('TOKEN');
    fetchMock.mockRejectedValue(new Error('ağ çöktü'));

    await expect(servis.paylas('t1', HABER)).resolves.toBeUndefined();
  });

  it('token kayıtlı değilse o ağ sessizce atlanır', async () => {
    settings.getAll.mockResolvedValue({
      siteUrl: 'https://ornek.com',
      autoShareTelegram: 'on',
      telegramChatId: '@kanal',
    });
    settings.getSecret.mockResolvedValue(null);
    await servis.paylas('t1', HABER);
    expect(istekler()).toHaveLength(0);
  });
});

/**
 * GÖRSEL BULUNAMAZSA — canlıda bizi yakan senaryo.
 *
 * Site eski sürümdeyse /api/social-image ucu HTML (404 sayfası) döner.
 * Telegram ve Facebook fotoğrafı indiremeyince gönderiyi tümden reddeder;
 * eski davranışta haber HİÇ paylaşılmıyordu. Artık sırayla ham kapağa,
 * o da olmazsa metin/bağlantı gönderisine düşülür.
 */
describe('SocialShareService — görsel bulunamadığında', () => {
  const HABER = {
    id: 'h1',
    title: 'Örnek Başlık',
    slug: 'ornek-baslik',
    type: 'NEWS',
    featuredImage: 'https://cdn.example.com/kapak.jpg',
  };

  let settings: { getAll: jest.Mock; getSecret: jest.Mock };
  let servis: SocialShareService;
  let fetchMock: jest.Mock;

  const istekler = () =>
    fetchMock.mock.calls.filter(
      ([, secenekler]) => secenekler?.method !== 'HEAD',
    );

  /** Yoklamada hangi adreslerin görsel sayılacağını belirler. */
  function yoklama(gorselAdresleri: string[], digerleri?: jest.Mock) {
    fetchMock = jest
      .fn()
      .mockImplementation((adres: string, secenekler?: any) => {
        if (secenekler?.method === 'HEAD') {
          return Promise.resolve(
            gorselAdresleri.includes(adres)
              ? { ...GORSEL_YANITI }
              : {
                  ok: true,
                  status: 200,
                  headers: new Headers({ 'content-type': 'text/html' }),
                  body: null,
                },
          );
        }
        return digerleri
          ? digerleri(adres, secenekler)
          : Promise.resolve({
              ok: true,
              status: 200,
              json: async () => ({ ok: true, id: 'kap-1' }),
            });
      });
    global.fetch = fetchMock as any;
  }

  beforeEach(() => {
    settings = { getAll: jest.fn(), getSecret: jest.fn() };
    servis = new SocialShareService(settings as any);
    settings.getSecret.mockResolvedValue('TOKEN');
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => jest.restoreAllMocks());

  const TELEGRAM = {
    siteUrl: 'https://ornek.com',
    autoShareTelegram: 'on',
    telegramChatId: '@kanal',
  };

  it('site ucu görsel dönmezse haberin ham kapağına düşer', async () => {
    settings.getAll.mockResolvedValue(TELEGRAM);
    yoklama(['https://cdn.example.com/kapak.jpg']);

    await servis.paylas('t1', HABER);

    const [adres, secenekler] = istekler()[0];
    expect(adres).toContain('/sendPhoto');
    expect(JSON.parse(secenekler.body).photo).toBe(
      'https://cdn.example.com/kapak.jpg',
    );
  });

  it('hiçbir görsel yoksa telegram metin gönderisi atar — haber yine kanala düşer', async () => {
    settings.getAll.mockResolvedValue(TELEGRAM);
    yoklama([]);

    await servis.paylas('t1', { ...HABER, featuredImage: null });

    expect(istekler()).toHaveLength(1);
    const [adres, secenekler] = istekler()[0];
    expect(adres).toBe('https://api.telegram.org/botTOKEN/sendMessage');
    const govde = JSON.parse(secenekler.body);
    expect(govde.chat_id).toBe('@kanal');
    expect(govde.text).toContain('https://ornek.com/haber/ornek-baslik');
  });

  it('sendPhoto reddedilirse metin gönderisine düşülür', async () => {
    settings.getAll.mockResolvedValue(TELEGRAM);
    yoklama(
      ['https://ornek.com/api/social-image/ornek-baslik'],
      jest.fn((adres: string) =>
        Promise.resolve(
          adres.endsWith('/sendPhoto')
            ? {
                ok: false,
                status: 400,
                json: async () => ({
                  ok: false,
                  description: 'wrong file identifier',
                }),
              }
            : { ok: true, status: 200, json: async () => ({ ok: true }) },
        ),
      ),
    );

    await servis.paylas('t1', HABER);

    expect(istekler().map(([a]) => String(a))).toEqual([
      'https://api.telegram.org/botTOKEN/sendPhoto',
      'https://api.telegram.org/botTOKEN/sendMessage',
    ]);
  });

  it('facebook görselsizken bağlantı gönderisi atar', async () => {
    settings.getAll.mockResolvedValue({
      siteUrl: 'https://ornek.com',
      autoShareFacebook: 'on',
      facebookPageId: '12345',
    });
    yoklama([]);

    await servis.paylas('t1', { ...HABER, featuredImage: null });

    const [adres, secenekler] = istekler()[0];
    expect(adres).toBe('https://graph.facebook.com/v25.0/12345/feed');
    const govde = Object.fromEntries(
      (secenekler.body as URLSearchParams).entries(),
    );
    expect(govde.link).toBe('https://ornek.com/haber/ornek-baslik');
    expect(govde.message).toBe('Örnek Başlık');
  });

  it('instagram görselsiz gönderi kabul etmediği için atlanır', async () => {
    settings.getAll.mockResolvedValue({
      siteUrl: 'https://ornek.com',
      autoShareInstagram: 'on',
      instagramUserId: '999',
    });
    yoklama([]);

    await servis.paylas('t1', { ...HABER, featuredImage: null });

    expect(istekler()).toHaveLength(0);
  });

  it('HEAD desteklenmeyen adreste GET ile doğrular', async () => {
    settings.getAll.mockResolvedValue(TELEGRAM);
    fetchMock = jest
      .fn()
      .mockImplementation((adres: string, secenekler?: any) => {
        if (secenekler?.method === 'HEAD') {
          return Promise.resolve({
            ok: false,
            status: 405,
            headers: new Headers(),
          });
        }
        if (secenekler?.method === 'GET') {
          return Promise.resolve({ ...GORSEL_YANITI });
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({ ok: true }),
        });
      });
    global.fetch = fetchMock as any;

    await servis.paylas('t1', HABER);

    const gonderi = fetchMock.mock.calls.find(([a]) =>
      String(a).includes('api.telegram.org'),
    );
    expect(String(gonderi?.[0])).toContain('/sendPhoto');
  });
});

/**
 * HABER BAZINDA AĞ SEÇİMİ — panelde haber formundaki kutucuklar.
 *
 * Kritik iddia: ayarlarda açık olsa bile SEÇİLMEYEN ağa istek gitmez;
 * seçim hiç gönderilmemişse (eski kayıtlar, RSS içe aktarımı) davranış
 * eskisi gibi kalır.
 */
describe('SocialShareService — haber bazında ağ seçimi', () => {
  const HABER = {
    id: 'h1',
    title: 'Örnek Başlık',
    slug: 'ornek-baslik',
    type: 'NEWS',
    featuredImage: 'https://cdn.example.com/kapak.jpg',
  };

  let settings: { getAll: jest.Mock; getSecret: jest.Mock };
  let servis: SocialShareService;
  let fetchMock: jest.Mock;

  const HEPSI_ACIK = {
    siteUrl: 'https://ornek.com',
    autoShareTelegram: 'on',
    telegramChatId: '@kanal',
    autoShareFacebook: 'on',
    facebookPageId: '12345',
  };

  beforeEach(() => {
    settings = { getAll: jest.fn(), getSecret: jest.fn() };
    servis = new SocialShareService(settings as any);
    fetchMock = varsayilanFetch();
    global.fetch = fetchMock as any;
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
    settings.getAll.mockResolvedValue(HEPSI_ACIK);
    settings.getSecret.mockResolvedValue('TOKEN');
  });

  afterEach(() => jest.restoreAllMocks());

  const gidilenAdresler = () => fetchMock.mock.calls.map((c) => String(c[0]));

  it('seçim yoksa açık olan tüm ağlara gider (eski davranış)', async () => {
    await servis.paylas('t1', HABER);
    const adresler = gidilenAdresler();
    expect(adresler.some((a) => a.includes('api.telegram.org'))).toBe(true);
    expect(adresler.some((a) => a.includes('/12345/photos'))).toBe(true);
  });

  it('yalnızca seçilen ağa gider — açık olan diğeri atlanır', async () => {
    await servis.paylas('t1', { ...HABER, shareTargets: ['telegram'] });
    const adresler = gidilenAdresler();
    expect(adresler.some((a) => a.includes('api.telegram.org'))).toBe(true);
    expect(adresler.some((a) => a.includes('/12345/photos'))).toBe(false);
  });

  it('boş seçim hiçbir ağa gitmez — görsel bile yoklanmaz', async () => {
    await servis.paylas('t1', { ...HABER, shareTargets: [] });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('seçili ama ayarlarda KAPALI ağa gitmez', async () => {
    settings.getAll.mockResolvedValue({
      ...HEPSI_ACIK,
      autoShareTelegram: 'off',
      autoShareFacebook: 'off',
    });
    await servis.paylas('t1', { ...HABER, shareTargets: ['telegram'] });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
