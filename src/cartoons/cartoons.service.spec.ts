import { CartoonsService } from './cartoons.service';

/**
 * Karikatür servisi.
 *
 * Kritik iddialar: yayın tarihi gelecekte olan kayıt sitede görünmez; boş
 * gönderilen metin alanları boş string olarak DEĞİL null olarak saklanır
 * (panel silinen çizer adını boş string gönderiyor); önceki/sonraki
 * gezintisi aynı saniyede yayınlanmış kayıtlarda da tek yön veriyor.
 */
describe('CartoonsService', () => {
  let prisma: {
    cartoon: {
      findMany: jest.Mock;
      findFirst: jest.Mock;
      count: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
      groupBy: jest.Mock;
    };
  };
  let revalidation: { revalidateTenant: jest.Mock };
  let servis: CartoonsService;

  beforeEach(() => {
    prisma = {
      cartoon: {
        findMany: jest.fn().mockResolvedValue([]),
        findFirst: jest.fn().mockResolvedValue(null),
        count: jest.fn().mockResolvedValue(0),
        create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'k1', ...data })),
        update: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'k1', ...data })),
        delete: jest.fn().mockResolvedValue({}),
        groupBy: jest.fn().mockResolvedValue([]),
      },
    };
    revalidation = { revalidateTenant: jest.fn() };
    servis = new CartoonsService(prisma as any, revalidation as any);
  });

  it('site listesi yalnızca aktif ve yayın tarihi gelmiş kayıtları ister', async () => {
    await servis.findPublic('t1', { limit: 10 });

    const where = prisma.cartoon.findMany.mock.calls[0][0].where;
    expect(where).toMatchObject({ tenantId: 't1', active: true });
    expect(where.publishedAt.lte).toBeInstanceOf(Date);
  });

  it('sayfa verilirse cursor değil offset kullanılır ve nextCursor boş döner', async () => {
    prisma.cartoon.findMany.mockResolvedValue([{ id: 'k1' }, { id: 'k2' }]);
    prisma.cartoon.count.mockResolvedValue(50);

    const sonuc = await servis.findPublic('t1', { limit: 2, page: 3 });

    expect(prisma.cartoon.findMany.mock.calls[0][0].skip).toBe(4);
    expect(prisma.cartoon.findMany.mock.calls[0][0].cursor).toBeUndefined();
    expect(sonuc.nextCursor).toBeNull();
    expect(sonuc.totalPages).toBe(25);
  });

  it('limit tavanı 60, tabanı 1; verilmezse 24', async () => {
    // take her zaman limit+1: fazlası "sonraki sayfa var mı" sorusunu
    // ikinci bir count sorgusu atmadan cevaplıyor.
    await servis.findPublic('t1', { limit: 500 });
    expect(prisma.cartoon.findMany.mock.calls[0][0].take).toBe(61);

    prisma.cartoon.findMany.mockClear();
    await servis.findPublic('t1', { limit: 0 });
    expect(prisma.cartoon.findMany.mock.calls[0][0].take).toBe(2);

    prisma.cartoon.findMany.mockClear();
    await servis.findPublic('t1');
    expect(prisma.cartoon.findMany.mock.calls[0][0].take).toBe(25);
  });

  it('cursor sayfalamasında imleç DÖNDÜRÜLEN son kayıt olur', async () => {
    // limit+1 çekiliyor; fazlası atılıyor. İmleç atılan kayıt olursa o
    // kayıt sonraki sayfada hepten kayboluyor (haber listesinde yaşandı).
    prisma.cartoon.findMany.mockResolvedValue([{ id: 'k1' }, { id: 'k2' }, { id: 'k3' }]);

    const sonuc = await servis.findPublic('t1', { limit: 2 });

    expect(sonuc.data.map((k: any) => k.id)).toEqual(['k1', 'k2']);
    expect(sonuc.nextCursor).toBe('k2');
  });

  it('kayıt yoksa 404 atar', async () => {
    await expect(servis.findBySlug('t1', 'yok')).rejects.toThrow('Cartoon not found');
  });

  it('boş metin alanları null olarak saklanır', async () => {
    const olusan = await servis.create('t1', {
      title: '  Günün Karikatürü  ',
      image: ' /assets/k.png ',
      artist: '',
      caption: '',
      imageAlt: '',
      seoTitle: '',
      seoDesc: '',
    });

    expect(olusan).toMatchObject({
      title: 'Günün Karikatürü',
      image: '/assets/k.png',
      artist: null,
      caption: null,
      imageAlt: null,
      seoTitle: null,
      seoDesc: null,
    });
  });

  it('başlıktan Türkçe slug üretir ve çakışmada son ek verir', async () => {
    const ilk = await servis.create('t1', { title: 'Çizgiyle Gündem', image: '/a.png' });
    expect(ilk.slug).toBe('cizgiyle-gundem');

    prisma.cartoon.findFirst.mockResolvedValue({ id: 'baska' });
    const ikinci = await servis.create('t1', { title: 'Çizgiyle Gündem', image: '/a.png' });
    expect(ikinci.slug).toMatch(/^cizgiyle-gundem-.+/);
  });

  it('güncellemede başlık değişse bile slug korunur', async () => {
    prisma.cartoon.findFirst.mockResolvedValue({ id: 'k1', slug: 'eski-adres' });

    await servis.update('t1', 'k1', { title: 'Yeni Başlık' });

    expect(prisma.cartoon.update.mock.calls[0][0].data.slug).toBeUndefined();
  });

  it('gönderilmeyen alan güncellemede undefined kalır, null olmaz', async () => {
    prisma.cartoon.findFirst.mockResolvedValue({ id: 'k1', slug: 'adres' });

    await servis.update('t1', 'k1', { active: false });

    const data = prisma.cartoon.update.mock.calls[0][0].data;
    expect(data.artist).toBeUndefined();
    expect(data.caption).toBeUndefined();
    expect(data.active).toBe(false);
  });

  it('yazma işlemleri site önbelleğini tazeler', async () => {
    await servis.create('t1', { title: 'Karikatür', image: '/a.png' });
    expect(revalidation.revalidateTenant).toHaveBeenCalledWith('t1', ['cartoons']);
  });

  it('komşu sorgusu aynı yayın anındaki kayıtları id ile ayırır', async () => {
    const anI = new Date('2026-09-25T09:00:00.000Z');
    prisma.cartoon.findFirst.mockResolvedValueOnce({ id: 'k5', publishedAt: anI });

    await servis.neighbours('t1', 'bugun');

    // İlk çağrı geçerli kaydı bulur; sonraki ikisi önceki/sonraki.
    const onceki = prisma.cartoon.findFirst.mock.calls[1][0];
    const sonraki = prisma.cartoon.findFirst.mock.calls[2][0];
    expect(onceki.where.OR).toEqual([
      { publishedAt: { lt: anI } },
      { publishedAt: anI, id: { lt: 'k5' } },
    ]);
    expect(sonraki.where.OR).toEqual([
      { publishedAt: { gt: anI } },
      { publishedAt: anI, id: { gt: 'k5' } },
    ]);
  });

  it('karikatür yoksa komşu gezintisi boş döner, hata atmaz', async () => {
    await expect(servis.neighbours('t1', 'yok')).resolves.toEqual({
      previous: null,
      next: null,
    });
  });

  it('çizer listesi adı olmayan kayıtları düşürür', async () => {
    prisma.cartoon.groupBy.mockResolvedValue([
      { artist: 'İ. Bülent Çelik', _count: { _all: 12 } },
      { artist: null, _count: { _all: 3 } },
    ]);

    await expect(servis.artists('t1')).resolves.toEqual([
      { name: 'İ. Bülent Çelik', count: 12 },
    ]);
  });
});
