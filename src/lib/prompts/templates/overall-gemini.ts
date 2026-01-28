export const OVERALL_GEMINI_TEMPLATE = `
You are a Data Analyst. Synthesize the following reports into structured JSON.

News and Survey Data (Perplexity):
{PERPLEXITY_REPORT}

Social Media Analysis (Grok):
{GROK_REPORT}

Synthesis Rules:
1. Integrate information from both sources
2. When sources conflict, prioritize news/survey data
3. Use social media insights as supplementary context
4. Apply reasonable estimates when specific figures are unavailable

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

Seat Constraints:
- Single-member districts: 289 total
- Proportional representation: 176 total
- Total seats: 465
- Majority threshold: 233

Output JSON only, following this schema:

{
  "cabinet_approval": number (percentage),
  "party_support": { "partyId": percentage },
  "key_issues": [
    { "issue": "name", "importance": "high/medium/low", "favorable_to": "partyId" }
  ],
  "national_trend": "ruling_advantage/opposition_advantage/close",
  "seat_projection": { "partyId": projected_seats },
  "district_seats": { "partyId": district_seat_count },
  "proportional_seats": { "partyId": proportional_seat_count },
  "analysis_summary": "Summary in Japanese (approximately 200 characters)"
}
`;
