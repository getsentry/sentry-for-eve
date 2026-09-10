# v11/eve-otlp

eve's registry Sentry exporter plus a `deployment.environment.name` attribute. No Sentry SDK.

## What Sentry received

Measured 2026-09-09 with eve 0.52.4. One turn: "What is the weather in Paris?"

| Command | Result |
| --- | --- |
| `eve dev` | One trace per turn, 7 `gen_ai` spans from eve. [`3a87fda6552f`](https://sentry-developer-experience.sentry.io/explore/traces/trace/3a87fda6552fbdefdb8e09684f2ddf83/?project=4512057016778752) |
| `eve start` | Same. [`fe11490ddd2b`](https://sentry-developer-experience.sentry.io/explore/traces/trace/fe11490ddd2bceb0db4639f031d9c06f/?project=4512057016778752) |
| `eve deploy` | Deployed to [https://sentry-for-eve-v11-eve-otlp.sentry.dev](https://sentry-for-eve-v11-eve-otlp.sentry.dev) on Vercel team `sentry`. Not invoked yet: Deployment Protection rejects `eve invoke` until a Protection Bypass for Automation secret exists. |

Without the attribute the environment is empty. No errors, no release.

## Content and conversations

Measured 2026-09-10 with eve 0.52.4. Two turns in one session: "What is the weather in Paris?" then "And in Berlin?". Columns from `scripts/traces.sh`.

| Command | Conversation id | Inputs | Outputs | Traces |
| --- | --- | --- | --- | --- |
| `eve dev` | none | 0 | 0 | [`0321bc2af565`](https://sentry-developer-experience.sentry.io/explore/traces/trace/0321bc2af56575045aab795982722a5b/?project=4512057016778752) [`55f9ffa72fae`](https://sentry-developer-experience.sentry.io/explore/traces/trace/55f9ffa72fae8e8e34752c9c89e24724/?project=4512057016778752) |
| `eve start` | none | 0 | 0 | [`3d5738fdfdcf`](https://sentry-developer-experience.sentry.io/explore/traces/trace/3d5738fdfdcf474594db26a86669dc1e/?project=4512057016778752) [`a346c4e41126`](https://sentry-developer-experience.sentry.io/explore/traces/trace/a346c4e411260e5e6a108db0ee5e5d2a/?project=4512057016778752) |

Every `gen_ai` span arrives, and none carries messages, tool input, tool output, or `gen_ai.conversation.id`. eve records content only for a `public` channel audience, and `eve invoke` is `unknown`; the `recordInputs` and `recordOutputs` flags do not change that. The provider layout with a trace policy restores content and a span processor restores the conversation id, see `v11/eve-otlp-provider`.
