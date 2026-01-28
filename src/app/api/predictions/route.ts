import { NextResponse } from "next/server";
import {
  getLatestOverallAnalysis,
  getLatestAllPrefecturePredictions,
  getLatestAllProportionalPredictions,
  getAggregatedSeatProjection,
} from "@/lib/db/queries";

export async function GET() {
  try {
    const [overall, prefectures, proportional, aggregated] = await Promise.all([
      getLatestOverallAnalysis(),
      getLatestAllPrefecturePredictions(),
      getLatestAllProportionalPredictions(),
      getAggregatedSeatProjection(),
    ]);

    return NextResponse.json({
      overall: overall?.overallAnalysis || null,
      prefectures: prefectures.map((p: typeof prefectures[number]) => ({
        id: p.targetId,
        districts: p.districtPredictions,
        prediction: p.prediction,
      })),
      proportional: proportional.map((p: typeof proportional[number]) => ({
        id: p.targetId,
        prediction: p.proportionalPrediction,
      })),
      aggregated,
      updatedAt: overall?.createdAt || null,
    });
  } catch (error) {
    console.error("Failed to fetch predictions:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch predictions",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
