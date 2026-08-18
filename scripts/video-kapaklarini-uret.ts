import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/**
 * Video kapaklarını videonun kendisinden üretir ve R2'ye yükler.
 *
 * NEDEN GEREKİYOR: eski siteden aktarımda yalnızca .mp4 dosyaları taşındı.
 * Yayındaki videoların bir kısmının `coverImage` alanı R2'de VAR OLMAYAN bir
 * .jpg'yi gösteriyor (404), çoğununki ise tamamen boş. Sitede video kartları
 * bu yüzden kapaksız (koyu) görünüyordu.
 *
 * NE YAPAR (iki aşama):
 *
 *   --yukle : Herkese açık API'den yayındaki videoları listeler; kapak
 *             anahtarı (coverImage doluysa o, boşsa videoUrl'nin .jpg hâli)
 *             CDN'de 404 dönenler için ffmpeg ile videodan bir kare çıkarır
 *             ve rclone ile R2'de TAM O ANAHTARA yükler. Veri tabanına
 *             dokunmaz — dolu coverImage kayıtları kendiliğinden çalışır
 *             hale gelir. Yerel makinede çalıştırılır (ffmpeg + rclone ister).
 *
 *   --dbye-yaz : coverImage'ı BOŞ olan yayındaki videolara, türetilmiş .jpg
 *             CDN'de gerçekten 200 dönüyorsa, o adresi yazar. DATABASE_URL
 *             ister; sunucuda (veya prod erişimli ortamda) çalıştırılır.
 *             --yukle aşaması bitmeden çalıştırmak anlamsızdır — hiçbir
 *             kayda dokunmaz çünkü 200 dönen kapak bulamaz.
 *
 * GÜVENLİK: varsayılan olarak HİÇBİR ŞEY YAZMAZ (ne R2'ye ne DB'ye).
 * `--uygula` verilene kadar yalnızca ne yapacağını listeler. R2'de yalnızca
 * 404 dönen anahtarlara yazar — var olan hiçbir dosyanın üzerine yazmaz,
 * dolayısıyla CDN önbellek temizliği (purge) gerektirmez.
 *
 * Kullanım:
 *   # 1. Keşif — ne eksik, ne üretilecek (yazmaz)
 *   npx ts-node scripts/video-kapaklarini-uret.ts --kiraci=<TENANT_ID> --yukle
 *
 *   # 2. Kapakları üret ve R2'ye yükle
 *   npx ts-node scripts/video-kapaklarini-uret.ts --kiraci=<TENANT_ID> --yukle --uygula
 *
 *   # 3. (Sunucuda) boş coverImage alanlarını doldur
 *   npx ts-node scripts/video-kapaklarini-uret.ts --kiraci=<TENANT_ID> --dbye-yaz --uygula
 *
 * Ayarlar:
 *   --api=https://api.makasda.com   (varsayılan)
 *   --paket=r2:habersite-media     rclone hedefi (varsayılan)
 *   --sinir=N                      en fazla N video işle
 */

const args = process.argv.slice(2);
const arg = (ad: string) => {
  const bul = args.find((a) => a.startsWith(`--${ad}=`));
  return bul ? bul.split('=').slice(1).join('=') : undefined;
};
const bayrak = (ad: string) => args.includes(`--${ad}`);

const KIRACI = arg('kiraci');
const API = arg('api') ?? 'https://api.makasda.com';
const PAKET = arg('paket') ?? 'r2:habersite-media';
const SINIR = Number(arg('sinir') ?? '10000');
const UYGULA = bayrak('uygula');

if (!KIRACI || (!bayrak('yukle') && !bayrak('dbye-yaz'))) {
  console.error('Kullanım: --kiraci=<TENANT_ID> ile birlikte --yukle veya --dbye-yaz gerekli.');
  process.exit(1);
}

type Video = { id: string; title: string; coverImage?: string | null; videoUrl?: string | null };

/** Kapağın olması gereken adres: coverImage doluysa o, değilse mp4'ün .jpg hâli. */
function kapakAdresi(v: Video): string | null {
  const dolu = (v.coverImage ?? '').trim();
  if (dolu) return dolu;
  const mp4 = (v.videoUrl ?? '').trim();
  if (!/\.mp4(\?|$)/i.test(mp4)) return null;
  return mp4.replace(/\.mp4(\?.*)?$/i, '.jpg');
}

/** curl ile durum kodu — Node fetch bazı CDN'lerde bot korumasına takılıyor. */
function durumKodu(url: string): number {
  try {
    const cikti = execFileSync(
      'curl',
      ['-s', '-o', '/dev/null', '-w', '%{http_code}', '-I', url, '--max-time', '20'],
      { encoding: 'utf8' },
    );
    return Number(cikti.trim());
  } catch {
    return 0;
  }
}

async function videolariListele(): Promise<Video[]> {
  const hepsi: Video[] = [];
  let cursor: string | undefined;
  for (let tur = 0; tur < 100; tur++) {
    const url = `${API}/api/videos?limit=50&status=PUBLISHED${cursor ? `&cursor=${cursor}` : ''}`;
    const ham = execFileSync(
      'curl',
      ['-s', url, '-H', `x-tenant-id: ${KIRACI}`, '--max-time', '30'],
      { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 },
    );
    // Bazı açıklama alanlarında ham kontrol karakteri var; JSON.parse bunları
    // kabul ediyor (JS, Python'un aksine strict değil).
    const d = JSON.parse(ham);
    hepsi.push(...(d.items ?? []));
    cursor = d.nextCursor;
    if (!cursor) break;
  }
  return hepsi;
}

/** R2 anahtarı: CDN adresinden yol kısmı. */
function r2Anahtari(url: string): string {
  return new URL(url).pathname.replace(/^\//, '');
}

async function yukle() {
  const videolar = (await videolariListele()).slice(0, SINIR);
  console.log(`Yayında ${videolar.length} video.`);

  let uretilen = 0, atlanan = 0, kaynaksiz = 0, hatali: string[] = [];
  const gecici = mkdtempSync(join(tmpdir(), 'video-kapak-'));

  try {
    for (const v of videolar) {
      const kapak = kapakAdresi(v);
      const mp4 = (v.videoUrl ?? '').trim();
      if (!kapak || !/\.mp4(\?|$)/i.test(mp4)) {
        kaynaksiz++;
        continue;
      }
      if (durumKodu(kapak) === 200) {
        atlanan++;
        continue;
      }

      const hedefAnahtar = r2Anahtari(kapak);
      if (!UYGULA) {
        console.log(`ÜRETİLECEK: ${v.title.slice(0, 60)} -> ${hedefAnahtar}`);
        uretilen++;
        continue;
      }

      const dosya = join(gecici, `${v.id}.jpg`);
      try {
        // 1.5 sn'deki kare: açılış karesi çoğu videoda siyah/logo oluyor.
        // Kısa videolarda 1.5 sn yoksa 0'dan dene.
        try {
          execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-ss', '1.5', '-i', mp4,
            '-frames:v', '1', '-vf', "scale='min(960,iw)':-2", '-q:v', '4', '-y', dosya], { timeout: 120_000 });
          statSync(dosya);
        } catch {
          execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-i', mp4,
            '-frames:v', '1', '-vf', "scale='min(960,iw)':-2", '-q:v', '4', '-y', dosya], { timeout: 120_000 });
          statSync(dosya);
        }
        execFileSync('rclone', ['copyto', dosya, `${PAKET}/${hedefAnahtar}`,
          '--header-upload', 'Content-Type: image/jpeg'], { timeout: 120_000 });
        uretilen++;
        console.log(`✓ ${uretilen}. ${v.title.slice(0, 60)}`);
      } catch (e) {
        hatali.push(`${v.id} ${v.title.slice(0, 40)}: ${(e as Error).message.slice(0, 80)}`);
      }
    }
  } finally {
    rmSync(gecici, { recursive: true, force: true });
  }

  console.log(`\n${UYGULA ? 'Üretilip yüklendi' : 'Üretilecek'}: ${uretilen}`);
  console.log(`Kapağı zaten çalışan (atlandı): ${atlanan}`);
  console.log(`Kaynağı olmayan (mp4 yok): ${kaynaksiz}`);
  if (hatali.length) {
    console.log(`HATALI: ${hatali.length}`);
    hatali.forEach((h) => console.log('  ✗ ' + h));
  }
  if (!UYGULA) console.log('\nYazmak için --uygula ekleyin.');
}

async function dbyeYaz() {
  // Prisma'yı yalnızca bu aşama ister — --yukle aşaması DB'siz çalışsın diye
  // içe aktarma burada.
  const { PrismaClient } = await import('@prisma/client');
  const { PrismaPg } = await import('@prisma/adapter-pg');
  await import('dotenv/config');
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });

  const bosKapaklilar = await prisma.video.findMany({
    where: { tenantId: KIRACI, status: 'PUBLISHED', OR: [{ coverImage: null }, { coverImage: '' }] },
    select: { id: true, title: true, videoUrl: true, coverImage: true },
    take: SINIR,
  });
  console.log(`coverImage boş: ${bosKapaklilar.length} video.`);

  let yazilan = 0, dosyasiYok = 0;
  for (const v of bosKapaklilar) {
    const kapak = kapakAdresi(v);
    if (!kapak) continue;
    // Yalnızca dosyası GERÇEKTEN var olan kapağı yaz — kırık adres yazmak
    // sorunu çözmek değil, saklamak olur.
    if (durumKodu(kapak) !== 200) {
      dosyasiYok++;
      continue;
    }
    if (UYGULA) {
      await prisma.video.update({ where: { id: v.id }, data: { coverImage: kapak } });
    }
    yazilan++;
    console.log(`${UYGULA ? '✓' : 'YAZILACAK'}: ${v.title.slice(0, 60)}`);
  }

  console.log(`\n${UYGULA ? 'Yazıldı' : 'Yazılacak'}: ${yazilan} | kapak dosyası henüz yok: ${dosyasiYok}`);
  if (!UYGULA) console.log('Yazmak için --uygula ekleyin.');
  await prisma.$disconnect();
}

(bayrak('yukle') ? yukle() : dbyeYaz()).catch((e) => {
  console.error(e);
  process.exit(1);
});
