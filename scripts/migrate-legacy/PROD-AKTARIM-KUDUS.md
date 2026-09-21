# Kudüs Ana Haber → Prod aktarım runbook'u

Kayseri Times runbook'unun (`PROD-AKTARIM.md`) Kudüs sürümü. Kaynak şema
farklı (İngilizce Laravel tabloları), betik de ayrı: `import-kudus.ts`.

## Sabitler

| | Değer |
|---|---|
| Prod kiracı ID | `cmtzpuk5i000f07nl4t7j9fyj` |
| CDN adresi | `https://kudusanahaber-cdn.makasda.com` |
| R2 bucket | `habersite-media` |
| Medya kökü | `uploads/cmtzpuk5i000f07nl4t7j9fyj/legacy/` |
| VPS | `91.108.121.75` (Coolify) |
| API container | `ponwdnx77fo6wxypxtthsmrj-…` (S3_BUCKET=habersite-media, PORT 4000) |
| Postgres container | `vhntyzkfrtd16wto88a1zdye` (postgres:16-alpine) |
| Docker ağı | `coolify` |

## Kaynak veriler

- Dump: `kudusanahaber_db-18.09.2026.sql` (MariaDB 10.11, 7,6 MB, 29 tablo)
- Medya arşivi: `kudusanahaber-images/` (15.118 dosya / 1,2 GB)

Arşivin tamamı yüklenmez: `resimler/icerikler/{115,165,340}` eski sitenin
küçültülmüş kopyaları, `resimler/_thumbs` da önbellek. Yüklenen: **4.654
dosya / 931 MB**.

## 1. Veritabanı yedeği — ATLAMA

```bash
docker exec -t vhntyzkfrtd16wto88a1zdye pg_dump -U postgres -d postgres --format=custom -f /tmp/kudus-oncesi.dump
```

```bash
docker cp vhntyzkfrtd16wto88a1zdye:/tmp/kudus-oncesi.dump /root/aktarim/habersite-yedek-$(date +%Y%m%d-%H%M).dump
```

## 2. Görselleri R2'ye yükle (Mac'ten)

```bash
cd ~/Downloads/kudusanahaber-images && rclone copy . r2:habersite-media/uploads/cmtzpuk5i000f07nl4t7j9fyj/legacy/ --exclude "resimler/icerikler/115/**" --exclude "resimler/icerikler/165/**" --exclude "resimler/icerikler/340/**" --exclude "resimler/_thumbs/**" --exclude ".DS_Store" --header-upload "Cache-Control: public, max-age=31536000, immutable" --transfers 16 --checkers 16
```

Yükleme sonrası manifestoyu tazele — betik hangi görselin gerçekten var
olduğunu buradan biliyor:

```bash
cd ~/Downloads/kudusanahaber-images && find . -type f -not -path "./resimler/icerikler/115/*" -not -path "./resimler/icerikler/165/*" -not -path "./resimler/icerikler/340/*" -not -path "./resimler/_thumbs/*" -not -name ".DS_Store" | sed 's|^\./||' | sort > ~/Desktop/haber-sitesi/habersite-api/scripts/migrate-legacy/kudus-arsiv.txt
```

## 3. Dosyaları sunucuya taşı

```bash
scp ~/Downloads/kudusanahaber_db-18.09.2026.sql root@91.108.121.75:/root/aktarim/kudusanahaber.sql
```

```bash
ssh root@91.108.121.75 'cd /root/aktarim/api && git fetch origin && git reset --hard origin/main'
```

## 4. Kuru çalıştırma (hiçbir şey yazmaz)

```bash
ssh root@91.108.121.75 'sh /root/aktarim/kudus-aktar.sh'
```

Beklenen çıktı:

```
haber                                 3.263
köşe yazısı                             177
galeri görseli                          107
galeri görseli (adres çözüldü)           66
haber (slug çakışması çözüldü)           60
yazar                                    55
yorum                                    25
video                                     7
galeri                                    5
haber (kapaksız)                          4
```

`Kiracı doğrulandı: Kudüs Ana Haber` satırının doğru müşteriyi gösterdiğini
kontrol et.

## 5. Gerçek aktarım

```bash
ssh root@91.108.121.75 'sh /root/aktarim/kudus-aktar.sh --apply'
```

**`--purge` YOK.** Hedef kiracıda müşterinin panelden girdiği içerik var;
aktarım slug üzerinden üzerine yazar, hiçbir şey silmez. Betik yeniden
çalıştırılabilir, kayıt ikizlemez.

Kapaksız haberler `/root/aktarim/cikti/kudus-kapaksiz-haberler.csv` dosyasına
yazılır — panelden elle kapak atanabilir.

## 6. Önbelleği temizle

```bash
curl -sS -X POST "https://kudusanahaber.com/api/revalidate?tag=articles&tag=categories&tag=authors&tag=settings" -H "x-revalidate-secret: <REVALIDATE_SECRET>"
```

## 7. Doğrulama

```bash
curl -sS "https://api.makasda.com/api/articles?limit=1" -H "x-tenant-id: cmtzpuk5i000f07nl4t7j9fyj" | head -c 200
```

Taslak sızıntısı kapalı mı:

```bash
curl -sS "https://api.makasda.com/api/articles?limit=5&status=DRAFT" -H "x-tenant-id: cmtzpuk5i000f07nl4t7j9fyj" | grep -o '"status":"[A-Z]*"' | sort -u
```

## Veri notları — müşteriye anlatılacaklar

- **Kategoriler:** eski sitede haberlerin 3.149'u tek bir `.GÜNCEL`
  kategorisinde. Bu kategori paneldeki **GÜNCEL**'e bağlanıyor; GAZZE,
  FİLİSTİN, SURİYE gibi kategoriler eski veritabanında yok. Dağıtım
  panelden toplu kategori değiştirme ile yapılabilir.
- **Manşet bayrakları alınmıyor:** eski panelde `is_headline` 3.220,
  `is_breaking` 3.267 kayıtta 1 — hiç kullanılmamış. Aktarılsaydı her haber
  manşet olurdu.
- **Panel hesapları aktarılmıyor:** `users` tablosundaki 21 hesabın çoğu
  sahte adresli (`kadir@kadir`), yazarların hiçbirinin e-postası yok.
- **Tarih boşluğu:** içerik 2021-05 → 2023-10 arası, sonra 2026-04'ten
  itibaren 28 haber. Aradaki 2,5 yılda site durmuş.
- **Ayarlar/reklamlar/gazete manşetleri aktarılmıyor:** kiracıda müşterinin
  kendi ayarları var, üzerine yazmak siteyi bozar.

## Geri dönüş

```bash
docker cp /root/aktarim/habersite-yedek-<damga>.dump vhntyzkfrtd16wto88a1zdye:/tmp/geri.dump
```

```bash
docker exec -t vhntyzkfrtd16wto88a1zdye pg_restore -U postgres -d postgres --clean --if-exists /tmp/geri.dump
```
