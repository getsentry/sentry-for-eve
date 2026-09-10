import { OTLPHttpProtoTraceExporter, registerOTel } from "@vercel/otel";
import { defineInstrumentation } from "eve/instrumentation";

const ENVIRONMENT = "v10-eve-otlp";

export default defineInstrumentation({
  recordInputs: true,
  recordOutputs: true,
  setup: ({ agentName }) => {
    registerOTel({
      serviceName: agentName,
      attributes: { "deployment.environment.name": ENVIRONMENT },
      traceExporter: new OTLPHttpProtoTraceExporter({
        url: process.env.SENTRY_OTLP_TRACES_ENDPOINT!,
        headers: { "x-sentry-auth": `sentry sentry_key=${process.env.SENTRY_PUBLIC_KEY}` },
      }),
    });
  },
});
