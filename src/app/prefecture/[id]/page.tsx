import { notFound } from "next/navigation";
import Link from "next/link";
import { getPrefecture } from "@/data/prefectures";
import { getDistrictsByPrefecture } from "@/data/districts";
import { DistrictCard } from "@/components/cards/DistrictCard";
import { getParty } from "@/data/parties";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PrefecturePage({ params }: Props) {
  const { id } = await params;
  const prefecture = getPrefecture(id);

  if (!prefecture) {
    notFound();
  }

  const districts = getDistrictsByPrefecture(id);

  // Mock data - will be replaced with database queries
  const mockDistrictPredictions = districts.map((d) => ({
    districtId: d.id,
    districtName: d.name,
    winnerPartyId: Math.random() > 0.6 ? "ldp" : Math.random() > 0.5 ? "chudou" : "ishin",
    confidence: (["high", "medium", "low"] as const)[Math.floor(Math.random() * 3)],
    analysis: "AIによる情勢分析に基づく予測です。",
  }));

  // Count seats by party
  const seatsByParty: Record<string, number> = {};
  for (const pred of mockDistrictPredictions) {
    seatsByParty[pred.winnerPartyId] = (seatsByParty[pred.winnerPartyId] || 0) + 1;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="/" className="text-slate-400 hover:text-white text-sm">
          ← 全国予測に戻る
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{prefecture.name}</h1>
        <p className="text-slate-400">
          小選挙区 {districts.length}区 | {prefecture.nameEn}
        </p>
      </div>

      {/* Summary */}
      <div className="bg-slate-800 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">議席予測</h2>
        <div className="flex flex-wrap gap-4">
          {Object.entries(seatsByParty)
            .sort(([, a], [, b]) => b - a)
            .map(([partyId, count]) => {
              const party = getParty(partyId);
              return (
                <div key={partyId} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: party.color }}
                  />
                  <span>{party.shortName}</span>
                  <span className="font-bold">{count}</span>
                </div>
              );
            })}
        </div>
      </div>

      {/* District Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4">選挙区別予測</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockDistrictPredictions.map((pred) => (
            <DistrictCard
              key={pred.districtId}
              districtId={pred.districtId}
              districtName={pred.districtName}
              winnerPartyId={pred.winnerPartyId}
              confidence={pred.confidence}
              analysis={pred.analysis}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const { PREFECTURES } = await import("@/data/prefectures");
  return PREFECTURES.map((p) => ({ id: p.id }));
}
