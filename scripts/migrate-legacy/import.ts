/**
 * Kayseri Times (Laravel/MySQL) → HaberSite (Prisma/PostgreSQL) aktarımı.
 *
 * Kullanım:
 *   # Önizleme — hiçbir şey yazmaz, ne olacağını raporlar
 *   npx ts-node scripts/migrate-legacy/import.ts \
 *     --dump ~/Downloads/kayseritimes.sql \
 *     --tenant cmslriv4w00002ro27zqey2mz \
 *     --cdn https://kayseritimes-cdn.makasda.com
 *
 *   # Gerçekten yaz
 *   ... --apply
 *
 *   # Mevcut test içeriğini temizleyerek yaz
 *   ... --apply --purge
 *
 * Tasarım notları:
 *  - Varsayılan KURU ÇALIŞMA. Yazmak için --apply şart.
 *  - Tekrar çalıştırılabilir: slug üzerinden upsert edilir, kopya oluşmaz.
 *  - Şifre hash'leri AKTARILMAZ. Eski sistem farklı algoritma kullanıyor ve
 *    başkasının hash'ini taşımak doğru değil; yazarlar davet linkiyle kendi
 *    şifresini belirler (bkz. --invites çıktısı).
 *  - Slug'lar korunur — 42 binden fazla adres Google'da indeksli.
 */
import * as fs from 'fs';
import * as path from 'path';
import { randomBytes, createHash } from 'crypto';
// Auth servisiyle AYNI kütüphane olmalı — yoksa üretilen hash doğrulanamaz.
import * as bcrypt from 'bcryptjs';
import { PrismaClient, ArticleStatus, NoticeType, CommentStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import slugify from 'slugify';
import {
  readColumnOrder,
  readRows,
  asStr,
  asInt,
  asBool,
  asDate,
  type Row,
} from './mysql-dump-reader';
import { createMediaResolver } from './media-url';

// ── Argümanlar ────────────────────────────────────────────────────

function arg(name: string, fallback?: string): string {
  const i = process.argv.indexOf(`--${name}`);
  if (i >= 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--')) {
    return process.argv[i + 1];
  }
  if (fallback !== undefined) return fallback;
  throw new Error(`--${name} zorunlu`);
}
const flag = (name: string) => process.argv.includes(`--${name}`);

const DUMP = arg('dump');
const TENANT_ID = arg('tenant');
const CDN = arg('cdn');
const APPLY = flag('apply');
const PURGE = flag('purge');
const LIMIT = Number(arg('limit', '0')) || 0; // 0 = sınırsız (test için)
const INVITE_DAYS = Number(arg('invite-days', '14'));
const OUT_DIR = arg('out', path.join(process.cwd(), 'migration-output'));
/**
 * Gorsellerin R2'de bulundugu tenant klasoru. Normalde --tenant ile ayni,
 * ama yerel denemede icerik local veritabanina yazilirken dosyalar prod
 * tenant klasorune yuklenmis olabilir. O durumda gorsel adresleri 404
 * dondugu icin yol bu secenekle ayri verilir.
 */
const MEDIA_TENANT = arg('media-tenant', TENANT_ID);

// ── Sabitler ──────────────────────────────────────────────────────

const TABLES = new Set([
  'haberkategori',
  'yazarlar',
  'haberler',
  'makaleler',
  'videolar',
  'yorumlar',
  'resmi_ilanlar',
  'galeriler',
  'galeriresim',
  'haberresim',
  'settings',
  'sayfa',
  'kunye',
]);

/** Aynı anda tek INSERT'te gönderilecek kayıt sayısı. */
const BATCH = 500;

const media = createMediaResolver({ cdnBaseUrl: CDN, tenantId: MEDIA_TENANT });

// ── Yardımcılar ───────────────────────────────────────────────────

const stats: Record<string, number> = {};
const bump = (k: string, n = 1) => (stats[k] = (stats[k] ?? 0) + n);
const warnings: string[] = [];
const warn = (m: string) => {
  if (warnings.length < 60) warnings.push(m);
  bump('uyarı');
};

function makeSlug(source: string, fallbackId: number | string): string {
  const s = slugify(source, { lower: true, strict: true, locale: 'tr' });
  return s || `icerik-${fallbackId}`;
}

/** Eski `Durum` bayrağı → yayın durumu. */
const statusOf = (durum: unknown): ArticleStatus =>
  asBool(durum) ? ArticleStatus.PUBLISHED : ArticleStatus.DRAFT;

/** Boş olmayan ilk metni döner. */
const firstText = (...vals: unknown[]): string | null => {
  for (const v of vals) {
    const s = asStr(v).trim();
    if (s) return s;
  }
  return null;
};

/** İçerik HTML'i — kendi sunucumuzdaki görseller CDN'e taşınır. */
const contentJson = (icerik: unknown) => ({
  html: media.rewriteHtml(asStr(icerik)),
});

// ── Prisma ────────────────────────────────────────────────────────

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL tanımlı değil');
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
  log: ['warn', 'error'],
});

// ── Ana akış ──────────────────────────────────────────────────────

async function main() {
  console.log('═'.repeat(66));
  console.log('  KAYSERİ TIMES → HABERSITE AKTARIMI');
  console.log('═'.repeat(66));
  console.log(`  Dump    : ${DUMP}`);
  console.log(`  Tenant  : ${TENANT_ID}`);
  console.log(`  CDN     : ${CDN}`);
  if (MEDIA_TENANT !== TENANT_ID) {
    console.log(`  Medya   : uploads/${MEDIA_TENANT}/legacy  (--media-tenant)`);
  }
  console.log(`  Mod     : ${APPLY ? '⚠️  YAZMA (--apply)' : '👀 ÖNİZLEME (kuru çalışma)'}`);
  if (PURGE) console.log('  Temizle : ⚠️  mevcut içerik silinecek (--purge)');
  if (LIMIT) console.log(`  Limit   : ${LIMIT} haber (test)`);
  console.log('═'.repeat(66) + '\n');

  const tenant = await prisma.tenant.findUnique({
    where: { id: TENANT_ID },
    select: { id: true, name: true, mediaBaseUrl: true },
  });
  if (!tenant) throw new Error(`Tenant bulunamadı: ${TENANT_ID}`);
  console.log(`Tenant doğrulandı: ${tenant.name}`);
  if (tenant.mediaBaseUrl && tenant.mediaBaseUrl.replace(/\/$/, '') !== CDN.replace(/\/$/, '')) {
    warn(
      `Tenant'ın kayıtlı CDN adresi (${tenant.mediaBaseUrl}) --cdn ile aynı değil. ` +
        `Yeni yüklemeler farklı adresten servis edilir.`,
    );
  }

  // İçerik oluşturucu kullanıcı — Article.createdById zorunlu.
  const importer = await resolveImporter();
  console.log(`İçerik sahibi kullanıcı: ${importer.email}\n`);

  if (PURGE && APPLY) await purge();

  const cols = await readColumnOrder(DUMP);

  // Aktarımı iki geçişte yapıyoruz: önce referans verileri (kategori, yazar)
  // toplanır ve yazılır, sonra onlara bağlı içerik akış halinde işlenir.
  const legacy = {
    categories: [] as Row[],
    authors: [] as Row[],
    galleries: [] as Row[],
    galleryImages: [] as Row[],
    articleImages: [] as Row[],
    comments: [] as Row[],
    notices: [] as Row[],
    videos: [] as Row[],
    settings: [] as Row[],
    pages: [] as Row[],
    imprint: [] as Row[],
  };

  console.log('Dump okunuyor (referans tabloları)…');
  for await (const { table, row } of readRows(DUMP, TABLES, cols)) {
    switch (table) {
      case 'haberkategori': legacy.categories.push(row); break;
      case 'yazarlar': legacy.authors.push(row); break;
      case 'galeriler': legacy.galleries.push(row); break;
      case 'galeriresim': legacy.galleryImages.push(row); break;
      case 'haberresim': legacy.articleImages.push(row); break;
      case 'yorumlar': legacy.comments.push(row); break;
      case 'resmi_ilanlar': legacy.notices.push(row); break;
      case 'videolar': legacy.videos.push(row); break;
      case 'settings': legacy.settings.push(row); break;
      case 'sayfa': legacy.pages.push(row); break;
      case 'kunye': legacy.imprint.push(row); break;
      default: break; // haberler/makaleler ikinci geçişte
    }
  }
  console.log(
    `  kategori ${legacy.categories.length} · yazar ${legacy.authors.length} · ` +
      `video ${legacy.videos.length} · galeri ${legacy.galleries.length} · ` +
      `yorum ${legacy.comments.length} · resmi ilan ${legacy.notices.length}\n`,
  );

  const categoryMap = await importCategories(legacy.categories);
  const { authorMap, invites } = await importAuthors(legacy.authors);

  const { map: articleMap, slugs: articleSlugs } = await importArticles(
    cols,
    categoryMap,
    importer.id,
  );
  await importColumns(cols, authorMap, importer.id, articleSlugs);
  await importVideos(legacy.videos);
  await importGalleries(legacy.galleries, legacy.galleryImages);
  await importArticleGalleries(legacy.articleImages, articleMap);
  await importComments(legacy.comments, articleMap);
  await importNotices(legacy.notices);
  await importSettings(legacy.settings);
  await importPages(legacy.pages);
  await importImprint(legacy.imprint);
  await buildMediaLibrary();

  writeInvitesCsv(invites);
  report();
}

// ── Kullanıcı ─────────────────────────────────────────────────────

async function resolveImporter() {
  const existing = await prisma.user.findFirst({
    where: { tenantId: TENANT_ID, role: { in: ['ADMIN', 'SUPER_ADMIN'] }, active: true },
    select: { id: true, email: true },
    orderBy: { createdAt: 'asc' },
  });
  if (existing) return existing;
  if (!APPLY) return { id: 'DRY-RUN', email: '(kuru çalışma)' };
  throw new Error(
    'Tenant içinde aktif ADMIN kullanıcı bulunamadı — içerik sahibi atanamaz.',
  );
}

// ── Temizlik ──────────────────────────────────────────────────────

/**
 * Tenant'taki mevcut içeriği siler. Test verisinin 42 bin gerçek haberle
 * karışmasını engeller. Kullanıcılar ve ayarlar KORUNUR.
 */
async function purge() {
  console.log('Mevcut içerik temizleniyor…');
  const c1 = await prisma.article.deleteMany({ where: { tenantId: TENANT_ID } });
  const c2 = await prisma.video.deleteMany({ where: { tenantId: TENANT_ID } });
  const c3 = await prisma.gallery.deleteMany({ where: { tenantId: TENANT_ID } });
  const c4 = await prisma.author.deleteMany({ where: { tenantId: TENANT_ID } });
  const c5 = await prisma.officialNotice.deleteMany({ where: { tenantId: TENANT_ID } });
  // Haber silinince `article_media` cascade ile gidiyor ama `media` satırları
  // sahipsiz kalıyor. Bunlar bir sonraki içe aktarımda yeniden üretildiği için
  // temizlenmezse panelin medya kütüphanesinde katman katman birikiyorlar.
  // Yalnızca migration'ın ürettiği kayıtlara dokunuyoruz: panelden yüklenen
  // dosyaların adresi `/uploads/<tenant>/<yıl>/<ay>/` biçiminde, `legacy`
  // segmenti taşımıyor.
  const c6 = await prisma.media.deleteMany({
    where: { tenantId: TENANT_ID, url: { contains: '/legacy/' } },
  });
  // Tenant açılırken oluşturulan demo kategorileri (Kayseri, Magazin, Eğitim,
  // Bilim ve Teknoloji…) eski sitede karşılığı olmadığı için içi boş kalıyor.
  // Menüde ilk sırada göründükleri için ziyaretçi "hiç haber yok" sayfasına
  // düşüyordu. Haberler zaten silindiği için burada FK sorunu yok; eski
  // sitenin kategorileri hemen ardından yeniden oluşturuluyor.
  const c7 = await prisma.category.deleteMany({ where: { tenantId: TENANT_ID } });
  console.log(
    `  silindi → haber ${c1.count} · video ${c2.count} · galeri ${c3.count} · ` +
      `yazar ${c4.count} · resmi ilan ${c5.count} · medya ${c6.count} · ` +
      `kategori ${c7.count}\n`,
  );
  // Statik sayfalar ve künye slug üzerinden upsert edildiği için silmeye gerek
  // yok — aksi halde müşterinin panelden eklediği sayfalar da uçardı.
}

// ── Kategoriler ───────────────────────────────────────────────────

async function importCategories(rows: Row[]): Promise<Map<number, string>> {
  console.log('Kategoriler…');
  const map = new Map<number, string>();

  for (const r of rows) {
    const legacyId = asInt(r.Id);
    const name = asStr(r.Baslik).trim();
    if (!name) { warn(`Kategori ${legacyId}: adı boş, atlandı`); continue; }
    const slug = firstText(r.Seo) ?? makeSlug(name, legacyId);

    if (!APPLY) {
      map.set(legacyId, `DRY-${slug}`);
      bump('kategori');
      continue;
    }

    const saved = await prisma.category.upsert({
      where: { tenantId_slug: { tenantId: TENANT_ID, slug } },
      update: {
        name,
        color: firstText(r.Renk) ?? undefined,
        sortOrder: asInt(r.Sira),
        active: asBool(r.Durum),
      },
      create: {
        tenantId: TENANT_ID,
        name,
        slug,
        color: firstText(r.Renk),
        sortOrder: asInt(r.Sira),
        active: asBool(r.Durum),
      },
      select: { id: true },
    });
    map.set(legacyId, saved.id);
    bump('kategori');
  }

  console.log(`  ${stats.kategori ?? 0} kategori\n`);
  return map;
}

// ── Yazarlar ──────────────────────────────────────────────────────

type Invite = {
  name: string;
  email: string;
  role: string;
  link: string;
  expires: string;
};

async function importAuthors(rows: Row[]) {
  console.log('Yazarlar…');
  const authorMap = new Map<number, string>();
  const invites: Invite[] = [];
  const seenEmails = new Set<string>();

  for (const r of rows) {
    const legacyId = asInt(r.Id);
    const name = asStr(r.AdSoyad).trim();
    if (!name) { warn(`Yazar ${legacyId}: adı boş, atlandı`); continue; }

    const slug = firstText(r.Seo, r.Perma) ?? makeSlug(name, legacyId);
    const avatar = media.file('yazarlar', asStr(r.Resim));
    const bio = firstText(r.KullaniciHakkinda);
    const social = {
      twitter: firstText(r.Twitter),
      facebook: firstText(r.Facebook),
      instagram: firstText(r.Instragram), // eski şemada yazım hatası böyle
      youtube: firstText(r.Youtube),
      linkedin: firstText(r.Linkedin),
    };
    const email = asStr(r.KullaniciMail).trim().toLowerCase();

    if (APPLY) {
      const saved = await prisma.author.upsert({
        where: { tenantId_slug: { tenantId: TENANT_ID, slug } },
        update: { name, bio, avatar, active: asBool(r.Durum), social },
        create: {
          tenantId: TENANT_ID,
          name,
          slug,
          bio,
          avatar,
          email: email || null,
          active: asBool(r.Durum),
          sortOrder: asInt(r.Sira),
          social,
        },
        select: { id: true },
      });
      authorMap.set(legacyId, saved.id);
    } else {
      authorMap.set(legacyId, `DRY-${slug}`);
    }
    bump('yazar');

    // Panele girecek hesap — yalnızca geçerli ve tekil e-posta varsa.
    const validEmail = /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(email);
    if (!validEmail) { bump('yazar (e-postasız, hesap açılmadı)'); continue; }
    // Punycode/hatalı alan adları (ör. gmaıl.com) hesap açmaya değmez.
    if (email.includes('xn--')) {
      warn(`Yazar "${name}": e-posta alan adı hatalı görünüyor, hesap açılmadı`);
      continue;
    }
    if (seenEmails.has(email)) {
      warn(`Yazar "${name}": e-posta tekrar ediyor (${email}), hesap açılmadı`);
      continue;
    }
    seenEmails.add(email);

    const invite = await createUserWithInvite(name, email);
    if (invite) invites.push(invite);
  }

  console.log(
    `  ${stats.yazar ?? 0} yazar · ${invites.length} panel hesabı (davet linki üretildi)\n`,
  );
  return { authorMap, invites };
}

/**
 * Hesabı rastgele — kimsenin bilmediği — bir şifreyle açar ve şifre belirleme
 * token'ı üretir. Böylece hiçbir yerde düz metin geçici şifre dolaşmaz.
 */
async function createUserWithInvite(name: string, email: string): Promise<Invite | null> {
  const token = randomBytes(32).toString('base64url');
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const expiresAt = new Date(Date.now() + INVITE_DAYS * 86400_000);
  const link = `${process.env.ADMIN_URL ?? 'https://admin.makasda.com'}/sifre-belirle?token=${token}`;
  const invite: Invite = {
    name,
    email,
    role: 'COLUMNIST',
    link,
    expires: expiresAt.toISOString().slice(0, 10),
  };

  if (!APPLY) return invite;

  const randomPassword = randomBytes(24).toString('base64url');
  const passwordHash = await bcrypt.hash(randomPassword, 10);

  try {
    await prisma.user.upsert({
      where: { tenantId_email: { tenantId: TENANT_ID, email } },
      update: {
        passwordResetTokenHash: tokenHash,
        passwordResetExpiresAt: expiresAt,
      },
      create: {
        tenantId: TENANT_ID,
        email,
        name,
        role: 'COLUMNIST',
        passwordHash,
        passwordResetTokenHash: tokenHash,
        passwordResetExpiresAt: expiresAt,
      },
    });
    bump('panel hesabı');
    return invite;
  } catch (e: any) {
    warn(`Hesap açılamadı (${email}): ${e?.message ?? e}`);
    return null;
  }
}

// ── Haberler ──────────────────────────────────────────────────────

/**
 * Eski `haberler` tablosunda tek bir görsel alanı değil dokuz tane var:
 * `Resim` asıl kapak, `MResim` manşet, `DResim` dar manşet, geri kalanı
 * bunların WebP/AMP/thumbnail türevleri. Editörler bazı haberleri doğrudan
 * manşetten girmiş ve `Resim` alanı boş kalmış.
 *
 * Yalnızca `Resim`'e bakmak 41.939 haberin 97'sini görselsiz bırakıyordu.
 * Ölçüm (dump + arşiv karşılaştırması): `Resim` boş olan 220 haberden
 * 97'sinin dosyası diskte MResim/DResim/AMPWebp altında mevcut, 122'sinin
 * hiçbir görsel kaydı yok, 1'inin adresi var ama dosyası silinmiş.
 *
 * Sıralama kaliteye göre: tam boy → manşet → dar manşet → türevler. WebP
 * sürümleri en sonda, çünkü çoğu kırpılmış/küçültülmüş.
 */
const IMAGE_COLUMNS = [
  'Resim',
  'MResim',
  'DResim',
  'ResimWebp',
  'MResimWebp',
  'DResimWebp',
  'AMPWebp',
  'Thumb',
  'ThumbWebp',
] as const;

function pickImage(row: Row): string | null {
  for (const col of IMAGE_COLUMNS) {
    const url = media.file('haberler', asStr(row[col]));
    if (url) {
      if (col !== 'Resim') bump(`haber görseli ${col}'den alındı`);
      return url;
    }
  }
  return null;
}

async function importArticles(
  cols: Map<string, string[]>,
  categoryMap: Map<number, string>,
  createdById: string,
): Promise<{ map: Map<number, string>; slugs: Set<string> }> {
  console.log('Haberler (akış halinde)…');
  const map = new Map<number, string>();
  const seenSlugs = new Set<string>();
  let processed = 0;

  let buffer: { legacyId: number; data: any; catIds: string[] }[] = [];

  const flush = async () => {
    if (!buffer.length) return;
    if (!APPLY) {
      // Önizlemede de haritayı doldur — yorum/galeri eşleşmelerinin
      // gerçekten tuttuğunu kuru çalışmada görebilmek için.
      for (const item of buffer) map.set(item.legacyId, `DRY-${item.data.slug}`);
      buffer = [];
      return;
    }
    {
      for (const item of buffer) {
        try {
          const saved = await prisma.article.upsert({
            where: { tenantId_slug: { tenantId: TENANT_ID, slug: item.data.slug } },
            update: item.data,
            create: { ...item.data, createdById },
            select: { id: true },
          });
          map.set(item.legacyId, saved.id);

          if (item.catIds.length) {
            // Yeniden çalıştırmada kopya bağ oluşmasın.
            await prisma.articleCategory.deleteMany({ where: { articleId: saved.id } });
            await prisma.articleCategory.createMany({
              data: item.catIds.map((categoryId, i) => ({
                articleId: saved.id,
                categoryId,
                primary: i === 0,
              })),
              skipDuplicates: true,
            });
          }
        } catch (e: any) {
          warn(`Haber ${item.legacyId} yazılamadı: ${e?.message ?? e}`);
        }
      }
    }
    buffer = [];
  };

  for await (const { table, row } of readRows(DUMP, new Set(['haberler']), cols)) {
    if (table !== 'haberler') continue;
    if (LIMIT && processed >= LIMIT) break;

    const legacyId = asInt(row.Id);
    const title = firstText(row.HaberBaslik, row.HaberBaslik2, row.HaberBaslik3);
    if (!title) { warn(`Haber ${legacyId}: başlık boş, atlandı`); continue; }

    let slug = firstText(row.Slug) ?? makeSlug(title, legacyId);
    if (seenSlugs.has(slug)) {
      // Kaynak veritabaninda ayni slug birden fazla haberde gecebiliyor
      // (ayni basliktan iki haber). Eski site bunlardan yalnizca birini
      // servis edebiliyordu; ilk gelen kanonik kabul edilip sonrakine
      // kimlik ekleniyor. Sayi yuksek oldugu icin uyari yerine sayac.
      slug = `${slug}-${legacyId}`;
      bump('haber (slug cakismasi cozuldu)');
    }
    seenSlugs.add(slug);

    const publishedAt = asDate(row.Olusturulma);
    const catIds = asStr(row.KatId)
      .split(',')
      .map((s) => categoryMap.get(asInt(s.trim())))
      .filter((v): v is string => Boolean(v));
    if (!catIds.length && asStr(row.KatId).trim()) {
      bump('haber (kategorisi eşleşmedi)');
    }

    const data = {
      tenantId: TENANT_ID,
      title,
      slug,
      spot: firstText(row.Ozet),
      content: contentJson(row.Icerik),
      featuredImage: pickImage(row),
      status: statusOf(row.Durum),
      publishedAt,
      viewCount: asInt(row.Okunma),
      featured: asBool(row.Manset),
      breakingLabel: asBool(row.SonDakika) ? 'SON DAKİKA' : null,
      seoTitle: firstText(row.MetaKey) ? null : null, // MetaKey anahtar listesi, başlık değil
      seoDesc: firstText(row.MetaDesc),
      source: firstText(row.Mahrec),
      sourceUrl: firstText(row.Canonical),
      readingTime: Math.max(1, Math.ceil(asStr(row.Icerik).replace(/<[^>]+>/g, ' ').split(/\s+/).length / 200)),
      createdAt: publishedAt ?? undefined,
    };

    buffer.push({ legacyId, data, catIds });
    processed++;
    bump('haber');

    if (buffer.length >= BATCH) {
      await flush();
      process.stdout.write(`\r  ${processed.toLocaleString('tr-TR')} haber işlendi…`);
    }
  }
  await flush();
  process.stdout.write(`\r  ${processed.toLocaleString('tr-TR')} haber işlendi.        \n\n`);
  return { map, slugs: seenSlugs };
}

// ── Köşe yazıları ─────────────────────────────────────────────────

async function importColumns(
  cols: Map<string, string[]>,
  authorMap: Map<number, string>,
  createdById: string,
  /**
   * Haber aktarımında kullanilan slug'lar. Ayni slug'a sahip bir kose yazisi
   * upsert edildiginde MEVCUT HABERI gunceller ve turunu COLUMN'a cevirir —
   * yani haber kaybolur. Denemede 4 haber bu sekilde uzerine yazildi.
   */
  articleSlugs: Set<string>,
) {
  console.log('Köşe yazıları…');
  // Haber slug'lariyla ayni havuzu paylas.
  const seenSlugs = new Set<string>(articleSlugs);

  for await (const { table, row } of readRows(DUMP, new Set(['makaleler']), cols)) {
    if (table !== 'makaleler') continue;

    const legacyId = asInt(row.Id);
    const title = firstText(row.HaberBaslik);
    if (!title) { warn(`Makale ${legacyId}: başlık boş, atlandı`); continue; }

    let slug = firstText(row.Slug) ?? makeSlug(title, legacyId);
    if (seenSlugs.has(slug)) {
      slug = `${slug}-${legacyId}`;
      bump('kose yazisi (slug cakismasi cozuldu)');
    }
    seenSlugs.add(slug);

    const authorId = authorMap.get(asInt(row.Yazar)) ?? null;
    if (!authorId) bump('makale (yazarı eşleşmedi)');
    const publishedAt = asDate(row.Olusturulma);

    const data = {
      tenantId: TENANT_ID,
      type: 'COLUMN' as const,
      title,
      slug,
      spot: firstText(row.Ozet),
      content: contentJson(row.Icerik),
      featuredImage: media.file('makaleler', asStr(row.Resim)),
      status: statusOf(row.Durum),
      publishedAt,
      viewCount: asInt(row.Okunma),
      featured: asBool(row.Manset),
      seoDesc: firstText(row.MetaDesc),
      authorId: authorId && !authorId.startsWith('DRY-') ? authorId : null,
      createdAt: publishedAt ?? undefined,
    };

    bump('köşe yazısı');
    if (!APPLY) continue;

    try {
      await prisma.article.upsert({
        where: { tenantId_slug: { tenantId: TENANT_ID, slug } },
        update: data,
        create: { ...data, createdById },
      });
    } catch (e: any) {
      warn(`Makale ${legacyId} yazılamadı: ${e?.message ?? e}`);
    }
  }
  console.log(`  ${stats['köşe yazısı'] ?? 0} köşe yazısı\n`);
}

// ── Videolar ──────────────────────────────────────────────────────

async function importVideos(rows: Row[]) {
  console.log('Videolar…');
  const seen = new Set<string>();

  for (const r of rows) {
    const legacyId = asInt(r.Id);
    // Eski şemada video başlığı `VideoBaslik` — haber tablosundaki
    // `HaberBaslik` ile karıştırılmamalı.
    const title = firstText(r.VideoBaslik, r.VideoBaslik2, r.VideoBaslik3);
    if (!title) { warn(`Video ${legacyId}: başlık boş, atlandı`); continue; }

    let slug = firstText(r.Slug) ?? makeSlug(title, legacyId);
    if (seen.has(slug)) slug = `${slug}-${legacyId}`;
    seen.add(slug);

    // Kaynak: `Embed` gömülü oynatıcı kodu, `Flv`/`Link` dosya veya harici adres.
    const embed = firstText(r.Embed);
    const linked = firstText(r.Flv, r.Link) ?? '';
    const cover = media.file('videogaleri', asStr(r.Resim));
    // Yerel dosya adı verilmişse videogaleri klasöründen çözülür.
    const localVideo = /^https?:\/\//i.test(linked)
      ? linked
      : (media.file('videogaleri', linked) ?? '');
    const publishedAt = asDate(r.Olusturulma);

    const data = {
      tenantId: TENANT_ID,
      title,
      slug,
      description: firstText(r.Ozet, r.Icerik),
      coverImage: cover,
      videoUrl: localVideo || '',
      embedCode: embed,
      source: /youtu/i.test(embed ?? '') || /youtu/i.test(localVideo) ? 'youtube' : 'upload',
      status: statusOf(r.Durum),
      publishedAt,
      viewCount: asInt(r.Okunma),
      seoDesc: firstText(r.MetaDesc),
      createdAt: publishedAt ?? undefined,
    };

    // videoUrl zorunlu; yalnızca embed kodu varsa oynatıcı onu kullanır.
    if (!data.videoUrl && !data.embedCode) {
      warn(`Video ${legacyId}: ne kaynak adresi ne embed kodu var, atlandı`);
      continue;
    }
    bump('video');
    if (!APPLY) continue;

    try {
      await prisma.video.upsert({
        where: { tenantId_slug: { tenantId: TENANT_ID, slug } },
        update: data,
        create: data,
      });
    } catch (e: any) {
      warn(`Video ${legacyId} yazılamadı: ${e?.message ?? e}`);
    }
  }
  console.log(`  ${stats.video ?? 0} video\n`);
}

// ── Foto galeriler ────────────────────────────────────────────────

async function importGalleries(galleries: Row[], images: Row[]) {
  console.log('Foto galeriler…');
  const byGallery = new Map<number, Row[]>();
  for (const img of images) {
    const gid = asInt(img.GaleriId ?? img.Galeri ?? img.GaleriID);
    if (!byGallery.has(gid)) byGallery.set(gid, []);
    byGallery.get(gid)!.push(img);
  }

  for (const g of galleries) {
    const legacyId = asInt(g.Id);
    const title = firstText(g.HaberBaslik, g.Baslik);
    if (!title) { warn(`Galeri ${legacyId}: başlık boş, atlandı`); continue; }
    const slug = firstText(g.Slug) ?? makeSlug(title, legacyId);
    const publishedAt = asDate(g.Olusturulma);
    const items = byGallery.get(legacyId) ?? [];

    bump('galeri');
    bump('galeri görseli', items.length);
    if (!APPLY) continue;

    try {
      const saved = await prisma.gallery.upsert({
        where: { tenantId_slug: { tenantId: TENANT_ID, slug } },
        update: {
          title,
          description: firstText(g.Ozet),
          coverImage: media.file('galeri', asStr(g.Resim)),
          status: statusOf(g.Durum),
          publishedAt,
          viewCount: asInt(g.Okunma),
        },
        create: {
          tenantId: TENANT_ID,
          title,
          slug,
          description: firstText(g.Ozet),
          coverImage: media.file('galeri', asStr(g.Resim)),
          status: statusOf(g.Durum),
          publishedAt,
          viewCount: asInt(g.Okunma),
          createdAt: publishedAt ?? undefined,
        },
        select: { id: true },
      });

      await prisma.galleryImage.deleteMany({ where: { galleryId: saved.id } });
      const data = items
        .map((img, i) => ({
          galleryId: saved.id,
          url: media.file('galeri', asStr(img.Resim)) ?? '',
          caption: firstText(img.Ozet),
          sortOrder: asInt(img.Sira) || i,
        }))
        .filter((d) => d.url);
      if (data.length) await prisma.galleryImage.createMany({ data });
    } catch (e: any) {
      warn(`Galeri ${legacyId} yazılamadı: ${e?.message ?? e}`);
    }
  }
  console.log(`  ${stats.galeri ?? 0} galeri · ${stats['galeri görseli'] ?? 0} görsel\n`);
}

// ── Haber içi galeri görselleri ───────────────────────────────────

async function importArticleGalleries(rows: Row[], articleMap: Map<number, string>) {
  console.log('Haber galerileri…');

  // Aynı görsel birden fazla haberde kullanılabiliyor; tek bir media satırını
  // paylaşsınlar diye çalışma boyunca url→id eşlemesi tutuyoruz.
  const mediaIdByUrl = new Map<string, string>();

  for (const r of rows) {
    const articleId = articleMap.get(asInt(r.HaberId));
    const url = media.file('habergaleri', asStr(r.Resim));
    if (!url) continue;
    if (!articleId) { bump('haber galerisi (haberi eşleşmedi)'); continue; }

    bump('haber galeri görseli');
    if (!APPLY || articleId.startsWith('DRY-')) continue;

    try {
      // `media` tablosunda (tenantId, url) üzerinde tekillik kısıtı yok, bu
      // yüzden idempotanlığı burada sağlıyoruz. Aksi halde script her
      // çalıştırmada aynı dosya için yeni bir satır üretiyor ve medya
      // kütüphanesi kopyalarla doluyor.
      const mediaId =
        mediaIdByUrl.get(url) ??
        (
          await prisma.media.findFirst({
            where: { tenantId: TENANT_ID, url },
            select: { id: true },
          })
        )?.id ??
        (
          await prisma.media.create({
            data: {
              tenantId: TENANT_ID,
              type: 'IMAGE',
              filename: asStr(r.Resim),
              originalName: path.basename(asStr(r.Resim)),
              mimeType: 'image/jpeg',
              size: 0, // eski sistemde saklanmıyordu
              url,
              title: firstText(r.Ozet),
              createdAt: asDate(r.Olusturulma) ?? undefined,
            },
            select: { id: true },
          })
        ).id;
      mediaIdByUrl.set(url, mediaId);

      await prisma.articleMedia.upsert({
        where: { articleId_mediaId: { articleId, mediaId } },
        update: {
          sortOrder: asInt(r.Sira),
          caption: firstText(r.Ozet),
        },
        create: {
          articleId,
          mediaId,
          sortOrder: asInt(r.Sira),
          caption: firstText(r.Ozet),
        },
      });
    } catch (e: any) {
      warn(`Haber galerisi yazılamadı: ${e?.message ?? e}`);
    }
  }
  console.log(`  ${stats['haber galeri görseli'] ?? 0} görsel\n`);
}

// ── Yorumlar ──────────────────────────────────────────────────────

// ── Medya kütüphanesi ─────────────────────────────────────────────

/**
 * Aktarılan görselleri panelin Medya Kütüphanesi'ne kaydeder.
 *
 * Haberin kapak görseli `articles.featured_image` içinde düz bir adres olarak
 * duruyor; `media` tablosunda karşılığı olmadığı sürece panelden ne aranabiliyor
 * ne de başka bir habere yeniden eklenebiliyor. 19 GB'lık arşivin panelde
 * "yok" görünmesinin sebebi buydu.
 *
 * Adresi veritabanından okuyoruz, dosya adına göre değil: böylece hangi
 * görselin gerçekten kullanıldığı kesin. Arşivdeki türev dosyalar (amp,
 * içerik kopyaları, silinmiş haberlerin görselleri) kütüphaneyi şişirmiyor.
 */
async function buildMediaLibrary() {
  console.log('Medya kütüphanesi…');

  // (adres, ilk kullanım tarihi) — aynı görsel birden fazla kayıtta geçebilir.
  const rows = await prisma.$queryRawUnsafe<
    { url: string; at: Date | null }[]
  >(
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
    group by url
    `,
    TENANT_ID,
  );

  const known = new Set(
    (
      await prisma.media.findMany({
        where: { tenantId: TENANT_ID },
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

  const pending = rows.filter((r) => r.url && !known.has(r.url));
  bump('medya kütüphanesi kaydı', pending.length);
  bump('medya kütüphanesi (zaten kayıtlı)', rows.length - pending.length);

  if (!APPLY) {
    console.log(`  ${rows.length} görsel · ${pending.length} yeni kayıt\n`);
    return;
  }

  const BATCH = 1000;
  let written = 0;
  for (let i = 0; i < pending.length; i += BATCH) {
    const slice = pending.slice(i, i + BATCH);
    await prisma.media.createMany({
      data: slice.map((r) => {
        const filename = decodeURIComponent(r.url.split('/').pop() ?? '');
        const ext = path.extname(filename).toLowerCase();
        return {
          tenantId: TENANT_ID,
          type: 'IMAGE' as const,
          filename,
          originalName: filename,
          mimeType: MIME[ext] ?? 'image/jpeg',
          size: 0, // eski sistemde saklanmıyordu
          url: r.url,
          // Kütüphane arşivle aynı sırada görünsün diye haberin yayın tarihi.
          createdAt: r.at ?? undefined,
        };
      }),
    });
    written += slice.length;
    if (written % 10000 === 0) process.stdout.write(`  ${written} kayıt…`);
  }

  console.log(`  ${rows.length} görsel · ${written} yeni kayıt\n`);
}

async function importComments(rows: Row[], articleMap: Map<number, string>) {
  console.log('Yorumlar…');

  for (const r of rows) {
    // Eski şemada yorumun bağlandığı içerik `VeriId`, onay bayrağı `Onay`.
    // `Tip` yorumun hangi içerik türüne ait olduğunu tutuyor; haber
    // dışındakiler (video/galeri) haber haritasında bulunamaz.
    const articleId = articleMap.get(asInt(r.VeriId));
    if (!articleId) { bump('yorum (haber dışı içerik veya eşleşmedi)'); continue; }

    const name = firstText(r.AdSoyad) ?? 'Okuyucu';
    const content = firstText(r.Yorum);
    if (!content) continue;

    bump('yorum');
    if (!APPLY || articleId.startsWith('DRY-')) continue;

    try {
      await prisma.comment.create({
        data: {
          tenantId: TENANT_ID,
          articleId,
          name,
          email: firstText(r.EMail) ?? 'bilinmiyor@example.com',
          content,
          status: asBool(r.Onay) ? CommentStatus.APPROVED : CommentStatus.PENDING,
          ipAddress: firstText(r.IP),
          createdAt: asDate(r.Tarih) ?? undefined,
        },
      });
    } catch (e: any) {
      warn(`Yorum yazılamadı: ${e?.message ?? e}`);
    }
  }
  console.log(`  ${stats.yorum ?? 0} yorum\n`);
}

// ── Resmi ilanlar ─────────────────────────────────────────────────

async function importNotices(rows: Row[]) {
  console.log('Resmi ilanlar…');

  // Bu tablo diğerlerinden farklı: kolon adları snake_case ve küçük harf
  // (sonradan, farklı bir geliştirici tarafından eklenmiş olmalı).
  for (const r of rows) {
    const legacyId = asInt(r.id);
    const title = firstText(r.baslik);
    if (!title) continue;
    const slug = makeSlug(title, legacyId);
    const publishedAt = asDate(r.yayin_baslangic_tarihi) ?? asDate(r.olusturulma_tarihi) ?? new Date();
    const expiresAt = asDate(r.yayin_bitis_tarihi);
    const content = media.rewriteHtml(asStr(r.aciklama));
    // dosya_yolu tek bir ek dosya tutuyor — yeni şemada ek listesi var.
    const file = media.file('files', asStr(r.dosya_yolu));
    const attachments = file ? [{ url: file, name: 'İlan Metni' }] : [];

    bump('resmi ilan');
    if (!APPLY) continue;

    try {
      await prisma.officialNotice.upsert({
        where: { tenantId_slug: { tenantId: TENANT_ID, slug } },
        update: { title, content, expiresAt, attachments },
        create: {
          tenantId: TENANT_ID,
          title,
          slug,
          noticeType: NoticeType.ANNOUNCEMENT,
          institution: firstText(r.kurum_adi) ?? 'Belirtilmemiş',
          referenceNo: firstText(r.ilan_no),
          content: content || title,
          attachments,
          publishedAt,
          expiresAt,
          active: asBool(r.durum),
        },
      });
    } catch (e: any) {
      warn(`Resmi ilan ${legacyId} yazılamadı: ${e?.message ?? e}`);
    }
  }
  console.log(`  ${stats['resmi ilan'] ?? 0} resmi ilan\n`);
}

// ── Çıktılar ──────────────────────────────────────────────────────

// ── Site ayarları ─────────────────────────────────────────────────

/**
 * Eski `settings` tablosu (tek satır) → yeni Setting anahtar/değer tablosu.
 * Site adı, logo, iletişim ve sosyal medya bilgileri buradan gelir; aksi
 * halde devralınan site eski müşterinin markasıyla yayınlanır.
 *
 * Logo/favicon yolları `/storage/images/...` biçiminde; `storage/` öneki
 * atılıp CDN adresine çevrilir çünkü R2'ye `images/` ağacı yüklendi.
 */
// ── Statik sayfalar ───────────────────────────────────────────────

/**
 * Eski `sayfa` tablosu → `pages`. Üç kayıt var: Çerez Politikası, Gizlilik
 * İlkeleri, İçerik Kaldırma Talebi. Hepsi hukuki metin, hepsi Google'da
 * indeksli.
 *
 * Slug'ı `SayfaLinki` kolonundan alıyoruz (`/cerez-politikasi` gibi) —
 * başlıktan üretmek Türkçe karakter dönüşümü yüzünden farklı bir adres
 * verebilir ve indeksli bağlantı kırılır.
 *
 * Site tarafında ek iş yok: `app/[slug]/page.tsx` bilinmeyen slug'ları
 * `DynamicPage` ile `pages` tablosundan okuyor.
 */
async function importPages(rows: Row[]) {
  console.log('Statik sayfalar…');

  for (const r of rows) {
    const title = firstText(r.SayfaBaslik);
    if (!title) { warn(`Sayfa ${asStr(r.Id)}: başlık boş, atlandı`); continue; }

    const link = asStr(r.SayfaLinki).trim().replace(/^\/+|\/+$/g, '');
    const slug = link || makeSlug(title, asStr(r.Id));

    bump('statik sayfa');
    if (!APPLY) continue;

    try {
      await prisma.page.upsert({
        where: { tenantId_slug: { tenantId: TENANT_ID, slug } },
        update: {
          title,
          content: contentJson(r.SayfaIcerik),
          seoDesc: firstText(r.Aciklama),
          published: asBool(r.Durum),
        },
        create: {
          tenantId: TENANT_ID,
          title,
          slug,
          content: contentJson(r.SayfaIcerik),
          seoDesc: firstText(r.Aciklama),
          published: asBool(r.Durum),
          createdAt: asDate(r.Olusturulma) ?? undefined,
        },
      });
    } catch (e: any) {
      warn(`Sayfa "${title}" yazılamadı: ${e?.message ?? e}`);
    }
  }
  console.log(`  ${stats['statik sayfa'] ?? 0} sayfa\n`);
}

// ── Künye ─────────────────────────────────────────────────────────

/**
 * Eski `kunye` tablosu → `pages` içinde `kunye` slug'lı tek sayfa.
 *
 * 5187 sayılı Basın Kanunu internet haber siteleri için künye
 * bulundurmayı zorunlu kılıyor; bu yüzden alanları tek tek taşıyoruz.
 * Tablo tek satır ve 20'den fazla kolon tutuyor (ticaret unvanı, yayıncı,
 * sorumlu yazı işleri müdürü, hukuk danışmanı, haber ajansları, UETS
 * adresi, yer sağlayıcı…), bunları okunabilir bir tabloya çeviriyoruz.
 *
 * Site `/kunye` adresinde önce `pages` tablosuna bakıyor, bulamazsa
 * ayarlardan derlenmiş kısa bir özet gösteriyordu — artık gerçek künye var.
 */
const IMPRINT_FIELDS: [keyof Row & string, string][] = [
  ['TicaretUnvani', 'Ticaret Unvanı'],
  ['Yayinci', 'Yayıncı'],
  ['TuzelKisiTemsilcisi', 'Tüzel Kişi Temsilcisi'],
  ['GenelYayinYonetmeni', 'Genel Yayın Yönetmeni'],
  ['SorumluYaziIsleriMuduru', 'Sorumlu Yazı İşleri Müdürü'],
  ['HaberMuduru', 'Haber Müdürü'],
  ['GeceVardiyasiEditoru', 'Gece Vardiyası Editörü'],
  ['Editorler', 'Editörler'],
  ['HukukDanismani', 'Hukuk Danışmanı'],
  ['MaliMusavir', 'Mali Müşavir'],
  ['HaberAjanslari', 'Haber Ajansları'],
  ['SistemYonetimi', 'Sistem Yönetimi'],
  ['Yazilim', 'Yazılım'],
  ['YonetimYeri', 'Yönetim Yeri'],
  ['IletisimTelefonu', 'İletişim Telefonu'],
  ['KurumsalEposta', 'Kurumsal E-posta'],
  ['UETSAdresi', 'UETS Adresi'],
  ['YerSaglayiciUnvan', 'Yer Sağlayıcı'],
  ['YerSaglayiciAdresi', 'Yer Sağlayıcı Adresi'],
];

/** HTML'e gömülecek metni kaçır — künye alanları düz metin. */
const esc = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

async function importImprint(rows: Row[]) {
  const r = rows[0];
  if (!r) { console.log('Künye… kayıt yok, atlandı\n'); return; }
  console.log('Künye…');

  const cells = IMPRINT_FIELDS.map(([col, label]) => {
    const value = firstText(r[col]);
    if (!value) return null;
    // Editörler/ajanslar alanları satır sonuyla ayrılmış çoklu değer tutuyor.
    const html = esc(value).replace(/\r?\n/g, '<br />');
    return `<tr><th>${esc(label)}</th><td>${html}</td></tr>`;
  }).filter(Boolean);

  bump('künye alanı', cells.length);

  const extras = [firstText(r.Diger), firstText(r.YasalUyari)]
    .filter(Boolean)
    .map((t) => `<p>${esc(t as string).replace(/\r?\n/g, '<br />')}</p>`)
    .join('\n');

  const html = `<table class="imprint-table">\n<tbody>\n${cells.join('\n')}\n</tbody>\n</table>${
    extras ? `\n${extras}` : ''
  }`;

  if (!APPLY) { console.log(`  ${cells.length} alan\n`); return; }

  try {
    await prisma.page.upsert({
      where: { tenantId_slug: { tenantId: TENANT_ID, slug: 'kunye' } },
      update: { title: 'Künye', content: { html }, published: true },
      create: {
        tenantId: TENANT_ID,
        title: 'Künye',
        slug: 'kunye',
        content: { html },
        published: true,
      },
    });
  } catch (e: any) {
    warn(`Künye yazılamadı: ${e?.message ?? e}`);
  }
  console.log(`  ${cells.length} alan\n`);
}

async function importSettings(rows: Row[]) {
  console.log('Site ayarları…');
  const r = rows[0];
  if (!r) { console.log('  ayar satırı yok, atlandı\n'); return; }

  const storagePath = (v: unknown) => {
    const raw = asStr(v).trim();
    if (!raw) return null;
    if (/^https?:\/\//i.test(raw)) return raw;
    // "/storage/images/genel/logo.png" → "genel/logo.png"
    const rel = raw.replace(/^\/?storage\/images\//, '').replace(/^\/+/, '');
    return media.file('', rel);
  };

  // WhatsApp numarası wa.me bağlantısına çevrilir; ham numara tıklanamaz.
  const waRaw = asStr(r.whatsapp).replace(/\D/g, '');
  const waUrl = waRaw
    ? `https://wa.me/${waRaw.startsWith('90') ? waRaw : '90' + waRaw.replace(/^0+/, '')}`
    : null;

  // DİKKAT: eski şemadaki isimler ZEMİNİ değil LOGONUN RENGİNİ anlatıyor.
  //   logo_light = açık renkli (beyaz) logo  → KOYU zeminde kullanılır
  //   logo_dark  = koyu renkli (siyah) logo  → AÇIK zeminde kullanılır
  // Ölçümle doğrulandı: logo-light ortalama parlaklık 255/255, logo-dark 0/255.
  // Bu yüzden varsayılan (açık temalı) logo `logo_dark`, gece modu logosu
  // `logo_light` olmalı. Ters bağlanınca beyaz logo beyaz header'da kayboluyor.
  const values: Record<string, string | null> = {
    siteTitle: firstText(r.site_name, r.site_title),
    siteDescription: firstText(r.site_description),
    siteUrl: firstText(r.site_url),
    logo: storagePath(r.logo_dark) ?? storagePath(r.logo_light),
    logoDark: storagePath(r.logo_light),
    favicon: storagePath(r.favicon),
    contactEmail: firstText(r.email),
    contactPhone: firstText(r.phone),
    contactAddress: firstText(r.address),
    facebookUrl: firstText(r.facebook),
    twitterUrl: firstText(r.twitter),
    instagramUrl: firstText(r.instagram),
    youtubeUrl: firstText(r.youtube),
    linkedinUrl: firstText(r.linkedin),
    tiktokUrl: firstText(r.tiktok),
    whatsappUrl: waUrl,
    copyrightText: firstText(r.footer_text),
    footerDescription: firstText(r.site_description),
  };

  const entries = Object.entries(values).filter(([, v]) => v);
  bump('site ayarı', entries.length);

  if (APPLY) {
    for (const [key, value] of entries) {
      await prisma.setting.upsert({
        where: { tenantId_key: { tenantId: TENANT_ID, key } },
        update: { value: value as string },
        create: { tenantId: TENANT_ID, key, value: value as string },
      });
    }
    // Tenant kaydındaki logo/favicon da güncellenir — panel bunları gösterir.
    await prisma.tenant.update({
      where: { id: TENANT_ID },
      data: {
        ...(values.siteTitle ? { name: values.siteTitle } : {}),
        ...(values.logo ? { logo: values.logo } : {}),
        ...(values.favicon ? { favicon: values.favicon } : {}),
      },
    });
  }

  console.log(`  ${entries.length} ayar aktarıldı (site adı: ${values.siteTitle ?? '—'})\n`);
}

function writeInvitesCsv(invites: Invite[]) {
  if (!invites.length) return;
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const file = path.join(OUT_DIR, 'yazar-davetleri.csv');

  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const csv = [
    ['Ad Soyad', 'E-posta', 'Rol', 'Sifre Belirleme Linki', 'Son Gecerlilik'].join(','),
    ...invites.map((i) =>
      [i.name, i.email, i.role, i.link, i.expires].map(esc).join(','),
    ),
  ].join('\n');

  fs.writeFileSync(file, '﻿' + csv, 'utf8'); // BOM — Excel Türkçe karakterler
  console.log(`Davet CSV'si yazıldı: ${file}`);
  if (!APPLY) {
    console.log('  ⚠️  KURU ÇALIŞMA — bu linkler geçerli DEĞİL, --apply ile yeniden üret.');
  }
  console.log();
}

function report() {
  console.log('═'.repeat(66));
  console.log('  SONUÇ');
  console.log('═'.repeat(66));
  for (const [k, v] of Object.entries(stats).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${k.padEnd(38)} ${v.toLocaleString('tr-TR').padStart(9)}`);
  }
  if (warnings.length) {
    console.log(`\n  UYARILAR (ilk ${warnings.length}):`);
    warnings.forEach((w) => console.log(`   · ${w}`));
  }
  console.log('═'.repeat(66));
  console.log(
    APPLY
      ? '  ✅ Aktarım tamamlandı.'
      : '  👀 Önizleme bitti — hiçbir şey yazılmadı. Yazmak için --apply ekle.',
  );
  console.log('═'.repeat(66));
}

main()
  .catch((e) => {
    console.error('\n❌ HATA:', e?.message ?? e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
