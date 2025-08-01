import { env } from "@repo/env";

import { createOpenAI } from "@ai-sdk/openai";
import { createProviderRegistry } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createMistral } from "@ai-sdk/mistral";
import { createDeepSeek } from "@ai-sdk/deepseek";

export const LLM_REGISTRY = createProviderRegistry(
  {
    openai: createOpenAI({
      apiKey: env.GEN_AI_API_KEY,
    }),
    google: createGoogleGenerativeAI({
      apiKey: env.GEN_AI_API_KEY,
    }),
    mistral: createMistral({
      apiKey: env.GEN_AI_API_KEY,
    }),
    deepseek: createDeepSeek({
      apiKey: env.GEN_AI_API_KEY,
    }),
  },
  {
    separator: " > ",
  },
);
