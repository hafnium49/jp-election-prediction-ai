"use client";

import { getParty } from "@/data/parties";

interface PredictionCardProps {
  title: string;
  winnerPartyId: string;
  confidence: "high" | "medium" | "low";
  analysis?: string;
  href?: string;
}

export function PredictionCard({
  title,
  winnerPartyId,
  confidence,
  analysis,
  href,
}: PredictionCardProps) {
  const party = getParty(winnerPartyId);

  const confidenceLabel = {
    high: "高",
    medium: "中",
    low: "低",
  };

  const confidenceColor = {
    high: "text-green-400",
    medium: "text-yellow-400",
    low: "text-red-400",
  };

  const CardWrapper = href ? "a" : "div";

  return (
    <CardWrapper
      href={href}
      className={`
        block bg-slate-800 rounded-lg p-4 border-l-4 transition-all
        ${href ? "hover:bg-slate-700 cursor-pointer" : ""}
      `}
      style={{ borderLeftColor: party.color }}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-medium text-sm">{title}</h4>
        <div className="flex items-center gap-1">
          <span className={`text-xs ${confidenceColor[confidence]}`}>
            確信度: {confidenceLabel[confidence]}
          </span>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: party.color }}
        />
        <span className="text-lg font-semibold">{party.shortName}</span>
        <span className="text-slate-400 text-sm">優勢</span>
      </div>

      {analysis && (
        <p className="mt-2 text-xs text-slate-400 line-clamp-2">{analysis}</p>
      )}
    </CardWrapper>
  );
}
