# v11-eve-otlp-and-sentry-otel

eve's registry exporter and `Sentry.init` with `enableOpenTelemetrySetup: true`. Both register OpenTelemetry; Sentry wins.

## What Sentry received

Measured 2026-09-09 with eve 0.52.4. One turn: "What is the weather in Paris?"

| Command | Result |
| --- | --- |
| `eve dev` | One trace id, but the turn is in it twice: 5 `gen_ai` spans from Sentry's AI SDK integration and 6 `gen_ai` spans from the AI SDK's OpenTelemetry telemetry, plus every eve and workflow internal span. eve's OTLP exporter never receives a span. [`147d4b5a21bd`](https://sentry-developer-experience.sentry.io/explore/traces/trace/147d4b5a21bd4155860d92cfcbadc3e0/?project=4512057016778752) |
| `eve start` | Same. [`663df36b673d`](https://sentry-developer-experience.sentry.io/explore/traces/trace/663df36b673d49e6b114d72ae988ad1f/?project=4512057016778752) |

The user's exporter config is silently ignored.
