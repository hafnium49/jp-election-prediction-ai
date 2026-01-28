import { describe, it, expect } from 'vitest';
import {
  DISTRICTS,
  getDistrict,
  getDistrictsByPrefecture,
  getDistrictsByBlock,
  TOTAL_DISTRICTS,
} from '@/data/districts';

describe('districts data', () => {
  describe('DISTRICTS constant', () => {
    it('should have a reasonable number of districts (250-350)', () => {
      // Japanese House of Representatives has ~289 single-member districts
      // Allow for some variation in the data
      expect(DISTRICTS.length).toBeGreaterThan(250);
      expect(DISTRICTS.length).toBeLessThan(350);
    });

    it('should have unique ids', () => {
      const ids = DISTRICTS.map((d) => d.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(DISTRICTS.length);
    });

    it('should have all required properties', () => {
      DISTRICTS.forEach((district) => {
        expect(district).toHaveProperty('id');
        expect(district).toHaveProperty('prefectureId');
        expect(district).toHaveProperty('number');
        expect(district).toHaveProperty('name');
        expect(district.number).toBeGreaterThan(0);
      });
    });

    it('should have ids in format prefecture-number', () => {
      DISTRICTS.forEach((district) => {
        const expectedId = `${district.prefectureId}-${district.number}`;
        expect(district.id).toBe(expectedId);
      });
    });
  });

  describe('TOTAL_DISTRICTS', () => {
    it('should equal DISTRICTS.length', () => {
      expect(TOTAL_DISTRICTS).toBe(DISTRICTS.length);
    });

    it('should be a reasonable number (250-350)', () => {
      expect(TOTAL_DISTRICTS).toBeGreaterThan(250);
      expect(TOTAL_DISTRICTS).toBeLessThan(350);
    });
  });

  describe('getDistrict', () => {
    it('should return tokyo-1 district', () => {
      const district = getDistrict('tokyo-1');
      expect(district).toBeDefined();
      expect(district?.prefectureId).toBe('tokyo');
      expect(district?.number).toBe(1);
      expect(district?.name).toBe('東京都第1区');
    });

    it('should return tokyo-30 district (last tokyo district)', () => {
      const district = getDistrict('tokyo-30');
      expect(district).toBeDefined();
      expect(district?.prefectureId).toBe('tokyo');
      expect(district?.number).toBe(30);
    });

    it('should return hokkaido-1 district', () => {
      const district = getDistrict('hokkaido-1');
      expect(district).toBeDefined();
      expect(district?.prefectureId).toBe('hokkaido');
      expect(district?.name).toBe('北海道第1区');
    });

    it('should return osaka-19 district', () => {
      const district = getDistrict('osaka-19');
      expect(district).toBeDefined();
      expect(district?.prefectureId).toBe('osaka');
      expect(district?.number).toBe(19);
    });

    it('should return undefined for invalid id', () => {
      const invalid = getDistrict('invalid');
      expect(invalid).toBeUndefined();
    });

    it('should return undefined for non-existent district number', () => {
      // Tokyo has 30 districts, so 31 should not exist
      const invalid = getDistrict('tokyo-31');
      expect(invalid).toBeUndefined();
    });
  });

  describe('getDistrictsByPrefecture', () => {
    it('should return 30 districts for Tokyo', () => {
      const tokyoDistricts = getDistrictsByPrefecture('tokyo');
      expect(tokyoDistricts).toHaveLength(30);
      tokyoDistricts.forEach((d) => {
        expect(d.prefectureId).toBe('tokyo');
      });
    });

    it('should return 12 districts for Hokkaido', () => {
      const hokkaidoDistricts = getDistrictsByPrefecture('hokkaido');
      expect(hokkaidoDistricts).toHaveLength(12);
    });

    it('should return 19 districts for Osaka', () => {
      const osakaDistricts = getDistrictsByPrefecture('osaka');
      expect(osakaDistricts).toHaveLength(19);
    });

    it('should return 2 districts for Tottori (smallest)', () => {
      const tottoriDistricts = getDistrictsByPrefecture('tottori');
      expect(tottoriDistricts).toHaveLength(2);
    });

    it('should return districts in order by number', () => {
      const tokyoDistricts = getDistrictsByPrefecture('tokyo');
      for (let i = 0; i < tokyoDistricts.length; i++) {
        expect(tokyoDistricts[i].number).toBe(i + 1);
      }
    });

    it('should return empty array for invalid prefecture', () => {
      const invalid = getDistrictsByPrefecture('invalid');
      expect(invalid).toHaveLength(0);
    });
  });

  describe('getDistrictsByBlock', () => {
    it('should return 30 districts for Tokyo block', () => {
      const tokyoBlockDistricts = getDistrictsByBlock('tokyo');
      expect(tokyoBlockDistricts).toHaveLength(30);
    });

    it('should return 20 districts for Tohoku block', () => {
      // Tohoku: aomori(3) + iwate(3) + miyagi(5) + akita(2) + yamagata(3) + fukushima(4) = 20
      const tohokuDistricts = getDistrictsByBlock('tohoku');
      expect(tohokuDistricts).toHaveLength(20);
    });

    it('should return 33 districts for Kitakanto block', () => {
      // Kitakanto: ibaraki(7) + tochigi(5) + gunma(5) + saitama(16) = 33
      const kitakantoDistricts = getDistrictsByBlock('kitakanto');
      expect(kitakantoDistricts).toHaveLength(33);
    });

    it('should return 46 districts for Kinki block', () => {
      // Kinki: shiga(4) + kyoto(6) + osaka(19) + hyogo(12) + nara(3) + wakayama(2) = 46
      const kinkiDistricts = getDistrictsByBlock('kinki');
      expect(kinkiDistricts).toHaveLength(46);
    });

    it('should return districts from correct prefectures for Shikoku', () => {
      const shikokuDistricts = getDistrictsByBlock('shikoku');
      const prefectureIds = new Set(shikokuDistricts.map((d) => d.prefectureId));
      expect(prefectureIds).toContain('tokushima');
      expect(prefectureIds).toContain('kagawa');
      expect(prefectureIds).toContain('ehime');
      expect(prefectureIds).toContain('kochi');
      expect(prefectureIds.size).toBe(4);
    });

    it('should return empty array for invalid block', () => {
      const invalid = getDistrictsByBlock('invalid');
      expect(invalid).toHaveLength(0);
    });
  });
});
