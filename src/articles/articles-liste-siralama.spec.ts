import { ArticlesService } from './articles.service';

/**
 * PANEL HABER LİSTESİNİN SIRASI.
 *
 * Kritik iddialar: `sort=number` listeyi haber numarasına (= eklenme sırası)
 * göre azalan döndürür — panelin "No" sütunu ancak böyle kesintisiz görünür;
 * sitenin varsayılan sırası (yayın tarihi) değişmez.
 */
describe('ArticlesService — liste sıralaması', () => {
  let prisma: any;
  let servis: ArticlesService;

  beforeEach(() => {
    prisma = {
      article: {
        findMany: jest.fn().mockResolvedValue([]),
        count: jest.fn().mockResolvedValue(0),
      },
    };
    servis = new ArticlesService(
      prisma,
      { log: jest.fn() } as any,
      { revalidateTenant: jest.fn() } as any,
      { paylas: jest.fn() } as any,
    );
  });

  const siralama = async (sort?: string) => {
    await servis.findAll('t1', { sort, page: 1 } as any);
    return prisma.article.findMany.mock.calls[0][0].orderBy;
  };

  it('sort=number haber numarasına göre azalan sıralar', async () => {
    // Yayın tarihine göre sıralamak, geç yayınlanan/zamanlanan her haberde
    // "No" sütununu karıştırıyordu.
    expect(await siralama('number')).toEqual([
      { articleNo: 'desc' },
      { id: 'desc' },
    ]);
  });

  it('varsayılan sıra yayın tarihidir (site etkilenmez)', async () => {
    expect(await siralama()).toEqual([{ publishedAt: 'desc' }, { id: 'desc' }]);
    prisma.article.findMany.mockClear();
    expect(await siralama('latest')).toEqual([
      { publishedAt: 'desc' },
      { id: 'desc' },
    ]);
  });
});
