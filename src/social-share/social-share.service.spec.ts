import { Logger } from '@nestjs/common';
import { SocialShareService } from './social-share.service';

/**
 * Ağa hiç çıkmadan sözleşmeyi sınar: hangi ayarda hangi uca ne gönderilir,
 * kapalıyken hiçbir istek atılmaz ve ağ hatası asla dışarı sızmaz
 * (paylaşım yayını bloklayamaz — servisin bir numaralı kuralı).
 */
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

  beforeEach(() => {
    delete process.env.META_GRAPH_VERSION;
    settings = { getAll: jest.fn(), getSecret: jest.fn(), upsert: jest.fn() };
    servis = new SocialShareService(settings as any);
    fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ok: true, id: 'kap-1' }),
    });
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

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [adres, secenekler] = fetchMock.mock.calls[0];
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

    const [adres, secenekler] = fetchMock.mock.calls[0];
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

    const [adres, secenekler] = fetchMock.mock.calls[0];
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

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][0]).toBe(
      'https://graph.facebook.com/v25.0/999/media',
    );
    expect(
      Object.fromEntries(
        (fetchMock.mock.calls[0][1].body as URLSearchParams).entries(),
      ).image_url,
    ).toBe('https://ornek.com/api/social-image/ornek-baslik');
    expect(fetchMock.mock.calls[1][0]).toBe(
      'https://graph.facebook.com/v25.0/999/media_publish',
    );
    expect(
      Object.fromEntries(
        (fetchMock.mock.calls[1][1].body as URLSearchParams).entries(),
      ).creation_id,
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
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const govde = Object.fromEntries(
      (fetchMock.mock.calls[0][1].body as URLSearchParams).entries(),
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

    expect(fetchMock.mock.calls[0][0]).toBe(
      'https://ornek.com/api/social-image/ornek-baslik',
    );
    expect(fetchMock.mock.calls[1][0]).toBe('https://api.x.com/2/media/upload');
    expect(fetchMock.mock.calls[2][0]).toBe('https://api.x.com/2/tweets');
    const post = JSON.parse(fetchMock.mock.calls[2][1].body);
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

    expect(fetchMock.mock.calls[0][0]).toBe('https://api.x.com/2/oauth2/token');
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe(
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
    expect(fetchMock.mock.calls[2][1].headers.Authorization).toBe(
      'Bearer YENI_TOKEN',
    );
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
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
