# v11/sentry-sdk

`Sentry.init` with defaults. v11 does not register OpenTelemetry. No eve exporter. This is the least code a user can write.

## What Sentry received

Measured 2026-09-09 with eve 0.52.4. One turn: "What is the weather in Paris?"

| Command | Result |
| --- | --- |
| `eve dev` | One trace, 5 `gen_ai` spans from Sentry's AI SDK integration. [`ee80e399d258`](https://sentry-developer-experience.sentry.io/explore/traces/trace/ee80e399d258465e9e55128ec7588e0c/?project=4512057016778752) |
| `eve start` | Same. [`d59807be9115`](https://sentry-developer-experience.sentry.io/explore/traces/trace/d59807be91154aeab60071ad55a9d890/?project=4512057016778752) |
| `eve deploy` | Deployed to [https://sentry-for-eve-v11-sentry-sdk.sentry.dev](https://sentry-for-eve-v11-sentry-sdk.sentry.dev) on Vercel team `sentry`. Not invoked yet: Deployment Protection rejects `eve invoke` until a Protection Bypass for Automation secret exists. |

Errors and environment work. Nothing eve records leaves the process: no `agent.session`, no eve session id, no `agent_step`.

## Content and conversations

Measured 2026-09-10 with eve 0.52.4. Two turns in one session: "What is the weather in Paris?" then "And in Berlin?". Columns from `scripts/traces.sh`.

| Command | Conversation id | Inputs | Outputs | Traces |
| --- | --- | --- | --- | --- |
| `eve dev` | none | 0 | 0 | [`d62d4f6419c1`](https://sentry-developer-experience.sentry.io/explore/traces/trace/d62d4f6419c14fdb8082cf13cc602546/?project=4512057016778752) [`f8f8478150d1`](https://sentry-developer-experience.sentry.io/explore/traces/trace/f8f8478150d14a679615641f02088fd1/?project=4512057016778752) |
| `eve start` | none | 0 | 0 | [`66b9b3e36685`](https://sentry-developer-experience.sentry.io/explore/traces/trace/66b9b3e3668544cd952e0fbcb6c142fa/?project=4512057016778752) [`f239dbe1cdb9`](https://sentry-developer-experience.sentry.io/explore/traces/trace/f239dbe1cdb948f4aad257c65d88d120/?project=4512057016778752) |

Every `gen_ai` span arrives, and none carries messages, tool input, tool output, or `gen_ai.conversation.id`. eve records content only for a `public` channel audience, and `eve invoke` is `unknown`; the `recordInputs` and `recordOutputs` flags do not change that. `Sentry.vercelAIIntegration({ recordInputs: true, recordOutputs: true })` restores content and a hook restores the conversation id, see `v11/sentry-sdk-hook`.
