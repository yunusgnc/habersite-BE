import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  const tenant = await prisma.tenant.upsert({
    where: { slug: 'habersite' },
    update: {},
    create: {
      name: 'HaberSite',
      slug: 'habersite',
      domain: 'localhost',
      theme: 'classic',
      settings: {
        brandColor: '#bc1010',
        city: 'Kayseri',
        description: "Kayseri ve Türkiye'den son dakika haberleri",
      },
    },
  });

  console.log('Tenant created:', tenant.name);

  const passwordHash = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'admin@habersite.com' } },
    update: { username: 'admin' },
    create: {
      tenantId: tenant.id,
      email: 'admin@habersite.com',
      username: 'admin',
      passwordHash,
      name: 'Admin',
      role: 'ADMIN',
    },
  });

  // Platform sahibi — tenant oluşturma/satış işlemleri için
  const superPasswordHash = await bcrypt.hash('superadmin123', 10);
  await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'super@habersite.com' } },
    update: { username: 'superadmin', role: 'SUPER_ADMIN' },
    create: {
      tenantId: tenant.id,
      email: 'super@habersite.com',
      username: 'superadmin',
      passwordHash: superPasswordHash,
      name: 'Süper Admin',
      role: 'SUPER_ADMIN',
    },
  });

  const editor = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'editor@habersite.com' } },
    update: { username: 'editor' },
    create: {
      tenantId: tenant.id,
      email: 'editor@habersite.com',
      username: 'editor',
      passwordHash,
      name: 'Editör',
      role: 'EDITOR',
    },
  });

  console.log('Users created:', admin.name, editor.name);

  const categoryData = [
    { name: 'Kayseri', slug: 'kayseri', color: '#bc1010' },
    { name: 'Gündem', slug: 'gundem', color: '#1e40af' },
    { name: 'Asayiş', slug: 'asayis', color: '#b91c1c' },
    { name: 'Siyaset', slug: 'siyaset', color: '#7c3aed' },
    { name: 'Ekonomi', slug: 'ekonomi', color: '#059669' },
    { name: 'Sağlık', slug: 'saglik', color: '#0891b2' },
    { name: 'Dünya', slug: 'dunya', color: '#4338ca' },
    { name: 'Spor', slug: 'spor', color: '#16a34a' },
    { name: 'Magazin', slug: 'magazin', color: '#db2777' },
    { name: 'Eğitim', slug: 'egitim', color: '#ea580c' },
    { name: 'Bilim ve Teknoloji', slug: 'bilim-ve-teknoloji', color: '#2563eb' },
  ];

  const categories: Record<string, any> = {};
  for (const cat of categoryData) {
    categories[cat.slug] = await prisma.category.upsert({
      where: { tenantId_slug: { tenantId: tenant.id, slug: cat.slug } },
      update: {},
      create: { tenantId: tenant.id, ...cat },
    });
  }

  console.log('Categories created:', Object.keys(categories).length);

  const authorData = [
    { name: 'Yusuf AĞAŞE', slug: 'yusuf-agase', avatar: '/assets/avatars/2025/12/yusuf-agase.jpg' },
    { name: 'Ersin ÖZDEN', slug: 'ersin-ozden', avatar: '/assets/avatars/2025/12/ersin-ozden.jpg' },
    { name: 'Demet ÖZDEN', slug: 'demet-ozden', avatar: '/assets/avatars/2023/07/demet-ozden-3628-t.jpg' },
    { name: 'Ebru KAYA', slug: 'ebru-kaya', avatar: '/assets/avatars/2026/04/ebru-kaya.jpg' },
    { name: 'Esila AĞAŞE', slug: 'esila-agase', avatar: '/assets/avatars/2026/05/esila-agase.jpg' },
    { name: 'Muharrem ÖZIŞIK', slug: 'muharrem-ozisik', avatar: '/assets/avatars/2026/04/muharrem-ozisik.jpg' },
    { name: 'Özgür KALYONCU', slug: 'ozgur-kalyoncu', avatar: '/assets/avatars/t_ozgur-kalyoncu.jpg' },
    { name: 'Naz KARAKOÇ', slug: 'naz-karakoc', avatar: '/assets/avatars/2025/12/naz-karakoc.jpg' },
  ];

  for (const a of authorData) {
    await prisma.author.upsert({
      where: { tenantId_slug: { tenantId: tenant.id, slug: a.slug } },
      update: {},
      create: { tenantId: tenant.id, ...a },
    });
  }

  console.log('Authors created:', authorData.length);

  const categoryMap: Record<string, string> = {
    'Asayiş': 'asayis',
    'Spor': 'spor',
    'Siyaset': 'siyaset',
    'Kayseri': 'kayseri',
    'Dünya': 'dunya',
    'Magazin': 'magazin',
    'Gündem': 'gundem',
    'Ekonomi': 'ekonomi',
    'Eğitim': 'egitim',
    'Bilim ve Teknoloji': 'bilim-ve-teknoloji',
  };

  const media = '/assets/media/2026';
  const articles = [
    { title: 'Gazeteci Cem Küçük tutuklandı!', slug: 'gazeteci-cem-kucuk-tutuklandi', image: `${media}/08/gazeteci-cem-kucuk-tutuklandi_6a6d11229d02b_h.jpg`, category: 'Asayiş', time: '00:05', summary: 'İstanbul Cumhuriyet Başsavcılığı tarafından yürütülen soruşturma kapsamında gazeteci Cem Küçük tutuklandı.' },
    { title: 'Transfer sezonu ne zaman bitiyor? TFF duyurdu!', slug: 'transfer-sezonu-ne-zaman-bitiyor-tff-duyurdu', image: `${media}/07/transfer-sezonu-ne-zaman-bitiyor-tff-duyurdu_6a6d0a489705b.jpg`, category: 'Spor', time: '23:45' },
    { title: "İstanbul'da tutuklu CHP'li belediye başkanı sayısı 16'ya yükseldi!", slug: 'istanbulda-tutuklu-chpli-belediye-baskani-sayisi-16ya-yukseldi', image: `${media}/07/istanbulda-tutuklu-chpli-belediye-baskani-sayisi-16ya-yukseldi_6a6d05680ed95_h.jpg`, category: 'Siyaset', time: '23:25' },
    { title: '52 ilde sosyal medyada suç örgütlerini övücü paylaşım yapanlara operasyon!', slug: '52-ilde-sosyal-medyada-suc-orgutlerini-ovucu-paylasim-yapanlara-yonelik-operasyon', image: `${media}/07/52-ilde-sosyal-medyada-suc-orgutlerini-ovucu-paylasim-yapanlara-yonelik-operasyo_6a6d04a9f105f_t.jpg`, category: 'Asayiş', time: '23:24' },
    { title: "Kayserispor'da Yeni Sezon Mesaisi Devam Ediyor!", slug: 'kayserisporda-yeni-sezon-mesaisi-devam-ediyor', image: `${media}/07/kayserisporda-yeni-sezon-mesaisi-devam-ediyor_6a6d02211c32f.jpg`, category: 'Kayseri', time: '23:12' },
    { title: 'İtalya, İspanya ile Schengen uygulamasını askıya aldı!', slug: 'italya-ispanya-ile-schengen-uygulamasini-askiya-aldi', image: `${media}/07/italya-ispanya-ile-schengen-uygulamasini-askiya-aldi_6a6cff524e5f8_t.jpg`, category: 'Dünya', time: '23:01' },
    { title: 'Üsküdar Belediye Başkanı Sinem Dedetaş tutuklandı!', slug: 'uskudar-belediye-baskani-sinem-dedetas-tutuklandi', image: `${media}/07/uskudar-belediye-baskani-sinem-dedetas-tutuklandi_6a6cfe9c46412_h.jpg`, category: 'Siyaset', time: '22:45' },
    { title: "İrem Helvacıoğlu'ndan Ahbap soruşturmasında flaş ifade ve dikkat çeken tepki!", slug: 'irem-helvacioglundan-ahbap-sorusturmasinda-flas-ifade-ve-dikkat-ceken-tepki', image: `${media}/07/irem-helvacioglundan-ahbap-sorusturmasinda-flas-ifade-ve-dikkat-ceken-tepki_6a6d07d10c256_h.jpg`, category: 'Magazin', time: '22:35' },
    { title: "Erdal Beşikçioğlu soruşturmasının detayları gün yüzüne çıktı!", slug: 'erdal-besikcioglu-sorusturmasinin-detaylari', image: `${media}/07/erdal-besikcioglu-sorusturmasinin-detaylari-gun-yuzune-cikti-iste-o-7-suclama_6a6b454e80bd0_h.jpg`, category: 'Gündem' },
    { title: "Facebook ve Instagram'a erişim sorunu yaşanıyor", slug: 'facebook-ve-instagrama-erisim-sorunu-yasaniyor', image: `${media}/07/facebook-ve-instagrama-erisim-sorunu-yasaniyor_6a5cb363ba895.jpg`, category: 'Bilim ve Teknoloji' },
  ];

  for (const article of articles) {
    const catSlug = categoryMap[article.category];
    const cat = categories[catSlug];

    await prisma.article.upsert({
      where: { tenantId_slug: { tenantId: tenant.id, slug: article.slug } },
      update: {},
      create: {
        tenantId: tenant.id,
        title: article.title,
        slug: article.slug,
        spot: article.summary ?? null,
        content: { blocks: [{ type: 'paragraph', text: article.summary ?? article.title }] },
        featuredImage: article.image,
        status: 'PUBLISHED',
        publishedAt: new Date(),
        createdById: editor.id,
        categories: cat
          ? { create: { categoryId: cat.id, primary: true } }
          : undefined,
      },
    });
  }

  console.log('Articles created:', articles.length);

  await prisma.breakingNews.createMany({
    data: [
      { tenantId: tenant.id, title: 'Gazeteci Cem Küçük tutuklandı!', url: '/gazeteci-cem-kucuk-tutuklandi/151483' },
      { tenantId: tenant.id, title: 'Transfer sezonu ne zaman bitiyor? TFF duyurdu!', url: '/transfer-sezonu-ne-zaman-bitiyor-tff-duyurdu/151482' },
      { tenantId: tenant.id, title: "İstanbul'da tutuklu CHP'li belediye başkanı sayısı 16'ya yükseldi!", url: '/istanbulda-tutuklu-chpli-belediye-baskani-sayisi-16ya-yukseldi/151480' },
    ],
    skipDuplicates: true,
  });

  console.log('Breaking news created');

  const defaultWidgets: Array<{ type: string; config: any; sortOrder: number }> = [
    { type: 'weather', config: { city: 'Kayseri' }, sortOrder: 1 },
    { type: 'prayer-times', config: { city: 'Kayseri', country: 'Turkey', method: 13 }, sortOrder: 2 },
    {
      type: 'market-ticker',
      config: {
        pairs: [
          { from: 'USD', to: 'TRY', label: 'Dolar' },
          { from: 'EUR', to: 'TRY', label: 'Euro' },
          { from: 'GBP', to: 'TRY', label: 'Sterlin' },
        ],
      },
      sortOrder: 3,
    },
    { type: 'horoscope', config: {}, sortOrder: 4 },
    { type: 'pharmacy', config: { city: 'Kayseri' }, sortOrder: 5 },
    {
      type: 'homepage-layout',
      config: {
        sections: [
          { id: 'hero', type: 'hero', visible: true, order: 0, title: 'Manşet' },
          { id: 'son-haberler', type: 'category', categorySlug: '', limit: 6, visible: true, order: 1, title: 'Son Haberler' },
          { id: 'headline-slider', type: 'headline-slider', limit: 8, visible: true, order: 2, title: 'Gündem' },
          { id: 'cat-gundem', type: 'category', categorySlug: 'gundem', limit: 4, visible: true, order: 3, title: 'Gündem' },
          { id: 'video-gallery', type: 'video-gallery', limit: 6, visible: true, order: 4, title: 'Video Galeri' },
          { id: 'cat-spor', type: 'category', categorySlug: 'spor', limit: 4, visible: true, order: 5, title: 'Spor' },
          { id: 'cat-bilim', type: 'category', categorySlug: 'bilim-teknoloji', limit: 4, visible: true, order: 6, title: 'Bilim ve Teknoloji' },
          { id: 'newsletter', type: 'newsletter', visible: true, order: 7, title: 'Bülten' },
        ],
      },
      sortOrder: 10,
    },
  ];
  for (const w of defaultWidgets) {
    await prisma.widget.upsert({
      where: { tenantId_type: { tenantId: tenant.id, type: w.type } },
      update: { config: w.config, sortOrder: w.sortOrder },
      create: {
        tenantId: tenant.id,
        type: w.type,
        config: w.config,
        sortOrder: w.sortOrder,
        active: true,
      },
    });
  }

  console.log('Widgets seeded:', defaultWidgets.length);

  // KVKK, kunye, gizlilik, iletisim gibi zorunlu sayfalar — TR haber
  // siteleri için basın kanunu ve KVKK gereği.
  const requiredPages = [
    {
      slug: 'kvkk',
      title: 'KVKK Aydınlatma Metni',
      content: JSON.stringify({
        html: `<h2>6698 Sayılı Kişisel Verilerin Korunması Kanunu Aydınlatma Metni</h2>
<p>Web sitemizi ziyaret ettiğinizde çerezler aracılığıyla toplanan verileriniz KVKK kapsamında işlenmektedir. Detaylı bilgi için lütfen çerez tercihlerinizi düzenleyiniz.</p>
<h3>Toplanan Veriler</h3>
<ul><li>IP adresi</li><li>Tarayıcı bilgisi</li><li>Ziyaret tarihi</li></ul>
<p>Bu bilgiler yalnızca site deneyiminizi iyileştirmek amacıyla kullanılır.</p>`,
      }),
    },
    {
      slug: 'gizlilik-politikasi',
      title: 'Gizlilik Politikası',
      content: JSON.stringify({
        html: `<h2>Gizlilik Politikası</h2>
<p>Kullanıcılarımızın gizliliğine önem veriyoruz. Kişisel bilgileriniz üçüncü taraflarla paylaşılmaz, yalnızca site içi hizmet sunumunda kullanılır.</p>`,
      }),
    },
    {
      slug: 'kunye',
      title: 'Künye',
      content: JSON.stringify({
        html: `<h2>Künye</h2>
<p><strong>Yayın Sahibi:</strong> —</p>
<p><strong>Sorumlu Yazı İşleri Müdürü:</strong> —</p>
<p><strong>Adres:</strong> —</p>
<p><strong>İletişim:</strong> info@example.com</p>`,
      }),
    },
    {
      slug: 'yayin-ilkeleri',
      title: 'Yayın İlkeleri',
      content: JSON.stringify({
        html: `<h2>Yayın İlkelerimiz</h2>
<ul>
  <li>Basın Meslek İlkelerine bağlıyız.</li>
  <li>Doğruluk, tarafsızlık ve şeffaflığı esas alırız.</li>
  <li>Kişisel haklara saygı gösteririz.</li>
  <li>Reklam ile editöryel içeriği ayırırız.</li>
</ul>`,
      }),
    },
  ];

  for (const p of requiredPages) {
    await prisma.page.upsert({
      where: { tenantId_slug: { tenantId: tenant.id, slug: p.slug } },
      update: {},
      create: {
        tenantId: tenant.id,
        slug: p.slug,
        title: p.title,
        content: JSON.parse(p.content),
        published: true,
      },
    });
  }
  console.log('Required legal pages seeded:', requiredPages.length);
  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
