import { sayfaliListe } from './sayfali-liste';

/**
 * İki sayfalama biçiminin sözleşmesi. Kritik iddialar: offset matematiği
 * (skip/take), imleçte limit+1 kırpması ve imlecin DÖNDÜRÜLEN son kayıttan
 * üretilmesi — yanlış imleç her sayfa sınırında bir kaydı sessizce yutar.
 */
describe('sayfaliListe', () => {
  const kayitlar = Array.from({ length: 45 }, (_, i) => ({ id: `k${i + 1}` }));

  const bul = jest.fn(async (args: { take: number; skip?: number; cursor?: { id: string } }) => {
    let baslangic = args.skip ?? 0;
    if (args.cursor) {
      baslangic = kayitlar.findIndex((k) => k.id === args.cursor!.id) + (args.skip ?? 0);
    }
    return kayitlar.slice(baslangic, baslangic + args.take);
  });
  const say = jest.fn(async () => kayitlar.length);

  beforeEach(() => jest.clearAllMocks());

  it('sayfa modunda skip/take doğru ve toplam sayfa hesaplanıyor', async () => {
    const sonuc = await sayfaliListe({ say, bul, limit: 20, page: 2 });
    expect(bul).toHaveBeenCalledWith({ take: 20, skip: 20 });
    expect(sonuc.items[0].id).toBe('k21');
    expect(sonuc).toMatchObject({ total: 45, totalPages: 3, page: 2, hasMore: true });
  });

  it('son sayfada hasMore kapanıyor', async () => {
    const sonuc = await sayfaliListe({ say, bul, limit: 20, page: 3 });
    expect(sonuc.items).toHaveLength(5);
    expect(sonuc.hasMore).toBe(false);
  });

  it('imleç modunda limit+1 kırpılıyor ve imleç döndürülen son kayıt', async () => {
    const sonuc = await sayfaliListe({ say, bul, limit: 20 });
    expect(bul).toHaveBeenCalledWith({ take: 21 });
    expect(sonuc.items).toHaveLength(20);
    expect(sonuc.nextCursor).toBe('k20'); // 21. kayıt DEĞİL — o sonraki sayfanın ilki
    expect(sonuc.hasMore).toBe(true);
  });

  it('imleç verildiğinde skip:1 ile devam ediyor', async () => {
    const sonuc = await sayfaliListe({ say, bul, limit: 20, cursor: 'k20' });
    expect(bul).toHaveBeenCalledWith({ take: 21, cursor: { id: 'k20' }, skip: 1 });
    expect(sonuc.items[0].id).toBe('k21');
  });

  it('boş sonuçta totalPages en az 1', async () => {
    const bosSay = jest.fn(async () => 0);
    const bosBul = jest.fn(async () => []);
    const sonuc = await sayfaliListe({ say: bosSay, bul: bosBul, limit: 20, page: 1 });
    expect(sonuc).toMatchObject({ total: 0, totalPages: 1, hasMore: false });
  });
});
