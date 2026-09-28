import { NoticeType } from '@prisma/client';
import {
  KURUM_BILINMIYOR,
  habereGoreIlan,
  ilanSlugu,
  ilanTuruBul,
  kurumBul,
  type KaynakHaber,
} from './haber-ilan-donusturucu';

/**
 * Başlıklar canlıdaki "Resmi Reklamlar" kategorisinden alındı
 * (kayseritimes.com, 137 haber).
 */

const haber = (over: Partial<KaynakHaber> = {}): KaynakHaber => ({
  id: 'cmuecx4mu0x5w4ynurenq2u6v',
  title: 'Hacılar Belediyesi Arsa Satış Duyurusu',
  slug: 'hacilar-belediyesi-arsa-satis-duyurusu',
  publishedAt: '2026-09-04T12:18:00.000Z',
  featuredImage: 'https://cdn.example.com/ilan-1788513699.webp',
  ...over,
});

describe('kurumBul', () => {
  it('ilçe belediyesini adıyla çıkarır', () => {
    expect(kurumBul('Hacılar Belediyesi Arsa Satış Duyurusu')).toBe('Hacılar Belediyesi');
    expect(kurumBul('talas belediyesi satış duyurusu')).toBe('Talas Belediyesi');
  });

  it('büyükşehiri ilçe belediyesiyle karıştırmaz', () => {
    expect(kurumBul('kayseri büyükşehir 6.uluslararası yarı maraton')).toBe(
      'Kayseri Büyükşehir Belediyesi',
    );
    expect(kurumBul('Kayseri B.B. İhale İlanı')).toBe('Kayseri Büyükşehir Belediyesi');
  });

  it('odaları tanır', () => {
    expect(kurumBul('kayseri sanayi odası kurban')).toBe('Kayseri Sanayi Odası');
    expect(kurumBul('Ticaret Odası Kurban')).toBe('Kayseri Ticaret Odası');
  });

  it('kurum çıkmayan başlığı ortak kovaya koyar', () => {
    // `institution` sütunu NOT NULL; boş bırakmak kayıt yazmayı engellerdi.
    expect(kurumBul('https://www.kayseri.bel.tr/')).toBe(KURUM_BILINMIYOR);
  });
});

describe('ilanTuruBul', () => {
  it('ihaleyi satıştan önce seçer', () => {
    // Başlıkta hem "ihale" hem "daire" geçiyor; tür ihale olmalı.
    expect(ilanTuruBul('Melikgazi beld.22 daire - 3 villa - 3 iş yeri ihale ilanı.')).toBe(
      NoticeType.TENDER,
    );
  });

  it('Türkçe İ ile yazılmış ihaleyi tanır', () => {
    // `/ihale/i` kalıbı "İhale"yi yakalamıyordu: İ (U+0130) ASCII 'i'ye
    // katlanmıyor ve tür OTHER kalıyordu.
    expect(ilanTuruBul('Kayseri B.B. İhale İlanı')).toBe(NoticeType.TENDER);
    expect(ilanTuruBul('KAYSERİ BÜYÜKŞEHİR BELEDİYESİ İHALE İLANI')).toBe(NoticeType.TENDER);
  });

  it('satış ve müzayedeyi AUCTION sayar', () => {
    expect(ilanTuruBul('Talas beld.satış ilanı.1 daire.13 villa')).toBe(NoticeType.AUCTION);
    expect(ilanTuruBul('TALAS BELEDİYE BAŞKANLIĞI ANTİKA MÜZAYEDE FUARI')).toBe(
      NoticeType.AUCTION,
    );
  });

  it('duyuru ve etkinlikleri ANNOUNCEMENT sayar', () => {
    expect(ilanTuruBul('Kayseri Büyükşehir Belediyesi Kitap Fuarı')).toBe(
      NoticeType.ANNOUNCEMENT,
    );
    expect(ilanTuruBul('Kayseri Büyükşehir Belediyesi Beslenme yardımı')).toBe(
      NoticeType.ANNOUNCEMENT,
    );
  });

  it('hiçbir kalıp tutmazsa OTHER döner', () => {
    expect(ilanTuruBul('Kayeri Büyükşehir Beledeiyesi')).toBe(NoticeType.OTHER);
  });
});

describe('ilanSlugu', () => {
  it('sağlam slugu korur', () => {
    expect(ilanSlugu(haber())).toBe('hacilar-belediyesi-arsa-satis-duyurusu');
  });

  it('slug alanına adres yazılmış kayıtları başlıktan yeniden üretir', () => {
    // Canlıda gerçekten böyle: slug = "https://www.talas.bel.tr/-750".
    const s = ilanSlugu(
      haber({ slug: 'https://www.talas.bel.tr/-750', title: 'talas belediyesi satış duyurusu' }),
    );
    expect(s).toBe('talas-belediyesi-satis-duyurusu');
  });

  it('başlık da slug üretmiyorsa kimlikten bir adres verir', () => {
    const s = ilanSlugu(haber({ slug: '', title: '...' }));
    expect(s).toBe('ilan-renq2u6v');
  });
});

describe('habereGoreIlan', () => {
  it('ilan görselini ek olarak bağlar', () => {
    const ilan = habereGoreIlan(haber());
    expect(ilan.attachments).toEqual([
      {
        url: 'https://cdn.example.com/ilan-1788513699.webp',
        name: 'Hacılar Belediyesi Arsa Satış Duyurusu (ilan görseli)',
      },
    ]);
  });

  it('görseli olmayan haberde ek listesi boş kalır', () => {
    expect(habereGoreIlan(haber({ featuredImage: null })).attachments).toEqual([]);
  });

  it('geçerlilik tarihini yayın tarihine göre kurar', () => {
    const ilan = habereGoreIlan(haber(), 30);
    expect(ilan.publishedAt.toISOString()).toBe('2026-09-04T12:18:00.000Z');
    expect(ilan.expiresAt?.toISOString()).toBe('2026-10-04T12:18:00.000Z');
  });

  it('otomatik eklenmiş "Resmi İlan:" önekini özetten atar', () => {
    const ilan = habereGoreIlan(
      haber({ seoDesc: 'Resmi İlan: talas belediyesi satış duyurusu', title: 'Başka Başlık' }),
    );
    expect(ilan.summary).toBe('talas belediyesi satış duyurusu');
  });

  it('özet yalnızca başlığın tekrarıysa boş bırakır', () => {
    const ilan = habereGoreIlan(haber({ seoDesc: 'Hacılar Belediyesi Arsa Satış Duyurusu' }));
    expect(ilan.summary).toBeNull();
  });

  it('gövdeyi `{ html }` yapısından okur', () => {
    expect(habereGoreIlan(haber({ content: { html: '<p>metin</p>' } })).content).toBe(
      '<p>metin</p>',
    );
    expect(habereGoreIlan(haber({ content: null })).content).toBe('');
  });

  it('yayın tarihi yoksa oluşturma tarihine düşer', () => {
    const ilan = habereGoreIlan(
      haber({ publishedAt: null, createdAt: '2026-01-02T03:04:05.000Z' }),
    );
    expect(ilan.publishedAt.toISOString()).toBe('2026-01-02T03:04:05.000Z');
  });
});
