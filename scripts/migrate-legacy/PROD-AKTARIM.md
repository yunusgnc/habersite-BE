# Kayseri Times → Prod aktarım runbook'u

Bu dosya **prod veritabanına** aktarımı adım adım anlatır. Komutlar VPS
üzerinde çalıştırılır.

## Sabitler

| | Değer |
|---|---|
| Prod tenant ID | `cmslriv4w00002ro27zqey2mz` |
| CDN adresi | `https://kayseritimes-cdn.makasda.com` |
| R2 bucket | `habersite-media` |
| Medya kökü | `uploads/cmslriv4w00002ro27zqey2mz/legacy/` |

> `--media-tenant` bayrağına **gerek yok**. O bayrak yalnızca yerel denemede
> gerekliydi: içerik yerel veritabanına yazılırken dosyalar prod tenant
> klasöründe duruyordu. Prod'da tenant ile medya klasörü aynı.

## Ön koşullar

1. **Kod deploy edilmiş olmalı.** Aktarım şemadaki yeni alanları kullanıyor;
   container her açılışta `prisma db push` çalıştırdığı için önce API'yi
   deploy et, sonra aktarımı yap.
2. Aktarım script'i **imajın içinde yok** (`tsconfig.build.json` `scripts`
   klasörünü hariç tutuyor, `tsx` de devDependency olduğu için prune ediliyor).
   Bu yüzden tek kullanımlık bir container'da çalıştırıyoruz.
3. Elde güncel bir dump ve arşiv olmalı. Müşteri her gün haber giriyor —
   DNS'i çevireceğin gün taze dump + taze medya al, aktarımı tekrarla.
   Script idempotent, ikinci kez çalıştırmak sorun değil.

---

## 1. Veritabanı yedeği — ATLAMA

`--purge` mevcut içeriği siler. Önce yedek al.

Postgres container'ını ve API'nin ağını bul:

```bash
docker ps --format '{{.Names}}\t{{.Image}}' | grep -iE 'postgres|habersite'
```

API container'ının bağlı olduğu ağ ve `DATABASE_URL`'i oku
(`<api-container>` yerine yukarıdaki isimden yaz):

```bash
docker inspect <api-container> --format '{{range $k,$v := .NetworkSettings.Networks}}{{println $k}}{{end}}'
```

```bash
docker inspect <api-container> --format '{{range .Config.Env}}{{println .}}{{end}}' | grep '^DATABASE_URL='
```

Yedeği al (`<pg-container>`, `<db-user>`, `<db-name>` değerlerini
`DATABASE_URL` içinden çıkar):

```bash
docker exec -t <pg-container> pg_dump -U <db-user> -d <db-name> --format=custom -f /tmp/yedek.dump
```

```bash
docker cp <pg-container>:/tmp/yedek.dump ./habersite-yedek-$(date +%Y%m%d-%H%M).dump
```

Dosya boyutunun 0 olmadığını doğrula:

```bash
ls -lh habersite-yedek-*.dump
```

---

## 2. Dosyaları sunucuya taşı

Kendi bilgisayarında (Mac tarafında), dump'ı gönder:

```bash
scp /Users/yunusbeto/Downloads/kayseritimes.sql root@<vps-ip>:/root/aktarim/kayseritimes.sql
```

Sunucuda repoyu hazırla:

```bash
mkdir -p /root/aktarim && cd /root/aktarim && git clone git@github.com:yunusgnc/habersite-BE.git api
```

Repo zaten varsa güncelle:

```bash
cd /root/aktarim/api && git fetch origin && git reset --hard origin/main
```

---

## 3. Kuru çalıştırma (hiçbir şey yazmaz)

`--apply` verilmediğinde script yalnızca sayar ve raporlar. **Önce bunu
çalıştır**, sayıları kontrol et.

`<coolify-network>` ve `<DATABASE_URL>` değerlerini 1. adımdan al:

```bash
docker run --rm -it --network <coolify-network> -v /root/aktarim/api:/app -v /root/aktarim/kayseritimes.sql:/dump.sql:ro -w /app -e DATABASE_URL='<DATABASE_URL>' node:22-alpine sh -c "apk add --no-cache openssl libc6-compat >/dev/null && npm ci --silent && npx prisma generate && npx tsx scripts/migrate-legacy/import.ts --dump /dump.sql --tenant cmslriv4w00002ro27zqey2mz --cdn https://kayseritimes-cdn.makasda.com"
```

Beklenen çıktı (yerelde ölçülen değerler — dump aynıysa aynı olmalı):

```
haber                         41.935
medya kütüphanesi kaydı       41.812
köşe yazısı                    1.087
video                            128
yazar                             53
panel hesabı                      20
künye alanı                       16
site ayarı                        15
kategori                          11
resmi ilan                         4
statik sayfa                       3
galeri                             2
```

`haber görseli MResim'den alındı 79`, `DResim'den 17`, `AMPWebp'den 1`
satırları da görünür — kapak alanı boş olup manşet görseli olan haberler.

`Tenant doğrulandı: ...` satırının doğru müşteriyi gösterdiğini kontrol et.

---

## 4. Gerçek aktarım

Kuru çalıştırma temizse `--apply --purge` ekle. **`--purge` prod tenant'taki
mevcut haber / video / galeri / yazar / resmi ilan / kategori kayıtlarını ve
migration'ın ürettiği medya satırlarını siler.** Kullanıcı hesapları ve
ayarlar korunur.

```bash
docker run --rm -it --network <coolify-network> -v /root/aktarim/api:/app -v /root/aktarim/kayseritimes.sql:/dump.sql:ro -v /root/aktarim/cikti:/app/migration-output -w /app -e DATABASE_URL='<DATABASE_URL>' node:22-alpine sh -c "apk add --no-cache openssl libc6-compat >/dev/null && npm ci --silent && npx prisma generate && npx tsx scripts/migrate-legacy/import.ts --dump /dump.sql --tenant cmslriv4w00002ro27zqey2mz --cdn https://kayseritimes-cdn.makasda.com --apply --purge"
```

Süre: yerelde ~4 dakika. Sonunda `✅ Aktarım tamamlandı.` yazması gerekir.

Yazar davet linkleri `/root/aktarim/cikti/yazar-davetleri.csv` dosyasına
yazılır — 20 panel hesabı için şifre sıfırlama bağlantıları burada.

Aynı klasöre `kapaksiz-haberler.csv` de çıkar: eski veritabanında hiçbir
görsel kolonu dolu olmayan 37 yayında haber. Panelden elle kapak atanabilir,
medya kütüphanesinde 41.926 görsel ve çalışan arama var.

---

## 5. Önbelleği temizle

Site ISR ile çalışıyor; aktarımdan sonra etiketleri boşalt:

```bash
curl -sS -X POST "https://makasda.com/api/revalidate?tag=articles&tag=categories&tag=settings&tag=authors&tag=menus" -H "x-revalidate-secret: <REVALIDATE_SECRET>"
```

`REVALIDATE_SECRET` Coolify'daki site servisinin env'inde. Tanımlı değilse
başlık göndermeye gerek yok.

---

## 6. Doğrulama

Haber sayısı ve kategoriler:

```bash
curl -sS "https://api.makasda.com/api/articles?limit=1" -H "x-tenant-id: cmslriv4w00002ro27zqey2mz" | head -c 200
```

`"total":42447` beklenir (yayında olan haber sayısı).

```bash
curl -sS "https://api.makasda.com/api/categories" -H "x-tenant-id: cmslriv4w00002ro27zqey2mz"
```

11 kategori dönmeli, hiçbiri boş olmamalı.

Taslak sızıntısı kapalı mı (anonim istek DRAFT zorlasa bile PUBLISHED dönmeli):

```bash
curl -sS "https://api.makasda.com/api/articles?limit=5&status=DRAFT" -H "x-tenant-id: cmslriv4w00002ro27zqey2mz" | grep -o '"status":"[A-Z]*"' | sort -u
```

Sadece `"status":"PUBLISHED"` çıkmalı.

Görseller: sitede birkaç sayfa gez, kırık görsel olmamalı. Ayrıntılı denetim
için arşiv sunucuda ise:

```bash
node --env-file=.env scripts/migrate-legacy/verify-media.mjs --archive /yol/archive/storage/app/public/images
```

---

## 7. DNS'ten ÖNCE: URL yapısı

42 bin indeksli adresi korumak için site servisine şunları **Build & Runtime**
olarak ekle ve **yeniden build et** (Next.js standalone'da `NEXT_PUBLIC_*`
runtime'da değişmez):

```
NEXT_PUBLIC_ARTICLE_PATH_PREFIX=haber
NEXT_PUBLIC_COLUMN_PATH_PREFIX=makale
NEXT_PUBLIC_CATEGORY_PATH_PREFIX=kategori
```

Build sonrası bir haber adresinin `/haber/<slug>` biçiminde olduğunu doğrula,
sonra DNS'i çevir.

---

## Geri dönüş

Bir şey ters giderse yedeği geri yükle:

```bash
docker cp ./habersite-yedek-<damga>.dump <pg-container>:/tmp/geri.dump
```

```bash
docker exec -t <pg-container> pg_restore -U <db-user> -d <db-name> --clean --if-exists /tmp/geri.dump
```

---

## Not: `db push --accept-data-loss`

`Dockerfile` son satırı her container açılışında bunu çalıştırıyor:

```
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node dist/src/main.js"]
```

Şu ana kadarki şema değişiklikleri tamamen **ekleme** olduğu için güvenli.
Ama 43 bin gerçek haber girdikten sonra bu satır kalıcı bir risk: ileride bir
kolon adı değişirse Prisma soru sormadan siler. `prisma migrate deploy`'a
geçirilmesi önerilir.
