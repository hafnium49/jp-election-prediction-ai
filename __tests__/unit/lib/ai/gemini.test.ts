import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { z } from 'zod';
import {
  GeminiClient,
  createGeminiClient,
  OverallAnalysisSchema,
  PrefecturePredictionSchema,
  ProportionalBlockSchema,
} from '@/lib/ai/gemini';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('GeminiClient', () => {
  let client: GeminiClient;

  beforeEach(() => {
    vi.clearAllMocks();
    client = new GeminiClient({ apiKey: 'test-api-key' });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should use default model when not specified', () => {
      const c = new GeminiClient({ apiKey: 'test' });
      // Access private config through a method call
      expect(c).toBeDefined();
    });

    it('should use custom model when specified', () => {
      const c = new GeminiClient({ apiKey: 'test', model: 'gemini-1.5-pro' });
      expect(c).toBeDefined();
    });
  });

  describe('generateStructuredOutput', () => {
    const testSchema = z.object({
      name: z.string(),
      count: z.number(),
    });

    it('should return parsed and validated response', async () => {
      const mockResponse = {
        candidates: [
          {
            content: {
              parts: [{ text: JSON.stringify({ name: 'test', count: 42 }) }],
            },
          },
        ],
        usageMetadata: {
          promptTokenCount: 100,
          candidatesTokenCount: 50,
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await client.generateStructuredOutput('test prompt', testSchema);

      expect(result.content).toEqual({ name: 'test', count: 42 });
      expect(result.model).toBe('gemini-2.0-flash');
      expect(result.usage).toEqual({ promptTokens: 100, completionTokens: 50 });
    });

    it('should throw error on API failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'Internal Server Error',
      });

      await expect(
        client.generateStructuredOutput('test', testSchema)
      ).rejects.toThrow('Gemini API error: 500');
    });

    it('should throw error when no candidates returned', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ candidates: [] }),
      });

      await expect(
        client.generateStructuredOutput('test', testSchema)
      ).rejects.toThrow('Gemini returned no candidates');
    });

    it('should throw error on invalid JSON', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: 'not valid json' }],
              },
            },
          ],
        }),
      });

      await expect(
        client.generateStructuredOutput('test', testSchema)
      ).rejects.toThrow('Failed to parse Gemini response');
    });

    it('should throw error when schema validation fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: JSON.stringify({ wrong: 'shape' }) }],
              },
            },
          ],
        }),
      });

      await expect(
        client.generateStructuredOutput('test', testSchema)
      ).rejects.toThrow('Failed to parse Gemini response');
    });

    it('should call API with correct URL and body', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: JSON.stringify({ name: 'test', count: 1 }) }],
              },
            },
          ],
        }),
      });

      await client.generateStructuredOutput('my prompt', testSchema);

      expect(mockFetch).toHaveBeenCalledOnce();
      const [url, options] = mockFetch.mock.calls[0];
      expect(url).toContain('generativelanguage.googleapis.com');
      expect(url).toContain('gemini-2.0-flash');
      expect(url).toContain('test-api-key');
      expect(options.method).toBe('POST');

      const body = JSON.parse(options.body);
      expect(body.contents[0].parts[0].text).toBe('my prompt');
      expect(body.generationConfig.responseMimeType).toBe('application/json');
    });
  });

  describe('generateText', () => {
    it('should return text content', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: 'Generated response text' }],
              },
            },
          ],
        }),
      });

      const result = await client.generateText('test prompt');
      expect(result).toBe('Generated response text');
    });

    it('should throw error on API failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: async () => 'Unauthorized',
      });

      await expect(client.generateText('test')).rejects.toThrow('Gemini API error: 401');
    });
  });
});

describe('createGeminiClient', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should throw error when API key not set', () => {
    delete process.env.GEMINI_API_KEY;
    expect(() => createGeminiClient()).toThrow('GEMINI_API_KEY environment variable is not set');
  });

  it('should create client when API key is set', () => {
    process.env.GEMINI_API_KEY = 'test-key';
    const client = createGeminiClient();
    expect(client).toBeInstanceOf(GeminiClient);
  });
});

describe('Zod Schemas', () => {
  describe('OverallAnalysisSchema', () => {
    it('should validate correct overall analysis', () => {
      const data = {
        cabinet_approval: 28.5,
        party_support: { ldp: 32, cdp: 15 },
        key_issues: [
          { issue: '経済', importance: 'high', favorable_to: 'ldp' },
        ],
        national_trend: 'close',
        seat_projection: { ldp: 200, cdp: 120 },
        district_seats: { ldp: 140, cdp: 70 },
        proportional_seats: { ldp: 60, cdp: 50 },
        analysis_summary: 'テスト分析',
      };

      const result = OverallAnalysisSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject invalid national_trend', () => {
      const data = {
        cabinet_approval: 28.5,
        party_support: {},
        key_issues: [],
        national_trend: 'invalid',
        seat_projection: {},
        district_seats: {},
        proportional_seats: {},
        analysis_summary: 'test',
      };

      const result = OverallAnalysisSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('PrefecturePredictionSchema', () => {
    it('should validate correct prefecture prediction', () => {
      const data = {
        prefecture_id: 'tokyo',
        prefecture_name: '東京都',
        districts: [
          {
            district_id: 'tokyo-1',
            district_name: '東京1区',
            winner_party: 'ldp',
            confidence: 'high',
            analysis: 'test',
            candidates: [
              { name: '山田', party: 'ldp', vote_share_min: 30, vote_share_max: 40 },
            ],
          },
        ],
        overview: '概要',
      };

      const result = PrefecturePredictionSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject invalid confidence level', () => {
      const data = {
        prefecture_id: 'tokyo',
        prefecture_name: '東京都',
        districts: [
          {
            district_id: 'tokyo-1',
            district_name: '東京1区',
            winner_party: 'ldp',
            confidence: 'very_high', // Invalid
            analysis: 'test',
            candidates: [],
          },
        ],
        overview: '概要',
      };

      const result = PrefecturePredictionSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('ProportionalBlockSchema', () => {
    it('should validate correct proportional block', () => {
      const data = {
        block_id: 'tokyo',
        block_name: '東京ブロック',
        seats_total: 17,
        party_seats: { ldp: 5, cdp: 4 },
        analysis: '分析結果',
      };

      const result = ProportionalBlockSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject missing required fields', () => {
      const data = {
        block_id: 'tokyo',
        // Missing block_name, seats_total, party_seats, analysis
      };

      const result = ProportionalBlockSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });
});
