import { PROPORTIONAL_BLOCKS, TOTAL_PROPORTIONAL_SEATS } from "@/data/blocks";
import { getParty } from "@/data/parties";
import { PartyBars } from "@/components/charts/PartyBar";

// Mock data - will be replaced with database queries
const mockBlockPredictions: Record<string, Record<string, number>> = {
  hokkaido: { ldp: 4, chudou: 2, ishin: 1, dpfp: 1 },
  tohoku: { ldp: 7, chudou: 3, ishin: 1, dpfp: 1, jcp: 1 },
  kitakanto: { ldp: 8, chudou: 5, ishin: 2, dpfp: 2, sanseito: 1, jcp: 1 },
  minamikanto: { ldp: 9, chudou: 6, ishin: 2, dpfp: 3, sanseito: 1, jcp: 1 },
  tokyo: { ldp: 6, chudou: 5, ishin: 2, dpfp: 2, sanseito: 1, jcp: 1 },
  hokurikushinetsu: { ldp: 6, chudou: 2, ishin: 1, dpfp: 1, jcp: 1 },
  tokai: { ldp: 9, chudou: 5, ishin: 2, dpfp: 3, sanseito: 1, jcp: 1 },
  kinki: { ldp: 8, chudou: 6, ishin: 8, dpfp: 3, sanseito: 2, jcp: 1 },
  chugoku: { ldp: 6, chudou: 2, ishin: 1, dpfp: 1, jcp: 1 },
  shikoku: { ldp: 3, chudou: 1, ishin: 1, dpfp: 1 },
  kyushu: { ldp: 10, chudou: 4, ishin: 2, dpfp: 2, sanseito: 1, jcp: 1 },
};

export default function ProportionalPage() {
  // Calculate totals
  const totalsByParty: Record<string, number> = {};
  for (const blockSeats of Object.values(mockBlockPredictions)) {
    for (const [party, seats] of Object.entries(blockSeats)) {
      totalsByParty[party] = (totalsByParty[party] || 0) + seats;
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">比例代表予測</h1>
        <p className="text-slate-400">
          11ブロック {TOTAL_PROPORTIONAL_SEATS}議席
        </p>
      </div>

      {/* Total Summary */}
      <div className="bg-slate-800 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">政党別議席予測（比例全国）</h2>
        <PartyBars data={totalsByParty} />
      </div>

      {/* Block Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROPORTIONAL_BLOCKS.map((block) => {
          const blockSeats = mockBlockPredictions[block.id] || {};

          return (
            <div key={block.id} className="bg-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{block.name}</h3>
                <span className="text-slate-400 text-sm">
                  {block.seats}議席
                </span>
              </div>

              <div className="space-y-2">
                {Object.entries(blockSeats)
                  .sort(([, a], [, b]) => b - a)
                  .map(([partyId, seats]) => {
                    const party = getParty(partyId);
                    const percentage = (seats / block.seats) * 100;

                    return (
                      <div key={partyId}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: party.color }}
                            />
                            <span>{party.shortName}</span>
                          </div>
                          <span className="font-medium">{seats}</span>
                        </div>
                        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: party.color,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
