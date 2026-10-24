import { describe, it, expect } from 'vitest';
import { propertyService } from '../services/propertyService';

describe('propertyService Fallback Catalog Search & Filters', () => {
  it('returns default paginated catalog when no filters applied', () => {
    const results = propertyService.getFallbackSearchResults();
    expect(results).toHaveProperty('content');
    expect(results).toHaveProperty('totalElements');
    expect(results.content.length).toBeGreaterThan(0);
    expect(results.number).toBe(0);
    expect(results.size).toBe(12);
  });

  it('filters results by city correctly', () => {
    const results = propertyService.getFallbackSearchResults({ city: 'Noida' });
    results.content.forEach((property) => {
      expect((property.location || '').toLowerCase()).toContain('noida');
    });
  });

  it('filters results by price range (minPrice and maxPrice)', () => {
    const minPrice = 15000;
    const maxPrice = 30000;
    const results = propertyService.getFallbackSearchResults({ minPrice, maxPrice });

    results.content.forEach((property) => {
      expect(property.price).toBeGreaterThanOrEqual(minPrice);
      expect(property.price).toBeLessThanOrEqual(maxPrice);
    });
  });

  it('sorts properties by price ascending and descending', () => {
    const ascResults = propertyService.getFallbackSearchResults({ sort: 'price_asc' });
    for (let i = 0; i < ascResults.content.length - 1; i++) {
      expect(ascResults.content[i].price).toBeLessThanOrEqual(ascResults.content[i + 1].price);
    }

    const descResults = propertyService.getFallbackSearchResults({ sort: 'price_desc' });
    for (let i = 0; i < descResults.content.length - 1; i++) {
      expect(descResults.content[i].price).toBeGreaterThanOrEqual(descResults.content[i + 1].price);
    }
  });

  it('filters by zero brokerage flag', () => {
    const results = propertyService.getFallbackSearchResults({ zeroBrokerageOnly: true });
    results.content.forEach((property) => {
      const isZero = property.zeroBrokerage || property.tag?.includes('Zero Brokerage');
      expect(isZero).toBeTruthy();
    });
  });
});
