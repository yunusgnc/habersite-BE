import { NoticeType } from '@prisma/client';
import slugify from 'slugify';

/**
 * ESKİ SİTEDEN GELEN "RESMİ REKLAMLAR" HABERLERİNİ RESMİ İLANA ÇEVİRİR.
 *
 * Eski sitede resmi ilanlar ayrı bir modül değil, "Resmi Reklamlar"
 * kategorisindeki haberlerdi: gövdesi boş, taşıdığı tek içerik ilan görseli.
 * Bu yüzden /resmi-ilanlar sayfası boş görünüyor, ilanlar ise haber
 * listelerinde duruyor.
 *
 * Buradaki işlevler yalnızca dönüşümü yapıyor — veritabanına yazmıyor ve
 * ağa çıkmıyor. Böylece eşleme kuralları testle doğrulanabiliyor.
 */

/** Haber tarafından gelen, dönüşüm için gereken alanlar. */
export type KaynakHaber = {
  id: string;
  title: string;
  slug: string;
  spot?: string | null;
  seoDesc?: string | null;
  content?: unknown;
  featuredImage?: string | null;
  publishedAt?: Date | string | null;
  createdAt?: Date | string | null;
};

export type IlanKaydi = {
  title: string;
  slug: string;
  noticeType: NoticeType;
  institution: string;
  summary: string | null;
  content: string;
  attachments: { url: string; name: string }[];
  publishedAt: Date;
  expiresAt: Date | null;
};

/** Kurum bulunamayan ilanlar bu kovaya düşüyor — sitede süzgeç olarak görünür. */
export const KURUM_BILINMIYOR = 'Diğer Kurumlar';

/**
 * Kurum adı kalıpları. Sıra önemli: "Büyükşehir Belediyesi" daha özel,
 * "Belediyesi"nden önce denenmeli.
 */
const KURUM_KALIPLARI: { desen: RegExp; ad: (eslesme: RegExpMatchArray) => string }[] = [
  {
    desen: /\b([A-ZÇĞİÖŞÜa-zçğıöşü]+)\s+B(?:üyükşehir|\.?\s?B\.?)\s*Beled/iu,
    ad: (m) => `${buyukHarfBasla(m[1])} Büyükşehir Belediyesi`,
  },
  { desen: /\bbüyükşehir\b/iu, ad: () => 'Kayseri Büyükşehir Belediyesi' },
  // "Kayseri B.B. İhale İlanı" — büyükşehir belediyesinin yaygın kısaltması.
  {
    desen: /\b([A-ZÇĞİÖŞÜa-zçğıöşü]+)\s+b\.?\s?b\.?(?:\s|$)/iu,
    ad: (m) => `${buyukHarfBasla(m[1])} Büyükşehir Belediyesi`,
  },
  {
    desen: /\b([A-ZÇĞİÖŞÜa-zçğıöşü]+)\s+beled/iu,
    ad: (m) => `${buyukHarfBasla(m[1])} Belediyesi`,
  },
  { desen: /\bticaret\s+odas/iu, ad: () => 'Kayseri Ticaret Odası' },
  { desen: /\bsanayi\s+odas/iu, ad: () => 'Kayseri Sanayi Odası' },
  { desen: /\bticaret\s+borsas/iu, ad: () => 'Kayseri Ticaret Borsası' },
  { desen: /\büniversite/iu, ad: () => 'Üniversite' },
  { desen: /\b(defterdarl|vergi\s+dairesi)/iu, ad: () => 'Defterdarlık' },
  { desen: /\b(icra|mahkeme)/iu, ad: () => 'Adliye' },
  { desen: /\b(kaymakaml|valilik)/iu, ad: () => 'Valilik / Kaymakamlık' },
  { desen: /\bmilli\s+emlak/iu, ad: () => 'Milli Emlak' },
  { desen: /\btedaş|enerji\s+dağıtım/iu, ad: () => 'Enerji Dağıtım' },
];

/** İlan türü anahtar kelimeleri. İlk eşleşen kazanır, sıra özelden genele. */
const TUR_KALIPLARI: { desen: RegExp; tur: NoticeType }[] = [
  { desen: /\bihale/iu, tur: NoticeType.TENDER },
  { desen: /\b(müzayede|mezat|satış|satis|satılık|arsa|daire|villa|iş\s?yeri|ofis)/iu, tur: NoticeType.AUCTION },
  { desen: /\b(personel|alım|alim|işçi|memur|sözleşmeli|sinav|sınav)/iu, tur: NoticeType.RECRUITMENT },
  { desen: /\b(imar|plan\s+değişikliği|parselasyon|kamulaştırma)/iu, tur: NoticeType.ZONING },
  { desen: /\b(icra|mahkeme|tebligat|tebliğ)/iu, tur: NoticeType.COURT },
  { desen: /\b(duyuru|ilan|davet|fuar|şenlik|bayram|yardım)/iu, tur: NoticeType.ANNOUNCEMENT },
];

/**
 * Eşleştirme için başlığı katlar.
 *
 * Türkçe İ (U+0130) ve ASCII I, `toLowerCase` ya da `/i` bayrağıyla ASCII
 * 'i' harfine dönmüyor: biri noktalı 'i̇', diğeri 'ı' oluyor. Bu yüzden
 * "Kayseri B.B. İhale İlanı" başlığı `/ihale/i` kalıbına takılmıyor ve ilan
 * türü OTHER olarak kalıyordu. İki harf de elle 'i'ye indiriliyor.
 */
function katla(metin: string): string {
  return metin.replace(/[İI]/g, 'i').toLowerCase();
}

function buyukHarfBasla(kelime: string): string {
  return kelime.charAt(0).toLocaleUpperCase('tr-TR') + kelime.slice(1).toLocaleLowerCase('tr-TR');
}

export function kurumBul(baslik: string): string {
  // Kurum adı eşleşmeden ALINIYOR (m[1]), o yüzden katlanmış metinde arayıp
  // ham metinden okumak gerekiyor: konumlar birebir aynı, uzunluk değişmiyor.
  const katlanmis = katla(baslik);
  for (const kalip of KURUM_KALIPLARI) {
    const eslesme = katlanmis.match(kalip.desen);
    if (eslesme) return kalip.ad(eslesme);
  }
  return KURUM_BILINMIYOR;
}

export function ilanTuruBul(baslik: string): NoticeType {
  const katlanmis = katla(baslik);
  for (const kalip of TUR_KALIPLARI) {
    if (kalip.desen.test(katlanmis)) return kalip.tur;
  }
  return NoticeType.OTHER;
}

/**
 * Adres parçası. Eski kayıtların bir kısmında slug alanına kaynak site
 * adresi yazılmış ("https://www.talas.bel.tr/-750"); böyle bir değer adres
 * olarak kullanılamaz, başlıktan yeniden üretiliyor.
 */
export function ilanSlugu(haber: KaynakHaber): string {
  const mevcut = (haber.slug ?? '').trim();
  const bozuk = !mevcut || /^https?:|[/:?#]/.test(mevcut);
  const kaynak = bozuk ? haber.title : mevcut;
  const uretilen = slugify(kaynak, { lower: true, strict: true, locale: 'tr' });
  // Başlık tamamen noktalama ya da emoji ise slugify boş dönebiliyor.
  return uretilen || `ilan-${haber.id.slice(-8)}`;
}

/** Haber gövdesi `{ html }` ya da düz metin olarak saklanmış olabiliyor. */
function govdeMetni(content: unknown): string {
  if (!content) return '';
  if (typeof content === 'string') return content;
  if (typeof content === 'object' && content !== null) {
    const html = (content as { html?: unknown }).html;
    if (typeof html === 'string') return html;
  }
  return '';
}

/** "Resmi İlan: " gibi otomatik eklenmiş önekler özete taşınmasın. */
function ozet(haber: KaynakHaber): string | null {
  const ham = (haber.spot ?? haber.seoDesc ?? '').trim();
  if (!ham) return null;
  // Türkçe İ (U+0130) ASCII 'i' ile eşleşmiyor: `/i` bayrağı yalnızca basit
  // katlama yapıyor. Harf sınıfı bu yüzden elle yazılıyor.
  const temiz = ham.replace(/^resm[iİ]\s+[iİ]lan\s*[:—-]\s*/i, '').trim();
  // Özet yalnızca başlığın tekrarıysa bilgi taşımıyor.
  return temiz && temiz.toLocaleLowerCase('tr-TR') !== haber.title.trim().toLocaleLowerCase('tr-TR')
    ? temiz
    : null;
}

/**
 * Tek haberi ilan kaydına çevirir.
 *
 * `gecerlilikGun`: ilanın yayından kaç gün sonra arşive düşeceği. Eski
 * ilanların tamamı bu sayede arşive iniyor, yeni olanlar bir süre
 * yürürlükte kalıyor. Kaynakta son başvuru tarihi tutulmadığı için tarih
 * ancak böyle türetilebiliyor.
 */
export function habereGoreIlan(haber: KaynakHaber, gecerlilikGun = 30): IlanKaydi {
  const yayin = new Date(haber.publishedAt ?? haber.createdAt ?? Date.now());
  const gorsel = (haber.featuredImage ?? '').trim();

  return {
    title: haber.title.trim(),
    slug: ilanSlugu(haber),
    noticeType: ilanTuruBul(haber.title),
    institution: kurumBul(haber.title),
    summary: ozet(haber),
    content: govdeMetni(haber.content),
    // İlanın kendisi görselde: ek olarak bağlanıyor, sayfa onu basıyor.
    attachments: gorsel ? [{ url: gorsel, name: `${haber.title.trim()} (ilan görseli)` }] : [],
    publishedAt: yayin,
    expiresAt: new Date(yayin.getTime() + gecerlilikGun * 86400000),
  };
}
