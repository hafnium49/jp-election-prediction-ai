export interface PerplexityConfig {
  apiKey: string;
  model?: "sonar" | "sonar-pro" | "sonar-reasoning" | "sonar-reasoning-pro";
  maxTokens?: number;
}

export interface PerplexityResponse {
  content: string;
  citations: string[];
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
  };
}

export class PerplexityClient {
  private baseUrl = "https://api.perplexity.ai";
  private config: Required<PerplexityConfig>;

  constructor(config: PerplexityConfig) {
    this.config = {
      apiKey: config.apiKey,
      model: config.model ?? "sonar-pro",
      maxTokens: config.maxTokens ?? 4096,
    };
  }

  async search(prompt: string): Promise<PerplexityResponse> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [
          {
            role: "system",
            content:
              "あなたは日本の選挙・政治を専門とする政治アナリストです。正確で客観的な情報を提供してください。",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: this.config.maxTokens,
        return_citations: true,
        search_recency_filter: "week", // Focus on recent news
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Perplexity API error: ${response.status} - ${error}`);
    }

    const data = await response.json();

    return {
      content: data.choices[0].message.content,
      citations: data.citations || [],
      model: data.model,
      usage: data.usage
        ? {
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
          }
        : undefined,
    };
  }
}

// Factory function
export function createPerplexityClient(): PerplexityClient {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) {
    throw new Error("PERPLEXITY_API_KEY environment variable is not set");
  }
  return new PerplexityClient({ apiKey });
}
