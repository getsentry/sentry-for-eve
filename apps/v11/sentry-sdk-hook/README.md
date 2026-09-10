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

Measured 2026-09-10 with eve 0.52.4. One turn: "What is the weather in Paris?"

| Command | Result |
| --- | --- |
| `eve dev` | One trace, 5 `gen_ai` spans, every one with `gen_ai.conversation.id` equal to the eve session id `wrun_01M25TYVGBCMSPZKK3TMM06V8E`. [`24f380f0faf1`](https://sentry-developer-experience.sentry.io/explore/traces/trace/24f380f0faf14b65969435ac2b4a2143/?project=4512057016778752) |
| `eve start` | Same. Session `wrun_01M25TZG99ZPWZ0Z76CFGWPBG9`. [`081bf226bf51`](https://sentry-developer-experience.sentry.io/explore/traces/trace/081bf226bf5144f6bbb113d17bf36979/?project=4512057016778752) |

Errors and environment come from `Sentry.init` as in `v11/sentry-sdk`. eve's own `ai.eve.turn` span is still absent. Its attributes (environment, session id, agent name) are all present another way, so nothing in the Agents view is missing.

The same hook is what [sentry-javascript#24247](https://github.com/getsentry/sentry-javascript/pull/24247) packages as `Sentry.eveConversationHook()`.
