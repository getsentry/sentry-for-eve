# v10-eve-spans-through-sentry-sdk

`skipOpenTelemetrySetup: true`, `VercelAI` removed, and eve's `registerOTel` given Sentry's span processor, sampler and propagator. Every span eve emits goes through the Sentry SDK.

## What Sentry received

Measured 2026-09-09 with eve 0.52.4. One turn: "What is the weather in Paris?"

| Command | Result |
| --- | --- |
| `eve dev` | Spans arrive, but no `gen_ai` ops: `chat`, `invoke_agent`, `execute_tool` all land with op `default`. Split across 8 traces, one per HTTP request. [`8000bad47a5d`](https://sentry-developer-experience.sentry.io/explore/traces/trace/8000bad47a5d81e5f581e61f88e3a00e/?project=4512057016778752) |
| `eve start` | Same shape, op `default` on every agent span. [`592834c1e114`](https://sentry-developer-experience.sentry.io/explore/traces/trace/592834c1e114c7afefa9a0af5c79aea5/?project=4512057016778752) |

Sentry's `gen_ai` mapping lives in the `VercelAI` integration that this setup removes, so the AI Agents view shows nothing. Not usable as is, and v11 removed these three classes.
