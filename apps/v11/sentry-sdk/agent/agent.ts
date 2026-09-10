import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { defineAgent } from "eve";

const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY! });

export default defineAgent({
  model: openrouter.chat("openai/gpt-4o-mini"),
  // A direct-provider model is not in the AI Gateway catalog, so eve cannot
  // look up its context window for compaction.
  modelContextWindowTokens: 128_000,
});
