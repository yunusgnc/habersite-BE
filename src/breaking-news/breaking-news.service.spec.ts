import {
  BREAKING_NEWS_LIFETIME_MS,
  BreakingNewsService,
} from './breaking-news.service';

describe('BreakingNewsService', () => {
  const prisma = {
    breakingNews: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };
  const revalidation = { revalidateTenant: jest.fn() };
  const service = new BreakingNewsService(prisma as any, revalidation as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('yeni kaydı tam 24 saat sonra sona erecek şekilde oluşturur', async () => {
    prisma.breakingNews.findFirst.mockResolvedValue({ sortOrder: 2 });
    prisma.breakingNews.create.mockImplementation(({ data }) => data);
    const before = Date.now();

    await service.create('tenant-1', {
      title: 'Son dakika',
      url: '/haber/son-dakika',
      // İstemcinin gönderdiği farklı süre iş kuralını değiştirmemeli.
      expiresAt: '2099-01-01T00:00:00.000Z',
    });

    const expiresAt = prisma.breakingNews.create.mock.calls[0][0].data
      .expiresAt as Date;
    expect(expiresAt.getTime()).toBeGreaterThanOrEqual(
      before + BREAKING_NEWS_LIFETIME_MS,
    );
    expect(expiresAt.getTime()).toBeLessThanOrEqual(
      Date.now() + BREAKING_NEWS_LIFETIME_MS,
    );
  });

  it('eski süresiz kayıtları da yalnızca ilk 24 saatte aktif sayar', async () => {
    prisma.breakingNews.findMany.mockResolvedValue([]);
    const before = Date.now();

    await service.findActive('tenant-1');

    const where = prisma.breakingNews.findMany.mock.calls[0][0].where;
    const now = where.OR[0].expiresAt.gt as Date;
    const legacyCutoff = where.OR[1].createdAt.gt as Date;
    expect(now.getTime()).toBeGreaterThanOrEqual(before);
    expect(now.getTime() - legacyCutoff.getTime()).toBe(
      BREAKING_NEWS_LIFETIME_MS,
    );
  });

  it('pasif kayıt yeniden açılırsa yeni bir 24 saatlik süre başlatır', async () => {
    prisma.breakingNews.findFirst.mockResolvedValue({
      id: 'breaking-1',
      tenantId: 'tenant-1',
      active: false,
      expiresAt: new Date('2020-01-01T00:00:00.000Z'),
      createdAt: new Date('2020-01-01T00:00:00.000Z'),
    });
    prisma.breakingNews.update.mockImplementation(({ data }) => data);
    const before = Date.now();

    await service.update('tenant-1', 'breaking-1', { active: true });

    const expiresAt = prisma.breakingNews.update.mock.calls[0][0].data
      .expiresAt as Date;
    expect(expiresAt.getTime()).toBeGreaterThanOrEqual(
      before + BREAKING_NEWS_LIFETIME_MS,
    );
  });
});
