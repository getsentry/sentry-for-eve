# v11/both-fixed-by-hand

eve's registry exporter and `Sentry.init` with the `VercelAI` integration removed and `openTelemetryIntegration()` added. This is the manual fix for the double.

## What Sentry received

Measured 2026-09-09 with eve 0.52.4. One turn: "What is the weather in Paris?"

| Command | Result |
| --- | --- |
| `eve dev` | One trace per turn, 7 `gen_ai` spans from eve over OTLP. [`e2db33460c03`](https://sentry-developer-experience.sentry.io/explore/traces/trace/e2db33460c03ac5101d083de5a20deaf/?project=4512057016778752) |
| `eve start` | Same. [`0332a80b465b`](https://sentry-developer-experience.sentry.io/explore/traces/trace/0332a80b465b8599b1b0ffe9e0085a2f/?project=4512057016778752) |
| `eve deploy` | Deployed to [https://sentry-for-eve-v11-both-fixed-by-ha.sentry.dev](https://sentry-for-eve-v11-both-fixed-by-ha.sentry.dev) on Vercel team `sentry`. Not invoked yet: Deployment Protection rejects `eve invoke` until a Protection Bypass for Automation secret exists. |

Sentry's own HTTP spans still arrive on separate trace ids, so an error caught by Sentry is not guaranteed to sit on eve's trace. The user has to know the integration name and the callback form of `integrations` to get here.
