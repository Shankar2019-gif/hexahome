import apiClient from './apiClient';
import { RENT_PROPERTIES } from '../data/hexahomeData';

/**
 * Reads user-submitted properties from local storage cache/drafts
 */
function getLocalUserProperties() {
  try {
    const raw = localStorage.getItem('hexahome_user_properties');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Property Service for Consumer Property Search & Catalog.
 * Connects frontend search & filters to backend Spring Boot endpoints
 * with fallback support to local seed properties when offline.
 */
export const propertyService = {
  /**
   * Search properties with comprehensive filter criteria
   * @param {Object} filters
   * @returns {Promise<{ content: Array, totalElements: number, totalPages: number, number: number, size: number }>}
   */
  async searchProperties(filters = {}) {
    const localListings = getLocalUserProperties();

    try {
      const params = {};

      if (filters.city) params.city = filters.city;
      if (filters.locality) params.locality = filters.locality;
      if (filters.q || filters.query) params.q = filters.q || filters.query;

      // Category mapping: Rent -> RENT, Buy -> BUY, PG -> PG, Commercial -> COMMERCIAL
      if (filters.category || filters.adType) {
        const cat = (filters.category || filters.adType).toUpperCase();
        params.adType = cat;
      }

      if (filters.propertyType && filters.propertyType !== 'All') {
        params.propertyType = filters.propertyType;
      }

      // BHK mapping: supports array or comma-separated
      if (filters.bhk && filters.bhk.length > 0) {
        params.bhk = Array.isArray(filters.bhk) ? filters.bhk.join(',') : filters.bhk;
      }

      if (filters.minPrice !== undefined && filters.minPrice !== null && filters.minPrice !== '') {
        params.minPrice = filters.minPrice;
      }
      if (filters.maxPrice !== undefined && filters.maxPrice !== null && filters.maxPrice !== '') {
        params.maxPrice = filters.maxPrice;
      }

      if (filters.furnishing && filters.furnishing !== 'All') {
        params.furnishing = filters.furnishing.toUpperCase().replace('-', '_').replace(' ', '_');
      }

      if (filters.preferredTenant && filters.preferredTenant !== 'All') {
        params.preferredTenant = filters.preferredTenant;
      }

      if (filters.verifiedOnly) params.verifiedOnly = true;
      if (filters.zeroBrokerageOnly) params.zeroBrokerageOnly = true;

      params.sort = filters.sort || 'newest';
      params.page = filters.page !== undefined ? filters.page : 0;
      params.size = filters.size || 12;

      // Call backend search endpoint: /api/v1/properties/search
      const response = await apiClient.get('/properties/search', { params });
      
      // Response unwrapping (apiClient response interceptor or Spring ApiResponse)
      const data = response?.data || response;
      let content = [];
      let total = 0;
      let totalPages = 1;

      if (data && Array.isArray(data.content)) {
        content = [...data.content];
        total = data.totalElements || data.content.length;
        totalPages = data.totalPages || 1;
      } else if (Array.isArray(data)) {
        content = [...data];
        total = data.length;
        totalPages = Math.ceil(data.length / params.size) || 1;
      }

      // Merge local user-uploaded properties that aren't already in content
      if (localListings.length > 0) {
        localListings.forEach((localProp) => {
          const alreadyExists = content.some(
            (p) => p.id === localProp.id || (p.slug && p.slug === localProp.slug)
          );
          if (!alreadyExists) {
            content.unshift(localProp);
            total += 1;
          }
        });
      }

      return {
        content,
        totalElements: total,
        totalPages,
        number: params.page,
        size: params.size,
      };
    } catch (error) {
      console.warn('[propertyService.searchProperties] Backend API error, using fallback catalog:', error.message);
      return this.getFallbackSearchResults(filters);
    }
  },

  /**
   * Fetch single property by slug or UUID
   */
  async getPropertyDetail(slugOrId) {
    try {
      const response = await apiClient.get(`/properties/${slugOrId}`);
      return response?.data || response;
    } catch (error) {
      console.warn('[propertyService.getPropertyDetail] Backend fetch error, checking local store:', error.message);
      
      // 1. Check user-submitted local properties in localStorage
      const localListings = getLocalUserProperties();
      const localMatch = localListings.find(
        (p) =>
          p.id === slugOrId ||
          p.uuid === slugOrId ||
          p.slug === slugOrId ||
          (p.title && p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slugOrId)
      );
      if (localMatch) {
        return {
          ...localMatch,
          images: localMatch.images || (localMatch.imageUrls ? localMatch.imageUrls.map((url, idx) => ({ id: `img-${idx}`, imageUrl: url, thumbnailUrl: url, isCover: idx === 0 })) : []),
        };
      }

      // 2. Check catalog seed properties
      const match = RENT_PROPERTIES.find(
        (p) =>
          p.id === slugOrId ||
          p.slug === slugOrId ||
          (p.title && p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slugOrId)
      );
      if (match) return match;

      throw error;
    }
  },

  /**
   * Reveal owner contact details (unmasked phone, email) deducting 1 subscription quota credit.
   * Throws HTTP 402/QuotaExhausted if contact credits are exhausted.
   */
  async revealContact(propertyId) {
    try {
      const response = await apiClient.post(`/properties/${propertyId}/reveal-contact`);
      return response?.data || response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Client-side fallback search when backend returns 0 listings or is offline
   */
  getFallbackSearchResults(filters = {}) {
    const localListings = getLocalUserProperties();
    let results = [...localListings, ...RENT_PROPERTIES];

    if (filters.city) {
      const c = filters.city.toLowerCase().trim();
      results = results.filter((p) =>
        (p.cityName || p.city || p.location || '').toLowerCase().includes(c)
      );
    }

    if (filters.locality) {
      const loc = filters.locality.toLowerCase().trim();
      results = results.filter((p) =>
        (p.localityName || p.locality || p.location || '').toLowerCase().includes(loc) ||
        (p.title || '').toLowerCase().includes(loc) ||
        (p.address || '').toLowerCase().includes(loc)
      );
    }

    if (filters.q || filters.query) {
      const q = (filters.q || filters.query).toLowerCase().trim();
      results = results.filter((p) =>
        (p.title || '').toLowerCase().includes(q) ||
        (p.location || '').toLowerCase().includes(q) ||
        (p.address || '').toLowerCase().includes(q) ||
        (p.bhk || p.type || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q)
      );
    }

    if (filters.bhk && filters.bhk.length > 0) {
      const selectedBhks = Array.isArray(filters.bhk) ? filters.bhk : [filters.bhk];
      results = results.filter((p) =>
        selectedBhks.some((b) => (p.type || '').includes(b) || (p.bhk || '').includes(b))
      );
    }

    if (filters.minPrice) {
      results = results.filter((p) => (p.price || 0) >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      results = results.filter((p) => (p.price || 0) <= Number(filters.maxPrice));
    }

    if (filters.furnishing && filters.furnishing !== 'All') {
      const f = filters.furnishing.toLowerCase();
      results = results.filter((p) => (p.furnishing || '').toLowerCase().includes(f));
    }

    if (filters.verifiedOnly) {
      results = results.filter((p) => p.verified || p.isVerified);
    }

    if (filters.zeroBrokerageOnly) {
      results = results.filter((p) => p.zeroBrokerage || p.isZeroBrokerage || p.tag?.includes('Zero Brokerage'));
    }

    // Sorting
    if (filters.sort === 'price_asc') {
      results.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (filters.sort === 'price_desc') {
      results.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    const page = filters.page || 0;
    const size = filters.size || 12;
    const start = page * size;
    const paginated = results.slice(start, start + size);

    return {
      content: paginated,
      totalElements: results.length,
      totalPages: Math.ceil(results.length / size) || 1,
      number: page,
      size: size,
    };
  },
};

export default propertyService;
