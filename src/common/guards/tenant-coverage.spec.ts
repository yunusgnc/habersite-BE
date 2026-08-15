import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import * as ts from 'typescript';

/**
 * KİRACI İZOLASYONU DENETİMİ — bu projedeki en yüksek riskli tek konu.
 *
 * Sistem N ayrı müşteriye ayrı alan adlarıyla satılıyor ve müşteriler
 * arasındaki tek ayrım `tenantId`. `TenantGuard` isteğin hangi kiracıya ait
 * olduğuna karar veren yer; bir rota onsuz kalırsa o uçtaki sorgular kiracı
 * bağlamı olmadan çalışır ve bir müşteri diğerinin verisine ulaşabilir.
 *
 * Bu hatanın üç özelliği onu ölümcül yapıyor: sessiz (hata vermez), gecikmeli
 * (aylar sonra fark edilir) ve geri alınamaz (görülen veri görülmemiş
 * sayılamaz).
 *
 * NEDEN ROTA BAZINDA: projede iki yerleşim bir arada kullanılıyor. Bazı
 * controller'lar guard'ı sınıf üstünde bir kez yazıyor, bazıları her metodun
 * üstünde ayrı ayrı. İkincisinde yeni bir rota eklerken guard'ı yazmayı
 * unutmak son derece kolay ve hiçbir şey uyarmıyor. Sınıf seviyesinde denetim
 * yapmak bu deseni tamamen ıskalardı — asıl yakalanması gereken durum o.
 *
 * NEDEN KAYNAK AYRIŞTIRMA: sınıfları çalıştırıp Nest metadata'sını okumayı
 * denedik; bazı controller'lar dolaylı olarak yalnızca ESM yayımlanmış
 * paketler (ör. `file-type`) çekiyor ve test derleyicisi onları okuyamıyor.
 * 36 controller'ın 13'ünü "içe aktaramadım" diye atlayan bir denetim, hiç
 * denetim olmamasından kötü: koruma varmış gibi görünüp korumaz.
 */

/**
 * Kiracı kapsamı DIŞINDA kalması doğru olan controller'lar.
 *
 * Buraya satır eklemeden önce tek soru: "bu uç gerçekten hiçbir kiracıya ait
 * veri döndürmüyor mu?" Muafiyet bilinçli bir karar olmalı, bir unutma değil.
 */
const MUAF: Record<string, string | Record<string, string>> = {
  'health/health.controller.ts':
    'Yük dengeleyici ve deploy hattı için canlılık/hazırlık ucu — hiçbir kiracı verisi dönmüyor.',
  'tenants/tenants.controller.ts':
    'Kiracıların KENDİSİNİ yöneten uç; tanımı gereği kiracılar üstü. SUPER_ADMIN rolüyle korunuyor.',
  'super-admin/super-admin.controller.ts':
    'Tüm kiracıları birlikte gören yönetim paneli ucu; kiracıya sabitlenmesi işlevini bozar. SUPER_ADMIN rolüyle korunuyor.',

  // Kimlik doğrulama ucunda üç rota kiracıyı guard'dan DEĞİL başka bir
  // kaynaktan alıyor. Üçünün de gerekçesi ayrı; yazılı olmadıkları için
  // buraya geçiriliyor.
  'auth/auth.controller.ts': {
    login:
      'Kiracıyı kendisi çözüyor: `x-tenant-id` başlığı YOKSA `host` üzerinden bakıyor. TenantGuard bu esnekliği kaldırır ve alan adından giriş yapmayı 401 ile keser.',
    resetPassword:
      'Kullanıcı e-postadaki bağlantıya tıklıyor; elinde kiracı başlığı yok. Kiracı bağını tokenın kendisi taşıyor.',
    me: 'Kiracı imzalı JWT içinden geliyor; sorgu tokendaki kullanıcı kimliğiyle yapılıyor, istekten gelen hiçbir değerle değil.',
  },
};

const ROTA_DEKORATORLERI = new Set([
  'Get',
  'Post',
  'Put',
  'Patch',
  'Delete',
  'All',
  'Head',
  'Options',
]);

function controllerDosyalari(kok: string): string[] {
  const bulunan: string[] = [];
  for (const ad of readdirSync(kok)) {
    const tam = join(kok, ad);
    if (statSync(tam).isDirectory()) bulunan.push(...controllerDosyalari(tam));
    else if (ad.endsWith('.controller.ts')) bulunan.push(tam);
  }
  return bulunan;
}

function dekoratorMetni(node: ts.Node): string {
  return (ts.getDecorators(node as any) ?? []).map((d) => d.getText()).join('\n');
}

function dekoratorAdlari(node: ts.Node): string[] {
  return (ts.getDecorators(node as any) ?? []).map((d) => {
    const ifade = ts.isCallExpression(d.expression)
      ? d.expression.expression
      : d.expression;
    return ifade.getText();
  });
}

type Bulgu = { sinif: string; rota: string };

/** Dosyadaki TenantGuard'sız rotaları döndürür. */
function korumasizRotalar(dosya: string): Bulgu[] {
  const kaynak = ts.createSourceFile(
    dosya,
    readFileSync(dosya, 'utf8'),
    ts.ScriptTarget.ES2022,
    true,
  );

  const bulgular: Bulgu[] = [];

  kaynak.forEachChild((node) => {
    if (!ts.isClassDeclaration(node) || !node.name) return;
    const sinifAdi = node.name.text;
    if (!sinifAdi.endsWith('Controller')) return;

    // Sınıf üstünde guard varsa bütün rotalar kapsanıyor.
    if (dekoratorMetni(node).includes('TenantGuard')) return;

    for (const uye of node.members) {
      if (!ts.isMethodDeclaration(uye) || !uye.name) continue;
      const adlar = dekoratorAdlari(uye);
      const rotaMi = adlar.some((a) => ROTA_DEKORATORLERI.has(a));
      if (!rotaMi) continue;

      if (!dekoratorMetni(uye).includes('TenantGuard')) {
        bulgular.push({ sinif: sinifAdi, rota: uye.name.getText() });
      }
    }
  });

  return bulgular;
}

describe('Kiracı izolasyonu denetimi', () => {
  const src = join(__dirname, '..', '..');
  const dosyalar = controllerDosyalari(src);

  it('taranacak controller bulunuyor', () => {
    // Dosya bulma mantığı bozulursa denetim "hepsi geçti" diye sessizce yeşil
    // yanmasın — asıl tehlike bu olurdu.
    expect(dosyalar.length).toBeGreaterThan(20);
  });

  describe.each(dosyalar.map((d) => [relative(src, d), d]))(
    '%s',
    (goreli, tam) => {
      const muaf = MUAF[goreli as string];

      if (typeof muaf === 'string') {
        it('gerekçeli olarak tamamen kiracı kapsamı dışında', () => {
          expect(muaf.length).toBeGreaterThan(30);
          // Muafiyet bayatlamasın: guard eklendiyse listeden çıkarılmalı.
          expect(korumasizRotalar(tam as string).length).toBeGreaterThan(0);
        });
        return;
      }

      it('yalnızca gerekçesi yazılı rotalar guard dışında', () => {
        const korumasiz = korumasizRotalar(tam as string)
          .map((b) => b.rota)
          .sort();
        const izinli = Object.keys(muaf ?? {}).sort();

        // `toEqual` kasıtlı — iki yönlü çalışıyor:
        //  · Yeni bir korumasız rota eklenirse test kırılır.
        //  · Muaf bir rotaya guard eklenirse muafiyet bayatlar, test yine
        //    kırılır ve satırın silinmesi gerektiğini söyler.
        expect(korumasiz).toEqual(izinli);

        for (const [rota, gerekce] of Object.entries(muaf ?? {})) {
          // Gerekçe "gerekmiyor" gibi tek kelime olamasın; okuyanın ikna
          // olması gerekiyor.
          expect(gerekce.length).toBeGreaterThan(40);
          expect(rota).toBeTruthy();
        }
      });
    },
  );

  it('muafiyet listesinde ölü satır yok', () => {
    const mevcut = dosyalar.map((d) => relative(src, d));
    for (const yol of Object.keys(MUAF)) {
      expect(mevcut).toContain(yol);
    }
  });
});
