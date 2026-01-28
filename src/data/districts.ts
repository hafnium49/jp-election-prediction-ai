import { District } from "@/types";
import { PREFECTURES } from "./prefectures";

// Generate districts for each prefecture
function generateDistricts(): District[] {
  const districts: District[] = [];

  for (const prefecture of PREFECTURES) {
    for (let i = 1; i <= prefecture.districtCount; i++) {
      districts.push({
        id: `${prefecture.id}-${i}`,
        prefectureId: prefecture.id,
        number: i,
        name: `${prefecture.name}第${i}区`,
        municipalities: [], // To be filled with actual municipality data
      });
    }
  }

  return districts;
}

export const DISTRICTS: District[] = generateDistricts();

export const getDistrict = (id: string): District | undefined => {
  return DISTRICTS.find((d) => d.id === id);
};

export const getDistrictsByPrefecture = (prefectureId: string): District[] => {
  return DISTRICTS.filter((d) => d.prefectureId === prefectureId);
};

export const getDistrictsByBlock = (blockId: string): District[] => {
  const prefectureIds = PREFECTURES
    .filter((p) => p.proportionalBlockId === blockId)
    .map((p) => p.id);
  return DISTRICTS.filter((d) => prefectureIds.includes(d.prefectureId));
};

// Total: 289 districts
export const TOTAL_DISTRICTS = DISTRICTS.length;
