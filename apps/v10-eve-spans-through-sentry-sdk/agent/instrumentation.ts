import * as Sentry from "@sentry/node";
import { SentryPropagator, SentrySampler, SentrySpanProcessor } from "@sentry/opentelemetry";
import { registerOTel } from "@vercel/otel";
import { defineInstrumentation } from "eve/instrumentation";

const ENVIRONMENT = "v10-eve-spans-through-sentry-sdk";

export default defineInstrumentation({
  recordInputs: true,
  recordOutputs: true,
  setup: ({ agentName }) => {
    const client = Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: ENVIRONMENT,
      tracesSampleRate: 1.0,
      dataCollection: { genAI: { inputs: true, outputs: true } },
      skipOpenTelemetrySetup: true,
      // eve already emits the gen_ai spans this integration would record again.
      integrations: (defaults) => defaults.filter((i) => i.name !== "VercelAI"),
    })!;
    registerOTel({
      serviceName: agentName,
      spanProcessors: [new SentrySpanProcessor()],
      traceSampler: new SentrySampler(client),
      propagators: [new SentryPropagator()],
    });
  },
});
