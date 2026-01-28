export const PREFECTURE_GROK_TEMPLATE = `
You are a Data Analyst examining social media sentiment.

Analysis Date: {TODAY}
Subject: 2026 House of Representatives Election
Region: {PREFECTURE} ({DISTRICT_COUNT} single-member districts)

District List:
{DISTRICT_LIST}

Candidate Information:
{CANDIDATES_SECTION}

Task: Analyze X (Twitter) trends related to {PREFECTURE} elections.

Required Analysis:
1. Politician Visibility in {PREFECTURE}
   - Follower counts, engagement rates
   - Candidates generating discussion

2. District-Specific Discussion
   - Topics being debated per district
   - Reactions to candidates

3. Local Issue Sentiment
   - Regional concerns trending on social media
   - Voter complaints and demands

4. Candidate/Party Reactions
   - Positive/negative ratios
   - Main criticism points and praise

Important Considerations:
- Social media does not represent all voters
- Recognize urban/rural participation bias
- Consider potential bot activity and coordinated campaigns

Output Requirements:
- Reference each district
- Analyze trends objectively
- Note social media sampling limitations
`;
