import { Party } from "@/types";

export const PARTIES: Party[] = [
  {
    id: "ldp",
    name: "自由民主党",
    nameEn: "Liberal Democratic Party",
    shortName: "自民",
    color: "#e31e26",
    ideology: { economic: 60, social: 30, diplomatic: 70 },
  },
  {
    id: "chudou",
    name: "中道改革連合",
    nameEn: "Chudou Reform Alliance",
    shortName: "中道",
    color: "#00a0e9",
    ideology: { economic: 20, social: 50, diplomatic: 40 },
  },
  {
    id: "ishin",
    name: "日本維新の会",
    nameEn: "Japan Innovation Party",
    shortName: "維新",
    color: "#38b649",
    ideology: { economic: 70, social: 40, diplomatic: 50 },
  },
  {
    id: "dpfp",
    name: "国民民主党",
    nameEn: "Democratic Party for the People",
    shortName: "国民",
    color: "#f39800",
    ideology: { economic: 30, social: 55, diplomatic: 45 },
  },
  {
    id: "sanseito",
    name: "参政党",
    nameEn: "Sanseito",
    shortName: "参政",
    color: "#ff6600",
    ideology: { economic: 50, social: 20, diplomatic: 30 },
  },
  {
    id: "jcp",
    name: "日本共産党",
    nameEn: "Japanese Communist Party",
    shortName: "共産",
    color: "#c71c22",
    ideology: { economic: -80, social: 80, diplomatic: -40 },
  },
  {
    id: "reiwa",
    name: "れいわ新選組",
    nameEn: "Reiwa Shinsengumi",
    shortName: "れいわ",
    color: "#ed6d9b",
    ideology: { economic: -70, social: 70, diplomatic: 20 },
  },
  {
    id: "shamin",
    name: "社会民主党",
    nameEn: "Social Democratic Party",
    shortName: "社民",
    color: "#e85298",
    ideology: { economic: -60, social: 75, diplomatic: -20 },
  },
  {
    id: "independent",
    name: "無所属",
    nameEn: "Independent",
    shortName: "無",
    color: "#6b7280",
  },
  {
    id: "other",
    name: "その他",
    nameEn: "Other",
    shortName: "他",
    color: "#9ca3af",
  },
];

export const getParty = (id: string): Party => {
  return PARTIES.find((p) => p.id === id) ?? PARTIES[PARTIES.length - 1];
};

export const getPartyColor = (id: string): string => {
  return getParty(id).color;
};
