// Prefecture types
export interface Prefecture {
  id: string;
  name: string;
  nameEn: string;
  region: Region;
  districtCount: number;
  proportionalBlockId: string;
}

export type Region =
  | "hokkaido"
  | "tohoku"
  | "kanto"
  | "chubu"
  | "kinki"
  | "chugoku"
  | "shikoku"
  | "kyushu";

// District types
export interface District {
  id: string;
  prefectureId: string;
  number: number;
  name: string;
  municipalities: string[];
}

// Proportional block types
export interface ProportionalBlock {
  id: string;
  name: string;
  nameEn: string;
  seats: number;
  prefectureIds: string[];
}

// Party types
export interface Party {
  id: string;
  name: string;
  nameEn: string;
  shortName: string;
  color: string;
  ideology?: {
    economic: number; // -100 (left) to +100 (right)
    social: number;
    diplomatic: number;
  };
}

// Candidate types
export interface Candidate {
  id: string;
  name: string;
  nameKana?: string;
  partyId: string;
  districtId: string | null; // null for PR-only
  proportionalBlockId?: string;
  proportionalRank?: number;
  status: "incumbent" | "former" | "new";
  age?: number;
  previousVoteShare?: number;
}

// Prediction types
export interface DistrictPredictionData {
  districtId: string;
  districtName: string;
  winnerPartyId: string;
  winnerId?: string;
  confidence: "high" | "medium" | "low";
  analysis: string;
  candidates: CandidatePrediction[];
}

export interface CandidatePrediction {
  name: string;
  partyId: string;
  voteShareEstimate: {
    min: number;
    max: number;
  };
}

export interface ProportionalPredictionData {
  blockId: string;
  blockName: string;
  seatsTotal: number;
  partySeats: Record<string, number>;
  analysis: string;
}

export interface OverallPredictionData {
  cabinetApproval: number;
  partySupport: Record<string, number>;
  keyIssues: Array<{
    issue: string;
    importance: "high" | "medium" | "low";
    favorableTo: string;
  }>;
  nationalTrend: "ruling_advantage" | "opposition_advantage" | "close";
  seatProjection: Record<string, number>;
  districtSeats: Record<string, number>;
  proportionalSeats: Record<string, number>;
}

// API response types
export interface PredictionResponse {
  updatedAt: string;
  overall: OverallPredictionData;
  prefectures: Record<string, DistrictPredictionData[]>;
  proportional: Record<string, ProportionalPredictionData>;
}
