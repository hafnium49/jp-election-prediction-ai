// Mock responses for AI API clients

export const mockPerplexityResponse = {
  id: 'mock-perplexity-id',
  model: 'llama-3.1-sonar-small-128k-online',
  object: 'chat.completion',
  created: 1706000000,
  choices: [
    {
      index: 0,
      message: {
        role: 'assistant',
        content: '最新の世論調査によると、自民党の支持率は32%、立憲民主党は15%となっています。岸田内閣の支持率は28%で前月比2ポイント減少しました。',
      },
      finish_reason: 'stop',
    },
  ],
  citations: [
    'https://example.com/poll1',
    'https://example.com/poll2',
  ],
  usage: {
    prompt_tokens: 100,
    completion_tokens: 150,
    total_tokens: 250,
  },
};

export const mockGrokResponse = {
  id: 'mock-grok-id',
  object: 'chat.completion',
  created: 1706000000,
  model: 'grok-3-mini',
  choices: [
    {
      index: 0,
      message: {
        role: 'assistant',
        content: 'X上では自民党への批判的な投稿が増加傾向にあります。特に政治資金問題に関する言及が多く見られます。野党への期待感も一部で高まっています。',
      },
      finish_reason: 'stop',
    },
  ],
  usage: {
    prompt_tokens: 100,
    completion_tokens: 120,
    total_tokens: 220,
  },
};

export const mockGeminiOverallResponse = {
  cabinet_approval: 28.5,
  party_support: {
    ldp: 32,
    cdp: 15,
    ishin: 8,
    komei: 5,
    dpfp: 4,
    jcp: 3,
    reiwa: 2,
    others: 5,
    undecided: 26,
  },
  key_issues: [
    {
      issue: '経済政策',
      importance: 'high',
      favorable_to: 'ldp',
    },
    {
      issue: '政治資金問題',
      importance: 'high',
      favorable_to: 'opposition',
    },
  ],
  national_trend: 'close' as const,
  seat_projection: {
    ldp: 200,
    cdp: 120,
    ishin: 45,
    komei: 30,
    dpfp: 25,
    jcp: 15,
    reiwa: 10,
    others: 20,
  },
  district_seats: {
    ldp: 140,
    cdp: 70,
    ishin: 25,
    komei: 10,
    dpfp: 15,
    jcp: 5,
    reiwa: 4,
    others: 20,
  },
  proportional_seats: {
    ldp: 60,
    cdp: 50,
    ishin: 20,
    komei: 20,
    dpfp: 10,
    jcp: 10,
    reiwa: 6,
    others: 0,
  },
  analysis_summary: '与野党伯仲の展開が予想される。自民党は政治資金問題の影響で議席減が見込まれるが、過半数維持は可能な情勢。',
};

export const mockGeminiPrefectureResponse = {
  prefecture_id: 'tokyo',
  prefecture_name: '東京都',
  districts: [
    {
      district_id: 'tokyo-1',
      district_name: '東京1区',
      winner_party: 'ldp',
      confidence: 'medium' as const,
      analysis: '現職の強みがあるが、野党候補も善戦。接戦区。',
      candidates: [
        {
          name: '山田太郎',
          party: 'ldp',
          vote_share_min: 35,
          vote_share_max: 42,
        },
        {
          name: '鈴木花子',
          party: 'cdp',
          vote_share_min: 32,
          vote_share_max: 40,
        },
      ],
    },
  ],
  regional_trend: 'close' as const,
  turnout_estimate: 55,
  key_battlegrounds: ['tokyo-1', 'tokyo-7', 'tokyo-15'],
};

export const mockGeminiProportionalResponse = {
  block_id: 'tokyo',
  block_name: '東京ブロック',
  seats_total: 17,
  party_seats: {
    ldp: 5,
    cdp: 4,
    ishin: 2,
    komei: 3,
    dpfp: 1,
    jcp: 1,
    reiwa: 1,
    others: 0,
  },
  vote_share_estimates: {
    ldp: 28,
    cdp: 22,
    ishin: 12,
    komei: 15,
    dpfp: 8,
    jcp: 7,
    reiwa: 5,
    others: 3,
  },
  analysis: '都市部では野党が比較的強く、自民党は議席を減らす見込み。',
};

// Mock fetch function factory
export function createMockFetch(responses: Record<string, unknown>) {
  return async (url: string | URL, options?: RequestInit): Promise<Response> => {
    const urlStr = url.toString();

    let responseData: unknown;

    if (urlStr.includes('perplexity')) {
      responseData = responses.perplexity ?? mockPerplexityResponse;
    } else if (urlStr.includes('x.ai') || urlStr.includes('grok')) {
      responseData = responses.grok ?? mockGrokResponse;
    } else if (urlStr.includes('generativelanguage.googleapis.com')) {
      responseData = responses.gemini ?? { candidates: [{ content: { parts: [{ text: JSON.stringify(mockGeminiOverallResponse) }] } }] };
    } else {
      responseData = { error: 'Unknown API endpoint' };
    }

    return {
      ok: true,
      status: 200,
      json: async () => responseData,
      text: async () => JSON.stringify(responseData),
    } as Response;
  };
}
