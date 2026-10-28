import { ArticlesService } from './articles.service';

/**
 * Sosyal paylaşım yetkisi.
 *
 * Kritik iddialar: yetkisi kapalı kullanıcının yayınladığı veya zamanladığı
 * haber hiçbir ağa gitmez (seçim boş diziye çekilir, paylaşım çağrılmaz);
 * yetkili kullanıcıda davranış değişmez.
 */
describe('ArticlesService — sosyal paylaşım yetkisi', () => {
  let prisma: any;
  let paylas: jest.Mock;
  let servis: ArticlesService;

  const kullanici = (permissions: unknown) =>
    prisma.user.findUnique.mockResolvedValue({ role: 'EDITOR', permissions });

  beforeEach(() => {
    prisma = {
      category: { count: jest.fn() },
      user: { findUnique: jest.fn() },
      article: {
        findFirst: jest.fn(),
        create: jest.fn().mockResolvedValue({
          id: 'h1',
          title: 'T',
          slug: 'baslik',
          status: 'PUBLISHED',
        }),
        update: jest.fn().mockResolvedValue({
          id: 'h1',
          title: 'T',
          slug: 'baslik',
          status: 'PUBLISHED',
        }),
      },
      articleRevision: { create: jest.fn() },
      breakingNews: {
        upsert: jest.fn().mockResolvedValue({}),
        deleteMany: jest.fn().mockResolvedValue({}),
      },
    };
    paylas = jest.fn();
    servis = new ArticlesService(
      prisma,
      { log: jest.fn() } as any,
      { revalidateTenant: jest.fn() } as any,
      { paylas } as any,
    );
    jest.spyOn(servis as any, 'generateUniqueSlug').mockResolvedValue('baslik');
  });

  it('yetkisi kapalı kullanıcının yayınladığı haber paylaşılmaz', async () => {
    kullanici({ SOCIAL_SHARE: false });
    await servis.create(
      't1',
      'u1',
      { title: 'T', status: 'PUBLISHED', shareTargets: ['x'] } as any,
      'EDITOR',
    );
    expect(prisma.article.create.mock.calls[0][0].data.shareTargets).toEqual([]);
    expect(paylas).not.toHaveBeenCalled();
  });

  it('yetkisi kapalı kullanıcının zamanladığı haberin ağ seçimi boşaltılır', async () => {
    kullanici({ SOCIAL_SHARE: false });
    prisma.article.findFirst.mockResolvedValue({
      id: 'h1',
      status: 'DRAFT',
      scheduledAt: null,
    });
    prisma.article.update.mockResolvedValue({ id: 'h1', slug: 'baslik', status: 'DRAFT' });
    await servis.update(
      't1',
      'h1',
      { scheduledAt: '2026-11-01T10:00:00.000Z' } as any,
      'u1',
      'EDITOR',
    );
    expect(prisma.article.update.mock.calls[0][0].data.shareTargets).toEqual([]);
  });

  it('yetkili kullanıcıda seçim korunur ve paylaşım çalışır', async () => {
    kullanici({});
    await servis.create(
      't1',
      'u1',
      { title: 'T', status: 'PUBLISHED', shareTargets: ['x'] } as any,
      'EDITOR',
    );
    expect(prisma.article.create.mock.calls[0][0].data.shareTargets).toEqual(['x']);
    expect(paylas).toHaveBeenCalled();
  });
});
