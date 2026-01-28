"use client";

import Link from "next/link";
import { getParty } from "@/data/parties";

interface Candidate {
  name: string;
  party: string;
  voteShareMin?: number;
  voteShareMax?: number;
}

interface DistrictCardProps {
  districtId: string;
  districtName: string;
  winnerPartyId: string;
  confidence: "high" | "medium" | "low";
  candidates?: Candidate[];
  analysis?: string;
}

export function DistrictCard({
  districtId,
  districtName,
  winnerPartyId,
  confidence,
  candidates,
  analysis,
}: DistrictCardProps) {
  const party = getParty(winnerPartyId);

  const confidenceStyles = {
    high: "bg-opacity-100",
    medium: "bg-opacity-70",
    low: "bg-opacity-40",
  };

  return (
    <Link
      href={`/district/${districtId}`}
      className="block bg-slate-800 rounded-lg overflow-hidden hover:bg-slate-750 transition-colors group"
    >
      {/* Header with party color */}
      <div
        className={`h-2 ${confidenceStyles[confidence]}`}
        style={{ backgroundColor: party.color }}
      />

      <div className="p-4">
        <div className="flex items-start justify-between">
          <h4 className="font-medium text-sm group-hover:text-blue-400 transition-colors">
            {districtName}
          </h4>
          <ConfidenceBadge confidence={confidence} />
        </div>

        {/* Winner */}
        <div className="mt-3 flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: party.color }}
          />
          <span className="font-semibold">{party.shortName}</span>
          <span className="text-slate-400 text-sm">優勢</span>
        </div>

        {/* Candidates */}
        {candidates && candidates.length > 0 && (
          <div className="mt-3 space-y-1">
            {candidates.slice(0, 3).map((candidate, i) => {
              const candidateParty = getParty(candidate.party);
              return (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs text-slate-400"
                >
                  <div className="flex items-center gap-1">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: candidateParty.color }}
                    />
                    <span>{candidate.name}</span>
                  </div>
                  {candidate.voteShareMin && candidate.voteShareMax && (
                    <span>
                      {candidate.voteShareMin}-{candidate.voteShareMax}%
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Analysis */}
        {analysis && (
          <p className="mt-3 text-xs text-slate-500 line-clamp-2">{analysis}</p>
        )}
      </div>
    </Link>
  );
}

function ConfidenceBadge({
  confidence,
}: {
  confidence: "high" | "medium" | "low";
}) {
  const styles = {
    high: "bg-green-500/20 text-green-400",
    medium: "bg-yellow-500/20 text-yellow-400",
    low: "bg-red-500/20 text-red-400",
  };

  const labels = {
    high: "高",
    medium: "中",
    low: "低",
  };

  return (
    <span className={`text-xs px-2 py-0.5 rounded ${styles[confidence]}`}>
      {labels[confidence]}
    </span>
  );
}
