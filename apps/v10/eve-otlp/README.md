# v10/eve-otlp

eve's registry Sentry exporter (`eve add instrumentation/sentry`) plus a `deployment.environment.name` attribute so Sentry sets the environment. No Sentry SDK.

## What Sentry received

Measured 2026-09-09 with eve 0.52.4. One turn: "What is the weather in Paris?"

| Command | Result |
| --- | --- |
| `eve dev` | One trace per turn, 7 `gen_ai` spans from eve. [`2c7187f99302`](https://sentry-developer-experience.sentry.io/explore/traces/trace/2c7187f9930215304479c3f64eed7733/?project=4512057016778752) |
| `eve start` | Same. [`f0c4c336a266`](https://sentry-developer-experience.sentry.io/explore/traces/trace/f0c4c336a266f7c053227203bcba029b/?project=4512057016778752) |

Without the attribute the environment is empty. No errors, no release.
