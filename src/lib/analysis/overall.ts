import { PerplexityClient } from "../ai/perplexity";
import { GrokClient } from "../ai/grok";
import { GeminiClient, OverallAnalysisSchema, OverallAnalysis } from "../ai/gemini";
import { renderTemplate, buildOverallVariables } from "../prompts/engine";
import {
  OVERALL_PERPLEXITY_TEMPLATE,
  OVERALL_GROK_TEMPLATE,
  OVERALL_GEMINI_TEMPLATE,
} from "../prompts/templates";

export interface OverallAnalysisResult {
  perplexityRaw: string;
  grokRaw: string;
  prediction: OverallAnalysis;
  apiCalls: number;
}

/**
 * Run overall (national) election analysis
 * 3 API calls: Perplexity + Grok (parallel) + Gemini (sequential)
 */
export async function analyzeOverall(
  perplexity: PerplexityClient,
  grok: GrokClient,
  gemini: GeminiClient
): Promise<OverallAnalysisResult> {
  const variables = buildOverallVariables();

  // Step 1 & 2: Run Perplexity and Grok in parallel
  const [perplexityResult, grokResult] = await Promise.all([
    perplexity.search(renderTemplate(OVERALL_PERPLEXITY_TEMPLATE, variables)),
    grok.analyzeXSentiment(renderTemplate(OVERALL_GROK_TEMPLATE, variables)),
  ]);

  // Step 3: Synthesize with Gemini
  const synthesisVariables = {
    ...variables,
    PERPLEXITY_REPORT: perplexityResult.content,
    GROK_REPORT: grokResult.content,
  };

  const geminiResult = await gemini.generateStructuredOutput(
    renderTemplate(OVERALL_GEMINI_TEMPLATE, synthesisVariables),
    OverallAnalysisSchema
  );

  return {
    perplexityRaw: perplexityResult.content,
    grokRaw: grokResult.content,
    prediction: geminiResult.content,
    apiCalls: 3,
  };
}
