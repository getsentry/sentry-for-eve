import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { defineAgent } from "eve";

const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY! });

export default defineAgent({
  model: openrouter.chat("openai/gpt-4o-mini"),
  // A direct-provider model is not in the AI Gateway catalog, so eve cannot
  // look up its context window for compaction.
  modelContextWindowTokens: 128_000,
  // The provider layout (agent/instrumentation/*.ts) is the only one that can
  // set a trace policy, and a trace policy is the only way to record inputs
  // and outputs when the channel audience is not public.
  experimental: { instrumentationProviders: true },
});
