import { otel } from "eve/instrumentation/otel";

const ENVIRONMENT = "v11-eve-otlp-provider";

// eve records inputs and outputs only for a `public` channel audience. The
// eve invoke and eve dev channels report `unknown`, so the legacy
// recordInputs/recordOutputs flags never apply. A trace policy does.
export default otel({
  tracePolicy: () => ({ emit: true, recordInputs: true, recordOutputs: true }),
  resource: { "deployment.environment.name": ENVIRONMENT },
});
