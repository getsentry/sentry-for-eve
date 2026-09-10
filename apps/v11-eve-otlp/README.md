# v11-eve-otlp

eve's registry Sentry exporter plus a `deployment.environment.name` attribute. No Sentry SDK.

## What Sentry received

Measured 2026-09-09 with eve 0.52.4. One turn: "What is the weather in Paris?"

| Command | Result |
| --- | --- |
| `eve dev` | One trace per turn, 7 `gen_ai` spans from eve. [`3a87fda6552f`](https://sentry-developer-experience.sentry.io/explore/traces/trace/3a87fda6552fbdefdb8e09684f2ddf83/?project=4512057016778752) |
| `eve start` | Same. [`fe11490ddd2b`](https://sentry-developer-experience.sentry.io/explore/traces/trace/fe11490ddd2bceb0db4639f031d9c06f/?project=4512057016778752) |

Without the attribute the environment is empty. No errors, no release.
