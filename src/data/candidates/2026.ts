import { Candidate } from "@/types";

// Candidate data for the 2026 House of Representatives election
// This should be populated with actual candidate information from official filings

export const CANDIDATES_2026: Candidate[] = [
  // Sample candidates - to be replaced with actual data
  // Hokkaido 1st district
  {
    id: "hokkaido-1-ldp",
    name: "サンプル太郎",
    nameKana: "サンプルタロウ",
    partyId: "ldp",
    districtId: "hokkaido-1",
    status: "incumbent",
  },
  {
    id: "hokkaido-1-chudou",
    name: "サンプル花子",
    nameKana: "サンプルハナコ",
    partyId: "chudou",
    districtId: "hokkaido-1",
    status: "new",
  },
];

export const getCandidatesByDistrict = (districtId: string): Candidate[] => {
  return CANDIDATES_2026.filter((c) => c.districtId === districtId);
};

export const getCandidatesByParty = (partyId: string): Candidate[] => {
  return CANDIDATES_2026.filter((c) => c.partyId === partyId);
};

export const getCandidatesByPrefecture = (prefectureId: string): Candidate[] => {
  return CANDIDATES_2026.filter(
    (c) => c.districtId?.startsWith(prefectureId + "-") ?? false
  );
};
