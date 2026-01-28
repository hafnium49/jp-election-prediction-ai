"use client";

import { PARTIES, getParty } from "@/data/parties";

interface SeatDistributionProps {
  seats: Record<string, number>;
  districtSeats?: Record<string, number>;
  proportionalSeats?: Record<string, number>;
  showDetails?: boolean;
}

export function SeatDistribution({
  seats,
  districtSeats,
  proportionalSeats,
  showDetails = true,
}: SeatDistributionProps) {
  const totalSeats = Object.values(seats).reduce((a, b) => a + b, 0);
  const majorityThreshold = 233;

  // Sort parties by seat count
  const sortedParties = Object.entries(seats)
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a);

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">議席予測</h3>

      {/* Bar visualization */}
      <div className="mb-6">
        <div className="flex h-8 rounded-lg overflow-hidden">
          {sortedParties.map(([partyId, count]) => {
            const party = getParty(partyId);
            const percentage = (count / totalSeats) * 100;
            return (
              <div
                key={partyId}
                className="relative group"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: party.color,
                }}
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {party.shortName}: {count}議席
                </div>
              </div>
            );
          })}
        </div>

        {/* Majority line */}
        <div className="relative mt-1">
          <div
            className="absolute h-4 border-l-2 border-dashed border-white/50"
            style={{
              left: `${(majorityThreshold / totalSeats) * 100}%`,
            }}
          />
          <div
            className="absolute text-xs text-slate-400 whitespace-nowrap"
            style={{
              left: `${(majorityThreshold / totalSeats) * 100}%`,
              transform: "translateX(-50%)",
              top: "1rem",
            }}
          >
            過半数 {majorityThreshold}
          </div>
        </div>
      </div>

      {/* Party details */}
      {showDetails && (
        <div className="space-y-3 mt-8">
          {sortedParties.map(([partyId, count]) => {
            const party = getParty(partyId);
            const district = districtSeats?.[partyId] ?? 0;
            const proportional = proportionalSeats?.[partyId] ?? 0;

            return (
              <div key={partyId} className="flex items-center gap-4">
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: party.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">
                      {party.name}
                    </span>
                    <span className="text-lg font-bold ml-2">{count}</span>
                  </div>
                  {districtSeats && proportionalSeats && (
                    <div className="text-xs text-slate-400">
                      小選挙区 {district} + 比例 {proportional}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Total */}
      <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between items-center">
        <span className="text-slate-400">総議席数</span>
        <span className="text-xl font-bold">{totalSeats}</span>
      </div>
    </div>
  );
}
