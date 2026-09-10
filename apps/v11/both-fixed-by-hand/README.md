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

## Content and conversations

Measured 2026-09-10 with eve 0.52.4. Two turns in one session: "What is the weather in Paris?" then "And in Berlin?". Columns from `scripts/traces.sh`.

| Command | Conversation id | Inputs | Outputs | Traces |
| --- | --- | --- | --- | --- |
| `eve dev` | none | 0 | 0 | [`9da973a78d34`](https://sentry-developer-experience.sentry.io/explore/traces/trace/9da973a78d3457de75acc6caeecb1a2c/?project=4512057016778752) [`ac760e3e2be8`](https://sentry-developer-experience.sentry.io/explore/traces/trace/ac760e3e2be8683dd9c176bcc4913c6d/?project=4512057016778752) |
| `eve start` | none | 0 | 0 | [`99f3c9b4635c`](https://sentry-developer-experience.sentry.io/explore/traces/trace/99f3c9b4635ce3b089e8b2e667d48b1a/?project=4512057016778752) [`d641d58d34e2`](https://sentry-developer-experience.sentry.io/explore/traces/trace/d641d58d34e28e6f04df97cc10616c40/?project=4512057016778752) |

Every `gen_ai` span arrives, and none carries messages, tool input, tool output, or `gen_ai.conversation.id`. eve records content only for a `public` channel audience, and `eve invoke` is `unknown`; the `recordInputs` and `recordOutputs` flags do not change that. The fixes are the ones in `v11/sentry-sdk-hook` (SDK spans) and `v11/eve-otlp-provider` (eve spans).
