import pLimit from "p-limit";
import { createAIClients } from "../ai";
import { analyzeOverall, OverallAnalysisResult } from "./overall";
import {
  analyzePrefecture,
  getAllPrefectureIds,
  PrefectureAnalysisResult,
} from "./prefecture";
import {
  analyzeProportionalBlock,
  getAllBlockIds,
  ProportionalAnalysisResult,
} from "./proportional";

// Concurrency limit: 5 parallel requests as per original system
const CONCURRENCY_LIMIT = 5;

export interface UpdateProgress {
  phase: "overall" | "prefectures" | "proportional" | "complete";
  completed: number;
  total: number;
  errors: string[];
  currentItem?: string;
}

export interface FullUpdateResult {
  overall: OverallAnalysisResult | null;
  prefectures: Map<string, PrefectureAnalysisResult>;
  proportional: Map<string, ProportionalAnalysisResult>;
  totalApiCalls: number;
  errors: string[];
  duration: number;
}

/**
 * Run a full election prediction update
 * Total API calls: ~177 (3 + 47×3 + 11×3)
 */
export async function runFullUpdate(
  onProgress?: (progress: UpdateProgress) => void
): Promise<FullUpdateResult> {
  const startTime = Date.now();
  const limit = pLimit(CONCURRENCY_LIMIT);
  const errors: string[] = [];
  let totalApiCalls = 0;

  // Initialize AI clients
  const { perplexity, grok, gemini } = createAIClients();

  // Results storage
  let overallResult: OverallAnalysisResult | null = null;
  const prefectureResults = new Map<string, PrefectureAnalysisResult>();
  const proportionalResults = new Map<string, ProportionalAnalysisResult>();

  // Phase 1: Overall Analysis (3 API calls)
  onProgress?.({
    phase: "overall",
    completed: 0,
    total: 1,
    errors,
    currentItem: "全国情勢",
  });

  try {
    overallResult = await analyzeOverall(perplexity, grok, gemini);
    totalApiCalls += overallResult.apiCalls;
  } catch (e) {
    const errorMsg = `Overall analysis failed: ${e}`;
    errors.push(errorMsg);
    console.error(errorMsg);
  }

  onProgress?.({
    phase: "overall",
    completed: 1,
    total: 1,
    errors,
  });

  // Phase 2: Prefecture Analysis (47 × 3 = 141 API calls)
  const prefectureIds = getAllPrefectureIds();
  let prefectureCompleted = 0;

  onProgress?.({
    phase: "prefectures",
    completed: 0,
    total: prefectureIds.length,
    errors,
  });

  const prefecturePromises = prefectureIds.map((prefectureId) =>
    limit(async () => {
      try {
        const result = await analyzePrefecture(
          prefectureId,
          perplexity,
          grok,
          gemini
        );
        prefectureResults.set(prefectureId, result);
        totalApiCalls += result.apiCalls;
      } catch (e) {
        const errorMsg = `Prefecture ${prefectureId} failed: ${e}`;
        errors.push(errorMsg);
        console.error(errorMsg);
      }

      prefectureCompleted++;
      onProgress?.({
        phase: "prefectures",
        completed: prefectureCompleted,
        total: prefectureIds.length,
        errors,
        currentItem: prefectureId,
      });
    })
  );

  await Promise.all(prefecturePromises);

  // Phase 3: Proportional Block Analysis (11 × 3 = 33 API calls)
  const blockIds = getAllBlockIds();
  let blockCompleted = 0;

  onProgress?.({
    phase: "proportional",
    completed: 0,
    total: blockIds.length,
    errors,
  });

  const blockPromises = blockIds.map((blockId) =>
    limit(async () => {
      try {
        const result = await analyzeProportionalBlock(
          blockId,
          perplexity,
          grok,
          gemini
        );
        proportionalResults.set(blockId, result);
        totalApiCalls += result.apiCalls;
      } catch (e) {
        const errorMsg = `Block ${blockId} failed: ${e}`;
        errors.push(errorMsg);
        console.error(errorMsg);
      }

      blockCompleted++;
      onProgress?.({
        phase: "proportional",
        completed: blockCompleted,
        total: blockIds.length,
        errors,
        currentItem: blockId,
      });
    })
  );

  await Promise.all(blockPromises);

  const duration = Date.now() - startTime;

  onProgress?.({
    phase: "complete",
    completed: 1 + prefectureIds.length + blockIds.length,
    total: 1 + prefectureIds.length + blockIds.length,
    errors,
  });

  return {
    overall: overallResult,
    prefectures: prefectureResults,
    proportional: proportionalResults,
    totalApiCalls,
    errors,
    duration,
  };
}

/**
 * Run analysis for specific prefectures only (for testing)
 */
export async function runPrefectureUpdate(
  prefectureIds: string[],
  onProgress?: (progress: UpdateProgress) => void
): Promise<Map<string, PrefectureAnalysisResult>> {
  const limit = pLimit(CONCURRENCY_LIMIT);
  const { perplexity, grok, gemini } = createAIClients();
  const results = new Map<string, PrefectureAnalysisResult>();
  const errors: string[] = [];
  let completed = 0;

  const promises = prefectureIds.map((prefectureId) =>
    limit(async () => {
      try {
        const result = await analyzePrefecture(
          prefectureId,
          perplexity,
          grok,
          gemini
        );
        results.set(prefectureId, result);
      } catch (e) {
        errors.push(`Prefecture ${prefectureId} failed: ${e}`);
      }

      completed++;
      onProgress?.({
        phase: "prefectures",
        completed,
        total: prefectureIds.length,
        errors,
        currentItem: prefectureId,
      });
    })
  );

  await Promise.all(promises);
  return results;
}

/**
 * Run analysis for specific blocks only (for testing)
 */
export async function runBlockUpdate(
  blockIds: string[],
  onProgress?: (progress: UpdateProgress) => void
): Promise<Map<string, ProportionalAnalysisResult>> {
  const limit = pLimit(CONCURRENCY_LIMIT);
  const { perplexity, grok, gemini } = createAIClients();
  const results = new Map<string, ProportionalAnalysisResult>();
  const errors: string[] = [];
  let completed = 0;

  const promises = blockIds.map((blockId) =>
    limit(async () => {
      try {
        const result = await analyzeProportionalBlock(
          blockId,
          perplexity,
          grok,
          gemini
        );
        results.set(blockId, result);
      } catch (e) {
        errors.push(`Block ${blockId} failed: ${e}`);
      }

      completed++;
      onProgress?.({
        phase: "proportional",
        completed,
        total: blockIds.length,
        errors,
        currentItem: blockId,
      });
    })
  );

  await Promise.all(promises);
  return results;
}
