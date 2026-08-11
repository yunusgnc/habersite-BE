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
]);

/** Aynı anda tek INSERT'te gönderilecek kayıt sayısı. */
const BATCH = 500;

const media = createMediaResolver({ cdnBaseUrl: CDN, tenantId: TENANT_ID });

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
  console.log(
    `  silindi → haber ${c1.count} · video ${c2.count} · galeri ${c3.count} · ` +
      `yazar ${c4.count} · resmi ilan ${c5.count}\n`,
  );
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
      featuredImage: media.file('haberler', asStr(row.Resim)),
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

  for (const r of rows) {
    const articleId = articleMap.get(asInt(r.HaberId));
    const url = media.file('habergaleri', asStr(r.Resim));
    if (!url) continue;
    if (!articleId) { bump('haber galerisi (haberi eşleşmedi)'); continue; }

    bump('haber galeri görseli');
    if (!APPLY || articleId.startsWith('DRY-')) continue;

    try {
      const m = await prisma.media.create({
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
      });
      await prisma.articleMedia.create({
        data: {
          articleId,
          mediaId: m.id,
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
