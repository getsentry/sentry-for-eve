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

Six apps under `apps/`, see [apps/README.md](apps/README.md). Every one starts
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

Step 2 writes down that fix by hand as a user sees it. Step 3 prototypes what
removes it: `Sentry.eveIntegration()`, a Sentry provider on eve's side, or an
eve runtime hook Sentry subscribes to. Each prototype is a new app here.
