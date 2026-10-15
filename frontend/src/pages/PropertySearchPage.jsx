import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropertyFilterSidebar from '../components/search/PropertyFilterSidebar';
import PropertyCard from '../components/cards/PropertyCard';
import { propertyService } from '../services/propertyService';
import {
  ArrowLeft,
  Filter,
  ArrowUpDown,
  Home,
  RotateCcw,
  Building,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import './PropertySearchPage.css';

/**
 * Parses URL query parameters into initial filter state
 */
function parseUrlFilters() {
  const params = new URLSearchParams(window.location.search);
  const bhkParam = params.get('bhk');
  let bhkArray = [];
  if (bhkParam) {
    bhkArray = bhkParam.includes(',') ? bhkParam.split(',') : [bhkParam];
  }

  return {
    city: params.get('city') || '',
    locality: params.get('locality') || '',
    category: params.get('category') || params.get('adType') || 'RENT',
    bhk: bhkArray,
    minPrice: params.get('minPrice') || '',
    maxPrice: params.get('maxPrice') || '',
    furnishing: params.get('furnishing') || 'All',
    verifiedOnly: params.get('verifiedOnly') === 'true',
    zeroBrokerageOnly: params.get('zeroBrokerageOnly') === 'true',
    sort: params.get('sort') || 'newest',
    page: parseInt(params.get('page') || '0', 10),
    size: 12,
  };
}

export default function PropertySearchPage({
  onNavigate,
  onSelectProperty,
  currentUser,
}) {
  const [filters, setFilters] = useState(parseUrlFilters);
  const [properties, setProperties] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [favorites, setFavorites] = useState({});

  // Sync state to URL without reloading page
  const syncFiltersToUrl = useCallback((updated) => {
    const params = new URLSearchParams();
    if (updated.city) params.set('city', updated.city);
    if (updated.locality) params.set('locality', updated.locality);
    if (updated.category) params.set('category', updated.category);
    if (updated.bhk && updated.bhk.length > 0) {
      params.set('bhk', Array.isArray(updated.bhk) ? updated.bhk.join(',') : updated.bhk);
    }
    if (updated.minPrice) params.set('minPrice', updated.minPrice);
    if (updated.maxPrice) params.set('maxPrice', updated.maxPrice);
    if (updated.furnishing && updated.furnishing !== 'All') params.set('furnishing', updated.furnishing);
    if (updated.verifiedOnly) params.set('verifiedOnly', 'true');
    if (updated.zeroBrokerageOnly) params.set('zeroBrokerageOnly', 'true');
    if (updated.sort && updated.sort !== 'newest') params.set('sort', updated.sort);
    if (updated.page > 0) params.set('page', updated.page.toString());

    const queryString = params.toString();
    const newUrl = `/search${queryString ? '?' + queryString : ''}`;
    window.history.replaceState({}, '', newUrl);
  }, []);

  // Fetch properties whenever filters change
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await propertyService.searchProperties(filters);
      setProperties(data.content || []);
      setTotalElements(data.totalElements || (data.content ? data.content.length : 0));
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('[PropertySearchPage] Fetch error:', err);
      setError('Unable to load properties. Showing offline listings.');
      const fallback = propertyService.getFallbackSearchResults(filters);
      setProperties(fallback.content);
      setTotalElements(fallback.totalElements);
      setTotalPages(fallback.totalPages);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    syncFiltersToUrl(filters);
    fetchProperties();
  }, [filters, syncFiltersToUrl, fetchProperties]);

  // Handle filter changes from sidebar
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Reset filters to defaults
  const handleResetFilters = () => {
    const defaultFilters = {
      city: '',
      locality: '',
      category: 'RENT',
      bhk: [],
      minPrice: '',
      maxPrice: '',
      furnishing: 'All',
      verifiedOnly: false,
      zeroBrokerageOnly: false,
      sort: 'newest',
      page: 0,
      size: 12,
    };
    setFilters(defaultFilters);
  };

  const handleToggleFavorite = (prop) => {
    const id = prop.id || prop.shortId;
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSortChange = (e) => {
    setFilters((prev) => ({ ...prev, sort: e.target.value, page: 0 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setFilters((prev) => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Active filter chip helpers
  const removeFilterChip = (type, value) => {
    setFilters((prev) => {
      const updated = { ...prev, page: 0 };
      if (type === 'city') updated.city = '';
      if (type === 'locality') updated.locality = '';
      if (type === 'price') {
        updated.minPrice = '';
        updated.maxPrice = '';
      }
      if (type === 'furnishing') updated.furnishing = 'All';
      if (type === 'verifiedOnly') updated.verifiedOnly = false;
      if (type === 'zeroBrokerageOnly') updated.zeroBrokerageOnly = false;
      if (type === 'bhk') {
        const arr = Array.isArray(prev.bhk) ? [...prev.bhk] : [];
        updated.bhk = arr.filter((b) => b !== value);
      }
      return updated;
    });
  };

  const activeChips = useMemo(() => {
    const chips = [];
    if (filters.city) chips.push({ type: 'city', label: `City: ${filters.city}` });
    if (filters.locality) chips.push({ type: 'locality', label: `Locality: ${filters.locality}` });
    if (filters.bhk && filters.bhk.length > 0) {
      filters.bhk.forEach((b) => chips.push({ type: 'bhk', value: b, label: b }));
    }
    if (filters.minPrice || filters.maxPrice) {
      chips.push({
        type: 'price',
        label: `₹${filters.minPrice ? Number(filters.minPrice).toLocaleString() : '0'} - ₹${filters.maxPrice ? Number(filters.maxPrice).toLocaleString() : 'Any'}`,
      });
    }
    if (filters.furnishing && filters.furnishing !== 'All') {
      chips.push({ type: 'furnishing', label: filters.furnishing });
    }
    if (filters.verifiedOnly) chips.push({ type: 'verifiedOnly', label: 'Verified Only' });
    if (filters.zeroBrokerageOnly) chips.push({ type: 'zeroBrokerageOnly', label: 'Zero Brokerage' });
    return chips;
  }, [filters]);

  return (
    <div className="search-page-wrapper">
      {/* Top Header / Sticky Nav */}
      <header className="search-top-bar">
        <div className="search-top-container">
          <div className="search-top-left">
            <button
              type="button"
              className="btn-back-home"
              onClick={() => onNavigate?.('/')}
              title="Return to HexaHome Home"
            >
              <ArrowLeft size={16} />
              <span>Home</span>
            </button>

            <div className="search-heading-meta">
              <h1>
                {filters.category === 'BUY'
                  ? 'Properties for Sale'
                  : filters.category === 'PG'
                  ? 'PG & Co-Living Spaces'
                  : filters.category === 'COMMERCIAL'
                  ? 'Commercial Properties'
                  : 'Properties for Rent'}
                {filters.city ? ` in ${filters.city.toUpperCase()}` : ''}
              </h1>
              <p>
                {loading
                  ? 'Searching verified direct properties...'
                  : `${totalElements} listings found matching your preferences`}
              </p>
            </div>
          </div>

          <div className="search-top-actions">
            {/* Mobile Filter Toggle */}
            <button
              type="button"
              className="btn-mobile-filters"
              onClick={() => setMobileFilterOpen(true)}
            >
              <SlidersHorizontal size={15} />
              <span>Filters ({activeChips.length})</span>
            </button>

            {/* Sort Dropdown */}
            <div className="sort-dropdown-wrap">
              <span className="sort-label">Sort:</span>
              <select
                className="sort-select"
                value={filters.sort || 'newest'}
                onChange={handleSortChange}
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout: Filter Sidebar (Left) + Property Cards Grid (Right) */}
      <div className="search-layout-container">
        {/* Sidebar */}
        <div className={`sidebar-container ${mobileFilterOpen ? 'mobile-open' : ''}`}>
          <PropertyFilterSidebar
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
            totalResults={totalElements}
            onCloseMobile={() => setMobileFilterOpen(false)}
          />
        </div>

        {/* Results Area */}
        <main className="search-results-content">
          {/* Active Filter Chips */}
          {activeChips.length > 0 && (
            <div className="active-filters-bar">
              <span className="text-xs font-semibold text-slate-500 mr-1">Active:</span>
              {activeChips.map((chip, idx) => (
                <span key={idx} className="active-filter-chip">
                  <span>{chip.label}</span>
                  <button
                    type="button"
                    onClick={() => removeFilterChip(chip.type, chip.value)}
                    aria-label={`Remove ${chip.label}`}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              <button
                type="button"
                className="text-xs text-rose-600 font-semibold hover:underline ml-auto"
                onClick={handleResetFilters}
              >
                Clear all
              </button>
            </div>
          )}

          {/* Loading Skeletons */}
          {loading && (
            <div className="search-cards-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-media skeleton-shimmer" />
                  <div className="skeleton-body">
                    <div className="skeleton-line w-price skeleton-shimmer" />
                    <div className="skeleton-line w-title skeleton-shimmer" />
                    <div className="skeleton-line w-loc skeleton-shimmer" />
                    <div className="skeleton-box-specs skeleton-shimmer" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State when no results found */}
          {!loading && properties.length === 0 && (
            <div className="search-empty-state">
              <div className="empty-icon-bubble">
                <Home size={32} />
              </div>
              <h3 className="empty-title">No properties found</h3>
              <p className="empty-subtitle">
                We couldn't find any listings matching your specific combination of filters.
                Try clearing one or more filters, widening your price range, or searching a nearby locality.
              </p>
              <button
                type="button"
                className="btn-empty-reset"
                onClick={handleResetFilters}
              >
                <RotateCcw size={16} />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}

          {/* Results Grid */}
          {!loading && properties.length > 0 && (
            <div className="search-cards-grid">
              {properties.map((prop) => {
                const id = prop.id || prop.shortId;
                return (
                  <PropertyCard
                    key={id}
                    property={prop}
                    isFavorite={!!favorites[id]}
                    onToggleFavorite={handleToggleFavorite}
                    onViewDetails={(p) => {
                      if (onNavigate) {
                        onNavigate(`/properties/${p.slug || p.id}`);
                      } else if (onSelectProperty) {
                        onSelectProperty(p);
                      }
                    }}
                    onContactOwner={(p) => {
                      if (onSelectProperty) {
                        onSelectProperty(p);
                      }
                    }}
                  />
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {!loading && totalPages > 1 && (
            <nav className="search-pagination-wrap" aria-label="Pagination Navigation">
              <div className="pagination-stats">
                Page {filters.page + 1} of {totalPages} ({totalElements} total properties)
              </div>

              <div className="pagination-buttons">
                <button
                  type="button"
                  className="page-nav-btn"
                  disabled={filters.page <= 0}
                  onClick={() => handlePageChange(filters.page - 1)}
                  aria-label="Previous Page"
                >
                  <ChevronLeft size={16} />
                  <span>Prev</span>
                </button>

                {Array.from({ length: Math.min(totalPages, 5) }).map((_, idx) => {
                  let pageNum = idx;
                  if (totalPages > 5 && filters.page > 2) {
                    pageNum = Math.min(filters.page - 2 + idx, totalPages - 1);
                  }
                  const isCurrent = filters.page === pageNum;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      className={`page-nav-btn ${isCurrent ? 'active' : ''}`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}

                <button
                  type="button"
                  className="page-nav-btn"
                  disabled={filters.page >= totalPages - 1}
                  onClick={() => handlePageChange(filters.page + 1)}
                  aria-label="Next Page"
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </nav>
          )}
        </main>
      </div>
    </div>
  );
}
