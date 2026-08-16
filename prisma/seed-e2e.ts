import { PrismaClient, UserRole } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';
import 'dotenv/config';

/**
 * Uçtan uca testler için izole bir kiracı ve kullanıcı seti hazırlar.
 *
 * NEDEN AYRI BİR TOHUM: uçtan uca testler veri YAZIYOR — haber oluşturuyor,
 * ayar değiştiriyor, kayıt siliyor. Bunu gerçek bir kiracının üzerinde yapmak
 * er ya da geç canlı veriyi bozar. Kendi kiracısında çalışsın.
 *
 * NEDEN İKİ KİRACI: testlerin en önemlisi kiracı izolasyonu. "A kiracısının
 * kullanıcısı B'nin haberini göremiyor" iddiasını kanıtlamak için ortada iki
 * kiracı olması gerekiyor, biri yetmiyor.
 *
 * ŞİFRE: yerelde uğraştırmasın diye sabit bir varsayılan var. Bu bir test
 * verisi — kullanıcılar `@test.local` adresli, kiracılar `e2e-a`/`e2e-b`, ve
 * betik `NODE_ENV=production` iken çalışmayı REDDEDİYOR. CI'da ya da paylaşımlı
 * bir ortamda `E2E_PASSWORD` ile ezilmeli.
 *
 * Çalıştırma:
 *   npx ts-node prisma/seed-e2e.ts              (yerel, varsayılan şifre)
 *   E2E_PASSWORD='...' npx ts-node prisma/seed-e2e.ts   (CI)
 */

/**
 * Yerel varsayılan test şifresi.
 *
 * Panel tarafındaki `e2e/sabitler.ts` ile AYNI olmak zorunda; ikisi ayrı
 * depoda olduğu için tekrar ediliyor.
 */
export const VARSAYILAN_E2E_SIFRE = 'e2e-yerel-test-2026';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export const E2E = {
  kiracıA: { slug: 'e2e-a', domain: 'e2e-a.test', ad: 'E2E Kiracı A' },
  kiracıB: { slug: 'e2e-b', domain: 'e2e-b.test', ad: 'E2E Kiracı B' },
  adminEposta: 'e2e-admin@test.local',
  yazarEposta: 'e2e-yazar@test.local',
  // Panel beş rol seviyesi tanımlıyor; rol matrisi testi bunların dördünü
  // gerçek oturumla geziyor. Rol taklidi yapmak yetmez: guard'ların gerçekte
  // ne yaptığını değil, bizim ne sandığımızı test ederdi.
  editorEpostasi: 'e2e-editor@test.local',
  kosayazariEpostasi: 'e2e-kosayazari@test.local',
  bEpostası: 'e2e-b-admin@test.local',
};

async function kiracıKur(
  bilgi: { slug: string; domain: string; ad: string },
  sifreHash: string,
  kullanicilar: Array<{ email: string; name: string; role: UserRole }>,
) {
  const kiracı = await prisma.tenant.upsert({
    where: { slug: bilgi.slug },
    update: { name: bilgi.ad, domain: bilgi.domain, active: true },
    create: {
      name: bilgi.ad,
      slug: bilgi.slug,
      domain: bilgi.domain,
      locale: 'tr',
      timezone: 'Europe/Istanbul',
    },
  });

  for (const k of kullanicilar) {
    await prisma.user.upsert({
      where: { tenantId_email: { tenantId: kiracı.id, email: k.email } },
      // Şifre her çalıştırmada tazeleniyor: tohum betiği tekrar tekrar
      // çalıştırılabilir olmalı, ikinci çalıştırmada eski şifreyle kalmamalı.
      update: { passwordHash: sifreHash, name: k.name, role: k.role, active: true },
      create: {
        tenantId: kiracı.id,
        email: k.email,
        name: k.name,
        role: k.role,
        passwordHash: sifreHash,
      },
    });
  }

  // Haber oluşturma akışının çalışması için en az bir kategori gerekiyor.
  await prisma.category.upsert({
    where: { tenantId_slug: { tenantId: kiracı.id, slug: 'e2e-gundem' } },
    update: {},
    create: {
      tenantId: kiracı.id,
      name: 'E2E Gündem',
      slug: 'e2e-gundem',
    },
  });

  return kiracı;
}

async function main() {
  // Üretim kontrolü ÖNCE: varsayılan şifrenin canlı bir veritabanına ulaşma
  // ihtimalini tamamen kapatıyor.
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'Bu tohum betiği üretimde çalıştırılamaz: test kullanıcıları canlı ' +
        'veritabanına yazılmamalı.',
    );
  }

  const sifre = process.env.E2E_PASSWORD?.trim() || VARSAYILAN_E2E_SIFRE;

  const hash = await bcrypt.hash(sifre, 10);

  const a = await kiracıKur(E2E.kiracıA, hash, [
    { email: E2E.adminEposta, name: 'E2E Admin', role: UserRole.ADMIN },
    { email: E2E.yazarEposta, name: 'E2E Yazar', role: UserRole.REPORTER },
    { email: E2E.editorEpostasi, name: 'E2E Editör', role: UserRole.EDITOR },
    {
      email: E2E.kosayazariEpostasi,
      name: 'E2E Köşe Yazarı',
      role: UserRole.COLUMNIST,
    },
  ]);

  const b = await kiracıKur(E2E.kiracıB, hash, [
    { email: E2E.bEpostası, name: 'E2E B Admin', role: UserRole.ADMIN },
  ]);

  // B kiracısında, A'nın asla görmemesi gereken bir haber. İzolasyon testinin
  // hedefi bu kayıt.
  const bAdmin = await prisma.user.findUniqueOrThrow({
    where: { tenantId_email: { tenantId: b.id, email: E2E.bEpostası } },
  });

  await prisma.article.upsert({
    where: { tenantId_slug: { tenantId: b.id, slug: 'e2e-b-gizli-haber' } },
    update: {},
    create: {
      tenantId: b.id,
      createdById: bAdmin.id,
      title: 'B KİRACISININ GİZLİ HABERİ',
      slug: 'e2e-b-gizli-haber',
      content: 'Bu haber yalnızca B kiracısına ait.',
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
  });

  // Her içerik tipinden bir kayıt: panelin düzenleme ekranları ancak
  // düzenlenecek bir şey varsa test edilebiliyor. Bunlar olmadan o ekranlar
  // "kayıt yok" diye kapsam dışı kalırdı — kapsanıyor sanılan ama hiç
  // çalışmayan test en kötü sonuç.
  const A = a.id;
  await prisma.author.upsert({
    where: { tenantId_slug: { tenantId: A, slug: 'e2e-yazar' } },
    update: {},
    create: { tenantId: A, name: 'E2E Yazar Profili', slug: 'e2e-yazar' },
  });
  await prisma.page.upsert({
    where: { tenantId_slug: { tenantId: A, slug: 'e2e-sayfa' } },
    update: {},
    create: {
      tenantId: A,
      title: 'E2E Sayfa',
      slug: 'e2e-sayfa',
      content: '<p>E2E test sayfası.</p>',
    },
  });
  await prisma.gallery.upsert({
    where: { tenantId_slug: { tenantId: A, slug: 'e2e-galeri' } },
    update: {},
    create: { tenantId: A, title: 'E2E Galeri', slug: 'e2e-galeri' },
  });
  await prisma.video.upsert({
    where: { tenantId_slug: { tenantId: A, slug: 'e2e-video' } },
    update: {},
    create: {
      tenantId: A,
      title: 'E2E Video',
      slug: 'e2e-video',
      videoUrl: 'https://example.invalid/e2e.mp4',
    },
  });

  // Bu modellerde tekil (slug gibi) bir alan yok; varlığını ada göre kontrol
  // edip yoksa oluşturuyoruz ki tohum tekrar tekrar çalıştırılabilsin.
  const varsaGec = async (
    ad: string,
    bul: () => Promise<unknown | null>,
    olustur: () => Promise<unknown>,
  ) => {
    if (await bul()) return;
    await olustur();
    console.log(`  + ${ad}`);
  };

  await varsaGec(
    'reklam',
    () => prisma.ad.findFirst({ where: { tenantId: A, name: 'E2E Reklam' } }),
    () =>
      prisma.ad.create({
        data: { tenantId: A, name: 'E2E Reklam', position: 'HEADER_TOP' },
      }),
  );
  await varsaGec(
    'duyuru',
    () =>
      prisma.announcement.findFirst({ where: { tenantId: A, title: 'E2E Duyuru' } }),
    () =>
      prisma.announcement.create({ data: { tenantId: A, title: 'E2E Duyuru' } }),
  );
  await varsaGec(
    'son dakika',
    () =>
      prisma.breakingNews.findFirst({ where: { tenantId: A, title: 'E2E Son Dakika' } }),
    () =>
      prisma.breakingNews.create({ data: { tenantId: A, title: 'E2E Son Dakika' } }),
  );
  await varsaGec(
    'popup',
    () => prisma.popup.findFirst({ where: { tenantId: A, title: 'E2E Popup' } }),
    () => prisma.popup.create({ data: { tenantId: A, title: 'E2E Popup' } }),
  );

  console.log('E2E tohumu hazır:');
  console.log(`  Kiracı A: ${a.id} (${E2E.kiracıA.domain})`);
  console.log(`  Kiracı B: ${b.id} (${E2E.kiracıB.domain})`);
  console.log(`  Admin   : ${E2E.adminEposta}`);
  console.log(`  Yazar   : ${E2E.yazarEposta}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
