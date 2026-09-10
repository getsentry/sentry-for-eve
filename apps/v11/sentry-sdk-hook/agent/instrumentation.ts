import * as Sentry from "@sentry/node";
import { defineInstrumentation } from "eve/instrumentation";

const ENVIRONMENT = "v11-sentry-sdk-hook";

export default defineInstrumentation({
  setup: () => {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: ENVIRONMENT,
      tracesSampleRate: 1.0,
      // eve passes recordInputs/recordOutputs: false on every AI SDK call
      // unless the channel audience is public. A per-call flag outranks
      // dataCollection.genAI, so only the integration option restores content.
      integrations: [Sentry.vercelAIIntegration({ recordInputs: true, recordOutputs: true })],
    });
  },
});
