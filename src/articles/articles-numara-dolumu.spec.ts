import { ArticlesService } from './articles.service';

/**
 * AÇILIŞTA haber numarası düzeltmesi.
 *
 * Kritik iddialar: numaralar oluşturma sırasından türetilir (mevcut numaralara
 * güvenilmez — kolon eklendikten sonra girilen haberler 1'den başlayan yanlış
 * numaralar almıştı); kaydırma iki fazda yapılır ki unique kısıt sıra ortasında
 * patlamasın; numaralama doğruysa satır yazılmaz; hata açılışı bozmaz.
 */
describe('ArticlesService — açılışta numara düzeltmesi', () => {
  let prisma: any;
  let servis: ArticlesService;
  /** $transaction'a verilen deyim listesi; her eleman bir $executeRaw. */
  let fazlar: any[][];

  beforeEach(() => {
    fazlar = [];
    prisma = {
      tenant: { findMany: jest.fn().mockResolvedValue([{ id: 't1' }]) },
      // Her $executeRaw çağrısı SQL parçalarını kaydeden bir nesne döner.
      $executeRaw: jest.fn((parcalar: TemplateStringsArray) => ({
        sql: parcalar.join('?'),
      })),
      $transaction: jest.fn((deyimler: any[]) => {
        fazlar.push(deyimler);
        return Promise.resolve([0, 0]);
      }),
    };
    servis = new ArticlesService(
      prisma,
      { log: jest.fn() } as any,
      { revalidateTenant: jest.fn() } as any,
      { paylas: jest.fn() } as any,
    );
  });

  it('her kiracı için iki fazlı tek işlem sürer', async () => {
    await servis.haberNumaralariniDoldur();
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(fazlar[0]).toHaveLength(2);
  });

  it('birinci faz hedef numaranın negatifini yazar', async () => {
    // Negatif ara değer olmadan kaydırma unique kısıtta patlardı.
    await servis.haberNumaralariniDoldur();
    expect(fazlar[0][0].sql).toContain('-s.sira');
    expect(fazlar[0][1].sql).toContain('-article_no');
  });

  it('numarası doğru olan satıra dokunulmaz', async () => {
    await servis.haberNumaralariniDoldur();
    expect(fazlar[0][0].sql).toContain('IS DISTINCT FROM');
  });

  it('sıra oluşturma zamanından türetilir, yayın tarihinden değil', async () => {
    await servis.haberNumaralariniDoldur();
    expect(fazlar[0][0].sql).toContain('ORDER BY created_at ASC, id ASC');
    expect(fazlar[0][0].sql).not.toContain('published_at');
  });

  it('mevcut numaralar sıranın başlangıcını etkilemez', async () => {
    // Eski sürüm MAX(article_no) üstünden devam ediyordu; hata buradaydı.
    await servis.haberNumaralariniDoldur();
    expect(fazlar[0][0].sql).not.toContain('MAX(article_no)');
  });

  it('her kiracı ayrı işlemde düzeltilir', async () => {
    prisma.tenant.findMany.mockResolvedValue([{ id: 't1' }, { id: 't2' }]);
    await servis.haberNumaralariniDoldur();
    expect(prisma.$transaction).toHaveBeenCalledTimes(2);
  });

  it('SQL hatası dışarı sızmaz — açılış bozulmaz', async () => {
    prisma.$transaction.mockRejectedValue(new Error('kolon yok'));
    await expect(servis.haberNumaralariniDoldur()).resolves.toBeUndefined();
  });

  it('kiracı listesi alınamazsa da yutulur', async () => {
    prisma.tenant.findMany.mockRejectedValue(new Error('bağlantı koptu'));
    await expect(servis.haberNumaralariniDoldur()).resolves.toBeUndefined();
  });
});
