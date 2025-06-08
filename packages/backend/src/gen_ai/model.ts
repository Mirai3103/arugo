import { env } from "@repo/env";

export async function getModel() {
  switch (env.GEN_AI_PROVIDER) {
     case "openai":
        const {createOpenAI}= await import("@ai-sdk/openai");
        return createOpenAI({
            apiKey: env.GEN_AI_API_KEY,
        })(env.GEN_AI_MODEL);
    case "google":
        const { createGoogleGenerativeAI } = await import("@ai-sdk/google");
        return createGoogleGenerativeAI({
            apiKey: env.GEN_AI_API_KEY,
        })(env.GEN_AI_MODEL);
    case "mistral":
        const { createMistral } = await import("@ai-sdk/mistral");
        return createMistral({
            apiKey: env.GEN_AI_API_KEY,
        })(env.GEN_AI_MODEL);
    case "deepseek":
        const { createDeepSeek } = await import("@ai-sdk/deepseek");
        return createDeepSeek({
            apiKey: env.GEN_AI_API_KEY,
        })(env.GEN_AI_MODEL);
    default:
        throw new Error(`Unsupported GEN_AI_PROVIDER: ${env.GEN_AI_PROVIDER}`);
  }
}