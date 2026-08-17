import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

/**
 * "Yerel Manşet" işaretlerini toplu temizler.
 *
 * NEDEN GEREKİYOR: devraldığımız siteden aktarım sırasında `featured` alanı
 * ayrım gözetmeden işaretlenmiş. Canlıda 42.485 haberin 26.096'sı (yüzde 61)
 * manşet işaretli — bugün girilenler dahil. Bu hâliyle işaret hiçbir bilgi
 * taşımıyor: "manşetlik olan" ile "olmayan" ayırt edilemiyor, dolayısıyla
 * anasayfa manşetini editörün seçmesi mümkün olmuyor.
 *
 * Bir kez temizlendikten sonra işaret anlam kazanıyor: editör manşet yapmak
 * istediği habere kutuyu işaretliyor, o haber manşet bölümlerinde en başa
 * geçiyor.
 *
 * GÜVENLİK: varsayılan olarak HİÇBİR ŞEY YAZMAZ. Ne yapacağını gösterir,
 * `--uygula` verilene kadar sayar ve çıkar.
 *
 * Kullanım:
 *   # 1. Önce ne olacağını gör (yazmaz)
 *   npx ts-node scripts/manset-isaretlerini-temizle.ts --kiraci=<TENANT_ID>
 *
 *   # 2. Yalnızca belirli bir tarihten eskileri temizle
 *   npx ts-node scripts/manset-isaretlerini-temizle.ts --kiraci=<ID> --once=2026-08-01
 *
 *   # 3. Uygula
 *   npx ts-node scripts/manset-isaretlerini-temizle.ts --kiraci=<ID> --uygula
 *
 * ÖNCE YEDEK AL. Bu işlem geri alınamaz; hangi haberlerin işaretli olduğu
 * bilgisi kaybolur. `scripts/backup.sh` mevcut.
 */

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

function arguman(ad: string): string | undefined {
  const bulunan = process.argv.find((a) => a.startsWith(`--${ad}=`));
  return bulunan?.split('=').slice(1).join('=');
}

async function main() {
  const kiraciId = arguman('kiraci');
  const once = arguman('once');
  const uygula = process.argv.includes('--uygula');

  // Kiracı kimliği ZORUNLU ve varsayılanı yok: yanlış kiracının arşivini
  // temizlemek geri alınamaz bir hata olurdu.
  if (!kiraciId) {
    throw new Error(
      'Kiracı kimliği zorunlu.\n' +
        '  npx ts-node scripts/manset-isaretlerini-temizle.ts --kiraci=<TENANT_ID>',
    );
  }

  const kiraci = await prisma.tenant.findUnique({
    where: { id: kiraciId },
    select: { id: true, name: true, slug: true },
  });
  if (!kiraci) throw new Error(`Kiracı bulunamadı: ${kiraciId}`);

  const kosul: {
    tenantId: string;
    featured: boolean;
    publishedAt?: { lt: Date };
  } = { tenantId: kiraciId, featured: true };

  if (once) {
    const sinir = new Date(once);
    if (Number.isNaN(sinir.getTime())) {
      throw new Error(`Geçersiz tarih: ${once} (beklenen biçim: 2026-08-01)`);
    }
    kosul.publishedAt = { lt: sinir };
  }

  const [toplam, etkilenecek] = await Promise.all([
    prisma.article.count({ where: { tenantId: kiraciId } }),
    prisma.article.count({ where: kosul }),
  ]);

  console.log(`Kiracı        : ${kiraci.name} (${kiraci.slug})`);
  console.log(`Toplam haber  : ${toplam.toLocaleString('tr-TR')}`);
  console.log(
    `İşaretli      : ${etkilenecek.toLocaleString('tr-TR')}` +
      (once ? `  (yalnızca ${once} öncesi)` : ''),
  );

  if (!uygula) {
    console.log('');
    console.log('KURU ÇALIŞMA — hiçbir şey değiştirilmedi.');
    console.log('Uygulamak için komuta --uygula ekle. Önce yedek al.');
    return;
  }

  const sonuc = await prisma.article.updateMany({
    where: kosul,
    data: { featured: false },
  });

  const kalan = await prisma.article.count({
    where: { tenantId: kiraciId, featured: true },
  });

  console.log('');
  console.log(`Temizlenen    : ${sonuc.count.toLocaleString('tr-TR')}`);
  console.log(`Kalan işaretli: ${kalan.toLocaleString('tr-TR')}`);
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
