#!/usr/bin/env bash
# Installs every app's dependencies, one app at a time.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/../apps"
for app in */; do
  app="${app%/}"
  if [ "$app" = v10-eve-spans-through-sentry-sdk ]; then
    (cd "$app" && npm install --no-audit --no-fund >/dev/null 2>&1) && echo "$app installed" || echo "$app FAILED"
  else
    (cd "$app" && npm ci --no-audit --no-fund >/dev/null 2>&1) && echo "$app installed" || echo "$app FAILED"
  fi
done
