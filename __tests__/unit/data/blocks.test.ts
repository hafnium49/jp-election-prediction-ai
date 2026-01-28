import { describe, it, expect } from 'vitest';
import {
  PROPORTIONAL_BLOCKS,
  getBlock,
  TOTAL_PROPORTIONAL_SEATS,
  TOTAL_SEATS,
  MAJORITY_THRESHOLD,
} from '@/data/blocks';

describe('blocks data', () => {
  describe('PROPORTIONAL_BLOCKS constant', () => {
    it('should have exactly 11 blocks', () => {
      expect(PROPORTIONAL_BLOCKS).toHaveLength(11);
    });

    it('should have unique ids', () => {
      const ids = PROPORTIONAL_BLOCKS.map((b) => b.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(11);
    });

    it('should have all required properties', () => {
      PROPORTIONAL_BLOCKS.forEach((block) => {
        expect(block).toHaveProperty('id');
        expect(block).toHaveProperty('name');
        expect(block).toHaveProperty('nameEn');
        expect(block).toHaveProperty('seats');
        expect(block).toHaveProperty('prefectureIds');
        expect(block.seats).toBeGreaterThan(0);
        expect(block.prefectureIds.length).toBeGreaterThan(0);
      });
    });

    it('should include all expected blocks', () => {
      const ids = PROPORTIONAL_BLOCKS.map((b) => b.id);
      expect(ids).toContain('hokkaido');
      expect(ids).toContain('tohoku');
      expect(ids).toContain('kitakanto');
      expect(ids).toContain('minamikanto');
      expect(ids).toContain('tokyo');
      expect(ids).toContain('hokurikushinetsu');
      expect(ids).toContain('tokai');
      expect(ids).toContain('kinki');
      expect(ids).toContain('chugoku');
      expect(ids).toContain('shikoku');
      expect(ids).toContain('kyushu');
    });
  });

  describe('TOTAL_PROPORTIONAL_SEATS', () => {
    it('should equal 176', () => {
      expect(TOTAL_PROPORTIONAL_SEATS).toBe(176);
    });

    it('should be the sum of all block seats', () => {
      const sum = PROPORTIONAL_BLOCKS.reduce((acc, b) => acc + b.seats, 0);
      expect(TOTAL_PROPORTIONAL_SEATS).toBe(sum);
    });
  });

  describe('TOTAL_SEATS', () => {
    it('should equal 465', () => {
      expect(TOTAL_SEATS).toBe(465);
    });

    it('should equal districts (289) + proportional (176)', () => {
      expect(TOTAL_SEATS).toBe(289 + 176);
    });
  });

  describe('MAJORITY_THRESHOLD', () => {
    it('should equal 233', () => {
      expect(MAJORITY_THRESHOLD).toBe(233);
    });

    it('should be more than half of total seats', () => {
      expect(MAJORITY_THRESHOLD).toBeGreaterThan(TOTAL_SEATS / 2);
    });
  });

  describe('getBlock', () => {
    it('should return Tokyo block', () => {
      const tokyo = getBlock('tokyo');
      expect(tokyo).toBeDefined();
      expect(tokyo?.name).toBe('東京');
      expect(tokyo?.seats).toBe(17);
      expect(tokyo?.prefectureIds).toEqual(['tokyo']);
    });

    it('should return Hokkaido block', () => {
      const hokkaido = getBlock('hokkaido');
      expect(hokkaido).toBeDefined();
      expect(hokkaido?.name).toBe('北海道');
      expect(hokkaido?.seats).toBe(8);
    });

    it('should return Kinki block with correct seats', () => {
      const kinki = getBlock('kinki');
      expect(kinki).toBeDefined();
      expect(kinki?.name).toBe('近畿');
      expect(kinki?.seats).toBe(28); // Largest block
    });

    it('should return Shikoku block with smallest seats', () => {
      const shikoku = getBlock('shikoku');
      expect(shikoku).toBeDefined();
      expect(shikoku?.seats).toBe(6); // Smallest block
    });

    it('should return Tohoku block with correct prefectures', () => {
      const tohoku = getBlock('tohoku');
      expect(tohoku).toBeDefined();
      expect(tohoku?.prefectureIds).toHaveLength(6);
      expect(tohoku?.prefectureIds).toContain('miyagi');
    });

    it('should return undefined for invalid id', () => {
      const invalid = getBlock('invalid');
      expect(invalid).toBeUndefined();
    });

    it('should return undefined for empty string', () => {
      const empty = getBlock('');
      expect(empty).toBeUndefined();
    });
  });

  describe('block seat distribution', () => {
    it('should have Kinki as the largest block', () => {
      const kinki = getBlock('kinki');
      const otherBlocks = PROPORTIONAL_BLOCKS.filter((b) => b.id !== 'kinki');
      otherBlocks.forEach((block) => {
        expect(kinki?.seats).toBeGreaterThanOrEqual(block.seats);
      });
    });

    it('should have Shikoku as the smallest block', () => {
      const shikoku = getBlock('shikoku');
      const otherBlocks = PROPORTIONAL_BLOCKS.filter((b) => b.id !== 'shikoku');
      otherBlocks.forEach((block) => {
        expect(shikoku?.seats).toBeLessThanOrEqual(block.seats);
      });
    });
  });
});
