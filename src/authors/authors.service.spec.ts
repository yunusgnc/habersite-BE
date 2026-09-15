import { AuthorsService } from './authors.service';

/**
 * Yazar grupları ve yazı sayıları.
 *
 * Kritik iddialar: sayılar yalnızca YAYINDAKİ haber/makaleden gelir ve tek
 * sorguda hesaplanır; vitrin grup seçimini uygular, seçim boşsa eskisi gibi
 * bütün yazarları getirir.
 */
describe('AuthorsService — gruplar ve yazı sayıları', () => {
  let prisma: {
    author: { findMany: jest.Mock };
    article: { groupBy: jest.Mock; findFirst: jest.Mock };
  };
  let servis: AuthorsService;

  beforeEach(() => {
    prisma = {
      author: { findMany: jest.fn() },
      article: { groupBy: jest.fn(), findFirst: jest.fn() },
    };
    servis = new AuthorsService(
      prisma as any,
      {
        revalidateTenant: jest.fn(),
      } as any,
    );
  });

  it('listede her yazara haber ve makale sayısı eklenir', async () => {
    prisma.author.findMany.mockResolvedValue([
      { id: 'a1', name: 'Ayşe', group: 'STAFF' },
      { id: 'a2', name: 'Mehmet', group: 'GUEST' },
    ]);
    prisma.article.groupBy.mockResolvedValue([
      { authorId: 'a1', type: 'NEWS', _count: { _all: 12 } },
      { authorId: 'a1', type: 'COLUMN', _count: { _all: 4 } },
      { authorId: 'a2', type: 'COLUMN', _count: { _all: 1 } },
    ]);

    const sonuc = await servis.findAll('t1');

    expect(sonuc).toEqual([
      expect.objectContaining({ id: 'a1', newsCount: 12, columnCount: 4 }),
      expect.objectContaining({ id: 'a2', newsCount: 0, columnCount: 1 }),
    ]);
  });

  it('yazısı olmayan yazar sıfır sayıyla gelir, eksik alanla değil', async () => {
    prisma.author.findMany.mockResolvedValue([{ id: 'a3', name: 'Yeni' }]);
    prisma.article.groupBy.mockResolvedValue([]);

    const [yazar] = await servis.findAll('t1');

    expect(yazar).toMatchObject({ newsCount: 0, columnCount: 0 });
  });

  it('sayılar yalnızca yayındaki haber ve makaleden hesaplanır', async () => {
    prisma.author.findMany.mockResolvedValue([]);
    prisma.article.groupBy.mockResolvedValue([]);

    await servis.findAll('t1');

    const { where } = prisma.article.groupBy.mock.calls[0][0];
    expect(where).toMatchObject({
      tenantId: 't1',
      status: 'PUBLISHED',
      type: { in: ['NEWS', 'COLUMN'] },
    });
  });

  it('vitrin seçilen gruplara göre süzülür', async () => {
    prisma.author.findMany.mockResolvedValue([]);

    await servis.findWithLatest('t1', 12, ['STAFF', 'GUEST'] as any);

    expect(prisma.author.findMany.mock.calls[0][0].where).toMatchObject({
      tenantId: 't1',
      active: true,
      group: { in: ['STAFF', 'GUEST'] },
    });
  });

  it('grup seçimi boşsa bütün gruplar gelir (eski davranış)', async () => {
    prisma.author.findMany.mockResolvedValue([]);

    await servis.findWithLatest('t1', 12, []);

    expect(prisma.author.findMany.mock.calls[0][0].where).not.toHaveProperty(
      'group',
    );
  });

  it('oluştururken seçilen grup kaydedilir', async () => {
    const create = jest.fn().mockResolvedValue({ id: 'a9' });
    (prisma as any).author.create = create;
    (prisma as any).author.findUnique = jest.fn().mockResolvedValue(null);

    await servis.create('t1', { name: 'Misafir', group: 'GUEST' } as any);

    expect(create.mock.calls[0][0].data).toMatchObject({ group: 'GUEST' });
  });

  it('vitrin kartında grup ve sayılar da döner', async () => {
    prisma.author.findMany.mockResolvedValue([
      { id: 'a1', name: 'Ayşe', slug: 'ayse', group: 'OTHER' },
    ]);
    prisma.article.groupBy.mockResolvedValue([
      { authorId: 'a1', type: 'COLUMN', _count: { _all: 7 } },
    ]);
    prisma.article.findFirst.mockResolvedValue({
      id: 'y1',
      title: 'Son yazı',
      publishedAt: new Date('2026-09-01'),
    });

    const [kart] = await servis.findWithLatest('t1');

    expect(kart).toMatchObject({
      group: 'OTHER',
      columnCount: 7,
      newsCount: 0,
      latestArticle: { title: 'Son yazı' },
    });
    // Sayı sorgusu yalnızca vitrindeki yazarlarla sınırlı.
    expect(prisma.article.groupBy.mock.calls[0][0].where.authorId).toEqual({
      in: ['a1'],
    });
  });
});
