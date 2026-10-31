import { UsersService } from './users.service';

/**
 * PAYLAŞILAN HABER SAYIMI — Kullanıcılar ekranındaki kolon.
 *
 * Kritik iddialar: sayım haberlerden gelir (gönderim kaydından değil), böylece
 * kayıt tablosu eklenmeden önceki geçmiş de görünür; haber başına BİR sayılır;
 * gün penceresi istenen aralığı üretir; sayfadaki kullanıcı yoksa sorgu
 * sürülmez.
 */
describe('UsersService — paylaşılan haber sayımı', () => {
  let prisma: any;
  let servis: UsersService;

  const kullanicilar = [
    { id: 'u1', name: 'A', role: 'EDITOR' },
    { id: 'u2', name: 'B', role: 'REPORTER' },
  ];

  beforeEach(() => {
    prisma = {
      user: {
        count: jest.fn().mockResolvedValue(kullanicilar.length),
        findMany: jest.fn().mockResolvedValue(kullanicilar),
      },
      article: { groupBy: jest.fn().mockResolvedValue([]) },
      socialShareLog: { groupBy: jest.fn() },
    };
    servis = new UsersService(prisma);
  });

  /** groupBy iki kez çağrılıyor: toplam yayın ve ağ seçimi boş olanlar. */
  const sayimlar = (toplam: any[], paylasimsiz: any[] = []) => {
    prisma.article.groupBy
      .mockResolvedValueOnce(toplam)
      .mockResolvedValueOnce(paylasimsiz);
  };

  it('sayım haberlerden gelir, gönderim kaydından değil', async () => {
    await servis.findAll('t1');
    expect(prisma.article.groupBy).toHaveBeenCalled();
    // Kayıt tablosu boşken bile geçmiş görünsün diye oradan saymıyoruz.
    expect(prisma.socialShareLog.groupBy).not.toHaveBeenCalled();
  });

  it('ağ seçimi boş bırakılan haber sayılmaz', async () => {
    sayimlar(
      [{ createdById: 'u1', _count: { _all: 10 } }],
      [{ createdById: 'u1', _count: { _all: 4 } }],
    );
    const sonuc: any = await servis.findAll('t1');
    expect(sonuc.items[0].shareCount).toBe(6);
  });

  it('sayılar kullanıcılara eşleşir, sayısı olmayan sıfır alır', async () => {
    sayimlar([{ createdById: 'u1', _count: { _all: 27 } }]);

    const sonuc: any = await servis.findAll('t1');

    expect(sonuc.items[0].shareCount).toBe(27);
    expect(sonuc.items[1].shareCount).toBe(0);
  });

  it('üç ağa giden haber tek sayılır', async () => {
    // Sayım haber satırından geliyor; ağ sayısı sonucu etkilemez.
    sayimlar([{ createdById: 'u1', _count: { _all: 1 } }]);
    const sonuc: any = await servis.findAll('t1');
    expect(sonuc.items[0].shareCount).toBe(1);
  });

  it('gün penceresi yanıtta bildirilir ve sınırlandırılır', async () => {
    expect((await servis.findAll('t1')).shareDays).toBe(30);
    expect((await servis.findAll('t1', { shareDays: 7 })).shareDays).toBe(7);
    // 1–365 dışına taşan değerler kırpılır.
    expect((await servis.findAll('t1', { shareDays: 5000 })).shareDays).toBe(365);
    expect((await servis.findAll('t1', { shareDays: 0 })).shareDays).toBe(30);
  });

  it('sayfada kullanıcı yoksa sayım sorgusu sürülmez', async () => {
    prisma.user.findMany.mockResolvedValue([]);
    prisma.user.count.mockResolvedValue(0);

    await servis.findAll('t1');

    expect(prisma.article.groupBy).not.toHaveBeenCalled();
  });
});
