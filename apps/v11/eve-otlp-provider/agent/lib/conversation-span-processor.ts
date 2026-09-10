import type { Span } from "@opentelemetry/api";
import type { SpanProcessor } from "eve/instrumentation/otel";

const CONVERSATION_ID = "gen_ai.conversation.id";
const SESSION_ID = "agent.session.id";
const OPERATION_NAME = "gen_ai.operation.name";
const SENTRY_OP = "sentry.op";
const REMEMBERED_TRACES = 1_000;

// eve's SpanProcessor type erases the span; at runtime it is an SDK span with attributes.
type StartedSpan = Span & { attributes?: Record<string, unknown> };

// eve stamps gen_ai.conversation.id only on its invoke_agent span. Sentry's
// Agent Conversations view reads the id from the chat and execute_tool spans
// that carry the messages, so copy the id onto every span of the trace.
//
// The id is keyed by trace, not by parent span: eve starts some parents after
// their children (execute_tool starts before its agent.action parent), but the
// agent.step span that carries agent.session.id starts first in every trace.
// One eve trace never spans two sessions.
//
// It also sets sentry.op from gen_ai.operation.name. Sentry's OTLP intake
// derives the op itself, but the SDK's span processor does not, and Sentry's
// AI Agents views select spans by op.
export function conversationIdSpanProcessor(): SpanProcessor {
  const byTraceId = new Map<string, string>();
  return {
    onStart(started: unknown) {
      const span = started as StartedSpan;
      const { traceId } = span.spanContext();
      const attributes = span.attributes ?? {};
      const operation = attributes[OPERATION_NAME];
      if (typeof operation === "string" && attributes[SENTRY_OP] === undefined) {
        span.setAttribute(SENTRY_OP, `gen_ai.${operation}`);
      }
      let id = attributes[CONVERSATION_ID] ?? attributes[SESSION_ID];
      if (typeof id !== "string") id = byTraceId.get(traceId);
      if (typeof id !== "string") return;
      if (!byTraceId.has(traceId)) {
        if (byTraceId.size >= REMEMBERED_TRACES) byTraceId.delete(byTraceId.keys().next().value!);
        byTraceId.set(traceId, id);
      }
      if (attributes[CONVERSATION_ID] === undefined) span.setAttribute(CONVERSATION_ID, id);
    },
    onEnd() {},
    forceFlush: () => Promise.resolve(),
    shutdown: () => Promise.resolve(),
  };
}
