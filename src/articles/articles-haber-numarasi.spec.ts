import { ArticlesService } from './articles.service';

/**
 * KALICI haber numarası.
 *
 * Kritik iddialar: numara kiracı içindeki en büyük numaranın bir fazlası
 * olarak atanır (ilk haberde 1); eşzamanlı kayıtta unique kısıt tetiklenirse
 * numara yeniden okunup denenir; alakasız hata yutulmaz.
 */
describe('ArticlesService — haber numarası', () => {
  let prisma: any;
  let servis: ArticlesService;

  const prismaHatasi = (code: string, target: string[]) =>
    Object.assign(new Error('unique kısıt'), { code, meta: { target } });

  beforeEach(() => {
    prisma = {
      category: { count: jest.fn() },
      user: { findUnique: jest.fn().mockResolvedValue(null) },
      article: {
        findFirst: jest.fn(),
        aggregate: jest.fn().mockResolvedValue({ _max: { articleNo: null } }),
        create: jest
          .fn()
          .mockResolvedValue({ id: 'h1', title: 'T', slug: 'baslik', status: 'DRAFT' }),
      },
      articleRevision: { create: jest.fn() },
      breakingNews: { upsert: jest.fn(), deleteMany: jest.fn() },
    };
    servis = new ArticlesService(
      prisma,
      { log: jest.fn() } as any,
      { revalidateTenant: jest.fn() } as any,
      { paylas: jest.fn() } as any,
    );
    jest.spyOn(servis as any, 'generateUniqueSlug').mockResolvedValue('baslik');
  });

  const olustur = () =>
    servis.create('t1', 'u1', { title: 'T' } as any, 'EDITOR');

  it('ilk haber 1 numarasını alır', async () => {
    await olustur();
    expect(prisma.article.create.mock.calls[0][0].data.articleNo).toBe(1);
  });

  it('numara mevcut en büyüğün bir fazlasıdır', async () => {
    prisma.article.aggregate.mockResolvedValue({ _max: { articleNo: 45120 } });
    await olustur();
    expect(prisma.article.create.mock.calls[0][0].data.articleNo).toBe(45121);
  });

  it('numara çakışırsa yeniden okuyup dener', async () => {
    // İlk denemede 5 okunur ve reddedilir; ikinci okumada 6 gelir ve geçer.
    prisma.article.aggregate
      .mockResolvedValueOnce({ _max: { articleNo: 5 } })
      .mockResolvedValueOnce({ _max: { articleNo: 6 } });
    prisma.article.create
      .mockRejectedValueOnce(prismaHatasi('P2002', ['tenant_id', 'article_no']))
      .mockResolvedValueOnce({ id: 'h1', title: 'T', slug: 'baslik', status: 'DRAFT' });

    await olustur();

    expect(prisma.article.create).toHaveBeenCalledTimes(2);
    expect(prisma.article.create.mock.calls[0][0].data.articleNo).toBe(6);
    expect(prisma.article.create.mock.calls[1][0].data.articleNo).toBe(7);
  });

  it('başka bir unique çakışması yutulmaz', async () => {
    // Slug çakışması numarayla ilgisizdir; yeniden denemek sorunu saklardı.
    prisma.article.create.mockRejectedValue(
      prismaHatasi('P2002', ['tenant_id', 'slug']),
    );
    await expect(olustur()).rejects.toThrow('unique kısıt');
    expect(prisma.article.create).toHaveBeenCalledTimes(1);
  });

  it('numara dışındaki hatalar olduğu gibi yükselir', async () => {
    prisma.article.create.mockRejectedValue(new Error('bağlantı koptu'));
    await expect(olustur()).rejects.toThrow('bağlantı koptu');
    expect(prisma.article.create).toHaveBeenCalledTimes(1);
  });
});
