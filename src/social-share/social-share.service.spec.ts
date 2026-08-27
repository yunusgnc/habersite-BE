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

  let settings: { getAll: jest.Mock; getSecret: jest.Mock };
  let servis: SocialShareService;
  let fetchMock: jest.Mock;

  beforeEach(() => {
    settings = { getAll: jest.fn(), getSecret: jest.fn() };
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
    settings.getAll.mockResolvedValue({ autoShareTelegram: 'on', telegramChatId: '@kanal' });
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
    expect(govde.photo).toBe(HABER.featuredImage);
    expect(govde.caption).toContain('https://ornek.com/haber/ornek-baslik');
  });

  it('telegram: görselsiz haber sendMessage ile gider, makale /makale yoluna', async () => {
    settings.getAll.mockResolvedValue({
      siteUrl: 'https://ornek.com',
      autoShareTelegram: 'on',
      telegramChatId: '@kanal',
    });
    settings.getSecret.mockResolvedValue('BOT_TOKEN');

    await servis.paylas('t1', { ...HABER, type: 'COLUMN', featuredImage: null });

    const [adres, secenekler] = fetchMock.mock.calls[0];
    expect(adres).toBe('https://api.telegram.org/botBOT_TOKEN/sendMessage');
    expect(JSON.parse(secenekler.body).text).toContain('/makale/ornek-baslik');
  });

  it('facebook: sayfa akışına message+link gönderir', async () => {
    settings.getAll.mockResolvedValue({
      siteUrl: 'https://ornek.com',
      autoShareFacebook: 'on',
      facebookPageId: '12345',
    });
    settings.getSecret.mockResolvedValue('FB_TOKEN');

    await servis.paylas('t1', HABER);

    const [adres, secenekler] = fetchMock.mock.calls[0];
    expect(adres).toBe('https://graph.facebook.com/v19.0/12345/feed');
    const govde = JSON.parse(secenekler.body);
    expect(govde).toMatchObject({
      message: HABER.title,
      link: 'https://ornek.com/haber/ornek-baslik',
      access_token: 'FB_TOKEN',
    });
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
    expect(fetchMock.mock.calls[0][0]).toBe('https://graph.facebook.com/v19.0/999/media');
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).image_url).toBe(HABER.featuredImage);
    expect(fetchMock.mock.calls[1][0]).toBe('https://graph.facebook.com/v19.0/999/media_publish');
    expect(JSON.parse(fetchMock.mock.calls[1][1].body).creation_id).toBe('kap-1');
  });

  it('instagram: görselsiz haberde hiç istek atmaz (IG görselsiz kabul etmiyor)', async () => {
    settings.getAll.mockResolvedValue({
      siteUrl: 'https://ornek.com',
      autoShareInstagram: 'on',
      instagramUserId: '999',
    });
    settings.getSecret.mockResolvedValue('IG_TOKEN');

    await servis.paylas('t1', { ...HABER, featuredImage: '/goreli/yol.jpg' });
    expect(fetchMock).not.toHaveBeenCalled();
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
