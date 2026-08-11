/**
 * Parser doğrulaması. Import'u çalıştırmadan önce dump'ın doğru okunduğunu
 * kanıtlar: satır sayıları, kolon eşleşmesi, Türkçe karakterler, kaçışlı
 * tırnaklar ve tarih dönüşümü.
 *
 *   npx ts-node scripts/migrate-legacy/verify-parser.ts <dump.sql>
 */
import { readColumnOrder, readRows, asStr, asDate, asInt } from './mysql-dump-reader';

const DUMP = process.argv[2] ?? '/Users/yunusbeto/Downloads/kayseritimes.sql';

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

async function main() {
  console.log(`Dump: ${DUMP}\n`);

  const cols = await readColumnOrder(DUMP);
  console.log('KOLON SIRASI');
  for (const t of TABLES) {
    const c = cols.get(t);
    console.log(`  ${t.padEnd(16)} ${c ? `${c.length} kolon` : 'BULUNAMADI'}`);
  }

  const counts = new Map<string, number>();
  const samples = new Map<string, any>();
  let emptyTitles = 0;
  let emptySlugs = 0;
  let badDates = 0;
  let withTurkish = 0;
  let withApostrophe = 0;

  for await (const { table, row } of readRows(DUMP, TABLES, cols)) {
    counts.set(table, (counts.get(table) ?? 0) + 1);
    if (!samples.has(table)) samples.set(table, row);

    if (table === 'haberler') {
      const title = asStr(row.HaberBaslik);
      const slug = asStr(row.Slug);
      if (!title.trim()) emptyTitles++;
      if (!slug.trim()) emptySlugs++;
      if (!asDate(row.Olusturulma)) badDates++;
      if (/[çğıöşüÇĞİÖŞÜ]/.test(title)) withTurkish++;
      if (title.includes("'")) withApostrophe++;
    }
  }

  console.log('\nSATIR SAYILARI');
  for (const t of TABLES) {
    console.log(`  ${t.padEnd(16)} ${(counts.get(t) ?? 0).toLocaleString('tr-TR').padStart(8)}`);
  }

  console.log('\nHABER VERİ SAĞLIĞI');
  const total = counts.get('haberler') ?? 0;
  console.log(`  Toplam haber            ${total.toLocaleString('tr-TR')}`);
  console.log(`  Başlığı boş             ${emptyTitles}`);
  console.log(`  Slug'ı boş              ${emptySlugs}`);
  console.log(`  Geçersiz/boş tarih      ${badDates}`);
  console.log(`  Türkçe karakter içeren  ${withTurkish.toLocaleString('tr-TR')}`);
  console.log(`  Kesme işareti içeren    ${withApostrophe.toLocaleString('tr-TR')}`);

  // Örnek kayıt — kolonların doğru hizalandığını gözle doğrula
  const h = samples.get('haberler');
  if (h) {
    console.log('\nÖRNEK HABER (kolon hizalaması kontrolü)');
    console.log(`  Id           ${h.Id}`);
    console.log(`  HaberBaslik  ${asStr(h.HaberBaslik).slice(0, 70)}`);
    console.log(`  Slug         ${asStr(h.Slug).slice(0, 70)}`);
    console.log(`  KatId        ${h.KatId}`);
    console.log(`  Durum        ${h.Durum}   Manset ${h.Manset}   Okunma ${h.Okunma}`);
    console.log(`  Resim        ${asStr(h.Resim)}`);
    console.log(`  Olusturulma  ${asDate(h.Olusturulma)?.toISOString() ?? 'null'}`);
    console.log(`  Icerik uzunl ${asStr(h.Icerik).length} karakter`);
    console.log(`  Icerik ilk   ${asStr(h.Icerik).replace(/\s+/g, ' ').slice(0, 90)}`);
  }

  const y = samples.get('yazarlar');
  if (y) {
    console.log('\nÖRNEK YAZAR');
    console.log(`  AdSoyad  ${asStr(y.AdSoyad)}`);
    console.log(`  Seo      ${asStr(y.Seo)}`);
    console.log(`  Resim    ${asStr(y.Resim)}`);
    console.log(`  Durum    ${y.Durum}`);
    // Şifre alanı KASITLI olarak yazdırılmıyor.
  }

  const k = samples.get('haberkategori');
  if (k) {
    console.log('\nÖRNEK KATEGORİ');
    console.log(`  Id ${k.Id}  Baslik ${asStr(k.Baslik)}  Seo ${asStr(k.Seo)}  Durum ${k.Durum}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
