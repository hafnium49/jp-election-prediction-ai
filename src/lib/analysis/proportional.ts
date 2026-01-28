import { PerplexityClient } from "../ai/perplexity";
import { GrokClient } from "../ai/grok";
import {
  GeminiClient,
  ProportionalBlockSchema,
  ProportionalBlockPrediction,
} from "../ai/gemini";
import { renderTemplate, buildBlockVariables } from "../prompts/engine";
import {
  PROPORTIONAL_PERPLEXITY_TEMPLATE,
  PROPORTIONAL_GROK_TEMPLATE,
  PROPORTIONAL_GEMINI_TEMPLATE,
} from "../prompts/templates";
import { PROPORTIONAL_BLOCKS, getBlock } from "@/data/blocks";
import { getPrefecturesByBlock } from "@/data/prefectures";

export interface ProportionalAnalysisResult {
  blockId: string;
  blockName: string;
  perplexityRaw: string;
  grokRaw: string;
  prediction: ProportionalBlockPrediction;
  apiCalls: number;
}

/**
 * Run analysis for a single proportional representation block
 * 3 API calls: Perplexity + Grok (parallel) + Gemini (sequential)
 */
export async function analyzeProportionalBlock(
  blockId: string,
  perplexity: PerplexityClient,
  grok: GrokClient,
  gemini: GeminiClient
): Promise<ProportionalAnalysisResult> {
  const block = getBlock(blockId);
  if (!block) {
    throw new Error(`Proportional block not found: ${blockId}`);
  }

  const prefectures = getPrefecturesByBlock(blockId);
  const variables = buildBlockVariables(block, prefectures);

  // Step 1 & 2: Run Perplexity and Grok in parallel
  const [perplexityResult, grokResult] = await Promise.all([
    perplexity.search(
      renderTemplate(PROPORTIONAL_PERPLEXITY_TEMPLATE, variables)
    ),
    grok.analyzeXSentiment(
      renderTemplate(PROPORTIONAL_GROK_TEMPLATE, variables)
    ),
  ]);

  // Step 3: Synthesize with Gemini
  const synthesisVariables = {
    ...variables,
    PERPLEXITY_REPORT: perplexityResult.content,
    GROK_REPORT: grokResult.content,
  };

  const geminiResult = await gemini.generateStructuredOutput(
    renderTemplate(PROPORTIONAL_GEMINI_TEMPLATE, synthesisVariables),
    ProportionalBlockSchema
  );

  return {
    blockId,
    blockName: block.name,
    perplexityRaw: perplexityResult.content,
    grokRaw: grokResult.content,
    prediction: geminiResult.content,
    apiCalls: 3,
  };
}

/**
 * Get all block IDs for analysis
 */
export function getAllBlockIds(): string[] {
  return PROPORTIONAL_BLOCKS.map((b) => b.id);
}
