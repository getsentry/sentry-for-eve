# v11/sentry-sdk-hook

`v11/sentry-sdk` plus one eve hook file. The hook sets the eve session id as the Sentry conversation id, written by hand with `Sentry.setConversationId`. No Sentry-side eve helper is used.

```ts
// agent/hooks/sentry.ts
const setConversationId = (_event: unknown, ctx: { session: { id: string } }) =>
  Sentry.setConversationId(ctx.session.id);

export default defineHook({
  events: { "turn.started": setConversationId, "step.started": setConversationId },
});
```

## What Sentry received

Measured 2026-09-10 with eve 0.52.4. Two turns in one session: "What is the weather in Paris?" then "And in Berlin?"

| Command | Result |
| --- | --- |
| `eve dev` | Two traces, one per turn, 5 `gen_ai` spans each. Every span carries `gen_ai.conversation.id` = `wrun_01M25XBZYBCSMXKE0A48VATS7J`, the eve session id, so both turns group into one conversation. Turn 1 [`d69a7f888571`](https://sentry-developer-experience.sentry.io/explore/traces/trace/d69a7f8885714ed48847811e2558c010/?project=4512057016778752), turn 2 [`fca7c517588c`](https://sentry-developer-experience.sentry.io/explore/traces/trace/fca7c517588c4bd8a1bcb320881ae607/?project=4512057016778752) |
| `eve start` | Same. Session `wrun_01M25XCSH5NY8WPCP73RS7J4DW`. Turn 1 [`44ff04f16742`](https://sentry-developer-experience.sentry.io/explore/traces/trace/44ff04f16742488a85213a6398ceb88a/?project=4512057016778752), turn 2 [`f30c55574898`](https://sentry-developer-experience.sentry.io/explore/traces/trace/f30c55574898454d9e15986e4bdd9000/?project=4512057016778752) |

Without the hook (`v11/sentry-sdk`) the same two turns are two traces with no conversation id, and Sentry cannot tell they belong together.

Errors and environment come from `Sentry.init` as in `v11/sentry-sdk`. eve's own `ai.eve.turn` span is still absent. Its attributes (environment, session id, agent name) are all present another way, so nothing in the Agents view is missing.

The same hook is what [sentry-javascript#24247](https://github.com/getsentry/sentry-javascript/pull/24247) packages as `Sentry.eveConversationHook()`.
