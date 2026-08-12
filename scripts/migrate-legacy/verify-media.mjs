/**
 * Aktarim sonrasi gorsel dogrulama araci.
 *
 * Veritabanindaki TUM gorsel adreslerini diskteki arsivle karsilastirir.
 * CDN adresi ile arsiv yolu 1:1 esleniyor:
 *   .../legacy/<klasor>/<rel>  ↔  storage/app/public/images/<klasor>/<rel>
 * Boylece 200 bin HTTP istegi atmadan eksik dosyalari cikarabiliyoruz.
 *
 * Kullanim:
 *   node --env-file=.env scripts/migrate-legacy/verify-media.mjs \
 *     --archive /yol/archive/storage/app/public/images \
 *     [--extra /yol/sonradan-indirilen]
 */
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import fs from 'node:fs';
import path from 'node:path';

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};

const ARCHIVE = arg('archive');
if (!ARCHIVE) {
  console.error('--archive zorunlu: arsivdeki images/ klasorunun yolu');
  process.exit(1);
}
// Arsiv cekildikten sonra eklenen gorseller (or. canli siteden tamamlananlar).
const EXTRA_DIRS = [arg('extra')].filter(Boolean);

const p = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const exists = (rel) => {
  if (fs.existsSync(path.join(ARCHIVE, rel))) return true;
  // 2026/08 dosyalari `haberler/` onegi olmadan indirildi
  const noPrefix = rel.replace(/^haberler\//, '');
  return EXTRA_DIRS.some(
    (d) => fs.existsSync(path.join(d, rel)) || fs.existsSync(path.join(d, noPrefix)),
  );
};

const legacyRel = (url) => {
  if (!url) return null;
  const i = url.indexOf('/legacy/');
  return i === -1 ? null : url.slice(i + '/legacy/'.length);
};

const sources = [
  ['article.featuredImage', () => p.$queryRawUnsafe("select featured_image as u from articles where featured_image like '%/legacy/%'")],
  ['article.ogImage', () => p.$queryRawUnsafe("select og_image as u from articles where og_image like '%/legacy/%'")],
  ['article.headlineImage', () => p.$queryRawUnsafe("select headline_image as u from articles where headline_image like '%/legacy/%'")],
  ['author.avatar', () => p.$queryRawUnsafe("select avatar as u from authors where avatar like '%/legacy/%'")],
  ['gallery.coverImage', () => p.$queryRawUnsafe("select cover_image as u from galleries where cover_image like '%/legacy/%'")],
  ['gallery_images.url', () => p.$queryRawUnsafe("select url as u from gallery_images where url like '%/legacy/%'")],
  ['media.url', () => p.$queryRawUnsafe("select url as u from media where url like '%/legacy/%'")],
  ['video.thumbnail', () => p.$queryRawUnsafe("select thumbnail as u from videos where thumbnail like '%/legacy/%'")],
];

const missingByFolder = new Map();
let grandTotal = 0;
let grandMissing = 0;

for (const [label, q] of sources) {
  let rows;
  try {
    rows = await q();
  } catch (e) {
    console.log(`${label.padEnd(24)} — kolon yok, atlandi`);
    continue;
  }
  let miss = 0;
  for (const r of rows) {
    const rel = legacyRel(r.u);
    if (!rel) continue;
    grandTotal++;
    if (!exists(decodeURIComponent(rel))) {
      miss++;
      grandMissing++;
      const folder = rel.split('/').slice(0, 3).join('/');
      missingByFolder.set(folder, (missingByFolder.get(folder) ?? 0) + 1);
    }
  }
  const pct = rows.length ? ((rows.length - miss) / rows.length * 100).toFixed(2) : '—';
  console.log(`${label.padEnd(24)} ${String(rows.length).padStart(6)} kayit · eksik ${String(miss).padStart(5)} · saglam %${pct}`);
}

console.log('\n' + '─'.repeat(58));
console.log(`TOPLAM ${grandTotal} gorsel adresi · eksik ${grandMissing} · saglam %${((grandTotal - grandMissing) / grandTotal * 100).toFixed(2)}`);

if (missingByFolder.size) {
  console.log('\nEksiklerin dagilimi (en cok 20):');
  [...missingByFolder.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .forEach(([f, c]) => console.log(`  ${String(c).padStart(5)}  ${f}`));
}

await p.$disconnect();
