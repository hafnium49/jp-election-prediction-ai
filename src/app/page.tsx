import { SeatDistribution } from "@/components/charts/SeatDistribution";
import { PartyBars } from "@/components/charts/PartyBar";
import { JapanMap } from "@/components/map/JapanMap";
import { TOTAL_SEATS, MAJORITY_THRESHOLD } from "@/data/blocks";

// Mock data for now - will be replaced with database queries
const mockSeatProjection = {
  ldp: 230,
  chudou: 128,
  ishin: 35,
  dpfp: 31,
  sanseito: 18,
  jcp: 10,
  reiwa: 7,
  other: 6,
};

const mockDistrictSeats = {
  ldp: 169,
  chudou: 91,
  ishin: 16,
  dpfp: 8,
  sanseito: 0,
  jcp: 1,
  reiwa: 1,
  other: 3,
};

const mockProportionalSeats = {
  ldp: 61,
  chudou: 37,
  ishin: 19,
  dpfp: 23,
  sanseito: 18,
  jcp: 9,
  reiwa: 6,
  other: 3,
};

const mockPartySupport = {
  ldp: 27.4,
  chudou: 18.2,
  ishin: 8.5,
  dpfp: 7.8,
  sanseito: 5.2,
  jcp: 4.1,
  reiwa: 3.5,
};

const mockPrefecturePredictions: Record<
  string,
  { winnerPartyId: string; confidence: "high" | "medium" | "low" }
> = {
  hokkaido: { winnerPartyId: "ldp", confidence: "medium" },
  aomori: { winnerPartyId: "ldp", confidence: "high" },
  iwate: { winnerPartyId: "ldp", confidence: "medium" },
  miyagi: { winnerPartyId: "ldp", confidence: "medium" },
  akita: { winnerPartyId: "ldp", confidence: "high" },
  yamagata: { winnerPartyId: "ldp", confidence: "high" },
  fukushima: { winnerPartyId: "ldp", confidence: "medium" },
  ibaraki: { winnerPartyId: "ldp", confidence: "medium" },
  tochigi: { winnerPartyId: "ldp", confidence: "high" },
  gunma: { winnerPartyId: "ldp", confidence: "high" },
  saitama: { winnerPartyId: "chudou", confidence: "low" },
  chiba: { winnerPartyId: "ldp", confidence: "low" },
  tokyo: { winnerPartyId: "chudou", confidence: "low" },
  kanagawa: { winnerPartyId: "chudou", confidence: "low" },
  niigata: { winnerPartyId: "ldp", confidence: "medium" },
  toyama: { winnerPartyId: "ldp", confidence: "high" },
  ishikawa: { winnerPartyId: "ldp", confidence: "high" },
  fukui: { winnerPartyId: "ldp", confidence: "high" },
  yamanashi: { winnerPartyId: "ldp", confidence: "medium" },
  nagano: { winnerPartyId: "ldp", confidence: "medium" },
  gifu: { winnerPartyId: "ldp", confidence: "high" },
  shizuoka: { winnerPartyId: "ldp", confidence: "medium" },
  aichi: { winnerPartyId: "ldp", confidence: "low" },
  mie: { winnerPartyId: "ldp", confidence: "medium" },
  shiga: { winnerPartyId: "ldp", confidence: "medium" },
  kyoto: { winnerPartyId: "chudou", confidence: "low" },
  osaka: { winnerPartyId: "ishin", confidence: "high" },
  hyogo: { winnerPartyId: "ishin", confidence: "medium" },
  nara: { winnerPartyId: "ldp", confidence: "medium" },
  wakayama: { winnerPartyId: "ldp", confidence: "high" },
  tottori: { winnerPartyId: "ldp", confidence: "high" },
  shimane: { winnerPartyId: "ldp", confidence: "high" },
  okayama: { winnerPartyId: "ldp", confidence: "high" },
  hiroshima: { winnerPartyId: "ldp", confidence: "high" },
  yamaguchi: { winnerPartyId: "ldp", confidence: "high" },
  tokushima: { winnerPartyId: "ldp", confidence: "high" },
  kagawa: { winnerPartyId: "ldp", confidence: "high" },
  ehime: { winnerPartyId: "ldp", confidence: "high" },
  kochi: { winnerPartyId: "ldp", confidence: "high" },
  fukuoka: { winnerPartyId: "ldp", confidence: "medium" },
  saga: { winnerPartyId: "ldp", confidence: "high" },
  nagasaki: { winnerPartyId: "ldp", confidence: "high" },
  kumamoto: { winnerPartyId: "ldp", confidence: "high" },
  oita: { winnerPartyId: "ldp", confidence: "high" },
  miyazaki: { winnerPartyId: "ldp", confidence: "high" },
  kagoshima: { winnerPartyId: "ldp", confidence: "high" },
  okinawa: { winnerPartyId: "chudou", confidence: "medium" },
};

export default function Home() {
  const ldpCoalition = mockSeatProjection.ldp + mockSeatProjection.ishin;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">2026年 衆議院選挙予測</h1>
        <p className="text-slate-400">第51回衆議院議員総選挙 AI予測</p>
        <p className="text-sm text-slate-500 mt-2">
          最終更新: 2026年1月28日 18:00
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard label="総議席数" value={TOTAL_SEATS} />
        <MetricCard label="過半数" value={MAJORITY_THRESHOLD} />
        <MetricCard
          label="自民+維新"
          value={ldpCoalition}
          highlight={ldpCoalition >= MAJORITY_THRESHOLD}
        />
        <MetricCard label="内閣支持率" value="63.3%" />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Seat Distribution */}
        <SeatDistribution
          seats={mockSeatProjection}
          districtSeats={mockDistrictSeats}
          proportionalSeats={mockProportionalSeats}
        />

        {/* Party Support */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">政党支持率</h3>
          <PartyBars data={mockPartySupport} showPercentage />
        </div>
      </div>

      {/* Map Section */}
      <div className="mt-8">
        <JapanMap predictions={mockPrefecturePredictions} />
      </div>

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-slate-800/50 rounded-lg text-sm text-slate-400">
        <p>
          ※
          この予測はAIによる分析結果であり、実際の選挙結果を保証するものではありません。
          参考情報としてご覧ください。
        </p>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`bg-slate-800 rounded-lg p-4 text-center ${
        highlight ? "ring-2 ring-green-500" : ""
      }`}
    >
      <div className="text-sm text-slate-400 mb-1">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
