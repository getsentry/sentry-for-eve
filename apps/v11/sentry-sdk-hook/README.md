# v11/sentry-sdk-hook

`v11/sentry-sdk` plus two things written by hand:

1. `Sentry.vercelAIIntegration({ recordInputs: true, recordOutputs: true })` in `Sentry.init`. eve passes `recordInputs: false` and `recordOutputs: false` on every AI SDK call unless the channel audience is `public`, and `eve dev` and `eve invoke` report `unknown`. The SDK ranks that per-call flag above `dataCollection.genAI`, so the `dataCollection` option alone records nothing. The integration option ranks above both.
2. One eve hook file that sets the eve session id as the Sentry conversation id with `Sentry.setConversationId`. No Sentry-side eve helper is used.

```ts
// agent/hooks/sentry.ts
const setConversationId = (_event: unknown, ctx: { session: { id: string } }) =>
  Sentry.setConversationId(ctx.session.id);

export default defineHook({
  events: { "turn.started": setConversationId, "step.started": setConversationId },
});
```

## What Sentry received

Measured 2026-09-10 with eve 0.52.4. Two turns in one session: "What is the weather in Paris?" then "And in Berlin?". Columns from `scripts/traces.sh`.

| Command | Result |
| --- | --- |
| `eve dev` | Two traces, one per turn, 5 `gen_ai` spans each. Every span has `gen_ai.conversation.id` = `wrun_01M25YNKZ30PJFVX98NTEY99TN`, the eve session id. Every `invoke_agent` and `generate_content` span has request and response messages; the `execute_tool` span has tool input and output. [`c1e20d686c0d`](https://sentry-developer-experience.sentry.io/explore/traces/trace/c1e20d686c0d47f296b11ee71ff51aa6/?project=4512057016778752), [`e3e48e80fa12`](https://sentry-developer-experience.sentry.io/explore/traces/trace/e3e48e80fa1249c7abedb4f72590a4a1/?project=4512057016778752) |
| `eve start` | Same. Session `wrun_01M25YTZF1E3C96TJENNC6WVZY`. [`312284d51514`](https://sentry-developer-experience.sentry.io/explore/traces/trace/312284d515144a01a30e06eac7e1ee3a/?project=4512057016778752), [`a40c71e5e5bb`](https://sentry-developer-experience.sentry.io/explore/traces/trace/a40c71e5e5bb434cb7682c330950887f/?project=4512057016778752) |

Without the integration option, the same run has 0 inputs and 0 outputs on every span. Without the hook (`v11/sentry-sdk`) the two turns are two traces with no conversation id, and Sentry cannot tell they belong together.

Errors and environment come from `Sentry.init` as in `v11/sentry-sdk`. eve's own `ai.eve.turn` span is still absent. Its attributes (environment, session id, agent name) are all present another way, so nothing in the Agents view is missing.

The same hook is what [sentry-javascript#24247](https://github.com/getsentry/sentry-javascript/pull/24247) packages as `Sentry.eveConversationHook()`.
