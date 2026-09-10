#!/usr/bin/env bash
# Runs one agent turn against a throwaway eve server and exits.
#
#   scripts/run.sh v11-sentry-sdk dev
#   scripts/run.sh v11-sentry-sdk start
set -euo pipefail
APP="${1:?usage: run.sh <app> <dev|start>}"
MODE="${2:?usage: run.sh <app> <dev|start>}"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT/apps/$APP"
PORT="${PORT:-3141}"
URL="http://localhost:$PORT"
OUT=".eve/run/$MODE"
mkdir -p "$OUT"

[ -d node_modules ] || npm ci --no-audit --no-fund >"$OUT/install.log" 2>&1
if [ -f .env.local ]; then set -a; . ./.env.local; set +a; fi
export EVE_TELEMETRY_DISABLED=1
# eve's localDev() authenticator only applies when EVE_DEV=1, and `eve start`
# does not set it. Without it `eve invoke` gets authentication-required.
export EVE_DEV=1

if [ "$MODE" = start ]; then
  npx eve build >"$OUT/build.log" 2>&1 || { echo "BUILD FAILED"; tail -30 "$OUT/build.log"; exit 1; }
  npx eve start --port "$PORT" >"$OUT/server.log" 2>&1 &
else
  npx eve dev --no-ui --port "$PORT" >"$OUT/server.log" 2>&1 &
fi
SERVER=$!
trap 'kill $SERVER 2>/dev/null; wait $SERVER 2>/dev/null || true' EXIT

STARTED="$(date -u +%Y-%m-%dT%H:%M:%S)"
for _ in $(seq 1 90); do
  curl -fsS "$URL" >/dev/null 2>&1 && break
  if ! kill -0 $SERVER 2>/dev/null; then echo "SERVER DIED"; tail -30 "$OUT/server.log"; exit 1; fi
  sleep 1
done

npx eve invoke -u "$URL" "What is the weather in Paris?" | tee "$OUT/turn.json"
echo
# Give the exporters time to flush before the server goes away.
sleep "${FLUSH_SECONDS:-10}"
# scripts/traces.sh uses this window to find the run's traces in Sentry.
printf '{"app":"%s","mode":"%s","start":"%s","end":"%s"}\n' \
  "$APP" "$MODE" "$STARTED" "$(date -u +%Y-%m-%dT%H:%M:%S)" > "$OUT/meta.json"
echo "--- server log tail ---"
tail -20 "$OUT/server.log"
