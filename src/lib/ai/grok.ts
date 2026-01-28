export interface GrokConfig {
  apiKey: string;
  model?: "grok-3" | "grok-3-fast";
}

export interface GrokResponse {
  content: string;
  xPosts?: Array<{
    id: string;
    text: string;
    author?: string;
    engagement?: number;
  }>;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
  };
}

export class GrokClient {
  private baseUrl = "https://api.x.ai/v1";
  private config: Required<GrokConfig>;

  constructor(config: GrokConfig) {
    this.config = {
      apiKey: config.apiKey,
      model: config.model ?? "grok-3-fast",
    };
  }

  async analyzeXSentiment(
    prompt: string,
    enableXSearch: boolean = true
  ): Promise<GrokResponse> {
    const tools = enableXSearch
      ? [
          {
            type: "function",
            function: {
              name: "x_search",
              description: "Search X (Twitter) for posts about a topic",
              parameters: {
                type: "object",
                properties: {
                  query: {
                    type: "string",
                    description: "Search query",
                  },
                },
                required: ["query"],
              },
            },
          },
        ]
      : undefined;

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
            content: `あなたはX（旧Twitter）上の政治的な議論や世論を分析する専門家です。
SNSの声は有権者全体を代表しているわけではないことに注意し、バイアスを考慮した分析を行ってください。
ボットや組織的な投稿の可能性も考慮してください。`,
          },
          { role: "user", content: prompt },
        ],
        tools,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Grok API error: ${response.status} - ${error}`);
    }

    const data = await response.json();

    // Handle tool calls if present
    let content = data.choices[0].message.content || "";
    const xPosts: GrokResponse["xPosts"] = [];

    if (data.choices[0].message.tool_calls) {
      // Process X search results if available
      for (const toolCall of data.choices[0].message.tool_calls) {
        if (toolCall.function.name === "x_search") {
          // The results would be embedded in the response
          // This is a simplified handling
        }
      }
    }

    return {
      content,
      xPosts: xPosts.length > 0 ? xPosts : undefined,
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
export function createGrokClient(): GrokClient {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    throw new Error("XAI_API_KEY environment variable is not set");
  }
  return new GrokClient({ apiKey });
}
