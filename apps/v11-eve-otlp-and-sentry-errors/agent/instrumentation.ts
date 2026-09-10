import * as Sentry from "@sentry/node";
import { OTLPHttpProtoTraceExporter, registerOTel } from "@vercel/otel";
import { defineInstrumentation } from "eve/instrumentation";

const ENVIRONMENT = "v11-eve-otlp-and-sentry-errors";

export default defineInstrumentation({
  recordInputs: true,
  recordOutputs: true,
  setup: ({ agentName }) => {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: ENVIRONMENT,
      tracesSampleRate: 1.0,
      integrations: (defaults) => [
        // eve already emits the gen_ai spans this integration would record again.
        ...defaults.filter((i) => i.name !== "VercelAI"),
        // Puts errors on the active eve span so they share its trace.
        Sentry.openTelemetryIntegration(),
      ],
    });
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
