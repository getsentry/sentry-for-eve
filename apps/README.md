# Apps

Each app is one way to put Sentry on an eve agent, complete on its own: its
own `package.json`, lockfile, `.env.local`, and one `agent/instrumentation.ts`.
The agent itself is identical in every app; only `agent/instrumentation.ts`
differs.

## v11 (`@sentry/node` 11)

| App | What it is | Result |
| --- | --- | --- |
| `v11/sentry-sdk` | `Sentry.init`, nothing else. | Works. One trace, errors, environment. No eve session or step data. |
| `v11/eve-otlp` | What `eve add instrumentation/sentry` and both docs pages give you. | Works. One trace with eve's session and steps. No errors, no environment without an extra attribute. |
| `v11/both-broken` | The two above together, as a user following both quick starts would. | Two unjoined traces per turn. |
| `v11/both-fixed-by-hand` | The code a user must write today to make both agree. | One trace. Needs the integration name and the callback form of `integrations`; Sentry's own spans still land on other trace ids. |

## v10 (`@sentry/node` 10)

| App | What it is | Result |
| --- | --- | --- |
| `v10/sentry-sdk` | `Sentry.init`, nothing else. | Works. Same as v11. |
| `v10/eve-otlp` | What `eve add instrumentation/sentry` and both docs pages give you. | Works. Same as v11. |
| `v10/both` | eve's exporter plus `Sentry.init` with `skipOpenTelemetrySetup: true`. | One eve trace. Without the flag Sentry takes over OpenTelemetry and eve's exporter is silently ignored. |

## Run one

```sh
cp apps/v11/sentry-sdk/.env.example apps/v11/sentry-sdk/.env.local   # fill in the keys
scripts/run.sh v11/sentry-sdk dev
scripts/run.sh v11/sentry-sdk start
scripts/traces.sh v11/sentry-sdk dev
```

`scripts/matrix.sh` runs every app under both commands, one at a time. They
all report into the same Sentry project and `scripts/traces.sh` finds a run's
traces by its time window.

## Deploy one

```sh
scripts/deploy.sh v11/sentry-sdk
```

This creates the Vercel project `sentry-for-eve-v11-sentry-sdk` on team
`sentry`, uploads `.env.local` as production variables, and runs `eve deploy`.
The team protects every deployment, so `eve invoke -u <url>` needs
`VERCEL_AUTOMATION_BYPASS_SECRET` set to a Protection Bypass for Automation
secret from the project's Deployment Protection settings.
