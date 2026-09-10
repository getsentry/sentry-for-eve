# Apps

One app per setup per SDK major. Each app is complete on its own: its own
`package.json`, lockfile, `.env.local`, and one `agent/instrumentation.ts`.
The agent, tool, channel and instructions are byte-identical in every app.
The only file that differs is `agent/instrumentation.ts`.

| App | What the user writes |
| --- | --- |
| `v10-sentry-sdk` | `Sentry.init` with defaults. v10 registers OpenTelemetry itself. |
| `v10-eve-otlp` | eve's registry Sentry exporter (`eve add instrumentation/sentry`) plus an environment attribute. |
| `v10-eve-otlp-and-sentry-sdk` | Both of the above, each with its defaults. |
| `v10-eve-otlp-and-sentry-sdk-no-otel` | Both, with `skipOpenTelemetrySetup: true`. |
| `v10-eve-spans-through-sentry-sdk` | eve registers OpenTelemetry; Sentry's span processor, sampler and propagator run inside it. `VercelAI` removed. |
| `v11-sentry-sdk` | `Sentry.init` with defaults. v11 does not register OpenTelemetry. |
| `v11-eve-otlp` | eve's registry Sentry exporter plus an environment attribute. |
| `v11-eve-otlp-and-sentry-sdk` | Both, each with its defaults. |
| `v11-eve-otlp-and-sentry-errors` | Both. `VercelAI` removed, `openTelemetryIntegration()` added so errors land on eve's spans. |
| `v11-eve-otlp-and-sentry-otel` | Both, with `enableOpenTelemetrySetup: true`. |

Run one:

```sh
cp apps/<app>/.env.example apps/<app>/.env.local   # fill in the keys
scripts/run.sh <app> dev
scripts/run.sh <app> start
scripts/traces.sh <app> dev
```

Run the apps one at a time. They all report into the same Sentry project and
`scripts/traces.sh` finds a run's traces by its time window.
