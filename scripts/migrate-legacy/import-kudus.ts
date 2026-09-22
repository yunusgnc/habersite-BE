/**
 * Kudüs Ana Haber (Laravel/MariaDB) → HaberSite (Prisma/PostgreSQL) aktarımı.
 *
 *   # Önizleme — hiçbir şey yazmaz, ne olacağını raporlar
 *   npx tsx scripts/migrate-legacy/import-kudus.ts \
 *     --dump ~/Downloads/kudusanahaber_db-18.09.2026.sql \
 *     --tenant cmtzpuk5i000f07nl4t7j9fyj \
 *     --cdn https://kudusanahaber-cdn.makasda.com \
 *     --arsiv scripts/migrate-legacy/kudus-arsiv.txt
 *
 *   # Gerçekten yaz
 *   ... --apply
 *
 * Kayseri Times aktarımından (import.ts) FARKLARI:
 *  - Kaynak şema İngilizce Laravel tabloları (news/articles/authors/…),
 *    Kayseri'deki Türkçe tablolar değil. Okuyucu ortak (mysql-dump-reader).
 *  - SİLME YOK. `--purge` bilerek eklenmedi: hedef kiracıda müşterinin
 *    panelden girdiği içerik var, aktarım slug üzerinden üzerine yazar.
 *  - Kategoriler YENİDEN OLUŞTURULMAZ; kiracıda hâlihazırda duran
 *    kategorilere ada göre bağlanır (bkz. kategorileriEsle).
 *  - `is_headline` 3.220, `is_breaking` 3.267 kayıtta 1 — eski panelde bu
 *    bayraklar hiç kullanılmamış. Aktarılsaydı her haber manşet olurdu,
 *    bu yüzden ALINMIYOR.
 *  - Görseller manifesto ile doğrulanıyor: arşivde olmayan dosya için adres
 *    üretilmiyor, kapak boş kalıyor ve kapaksiz-haberler.csv'ye düşüyor.
 *
 * Şifre hash'leri aktarılmaz; zaten yazarların e-postası yok, eski panel
 * hesapları (`users`) sahte adreslerle dolu — hiç dokunulmuyor.
 */
import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient, ArticleStatus, CommentStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import slugify from 'slugify';
import {
  readColumnOrder,
  readRows,
  asStr,
  asInt,
  asDate,
  type Row,
} from './mysql-dump-reader';
import { kudusMedyaCozumleyici, stilleriSuz } from './media-url-kudus';

// ── Argümanlar ────────────────────────────────────────────────────

function arg(ad: string, varsayilan?: string): string {
  const i = process.argv.indexOf(`--${ad}`);
  if (i >= 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--')) {
    return process.argv[i + 1];
  }
  if (varsayilan !== undefined) return varsayilan;
  throw new Error(`--${ad} zorunlu`);
}
const bayrak = (ad: string) => process.argv.includes(`--${ad}`);

const DUMP = arg('dump');
const KIRACI = arg('tenant');
const CDN = arg('cdn');
const ARSIV_DOSYASI = arg('arsiv', '');
const UYGULA = bayrak('apply');
const LIMIT = Number(arg('limit', '0')) || 0;
const CIKTI = arg('out', path.join(process.cwd(), 'migration-output'));
/** Kategorisi çözülemeyen haberler buraya düşer (kiracıdaki slug). */
const VARSAYILAN_KATEGORI = arg('varsayilan-kategori', 'guncel');

const TABLOLAR = new Set([
  'categories',
  'authors',
  'news',
  'articles',
  'videos',
  'galleries',
  'gallery_items',
  'comments',
]);

const YIGIN = 200;

/**
 * Eski kategori adı → kiracıdaki kategori slug'ı. Ada göre otomatik eşleşme
 * yetmeyen tek durum: eski sitede "MAKALELER" adlı bir HABER kategorisi var
 * (11 haber, hepsi "X'in kaleminden …" duyurusu). Yeni sitede makale ayrı bir
 * bölüm (COLUMN); aynı adla bir haber kategorisi açmak menüde ikizleme yapar.
 */
const KATEGORI_ESLEMESI: Record<string, string> = {
  makaleler: 'guncel',
};

// ── Sayaçlar ──────────────────────────────────────────────────────

const sayac: Record<string, number> = {};
const say = (k: string, n = 1) => (sayac[k] = (sayac[k] ?? 0) + n);
const uyarilar: string[] = [];
const uyar = (m: string) => {
  if (uyarilar.length < 60) uyarilar.push(m);
  say('uyarı');
};

// ── Yardımcılar ───────────────────────────────────────────────────

const metin = (...degerler: unknown[]): string | null => {
  for (const d of degerler) {
    const s = asStr(d).trim();
    if (s) return s;
  }
  return null;
};

/**
 * Eski panelde düz metin alanlarına HTML yapıştırılmış. Ölçüm:
 *   news.headline_title      26 kayıt  → `<span style="font-size: 28px…">`
 *   articles.seo_description 128 kayıt → `GEN&Ccedil;LİK&nbsp;VE…`
 *   authors.bio                2 kayıt → Word'den gelen `<p class="MsoNormal">`
 * Site bu alanları metin olarak bastığı için manşetin üstünde ham `<span
 * style=…>` görünüyordu. Etiketler atılıp varlık kodları çözülüyor.
 * İÇERİK GÖVDESİNE UYGULANMAZ — orası gerçek HTML.
 */
const VARLIKLAR: Record<string, string> = {
  nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'",
  uuml: 'ü', Uuml: 'Ü', ccedil: 'ç', Ccedil: 'Ç', ouml: 'ö', Ouml: 'Ö',
  acirc: 'â', Acirc: 'Â', icirc: 'î', Icirc: 'Î', ucirc: 'û', Ucirc: 'Û',
  scedil: 'ş', Scedil: 'Ş', ge: 'ğ', shy: '',
  rsquo: '\u2019', lsquo: '\u2018', ldquo: '\u201C', rdquo: '\u201D',
  hellip: '…', ndash: '–', mdash: '—',
};

function duzMetin(...degerler: unknown[]): string | null {
  for (const d of degerler) {
    const ham = asStr(d);
    if (!ham.trim()) continue;
    const temiz = ham
      // Satır sonu üreten etiketler boşluğa dönsün, kelimeler birleşmesin.
      .replace(/<br\s*\/?>|<\/(p|div|li|h[1-6])>/gi, ' ')
      .replace(/<[^>]*>/g, '')
      .replace(/&#(\d+);/g, (_m, k) => String.fromCodePoint(Number(k)))
      .replace(/&#x([0-9a-f]+);/gi, (_m, k) => String.fromCodePoint(parseInt(k, 16)))
      .replace(/&([a-zA-Z]+);/g, (tam, ad) => VARLIKLAR[ad] ?? tam)
      .replace(/\s+/g, ' ')
      .trim();
    if (temiz) return temiz;
  }
  return null;
}

function slugla(kaynak: string, yedekId: number | string): string {
  const s = slugify(kaynak, { lower: true, strict: true, locale: 'tr' });
  return s || `icerik-${yedekId}`;
}

/** Laravel enum'u → yayın durumu. `deleted_at` dolu satırlar hiç gelmez. */
function durum(deger: unknown): ArticleStatus {
  switch (asStr(deger).trim().toLowerCase()) {
    case 'published':
      return ArticleStatus.PUBLISHED;
    case 'scheduled':
      return ArticleStatus.SCHEDULED;
    default:
      return ArticleStatus.DRAFT;
  }
}

/** Yazar/kategori adını eşleştirme anahtarına indirger. */
const TR_HARFLER: Record<string, string> = {
  ç: 'c', ğ: 'g', ı: 'i', İ: 'i', i: 'i', ö: 'o', ş: 's', ü: 'u',
};
function anahtar(ad: string): string {
  return ad
    .toLocaleLowerCase('tr')
    .replace(/[çğıİiöşü]/g, (h) => TR_HARFLER[h] ?? h)
    // Unvanlar eski ve yeni kayıtta farklı yazılmış: kiracıda "AV. KADİR EROL",
    // dump'ta "KADİR EROL". Unvan atılmazsa aynı yazar iki kez oluşur.
    .replace(/\b(av|dr|prof|doc|uzm|dyt|op|md|sn)\b\.?/g, ' ')
    .replace(/[^a-z0-9]+/g, '');
}

function okumaSuresi(icerik: string, kayitli: number): number {
  if (kayitli > 0) return kayitli;
  const kelime = icerik.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(kelime / 200));
}

// ── Medya ─────────────────────────────────────────────────────────

const arsivKumesi = ARSIV_DOSYASI
  ? new Set(
      fs
        .readFileSync(ARSIV_DOSYASI, 'utf8')
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    )
  : undefined;

const medya = kudusMedyaCozumleyici({
  cdnBaseUrl: CDN,
  tenantId: KIRACI,
  arsiv: arsivKumesi,
});

const govde = (icerik: unknown) => ({
  html: stilleriSuz(medya.govdeyiDuzelt(asStr(icerik))),
});

// ── Prisma ────────────────────────────────────────────────────────

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL tanımlı değil');
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
  log: ['warn', 'error'],
});

// ── Ana akış ──────────────────────────────────────────────────────

type Kapaksiz = { id: number; baslik: string; slug: string };
const kapaksizlar: Kapaksiz[] = [];

async function main() {
  console.log('═'.repeat(66));
  console.log('  KUDÜS ANA HABER → HABERSITE AKTARIMI');
  console.log('═'.repeat(66));
  console.log(`  Dump    : ${DUMP}`);
  console.log(`  Kiracı  : ${KIRACI}`);
  console.log(`  CDN     : ${CDN}`);
  console.log(
    `  Arşiv   : ${arsivKumesi ? `${arsivKumesi.size} dosya (doğrulanacak)` : 'manifesto yok — adresler körlemesine üretilecek'}`,
  );
  console.log(`  Mod     : ${UYGULA ? '⚠️  YAZMA (--apply)' : '👀 ÖNİZLEME'}`);
  if (LIMIT) console.log(`  Limit   : ${LIMIT} haber (test)`);
  console.log('═'.repeat(66) + '\n');

  const kiraci = await prisma.tenant.findUnique({
    where: { id: KIRACI },
    select: { id: true, name: true, mediaBaseUrl: true },
  });
  if (!kiraci) throw new Error(`Kiracı bulunamadı: ${KIRACI}`);
  console.log(`Kiracı doğrulandı: ${kiraci.name}`);
  if (
    kiraci.mediaBaseUrl &&
    kiraci.mediaBaseUrl.replace(/\/$/, '') !== CDN.replace(/\/$/, '')
  ) {
    uyar(
      `Kiracının kayıtlı CDN adresi (${kiraci.mediaBaseUrl}) --cdn ile aynı değil.`,
    );
  }

  const sahip = await icerikSahibi();
  console.log(`İçerik sahibi kullanıcı: ${sahip.email}\n`);

  const kolonlar = await readColumnOrder(DUMP);

  const eski = {
    categories: [] as Row[],
    authors: [] as Row[],
    galleries: [] as Row[],
    galleryItems: [] as Row[],
    videos: [] as Row[],
    comments: [] as Row[],
  };

  console.log('Dump okunuyor (referans tabloları)…');
  for await (const { table, row } of readRows(DUMP, TABLOLAR, kolonlar)) {
    switch (table) {
      case 'categories': eski.categories.push(row); break;
      case 'authors': eski.authors.push(row); break;
      case 'galleries': eski.galleries.push(row); break;
      case 'gallery_items': eski.galleryItems.push(row); break;
      case 'videos': eski.videos.push(row); break;
      case 'comments': eski.comments.push(row); break;
      default: break; // news/articles ikinci geçişte, akış halinde
    }
  }
  console.log(
    `  kategori ${eski.categories.length} · yazar ${eski.authors.length} · ` +
      `video ${eski.videos.length} · galeri ${eski.galleries.length} · ` +
      `galeri görseli ${eski.galleryItems.length} · yorum ${eski.comments.length}\n`,
  );

  const kategoriHarita = await kategorileriEsle(
    eski.categories,
    await kategoriKullanimi(kolonlar),
  );
  const yazarHarita = await yazarlariAktar(eski.authors);

  const { harita: haberHarita, sluglar } = await haberleriAktar(
    kolonlar,
    kategoriHarita,
    yazarHarita,
    sahip.id,
  );
  const makaleHarita = await makaleleriAktar(
    kolonlar,
    yazarHarita,
    sahip.id,
    sluglar,
  );
  await videolariAktar(eski.videos);
  await galerileriAktar(eski.galleries, eski.galleryItems);
  await yorumlariAktar(eski.comments, haberHarita, makaleHarita);
  await medyaKutuphanesi();

  kapaksizCsvYaz();
  rapor();
}

// ── Kullanıcı ─────────────────────────────────────────────────────

async function icerikSahibi() {
  const mevcut = await prisma.user.findFirst({
    where: {
      tenantId: KIRACI,
      role: { in: ['ADMIN', 'SUPER_ADMIN'] },
      active: true,
    },
    select: { id: true, email: true },
    orderBy: { createdAt: 'asc' },
  });
  if (mevcut) return mevcut;
  if (!UYGULA) return { id: 'KURU', email: '(kuru çalışma)' };
  throw new Error('Kiracıda aktif ADMIN kullanıcı yok — içerik sahibi atanamaz.');
}

// ── Kategoriler ───────────────────────────────────────────────────

/**
 * Hangi eski kategoride kaç haber var. İçi boş kategoriyi kiracıya eklemek
 * menüye "hiç haber yok" sayfası koymak demek — Kayseri aktarımında aynı
 * sorun yaşanmıştı.
 */
async function kategoriKullanimi(
  kolonlar: Map<string, string[]>,
): Promise<Map<number, number>> {
  const sayim = new Map<number, number>();
  for await (const { row } of readRows(DUMP, new Set(['news']), kolonlar)) {
    if (asStr(row.deleted_at).trim()) continue;
    const k = asInt(row.category_id);
    sayim.set(k, (sayim.get(k) ?? 0) + 1);
  }
  return sayim;
}

/**
 * Eski kategorileri kiracıda HÂLİHAZIRDA DURAN kategorilere bağlar.
 *
 * NEDEN yeni kategori oluşturmuyoruz: müşteri panelde 12 kategori kurmuş
 * (GAZZE, FİLİSTİN, SURİYE…), eski veritabanında ise yalnızca 10 var ve
 * haberlerin 3.149'u tek bir ".GÜNCEL" kategorisinde. Eskisini olduğu gibi
 * yazmak müşterinin menüsünü bozardı.
 *
 * Eşleşme ada göre: baştaki nokta/boşluk atılır, unvan ve noktalama
 * temizlenir (".GÜNCEL" → "guncel"). Eşleşmeyen ve içinde haber olan
 * kategoriler oluşturulur; "deneme" kayıtları atlanır.
 */
async function kategorileriEsle(
  satirlar: Row[],
  kullanim: Map<number, number>,
): Promise<Map<number, string>> {
  console.log('Kategoriler…');
  const harita = new Map<number, string>();

  const mevcutlar = await prisma.category.findMany({
    where: { tenantId: KIRACI },
    select: { id: true, name: true, slug: true },
  });
  const adIndeksi = new Map(mevcutlar.map((k) => [anahtar(k.name), k.id]));
  const slugIndeksi = new Map(mevcutlar.map((k) => [k.slug, k.id]));

  for (const r of satirlar) {
    const eskiId = asInt(r.id);
    const ad = asStr(r.name).trim().replace(/^[.\s]+/, '');
    if (!ad) continue;
    if (/^deneme/i.test(ad)) {
      say('kategori (deneme, atlandı)');
      continue;
    }

    const elleEslenen = KATEGORI_ESLEMESI[anahtar(ad)];
    const bulunan =
      (elleEslenen ? slugIndeksi.get(elleEslenen) : undefined) ??
      adIndeksi.get(anahtar(ad)) ??
      slugIndeksi.get(asStr(r.slug).trim());
    if (bulunan) {
      harita.set(eskiId, bulunan);
      say('kategori (mevcutla eşleşti)');
      continue;
    }

    if (!(kullanim.get(eskiId) ?? 0)) {
      say('kategori (içi boş, oluşturulmadı)');
      continue;
    }

    const slug = slugla(ad, eskiId);
    say('kategori (yeni oluşturuldu)');
    if (!UYGULA) {
      harita.set(eskiId, `KURU-${slug}`);
      continue;
    }
    const kayit = await prisma.category.upsert({
      where: { tenantId_slug: { tenantId: KIRACI, slug } },
      update: {},
      create: {
        tenantId: KIRACI,
        name: ad,
        slug,
        sortOrder: asInt(r.sort_order),
        active: asInt(r.is_active) === 1,
      },
      select: { id: true },
    });
    harita.set(eskiId, kayit.id);
    adIndeksi.set(anahtar(ad), kayit.id);
  }

  // Kategorisi çözülemeyen haberler için tek bir sığınak.
  const varsayilan = slugIndeksi.get(VARSAYILAN_KATEGORI);
  if (varsayilan) harita.set(-1, varsayilan);
  else uyar(`Varsayılan kategori bulunamadı: ${VARSAYILAN_KATEGORI}`);

  console.log(
    `  eşleşen ${sayac['kategori (mevcutla eşleşti)'] ?? 0} · ` +
      `yeni ${sayac['kategori (yeni oluşturuldu)'] ?? 0} · ` +
      `içi boş ${sayac['kategori (içi boş, oluşturulmadı)'] ?? 0} · ` +
      `deneme ${sayac['kategori (deneme, atlandı)'] ?? 0}\n`,
  );
  return harita;
}

// ── Yazarlar ──────────────────────────────────────────────────────

async function yazarlariAktar(satirlar: Row[]): Promise<Map<number, string>> {
  console.log('Yazarlar…');
  const harita = new Map<number, string>();

  const mevcutlar = await prisma.author.findMany({
    where: { tenantId: KIRACI },
    select: { id: true, name: true, slug: true },
  });
  const adIndeksi = new Map(mevcutlar.map((y) => [anahtar(y.name), y.id]));
  const slugIndeksi = new Map(mevcutlar.map((y) => [y.slug, y.id]));

  for (const r of satirlar) {
    const eskiId = asInt(r.id);
    const ad = duzMetin(r.name) ?? '';
    if (!ad || /^deneme$/i.test(ad)) {
      say('yazar (deneme/boş, atlandı)');
      continue;
    }
    if (asStr(r.deleted_at).trim()) {
      say('yazar (silinmiş, atlandı)');
      continue;
    }

    const avatar = medya.dosya('resimler/yazar', asStr(r.image));
    const sosyal = {
      facebook: metin(r.facebook),
      twitter: metin(r.twitter),
      instagram: metin(r.instagram),
    };
    const bio = duzMetin(r.bio);

    // Kiracıda zaten varsa yalnızca eksikleri tamamla — müşterinin panelden
    // düzelttiği ad/slug'ı eski kayıtla ezmiyoruz.
    const mevcutId = adIndeksi.get(anahtar(ad)) ?? slugIndeksi.get(asStr(r.slug).trim());
    if (mevcutId) {
      harita.set(eskiId, mevcutId);
      say('yazar (mevcutla eşleşti)');
      if (UYGULA) {
        await prisma.author.update({
          where: { id: mevcutId },
          data: {
            bio: bio ?? undefined,
            avatar: avatar ?? undefined,
          },
        });
      }
      continue;
    }

    const slug = slugla(ad, eskiId);
    say('yazar (yeni)');
    if (!UYGULA) {
      harita.set(eskiId, `KURU-${slug}`);
      continue;
    }
    const kayit = await prisma.author.upsert({
      where: { tenantId_slug: { tenantId: KIRACI, slug } },
      update: { name: ad, bio: bio ?? undefined, avatar: avatar ?? undefined },
      create: {
        tenantId: KIRACI,
        name: ad,
        slug,
        bio,
        avatar,
        active: asInt(r.is_active) === 1,
        sortOrder: asInt(r.sort_order),
        social: sosyal,
      },
      select: { id: true },
    });
    harita.set(eskiId, kayit.id);
    adIndeksi.set(anahtar(ad), kayit.id);
  }

  console.log(
    `  eşleşen ${sayac['yazar (mevcutla eşleşti)'] ?? 0} · ` +
      `yeni ${sayac['yazar (yeni)'] ?? 0}\n`,
  );
  return harita;
}

// ── Haberler ──────────────────────────────────────────────────────

async function haberleriAktar(
  kolonlar: Map<string, string[]>,
  kategoriHarita: Map<number, string>,
  yazarHarita: Map<number, string>,
  sahipId: string,
): Promise<{ harita: Map<number, string>; sluglar: Set<string> }> {
  console.log('Haberler (akış halinde)…');
  const harita = new Map<number, string>();
  const gorulenSluglar = new Set<string>();
  let islenen = 0;
  let yigin: { eskiId: number; veri: any; kategoriId: string | null }[] = [];

  const bosalt = async () => {
    if (!yigin.length) return;
    if (!UYGULA) {
      for (const it of yigin) harita.set(it.eskiId, `KURU-${it.veri.slug}`);
      yigin = [];
      return;
    }
    for (const it of yigin) {
      try {
        const kayit = await prisma.article.upsert({
          where: { tenantId_slug: { tenantId: KIRACI, slug: it.veri.slug } },
          update: it.veri,
          create: { ...it.veri, createdById: sahipId },
          select: { id: true },
        });
        harita.set(it.eskiId, kayit.id);
        if (it.kategoriId) {
          // Betik iki kez çalıştırılırsa kopya bağ oluşmasın.
          await prisma.articleCategory.deleteMany({
            where: { articleId: kayit.id },
          });
          await prisma.articleCategory.create({
            data: {
              articleId: kayit.id,
              categoryId: it.kategoriId,
              primary: true,
            },
          });
        }
      } catch (e: any) {
        uyar(`Haber ${it.eskiId} yazılamadı: ${e?.message ?? e}`);
      }
    }
    yigin = [];
  };

  for await (const { table, row } of readRows(DUMP, new Set(['news']), kolonlar)) {
    if (table !== 'news') continue;
    if (LIMIT && islenen >= LIMIT) break;

    const eskiId = asInt(row.id);
    if (asStr(row.deleted_at).trim()) {
      say('haber (silinmiş, atlandı)');
      continue;
    }
    const baslik = duzMetin(row.title);
    if (!baslik) {
      uyar(`Haber ${eskiId}: başlık boş, atlandı`);
      continue;
    }

    let slug = metin(row.slug) ?? slugla(baslik, eskiId);
    if (gorulenSluglar.has(slug)) {
      // Kaynakta aynı slug birden çok haberde geçiyor (63 kayıt). Eski site
      // bunlardan yalnızca birini servis edebiliyordu; ilk gelen kanonik.
      slug = `${slug}-${eskiId}`;
      say('haber (slug çakışması çözüldü)');
    }
    gorulenSluglar.add(slug);

    const yayinTarihi = asDate(row.published_at) ?? asDate(row.created_at);
    const kategoriId =
      kategoriHarita.get(asInt(row.category_id)) ?? kategoriHarita.get(-1) ?? null;
    if (!kategoriHarita.get(asInt(row.category_id))) {
      say('haber (kategorisi eşleşmedi → varsayılan)');
    }

    const kapak = medya.dosya('resimler/icerikler', asStr(row.image));
    if (!kapak && kapaksizlar.length < 5000) {
      say('haber (kapaksız)');
      kapaksizlar.push({ id: eskiId, baslik, slug });
    }

    const yazarId = yazarHarita.get(asInt(row.author_id)) ?? null;
    const icerik = asStr(row.content);

    const veri = {
      tenantId: KIRACI,
      title: baslik,
      slug,
      spot: duzMetin(row.summary),
      // Eski panelde "manşet başlığı" — bizde fotoğrafın üstündeki spot başlık.
      spotTitle: duzMetin(row.headline_title),
      content: govde(icerik),
      featuredImage: kapak,
      ogImage: medya.dosya('resimler/icerikler', asStr(row.og_image)),
      status: durum(row.status),
      publishedAt: yayinTarihi,
      viewCount: asInt(row.hit),
      readingTime: okumaSuresi(icerik, asInt(row.read_time)),
      seoTitle: duzMetin(row.seo_title),
      seoDesc: duzMetin(row.seo_description),
      canonicalUrl: metin(row.canonical_url),
      videoUrl: metin(row.video_url),
      authorId: yazarId && !yazarId.startsWith('KURU-') ? yazarId : null,
      // is_headline / is_breaking BİLEREK alınmıyor (bkz. dosya başı notu).
      featured: false,
      createdAt: yayinTarihi ?? undefined,
    };

    yigin.push({
      eskiId,
      veri,
      kategoriId: kategoriId && !kategoriId.startsWith('KURU-') ? kategoriId : null,
    });
    islenen++;
    say('haber');

    if (yigin.length >= YIGIN) {
      await bosalt();
      process.stdout.write(`\r  ${islenen.toLocaleString('tr-TR')} haber işlendi…`);
    }
  }
  await bosalt();
  process.stdout.write(
    `\r  ${islenen.toLocaleString('tr-TR')} haber işlendi.        \n\n`,
  );
  return { harita, sluglar: gorulenSluglar };
}

// ── Köşe yazıları ─────────────────────────────────────────────────

async function makaleleriAktar(
  kolonlar: Map<string, string[]>,
  yazarHarita: Map<number, string>,
  sahipId: string,
  haberSluglari: Set<string>,
): Promise<Map<number, string>> {
  console.log('Köşe yazıları…');
  const harita = new Map<number, string>();
  // Haber slug'larıyla aynı havuz: aynı slug'a upsert eden bir makale mevcut
  // HABERİ günceller ve türünü COLUMN yapar — yani haber kaybolur.
  const gorulen = new Set<string>(haberSluglari);

  for await (const { table, row } of readRows(DUMP, new Set(['articles']), kolonlar)) {
    if (table !== 'articles') continue;

    const eskiId = asInt(row.id);
    if (asStr(row.deleted_at).trim()) {
      say('makale (silinmiş, atlandı)');
      continue;
    }
    const baslik = duzMetin(row.title);
    if (!baslik || /^deneme$/i.test(baslik)) {
      say('makale (deneme/boş, atlandı)');
      continue;
    }

    let slug = metin(row.slug) ?? slugla(baslik, eskiId);
    if (gorulen.has(slug)) {
      slug = `${slug}-${eskiId}`;
      say('makale (slug çakışması çözüldü)');
    }
    gorulen.add(slug);

    const yazarId = yazarHarita.get(asInt(row.author_id)) ?? null;
    if (!yazarId) say('makale (yazarı eşleşmedi)');
    const yayinTarihi = asDate(row.published_at) ?? asDate(row.created_at);
    const icerik = asStr(row.content);

    const veri = {
      tenantId: KIRACI,
      type: 'COLUMN' as const,
      title: baslik,
      slug,
      spot: duzMetin(row.summary),
      content: govde(icerik),
      // `articles` tablosunda kapak kolonu yok; site yazarın fotoğrafını kullanır.
      ogImage: medya.dosya('resimler/icerikler', asStr(row.og_image)),
      status: durum(row.status),
      publishedAt: yayinTarihi,
      viewCount: asInt(row.hit),
      readingTime: okumaSuresi(icerik, asInt(row.read_time)),
      seoDesc: duzMetin(row.seo_description),
      canonicalUrl: metin(row.canonical_url),
      authorId: yazarId && !yazarId.startsWith('KURU-') ? yazarId : null,
      createdAt: yayinTarihi ?? undefined,
    };

    say('köşe yazısı');
    if (!UYGULA) {
      harita.set(eskiId, `KURU-${slug}`);
      continue;
    }
    try {
      const kayit = await prisma.article.upsert({
        where: { tenantId_slug: { tenantId: KIRACI, slug } },
        update: veri,
        create: { ...veri, createdById: sahipId },
        select: { id: true },
      });
      harita.set(eskiId, kayit.id);
    } catch (e: any) {
      uyar(`Makale ${eskiId} yazılamadı: ${e?.message ?? e}`);
    }
  }
  console.log(`  ${sayac['köşe yazısı'] ?? 0} köşe yazısı\n`);
  return harita;
}

// ── Videolar ──────────────────────────────────────────────────────

async function videolariAktar(satirlar: Row[]) {
  console.log('Videolar…');
  const gorulen = new Set<string>();

  for (const r of satirlar) {
    const eskiId = asInt(r.id);
    const baslik = duzMetin(r.title);
    if (!baslik || /^deneme$/i.test(baslik)) {
      say('video (deneme/boş, atlandı)');
      continue;
    }
    if (asStr(r.deleted_at).trim()) {
      say('video (silinmiş, atlandı)');
      continue;
    }

    let slug = metin(r.slug) ?? slugla(baslik, eskiId);
    if (gorulen.has(slug)) slug = `${slug}-${eskiId}`;
    gorulen.add(slug);

    const gomme = metin(r.embed_code);
    // Video.videoUrl zorunlu; iframe'in src'si oynatıcı için yeterli.
    const iframeSrc = gomme?.match(/src=["']([^"']+)["']/i)?.[1] ?? '';
    const dosyaAdi = asStr(r.video_file).trim();
    const videoAdresi =
      iframeSrc ||
      (dosyaAdi ? (medya.dosya('resimler/video', dosyaAdi) ?? '') : '');
    if (!videoAdresi && !gomme) {
      uyar(`Video ${eskiId}: kaynak yok, atlandı`);
      continue;
    }
    const tarih = asDate(r.created_at);

    const veri = {
      tenantId: KIRACI,
      title: baslik,
      headline: duzMetin(r.headline_title),
      slug,
      description: duzMetin(r.summary),
      coverImage: medya.dosya('resimler/video', asStr(r.image)),
      videoUrl: videoAdresi,
      embedCode: gomme,
      source: /youtu/i.test(gomme ?? videoAdresi) ? 'youtube' : 'upload',
      status: asInt(r.is_active) === 1 ? ArticleStatus.PUBLISHED : ArticleStatus.DRAFT,
      publishedAt: tarih,
      viewCount: asInt(r.hit),
      seoTitle: duzMetin(r.seo_title),
      seoDesc: duzMetin(r.seo_description),
      createdAt: tarih ?? undefined,
    };

    say('video');
    if (!UYGULA) continue;
    try {
      await prisma.video.upsert({
        where: { tenantId_slug: { tenantId: KIRACI, slug } },
        update: veri,
        create: veri,
      });
    } catch (e: any) {
      uyar(`Video ${eskiId} yazılamadı: ${e?.message ?? e}`);
    }
  }
  console.log(`  ${sayac.video ?? 0} video\n`);
}

// ── Foto galeriler ────────────────────────────────────────────────

async function galerileriAktar(galeriler: Row[], gorseller: Row[]) {
  console.log('Foto galeriler…');
  const galeriyeGore = new Map<number, Row[]>();
  for (const g of gorseller) {
    const gid = asInt(g.gallery_id);
    if (!galeriyeGore.has(gid)) galeriyeGore.set(gid, []);
    galeriyeGore.get(gid)!.push(g);
  }

  for (const g of galeriler) {
    const eskiId = asInt(g.id);
    const baslik = duzMetin(g.title);
    if (!baslik || /^deneme$/i.test(baslik)) {
      say('galeri (deneme/boş, atlandı)');
      continue;
    }
    if (asStr(g.deleted_at).trim()) continue;

    const slug = metin(g.slug) ?? slugla(baslik, eskiId);
    const tarih = asDate(g.created_at);
    const ogeler = galeriyeGore.get(eskiId) ?? [];

    const gorselVerisi = ogeler
      .map((o, i) => ({
        url: medya.dosya('resimler/galeriresim', asStr(o.image)) ?? '',
        caption: duzMetin(o.description),
        sortOrder: asInt(o.sort_order) || i,
      }))
      .filter((v) => v.url);

    say('galeri');
    say('galeri görseli', ogeler.length);
    say('galeri görseli (adres çözüldü)', gorselVerisi.length);
    if (!UYGULA) continue;

    try {
      const kayit = await prisma.gallery.upsert({
        where: { tenantId_slug: { tenantId: KIRACI, slug } },
        update: {
          title: baslik,
          description: duzMetin(g.summary),
          coverImage: medya.dosya('resimler/galeri', asStr(g.image)),
          status: asInt(g.is_active) === 1 ? ArticleStatus.PUBLISHED : ArticleStatus.DRAFT,
          publishedAt: tarih,
          viewCount: asInt(g.hit),
        },
        create: {
          tenantId: KIRACI,
          title: baslik,
          slug,
          description: duzMetin(g.summary),
          coverImage: medya.dosya('resimler/galeri', asStr(g.image)),
          status: asInt(g.is_active) === 1 ? ArticleStatus.PUBLISHED : ArticleStatus.DRAFT,
          publishedAt: tarih,
          viewCount: asInt(g.hit),
          createdAt: tarih ?? undefined,
        },
        select: { id: true },
      });

      await prisma.galleryImage.deleteMany({ where: { galleryId: kayit.id } });
      const veri = gorselVerisi.map((v) => ({ ...v, galleryId: kayit.id }));
      if (veri.length) await prisma.galleryImage.createMany({ data: veri });
    } catch (e: any) {
      uyar(`Galeri ${eskiId} yazılamadı: ${e?.message ?? e}`);
    }
  }
  console.log(
    `  ${sayac.galeri ?? 0} galeri · ${sayac['galeri görseli (adres çözüldü)'] ?? 0}/${sayac['galeri görseli'] ?? 0} görsel\n`,
  );
}

// ── Yorumlar ──────────────────────────────────────────────────────

async function yorumlariAktar(
  satirlar: Row[],
  haberHarita: Map<number, string>,
  makaleHarita: Map<number, string>,
) {
  console.log('Yorumlar…');
  for (const r of satirlar) {
    if (asStr(r.deleted_at).trim()) continue;
    const tur = asStr(r.commentable_type);
    const hedefId = asInt(r.commentable_id);
    // Laravel polimorfik bağ: News → haber, Article → köşe yazısı.
    const yaziId = /Article/i.test(tur)
      ? makaleHarita.get(hedefId)
      : haberHarita.get(hedefId);
    if (!yaziId) {
      say('yorum (yazısı bulunamadı)');
      continue;
    }
    const icerik = metin(r.comment);
    if (!icerik) continue;

    say('yorum');
    if (!UYGULA || yaziId.startsWith('KURU-')) continue;
    try {
      await prisma.comment.create({
        data: {
          tenantId: KIRACI,
          articleId: yaziId,
          name: metin(r.name) ?? 'Okur',
          email: metin(r.email) ?? '',
          content: icerik,
          ipAddress: metin(r.ip_address),
          status: asInt(r.status) === 1 ? CommentStatus.APPROVED : CommentStatus.PENDING,
          createdAt: asDate(r.created_at) ?? undefined,
        },
      });
    } catch (e: any) {
      uyar(`Yorum ${asInt(r.id)} yazılamadı: ${e?.message ?? e}`);
    }
  }
  console.log(`  ${sayac.yorum ?? 0} yorum\n`);
}

// ── Medya kütüphanesi ─────────────────────────────────────────────

/**
 * Aktarılan görselleri panelin medya kütüphanesine kaydeder — müşteri eski
 * arşivdeki fotoğrafı yeni haberde tekrar kullanabilsin diye.
 */
async function medyaKutuphanesi() {
  console.log('Medya kütüphanesi…');
  if (!UYGULA) {
    console.log('  (kuru çalışma — atlandı)\n');
    return;
  }

  const satirlar = await prisma.$queryRawUnsafe<{ url: string; at: Date | null }[]>(
    `
    select url, min(at) as at from (
      select featured_image as url, published_at as at from articles
        where tenant_id = $1 and featured_image like '%/legacy/%'
      union all
      select avatar as url, null::timestamp as at from authors
        where tenant_id = $1 and avatar like '%/legacy/%'
      union all
      select cover_image as url, published_at as at from galleries
        where tenant_id = $1 and cover_image like '%/legacy/%'
      union all
      select gi.url, g.published_at as at from gallery_images gi
        join galleries g on g.id = gi.gallery_id
        where g.tenant_id = $1 and gi.url like '%/legacy/%'
    ) t
    where url is not null
    group by url
    `,
    KIRACI,
  );

  const bilinen = new Set(
    (
      await prisma.media.findMany({
        where: { tenantId: KIRACI },
        select: { url: true },
      })
    ).map((m) => m.url),
  );

  const MIME: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
  };

  const bekleyen = satirlar.filter((r) => r.url && !bilinen.has(r.url));
  say('medya kütüphanesi kaydı', bekleyen.length);
  say('medya kütüphanesi (zaten kayıtlı)', satirlar.length - bekleyen.length);

  const PARCA = 1000;
  for (let i = 0; i < bekleyen.length; i += PARCA) {
    const dilim = bekleyen.slice(i, i + PARCA);
    await prisma.media.createMany({
      data: dilim.map((r) => {
        const dosyaAdi = decodeURIComponent(r.url.split('/').pop() ?? '');
        const uzanti = path.extname(dosyaAdi).toLowerCase();
        return {
          tenantId: KIRACI,
          type: 'IMAGE' as const,
          filename: dosyaAdi,
          originalName: dosyaAdi,
          mimeType: MIME[uzanti] ?? 'image/jpeg',
          size: 0, // eski sistemde saklanmıyordu
          url: r.url,
          createdAt: r.at ?? undefined,
        };
      }),
      skipDuplicates: true,
    });
  }
  console.log(`  ${satirlar.length} görsel · ${bekleyen.length} yeni kayıt\n`);
}

// ── Çıktılar ──────────────────────────────────────────────────────

function kapaksizCsvYaz() {
  if (!kapaksizlar.length) return;
  fs.mkdirSync(CIKTI, { recursive: true });
  const yol = path.join(CIKTI, 'kudus-kapaksiz-haberler.csv');
  const satirlar = [
    'eski_id,slug,baslik',
    ...kapaksizlar.map(
      (k) => `${k.id},"${k.slug}","${k.baslik.replace(/"/g, '""')}"`,
    ),
  ];
  fs.writeFileSync(yol, satirlar.join('\n'), 'utf8');
  console.log(`Kapaksız haberler → ${yol} (${kapaksizlar.length} satır)\n`);
}

function rapor() {
  console.log('═'.repeat(66));
  console.log('  ÖZET');
  console.log('═'.repeat(66));
  for (const [k, n] of Object.entries(sayac).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${k.padEnd(44)} ${n.toLocaleString('tr-TR').padStart(8)}`);
  }
  const eksikler = Object.entries(medya.eksikler);
  if (eksikler.length) {
    console.log('\n  GÖRSEL ÇÖZÜMLEME');
    for (const [k, n] of eksikler.sort((a, b) => b[1] - a[1])) {
      console.log(`  ${k.padEnd(44)} ${n.toLocaleString('tr-TR').padStart(8)}`);
    }
  }
  if (uyarilar.length) {
    console.log('\n  UYARILAR (ilk 60)');
    for (const u of uyarilar) console.log(`  · ${u}`);
  }
  console.log('═'.repeat(66));
  console.log(
    UYGULA
      ? '\n✅ Aktarım tamamlandı.\n'
      : '\n👀 Kuru çalışmaydı — hiçbir şey yazılmadı. Yazmak için --apply ekle.\n',
  );
}

main()
  .catch((e) => {
    console.error('\n❌ HATA:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
