import * as cheerio from 'cheerio';
import { GAZETE_KAYNAKLARI, tekilKapaklar } from './widget-feeder.service';

/**
 * Kapak kaynaklarının ayıklayıcıları.
 *
 * HTML parçaları kaynak sayfaların CANLI çıktısından alındı (2026-09-26).
 * Bu testlerin işi, kaynak sayfa yapısını değiştirdiğinde bunu sessiz bir
 * boş şerit yerine kırmızı bir testle haber vermek.
 */

const kaynak = (ad: string) => {
  const bulunan = GAZETE_KAYNAKLARI.find((k) => k.ad === ad);
  if (!bulunan) throw new Error(`kaynak tanımlı değil: ${ad}`);
  return bulunan;
};

describe('gazeteoku.com ayıklayıcı', () => {
  const html = `
    <div class="post-width newspapers"><div class="row">
      <div class="col-12">
        <a href="https://www.gazeteoku.com/gazeteler/hurriyet-gazetesi-manseti" title="Hürriyet">
          <strong>HÜRRİYET</strong>
          <small>26 Eylül 2026</small>
          <img src="https://s.gazeteoku.com/assets/web/files/blank.png"
               data-src="https://i.gazeteoku.com/3/230/336/storage/files/images/2026/09/26/hurriyet-2026-09-26-uvsj.jpg"
               class="lazyload" alt="Hürriyet" />
        </a>
      </div>
      <div class="col-12">
        <a href="/gazeteler/sabah-gazetesi-manseti" title="Sabah">
          <strong>SABAH</strong><small>26 Eylül 2026</small>
          <img src="https://s.gazeteoku.com/assets/web/files/blank.png"
               data-src="https://i.gazeteoku.com/3/230/336/storage/files/images/2026/09/26/sabah-2026-09-26-4c9k.jpg" />
        </a>
      </div>
    </div></div>`;

  const kapaklar = kaynak('gazeteoku.com').ayikla(cheerio.load(html));

  it('her kapağı bir kez çıkarır', () => {
    expect(kapaklar).toHaveLength(2);
    expect(kapaklar.map((k) => k.slug)).toEqual(['hurriyet', 'sabah']);
  });

  it('ad ve tarihi okur', () => {
    expect(kapaklar[0].name).toBe('Hürriyet');
    expect(kapaklar[0].date).toBe('26 Eylül 2026');
  });

  it('kırpılmamış orijinali üretir — boyut segmenti atılıyor', () => {
    // Küçük kapak boyutu yolda taşınıyor; segment atılınca 1280x~2150 geliyor.
    expect(kapaklar[0].imageFull).toBe(
      'https://i.gazeteoku.com/storage/files/images/2026/09/26/hurriyet-2026-09-26-uvsj.jpg',
    );
  });

  it('göreli adresi mutlak yapar', () => {
    expect(kapaklar[1].url).toBe('https://www.gazeteoku.com/gazeteler/sabah-gazetesi-manseti');
  });

  it('yer tutucu görseli atlar — gerçek adres data-src içinde', () => {
    const yalnizYerTutucu = `<div class="newspapers"><a href="/gazeteler/x-gazetesi-manseti">
      <img src="https://s.gazeteoku.com/assets/web/files/blank.png" alt="X" /></a></div>`;
    expect(kaynak('gazeteoku.com').ayikla(cheerio.load(yalnizYerTutucu))).toHaveLength(0);
  });
});

describe('gazetemanset.gzt.com ayıklayıcı', () => {
  const html = `
    <div class="mantine-SimpleGrid-root">
      <a class="_content_huxew_14" href="/yenisafak-gazetesi/26-09-2026">
        <div class="_imageWrapper_huxew_19">
          <img class="_image_huxew_19"
               src="https://img.piri.net/piri/upload/3/2026/9/26/4d89f513-36be5aa7.jpg"
               alt="Yeni Şafak Gazetesi 26 Eylül 2026, Cumartesi Günü Manşeti" />
        </div>
      </a>
      <a class="_content_huxew_14" href="/hurriyet-gazetesi/26-09-2026">
        <img src="https://img.piri.net/piri/upload/3/2026/9/26/ed595b1a-c175f871.jpg"
             alt="Hürriyet Gazetesi 26 Eylül 2026, Cumartesi Günü Manşeti" />
      </a>
      <a href="/hakkimizda"><img src="https://assets.gzt.com/logo.svg" alt="GZT" /></a>
    </div>`;

  const kapaklar = kaynak('gazetemanset.gzt.com').ayikla(cheerio.load(html));

  it('yalnızca kapak kartlarını alır, logoyu almaz', () => {
    expect(kapaklar).toHaveLength(2);
  });

  it('adı ve tarihi alt metninden ayırır', () => {
    // Ad ve tarih ayrı etikette değil; kaynak ikisini yalnızca `alt` içinde veriyor.
    expect(kapaklar[0].name).toBe('Yeni Şafak');
    expect(kapaklar[0].date).toBe('26 Eylül 2026');
  });

  it('slug için adres parçasını kullanır', () => {
    expect(kapaklar.map((k) => k.slug)).toEqual(['yenisafak', 'hurriyet']);
  });

  it('tek boy sunulduğu için iki adres de aynıdır', () => {
    expect(kapaklar[1].imageFull).toBe(kapaklar[1].image);
  });

  it('kaynak adını kapağa yazar', () => {
    expect(kapaklar[0].source).toBe('gazetemanset.gzt.com');
  });
});

describe('tekilKapaklar', () => {
  const uret = (slug: string, name = slug): any => ({ slug, name });

  it('aynı slug ikinci kez geçmez', () => {
    expect(tekilKapaklar([uret('hurriyet'), uret('sabah'), uret('hurriyet')])).toHaveLength(2);
  });

  it('slug boşsa ada bakar', () => {
    const liste = [uret('', 'Hürriyet'), uret('', 'Hürriyet'), uret('', 'Sabah')];
    expect(tekilKapaklar(liste as any).map((k) => k.name)).toEqual(['Hürriyet', 'Sabah']);
  });

  it('ilk görüleni korur — kaynak sırası anlamlı', () => {
    const liste = [uret('hurriyet', 'İLK'), uret('hurriyet', 'SONRA')];
    expect(tekilKapaklar(liste as any)[0].name).toBe('İLK');
  });
});

describe('kaynak kaydı', () => {
  it('en az iki kaynak tanımlı — biri engellenirse diğeri devralıyor', () => {
    expect(GAZETE_KAYNAKLARI.length).toBeGreaterThanOrEqual(2);
  });

  it('her kaynağın adı, adresi, işaretçisi ve ayıklayıcısı var', () => {
    for (const k of GAZETE_KAYNAKLARI) {
      expect(k.ad).toBeTruthy();
      expect(k.url).toMatch(/^https:\/\//);
      expect(k.secici).toBeTruthy();
      expect(typeof k.ayikla).toBe('function');
    }
  });

  it('boş sayfada ayıklayıcı çökmez, boş liste döner', () => {
    for (const k of GAZETE_KAYNAKLARI) {
      expect(k.ayikla(cheerio.load('<html><body></body></html>'))).toEqual([]);
    }
  });
});
