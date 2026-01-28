// Re-export all data with explicit naming to avoid conflicts
export {
  PREFECTURES,
  getPrefecture,
  getPrefecturesByBlock,
  getPrefecturesByRegion,
  TOTAL_DISTRICTS,
} from "./prefectures";

export {
  DISTRICTS,
  getDistrict,
  getDistrictsByPrefecture,
  getDistrictsByBlock,
} from "./districts";

export {
  PROPORTIONAL_BLOCKS,
  getBlock,
  TOTAL_PROPORTIONAL_SEATS,
  TOTAL_SEATS,
  MAJORITY_THRESHOLD,
} from "./blocks";

export {
  PARTIES,
  getParty,
  getPartyColor,
} from "./parties";

export {
  CANDIDATES_2026,
  getCandidatesByDistrict,
  getCandidatesByParty,
  getCandidatesByPrefecture,
} from "./candidates/2026";

// Additional constants
export const ELECTION_YEAR = 2026;
export const ELECTION_NAME = "第51回衆議院議員総選挙";
export const DISTRICT_SEATS = 289;
export const PROPORTIONAL_SEATS = 176;
