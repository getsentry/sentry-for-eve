# v10/sentry-sdk

`Sentry.init` with defaults. v10 registers OpenTelemetry itself. No eve exporter.

## What Sentry received

Measured 2026-09-09 with eve 0.52.4. One turn: "What is the weather in Paris?"

| Command | Result |
| --- | --- |
| `eve dev` | One trace, 5 `gen_ai` spans from Sentry's AI SDK integration. [`18b87bb8ac05`](https://sentry-developer-experience.sentry.io/explore/traces/trace/18b87bb8ac054656b89a9b2a5a22d7fe/?project=4512057016778752) |
| `eve start` | Same. [`0677ebe8ffb7`](https://sentry-developer-experience.sentry.io/explore/traces/trace/0677ebe8ffb74dcfb84e36e825656703/?project=4512057016778752) |
| `eve deploy` | Deployed to [https://sentry-for-eve-v10-sentry-sdk.sentry.dev](https://sentry-for-eve-v10-sentry-sdk.sentry.dev) on Vercel team `sentry`. Not invoked yet: Deployment Protection rejects `eve invoke` until a Protection Bypass for Automation secret exists. |

Nothing eve records leaves the process. No `agent.session`, no eve session id.
