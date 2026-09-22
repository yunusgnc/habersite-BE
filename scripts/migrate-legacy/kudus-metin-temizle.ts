/**
 * Düz metin alanlarında kalan HTML'i temizler.
 *
 * NEDEN AYRI BİR BETİK: aktarım (`import-kudus.ts`) artık bu temizliği kendisi
 * yapıyor, ama ilk koşu yapmadan önce çalıştı ve canlıya bozuk veri yazdı —
 * manşet sliderında spot başlık yerine ham `<span style="font-size: 28px…">`
 * görünüyordu. Aktarımı baştan koşmak müşterinin o arada panelden düzelttiği
 * 17 haberi geri alırdı; bu yüzden yalnızca BOZUK ALANLARI yerinde düzeltiyoruz.
 *
 * Temizlenen alanlar (hepsi site tarafından METİN olarak basılıyor):
 *   articles: title, spot, spot_title, seo_title, seo_desc
 *   authors : name, bio
 *   videos  : title, headline, description, seo_title, seo_desc
 *   galleries: title, description
 * İÇERİK GÖVDESİNE (content) DOKUNULMAZ — orası gerçek HTML.
 *
 *   # Önizleme — hiçbir şey yazmaz
 *   npx tsx scripts/migrate-legacy/kudus-metin-temizle.ts --tenant <id>
 *   # Uygula
 *   ... --apply
 */
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

function arg(ad: string, varsayilan?: string): string {
  const i = process.argv.indexOf(`--${ad}`);
  if (i >= 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--')) {
    return process.argv[i + 1];
  }
  if (varsayilan !== undefined) return varsayilan;
  throw new Error(`--${ad} zorunlu`);
}
const KIRACI = arg('tenant');
const UYGULA = process.argv.includes('--apply');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL tanımlı değil');
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

// import-kudus.ts'teki `duzMetin` ile AYNI mantık olmalı.
const VARLIKLAR: Record<string, string> = {
  nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'",
  uuml: 'ü', Uuml: 'Ü', ccedil: 'ç', Ccedil: 'Ç', ouml: 'ö', Ouml: 'Ö',
  acirc: 'â', Acirc: 'Â', icirc: 'î', Icirc: 'Î', ucirc: 'û', Ucirc: 'Û',
  scedil: 'ş', Scedil: 'Ş', ge: 'ğ', shy: '',
  rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”',
  hellip: '…', ndash: '–', mdash: '—',
};

/** Alanda HTML etiketi ya da varlık kodu var mı? */
const bozuk = (s: string) => /<[a-z!/][^>]*>|&[a-zA-Z]+;|&#\d+;/i.test(s);

function duzMetin(ham: string): string {
  return ham
    .replace(/<br\s*\/?>|<\/(p|div|li|h[1-6])>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&#(\d+);/g, (_m, k) => String.fromCodePoint(Number(k)))
    .replace(/&#x([0-9a-f]+);/gi, (_m, k) => String.fromCodePoint(parseInt(k, 16)))
    .replace(/&([a-zA-Z]+);/g, (tam, ad) => VARLIKLAR[ad] ?? tam)
    .replace(/\s+/g, ' ')
    .trim();
}

const sayac: Record<string, number> = {};
const say = (k: string) => (sayac[k] = (sayac[k] ?? 0) + 1);

/** Bir tablodaki metin alanlarını tarar; değişen kayıtları döner. */
async function temizle<T extends { id: string }>(
  etiket: string,
  kayitlar: T[],
  alanlar: (keyof T & string)[],
  yaz: (id: string, veri: Record<string, string | null>) => Promise<unknown>,
) {
  for (const kayit of kayitlar) {
    const degisen: Record<string, string | null> = {};
    for (const alan of alanlar) {
      const deger = kayit[alan];
      if (typeof deger !== 'string' || !bozuk(deger)) continue;
      const yeni = duzMetin(deger);
      if (yeni === deger) continue;
      degisen[alan] = yeni || null;
      say(`${etiket}.${alan}`);
    }
    if (!Object.keys(degisen).length) continue;
    const ilk = Object.entries(degisen)[0];
    console.log(`  ${etiket} ${kayit.id} · ${ilk[0]}: ${String(ilk[1]).slice(0, 70)}`);
    if (UYGULA) await yaz(kayit.id, degisen);
  }
}

async function main() {
  console.log(
    `Kiracı ${KIRACI} · ${UYGULA ? '⚠️  YAZMA (--apply)' : '👀 ÖNİZLEME'}\n`,
  );

  const yazilar = await prisma.article.findMany({
    where: { tenantId: KIRACI },
    select: { id: true, title: true, spot: true, spotTitle: true, seoTitle: true, seoDesc: true },
  });
  await temizle('haber', yazilar, ['title', 'spot', 'spotTitle', 'seoTitle', 'seoDesc'],
    (id, veri) => prisma.article.update({ where: { id }, data: veri }));

  const yazarlar = await prisma.author.findMany({
    where: { tenantId: KIRACI },
    select: { id: true, name: true, bio: true },
  });
  // Yazar adı boşa düşerse kayıt kullanılamaz hale gelir — adı hiç boşaltma.
  await temizle('yazar', yazarlar, ['name', 'bio'],
    (id, veri) => prisma.author.update({
      where: { id },
      data: veri.name === null ? { ...veri, name: undefined } : veri,
    }));

  const videolar = await prisma.video.findMany({
    where: { tenantId: KIRACI },
    select: { id: true, title: true, headline: true, description: true, seoTitle: true, seoDesc: true },
  });
  await temizle('video', videolar, ['title', 'headline', 'description', 'seoTitle', 'seoDesc'],
    (id, veri) => prisma.video.update({ where: { id }, data: veri }));

  const galeriler = await prisma.gallery.findMany({
    where: { tenantId: KIRACI },
    select: { id: true, title: true, description: true },
  });
  await temizle('galeri', galeriler, ['title', 'description'],
    (id, veri) => prisma.gallery.update({ where: { id }, data: veri }));

  console.log('\n─── ÖZET ───');
  const toplam = Object.values(sayac).reduce((a, b) => a + b, 0);
  for (const [k, n] of Object.entries(sayac).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${k.padEnd(28)} ${String(n).padStart(5)}`);
  }
  console.log(`  ${'TOPLAM'.padEnd(28)} ${String(toplam).padStart(5)}`);
  console.log(UYGULA ? '\n✅ Temizlendi.\n' : '\n👀 Önizlemeydi — yazmak için --apply.\n');
}

main()
  .catch((e) => {
    console.error('\n❌ HATA:', e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
