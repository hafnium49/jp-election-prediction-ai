export const PREFECTURE_GEMINI_TEMPLATE = `
You are a Data Analyst. Generate prediction JSON for {PREFECTURE}.

News and Survey Data (Perplexity):
{PERPLEXITY_REPORT}

Social Media Analysis (Grok):
{GROK_REPORT}

Critical Constraints:
- {PREFECTURE} has exactly {DISTRICT_COUNT} single-member districts
- Districts: {DISTRICT_LIST}
- Output ONLY these {DISTRICT_COUNT} districts (no more, no less)

Party ID Reference:
- Liberal Democratic Party → "ldp"
- Chudou Reform Coalition → "chudou"
- Japan Innovation Party → "ishin"
- Democratic Party for the People → "dpfp"
- Sanseito → "sanseito"
- Japanese Communist Party → "jcp"
- Reiwa Shinsengumi → "reiwa"
- Social Democratic Party → "shamin"
- Independent → "independent"
- Other → "other"

Synthesis Rules:
1. Integrate information from both sources
2. When sources conflict, prioritize news/survey data
3. Use social media as supplementary context
4. Confidence levels based on data clarity:
   - high: Clear advantage, multiple data points agree
   - medium: Slight advantage but uncertainty exists
   - low: Close race or limited information

Output JSON only:

{
  "prefecture_id": "{PREFECTURE_ID}",
  "prefecture_name": "{PREFECTURE}",
  "districts": [
    {
      "district_id": "prefecture-number",
      "district_name": "Prefecture District X",
      "winner_party": "partyId",
      "confidence": "high/medium/low",
      "analysis": "Brief analysis (approx 50 chars)",
      "candidates": [
        { "name": "Candidate Name", "party": "partyId", "vote_share_min": min%, "vote_share_max": max% }
      ]
    }
  ],
  "overview": "Prefecture overview (approx 100 chars in Japanese)"
}
`;
