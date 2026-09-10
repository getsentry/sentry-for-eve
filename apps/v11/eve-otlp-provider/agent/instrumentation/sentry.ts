import { OTLPHttpProtoTraceExporter } from "@vercel/otel";
import { otelIntegration } from "eve/instrumentation/otel";
import { conversationIdSpanProcessor } from "../lib/conversation-span-processor";

export default otelIntegration({
  // eve sets gen_ai.conversation.id on invoke_agent only. Sentry's Agent
  // Conversations view needs it on the chat and execute_tool spans too.
  spanProcessors: [conversationIdSpanProcessor()],
  traceExporter: new OTLPHttpProtoTraceExporter({
    url: process.env.SENTRY_OTLP_TRACES_ENDPOINT!,
    headers: { "x-sentry-auth": `sentry sentry_key=${process.env.SENTRY_PUBLIC_KEY}` },
  }),
});
