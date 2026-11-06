#!/usr/bin/env bash
# Publica dist/ no S3 e invalida o cache do CloudFront.
# Ordem: arquivos novos -> remoção dos antigos -> invalidação, para nenhum
# visitante pegar uma página que aponta para um arquivo que já foi apagado.
set -euo pipefail

: "${SITE_BUCKET:?}" "${SITE_DISTRIBUTION_ID:?}"

aws s3 sync dist "s3://${SITE_BUCKET}" --only-show-errors
aws s3 sync dist "s3://${SITE_BUCKET}" --delete --only-show-errors
aws cloudfront create-invalidation --distribution-id "$SITE_DISTRIBUTION_ID" --paths '/*' > /dev/null
echo "Publicado: $(git rev-parse --short HEAD)"
