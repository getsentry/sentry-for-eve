# v11/eve-otlp-provider

`v11/eve-otlp` moved to eve's experimental provider layout. No Sentry SDK.

eve records inputs and outputs only when the channel audience is `public`. `eve dev` and `eve invoke` report `unknown`, so the legacy `recordInputs` and `recordOutputs` flags in `agent/instrumentation.ts` never apply. A trace policy overrides the audience, and only the provider layout accepts one:

```ts
// agent/agent.ts
experimental: { instrumentationProviders: true },

// agent/instrumentation/tracing.ts
export default otel({
  tracePolicy: () => ({ emit: true, recordInputs: true, recordOutputs: true }),
  resource: { "deployment.environment.name": ENVIRONMENT },
});

// agent/instrumentation/sentry.ts
export default otelIntegration({
  spanProcessors: [conversationIdSpanProcessor()],
  traceExporter: new OTLPHttpProtoTraceExporter({ url, headers }),
});
```

eve sets `gen_ai.conversation.id` on the `invoke_agent` span only. Sentry's Agent Conversations view reads it from the `chat` and `execute_tool` spans, so `agent/lib/conversation-span-processor.ts` copies it onto every span of the trace. Without the processor the run has content but the conversation id is on 2 of 8 spans.

## What Sentry received

Measured 2026-09-10 with eve 0.52.4. Two turns in one session: "What is the weather in Paris?" then "And in Berlin?". Columns from `scripts/traces.sh`.

| Command | Result |
| --- | --- |
| `eve dev` | One trace for both turns: 2 `invoke_agent`, 4 `chat`, 2 `execute_tool`. Every span has `gen_ai.conversation.id` = `wrun_01M25Z35B7X2AM127CGZS0R0WN`. Every `chat` span has input and output messages; every `execute_tool` span has tool input and output. [`e8123ebc8f45`](https://sentry-developer-experience.sentry.io/explore/traces/trace/e8123ebc8f45325649c5095accb3f0cc/?project=4512057016778752) |
| `eve start` | Same. Session `wrun_01M25Z3ZXZV6XMARMRFBC2QC45`. [`4ae444982b45`](https://sentry-developer-experience.sentry.io/explore/traces/trace/4ae444982b45f2139c7bc3ff7efd7f0d/?project=4512057016778752) |

The legacy layout gives one trace per turn with `agent_step` spans. The provider layout puts the whole session in one trace and emits no `agent_step` spans. The Sentry SDK path gives one trace per turn. No errors and no release, as in `v11/eve-otlp`.
