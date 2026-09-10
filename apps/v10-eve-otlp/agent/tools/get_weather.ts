import { defineTool } from "eve/tools";
import { z } from "zod";

// Deterministic: no network, so every run produces the same tool span.
const WEATHER: Record<string, { tempC: number; condition: string }> = {
  paris: { tempC: 21, condition: "sunny" },
  london: { tempC: 14, condition: "rainy" },
  tokyo: { tempC: 27, condition: "humid" },
};

export default defineTool({
  description: "Get the current weather for a city.",
  inputSchema: z.object({ city: z.string().describe("City name") }),
  execute: async ({ city }) => {
    const found = WEATHER[city.trim().toLowerCase()];
    return found ?? { tempC: 18, condition: "unknown city, guessed mild" };
  },
});
