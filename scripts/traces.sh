#!/usr/bin/env bash
# Prints the traces Sentry received during one run, one line per trace.
#
#   scripts/traces.sh v11-sentry-sdk dev
set -euo pipefail
APP="${1:?usage: traces.sh <app> <dev|start>}"
MODE="${2:?usage: traces.sh <app> <dev|start>}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
META="$ROOT/apps/$APP/.eve/run/$MODE/meta.json"
ORG=sentry-developer-experience
PROJECT=4512057016778752

START="$(jq -r .start "$META")Z"
END="$(jq -r .end "$META")Z"
sentry api "/api/0/organizations/$ORG/events/?dataset=spans&project=$PROJECT&start=$START&end=$END&field=trace&field=sentry.origin&field=environment&field=count()&query=span.op:gen_ai.*" \
  | jq -r '.data[] | "\(.trace)  \(.["sentry.origin"])  env=\(.environment // "none")  spans=\(.["count()"])"' \
  | sort
