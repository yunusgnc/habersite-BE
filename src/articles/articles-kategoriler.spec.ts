import { BadRequestException } from '@nestjs/common';
import { ArticlesService } from './articles.service';

/**
 * Çoklu kategori.
 *
 * Kritik iddialar: seçim sırası korunur (ilk kategori ana kategori),
 * tekrarlar atılır, başka siteye ait kategori reddedilir; toplu kategori
 * değişikliği yalnızca isteği yapan sitenin haberlerine dokunur.
 */
describe('ArticlesService — çoklu kategori', () => {
  let prisma: any;
  let revalidation: { revalidateTenant: jest.Mock };
  let servis: ArticlesService;

  beforeEach(() => {
    prisma = {
      category: { count: jest.fn() },
      article: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest
          .fn()
          .mockResolvedValue({ id: 'h1', title: 'T', status: 'DRAFT' }),
        update: jest
          .fn()
          .mockResolvedValue({ id: 'h1', title: 'T', status: 'DRAFT' }),
      },
      articleCategory: {
        deleteMany: jest.fn().mockReturnValue('sil'),
        createMany: jest.fn().mockReturnValue('ekle'),
      },
      articleRevision: { create: jest.fn() },
      tag: { upsert: jest.fn() },
      $transaction: jest.fn().mockResolvedValue([{ count: 2 }, { count: 2 }]),
    };
    revalidation = { revalidateTenant: jest.fn() };
    servis = new ArticlesService(
      prisma,
      { log: jest.fn() } as any,
      revalidation as any,
      { paylas: jest.fn() } as any,
    );
    // Slug üretimi bu testin konusu değil.
    jest.spyOn(servis as any, 'generateUniqueSlug').mockResolvedValue('baslik');
  });

  it('haber birden çok kategoriyle oluşturulur, ilk seçilen ana kategori olur', async () => {
    prisma.category.count.mockResolvedValue(2);

    await servis.create('site-a', 'u1', {
      title: 'Başlık',
      content: '',
      categoryIds: ['gundem', 'spor', 'gundem'],
    } as any);

    expect(prisma.category.count).toHaveBeenCalledWith({
      where: { tenantId: 'site-a', id: { in: ['gundem', 'spor'] } },
    });
    const veri = prisma.article.create.mock.calls[0][0].data;
    expect(veri.categories.create).toEqual([
      { categoryId: 'gundem', primary: true },
      { categoryId: 'spor', primary: false },
    ]);
  });

  it('başka siteye ait kategori reddedilir ve haber kaydedilmez', async () => {
    prisma.category.count.mockResolvedValue(1);

    await expect(
      servis.create('site-a', 'u1', {
        title: 'Başlık',
        content: '',
        categoryIds: ['gundem', 'baska-sitenin-kategorisi'],
      } as any),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.article.create).not.toHaveBeenCalled();
  });

  it('güncellemede kategori gönderilmezse mevcut kategorilere dokunulmaz', async () => {
    jest.spyOn(servis, 'findById').mockResolvedValue({
      id: 'h1',
      createdById: 'u1',
      status: 'DRAFT',
    } as any);

    await servis.update(
      'site-a',
      'h1',
      { seoTitle: 'x' } as any,
      'u1',
      'ADMIN',
    );

    expect(prisma.category.count).not.toHaveBeenCalled();
    expect(
      prisma.article.update.mock.calls[0][0].data.categories,
    ).toBeUndefined();
  });

  it('güncellemede boş liste tüm kategorileri kaldırır', async () => {
    jest.spyOn(servis, 'findById').mockResolvedValue({
      id: 'h1',
      createdById: 'u1',
      status: 'DRAFT',
    } as any);

    await servis.update(
      'site-a',
      'h1',
      { categoryIds: [] } as any,
      'u1',
      'ADMIN',
    );

    expect(prisma.article.update.mock.calls[0][0].data.categories).toEqual({
      deleteMany: {},
      create: [],
    });
  });

  it('toplu kategori değişikliği yalnızca bu sitenin haberlerine uygulanır', async () => {
    prisma.category.count.mockResolvedValue(1);
    prisma.article.findMany.mockResolvedValue([{ id: 'h1' }, { id: 'h2' }]);

    await servis.bulkUpdateCategory(
      'site-a',
      ['h1', 'h2', 'baska-sitenin-haberi'],
      'spor',
    );

    expect(prisma.article.findMany).toHaveBeenCalledWith({
      where: {
        tenantId: 'site-a',
        id: { in: ['h1', 'h2', 'baska-sitenin-haberi'] },
      },
      select: { id: true },
    });
    expect(prisma.articleCategory.deleteMany).toHaveBeenCalledWith({
      where: { articleId: { in: ['h1', 'h2'] } },
    });
    expect(prisma.articleCategory.createMany).toHaveBeenCalledWith({
      data: [
        { articleId: 'h1', categoryId: 'spor', primary: true },
        { articleId: 'h2', categoryId: 'spor', primary: true },
      ],
    });
  });
});

describe('ArticlesService — yazar filtresi', () => {
  it('virgülle ayrılmış yazar kimlikleri tekrarsız ve kiracı içinde süzülür', async () => {
    const prisma: any = {
      article: {
        findMany: jest.fn().mockResolvedValue([]),
        count: jest.fn().mockResolvedValue(0),
      },
    };
    const servis = new ArticlesService(prisma, {} as any, {} as any, {} as any);

    await servis.findAll('site-a', {
      type: 'COLUMN',
      authorIds: ' y1, y2 ,y1,, ',
      limit: 8,
    } as any);

    const where = prisma.article.findMany.mock.calls[0][0].where;
    expect(where).toMatchObject({
      tenantId: 'site-a',
      type: 'COLUMN',
      authorId: { in: ['y1', 'y2'] },
    });
  });

  it('boş yazar listesi filtre uygulamaz', async () => {
    const prisma: any = {
      article: {
        findMany: jest.fn().mockResolvedValue([]),
        count: jest.fn().mockResolvedValue(0),
      },
    };
    const servis = new ArticlesService(prisma, {} as any, {} as any, {} as any);
    await servis.findAll('site-a', { authorIds: '' } as any);
    expect(
      prisma.article.findMany.mock.calls[0][0].where.authorId,
    ).toBeUndefined();
  });
});
