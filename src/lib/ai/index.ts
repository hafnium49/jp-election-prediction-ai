export * from "./perplexity";
export * from "./grok";
export * from "./gemini";

import { createPerplexityClient, PerplexityClient } from "./perplexity";
import { createGrokClient, GrokClient } from "./grok";
import { createGeminiClient, GeminiClient } from "./gemini";

export interface AIClients {
  perplexity: PerplexityClient;
  grok: GrokClient;
  gemini: GeminiClient;
}

// Create all AI clients at once
export function createAIClients(): AIClients {
  return {
    perplexity: createPerplexityClient(),
    grok: createGrokClient(),
    gemini: createGeminiClient(),
  };
}
