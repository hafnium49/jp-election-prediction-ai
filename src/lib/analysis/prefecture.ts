import { PerplexityClient } from "../ai/perplexity";
import { GrokClient } from "../ai/grok";
import {
  GeminiClient,
  PrefecturePredictionSchema,
  PrefecturePrediction,
} from "../ai/gemini";
import { renderTemplate, buildPrefectureVariables } from "../prompts/engine";
import {
  PREFECTURE_PERPLEXITY_TEMPLATE,
  PREFECTURE_GROK_TEMPLATE,
  PREFECTURE_GEMINI_TEMPLATE,
} from "../prompts/templates";
import { PREFECTURES, getPrefecture } from "@/data/prefectures";
import { getDistrictsByPrefecture } from "@/data/districts";
import { getCandidatesByPrefecture } from "@/data/candidates/2026";

export interface PrefectureAnalysisResult {
  prefectureId: string;
  prefectureName: string;
  perplexityRaw: string;
  grokRaw: string;
  prediction: PrefecturePrediction;
  apiCalls: number;
}

/**
 * Run analysis for a single prefecture
 * 3 API calls: Perplexity + Grok (parallel) + Gemini (sequential)
 */
export async function analyzePrefecture(
  prefectureId: string,
  perplexity: PerplexityClient,
  grok: GrokClient,
  gemini: GeminiClient
): Promise<PrefectureAnalysisResult> {
  const prefecture = getPrefecture(prefectureId);
  if (!prefecture) {
    throw new Error(`Prefecture not found: ${prefectureId}`);
  }

  const districts = getDistrictsByPrefecture(prefectureId);
  const candidates = getCandidatesByPrefecture(prefectureId);

  const variables = buildPrefectureVariables(prefecture, districts, candidates);

  // Step 1 & 2: Run Perplexity and Grok in parallel
  const [perplexityResult, grokResult] = await Promise.all([
    perplexity.search(
      renderTemplate(PREFECTURE_PERPLEXITY_TEMPLATE, variables)
    ),
    grok.analyzeXSentiment(
      renderTemplate(PREFECTURE_GROK_TEMPLATE, variables)
    ),
  ]);

  // Step 3: Synthesize with Gemini
  const synthesisVariables = {
    ...variables,
    PERPLEXITY_REPORT: perplexityResult.content,
    GROK_REPORT: grokResult.content,
  };

  const geminiResult = await gemini.generateStructuredOutput(
    renderTemplate(PREFECTURE_GEMINI_TEMPLATE, synthesisVariables),
    PrefecturePredictionSchema
  );

  return {
    prefectureId,
    prefectureName: prefecture.name,
    perplexityRaw: perplexityResult.content,
    grokRaw: grokResult.content,
    prediction: geminiResult.content,
    apiCalls: 3,
  };
}

/**
 * Get all prefecture IDs for analysis
 */
export function getAllPrefectureIds(): string[] {
  return PREFECTURES.map((p) => p.id);
}
