import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PerplexityClient, createPerplexityClient } from '@/lib/ai/perplexity';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('PerplexityClient', () => {
  let client: PerplexityClient;

  beforeEach(() => {
    vi.clearAllMocks();
    client = new PerplexityClient({ apiKey: 'test-api-key' });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should use default model when not specified', () => {
      const c = new PerplexityClient({ apiKey: 'test' });
      expect(c).toBeDefined();
    });

    it('should use custom model when specified', () => {
      const c = new PerplexityClient({ apiKey: 'test', model: 'sonar-reasoning' });
      expect(c).toBeDefined();
    });

    it('should use custom maxTokens when specified', () => {
      const c = new PerplexityClient({ apiKey: 'test', maxTokens: 8192 });
      expect(c).toBeDefined();
    });
  });

  describe('search', () => {
    it('should return parsed response with content and citations', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: '自民党の支持率は32%です。',
            },
          },
        ],
        citations: ['https://example.com/poll1', 'https://example.com/poll2'],
        model: 'sonar-pro',
        usage: {
          prompt_tokens: 100,
          completion_tokens: 150,
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await client.search('最新の世論調査は？');

      expect(result.content).toBe('自民党の支持率は32%です。');
      expect(result.citations).toHaveLength(2);
      expect(result.citations).toContain('https://example.com/poll1');
      expect(result.model).toBe('sonar-pro');
      expect(result.usage).toEqual({ promptTokens: 100, completionTokens: 150 });
    });

    it('should handle response without citations', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: 'Response without citations',
            },
          },
        ],
        model: 'sonar-pro',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await client.search('test');

      expect(result.content).toBe('Response without citations');
      expect(result.citations).toEqual([]);
    });

    it('should handle response without usage', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: 'test',
            },
          },
        ],
        model: 'sonar-pro',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await client.search('test');

      expect(result.usage).toBeUndefined();
    });

    it('should throw error on API failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        text: async () => 'Rate limit exceeded',
      });

      await expect(client.search('test')).rejects.toThrow('Perplexity API error: 429');
    });

    it('should throw error on 401 Unauthorized', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: async () => 'Invalid API key',
      });

      await expect(client.search('test')).rejects.toThrow('Perplexity API error: 401');
    });

    it('should call API with correct headers and body', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: 'test' } }],
          model: 'sonar-pro',
        }),
      });

      await client.search('my search prompt');

      expect(mockFetch).toHaveBeenCalledOnce();
      const [url, options] = mockFetch.mock.calls[0];

      expect(url).toBe('https://api.perplexity.ai/chat/completions');
      expect(options.method).toBe('POST');
      expect(options.headers['Authorization']).toBe('Bearer test-api-key');
      expect(options.headers['Content-Type']).toBe('application/json');

      const body = JSON.parse(options.body);
      expect(body.model).toBe('sonar-pro');
      expect(body.messages).toHaveLength(2);
      expect(body.messages[0].role).toBe('system');
      expect(body.messages[1].role).toBe('user');
      expect(body.messages[1].content).toBe('my search prompt');
      expect(body.return_citations).toBe(true);
      expect(body.search_recency_filter).toBe('week');
    });

    it('should use custom model in API call', async () => {
      const customClient = new PerplexityClient({
        apiKey: 'test',
        model: 'sonar-reasoning-pro',
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: 'test' } }],
          model: 'sonar-reasoning-pro',
        }),
      });

      await customClient.search('test');

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.model).toBe('sonar-reasoning-pro');
    });
  });
});

describe('createPerplexityClient', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should throw error when API key not set', () => {
    delete process.env.PERPLEXITY_API_KEY;
    expect(() => createPerplexityClient()).toThrow(
      'PERPLEXITY_API_KEY environment variable is not set'
    );
  });

  it('should create client when API key is set', () => {
    process.env.PERPLEXITY_API_KEY = 'test-key';
    const client = createPerplexityClient();
    expect(client).toBeInstanceOf(PerplexityClient);
  });
});
