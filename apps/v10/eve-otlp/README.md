# v10/eve-otlp

eve's registry Sentry exporter (`eve add instrumentation/sentry`) plus a `deployment.environment.name` attribute so Sentry sets the environment. No Sentry SDK.

## What Sentry received

Measured 2026-09-09 with eve 0.52.4. One turn: "What is the weather in Paris?"

| Command | Result |
| --- | --- |
| `eve dev` | One trace per turn, 7 `gen_ai` spans from eve. [`2c7187f99302`](https://sentry-developer-experience.sentry.io/explore/traces/trace/2c7187f9930215304479c3f64eed7733/?project=4512057016778752) |
| `eve start` | Same. [`f0c4c336a266`](https://sentry-developer-experience.sentry.io/explore/traces/trace/f0c4c336a266f7c053227203bcba029b/?project=4512057016778752) |
| `eve deploy` | Deployed to [https://sentry-for-eve-v10-eve-otlp.sentry.dev](https://sentry-for-eve-v10-eve-otlp.sentry.dev) on Vercel team `sentry`. Not invoked yet: Deployment Protection rejects `eve invoke` until a Protection Bypass for Automation secret exists. |

Without the attribute the environment is empty. No errors, no release.

## Content and conversations

Measured 2026-09-10 with eve 0.52.4. Two turns in one session: "What is the weather in Paris?" then "And in Berlin?". Columns from `scripts/traces.sh`.

| Command | Conversation id | Inputs | Outputs | Traces |
| --- | --- | --- | --- | --- |
| `eve dev` | none | 0 | 0 | [`2d5d274a22f7`](https://sentry-developer-experience.sentry.io/explore/traces/trace/2d5d274a22f7ffd14bd44a8802fe9cd7/?project=4512057016778752) [`95c7566ef2f9`](https://sentry-developer-experience.sentry.io/explore/traces/trace/95c7566ef2f90a1b7bab3e395e7f1dae/?project=4512057016778752) |
| `eve start` | none | 0 | 0 | [`568b21dd61ef`](https://sentry-developer-experience.sentry.io/explore/traces/trace/568b21dd61ef3826fcca8997d9bda689/?project=4512057016778752) |

Every `gen_ai` span arrives, and none carries messages, tool input, tool output, or `gen_ai.conversation.id`. eve records content only for a `public` channel audience, and `eve invoke` is `unknown`; the `recordInputs` and `recordOutputs` flags do not change that. The provider layout with a trace policy restores content and a span processor restores the conversation id, see `v11/eve-otlp-provider`.
