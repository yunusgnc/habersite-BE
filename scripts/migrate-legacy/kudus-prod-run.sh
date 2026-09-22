#!/bin/sh
# Kudüs Ana Haber aktarımını tek kullanımlık bir container'da çalıştırır.
#   kullanım: sh kudus-aktar.sh            → kuru çalışma (hiçbir şey yazmaz)
#             sh kudus-aktar.sh --apply    → gerçek aktarım
#
# Aktarım script'i imajın içinde yok (tsconfig.build.json scripts/ klasörünü
# dışlıyor, tsx de devDependency), bu yüzden ayrı container kullanıyoruz.
set -e

KIRACI=cmtzpuk5i000f07nl4t7j9fyj
CDN=https://kudusanahaber-cdn.makasda.com
KOK=/root/aktarim

# API container'ının adı her deploy'da değişiyor (Coolify rastgele son ek
# veriyor), o yüzden sabit isme güvenmiyoruz: S3_BUCKET=habersite-media
# yalnızca bu uygulamada tanımlı, ondan buluyoruz.
API_CONTAINER=""
for c in $(docker ps --format '{{.Names}}'); do
  if docker inspect "$c" --format '{{range .Config.Env}}{{println .}}{{end}}' 2>/dev/null | grep -q '^S3_BUCKET=habersite-media$'; then
    API_CONTAINER="$c"
    break
  fi
done
if [ -z "$API_CONTAINER" ]; then echo "API container bulunamadı"; exit 1; fi
echo "API container: $API_CONTAINER"

DB=$(docker inspect "$API_CONTAINER" --format '{{range .Config.Env}}{{println .}}{{end}}' | sed -n 's/^DATABASE_URL=//p')
if [ -z "$DB" ]; then echo "DATABASE_URL okunamadı"; exit 1; fi

docker run --rm \
  --network coolify \
  -v "$KOK/api:/app" \
  -v "$KOK/kudusanahaber.sql:/dump.sql:ro" \
  -v "$KOK/cikti:/app/migration-output" \
  -w /app \
  -e DATABASE_URL="$DB" \
  node:22-alpine \
  sh -c "apk add --no-cache openssl libc6-compat >/dev/null && \
         npm ci --silent && \
         npx prisma generate >/dev/null && \
         npx tsx scripts/migrate-legacy/import-kudus.ts \
           --dump /dump.sql \
           --tenant $KIRACI \
           --cdn $CDN \
           --arsiv scripts/migrate-legacy/kudus-arsiv.txt $*"
