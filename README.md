# sentry-for-eve

## The problem

eve records its agent turns. Sentry's AI integration records AI SDK calls.
Both are correct on their own. Put them in one process and every turn is
recorded twice, as two traces that never join. Today the user has to write
code to make the two agree.

## What we are after

The Sentry SDK v11 setup where an eve user adds Sentry and gets one correct
trace per turn, with as little extra code as possible. The shape is not
decided. Candidates:

- an `eveIntegration()` that knows it is inside eve and steps the AI
  integration aside, or dedupes
- Sentry hooking eve's runtime or telemetry, so eve's spans are the source
  of truth and Sentry adds errors, environment and release on top
- something on eve's side that Sentry plugs into

Each candidate is judged on how much the user has to type and how much they
have to understand.

## How we get there

1. Measure the baseline. One app per setup per SDK major. No switches, no
   shared code. Run each under `eve dev` and `eve start`, keep the trace
   link or the error.
2. Write down what a v11 user has to do by hand today. That is the cost to
   remove.
3. Prototype the candidates in the same layout, same measurement.
4. Pick the one with the least user-facing code that still gives a complete
   trace. Write up why it should be an integration and not a docs snippet.
5. Docs follow the pick.

## How we know we are done

A v11 eve user follows one short docs page and gets one trace per turn, with
errors and an environment on it, under `eve dev` and `eve start`. We can show
the trace.

## Layout

```
apps/<sdk-major>-<setup>/   one isolated eve app per row of the results
```

Every app has its own `package.json`, lockfile and `README.md`. The
`README.md` says what the setup is, what it produced, and links the trace.

## Baseline (step 1, measured 2026-09-09)

Seven apps under `apps/`, see [apps/README.md](apps/README.md). Every one starts
and answers under both `eve dev` and `eve start`; what differs is what Sentry
receives. Trace links are in each app's README.

For a v11 user today:

- `Sentry.init` alone is the shortest path and gives one correct trace.
  It loses everything eve knows: session id, steps, tool approvals.
- eve's exporter alone gives eve's trace and nothing from Sentry: no errors,
  no environment unless the user adds an attribute.
- Both together is the double. The fix by hand needs the integration name and
  the callback form of `integrations`, and still does not join Sentry's own
  spans to eve's trace.

## Content and conversations (measured 2026-09-10)

The baseline above counted spans by op and called every path "works". It
did not look at what the spans carry. A user reported that following the
docs gives no inputs, no outputs and no conversation ids, and that is true
for every setup above, on both `eve dev` and `eve start`. `scripts/traces.sh`
now reports content and conversation id per span, and every run sends two
turns into one session.

Root cause: eve records inputs and outputs only when the channel audience is
`public`. `eve dev` and `eve invoke` report `unknown`. eve then passes
`recordInputs: false` on every AI SDK call, which the Sentry SDK ranks above
`dataCollection.genAI`, and redacts its own OTel spans the same way. The
legacy `recordInputs`/`recordOutputs` flags never apply.

What restores it, one app per path:

- SDK path, `v11/sentry-sdk-hook`: `Sentry.vercelAIIntegration({ recordInputs:
  true, recordOutputs: true })` in `Sentry.init`, plus a hook that calls
  `Sentry.setConversationId(ctx.session.id)`. Every `gen_ai` span then has
  content and the session id; one trace per turn.
- OTLP path, `v11/eve-otlp-provider`: eve's experimental provider layout
  with `otel({ tracePolicy: () => ({ emit: true, recordInputs: true,
  recordOutputs: true }) })`, plus a span processor that copies eve's
  `gen_ai.conversation.id` from `invoke_agent` onto every span. One trace
  per session, no `agent_step` spans.

Step 2 writes down that fix by hand as a user sees it. Step 3 prototypes what
removes it: `Sentry.eveIntegration()`, a Sentry provider on eve's side, or an
eve runtime hook Sentry subscribes to. Each prototype is a new app here.
