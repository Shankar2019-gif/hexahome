import React, { useState } from 'react';
import {
  Filter,
  RotateCcw,
  Search,
  MapPin,
  Building,
  Home,
  Check,
  ChevronDown,
  X,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { CITIES } from '../../data/hexahomeData';

export default function PropertyFilterSidebar({
  filters,
  onChange,
  onReset,
  totalResults = 0,
  onCloseMobile,
}) {
  const [localityInput, setLocalityInput] = useState(filters.locality || '');

  const categories = [
    { id: 'RENT', label: 'Rent' },
    { id: 'BUY', label: 'Buy' },
    { id: 'PG', label: 'PG / Co-Living' },
    { id: 'COMMERCIAL', label: 'Commercial' },
  ];

  const bhkOptions = ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4+ BHK'];

  const furnishingOptions = [
    { id: 'All', label: 'Any' },
    { id: 'FURNISHED', label: 'Furnished' },
    { id: 'SEMI_FURNISHED', label: 'Semi-Furnished' },
    { id: 'UNFURNISHED', label: 'Unfurnished' },
  ];

  const rentPricePresets = [
    { label: '< ₹15k', min: 0, max: 15000 },
    { label: '₹15k - ₹30k', min: 15000, max: 30000 },
    { label: '₹30k - ₹50k', min: 30000, max: 50000 },
    { label: '₹50k+', min: 50000, max: 200000 },
  ];

  const buyPricePresets = [
    { label: '< ₹50 Lac', min: 0, max: 5000000 },
    { label: '₹50L - ₹1 Cr', min: 5000000, max: 10000000 },
    { label: '₹1 Cr - ₹2 Cr', min: 10000000, max: 20000000 },
    { label: '₹2 Cr+', min: 20000000, max: 100000000 },
  ];

  const pricePresets = filters.category === 'BUY' ? buyPricePresets : rentPricePresets;

  const handleCategoryChange = (catId) => {
    onChange({
      ...filters,
      category: catId,
      adType: catId,
      // Clear min/max price when category flips from Buy to Rent or vice versa
      minPrice: '',
      maxPrice: '',
      page: 0,
    });
  };

  const handleBhkToggle = (bhk) => {
    const currentBhks = Array.isArray(filters.bhk) ? [...filters.bhk] : (filters.bhk ? [filters.bhk] : []);
    const index = currentBhks.indexOf(bhk);
    if (index > -1) {
      currentBhks.splice(index, 1);
    } else {
      currentBhks.push(bhk);
    }
    onChange({ ...filters, bhk: currentBhks, page: 0 });
  };

  const handleLocalitySubmit = (e) => {
    e.preventDefault();
    onChange({ ...filters, locality: localityInput.trim(), page: 0 });
  };

  const handleLocalityClear = () => {
    setLocalityInput('');
    onChange({ ...filters, locality: '', page: 0 });
  };

  return (
    <aside className="property-filter-sidebar">
      {/* Sidebar Header */}
      <div className="filter-sidebar-header">
        <div className="filter-header-left">
          <Filter size={18} className="icon-filter" />
          <h2 className="filter-title">Filters</h2>
          {totalResults > 0 && (
            <span className="filter-results-badge">{totalResults}</span>
          )}
        </div>

        <div className="filter-header-actions">
          <button
            type="button"
            className="btn-filter-reset"
            onClick={onReset}
            title="Reset all filters"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>

          {onCloseMobile && (
            <button
              type="button"
              className="btn-filter-close-mobile"
              onClick={onCloseMobile}
              aria-label="Close filters"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="filter-scroll-container">
        {/* 1. Category Selection Tabs */}
        <section className="filter-group">
          <label className="filter-group-label">Listing Type</label>
          <div className="category-toggle-grid">
            {categories.map((cat) => {
              const isActive = (filters.category || 'RENT').toUpperCase() === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`category-toggle-btn ${isActive ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(cat.id)}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* 2. City & Locality Filter */}
        <section className="filter-group">
          <label className="filter-group-label">Location</label>
          
          {/* City Dropdown */}
          <div className="filter-input-wrapper mb-2">
            <Building size={16} className="filter-input-icon" />
            <select
              className="filter-select-input"
              value={filters.city || ''}
              onChange={(e) => onChange({ ...filters, city: e.target.value, page: 0 })}
            >
              <option value="">All Supported Cities</option>
              {CITIES.map((c) => (
                <option key={c.id} value={c.slug || c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Locality Search Input */}
          <form onSubmit={handleLocalitySubmit} className="locality-search-form">
            <div className="filter-input-wrapper">
              <MapPin size={16} className="filter-input-icon" />
              <input
                type="text"
                className="filter-text-input"
                placeholder="Search locality or landmark..."
                value={localityInput}
                onChange={(e) => setLocalityInput(e.target.value)}
              />
              {localityInput ? (
                <button
                  type="button"
                  className="filter-input-clear"
                  onClick={handleLocalityClear}
                >
                  <X size={14} />
                </button>
              ) : (
                <button type="submit" className="filter-input-submit" aria-label="Search locality">
                  <Search size={14} />
                </button>
              )}
            </div>
          </form>
        </section>

        {/* 3. BHK Configuration Selection */}
        <section className="filter-group">
          <label className="filter-group-label">BHK Configuration</label>
          <div className="bhk-chips-wrapper">
            {bhkOptions.map((bhk) => {
              const currentBhks = Array.isArray(filters.bhk) ? filters.bhk : (filters.bhk ? [filters.bhk] : []);
              const isSelected = currentBhks.includes(bhk);
              return (
                <button
                  key={bhk}
                  type="button"
                  className={`bhk-chip ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleBhkToggle(bhk)}
                >
                  {isSelected && <Check size={13} className="mr-1" />}
                  <span>{bhk}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 4. Price Range Filter (Min - Max inputs + Presets) */}
        <section className="filter-group">
          <label className="filter-group-label">Price Range (₹)</label>

          <div className="price-inputs-row">
            <input
              type="number"
              className="price-number-input"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={(e) => onChange({ ...filters, minPrice: e.target.value, page: 0 })}
            />
            <span className="price-separator">to</span>
            <input
              type="number"
              className="price-number-input"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={(e) => onChange({ ...filters, maxPrice: e.target.value, page: 0 })}
            />
          </div>

          {/* Quick presets */}
          <div className="price-presets-wrap">
            {pricePresets.map((preset, idx) => {
              const isSelected = Number(filters.minPrice) === preset.min && Number(filters.maxPrice) === preset.max;
              return (
                <button
                  key={idx}
                  type="button"
                  className={`preset-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => onChange({ ...filters, minPrice: preset.min, maxPrice: preset.max, page: 0 })}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* 5. Furnishing Type Filter */}
        <section className="filter-group">
          <label className="filter-group-label">Furnishing Status</label>
          <div className="furnishing-options-grid">
            {furnishingOptions.map((opt) => {
              const isSelected = (filters.furnishing || 'All') === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  className={`furnishing-opt-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => onChange({ ...filters, furnishing: opt.id, page: 0 })}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* 6. Quick Verification & Zero Brokerage Toggles */}
        <section className="filter-group filter-checkboxes">
          <label className="checkbox-toggle-item">
            <input
              type="checkbox"
              checked={!!filters.verifiedOnly}
              onChange={(e) => onChange({ ...filters, verifiedOnly: e.target.checked, page: 0 })}
            />
            <div className="checkbox-content">
              <span className="checkbox-title">
                <ShieldCheck size={15} className="text-emerald-600 inline mr-1" />
                Verified Listings Only
              </span>
              <span className="checkbox-desc">100% physically inspected & document-checked</span>
            </div>
          </label>

          <label className="checkbox-toggle-item">
            <input
              type="checkbox"
              checked={!!filters.zeroBrokerageOnly}
              onChange={(e) => onChange({ ...filters, zeroBrokerageOnly: e.target.checked, page: 0 })}
            />
            <div className="checkbox-content">
              <span className="checkbox-title">
                <Zap size={15} className="text-amber-500 inline mr-1" />
                Zero Brokerage Direct
              </span>
              <span className="checkbox-desc">Connect directly with owners without broker fees</span>
            </div>
          </label>
        </section>
      </div>
    </aside>
  );
}
