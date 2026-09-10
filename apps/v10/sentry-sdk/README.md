# v10/sentry-sdk

`Sentry.init` with defaults. v10 registers OpenTelemetry itself. No eve exporter.

## What Sentry received

Measured 2026-09-09 with eve 0.52.4. One turn: "What is the weather in Paris?"

| Command | Result |
| --- | --- |
| `eve dev` | One trace, 5 `gen_ai` spans from Sentry's AI SDK integration. [`18b87bb8ac05`](https://sentry-developer-experience.sentry.io/explore/traces/trace/18b87bb8ac054656b89a9b2a5a22d7fe/?project=4512057016778752) |
| `eve start` | Same. [`0677ebe8ffb7`](https://sentry-developer-experience.sentry.io/explore/traces/trace/0677ebe8ffb74dcfb84e36e825656703/?project=4512057016778752) |
| `eve deploy` | Deployed to [https://sentry-for-eve-v10-sentry-sdk.sentry.dev](https://sentry-for-eve-v10-sentry-sdk.sentry.dev) on Vercel team `sentry`. Not invoked yet: Deployment Protection rejects `eve invoke` until a Protection Bypass for Automation secret exists. |

Nothing eve records leaves the process. No `agent.session`, no eve session id.

## Content and conversations

Measured 2026-09-10 with eve 0.52.4. Two turns in one session: "What is the weather in Paris?" then "And in Berlin?". Columns from `scripts/traces.sh`.

| Command | Conversation id | Inputs | Outputs | Traces |
| --- | --- | --- | --- | --- |
| `eve dev` | none | 0 | 0 | [`0b57182b0049`](https://sentry-developer-experience.sentry.io/explore/traces/trace/0b57182b00494f91a4bf8bf01a17721e/?project=4512057016778752) [`c83d64fa6dd9`](https://sentry-developer-experience.sentry.io/explore/traces/trace/c83d64fa6dd944c4ab7258745cf8aae8/?project=4512057016778752) |
| `eve start` | none | 0 | 0 | [`db0c875ef3a5`](https://sentry-developer-experience.sentry.io/explore/traces/trace/db0c875ef3a547d7a02d78674f5ca1a1/?project=4512057016778752) [`de5be4a0f7db`](https://sentry-developer-experience.sentry.io/explore/traces/trace/de5be4a0f7db45d1a1ad8d3e095cf119/?project=4512057016778752) |

Every `gen_ai` span arrives, and none carries messages, tool input, tool output, or `gen_ai.conversation.id`. eve records content only for a `public` channel audience, and `eve invoke` is `unknown`; the `recordInputs` and `recordOutputs` flags do not change that. `Sentry.vercelAIIntegration({ recordInputs: true, recordOutputs: true })` restores content and a hook restores the conversation id, see `v11/sentry-sdk-hook`. Under `eve dev` the environment was empty on this run.
