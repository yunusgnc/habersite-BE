import { Logger } from '@nestjs/common';
import { SocialShareService } from './social-share.service';

/**
 * PAYLAŞIM KAYDI — panelde kullanıcı başına paylaşım sayımını bu besliyor.
 *
 * Kritik iddialar: gerçekten gönderilen ağ `success: true` yazılır, reddedilen
 * ağ `success: false` olarak kaydedilir (sayıma girmez ama tanı için durur),
 * kapalı/kurulumsuz ağ HİÇ satır üretmez (sayımı şişirmemeli) ve kayıt yazımı
 * patlasa bile paylaşım hata fırlatmaz.
 */
describe('SocialShareService — paylaşım kaydı', () => {
  let settings: any;
  let prisma: any;
  let createMany: jest.Mock;
  let servis: SocialShareService;

  const HABER = {
    id: 'h1',
    title: 'Başlık',
    slug: 'baslik',
    type: 'NEWS',
    featuredImage: null,
    shareTargets: null,
  };

  /** Kaydedilen satırları ağ adına göre haritalar. */
  const satirlar = () => {
    const veri = createMany.mock.calls[0]?.[0]?.data ?? [];
    return new Map<string, { success: boolean }>(
      veri.map((s: any) => [s.network, s]),
    );
  };

  beforeEach(() => {
    createMany = jest.fn().mockResolvedValue({ count: 0 });
    prisma = { socialShareLog: { createMany } };
    settings = {
      getAll: jest.fn().mockResolvedValue({
        siteUrl: 'https://ornek.com',
        // Yalnızca Telegram ve Facebook açık; Instagram ve X kapalı.
        autoShareTelegram: 'on',
        autoShareFacebook: 'on',
        telegramChatId: '@kanal',
        facebookPageId: '1234',
      }),
      getSecret: jest.fn().mockResolvedValue('gizli'),
    };
    servis = new SocialShareService(settings as any, prisma as any);
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
    // Görsel yoklaması ağa çıkmasın; metin gönderisi yolunu kullanıyoruz.
    jest
      .spyOn(servis as any, 'gorselAdresi')
      .mockResolvedValue(null as unknown as string | null);
  });

  afterEach(() => jest.restoreAllMocks());

  it('gönderilen ağ başarılı, kapalı ağlar hiç yazılmaz', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ok: true, id: '1' }),
    }) as any;

    await servis.paylas('t1', HABER, 'u1');

    const kayit = satirlar();
    expect([...kayit.keys()].sort()).toEqual(['facebook', 'telegram']);
    expect(kayit.get('telegram')?.success).toBe(true);
    expect(kayit.get('facebook')?.success).toBe(true);
  });

  it('kayıt kullanıcıyla ve haberle eşleşir', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ok: true, id: '1' }),
    }) as any;

    await servis.paylas('t1', HABER, 'u1');

    expect(createMany.mock.calls[0][0].data[0]).toMatchObject({
      tenantId: 't1',
      userId: 'u1',
      articleId: 'h1',
    });
  });

  it('reddedilen gönderi başarısız olarak kaydedilir', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 403,
      json: async () => ({ error: { message: 'izin yok' } }),
    }) as any;

    await servis.paylas('t1', HABER, 'u1');

    const kayit = satirlar();
    expect(kayit.get('telegram')?.success).toBe(false);
    expect(kayit.get('facebook')?.success).toBe(false);
  });

  it('haberin ağ seçimi dışındaki ağ yazılmaz', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ok: true, id: '1' }),
    }) as any;

    await servis.paylas('t1', { ...HABER, shareTargets: ['telegram'] }, 'u1');

    expect([...satirlar().keys()]).toEqual(['telegram']);
  });

  it('kullanıcısız (zamanlanmış) gönderimde userId null yazılır', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ok: true, id: '1' }),
    }) as any;

    await servis.paylas('t1', HABER);

    expect(createMany.mock.calls[0][0].data[0].userId).toBeNull();
  });

  it('kayıt yazımı patlasa bile paylaşım hata fırlatmaz', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ok: true, id: '1' }),
    }) as any;
    createMany.mockRejectedValue(new Error('tablo yok'));

    await expect(servis.paylas('t1', HABER, 'u1')).resolves.toBeUndefined();
  });

  it('hiçbir ağ açık değilse kayıt hiç çağrılmaz', async () => {
    settings.getAll.mockResolvedValue({ siteUrl: 'https://ornek.com' });
    global.fetch = jest.fn() as any;

    await servis.paylas('t1', HABER, 'u1');

    expect(createMany).not.toHaveBeenCalled();
  });
});
