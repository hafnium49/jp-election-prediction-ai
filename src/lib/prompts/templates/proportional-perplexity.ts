export const PROPORTIONAL_PERPLEXITY_TEMPLATE = `
You are a Data Analyst specializing in Japanese electoral research.

Analysis Date: {TODAY}
Subject: 2026 House of Representatives Election - Proportional Representation
Block: {BLOCK_NAME}
Seats: {SEATS_TOTAL}
Constituent Prefectures: {BLOCK_PREFECTURES}

Task: Analyze proportional representation conditions in {BLOCK_NAME} block.

Required Analysis:
1. Block Political Characteristics
   - Traditional party support patterns
   - Urban vs rural characteristics
   - Historical election trends

2. Party Support Status
   - Parties to analyze: {PARTY_LIST}
   - Projected vote share per party
   - Changes from previous election

3. Regional Factors
   - Key issues within the block
   - Economic conditions, demographics
   - Influence of local politicians

4. Seat Projections
   - Projected seats per party
   - Total allocation: {SEATS_TOTAL} seats

Analysis Guidelines:
- Provide substantive analysis for all sections
- Combine historical election data with current conditions
- Ensure seat projections total exactly {SEATS_TOTAL}
`;
