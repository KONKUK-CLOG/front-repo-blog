#!/usr/bin/env bash
# 사용: ./scripts/deploy-s3.sh my-bucket-name [cloudfront-distribution-id]
set -euo pipefail

BUCKET="${1:?Usage: $0 <s3-bucket> [cloudfront-id]}"
CF_ID="${2:-}"

pnpm build

aws s3 sync dist/assets/ "s3://${BUCKET}/assets/" --delete \
  --cache-control "public, max-age=31536000, immutable"

aws s3 cp dist/index.html "s3://${BUCKET}/index.html" \
  --cache-control "public, max-age=0, must-revalidate" \
  --content-type "text/html"

if [[ -f dist/favicon.ico ]]; then
  aws s3 cp dist/favicon.ico "s3://${BUCKET}/favicon.ico" \
    --cache-control "public, max-age=86400"
fi

echo "Uploaded to s3://${BUCKET}/"

if [[ -n "${CF_ID}" ]]; then
  aws cloudfront create-invalidation --distribution-id "${CF_ID}" --paths "/*"
fi
