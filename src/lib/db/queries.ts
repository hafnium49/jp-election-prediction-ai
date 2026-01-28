import prisma from "./client";
import { FullUpdateResult } from "../analysis/orchestrator";
import { OverallAnalysis, PrefecturePrediction, ProportionalBlockPrediction } from "../ai/gemini";

/**
 * Save overall analysis to database
 */
export async function saveOverallAnalysis(
  perplexityRaw: string,
  grokRaw: string,
  prediction: OverallAnalysis
) {
  const result = await prisma.prediction.create({
    data: {
      type: "overall",
      targetId: "national",
      perplexityRaw,
      grokRaw,
      geminiRaw: JSON.stringify(prediction),
      prediction: prediction as object,
      overallAnalysis: {
        create: {
          cabinetApproval: prediction.cabinet_approval,
          partySupport: prediction.party_support,
          keyIssues: prediction.key_issues,
          nationalTrend: prediction.national_trend,
          seatProjection: prediction.seat_projection,
        },
      },
    },
  });

  return result;
}

/**
 * Save prefecture prediction to database
 */
export async function savePrefecturePrediction(
  prefectureId: string,
  perplexityRaw: string,
  grokRaw: string,
  prediction: PrefecturePrediction
) {
  const result = await prisma.prediction.create({
    data: {
      type: "prefecture",
      targetId: prefectureId,
      perplexityRaw,
      grokRaw,
      geminiRaw: JSON.stringify(prediction),
      prediction: prediction as object,
      districtPredictions: {
        create: prediction.districts.map((d) => ({
          districtId: d.district_id,
          winnerPartyId: d.winner_party,
          confidence: d.confidence,
          analysis: d.analysis,
          voteShareMin: d.candidates[0]?.vote_share_min,
          voteShareMax: d.candidates[0]?.vote_share_max,
        })),
      },
    },
  });

  return result;
}

/**
 * Save proportional block prediction to database
 */
export async function saveProportionalPrediction(
  blockId: string,
  perplexityRaw: string,
  grokRaw: string,
  prediction: ProportionalBlockPrediction
) {
  const result = await prisma.prediction.create({
    data: {
      type: "proportional",
      targetId: blockId,
      perplexityRaw,
      grokRaw,
      geminiRaw: JSON.stringify(prediction),
      prediction: prediction as object,
      proportionalPrediction: {
        create: {
          blockId: prediction.block_id,
          partySeats: prediction.party_seats,
          totalSeats: prediction.seats_total,
          analysis: prediction.analysis,
        },
      },
    },
  });

  return result;
}

/**
 * Save full update results to database
 */
export async function saveFullUpdate(results: FullUpdateResult) {
  // Create update log
  const updateLog = await prisma.updateLog.create({
    data: {
      status: "running",
      apiCalls: results.totalApiCalls,
    },
  });

  try {
    // Save overall analysis
    if (results.overall) {
      await saveOverallAnalysis(
        results.overall.perplexityRaw,
        results.overall.grokRaw,
        results.overall.prediction
      );
    }

    // Save prefecture predictions
    for (const [prefectureId, result] of results.prefectures) {
      await savePrefecturePrediction(
        prefectureId,
        result.perplexityRaw,
        result.grokRaw,
        result.prediction
      );
    }

    // Save proportional predictions
    for (const [blockId, result] of results.proportional) {
      await saveProportionalPrediction(
        blockId,
        result.perplexityRaw,
        result.grokRaw,
        result.prediction
      );
    }

    // Update log status
    await prisma.updateLog.update({
      where: { id: updateLog.id },
      data: {
        status: "completed",
        completedAt: new Date(),
        duration: Math.floor(results.duration / 1000),
        errors: results.errors.length > 0 ? results.errors : undefined,
      },
    });

    return updateLog.id;
  } catch (error) {
    // Update log status on failure
    await prisma.updateLog.update({
      where: { id: updateLog.id },
      data: {
        status: "failed",
        errors: [String(error)],
      },
    });

    throw error;
  }
}

/**
 * Get latest overall analysis
 */
export async function getLatestOverallAnalysis() {
  const prediction = await prisma.prediction.findFirst({
    where: { type: "overall" },
    orderBy: { createdAt: "desc" },
    include: { overallAnalysis: true },
  });

  return prediction;
}

/**
 * Get latest predictions for a prefecture
 */
export async function getLatestPrefecturePrediction(prefectureId: string) {
  const prediction = await prisma.prediction.findFirst({
    where: { type: "prefecture", targetId: prefectureId },
    orderBy: { createdAt: "desc" },
    include: { districtPredictions: true },
  });

  return prediction;
}

/**
 * Get latest predictions for all prefectures
 */
export async function getLatestAllPrefecturePredictions() {
  // Get the latest prediction for each prefecture using a subquery approach
  const predictions = await prisma.prediction.findMany({
    where: { type: "prefecture" },
    orderBy: { createdAt: "desc" },
    include: { districtPredictions: true },
    distinct: ["targetId"],
  });

  return predictions;
}

/**
 * Get latest proportional block prediction
 */
export async function getLatestProportionalPrediction(blockId: string) {
  const prediction = await prisma.prediction.findFirst({
    where: { type: "proportional", targetId: blockId },
    orderBy: { createdAt: "desc" },
    include: { proportionalPrediction: true },
  });

  return prediction;
}

/**
 * Get latest predictions for all proportional blocks
 */
export async function getLatestAllProportionalPredictions() {
  const predictions = await prisma.prediction.findMany({
    where: { type: "proportional" },
    orderBy: { createdAt: "desc" },
    include: { proportionalPrediction: true },
    distinct: ["targetId"],
  });

  return predictions;
}

/**
 * Get update logs
 */
export async function getUpdateLogs(limit: number = 10) {
  return prisma.updateLog.findMany({
    orderBy: { startedAt: "desc" },
    take: limit,
  });
}

/**
 * Get aggregated seat projections
 */
export async function getAggregatedSeatProjection() {
  const overall = await getLatestOverallAnalysis();
  const prefectures = await getLatestAllPrefecturePredictions();
  const proportional = await getLatestAllProportionalPredictions();

  // Aggregate district seats from prefecture predictions
  const districtSeats: Record<string, number> = {};
  for (const pref of prefectures) {
    for (const district of pref.districtPredictions) {
      const party = district.winnerPartyId;
      districtSeats[party] = (districtSeats[party] || 0) + 1;
    }
  }

  // Aggregate proportional seats
  const proportionalSeats: Record<string, number> = {};
  for (const block of proportional) {
    const seats = block.proportionalPrediction?.partySeats as Record<string, number> | null;
    if (seats) {
      for (const [party, count] of Object.entries(seats)) {
        proportionalSeats[party] = (proportionalSeats[party] || 0) + count;
      }
    }
  }

  // Total seats
  const totalSeats: Record<string, number> = {};
  const allParties = new Set([
    ...Object.keys(districtSeats),
    ...Object.keys(proportionalSeats),
  ]);

  for (const party of allParties) {
    totalSeats[party] =
      (districtSeats[party] || 0) + (proportionalSeats[party] || 0);
  }

  return {
    districtSeats,
    proportionalSeats,
    totalSeats,
    updatedAt: overall?.createdAt || new Date(),
  };
}
