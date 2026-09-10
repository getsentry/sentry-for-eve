# v11/sentry-sdk

`Sentry.init` with defaults. v11 does not register OpenTelemetry. No eve exporter. This is the least code a user can write.

## What Sentry received

Measured 2026-09-09 with eve 0.52.4. One turn: "What is the weather in Paris?"

| Command | Result |
| --- | --- |
| `eve dev` | One trace, 5 `gen_ai` spans from Sentry's AI SDK integration. [`ee80e399d258`](https://sentry-developer-experience.sentry.io/explore/traces/trace/ee80e399d258465e9e55128ec7588e0c/?project=4512057016778752) |
| `eve start` | Same. [`d59807be9115`](https://sentry-developer-experience.sentry.io/explore/traces/trace/d59807be91154aeab60071ad55a9d890/?project=4512057016778752) |
| `eve deploy` | Deployed to [https://sentry-for-eve-v11-sentry-sdk.sentry.dev](https://sentry-for-eve-v11-sentry-sdk.sentry.dev) on Vercel team `sentry`. Not invoked yet: Deployment Protection rejects `eve invoke` until a Protection Bypass for Automation secret exists. |

Errors and environment work. Nothing eve records leaves the process: no `agent.session`, no eve session id, no `agent_step`.
