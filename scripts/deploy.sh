#!/usr/bin/env bash
# Creates the Vercel project for one app, uploads its .env.local as
# production variables, and deploys it with `eve deploy`.
#
#   scripts/deploy.sh v11/sentry-sdk
set -euo pipefail
APP="${1:?usage: deploy.sh <app>}"
TEAM="${TEAM:-sentry}"
PROJECT="sentry-for-eve-${APP//\//-}"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT/apps/$APP"

vercel project add "$PROJECT" --scope "$TEAM" >/dev/null 2>&1 || true
vercel link --yes --scope "$TEAM" --project "$PROJECT" >/dev/null

# Every key in .env.local becomes a production variable. Comments and blanks are skipped.
while IFS='=' read -r key value; do
  [[ -z "$key" || "$key" == \#* ]] && continue
  printf '%s' "$value" | vercel env add "$key" production --scope "$TEAM" --force >/dev/null 2>&1
done < .env.local

# `eve deploy` runs `vercel env pull`, which replaces .env.local with the
# development variables. Keep the local copy.
cp .env.local .env.local.bak
npx eve deploy --team "$TEAM" --project "$PROJECT" --non-interactive --yes
mv .env.local.bak .env.local
rm -f .gitignore
