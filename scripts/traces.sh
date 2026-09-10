#!/usr/bin/env bash
# Prints what Sentry received during one run: one line per trace and gen_ai op,
# with the data that matters, not just counts.
#
#   scripts/traces.sh v11/sentry-sdk dev
#
# Columns: trace, op, spans, conversation id, inputs recorded, outputs recorded,
# environment. "inputs" counts spans with gen_ai.request.messages or
# gen_ai.input.messages; "outputs" counts spans with gen_ai.response.text or
# gen_ai.output.messages.
set -euo pipefail
APP="${1:?usage: traces.sh <app> <dev|start>}"
MODE="${2:?usage: traces.sh <app> <dev|start>}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
META="$ROOT/apps/$APP/.eve/run/$MODE/meta.json"
ORG=sentry-developer-experience
PROJECT=4512057016778752

START="$(jq -r .start "$META")Z"
END="$(jq -r .end "$META")Z"
BASE="/api/0/organizations/$ORG/events/?dataset=spans&project=$PROJECT&start=$START&end=$END"

count() { # count <extra query>
  sentry api "$BASE&field=trace&field=span.op&field=gen_ai.conversation.id&field=environment&field=count()&query=span.op:gen_ai.*%20$1" \
    | jq -r '.data[] | "\(.trace) \(.["span.op"]) \(.["gen_ai.conversation.id"] // "" | if .=="" then "-" else . end) \(.environment // "-") \(.["count()"])"'
}

join -a1 -e0 -o '0,1.2,1.3,2.2,1.4' <(count "" | awk '{print $1"|"$2, $5, $3, $4}' | sort) \
  <(count "(has:gen_ai.request.messages%20OR%20has:gen_ai.input.messages)" | awk '{print $1"|"$2, $5}' | sort) \
  | join -a1 -e0 -o '0,1.2,1.3,1.4,2.2,1.5' - \
  <(count "(has:gen_ai.response.text%20OR%20has:gen_ai.output.messages)" | awk '{print $1"|"$2, $5}' | sort) \
  | awk 'BEGIN{printf "%-32s %-22s %5s %-32s %6s %7s %s\n","trace","op","spans","conversation","inputs","outputs","env"}
         {split($1,k,"|"); printf "%-32s %-22s %5s %-32s %6s %7s %s\n",k[1],k[2],$2,$3,$4,$5,$6}'
