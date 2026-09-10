import * as Sentry from "@sentry/node";
import { defineInstrumentation } from "eve/instrumentation";

const ENVIRONMENT = "v10-sentry-sdk";

export default defineInstrumentation({
  setup: () => {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: ENVIRONMENT,
      tracesSampleRate: 1.0,
      dataCollection: { genAI: { inputs: true, outputs: true } },
    });
  },
});
