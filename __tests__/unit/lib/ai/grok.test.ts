import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GrokClient, createGrokClient } from '@/lib/ai/grok';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('GrokClient', () => {
  let client: GrokClient;

  beforeEach(() => {
    vi.clearAllMocks();
    client = new GrokClient({ apiKey: 'test-api-key' });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should use default model when not specified', () => {
      const c = new GrokClient({ apiKey: 'test' });
      expect(c).toBeDefined();
    });

    it('should use custom model when specified', () => {
      const c = new GrokClient({ apiKey: 'test', model: 'grok-3' });
      expect(c).toBeDefined();
    });
  });

  describe('analyzeXSentiment', () => {
    it('should return parsed response with content', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: 'X上では自民党への批判が増加しています。',
            },
          },
        ],
        model: 'grok-3-fast',
        usage: {
          prompt_tokens: 100,
          completion_tokens: 120,
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await client.analyzeXSentiment('自民党への反応は？');

      expect(result.content).toBe('X上では自民党への批判が増加しています。');
      expect(result.model).toBe('grok-3-fast');
      expect(result.usage).toEqual({ promptTokens: 100, completionTokens: 120 });
    });

    it('should handle response without usage', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: 'test content',
            },
          },
        ],
        model: 'grok-3-fast',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await client.analyzeXSentiment('test');

      expect(result.usage).toBeUndefined();
    });

    it('should handle null content', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: null,
              tool_calls: [],
            },
          },
        ],
        model: 'grok-3-fast',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await client.analyzeXSentiment('test');

      expect(result.content).toBe('');
    });

    it('should throw error on API failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'Internal Server Error',
      });

      await expect(client.analyzeXSentiment('test')).rejects.toThrow('Grok API error: 500');
    });

    it('should throw error on 401 Unauthorized', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: async () => 'Invalid API key',
      });

      await expect(client.analyzeXSentiment('test')).rejects.toThrow('Grok API error: 401');
    });

    it('should call API with correct headers and body when X search enabled', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: 'test' } }],
          model: 'grok-3-fast',
        }),
      });

      await client.analyzeXSentiment('my search prompt', true);

      expect(mockFetch).toHaveBeenCalledOnce();
      const [url, options] = mockFetch.mock.calls[0];

      expect(url).toBe('https://api.x.ai/v1/chat/completions');
      expect(options.method).toBe('POST');
      expect(options.headers['Authorization']).toBe('Bearer test-api-key');
      expect(options.headers['Content-Type']).toBe('application/json');

      const body = JSON.parse(options.body);
      expect(body.model).toBe('grok-3-fast');
      expect(body.messages).toHaveLength(2);
      expect(body.messages[0].role).toBe('system');
      expect(body.messages[1].role).toBe('user');
      expect(body.messages[1].content).toBe('my search prompt');
      expect(body.tools).toBeDefined();
      expect(body.tools).toHaveLength(1);
      expect(body.tools[0].function.name).toBe('x_search');
    });

    it('should call API without tools when X search disabled', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: 'test' } }],
          model: 'grok-3-fast',
        }),
      });

      await client.analyzeXSentiment('my search prompt', false);

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.tools).toBeUndefined();
    });

    it('should use custom model in API call', async () => {
      const customClient = new GrokClient({
        apiKey: 'test',
        model: 'grok-3',
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: 'test' } }],
          model: 'grok-3',
        }),
      });

      await customClient.analyzeXSentiment('test');

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.model).toBe('grok-3');
    });

    it('should handle tool calls in response', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: 'Analysis complete',
              tool_calls: [
                {
                  id: 'call_1',
                  function: {
                    name: 'x_search',
                    arguments: '{"query": "自民党"}',
                  },
                },
              ],
            },
          },
        ],
        model: 'grok-3-fast',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await client.analyzeXSentiment('test');

      expect(result.content).toBe('Analysis complete');
      // xPosts should be undefined or empty since we don't actually process tool results
      expect(result.xPosts).toBeUndefined();
    });
  });
});

describe('createGrokClient', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should throw error when API key not set', () => {
    delete process.env.XAI_API_KEY;
    expect(() => createGrokClient()).toThrow(
      'XAI_API_KEY environment variable is not set'
    );
  });

  it('should create client when API key is set', () => {
    process.env.XAI_API_KEY = 'test-key';
    const client = createGrokClient();
    expect(client).toBeInstanceOf(GrokClient);
  });
});
