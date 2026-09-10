#!/usr/bin/env bash
# Runs every app under both eve commands, one run at a time.
set -uo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."
for app in v11/sentry-sdk v11/eve-otlp v11/both-broken v11/both-fixed-by-hand v10/sentry-sdk v10/eve-otlp v10/both; do
  for mode in dev start; do
    mkdir -p "apps/$app/.eve/run/$mode"
    log="apps/$app/.eve/run/$mode/run.log"
    if scripts/run.sh "$app" "$mode" >"$log" 2>&1; then
      echo "$app $mode OK"
    else
      echo "$app $mode FAIL: $(grep -m1 -E 'SERVER DIED|BUILD FAILED' "$log" || echo "see $log")"
    fi
  done
done
