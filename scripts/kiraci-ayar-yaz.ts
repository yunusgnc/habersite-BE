/**
 * KİRACI AYARLARINI TOPLU YAZAR — panelin Ayarlar ekranıyla aynı yere.
 *
 * Yeni müşteri açarken onlarca alanı elle doldurmak hem yavaş hem hataya
 * açık; eski siteden derlenen bilgileri tek komutla geçirmek için var.
 *
 * `--uygula` verilene kadar hiçbir şey yazmaz: mevcut ve yeni değeri yan
 * yana gösterir, değişmeyecek alanları ayrıca söyler.
 *
 * GİZLİ ayarlar (API anahtarları, sosyal medya token'ları) bilerek
 * reddedilir — onlar şifrelenerek saklanıyor ve düz metin yazmak kaydı
 * bozar. Onları panelden girin.
 *
 * Kullanım:
 *   npx tsx scripts/kiraci-ayar-yaz.ts --kiraci=<ID> --ayarlar='{"contactPhone":"+90..."}'
 *   npx tsx scripts/kiraci-ayar-yaz.ts --kiraci=<ID> --dosya=ayarlar.json --uygula
 */
import { readFileSync } from 'node:fs';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { SECRET_SETTING_KEYS } from '../src/settings/secret-settings';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const deger = (ad: string): string | undefined => {
  const bulunan = process.argv.find((a) => a.startsWith(`--${ad}=`));
  return bulunan?.slice(ad.length + 3);
};
const bayrak = (ad: string) => process.argv.includes(`--${ad}`);

/** Uzun metinleri tek satırda okunur kılar. */
function kisalt(v: unknown, n = 58): string {
  const s = v === null || v === undefined ? '(boş)' : String(v);
  const tek = s.replace(/\s+/g, ' ').trim();
  return tek.length > n ? `${tek.slice(0, n - 1)}…` : tek || '(boş)';
}

async function calistir() {
  const kiraciId = deger('kiraci');
  const uygula = bayrak('uygula');
  const dosya = deger('dosya');
  const satirIci = deger('ayarlar');

  if (!kiraciId) {
    console.error('HATA: --kiraci=<TENANT_ID> zorunlu.');
    process.exit(1);
  }
  if (!dosya && !satirIci) {
    console.error('HATA: --ayarlar=<json> ya da --dosya=<yol> verin.');
    process.exit(1);
  }

  let girdi: Record<string, unknown>;
  try {
    const ham = dosya ? readFileSync(dosya, 'utf8') : satirIci!;
    girdi = JSON.parse(ham);
    if (!girdi || typeof girdi !== 'object' || Array.isArray(girdi)) {
      throw new Error('nesne bekleniyordu');
    }
  } catch (err) {
    console.error(`HATA: ayarlar okunamadı — ${(err as Error).message}`);
    process.exit(1);
  }

  const kiraci = await prisma.tenant.findUnique({
    where: { id: kiraciId },
    select: { id: true, name: true },
  });
  if (!kiraci) {
    console.error(`HATA: kiracı bulunamadı: ${kiraciId}`);
    process.exit(1);
  }

  const mevcutKayitlar = await prisma.setting.findMany({
    where: { tenantId: kiraciId, key: { in: Object.keys(girdi) } },
    select: { key: true, value: true },
  });
  const mevcut = new Map(mevcutKayitlar.map((k) => [k.key, k.value]));

  console.log(`Hedef : ${kiraci.name} (${kiraci.id})`);
  console.log(
    `Mod   : ${uygula ? 'UYGULA (yazar)' : 'keşif (hiçbir şey yazmaz)'}`,
  );
  console.log(`Alan  : ${Object.keys(girdi).length}\n`);

  const yazilacak: [string, unknown][] = [];
  const atlanan: string[] = [];

  for (const [anahtar, yeni] of Object.entries(girdi)) {
    if (SECRET_SETTING_KEYS.has(anahtar)) {
      console.log(`  ✗ ${anahtar} — GİZLİ ayar, panelden girilmeli. Atlandı.`);
      atlanan.push(anahtar);
      continue;
    }
    const eski = mevcut.get(anahtar);
    if (JSON.stringify(eski ?? null) === JSON.stringify(yeni)) {
      console.log(`  = ${anahtar} — zaten aynı (${kisalt(eski)})`);
      atlanan.push(anahtar);
      continue;
    }
    console.log(`  → ${anahtar}`);
    console.log(`      eski: ${kisalt(eski)}`);
    console.log(`      yeni: ${kisalt(yeni)}`);
    yazilacak.push([anahtar, yeni]);
  }

  if (!uygula) {
    console.log(
      `\nKEŞİF: ${yazilacak.length} alan değişecek, ${atlanan.length} alan atlanacak.`,
    );
    console.log('Gerçekten yazmak için aynı komuta --uygula ekleyin.');
    return;
  }

  for (const [anahtar, yeni] of yazilacak) {
    await prisma.setting.upsert({
      where: { tenantId_key: { tenantId: kiraciId, key: anahtar } },
      update: { value: yeni as never },
      create: { tenantId: kiraciId, key: anahtar, value: yeni as never },
    });
  }

  console.log(
    `\nBitti. Yazılan: ${yazilacak.length} | Atlanan: ${atlanan.length}`,
  );
  console.log(
    'Not: site önbelleği panel üzerinden tazelenmiyor — alan adı henüz\n' +
      "taşınmadıysa Coolify'dan Restart atın ya da DNS geçişini bekleyin.",
  );
}

calistir()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => void prisma.$disconnect());
