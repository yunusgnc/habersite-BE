import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

/**
 * Mevcut haberlere KALICI haber numarası (`articleNo`) yazar.
 *
 * NEDEN GEREKİYOR: numara kolonu sonradan eklendi, eski kayıtlarda null. Panel
 * haber listesinde "kaçıncı haber" bu numaradan okunuyor. Yeni haberler
 * numarayı oluşturulurken alıyor (bkz. ArticlesService.numarayiAtaVeOlustur);
 * bu script yalnızca GEÇMİŞİ doldurur ve bir kez çalıştırılır.
 *
 * SIRA: `createdAt` artan, eşitlikte `id` artan. Yani en eski haber 1,
 * en yeni haber toplam haber sayısı. Sıra deterministik: script yeniden
 * çalıştırılsa aynı numaraları üretir.
 *
 * GÜVENLİK: varsayılan olarak HİÇBİR ŞEY YAZMAZ. Ne yapacağını gösterir,
 * `--uygula` verilene kadar sayar ve çıkar. Numarası ZATEN olan haberlere
 * dokunmaz — yeniden çalıştırmak güvenlidir, numaralar kaymaz.
 *
 * Kullanım:
 *   # 1. Önce ne olacağını gör (yazmaz)
 *   npx ts-node scripts/haber-numaralarini-doldur.ts --kiraci=<TENANT_ID>
 *
 *   # 2. Uygula
 *   npx ts-node scripts/haber-numaralarini-doldur.ts --kiraci=<TENANT_ID> --uygula
 *
 * ÖNCE YEDEK AL. `scripts/backup.sh` mevcut.
 */

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

/** Tek seferde kaç satır güncellenecek — 45 binin üzerinde kayıt var. */
const PARTI = 500;

function arguman(ad: string): string | undefined {
  const bulunan = process.argv.find((a) => a.startsWith(`--${ad}=`));
  return bulunan?.split('=').slice(1).join('=');
}

async function main() {
  const kiraciId = arguman('kiraci');
  const uygula = process.argv.includes('--uygula');

  // Kiracı kimliği ZORUNLU ve varsayılanı yok: yanlış kiracının arşivine
  // numara yazmak karışıklık yaratır.
  if (!kiraciId) {
    throw new Error(
      'Kiracı kimliği zorunlu.\n' +
        '  npx ts-node scripts/haber-numaralarini-doldur.ts --kiraci=<TENANT_ID>',
    );
  }

  const kiraci = await prisma.tenant.findUnique({
    where: { id: kiraciId },
    select: { id: true, name: true, slug: true },
  });
  if (!kiraci) throw new Error(`Kiracı bulunamadı: ${kiraciId}`);

  const [toplam, numarasiz, enBuyuk] = await Promise.all([
    prisma.article.count({ where: { tenantId: kiraciId } }),
    prisma.article.count({ where: { tenantId: kiraciId, articleNo: null } }),
    prisma.article.aggregate({
      where: { tenantId: kiraciId },
      _max: { articleNo: true },
    }),
  ]);

  console.log(`Kiracı          : ${kiraci.name} (${kiraci.slug})`);
  console.log(`Toplam haber    : ${toplam.toLocaleString('tr-TR')}`);
  console.log(`Numarası yok    : ${numarasiz.toLocaleString('tr-TR')}`);
  console.log(`En büyük numara : ${enBuyuk._max.articleNo ?? 0}`);

  if (numarasiz === 0) {
    console.log('\nDolacak kayıt yok. Çıkılıyor.');
    return;
  }

  if (!uygula) {
    console.log(
      '\nDENEME MODU — hiçbir şey yazılmadı.' +
        '\nUygulamak için komutu --uygula ile tekrarla.',
    );
    return;
  }

  // Numarası olmayanlar en eskiden yeniye doğru numaralanır. Mevcut en büyük
  // numaranın üstünden devam ediyoruz; kısmen dolu bir tabloda da çakışmaz.
  let sayac = enBuyuk._max.articleNo ?? 0;
  let islenen = 0;

  for (;;) {
    const parti = await prisma.article.findMany({
      where: { tenantId: kiraciId, articleNo: null },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      select: { id: true },
      take: PARTI,
    });
    if (parti.length === 0) break;

    // Tek tek güncelleme şart: her satıra KENDİ numarası yazılıyor.
    // Parti bir işlemde gidiyor, yarı dolu bir parti kalmıyor.
    await prisma.$transaction(
      parti.map((haber) =>
        prisma.article.update({
          where: { id: haber.id },
          data: { articleNo: ++sayac },
        }),
      ),
    );

    islenen += parti.length;
    console.log(
      `  ${islenen.toLocaleString('tr-TR')} / ${numarasiz.toLocaleString('tr-TR')} numaralandı (son numara: ${sayac})`,
    );
  }

  console.log(`\nBitti. ${islenen.toLocaleString('tr-TR')} habere numara yazıldı.`);
}

main()
  .catch((hata) => {
    console.error(hata);
    process.exitCode = 1;
  })
  .finally(() => void prisma.$disconnect());
