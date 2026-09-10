# v11/both-broken

eve's registry exporter and `Sentry.init` with defaults. This is what a user gets by following both quick starts.

## What Sentry received

Measured 2026-09-09 with eve 0.52.4. One turn: "What is the weather in Paris?"

| Command | Result |
| --- | --- |
| `eve dev` | Two traces for one turn. eve: 7 `gen_ai` spans [`311397d2b1ac`](https://sentry-developer-experience.sentry.io/explore/traces/trace/311397d2b1acf32bd09894a0b7b301ad/?project=4512057016778752). Sentry: 5 `gen_ai` spans [`d4f293134696`](https://sentry-developer-experience.sentry.io/explore/traces/trace/d4f29313469645e284646a6b6b830a79/?project=4512057016778752). |
| `eve start` | Same. eve [`d4e11ec8b26a`](https://sentry-developer-experience.sentry.io/explore/traces/trace/d4e11ec8b26a853f9c7991f5d87c1dec/?project=4512057016778752), Sentry [`e2c6be3262be`](https://sentry-developer-experience.sentry.io/explore/traces/trace/e2c6be3262be4a5eb0cffd49bf6afbd5/?project=4512057016778752). |
| `eve deploy` | Deployed to [https://sentry-for-eve-v11-both-broken.sentry.dev](https://sentry-for-eve-v11-both-broken.sentry.dev) on Vercel team `sentry`. Not invoked yet: Deployment Protection rejects `eve invoke` until a Protection Bypass for Automation secret exists. |

Both are correct. Sentry's AI SDK integration binds through Node's diagnostics channel on v11, so it records the same model calls eve records. The two traces do not share an id.

## Content and conversations

Measured 2026-09-10 with eve 0.52.4. Two turns in one session: "What is the weather in Paris?" then "And in Berlin?". Columns from `scripts/traces.sh`.

| Command | Conversation id | Inputs | Outputs | Traces |
| --- | --- | --- | --- | --- |
| `eve dev` | none | 0 | 0 | [`35ea1f1e4cde`](https://sentry-developer-experience.sentry.io/explore/traces/trace/35ea1f1e4cde4a669dae87555424e889/?project=4512057016778752) [`666c6b76621b`](https://sentry-developer-experience.sentry.io/explore/traces/trace/666c6b76621b435c8018c54d8a05e195/?project=4512057016778752) [`9ad8fc6413f0`](https://sentry-developer-experience.sentry.io/explore/traces/trace/9ad8fc6413f0d22b7bb7b1e5021380d4/?project=4512057016778752) [`9f93451f6045`](https://sentry-developer-experience.sentry.io/explore/traces/trace/9f93451f6045f481ecddfa26fe3856e5/?project=4512057016778752) |
| `eve start` | none | 0 | 0 | [`0492877a1059`](https://sentry-developer-experience.sentry.io/explore/traces/trace/0492877a10593e39b98dd15ab0380a33/?project=4512057016778752) [`563cdd4fe199`](https://sentry-developer-experience.sentry.io/explore/traces/trace/563cdd4fe1994fdea4e37f27885498f2/?project=4512057016778752) [`9dbfb640490f`](https://sentry-developer-experience.sentry.io/explore/traces/trace/9dbfb640490fba50fbedda5e447f43ed/?project=4512057016778752) [`a9e030bf3ffa`](https://sentry-developer-experience.sentry.io/explore/traces/trace/a9e030bf3ffa4393b1dec03b76cd1917/?project=4512057016778752) |

Every `gen_ai` span arrives, and none carries messages, tool input, tool output, or `gen_ai.conversation.id`. eve records content only for a `public` channel audience, and `eve invoke` is `unknown`; the `recordInputs` and `recordOutputs` flags do not change that. The fixes are the ones in `v11/sentry-sdk-hook` (SDK spans) and `v11/eve-otlp-provider` (eve spans).
