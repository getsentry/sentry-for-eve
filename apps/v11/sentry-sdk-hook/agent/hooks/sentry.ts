import * as Sentry from "@sentry/node";
import { defineHook } from "eve/hooks";

// Each eve turn is its own request, so its gen_ai spans land in their own
// trace. Setting the eve session id as the Sentry conversation id on the
// isolation scope makes the SDK stamp gen_ai.conversation.id on every gen_ai
// span, and Sentry groups the session's turns into one conversation.
//
// step.started is needed as well as turn.started: a turn that parks and
// resumes (approvals, compaction) continues in a new request where
// turn.started does not fire again.
const setConversationId = (_event: unknown, ctx: { session: { id: string } }) =>
  Sentry.setConversationId(ctx.session.id);

export default defineHook({
  events: {
    "turn.started": setConversationId,
    "step.started": setConversationId,
  },
});
