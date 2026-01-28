import { z } from "zod";

export interface GeminiConfig {
  apiKey: string;
  model?: "gemini-2.0-flash" | "gemini-2.0-pro" | "gemini-1.5-flash" | "gemini-1.5-pro";
}

export interface GeminiResponse<T> {
  content: T;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
  };
}

export class GeminiClient {
  private baseUrl = "https://generativelanguage.googleapis.com/v1beta";
  private config: Required<GeminiConfig>;

  constructor(config: GeminiConfig) {
    this.config = {
      apiKey: config.apiKey,
      model: config.model ?? "gemini-2.0-flash",
    };
  }

  async generateStructuredOutput<T>(
    prompt: string,
    schema: z.ZodType<T>
  ): Promise<GeminiResponse<T>> {
    const jsonSchema = zodToGeminiSchema(schema);

    const response = await fetch(
      `${this.baseUrl}/models/${this.config.model}:generateContent?key=${this.config.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: jsonSchema,
            temperature: 0.7,
            maxOutputTokens: 8192,
          },
          systemInstruction: {
            parts: [
              {
                text: `あなたは日本の選挙データを分析し、構造化されたJSONを生成する専門家です。
与えられた情報を正確に分析し、指定されたJSON形式で出力してください。
推測が必要な場合は、保守的な予測を行い、確信度を適切に設定してください。`,
              },
            ],
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${error}`);
    }

    const data = await response.json();

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("Gemini returned no candidates");
    }

    const jsonText = data.candidates[0].content.parts[0].text;

    try {
      const parsed = JSON.parse(jsonText);
      const validated = schema.parse(parsed);

      return {
        content: validated,
        model: this.config.model,
        usage: data.usageMetadata
          ? {
              promptTokens: data.usageMetadata.promptTokenCount,
              completionTokens: data.usageMetadata.candidatesTokenCount,
            }
          : undefined,
      };
    } catch (parseError) {
      throw new Error(
        `Failed to parse Gemini response: ${parseError}. Raw: ${jsonText.substring(0, 500)}`
      );
    }
  }

  async generateText(prompt: string): Promise<string> {
    const response = await fetch(
      `${this.baseUrl}/models/${this.config.model}:generateContent?key=${this.config.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }
}

// Convert Zod schema to Gemini-compatible JSON schema
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function zodToGeminiSchema(schema: any): object {
  // Simplified conversion - handles common types
  const typeName = schema?.constructor?.name || schema?._def?.typeName;

  if (typeName === "ZodObject" || schema?._def?.typeName === "ZodObject") {
    const shape = schema.shape || schema._def?.shape?.();
    const properties: Record<string, object> = {};
    const required: string[] = [];

    if (shape) {
      for (const [key, value] of Object.entries(shape)) {
        properties[key] = zodToGeminiSchema(value);
        // Check if optional
        const valueTypeName = (value as any)?.constructor?.name || (value as any)?._def?.typeName;
        if (valueTypeName !== "ZodOptional") {
          required.push(key);
        }
      }
    }

    return {
      type: "object",
      properties,
      required,
    };
  }

  if (typeName === "ZodArray" || schema?._def?.typeName === "ZodArray") {
    const element = schema.element || schema._def?.type;
    return {
      type: "array",
      items: element ? zodToGeminiSchema(element) : { type: "string" },
    };
  }

  if (typeName === "ZodString" || schema?._def?.typeName === "ZodString") {
    return { type: "string" };
  }

  if (typeName === "ZodNumber" || schema?._def?.typeName === "ZodNumber") {
    return { type: "number" };
  }

  if (typeName === "ZodBoolean" || schema?._def?.typeName === "ZodBoolean") {
    return { type: "boolean" };
  }

  if (typeName === "ZodEnum" || schema?._def?.typeName === "ZodEnum") {
    return {
      type: "string",
      enum: schema.options || schema._def?.values,
    };
  }

  if (typeName === "ZodRecord" || schema?._def?.typeName === "ZodRecord") {
    const valueSchema = schema.valueSchema || schema._def?.valueType;
    return {
      type: "object",
      additionalProperties: valueSchema ? zodToGeminiSchema(valueSchema) : { type: "string" },
    };
  }

  if (typeName === "ZodOptional" || schema?._def?.typeName === "ZodOptional") {
    const inner = schema.unwrap?.() || schema._def?.innerType;
    return inner ? zodToGeminiSchema(inner) : { type: "string" };
  }

  // Default fallback
  return { type: "string" };
}

// Factory function
export function createGeminiClient(): GeminiClient {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }
  return new GeminiClient({ apiKey });
}

// Output schemas for structured responses
export const OverallAnalysisSchema = z.object({
  cabinet_approval: z.number(),
  party_support: z.record(z.string(), z.number()),
  key_issues: z.array(
    z.object({
      issue: z.string(),
      importance: z.enum(["high", "medium", "low"]),
      favorable_to: z.string(),
    })
  ),
  national_trend: z.enum(["ruling_advantage", "opposition_advantage", "close"]),
  seat_projection: z.record(z.string(), z.number()),
  district_seats: z.record(z.string(), z.number()),
  proportional_seats: z.record(z.string(), z.number()),
  analysis_summary: z.string(),
});

export const PrefecturePredictionSchema = z.object({
  prefecture_id: z.string(),
  prefecture_name: z.string(),
  districts: z.array(
    z.object({
      district_id: z.string(),
      district_name: z.string(),
      winner_party: z.string(),
      confidence: z.enum(["high", "medium", "low"]),
      analysis: z.string(),
      candidates: z.array(
        z.object({
          name: z.string(),
          party: z.string(),
          vote_share_min: z.number(),
          vote_share_max: z.number(),
        })
      ),
    })
  ),
  overview: z.string(),
});

export const ProportionalBlockSchema = z.object({
  block_id: z.string(),
  block_name: z.string(),
  seats_total: z.number(),
  party_seats: z.record(z.string(), z.number()),
  analysis: z.string(),
});

export type OverallAnalysis = z.infer<typeof OverallAnalysisSchema>;
export type PrefecturePrediction = z.infer<typeof PrefecturePredictionSchema>;
export type ProportionalBlockPrediction = z.infer<typeof ProportionalBlockSchema>;
