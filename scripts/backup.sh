#!/usr/bin/env bash
# Postgres + uploads yedeği alır. Cron ile günlük çalıştırılmak üzere.
# Kullanım: BACKUP_DIR=/var/backups/habersite ./scripts/backup.sh
set -euo pipefail

DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR=${BACKUP_DIR:-./backups}
mkdir -p "$BACKUP_DIR"

# DATABASE_URL zorunlu
: "${DATABASE_URL:?DATABASE_URL env değişkeni gerekli}"

DUMP_FILE="$BACKUP_DIR/db-$DATE.sql.gz"
UPLOADS_FILE="$BACKUP_DIR/uploads-$DATE.tar.gz"

echo "[$DATE] DB yedeği: $DUMP_FILE"
pg_dump "$DATABASE_URL" --no-owner --no-acl | gzip -9 > "$DUMP_FILE"

if [ -d "./uploads" ]; then
  echo "[$DATE] Uploads yedeği: $UPLOADS_FILE"
  tar -czf "$UPLOADS_FILE" -C . uploads
fi

# 30 günden eski yedekleri sil
find "$BACKUP_DIR" -name 'db-*.sql.gz' -mtime +30 -delete
find "$BACKUP_DIR" -name 'uploads-*.tar.gz' -mtime +30 -delete

echo "[$DATE] Yedekleme tamamlandı."
