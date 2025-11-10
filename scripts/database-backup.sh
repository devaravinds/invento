#!/bin/bash

# === CONFIGURATION ===
MONGO_URI="db-url"
DB_NAME="invento"
BACKUP_DIR="/tmp/mongo_backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
ARCHIVE_NAME="${DB_NAME}_backup_${TIMESTAMP}.tar.gz"

# AWS S3 Config
AWS_ACCESS_KEY="key"
AWS_SECRET_KEY="secret"
S3_BUCKET="bucket"

# === STEP 1: Create backup directory ===
mkdir -p "$BACKUP_DIR"
cd "$BACKUP_DIR" || exit 1

# === STEP 2: Run mongodump inside Docker ===
echo "Dumping MongoDB database from container..."
sudo docker exec invento-db mongodump --uri="$MONGO_URI" --out="/dump/${DB_NAME}_${TIMESTAMP}"

# Copy the dump out of the container
sudo docker cp invento-db:/dump/${DB_NAME}_${TIMESTAMP} "${BACKUP_DIR}/"

if [ $? -ne 0 ]; then
    echo "❌ MongoDB dump failed!"
    exit 1
fi

# === STEP 3: Compress the dump ===
echo "Compressing backup..."
tar -czf "$ARCHIVE_NAME" "${DB_NAME}_${TIMESTAMP}"

# === STEP 4: Export AWS credentials ===
export AWS_ACCESS_KEY_ID="$AWS_ACCESS_KEY"
export AWS_SECRET_ACCESS_KEY="$AWS_SECRET_KEY"

# === STEP 5: Upload to S3 ===
echo "Uploading to S3..."
aws s3 cp "$ARCHIVE_NAME" "$S3_BUCKET"

if [ $? -eq 0 ]; then
    echo "✅ Backup uploaded successfully to ${S3_BUCKET}${ARCHIVE_NAME}"
else
    echo "❌ S3 upload failed!"
    exit 1
fi

# === STEP 6: Clean up ===
echo "Cleaning up..."
rm -rf "${DB_NAME}_${TIMESTAMP}" "$ARCHIVE_NAME"
sudo docker exec invento-db rm -rf "/dump"

echo "🎉 Backup process completed successfully!"
