import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  renderTemplate,
  formatDate,
  buildCandidatesSection,
  buildDistrictList,
  buildPartyList,
  buildOverallVariables,
  buildPrefectureVariables,
  buildBlockVariables,
  TemplateVariables,
} from '@/lib/prompts/engine';
import { District, Candidate, Prefecture, ProportionalBlock } from '@/types';

describe('prompt engine', () => {
  describe('renderTemplate', () => {
    it('should replace single variable', () => {
      const template = 'Hello {NAME}!';
      const variables: TemplateVariables = { TODAY: '2024年1月28日' };
      // Cast to test with any variable
      const result = renderTemplate(template, { ...variables, NAME: 'World' } as unknown as TemplateVariables);
      expect(result).toBe('Hello World!');
    });

    it('should replace multiple variables', () => {
      const template = 'Today is {TODAY}. Prefecture: {PREFECTURE}';
      const variables: TemplateVariables = {
        TODAY: '2024年1月28日',
        PREFECTURE: '東京都',
      };
      const result = renderTemplate(template, variables);
      expect(result).toBe('Today is 2024年1月28日. Prefecture: 東京都');
    });

    it('should replace same variable multiple times', () => {
      const template = '{TODAY} is {TODAY}';
      const variables: TemplateVariables = { TODAY: '2024年1月28日' };
      const result = renderTemplate(template, variables);
      expect(result).toBe('2024年1月28日 is 2024年1月28日');
    });

    it('should handle undefined variables as empty string', () => {
      const template = 'Hello {UNDEFINED}!';
      const variables: TemplateVariables = { TODAY: '2024年1月28日' };
      const result = renderTemplate(template, variables);
      expect(result).toBe('Hello {UNDEFINED}!');
    });

    it('should handle numeric values', () => {
      const template = 'Districts: {DISTRICT_COUNT}';
      const variables: TemplateVariables = {
        TODAY: '2024年1月28日',
        DISTRICT_COUNT: 30,
      };
      const result = renderTemplate(template, variables);
      expect(result).toBe('Districts: 30');
    });

    it('should preserve template when no variables match', () => {
      const template = 'No variables here';
      const variables: TemplateVariables = { TODAY: '2024年1月28日' };
      const result = renderTemplate(template, variables);
      expect(result).toBe('No variables here');
    });
  });

  describe('formatDate', () => {
    it('should format a specific date in Japanese', () => {
      const date = new Date('2024-01-28');
      const result = formatDate(date);
      expect(result).toContain('2024');
      expect(result).toContain('1');
      expect(result).toContain('28');
    });

    it('should return a string with 年月日', () => {
      const date = new Date('2024-03-15');
      const result = formatDate(date);
      expect(result).toMatch(/\d+年\d+月\d+日/);
    });

    it('should use current date when no argument provided', () => {
      const result = formatDate();
      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('buildDistrictList', () => {
    it('should join district names with Japanese comma', () => {
      const districts: District[] = [
        { id: 'tokyo-1', prefectureId: 'tokyo', number: 1, name: '東京都第1区', municipalities: [] },
        { id: 'tokyo-2', prefectureId: 'tokyo', number: 2, name: '東京都第2区', municipalities: [] },
        { id: 'tokyo-3', prefectureId: 'tokyo', number: 3, name: '東京都第3区', municipalities: [] },
      ];
      const result = buildDistrictList(districts);
      expect(result).toBe('東京都第1区、東京都第2区、東京都第3区');
    });

    it('should return single district name for one district', () => {
      const districts: District[] = [
        { id: 'tokyo-1', prefectureId: 'tokyo', number: 1, name: '東京都第1区', municipalities: [] },
      ];
      const result = buildDistrictList(districts);
      expect(result).toBe('東京都第1区');
    });

    it('should return empty string for no districts', () => {
      const result = buildDistrictList([]);
      expect(result).toBe('');
    });
  });

  describe('buildPartyList', () => {
    it('should include major parties', () => {
      const result = buildPartyList();
      expect(result).toContain('自由民主党');
      expect(result).toContain('日本維新の会');
      expect(result).toContain('日本共産党');
      expect(result).toContain('無所属');
    });

    it('should use Japanese comma separator', () => {
      const result = buildPartyList();
      expect(result).toContain('、');
    });

    it('should include party abbreviations in parentheses', () => {
      const result = buildPartyList();
      expect(result).toContain('（自民）');
      expect(result).toContain('（維新）');
      expect(result).toContain('（共産）');
    });
  });

  describe('buildCandidatesSection', () => {
    it('should format candidates by district', () => {
      const districts: District[] = [
        { id: 'tokyo-1', prefectureId: 'tokyo', number: 1, name: '東京都第1区', municipalities: [] },
      ];
      const candidates: Candidate[] = [
        { id: 'c1', name: '山田太郎', partyId: 'ldp', districtId: 'tokyo-1' },
        { id: 'c2', name: '鈴木花子', partyId: 'ishin', districtId: 'tokyo-1' },
      ];
      const result = buildCandidatesSection(candidates, districts);
      expect(result).toContain('東京都第1区');
      expect(result).toContain('山田太郎');
      expect(result).toContain('鈴木花子');
      expect(result).toContain('自民');
      expect(result).toContain('維新');
    });

    it('should show no candidates message for empty district', () => {
      const districts: District[] = [
        { id: 'tokyo-1', prefectureId: 'tokyo', number: 1, name: '東京都第1区', municipalities: [] },
      ];
      const result = buildCandidatesSection([], districts);
      expect(result).toContain('候補者情報なし');
    });

    it('should handle multiple districts', () => {
      const districts: District[] = [
        { id: 'tokyo-1', prefectureId: 'tokyo', number: 1, name: '東京都第1区', municipalities: [] },
        { id: 'tokyo-2', prefectureId: 'tokyo', number: 2, name: '東京都第2区', municipalities: [] },
      ];
      const candidates: Candidate[] = [
        { id: 'c1', name: '山田太郎', partyId: 'ldp', districtId: 'tokyo-1' },
        { id: 'c2', name: '佐藤次郎', partyId: 'jcp', districtId: 'tokyo-2' },
      ];
      const result = buildCandidatesSection(candidates, districts);
      expect(result).toContain('東京都第1区');
      expect(result).toContain('東京都第2区');
      expect(result.split('\n')).toHaveLength(2);
    });

    it('should skip candidates without districtId', () => {
      const districts: District[] = [
        { id: 'tokyo-1', prefectureId: 'tokyo', number: 1, name: '東京都第1区', municipalities: [] },
      ];
      const candidates: Candidate[] = [
        { id: 'c1', name: '山田太郎', partyId: 'ldp' }, // No districtId
      ];
      const result = buildCandidatesSection(candidates, districts);
      expect(result).toContain('候補者情報なし');
    });
  });

  describe('buildOverallVariables', () => {
    it('should include TODAY', () => {
      const result = buildOverallVariables();
      expect(result.TODAY).toBeTruthy();
      expect(result.TODAY).toMatch(/\d+年\d+月\d+日/);
    });

    it('should include PARTY_LIST', () => {
      const result = buildOverallVariables();
      expect(result.PARTY_LIST).toBeTruthy();
      expect(result.PARTY_LIST).toContain('自由民主党');
    });
  });

  describe('buildPrefectureVariables', () => {
    const mockPrefecture: Prefecture = {
      id: 'tokyo',
      name: '東京都',
      nameEn: 'Tokyo',
      region: 'kanto',
      districtCount: 30,
      proportionalBlockId: 'tokyo',
    };

    const mockDistricts: District[] = [
      { id: 'tokyo-1', prefectureId: 'tokyo', number: 1, name: '東京都第1区', municipalities: [] },
      { id: 'tokyo-2', prefectureId: 'tokyo', number: 2, name: '東京都第2区', municipalities: [] },
    ];

    const mockCandidates: Candidate[] = [
      { id: 'c1', name: '山田太郎', partyId: 'ldp', districtId: 'tokyo-1' },
    ];

    it('should include all required variables', () => {
      const result = buildPrefectureVariables(mockPrefecture, mockDistricts, mockCandidates);
      expect(result.TODAY).toBeTruthy();
      expect(result.PREFECTURE).toBe('東京都');
      expect(result.PREFECTURE_ID).toBe('tokyo');
      expect(result.DISTRICT_COUNT).toBe(2);
      expect(result.DISTRICT_LIST).toBeTruthy();
      expect(result.CANDIDATES_SECTION).toBeTruthy();
      expect(result.PARTY_LIST).toBeTruthy();
    });

    it('should have correct district count', () => {
      const result = buildPrefectureVariables(mockPrefecture, mockDistricts, mockCandidates);
      expect(result.DISTRICT_COUNT).toBe(mockDistricts.length);
    });

    it('should include district list', () => {
      const result = buildPrefectureVariables(mockPrefecture, mockDistricts, mockCandidates);
      expect(result.DISTRICT_LIST).toContain('東京都第1区');
      expect(result.DISTRICT_LIST).toContain('東京都第2区');
    });
  });

  describe('buildBlockVariables', () => {
    const mockBlock: ProportionalBlock = {
      id: 'tokyo',
      name: '東京',
      nameEn: 'Tokyo',
      seats: 17,
      prefectureIds: ['tokyo'],
    };

    const mockPrefectures: Prefecture[] = [
      {
        id: 'tokyo',
        name: '東京都',
        nameEn: 'Tokyo',
        region: 'kanto',
        districtCount: 30,
        proportionalBlockId: 'tokyo',
      },
    ];

    it('should include all required variables', () => {
      const result = buildBlockVariables(mockBlock, mockPrefectures);
      expect(result.TODAY).toBeTruthy();
      expect(result.BLOCK_NAME).toBe('東京');
      expect(result.BLOCK_ID).toBe('tokyo');
      expect(result.SEATS_TOTAL).toBe(17);
      expect(result.BLOCK_PREFECTURES).toBeTruthy();
      expect(result.PARTY_LIST).toBeTruthy();
    });

    it('should include multiple prefectures', () => {
      const multiPrefBlock: ProportionalBlock = {
        id: 'tohoku',
        name: '東北',
        nameEn: 'Tohoku',
        seats: 13,
        prefectureIds: ['aomori', 'iwate'],
      };
      const prefectures: Prefecture[] = [
        { id: 'aomori', name: '青森県', nameEn: 'Aomori', region: 'tohoku', districtCount: 3, proportionalBlockId: 'tohoku' },
        { id: 'iwate', name: '岩手県', nameEn: 'Iwate', region: 'tohoku', districtCount: 3, proportionalBlockId: 'tohoku' },
      ];
      const result = buildBlockVariables(multiPrefBlock, prefectures);
      expect(result.BLOCK_PREFECTURES).toContain('青森県');
      expect(result.BLOCK_PREFECTURES).toContain('岩手県');
      expect(result.BLOCK_PREFECTURES).toContain('、');
    });
  });
});
