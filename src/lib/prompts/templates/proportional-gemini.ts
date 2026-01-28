export const PROPORTIONAL_GEMINI_TEMPLATE = `
You are a Data Analyst. Generate proportional block prediction JSON for {BLOCK_NAME}.

News and Survey Data (Perplexity):
{PERPLEXITY_REPORT}

Social Media Analysis (Grok):
{GROK_REPORT}

Block Information:
- Block Name: {BLOCK_NAME}
- Block ID: {BLOCK_ID}
- Total Seats: {SEATS_TOTAL}
- Constituent Prefectures: {BLOCK_PREFECTURES}

Critical Constraints:
- Total seats must equal exactly {SEATS_TOTAL}
- Include all major parties (even if 0 seats)

Party ID Reference:
- Liberal Democratic Party → "ldp"
- Chudou Reform Coalition → "chudou"
- Japan Innovation Party → "ishin"
- Democratic Party for the People → "dpfp"
- Sanseito → "sanseito"
- Japanese Communist Party → "jcp"
- Reiwa Shinsengumi → "reiwa"
- Social Democratic Party → "shamin"
- Other → "other"

Synthesis Rules:
1. Integrate information from both sources
2. When sources conflict, prioritize news/survey data
3. Reference historical election results for seat allocation
4. Apply D'Hondt method logic for realistic allocations

Output JSON only:

{
  "block_id": "{BLOCK_ID}",
  "block_name": "{BLOCK_NAME}",
  "seats_total": {SEATS_TOTAL},
  "party_seats": {
    "ldp": number,
    "chudou": number,
    "ishin": number,
    "dpfp": number,
    "sanseito": number,
    "jcp": number,
    "reiwa": number,
    "shamin": number,
    "other": number
  },
  "analysis": "Block analysis (approx 100 chars in Japanese)"
}

Important: party_seats must sum to exactly {SEATS_TOTAL}.
`;
