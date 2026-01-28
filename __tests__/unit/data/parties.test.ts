import { describe, it, expect } from 'vitest';
import { PARTIES, getParty, getPartyColor } from '@/data/parties';

describe('parties data', () => {
  describe('PARTIES constant', () => {
    it('should have 10 parties', () => {
      expect(PARTIES).toHaveLength(10);
    });

    it('should have unique ids', () => {
      const ids = PARTIES.map((p) => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(10);
    });

    it('should have all required properties', () => {
      PARTIES.forEach((party) => {
        expect(party).toHaveProperty('id');
        expect(party).toHaveProperty('name');
        expect(party).toHaveProperty('nameEn');
        expect(party).toHaveProperty('shortName');
        expect(party).toHaveProperty('color');
        expect(party.color).toMatch(/^#[0-9a-fA-F]{6}$/);
      });
    });

    it('should include major parties', () => {
      const ids = PARTIES.map((p) => p.id);
      expect(ids).toContain('ldp');
      expect(ids).toContain('chudou');
      expect(ids).toContain('ishin');
      expect(ids).toContain('jcp');
      expect(ids).toContain('reiwa');
      expect(ids).toContain('independent');
    });
  });

  describe('getParty', () => {
    it('should return LDP party', () => {
      const ldp = getParty('ldp');
      expect(ldp.id).toBe('ldp');
      expect(ldp.name).toBe('自由民主党');
      expect(ldp.shortName).toBe('自民');
      expect(ldp.color).toBe('#e31e26');
    });

    it('should return Ishin party', () => {
      const ishin = getParty('ishin');
      expect(ishin.id).toBe('ishin');
      expect(ishin.name).toBe('日本維新の会');
      expect(ishin.color).toBe('#38b649');
    });

    it('should return JCP party', () => {
      const jcp = getParty('jcp');
      expect(jcp.id).toBe('jcp');
      expect(jcp.name).toBe('日本共産党');
    });

    it('should return Independent party', () => {
      const independent = getParty('independent');
      expect(independent.id).toBe('independent');
      expect(independent.name).toBe('無所属');
    });

    it('should return "other" party for invalid id', () => {
      const invalid = getParty('invalid');
      expect(invalid.id).toBe('other');
      expect(invalid.name).toBe('その他');
    });

    it('should return "other" party for empty string', () => {
      const empty = getParty('');
      expect(empty.id).toBe('other');
    });
  });

  describe('getPartyColor', () => {
    it('should return red for LDP', () => {
      const color = getPartyColor('ldp');
      expect(color).toBe('#e31e26');
    });

    it('should return green for Ishin', () => {
      const color = getPartyColor('ishin');
      expect(color).toBe('#38b649');
    });

    it('should return gray for Independent', () => {
      const color = getPartyColor('independent');
      expect(color).toBe('#6b7280');
    });

    it('should return "other" color for invalid party', () => {
      const color = getPartyColor('nonexistent');
      expect(color).toBe('#9ca3af');
    });
  });

  describe('ideology scores', () => {
    it('should have valid ideology for parties with ideology', () => {
      const partiesWithIdeology = PARTIES.filter((p) => p.ideology);
      partiesWithIdeology.forEach((party) => {
        expect(party.ideology).toHaveProperty('economic');
        expect(party.ideology).toHaveProperty('social');
        expect(party.ideology).toHaveProperty('diplomatic');
      });
    });

    it('should have LDP as economically right', () => {
      const ldp = getParty('ldp');
      expect(ldp.ideology?.economic).toBeGreaterThan(0);
    });

    it('should have JCP as economically left', () => {
      const jcp = getParty('jcp');
      expect(jcp.ideology?.economic).toBeLessThan(0);
    });
  });
});
