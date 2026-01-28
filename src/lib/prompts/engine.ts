import { District, Candidate, Prefecture, ProportionalBlock } from "@/types";
import { getParty } from "@/data/parties";

export interface TemplateVariables {
  TODAY: string;
  PREFECTURE?: string;
  PREFECTURE_ID?: string;
  DISTRICT_COUNT?: number;
  DISTRICT_LIST?: string;
  CANDIDATES_SECTION?: string;
  BLOCK_NAME?: string;
  BLOCK_ID?: string;
  SEATS_TOTAL?: number;
  BLOCK_PREFECTURES?: string;
  PERPLEXITY_REPORT?: string;
  GROK_REPORT?: string;
  OVERALL_SECTION?: string;
  PARTY_LIST?: string;
}

/**
 * Replace template variables in a prompt string
 */
export function renderTemplate(
  template: string,
  variables: TemplateVariables
): string {
  let result = template;

  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{${key}}`;
    result = result.replaceAll(placeholder, String(value ?? ""));
  }

  return result;
}

/**
 * Format date as Japanese date string
 */
export function formatDate(date: Date = new Date()): string {
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Build candidates section for prompt
 */
export function buildCandidatesSection(
  candidates: Candidate[],
  districts: District[]
): string {
  const byDistrict = new Map<string, Candidate[]>();

  for (const candidate of candidates) {
    if (!candidate.districtId) continue;
    const existing = byDistrict.get(candidate.districtId) || [];
    existing.push(candidate);
    byDistrict.set(candidate.districtId, existing);
  }

  return districts
    .map((d) => {
      const districtCandidates = byDistrict.get(d.id) || [];
      if (districtCandidates.length === 0) {
        return `${d.name}: 候補者情報なし`;
      }
      const candidateList = districtCandidates
        .map((c) => `${c.name}（${getParty(c.partyId).shortName}）`)
        .join("、");
      return `${d.name}: ${candidateList}`;
    })
    .join("\n");
}

/**
 * Build district list string
 */
export function buildDistrictList(districts: District[]): string {
  return districts.map((d) => d.name).join("、");
}

/**
 * Build party list for context
 */
export function buildPartyList(): string {
  const parties = [
    "自由民主党（自民）",
    "中道改革連合（中道）",
    "日本維新の会（維新）",
    "国民民主党（国民）",
    "参政党（参政）",
    "日本共産党（共産）",
    "れいわ新選組（れいわ）",
    "社会民主党（社民）",
    "無所属",
  ];
  return parties.join("、");
}

/**
 * Build variables for overall analysis
 */
export function buildOverallVariables(): TemplateVariables {
  return {
    TODAY: formatDate(),
    PARTY_LIST: buildPartyList(),
  };
}

/**
 * Build variables for prefecture analysis
 */
export function buildPrefectureVariables(
  prefecture: Prefecture,
  districts: District[],
  candidates: Candidate[]
): TemplateVariables {
  return {
    TODAY: formatDate(),
    PREFECTURE: prefecture.name,
    PREFECTURE_ID: prefecture.id,
    DISTRICT_COUNT: districts.length,
    DISTRICT_LIST: buildDistrictList(districts),
    CANDIDATES_SECTION: buildCandidatesSection(candidates, districts),
    PARTY_LIST: buildPartyList(),
  };
}

/**
 * Build variables for proportional block analysis
 */
export function buildBlockVariables(
  block: ProportionalBlock,
  prefectures: Prefecture[]
): TemplateVariables {
  return {
    TODAY: formatDate(),
    BLOCK_NAME: block.name,
    BLOCK_ID: block.id,
    SEATS_TOTAL: block.seats,
    BLOCK_PREFECTURES: prefectures.map((p) => p.name).join("、"),
    PARTY_LIST: buildPartyList(),
  };
}
