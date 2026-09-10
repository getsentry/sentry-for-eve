# Apps

Each app is one way to put Sentry on an eve agent, complete on its own: its
own `package.json`, lockfile, `.env.local`, and its instrumentation files.
The agent itself is identical in every app; only the instrumentation differs.
"Works" in the tables means every `gen_ai` span has inputs, outputs and a
conversation id, checked with `scripts/traces.sh`, not just that spans arrive.

## v11 (`@sentry/node` 11)

| App | What it is | Result |
| --- | --- | --- |
| `v11/sentry-sdk` | `Sentry.init`, nothing else. | One trace per turn, errors, environment. No inputs, no outputs, no conversation id. No eve session or step data. |
| `v11/sentry-sdk-hook` | `Sentry.init` with `vercelAIIntegration({ recordInputs, recordOutputs })` plus a hand-written `agent/hooks/sentry.ts` that sets the eve session id as the conversation id. | Works. One trace per turn with inputs, outputs and conversation id on every span; the session's turns group into one conversation. |
| `v11/eve-otlp` | What `eve add instrumentation/sentry` and both docs pages give you. | One trace per turn with eve's session and steps. No inputs, no outputs, no conversation id. No errors, no environment without an extra attribute. |
| `v11/eve-otlp-provider` | The same exporter in eve's experimental provider layout with a trace policy and a conversation-id span processor. | Works. One trace per session with inputs, outputs and conversation id on every span. No errors. |
| `v11/both-broken` | `v11/sentry-sdk` and `v11/eve-otlp` together, as a user following both quick starts would. | Two unjoined traces per turn, no content or conversation id on either. |
| `v11/both-fixed-by-hand` | The code a user must write today to make both agree. | One trace per turn, no content or conversation id. Needs the integration name and the callback form of `integrations`; Sentry's own spans still land on other trace ids. |

## v10 (`@sentry/node` 10)

| App | What it is | Result |
| --- | --- | --- |
| `v10/sentry-sdk` | `Sentry.init`, nothing else. | Same as v11: no inputs, outputs or conversation id. |
| `v10/eve-otlp` | What `eve add instrumentation/sentry` and both docs pages give you. | Same as v11: no inputs, outputs or conversation id. |
| `v10/both` | eve's exporter plus `Sentry.init` with `skipOpenTelemetrySetup: true`. | One eve trace, no content or conversation id. Without the flag Sentry takes over OpenTelemetry and eve's exporter is silently ignored. |

## Run one

```sh
cp apps/v11/sentry-sdk/.env.example apps/v11/sentry-sdk/.env.local   # fill in the keys
scripts/run.sh v11/sentry-sdk dev
scripts/run.sh v11/sentry-sdk start
scripts/traces.sh v11/sentry-sdk dev
```

Every run sends two turns into one session, so multi-turn behaviour is
measured every time. Results recorded before 2026-09-10 were single-turn.

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
