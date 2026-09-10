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
