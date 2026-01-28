import { describe, it, expect } from 'vitest';
import {
  PREFECTURES,
  getPrefecture,
  getPrefecturesByBlock,
  getPrefecturesByRegion,
  TOTAL_DISTRICTS,
} from '@/data/prefectures';

describe('prefectures data', () => {
  describe('PREFECTURES constant', () => {
    it('should have exactly 47 prefectures', () => {
      expect(PREFECTURES).toHaveLength(47);
    });

    it('should have unique ids', () => {
      const ids = PREFECTURES.map((p) => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(47);
    });

    it('should have all required properties', () => {
      PREFECTURES.forEach((prefecture) => {
        expect(prefecture).toHaveProperty('id');
        expect(prefecture).toHaveProperty('name');
        expect(prefecture).toHaveProperty('nameEn');
        expect(prefecture).toHaveProperty('region');
        expect(prefecture).toHaveProperty('districtCount');
        expect(prefecture).toHaveProperty('proportionalBlockId');
        expect(prefecture.districtCount).toBeGreaterThan(0);
      });
    });
  });

  describe('TOTAL_DISTRICTS', () => {
    it('should be the sum of all prefecture district counts', () => {
      const sum = PREFECTURES.reduce((acc, p) => acc + p.districtCount, 0);
      expect(TOTAL_DISTRICTS).toBe(sum);
    });

    it('should be a reasonable number of districts (250-350)', () => {
      // Japanese House of Representatives has ~289 single-member districts
      // Allow for some variation in the data
      expect(TOTAL_DISTRICTS).toBeGreaterThan(250);
      expect(TOTAL_DISTRICTS).toBeLessThan(350);
    });
  });

  describe('getPrefecture', () => {
    it('should return Tokyo prefecture', () => {
      const tokyo = getPrefecture('tokyo');
      expect(tokyo).toBeDefined();
      expect(tokyo?.name).toBe('東京都');
      expect(tokyo?.nameEn).toBe('Tokyo');
      expect(tokyo?.districtCount).toBe(30);
      expect(tokyo?.region).toBe('kanto');
    });

    it('should return Hokkaido prefecture', () => {
      const hokkaido = getPrefecture('hokkaido');
      expect(hokkaido).toBeDefined();
      expect(hokkaido?.name).toBe('北海道');
      expect(hokkaido?.districtCount).toBe(12);
    });

    it('should return Osaka prefecture', () => {
      const osaka = getPrefecture('osaka');
      expect(osaka).toBeDefined();
      expect(osaka?.name).toBe('大阪府');
      expect(osaka?.districtCount).toBe(19);
    });

    it('should return undefined for invalid id', () => {
      const invalid = getPrefecture('invalid');
      expect(invalid).toBeUndefined();
    });

    it('should return undefined for empty string', () => {
      const empty = getPrefecture('');
      expect(empty).toBeUndefined();
    });
  });

  describe('getPrefecturesByBlock', () => {
    it('should return Tokyo for tokyo block', () => {
      const tokyoBlock = getPrefecturesByBlock('tokyo');
      expect(tokyoBlock).toHaveLength(1);
      expect(tokyoBlock[0].id).toBe('tokyo');
    });

    it('should return 6 prefectures for tohoku block', () => {
      const tohoku = getPrefecturesByBlock('tohoku');
      expect(tohoku).toHaveLength(6);
      const ids = tohoku.map((p) => p.id);
      expect(ids).toContain('aomori');
      expect(ids).toContain('iwate');
      expect(ids).toContain('miyagi');
      expect(ids).toContain('akita');
      expect(ids).toContain('yamagata');
      expect(ids).toContain('fukushima');
    });

    it('should return 4 prefectures for kitakanto block', () => {
      const kitakanto = getPrefecturesByBlock('kitakanto');
      expect(kitakanto).toHaveLength(4);
      const ids = kitakanto.map((p) => p.id);
      expect(ids).toContain('ibaraki');
      expect(ids).toContain('tochigi');
      expect(ids).toContain('gunma');
      expect(ids).toContain('saitama');
    });

    it('should return 8 prefectures for kyushu block', () => {
      const kyushu = getPrefecturesByBlock('kyushu');
      expect(kyushu).toHaveLength(8);
    });

    it('should return empty array for invalid block', () => {
      const invalid = getPrefecturesByBlock('invalid');
      expect(invalid).toHaveLength(0);
    });
  });

  describe('getPrefecturesByRegion', () => {
    it('should return prefectures in kanto region', () => {
      const kanto = getPrefecturesByRegion('kanto');
      expect(kanto.length).toBeGreaterThan(0);
      kanto.forEach((p) => {
        expect(p.region).toBe('kanto');
      });
    });

    it('should return only hokkaido for hokkaido region', () => {
      const hokkaido = getPrefecturesByRegion('hokkaido');
      expect(hokkaido).toHaveLength(1);
      expect(hokkaido[0].id).toBe('hokkaido');
    });

    it('should return 4 prefectures for shikoku region', () => {
      const shikoku = getPrefecturesByRegion('shikoku');
      expect(shikoku).toHaveLength(4);
    });

    it('should return empty array for invalid region', () => {
      const invalid = getPrefecturesByRegion('invalid');
      expect(invalid).toHaveLength(0);
    });
  });
});
