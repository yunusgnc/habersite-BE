import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';
import { PrismaClient, ArticleStatus, ArticleType, MediaType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

/**
 * ESKİ SİTEDEN HABER AKTARIMI — kapak görselleriyle birlikte.
 *
 * NEDEN: yeni bir müşteri açıldığında site bomboş başlıyor. Müşterinin
 * halihazırda yayında olan sitesinden son N haberi (metin + kapak) alıp
 * kendi kiracısına taşıyoruz; müşteri panele girdiğinde dolu bir site
 * görüyor ve eski içerik yeni tasarımda nasıl duruyor görebiliyor.
 *
 * GÖRSELLER KOPYALANIR, LİNKLENMEZ: kapak eski siteden indirilip bizim
 * depomuza (R2) `uploads/{kiraciId}/...` altına yüklenir. Her kiracının
 * kendi klasörü olduğu için başka müşterinin medyasıyla karışmaz; eski
 * site kapansa da görseller yaşamaya devam eder.
 *
 * KAYNAK SÖZLEŞMESİ (Laravel + Nuxt kurulumları):
 *   GET {kaynak}/api/news?page=N   → sayfalı liste (data.data[])
 *   GET {kaynak}/api/news/{slug}   → tek haber (data.news: content dahil)
 * Başka bir kaynak için yalnızca `listeyiGetir`/`detayGetir` değişir.
 *
 * GÜVENLİK: varsayılan olarak HİÇBİR ŞEY YAZMAZ — ne veritabanına ne R2'ye.
 * `--uygula` verilene kadar sadece ne yapacağını listeler. Aynı slug
 * kiracıda zaten varsa atlanır, yani betiği iki kez çalıştırmak kayıt
 * ikizlemez.
 *
 * Kullanım:
 *   # 1. Keşif — ne aktarılacak (yazmaz)
 *   npx tsx scripts/kaynak-haber-aktar.ts --kiraci=<TENANT_ID> --adet=40
 *
 *   # 2. Gerçek aktarım (sunucuda; DATABASE_URL + S3_* gerektirir)
 *   npx tsx scripts/kaynak-haber-aktar.ts --kiraci=<TENANT_ID> --adet=40 --uygula
 *
 * Ayarlar:
 *   --kaynak=https://kudusanahaber.com   (varsayılan)
 *   --adet=40                            kaç haber
 *   --kiraci=<id>                        ZORUNLU — hedef kiracı
 *   --uygula                             yazma iznini açar
 */

type KaynakKategori = { id: number; name: string; slug: string } | null;
type KaynakYazar = { id: number; name: string; avatar_url?: string | null } | null;

type KaynakHaber = {
  id: number;
  title: string;
  slug: string;
  summary?: string | null;
  content?: string | null;
  image_url?: string | null;
  video_url?: string | null;
  published_at?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  is_headline?: boolean;
  category?: KaynakKategori;
  author?: KaynakYazar;
};

// Prisma 7 sürücü bağdaştırıcısı — diğer betiklerle aynı kalıp.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

function arg(ad: string, varsayilan = ''): string {
  const bulunan = process.argv.find((a) => a.startsWith(`--${ad}=`));
  return bulunan ? bulunan.slice(ad.length + 3) : varsayilan;
}
const bayrak = (ad: string) => process.argv.includes(`--${ad}`);

const KAYNAK = arg('kaynak', 'https://kudusanahaber.com').replace(/\/+$/, '');
const KIRACI = arg('kiraci');
const ADET = Math.max(1, Number(arg('adet', '40')) || 40);
const UYGULA = bayrak('uygula');

/** Ağ hatasında betiğin tamamını düşürmemek için tek istek sarmalı. */
async function jsonGetir<T>(adres: string): Promise<T> {
  const yanit = await fetch(adres, {
    headers: { 'User-Agent': 'HaberSite-Aktarim/1.0' },
    signal: AbortSignal.timeout(30_000),
  });
  if (!yanit.ok) throw new Error(`${yanit.status} ${adres}`);
  return (await yanit.json()) as T;
}

async function listeyiGetir(adet: number): Promise<KaynakHaber[]> {
  const toplanan: KaynakHaber[] = [];
  for (let sayfa = 1; toplanan.length < adet && sayfa <= 20; sayfa++) {
    const yanit = await jsonGetir<{ data: { data: KaynakHaber[] } }>(
      `${KAYNAK}/api/news?page=${sayfa}`,
    );
    const kayitlar = yanit?.data?.data ?? [];
    if (kayitlar.length === 0) break;
    toplanan.push(...kayitlar);
  }
  return toplanan.slice(0, adet);
}

async function detayGetir(slug: string): Promise<KaynakHaber | null> {
  try {
    const yanit = await jsonGetir<{ data: { news: KaynakHaber } }>(
      `${KAYNAK}/api/news/${encodeURIComponent(slug)}`,
    );
    return yanit?.data?.news ?? null;
  } catch {
    return null;
  }
}

/** Basit slug — kategori/yazar için. Türkçe harfler çevrilir. */
function slugla(metin: string): string {
  const harita: Record<string, string> = {
    ç: 'c', Ç: 'c', ğ: 'g', Ğ: 'g', ı: 'i', İ: 'i',
    ö: 'o', Ö: 'o', ş: 's', Ş: 's', ü: 'u', Ü: 'u',
  };
  return metin
    .replace(/[çÇğĞıİöÖşŞüÜ]/g, (h) => harita[h] ?? h)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/** Kapak görselini indirir. Başarısızsa null — haber görselsiz aktarılır. */
async function gorseliIndir(
  adres: string,
): Promise<{ govde: Buffer; tip: string; uzanti: string } | null> {
  try {
    const yanit = await fetch(adres, {
      headers: { 'User-Agent': 'HaberSite-Aktarim/1.0' },
      signal: AbortSignal.timeout(45_000),
    });
    if (!yanit.ok) return null;
    const tip = yanit.headers.get('content-type') ?? 'image/jpeg';
    if (!tip.startsWith('image/')) return null;
    const govde = Buffer.from(await yanit.arrayBuffer());
    if (govde.length === 0) return null;
    const uzantiAdaylari: Record<string, string> = {
      'image/jpeg': '.jpg', 'image/jpg': '.jpg', 'image/png': '.png',
      'image/webp': '.webp', 'image/gif': '.gif',
    };
    const uzanti =
      uzantiAdaylari[tip.split(';')[0].trim()] ??
      (extname(new URL(adres).pathname) || '.jpg');
    return { govde, tip: tip.split(';')[0].trim(), uzanti };
  } catch {
    return null;
  }
}

/**
 * R2/S3'e yükler ve herkese açık adresi döndürür.
 *
 * Anahtar deseni s3-storage.adapter ile AYNI olmak zorunda:
 * `uploads/{kiraci}/{yıl}/{ay}/{uuid}{uzanti}` — panelin medya kütüphanesi
 * ve CDN kuralları bu düzene göre kurulu.
 */
async function r2yeYukle(
  kiraciId: string,
  dosya: { govde: Buffer; tip: string; uzanti: string },
  /**
   * Kiracının kendi CDN kökü (ör. https://cdn.kudusanahaber.com). Boşsa
   * ortak S3_PUBLIC_URL kullanılır — ama o adres başka bir müşterinin
   * markasını taşıyorsa görseller onun alan adından servis edilir.
   * Müşteriye özel CDN panelde Müşteriler → Medya Adresi'nden girilir.
   */
  medyaKoku: string | null,
): Promise<{ anahtar: string; adres: string }> {
  const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');
  const istemci = new S3Client({
    region: process.env.S3_REGION ?? 'auto',
    endpoint: process.env.S3_ENDPOINT || undefined,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID ?? '',
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? '',
    },
    requestChecksumCalculation: 'WHEN_REQUIRED',
    responseChecksumValidation: 'WHEN_REQUIRED',
  });

  const simdi = new Date();
  const ay = String(simdi.getMonth() + 1).padStart(2, '0');
  const anahtar = `uploads/${kiraciId}/${simdi.getFullYear()}/${ay}/${randomUUID()}${dosya.uzanti}`;

  await istemci.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: anahtar,
      Body: dosya.govde,
      ContentType: dosya.tip,
      ContentLength: dosya.govde.length,
      // Anahtarda UUID var — içerik asla değişmez, önbellek güvenle uzun.
      CacheControl: 'public, max-age=31536000, immutable',
    }),
  );

  const kok = (medyaKoku ?? process.env.S3_PUBLIC_URL ?? '').replace(/\/+$/, '');
  return { anahtar, adres: kok ? `${kok}/${anahtar}` : anahtar };
}

async function calistir(): Promise<void> {
  if (!KIRACI) {
    console.error('HATA: --kiraci=<TENANT_ID> zorunlu.');
    process.exit(1);
  }

  const kiraci = await prisma.tenant.findUnique({
    where: { id: KIRACI },
    select: { id: true, name: true, mediaBaseUrl: true },
  });
  if (!kiraci) {
    console.error(`HATA: kiracı bulunamadı: ${KIRACI}`);
    process.exit(1);
  }

  // Haberin "ekleyen"i olacak kullanıcı — kiracının ilk yöneticisi.
  const yonetici = await prisma.user.findFirst({
    where: { tenantId: KIRACI, role: { in: ['ADMIN', 'SUPER_ADMIN'] } },
    select: { id: true, name: true },
    orderBy: { createdAt: 'asc' },
  });
  if (!yonetici) {
    console.error('HATA: kiracının ADMIN kullanıcısı yok — önce müşteriyi oluşturun.');
    process.exit(1);
  }

  console.log(`Kaynak     : ${KAYNAK}`);
  console.log(`Hedef      : ${kiraci.name} (${kiraci.id})`);
  console.log(`Ekleyen    : ${yonetici.name}`);
  console.log(`Adet       : ${ADET}`);
  console.log(`Mod        : ${UYGULA ? 'UYGULA (yazar)' : 'keşif (hiçbir şey yazmaz)'}`);
  console.log(
    `Medya kökü : ${kiraci.mediaBaseUrl ?? process.env.S3_PUBLIC_URL ?? '(tanımsız)'}` +
      (kiraci.mediaBaseUrl ? '' : '  ← kiracıya özel CDN girilmemiş, ortak adres kullanılacak'),
  );
  console.log('');

  const liste = await listeyiGetir(ADET);
  console.log(`Kaynaktan ${liste.length} haber listelendi.\n`);

  let aktarilan = 0;
  let atlanan = 0;
  let gorselli = 0;

  for (const [sira, ozet] of liste.entries()) {
    const numara = String(sira + 1).padStart(2, '0');

    const mevcut = await prisma.article.findUnique({
      where: { tenantId_slug: { tenantId: KIRACI, slug: ozet.slug } },
      select: { id: true },
    });
    if (mevcut) {
      atlanan++;
      console.log(`${numara}. ATLANDI (zaten var): ${ozet.title.slice(0, 60)}`);
      continue;
    }

    const haber = (await detayGetir(ozet.slug)) ?? ozet;
    const kapakAdresi = haber.image_url ?? ozet.image_url ?? '';

    if (!UYGULA) {
      console.log(
        `${numara}. ${haber.title.slice(0, 58)}\n` +
          `    kategori: ${haber.category?.name ?? '—'} | yazar: ${haber.author?.name ?? '—'} | ` +
          `gövde: ${(haber.content ?? '').length} krk | kapak: ${kapakAdresi ? 'var' : 'YOK'}`,
      );
      aktarilan++;
      continue;
    }

    // ── Kategori ──
    let kategoriId: string | null = null;
    if (haber.category?.name) {
      const kSlug = haber.category.slug || slugla(haber.category.name);
      const kategori = await prisma.category.upsert({
        where: { tenantId_slug: { tenantId: KIRACI, slug: kSlug } },
        update: {},
        create: {
          tenantId: KIRACI,
          // Kaynakta kategori adları ".GÜNCEL" gibi sıralama için nokta ile
          // başlayabiliyor — baştaki noktayı atıyoruz.
          name: haber.category.name.replace(/^[.\s]+/, ''),
          slug: kSlug,
        },
        select: { id: true },
      });
      kategoriId = kategori.id;
    }

    // ── Yazar ──
    let yazarId: string | null = null;
    if (haber.author?.name) {
      const yzSlug = slugla(haber.author.name);
      const yazar = await prisma.author.upsert({
        where: { tenantId_slug: { tenantId: KIRACI, slug: yzSlug } },
        update: {},
        create: { tenantId: KIRACI, name: haber.author.name, slug: yzSlug },
        select: { id: true },
      });
      yazarId = yazar.id;
    }

    // ── Kapak görseli: indir → R2 → medya kaydı ──
    let kapakAdresiBizim: string | null = null;
    if (kapakAdresi) {
      const dosya = await gorseliIndir(kapakAdresi);
      if (dosya) {
        const { anahtar, adres } = await r2yeYukle(KIRACI, dosya, kiraci.mediaBaseUrl);
        kapakAdresiBizim = adres;
        gorselli++;
        // Medya kütüphanesinde de görünsün — müşteri aynı görseli başka
        // haberde tekrar kullanabilsin.
        await prisma.media.create({
          data: {
            tenantId: KIRACI,
            type: MediaType.IMAGE,
            filename: anahtar.split('/').pop() ?? anahtar,
            originalName: kapakAdresi.split('/').pop() ?? 'kapak',
            mimeType: dosya.tip,
            size: dosya.govde.length,
            url: adres,
            title: haber.title.slice(0, 120),
            alt: haber.title.slice(0, 120),
          },
        });
      }
    }

    const yayinTarihi = haber.published_at ? new Date(haber.published_at) : new Date();

    await prisma.article.create({
      data: {
        tenantId: KIRACI,
        type: ArticleType.NEWS,
        title: haber.title,
        slug: ozet.slug,
        spot: haber.summary?.trim() || null,
        content: { html: haber.content ?? '' },
        featuredImage: kapakAdresiBizim,
        status: ArticleStatus.PUBLISHED,
        publishedAt: Number.isNaN(yayinTarihi.getTime()) ? new Date() : yayinTarihi,
        createdById: yonetici.id,
        authorId: yazarId,
        seoTitle: haber.seo_title?.trim() || null,
        seoDesc: haber.seo_description?.trim() || null,
        videoUrl: haber.video_url?.trim() || null,
        // Manşet işareti yalnızca kaynakta manşet olanlara — hepsini
        // işaretlemek anasayfa manşet havuzunu anlamsız hale getiriyor.
        featured: Boolean(haber.is_headline),
        // Aktarılan haber sosyal medyada paylaşılmasın: bunlar eski içerik,
        // yayına yeni giriyormuş gibi tweet atmak istemiyoruz.
        shareTargets: [],
        ...(kategoriId
          ? { categories: { create: [{ categoryId: kategoriId, primary: true }] } }
          : {}),
      },
    });

    aktarilan++;
    console.log(`${numara}. aktarıldı: ${haber.title.slice(0, 58)}${kapakAdresiBizim ? ' [kapak ✓]' : ''}`);
  }

  console.log('');
  console.log(`Bitti. Aktarılan: ${aktarilan} | Atlanan (zaten var): ${atlanan} | Kapak yüklenen: ${gorselli}`);
  if (!UYGULA) {
    console.log('\nBu bir KEŞİF çalışmasıydı — hiçbir şey yazılmadı.');
    console.log('Gerçekten aktarmak için aynı komuta --uygula ekleyin.');
  }
}

calistir()
  .catch((hata) => {
    console.error('Aktarım hatası:', hata);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
