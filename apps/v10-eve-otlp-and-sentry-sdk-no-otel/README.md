# v10-eve-otlp-and-sentry-sdk-no-otel

eve's registry exporter and `Sentry.init` with `skipOpenTelemetrySetup: true`. eve owns OpenTelemetry.

## What Sentry received

Measured 2026-09-09 with eve 0.52.4. One turn: "What is the weather in Paris?"

| Command | Result |
| --- | --- |
| `eve dev` | One trace per turn, 7 `gen_ai` spans from eve over OTLP. Nothing from Sentry's AI SDK integration. [`66347a204272`](https://sentry-developer-experience.sentry.io/explore/traces/trace/66347a2042722604d80d93f8f10be2d6/?project=4512057016778752) |
| `eve start` | Same. [`ec00ad35a77f`](https://sentry-developer-experience.sentry.io/explore/traces/trace/ec00ad35a77f599ee4c3475f32fb88e2/?project=4512057016778752) |

On v10 the AI SDK integration only binds to Sentry's own context manager, so it stays silent here. Errors go to Sentry but are not on eve's trace.
