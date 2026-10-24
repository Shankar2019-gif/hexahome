import { describe, it, expect } from 'vitest';
import {
  CITIES,
  CATEGORIES,
  PROPERTY_TYPES,
  BUDGET_RANGES,
  BHK_OPTIONS,
  OUR_OFFERINGS,
} from '../data/hexahomeData';

describe('HexaHome Data Model Integrity', () => {
  it('contains essential cities with proper keys', () => {
    expect(CITIES.length).toBeGreaterThan(0);
    CITIES.forEach((city) => {
      expect(city).toHaveProperty('id');
      expect(city).toHaveProperty('name');
      expect(city).toHaveProperty('count');
      expect(typeof city.popular).toBe('boolean');
    });
  });

  it('defines valid real estate categories including rent, buy, pg, and commercial', () => {
    const ids = CATEGORIES.map((c) => c.id);
    expect(ids).toContain('rent');
    expect(ids).toContain('buy');
    expect(ids).toContain('pg');
    expect(ids).toContain('commercial');
  });

  it('provides standard BHK options', () => {
    expect(BHK_OPTIONS).toEqual(['1 RK', '1 BHK', '2 BHK', '3 BHK', '4+ BHK']);
  });

  it('provides comprehensive property types and budget ranges', () => {
    expect(PROPERTY_TYPES).toContain('Apartment / Flat');
    expect(PROPERTY_TYPES).toContain('Independent House / Villa');
    expect(BUDGET_RANGES.length).toBeGreaterThan(3);
    expect(OUR_OFFERINGS.length).toBeGreaterThan(0);
  });
});
