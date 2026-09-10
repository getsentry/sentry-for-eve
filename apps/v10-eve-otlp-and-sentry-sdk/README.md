# v10-eve-otlp-and-sentry-sdk

eve's registry exporter and `Sentry.init` with defaults. Both register OpenTelemetry. The first write wins, and `Sentry.init` runs first.

## What Sentry received

Measured 2026-09-09 with eve 0.52.4. One turn: "What is the weather in Paris?"

| Command | Result |
| --- | --- |
| `eve dev` | Sentry owns OpenTelemetry. One trace, 5 `gen_ai` spans from Sentry's AI SDK integration plus every eve and workflow internal span, all with op `default`. eve's OTLP exporter never receives a span. [`b02ebb0fa196`](https://sentry-developer-experience.sentry.io/explore/traces/trace/b02ebb0fa196468ab864978488e7f6b2/?project=4512057016778752) |
| `eve start` | Same. [`02f6c0f1d034`](https://sentry-developer-experience.sentry.io/explore/traces/trace/02f6c0f1d03440bc9225ecbc9b8466f1/?project=4512057016778752) |

The user's exporter config is silently ignored.
