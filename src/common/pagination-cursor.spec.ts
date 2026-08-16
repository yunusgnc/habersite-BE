import { readdirSync, readFileSync, statSync } from 'fs';
import { join, relative, resolve } from 'path';

/**
 * İMLEÇ SAYFALAMASI SÖZLEŞMESİ — kaynak taraması.
 *
 * Yakalanan hata: yedi ayrı serviste `nextCursor`, listeden ATILAN kaydın
 * kimliğine eşitleniyordu. Sorgular `skip: 1` kullandığı için bir sonraki
 * sayfa o kaydın bir sonrasından başlıyor ve atılan kayıt hiçbir sayfada
 * dönmüyordu — her sayfa sınırında tam bir kayıt kayboluyordu.
 *
 * Neden çalışan test değil de kaynak taraması: her servis için veritabanlı
 * bir test yazmak, aynı kalıbın yarın sekizinci serviste tekrarlanmasını
 * engellemiyor. Hata kopyala-yapıştır ile yayıldı; denetim de kopyalanan
 * kalıbın kendisine bakmalı.
 *
 * Kural: `skip: 1` kullanan ve `nextCursor` döndüren her dosyada imleç,
 * DÖNDÜRÜLEN son kayıttan türetilmek zorunda.
 */

/** İmlecin doğru türetildiğini gösteren kabul edilebilir yazımlar. */
const DOGRU_TURETMELER = [
  /items\[items\.length - 1\]/,
  /data\[data\.length - 1\]/,
  /items\[take - 1\]/,
  /items\[limit - 1\]/,
];

function servisDosyalari(kok: string): string[] {
  const bulunan: string[] = [];
  for (const ad of readdirSync(kok)) {
    const tam = join(kok, ad);
    if (statSync(tam).isDirectory()) {
      if (ad === 'node_modules' || ad === 'dist') continue;
      bulunan.push(...servisDosyalari(tam));
    } else if (/\.service\.ts$/.test(ad) && !/\.spec\.ts$/.test(ad)) {
      bulunan.push(tam);
    }
  }
  return bulunan;
}

describe('İmleç sayfalaması sözleşmesi', () => {
  it('imleç, döndürülen son kayıttan türetiliyor', () => {
    const kok = resolve(__dirname, '..');
    const bulgular: string[] = [];

    for (const dosya of servisDosyalari(kok)) {
      const kaynak = readFileSync(dosya, 'utf8');

      // Yalnızca imleçli sayfalama yapan ve imleç döndüren dosyalar ilgilendiriyor.
      if (!kaynak.includes('skip: 1')) continue;
      if (!kaynak.includes('nextCursor')) continue;

      if (!DOGRU_TURETMELER.some((desen) => desen.test(kaynak))) {
        bulgular.push(relative(kok, dosya));
      }
    }

    expect(bulgular).toEqual([]);
  });
});
