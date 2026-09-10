# v10/both

eve's registry exporter and `Sentry.init` with `skipOpenTelemetrySetup: true`. eve owns OpenTelemetry.

## What Sentry received

Measured 2026-09-09 with eve 0.52.4. One turn: "What is the weather in Paris?"

| Command | Result |
| --- | --- |
| `eve dev` | One trace per turn, 7 `gen_ai` spans from eve over OTLP. Nothing from Sentry's AI SDK integration. [`66347a204272`](https://sentry-developer-experience.sentry.io/explore/traces/trace/66347a2042722604d80d93f8f10be2d6/?project=4512057016778752) |
| `eve start` | Same. [`ec00ad35a77f`](https://sentry-developer-experience.sentry.io/explore/traces/trace/ec00ad35a77f599ee4c3475f32fb88e2/?project=4512057016778752) |
| `eve deploy` | Deployed to [https://sentry-for-eve-v10-both.sentry.dev](https://sentry-for-eve-v10-both.sentry.dev) on Vercel team `sentry`. Not invoked yet: Deployment Protection rejects `eve invoke` until a Protection Bypass for Automation secret exists. |

On v10 the AI SDK integration only binds to Sentry's own context manager, so it stays silent here. Errors go to Sentry but are not on eve's trace.

## Content and conversations

Measured 2026-09-10 with eve 0.52.4. Two turns in one session: "What is the weather in Paris?" then "And in Berlin?". Columns from `scripts/traces.sh`.

| Command | Conversation id | Inputs | Outputs | Traces |
| --- | --- | --- | --- | --- |
| `eve dev` | none | 0 | 0 | [`3aceda2437c5`](https://sentry-developer-experience.sentry.io/explore/traces/trace/3aceda2437c5967b78c950ebe913514c/?project=4512057016778752) |
| `eve start` | none | 0 | 0 | [`7e69d55492c9`](https://sentry-developer-experience.sentry.io/explore/traces/trace/7e69d55492c960e3e5af59f633453288/?project=4512057016778752) [`fb479e953dfe`](https://sentry-developer-experience.sentry.io/explore/traces/trace/fb479e953dfefeab50e2112ca252ab9e/?project=4512057016778752) |

Every `gen_ai` span arrives, and none carries messages, tool input, tool output, or `gen_ai.conversation.id`. eve records content only for a `public` channel audience, and `eve invoke` is `unknown`; the `recordInputs` and `recordOutputs` flags do not change that. The provider layout with a trace policy restores content and a span processor restores the conversation id, see `v11/eve-otlp-provider`.
