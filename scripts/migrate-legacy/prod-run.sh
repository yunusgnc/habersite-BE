#!/usr/bin/env bash
#
# Prod aktarımını tek komutta çalıştırır. VPS üzerinde çalıştırılır.
#
#   ./scripts/migrate-legacy/prod-run.sh --dump /root/aktarim/kayseritimes.sql
#
# Secenekler:
#   --no-purge      mevcut icerigi silmeden yalnizca guncelle
#   --skip-backup   yedek adimini atla
#   --yes           onay sormadan devam et
#
# Sırayla: API container'ını bul → DATABASE_URL'i oku → yedek al →
# kuru çalıştırma → onay → gerçek aktarım.
#
# DATABASE_URL hiçbir zaman ekrana yazılmaz.
#
set -uo pipefail

TENANT_ID="cmslriv4w00002ro27zqey2mz"
CDN="https://kayseritimes-cdn.makasda.com"
NODE_IMAGE="node:22-alpine"

DUMP=""
API_CONTAINER=""
SKIP_BACKUP=0
YES=0
NO_PURGE=0

while [ $# -gt 0 ]; do
  case "$1" in
    --dump) DUMP="${2:-}"; shift 2 ;;
    --api-container) API_CONTAINER="${2:-}"; shift 2 ;;
    --skip-backup) SKIP_BACKUP=1; shift ;;
    --no-purge) NO_PURGE=1; shift ;;
    --yes) YES=1; shift ;;
    -h|--help)
      sed -n '2,11p' "$0" | sed 's/^# \{0,1\}//'
      exit 0 ;;
    *) echo "Bilinmeyen seçenek: $1" >&2; exit 2 ;;
  esac
done

die() { echo "" >&2; echo "❌ $*" >&2; exit 1; }
say() { echo ""; echo "▸ $*"; }

[ -n "$DUMP" ] || die "--dump zorunlu. Örnek: --dump /root/aktarim/kayseritimes.sql"
[ -f "$DUMP" ] || die "Dump dosyası bulunamadı: $DUMP"
command -v docker >/dev/null || die "docker bulunamadı."

# Repo kökü — bu script scripts/migrate-legacy/ içinde duruyor.
REPO="$(cd "$(dirname "$0")/../.." && pwd)"
[ -f "$REPO/package.json" ] || die "Repo kökü bulunamadı ($REPO)."

# ── 1. API container'ını bul ──────────────────────────────────────
# İşareti: içinde DATABASE_URL tanımlı bir Node container'ı.
if [ -z "$API_CONTAINER" ]; then
  say "API container'ı aranıyor…"
  CANDIDATES=""
  for c in $(docker ps --format '{{.Names}}'); do
    if docker inspect "$c" --format '{{range .Config.Env}}{{println .}}{{end}}' 2>/dev/null \
        | grep -q '^DATABASE_URL='; then
      CANDIDATES="$CANDIDATES $c"
    fi
  done
  COUNT=$(echo $CANDIDATES | wc -w | tr -d ' ')
  if [ "$COUNT" = "0" ]; then
    die "DATABASE_URL taşıyan çalışan container yok. API ayakta mı?"
  elif [ "$COUNT" != "1" ]; then
    echo "  Birden fazla aday bulundu:"
    for c in $CANDIDATES; do echo "    - $c"; done
    die "Hangisi olduğunu --api-container ile belirt."
  fi
  API_CONTAINER=$(echo $CANDIDATES | tr -d ' ')
fi
echo "  API container : $API_CONTAINER"

# ── 2. DATABASE_URL ve ağ ─────────────────────────────────────────
DB_URL=$(docker inspect "$API_CONTAINER" \
  --format '{{range .Config.Env}}{{println .}}{{end}}' 2>/dev/null \
  | sed -n 's/^DATABASE_URL=//p' | head -1)
[ -n "$DB_URL" ] || die "DATABASE_URL okunamadı."

NETWORK=$(docker inspect "$API_CONTAINER" \
  --format '{{range $k,$v := .NetworkSettings.Networks}}{{println $k}}{{end}}' \
  | grep -v '^$' | head -1)
[ -n "$NETWORK" ] || die "Container'ın ağı bulunamadı."
echo "  Docker ağı    : $NETWORK"
# Adresi maskeleyerek göster — doğru veritabanı mı diye bakabilmek için.
echo "  Veritabanı    : $(echo "$DB_URL" | sed -E 's#://[^@]*@#://***:***@#')"

# Prisma'ya özgü parametreleri ayıklar. `?schema=public`, `pgbouncer`,
# `connection_limit` gibi anahtarlar libpq tarafından tanınmıyor; pg_dump
# doğrudan bu adresle çağrılırsa "invalid URI query parameter" der.
# `sslmode` gibi gerçek libpq parametreleri korunur.
pg_url() {
  echo "$1" | sed -E \
    -e 's/([?&])(schema|pgbouncer|connection_limit|pool_timeout|socket_timeout|statement_cache_size|sslidentity|sslpassword|sslaccept)=[^&]*/\1/g' \
    -e 's/&&+/\&/g' -e 's/\?&/?/' -e 's/[?&]$//'
}

# ── 3. Yedek ──────────────────────────────────────────────────────
if [ "$SKIP_BACKUP" = "1" ]; then
  echo ""
  echo "⚠️  Yedek ATLANDI (--skip-backup)."
else
  say "Yedek alınıyor…"
  STAMP=$(date +%Y%m%d-%H%M%S)
  BACKUP_DIR="$(pwd)/yedek"
  mkdir -p "$BACKUP_DIR"
  BACKUP_OK=0
  # pg_dump sunucudan ESKİ olmamalı; yeni sürümden başlayıp geriye iniyoruz.
  for v in 17 16 15; do
    if docker run --rm --network "$NETWORK" \
        -v "$BACKUP_DIR:/yedek" \
        -e PGURL="$(pg_url "$DB_URL")" \
        "postgres:${v}-alpine" \
        sh -c 'pg_dump "$PGURL" --format=custom -f /yedek/'"habersite-$STAMP.dump" 2>/tmp/pgdump.err; then
      BACKUP_OK=1; break
    fi
    echo "  postgres:${v} ile olmadı, bir alt sürüm deneniyor…"
  done
  [ "$BACKUP_OK" = "1" ] || { cat /tmp/pgdump.err >&2; die "Yedek alınamadı. Aktarım BAŞLATILMADI."; }
  SIZE=$(stat -c%s "$BACKUP_DIR/habersite-$STAMP.dump" 2>/dev/null \
    || stat -f%z "$BACKUP_DIR/habersite-$STAMP.dump" 2>/dev/null || echo 0)
  [ "$SIZE" -gt 1000 ] || die "Yedek dosyası boş görünüyor ($SIZE bayt). Aktarım BAŞLATILMADI."
  echo "  ✓ $BACKUP_DIR/habersite-$STAMP.dump ($(( SIZE / 1024 )) KB)"
fi

# ── 4. Aktarımı çalıştıran tek kullanımlık container ──────────────
run_import() {
  local extra="$1"
  docker run --rm $( [ -t 0 ] && echo -it ) \
    --network "$NETWORK" \
    -v "$REPO:/app" \
    -v "$DUMP:/dump.sql:ro" \
    -v "$(pwd)/cikti:/app/migration-output" \
    -w /app \
    -e DATABASE_URL="$DB_URL" \
    "$NODE_IMAGE" \
    sh -c "apk add --no-cache openssl libc6-compat >/dev/null 2>&1 \
      && npm ci --silent \
      && npx prisma generate >/dev/null \
      && npx tsx scripts/migrate-legacy/import.ts \
           --dump /dump.sql \
           --tenant $TENANT_ID \
           --cdn $CDN \
           $extra"
}

mkdir -p "$(pwd)/cikti"

say "KURU ÇALIŞMA — hiçbir şey yazılmayacak"
run_import "" || die "Kuru çalışma başarısız. Aktarım BAŞLATILMADI."

# --no-purge: mevcut içeriği silmeden yalnızca güncelle. Küçük bir düzeltmeyi
# (ör. tek bir ayar veya sayfa) canlıya taşımak için — purge kullanılırsa 43
# bin haber silinip yeniden yazılacağı için site birkaç dakika eksik görünür.
if [ "$NO_PURGE" = "1" ]; then
  APPLY_ARGS="--apply"
  PURGE_NOTE="mevcut içerik SİLİNMEYECEK, yalnızca güncellenecek (--no-purge)"
else
  APPLY_ARGS="--apply --purge"
  PURGE_NOTE="mevcut haber / video / galeri / yazar / resmi ilan / kategori
kayıtları SİLİNECEK (--purge). Kullanıcılar ve ayarlar kalır."
fi

if [ "$YES" != "1" ]; then
  echo ""
  echo "───────────────────────────────────────────────────────────"
  echo "Yukarıdaki sayılar doğru mu? Devam edilirse bu tenant'ta:"
  echo "$PURGE_NOTE"
  echo "───────────────────────────────────────────────────────────"
  printf "Devam etmek için 'evet' yaz: "
  read -r ANSWER
  [ "$ANSWER" = "evet" ] || die "İptal edildi. Hiçbir şey değişmedi."
fi

say "GERÇEK AKTARIM ($APPLY_ARGS)"
run_import "$APPLY_ARGS" || die "Aktarım hata verdi. Yedek: $(pwd)/yedek/"

cat <<'SON'

═══════════════════════════════════════════════════════════
  ✅ Aktarım bitti. Sırada:
═══════════════════════════════════════════════════════════

  1) Önbelleği temizle (REVALIDATE_SECRET değerini Coolify'daki
     site servisinin env'inden al):

     curl -sS -X POST "https://makasda.com/api/revalidate?tag=articles&tag=categories&tag=settings&tag=authors&tag=menus" -H "x-revalidate-secret: BURAYA_GERCEK_DEGER"

  2) Doğrula — "total":42447 beklenir:

     curl -sS "https://api.makasda.com/api/articles?limit=1" -H "x-tenant-id: cmslriv4w00002ro27zqey2mz" | head -c 120

  3) Çıktılar ./cikti/ klasöründe:
       yazar-davetleri.csv    — 20 panel hesabı için şifre linkleri
       kapaksiz-haberler.csv  — kapağı olmayan 37 haber (editoryal iş)

  4) Yedek ./yedek/ klasöründe. Geri yüklemek gerekirse aynı script'in
     bulduğu değerlerle (PGURL'de ?schema=... OLMAMALI):

       docker run --rm --network coolify -v $(pwd)/yedek:/y \
         -e PGURL='postgres://KULLANICI:SIFRE@HOST:5432/postgres' \
         postgres:17-alpine \
         sh -c 'pg_restore -d "$PGURL" --clean --if-exists /y/DOSYA.dump'

SON
