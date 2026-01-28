"use client";

import { getParty } from "@/data/parties";

interface PartyBarProps {
  partyId: string;
  value: number;
  maxValue: number;
  label?: string;
  showPercentage?: boolean;
}

export function PartyBar({
  partyId,
  value,
  maxValue,
  label,
  showPercentage = false,
}: PartyBarProps) {
  const party = getParty(partyId);
  const percentage = (value / maxValue) * 100;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: party.color }}
          />
          <span>{label ?? party.shortName}</span>
        </div>
        <span className="font-medium">
          {showPercentage ? `${value.toFixed(1)}%` : value}
        </span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${Math.min(percentage, 100)}%`,
            backgroundColor: party.color,
          }}
        />
      </div>
    </div>
  );
}

interface PartyBarsProps {
  data: Record<string, number>;
  showPercentage?: boolean;
}

export function PartyBars({ data, showPercentage = false }: PartyBarsProps) {
  const maxValue = Math.max(...Object.values(data));
  const sortedEntries = Object.entries(data).sort(([, a], [, b]) => b - a);

  return (
    <div className="space-y-4">
      {sortedEntries.map(([partyId, value]) => (
        <PartyBar
          key={partyId}
          partyId={partyId}
          value={value}
          maxValue={maxValue}
          showPercentage={showPercentage}
        />
      ))}
    </div>
  );
}
