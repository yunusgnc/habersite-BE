import { ArticlesService } from './articles.service';

/**
 * AÇILIŞTA haber numarası dolumu.
 *
 * Kritik iddialar: doldurulacak kayıt yoksa tek ucuz sayımla çıkar (her
 * açılışta boşuna SQL sürmez); eksik varsa her kiracı için bir kez sürer;
 * hata panelin açılışını bozmaz.
 */
describe('ArticlesService — açılışta numara dolumu', () => {
  let prisma: any;
  let servis: ArticlesService;

  beforeEach(() => {
    prisma = {
      article: { count: jest.fn().mockResolvedValue(0) },
      tenant: { findMany: jest.fn().mockResolvedValue([]) },
      $executeRaw: jest.fn().mockResolvedValue(0),
    };
    servis = new ArticlesService(
      prisma,
      { log: jest.fn() } as any,
      { revalidateTenant: jest.fn() } as any,
      { paylas: jest.fn() } as any,
    );
  });

  it('eksik kayıt yoksa SQL hiç sürülmez', async () => {
    await servis.haberNumaralariniDoldur();
    expect(prisma.tenant.findMany).not.toHaveBeenCalled();
    expect(prisma.$executeRaw).not.toHaveBeenCalled();
  });

  it('her kiracı için bir kez sürer', async () => {
    prisma.article.count.mockResolvedValue(43988);
    prisma.tenant.findMany.mockResolvedValue([{ id: 't1' }, { id: 't2' }]);
    prisma.$executeRaw.mockResolvedValue(43988);

    await servis.haberNumaralariniDoldur();

    expect(prisma.$executeRaw).toHaveBeenCalledTimes(2);
  });

  it('SQL hatası dışarı sızmaz — açılış bozulmaz', async () => {
    prisma.article.count.mockResolvedValue(10);
    prisma.tenant.findMany.mockResolvedValue([{ id: 't1' }]);
    prisma.$executeRaw.mockRejectedValue(new Error('kolon yok'));

    await expect(servis.haberNumaralariniDoldur()).resolves.toBeUndefined();
  });

  it('sayım hatası da yutulur', async () => {
    prisma.article.count.mockRejectedValue(new Error('bağlantı koptu'));
    await expect(servis.haberNumaralariniDoldur()).resolves.toBeUndefined();
  });
});
