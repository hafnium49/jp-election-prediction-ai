"use client";

import { useState } from "react";
import Link from "next/link";
import { PREFECTURES } from "@/data/prefectures";
import { getParty } from "@/data/parties";

interface PrefecturePrediction {
  winnerPartyId: string;
  confidence: "high" | "medium" | "low";
}

interface JapanMapProps {
  predictions: Record<string, PrefecturePrediction>;
  onPrefectureClick?: (prefectureId: string) => void;
}

export function JapanMap({ predictions, onPrefectureClick }: JapanMapProps) {
  const [hoveredPrefecture, setHoveredPrefecture] = useState<string | null>(
    null
  );

  // Grid-based layout for prefectures (simplified representation)
  const regions = {
    hokkaido: ["hokkaido"],
    tohoku: ["aomori", "iwate", "miyagi", "akita", "yamagata", "fukushima"],
    kanto: [
      "ibaraki",
      "tochigi",
      "gunma",
      "saitama",
      "chiba",
      "tokyo",
      "kanagawa",
    ],
    chubu: [
      "niigata",
      "toyama",
      "ishikawa",
      "fukui",
      "yamanashi",
      "nagano",
      "gifu",
      "shizuoka",
      "aichi",
    ],
    kinki: ["mie", "shiga", "kyoto", "osaka", "hyogo", "nara", "wakayama"],
    chugoku: ["tottori", "shimane", "okayama", "hiroshima", "yamaguchi"],
    shikoku: ["tokushima", "kagawa", "ehime", "kochi"],
    kyushu: [
      "fukuoka",
      "saga",
      "nagasaki",
      "kumamoto",
      "oita",
      "miyazaki",
      "kagoshima",
      "okinawa",
    ],
  };

  const getColor = (prefectureId: string) => {
    const pred = predictions[prefectureId];
    if (!pred) return "#374151"; // gray-700

    const party = getParty(pred.winnerPartyId);
    const opacity = {
      high: "ff",
      medium: "b3",
      low: "66",
    };

    return party.color + opacity[pred.confidence];
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">都道府県別予測</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(regions).map(([region, prefectureIds]) => (
          <div key={region} className="space-y-2">
            <h4 className="text-xs text-slate-400 uppercase tracking-wide">
              {regionNames[region as keyof typeof regionNames]}
            </h4>
            <div className="flex flex-wrap gap-1">
              {prefectureIds.map((prefId) => {
                const prefecture = PREFECTURES.find((p) => p.id === prefId);
                if (!prefecture) return null;

                const pred = predictions[prefId];
                const party = pred ? getParty(pred.winnerPartyId) : null;

                return (
                  <Link
                    key={prefId}
                    href={`/prefecture/${prefId}`}
                    className="relative group"
                    onMouseEnter={() => setHoveredPrefecture(prefId)}
                    onMouseLeave={() => setHoveredPrefecture(null)}
                    onClick={() => onPrefectureClick?.(prefId)}
                  >
                    <div
                      className="w-10 h-10 rounded flex items-center justify-center text-xs font-medium transition-all hover:scale-110 hover:z-10"
                      style={{ backgroundColor: getColor(prefId) }}
                    >
                      {prefecture.name.slice(0, 2)}
                    </div>

                    {/* Tooltip */}
                    {hoveredPrefecture === prefId && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 rounded-lg shadow-lg z-20 whitespace-nowrap">
                        <div className="font-medium">{prefecture.name}</div>
                        {party && (
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: party.color }}
                            />
                            {party.shortName}優勢
                          </div>
                        )}
                        <div className="text-xs text-slate-500">
                          {prefecture.districtCount}選挙区
                        </div>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-slate-700">
        <div className="text-xs text-slate-400 mb-2">確信度</div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-white/100" />
            <span>高</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-white/70" />
            <span>中</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-white/40" />
            <span>低</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const regionNames = {
  hokkaido: "北海道",
  tohoku: "東北",
  kanto: "関東",
  chubu: "中部",
  kinki: "近畿",
  chugoku: "中国",
  shikoku: "四国",
  kyushu: "九州・沖縄",
};
