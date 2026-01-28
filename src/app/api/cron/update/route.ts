import { NextResponse } from "next/server";
import { runFullUpdate } from "@/lib/analysis/orchestrator";
import { saveFullUpdate } from "@/lib/db/queries";

// Maximum duration for Vercel serverless function
export const maxDuration = 300; // 5 minutes

export async function GET(request: Request) {
  // Verify cron secret for security
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("Starting full election prediction update...");

    const results = await runFullUpdate((progress) => {
      console.log(
        `[${progress.phase}] ${progress.completed}/${progress.total} - ${progress.currentItem || ""}`
      );
    });

    console.log(`Update completed. Total API calls: ${results.totalApiCalls}`);
    console.log(`Duration: ${Math.floor(results.duration / 1000)}s`);

    if (results.errors.length > 0) {
      console.warn(`Errors encountered: ${results.errors.length}`);
      results.errors.forEach((err) => console.error(err));
    }

    // Save results to database
    const updateId = await saveFullUpdate(results);

    return NextResponse.json({
      success: true,
      updateId,
      apiCalls: results.totalApiCalls,
      duration: results.duration,
      errors: results.errors.length,
      prefectures: results.prefectures.size,
      blocks: results.proportional.size,
    });
  } catch (error) {
    console.error("Full update failed:", error);

    return NextResponse.json(
      {
        error: "Update failed",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
