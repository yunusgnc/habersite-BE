import { ArticlesService } from './articles.service';

/**
 * SLUG GÜNCELLEME — adres değişince eskisi 301 için saklanır.
 *
 * Kritik iddialar: panelden gelen slug artık kaydediliyor (eskiden gövdeye hiç
 * konmuyordu, editör adresi düzeltiyor ama adres eski kalıyordu); değer
 * temizlikten geçiyor; haberin kendi slug'ı çakışma sayılmıyor; adres
 * değişince eski slug tarihe yazılıyor ve eski adresin önbelleği düşüyor.
 */
describe('ArticlesService — slug güncelleme', () => {
  let prisma: any;
  let revalidation: any;
  let servis: ArticlesService;

  const MEVCUT = {
    id: 'h1',
    tenantId: 't1',
    slug: 'eski-baslik',
    title: 'Eski başlık',
    status: 'PUBLISHED',
    content: {},
    spot: null,
    seoTitle: null,
    seoDesc: null,
    featuredImage: null,
    createdById: 'u1',
  };

  beforeEach(() => {
    prisma = {
      user: { findUnique: jest.fn().mockResolvedValue(null) },
      article: {
        findUnique: jest.fn().mockResolvedValue(null),
        update: jest.fn().mockImplementation(({ data }: any) =>
          Promise.resolve({
            ...MEVCUT,
            ...data,
            slug: data.slug ?? MEVCUT.slug,
          }),
        ),
      },
      articleRevision: { create: jest.fn() },
      articleSlugHistory: {
        deleteMany: jest.fn(),
        upsert: jest.fn(),
        findUnique: jest.fn(),
      },
      breakingNews: { upsert: jest.fn(), deleteMany: jest.fn() },
      $transaction: jest.fn().mockResolvedValue([]),
    };
    revalidation = { revalidateTenant: jest.fn() };
    servis = new ArticlesService(
      prisma,
      { log: jest.fn() } as any,
      revalidation as any,
      { paylas: jest.fn() } as any,
    );
    jest.spyOn(servis as any, 'findById').mockResolvedValue(MEVCUT);
    jest.spyOn(servis as any, 'kategorileriDogrula').mockResolvedValue(undefined);
    jest.spyOn(servis as any, 'sonDakikaGuncelle').mockResolvedValue(undefined);
  });

  const guncelle = (dto: Record<string, unknown>) =>
    servis.update('t1', 'h1', dto as any, 'u1', 'ADMIN');

  const yazilanVeri = () => prisma.article.update.mock.calls[0][0].data;

  it('panelden gelen slug kaydedilir', async () => {
    await guncelle({ slug: 'yeni-baslik' });
    expect(yazilanVeri().slug).toBe('yeni-baslik');
  });

  it('ham değer temizlenir — boşluk ve Türkçe karakter adrese girmez', async () => {
    await guncelle({ slug: 'Yeni Başlık Çıktı' });
    expect(yazilanVeri().slug).toBe('yeni-baslik-cikti');
  });

  it('slug gönderilmezse adrese dokunulmaz', async () => {
    await guncelle({ title: 'Yeni başlık' });
    expect(yazilanVeri().slug).toBeUndefined();
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('boş slug adresi silmez', async () => {
    await guncelle({ slug: '   ' });
    expect(yazilanVeri().slug).toBeUndefined();
  });

  it('haberin kendi slugu çakışma sayılmaz — sona zaman damgası eklenmez', async () => {
    // Aynı slug'ı taşıyan kayıt haberin KENDİSİ.
    prisma.article.findUnique.mockResolvedValue({ id: 'h1' });
    await guncelle({ slug: 'eski-baslik' });
    // Değişmediği için güncellemeye slug hiç yazılmaz.
    expect(yazilanVeri().slug).toBeUndefined();
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('başka haberin slugu istenirse çakışma çözülür', async () => {
    prisma.article.findUnique.mockResolvedValue({ id: 'baska-haber' });
    await guncelle({ slug: 'yeni-baslik' });
    expect(yazilanVeri().slug).toMatch(/^yeni-baslik-\d+$/);
  });

  it('adres değişince eski slug tarihe yazılır', async () => {
    await guncelle({ slug: 'yeni-baslik' });
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(prisma.articleSlugHistory.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { tenantId_slug: { tenantId: 't1', slug: 'eski-baslik' } },
        create: { tenantId: 't1', articleId: 'h1', slug: 'eski-baslik' },
      }),
    );
  });

  it('yeni slug daha önce eski adres olarak kayıtlıysa o satır silinir', async () => {
    // Yoksa adres kendi kendini yönlendirirdi.
    await guncelle({ slug: 'yeni-baslik' });
    expect(prisma.articleSlugHistory.deleteMany).toHaveBeenCalledWith({
      where: { tenantId: 't1', slug: 'yeni-baslik' },
    });
  });

  it('tarih kaydı patlasa bile güncelleme geçerli sayılır', async () => {
    prisma.$transaction.mockRejectedValue(new Error('bağlantı koptu'));
    await expect(guncelle({ slug: 'yeni-baslik' })).resolves.toBeDefined();
  });

  it('adres değişince eski adresin önbelleği de düşer', async () => {
    await guncelle({ slug: 'yeni-baslik' });
    const etiketler = revalidation.revalidateTenant.mock.calls.at(-1)[1];
    expect(etiketler).toContain('article-eski-baslik');
    expect(etiketler).toContain('article-yeni-baslik');
  });
});

describe('ArticlesService — eski adresten güncel slug', () => {
  let prisma: any;
  let servis: ArticlesService;

  const kayitla = (article: unknown) => {
    prisma.articleSlugHistory.findUnique.mockResolvedValue(
      article === null ? null : { slug: 'eski', article },
    );
  };

  beforeEach(() => {
    prisma = { articleSlugHistory: { findUnique: jest.fn() } };
    servis = new ArticlesService(
      prisma,
      { log: jest.fn() } as any,
      { revalidateTenant: jest.fn() } as any,
      { paylas: jest.fn() } as any,
    );
  });

  it('yayındaki haberin güncel slugunu döner', async () => {
    kayitla({ slug: 'yeni', status: 'PUBLISHED' });
    await expect(servis.guncelSlugBul('t1', 'eski')).resolves.toBe('yeni');
  });

  it('kayıt yoksa null', async () => {
    kayitla(null);
    await expect(servis.guncelSlugBul('t1', 'eski')).resolves.toBeNull();
  });

  it('haber yayında değilse yönlendirme yapılmaz', async () => {
    kayitla({ slug: 'yeni', status: 'DRAFT' });
    await expect(servis.guncelSlugBul('t1', 'eski')).resolves.toBeNull();
  });

  it('güncel slug eskisiyle aynıysa null — kendine yönlendirme olmaz', async () => {
    kayitla({ slug: 'eski', status: 'PUBLISHED' });
    await expect(servis.guncelSlugBul('t1', 'eski')).resolves.toBeNull();
  });
});
