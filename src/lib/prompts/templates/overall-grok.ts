export const OVERALL_GROK_TEMPLATE = `
You are a Data Analyst examining social media sentiment.

Analysis Date: {TODAY}
Subject: 51st Japanese House of Representatives Election (2026)

Task: Analyze election-related trends on X (Twitter).

Required Analysis:
1. Party Engagement Metrics
   - Parties to analyze: {PARTY_LIST}
   - Mention frequency and engagement trends

2. Trending Politicians
   - Politicians generating discussion
   - Sentiment ratio (positive/negative)

3. Hashtag Analysis
   - Popular election-related hashtags
   - Emerging trends

4. Voter Concerns
   - Policy topics under active discussion
   - Areas of criticism or controversy

5. Party Sentiment Summary
   - Positive/negative ratio per party
   - Main praise points and criticisms

Important Considerations:
- Social media does not represent all voters
- Consider potential bot activity and coordinated campaigns
- Note influencer effects on discourse
- Recognize urban/rural participation bias

Output Requirements:
- Include specific metrics where available
- Maintain analytical objectivity
- Note social media sampling limitations
`;
