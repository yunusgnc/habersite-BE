import { readdirSync, readFileSync, statSync } from 'fs';
import { join, relative, resolve } from 'path';

/**
 * ROTA SIRASI DENETİMİ — sabit yol, parametreli yolun ARDINDAN gelmemeli.
 *
 * Yakalanan hata: `categories.controller.ts` içinde `@Patch('reorder')`,
 * `@Patch(':id')` rotasından SONRA tanımlıydı. Express rotaları bildirim
 * sırasına göre eşleştirdiği için `PATCH /categories/reorder` isteği hiçbir
 * zaman `reorder` metoduna ulaşmıyordu: "reorder" bir kategori kimliği
 * sanılıyor, gövde doğrulamaya takılıp 400 dönüyordu.
 *
 * Sonuç: kategorilerde sürükle-bırak sıralaması hiç çalışmıyordu. Panel hatayı
 * bir uyarı balonuna çevirdiği için de kimse sebebini görmedi — kullanıcı
 * kartları sürüklüyor, sayfayı yenileyince eski sıraya dönüyordu.
 *
 * Bu hata gözle bulunmaz: dosyanın en altına eklenen yeni bir uç, yüzlerce
 * satır yukarıdaki `:id` rotasının gölgesinde kalır. Denetim o yüzden var.
 *
 * Kural: aynı HTTP metodunda, sabit yollu bir rota, kendisini gölgeleyebilecek
 * parametreli bir rotadan ÖNCE tanımlanmalı.
 */

type Rota = { metot: string; yol: string; satir: number };

/** `@Get('a/:b')` gibi bildirimleri dosyadaki SIRAYLA çıkarır. */
function rotalariCikar(kaynak: string): Rota[] {
  const rotalar: Rota[] = [];
  const desen = /@(Get|Post|Put|Patch|Delete)\(\s*(?:'([^']*)'|"([^"]*)")?\s*\)/g;

  for (const eslesme of kaynak.matchAll(desen)) {
    const oncesi = kaynak.slice(0, eslesme.index ?? 0);
    rotalar.push({
      metot: eslesme[1],
      yol: (eslesme[2] ?? eslesme[3] ?? '').replace(/^\/+|\/+$/g, ''),
      satir: oncesi.split('\n').length,
    });
  }
  return rotalar;
}

/**
 * `parametreli` rotası, `sabit` rotasını gölgeliyor mu?
 *
 * Gölgeleme koşulu: parça sayıları eşit ve her konumda parametreli rotanın
 * parçası ya bir parametre (`:id`) ya da birebir aynı metin.
 */
function golgeliyorMu(parametreli: string, sabit: string): boolean {
  const a = parametreli.split('/').filter(Boolean);
  const b = sabit.split('/').filter(Boolean);
  if (a.length !== b.length || a.length === 0) return false;
  return a.every((parca, i) => parca.startsWith(':') || parca === b[i]);
}

function kontrolcuDosyalari(kok: string): string[] {
  const bulunan: string[] = [];
  for (const ad of readdirSync(kok)) {
    const tam = join(kok, ad);
    if (statSync(tam).isDirectory()) {
      if (ad === 'node_modules' || ad === 'dist') continue;
      bulunan.push(...kontrolcuDosyalari(tam));
    } else if (/\.controller\.ts$/.test(ad)) {
      bulunan.push(tam);
    }
  }
  return bulunan;
}

describe('Rota sırası', () => {
  it('sabit yollar parametreli yolların gölgesinde kalmıyor', () => {
    const kok = resolve(__dirname, '..');
    const bulgular: string[] = [];

    for (const dosya of kontrolcuDosyalari(kok)) {
      const rotalar = rotalariCikar(readFileSync(dosya, 'utf8'));

      rotalar.forEach((sabit, i) => {
        if (!sabit.yol || sabit.yol.includes(':')) return;

        const golgeleyen = rotalar
          .slice(0, i)
          .find(
            (onceki) =>
              onceki.metot === sabit.metot &&
              onceki.yol.includes(':') &&
              golgeliyorMu(onceki.yol, sabit.yol),
          );

        if (golgeleyen) {
          bulgular.push(
            `${relative(kok, dosya)}: @${sabit.metot}('${sabit.yol}') ` +
              `(satır ${sabit.satir}) — @${golgeleyen.metot}('${golgeleyen.yol}') ` +
              `(satır ${golgeleyen.satir}) tarafından gölgeleniyor; yukarı taşı`,
          );
        }
      });
    }

    expect(bulgular).toEqual([]);
  });
});
