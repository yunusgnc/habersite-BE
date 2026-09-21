/**
 * Kudüs Ana Haber (Laravel) arşivindeki görsel yollarını CDN adresine çevirir.
 *
 * Arşiv ağacı R2'ye OLDUĞU GİBİ `uploads/{tenantId}/legacy/` altına
 * kopyalanıyor, bu yüzden eşleme bire bir:
 *   resimler/icerikler/123.jpg → legacy/resimler/icerikler/123.jpg
 *
 * Veritabanı yalnızca DOSYA ADINI tutuyor (`news.image = "123.jpg"`), klasörü
 * tablo belirliyor. Eşleşme 3.268 haber + 56 yazar + 131 galeri kaydı üzerinde
 * arşivle karşılaştırılarak ölçüldü:
 *   news        → resimler/icerikler   (3.233/3.268)
 *   authors     → resimler/yazar       (55/56)
 *   videos      → resimler/video       (7/9)
 *   galleries   → resimler/galeri      (5/7)
 *   gallery_items → resimler/galeriresim, yoksa resimler/galeri  (70/124)
 *
 * DİKKAT: `1.jpg` gibi adlar birden çok klasörde var. Tablo → klasör eşlemesi
 * sabit olmalı; "hangi klasörde bulursam" mantığı yazar fotoğrafını habere
 * kapak yapar.
 */

export type KudusMedya = {
  /** Tablo klasörü + dosya adı → tam CDN adresi. */
  dosya(klasor: string, yol: string | null | undefined): string | null;
  /** Haber gövdesindeki eski adresleri CDN'e çevirir, kırıkları atar. */
  govdeyiDuzelt(html: string): string;
  /** Manifesto verildiyse: arşivde bulunamayan dosya sayıları. */
  eksikler: Record<string, number>;
};

/**
 * Manifesto verildiğinde bir dosya kendi klasöründe bulunamazsa bu sırayla
 * aranır. Ölçüm: galeri kayıtlarının bir kısmı `galeriresim` yerine `galeri`
 * altında, gövde görsellerinin bir kısmı `icerikler` yerine `images` altında.
 *
 * DİKKAT — yalnızca ADI TEKİL dosyalar için (bkz. `sayisalAd`).
 */
const ALTERNATIF_KLASORLER = [
  'resimler/icerikler',
  'resimler/images',
  'resimler/galeriresim',
  'resimler/galeri',
  'resimler/yazar',
  'resimler/video',
  'resimler/temp',
  'resimler/banner',
];

/** Eski gövdelerde geçen kendi alan adları. */
const ESKI_ALANLAR = ['kudusanahaber.com', 'www.kudusanahaber.com'];

/**
 * Gövdede kırık kaldığı ölçülen kaynaklar: editörün Word'den yapıştırdığı
 * yerel dosyalar ve yayın sırasında kullanılan iç ağ adresi. Bunlar CDN'e
 * taşınamaz, `<img>` etiketi tamamen atılır — yoksa okuyucu kırık ikon görür.
 */
const KIRIK_KAYNAK = /^(file:|https?:\/\/(10\.|192\.168\.|127\.|localhost))/i;

export function kudusMedyaCozumleyici(secenekler: {
  cdnBaseUrl: string;
  tenantId: string;
  /** R2'deki önek — rclone hedefiyle aynı olmalı. */
  prefix?: string;
  /**
   * R2'ye yüklenen arşiv dosyalarının göreli yolları. Verilirse bulunmayan
   * dosyalar için adres ÜRETİLMEZ (null döner) — kırık görsel yerine boş
   * kapak, çünkü boş kapağı panel listeleyip düzeltebiliyor.
   */
  arsiv?: Set<string>;
}): KudusMedya {
  const taban = secenekler.cdnBaseUrl.replace(/\/+$/, '');
  const onek = (secenekler.prefix ?? 'legacy').replace(/^\/+|\/+$/g, '');
  const kok = `${taban}/uploads/${secenekler.tenantId}/${onek}`;
  const arsiv = secenekler.arsiv;
  const eksikler: Record<string, number> = {};

  /**
   * `6.jpg`, `130.jpg` gibi adlar eski sitede KLASÖR BAŞINA kayıt numarası —
   * aynı ad haber, yazar, galeri ve banner klasörlerinin hepsinde var ama
   * farklı görseller. Böyle bir ad kendi klasöründe yoksa başka klasörde
   * aramak, habere rastgele bir yazar fotoğrafı basmak demek. Ölçümde 30+
   * haber bu şekilde yanlış görselle eşleşiyordu.
   */
  const sayisalAd = (ad: string) => /^\d+\.[a-z0-9]+$/i.test(ad.split('/').pop() ?? '');

  /** Manifesto varsa gerçek yolu bulur; yoksa tablo klasörünü olduğu gibi kullanır. */
  const yoluCoz = (klasor: string, ad: string): string | null => {
    const dizin = klasor.replace(/^\/+|\/+$/g, '');
    const dogrudan = dizin ? `${dizin}/${ad}` : ad;
    if (!arsiv) return dogrudan;
    if (arsiv.has(dogrudan)) return dogrudan;
    // Dosya adı zaten klasör içeriyorsa (gövde adresleri) doğrudan dene.
    if (ad.includes('/') && arsiv.has(ad)) return ad;
    if (sayisalAd(ad)) {
      eksikler[`${dizin} (arşivde yok — sayısal ad, başka klasörde aranmadı)`] =
        (eksikler[`${dizin} (arşivde yok — sayısal ad, başka klasörde aranmadı)`] ?? 0) + 1;
      return null;
    }
    for (const alternatif of ALTERNATIF_KLASORLER) {
      const aday = `${alternatif}/${ad}`;
      if (arsiv.has(aday)) {
        eksikler[`${dizin} → ${alternatif}`] =
          (eksikler[`${dizin} → ${alternatif}`] ?? 0) + 1;
        return aday;
      }
    }
    eksikler[`${dizin} (arşivde yok)`] =
      (eksikler[`${dizin} (arşivde yok)`] ?? 0) + 1;
    return null;
  };

  const dosya = (klasor: string, yol: string | null | undefined) => {
    const p = (yol ?? '').trim();
    if (!p) return null;
    // Harici ajans görseli — dokunma.
    if (/^https?:\/\//i.test(p)) return p;
    const temiz = decodeURIComponent(p.replace(/^\/+/, ''));
    const cozum = yoluCoz(klasor, temiz);
    return cozum ? `${kok}/${cozum}` : null;
  };

  const alanGrubu = ESKI_ALANLAR.map((h) => h.replace(/\./g, '\\.')).join('|');
  // Kendi alan adımızdan yazılmış mutlak adres: https://kudusanahaber.com/resimler/…
  const mutlak = new RegExp(`^https?://(?:${alanGrubu})/((?:resimler|images)/.+)$`, 'i');
  // Laravel API'si üzerinden göreli: ../../api/storage/resimler/…
  const apiYolu = /^(?:\.\.\/)+api\/storage\/((?:resimler|images)\/.+)$/i;
  // Düz göreli: /resimler/… veya resimler/…
  const duzGoreli = /^\/?((?:resimler|images)\/.+)$/i;

  /** Adres eski sitenin kendi dosyasını mı gösteriyor? Öyleyse göreli yolu döner. */
  const yerelYol = (adres: string): string | null =>
    adres.match(mutlak)?.[1] ??
    adres.match(apiYolu)?.[1] ??
    adres.match(duzGoreli)?.[1] ??
    null;

  /** Gövdedeki göreli yolu CDN adresine çevirir; arşivde yoksa null. */
  const govdeAdresi = (yol: string): string | null => {
    const temiz = decodeURIComponent(yol.replace(/^\/+/, ''));
    if (!arsiv) return `${kok}/${temiz}`;
    if (arsiv.has(temiz)) return `${kok}/${temiz}`;
    // Dosya adına düşüp bilinen klasörlerde ara — sayısal adlarda ASLA.
    const ad = temiz.split('/').pop() ?? temiz;
    if (!sayisalAd(ad)) {
      for (const alternatif of ALTERNATIF_KLASORLER) {
        if (arsiv.has(`${alternatif}/${ad}`)) return `${kok}/${alternatif}/${ad}`;
      }
    }
    eksikler['gövde görseli (arşivde yok — etiket atıldı)'] =
      (eksikler['gövde görseli (arşivde yok — etiket atıldı)'] ?? 0) + 1;
    return null;
  };

  const imgEtiketi = /<img\b[^>]*>/gi;
  const srcAlani = /\bsrc=(["'])([^"']*)\1/i;
  const baglanti = /(["'(])((?:\/|\.\.\/)?(?:resimler|images)\/[^"'\s>)]+)/gi;
  // Gövdede kalan mutlak kendi-alan-adı adresleri (href, srcset…).
  const mutlakTumu = new RegExp(
    `https?://(?:${alanGrubu})/((?:resimler|images)/[^"'\\s>)]+)`,
    'gi',
  );

  const govdeyiDuzelt = (html: string) => {
    if (!html) return html;
    return (
      html
        .replace(imgEtiketi, (etiket) => {
          const kaynak = (etiket.match(srcAlani)?.[2] ?? '').trim();
          // Word'den yapıştırılmış yerel dosya ya da iç ağ adresi — kurtarılamaz.
          if (!kaynak || KIRIK_KAYNAK.test(kaynak)) return '';
          const goreli = yerelYol(kaynak);
          // Harici ajans görseli (İHA, sondakika…) — olduğu gibi bırak.
          if (!goreli) return etiket;
          const adres = govdeAdresi(goreli);
          // Arşivde yoksa kırık ikon göstermek yerine etiketi tamamen at.
          if (!adres) return '';
          return etiket.replace(srcAlani, `src="${adres}"`);
        })
        // Geriye kalan bağlantılar (href, srcset, arka plan) — görsel olmadığı
        // için varlık doğrulaması yapmadan CDN'e yönlendiriyoruz.
        .replace(mutlakTumu, (_m, yol: string) => `${kok}/${yol}`)
        .replace(baglanti, (tam, tirnak: string, yol: string) => {
          if (/^https?:/i.test(yol)) return tam;
          const temiz = yol.replace(/^(?:\.\.\/)+/, '').replace(/^\/+/, '');
          return `${tirnak}${kok}/${temiz}`;
        })
    );
  };

  return { dosya, govdeyiDuzelt, eksikler };
}

/**
 * Eski sitenin satır içi stillerini süzer.
 *
 * NEDEN: gövdelerin çoğu WYSIWYG'den `style="font-family: Roboto; color:
 * rgb(17,17,17); font-size: 15px; line-height: 29px"` ile çıkmış. Bu, yeni
 * temanın yazı tipini ve karanlık modunu eziyor — haber gri-üstüne-gri
 * görünüyor. Hizalama gibi editoryal anlamı olan bildirimler korunuyor.
 */
const KORUNAN_BILDIRIMLER = new Set(['text-align', 'float', 'width', 'height']);

export function stilleriSuz(html: string): string {
  if (!html) return html;
  return html.replace(/\sstyle=("|')(.*?)\1/gis, (_m, tirnak: string, govde: string) => {
    const kalan = govde
      .split(';')
      .map((p) => p.trim())
      .filter(Boolean)
      .filter((p) => KORUNAN_BILDIRIMLER.has(p.split(':')[0].trim().toLowerCase()));
    return kalan.length ? ` style=${tirnak}${kalan.join('; ')}${tirnak}` : '';
  });
}
