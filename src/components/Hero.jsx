import React, { useState } from 'react';
import { 
  Home, 
  MapPin, 
  ChevronDown, 
  Crosshair, 
  Search,
  Crown
} from 'lucide-react';
import { CATEGORIES } from '../data/hexahomeData';

export default function Hero({ selectedCity, onSearch, onOpenPremium }) {
  const [activeCategory, setActiveCategory] = useState('Rent');
  const [propertyType, setPropertyType] = useState('Apartment, Builder ...');
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [locationQuery, setLocationQuery] = useState('');

  const categoryList = [
    'Rent',
    'Co-living',
    'PG',
    'Buy',
    'Plots',
    'Commercial',
    'Projects'
  ];

  const propertyTypeOptions = [
    'Apartment, Builder ...',
    'Apartment / Flats',
    'Builder Floor',
    'Independent House / Villa',
    '1 RK / Studio Apartment',
    'Residential Plot / Land',
    'Commercial Office Space',
    'Retail Shop / Showroom'
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({
        category: activeCategory,
        propertyType,
        location: locationQuery || selectedCity?.name || 'Noida'
      });
    }
  };

  const handleLocateMe = () => {
    setLocationQuery(`${selectedCity?.name || 'Noida'}, Expressway`);
  };

  return (
    <section className="hero-section">
      {/* Background Graphic & City Skyline from reference */}
      <div className="hero-bg-container">
        <img 
          src="/hero-bg.webp" 
          alt="HexaHome City Skyline" 
          className="hero-bg-image"
        />
      </div>

      <div className="hero-content-wrapper container">
        {/* Main Headlines from DevTools reference */}
        <div className="hero-headings-block">
          <h2 className="hero-slogan-text">Ghar Aapka... Khoz hamari</h2>
          <h1 className="hero-main-headline">
            TRUSTED PLACE TO BUY, SELL, OR RENT PROPERTIES IN INDIA
          </h1>
        </div>

        {/* Category Pill Capsules (Rent, Co-living, PG, Buy, Plots, Commercial, Projects) */}
        <div className="category-capsule-wrapper">
          <div className="category-capsule-bar">
            {categoryList.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`cat-pill-btn ${isActive ? 'cat-pill-active' : ''}`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Unified Search Control Capsule (Exact replica of reference image) */}
        <form onSubmit={handleSearchSubmit} className="search-control-capsule">
          {/* Left Segment: Property Type Dropdown */}
          <div className="search-segment-left">
            <button
              type="button"
              className="property-type-dropdown-trigger"
              onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
              aria-expanded={typeDropdownOpen}
            >
              <div className="search-icon-circle">
                <Home size={18} className="search-home-icon" />
              </div>
              <span className="selected-type-text">{propertyType}</span>
              <ChevronDown size={15} className={`type-chevron ${typeDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {typeDropdownOpen && (
              <div className="property-types-dropdown animate-fade-in">
                {propertyTypeOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`type-option-item ${propertyType === opt ? 'active-type' : ''}`}
                    onClick={() => {
                      setPropertyType(opt);
                      setTypeDropdownOpen(false);
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Vertical Divider */}
          <div className="search-divider" />

          {/* Middle Segment: Locality Input + GPS Locate Icon */}
          <div className="search-segment-middle">
            <div className="location-pin-wrap">
              <MapPin size={18} className="search-pin-icon" />
            </div>
            <input
              type="text"
              placeholder="Type to search city, locality or area"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              className="search-locality-input"
            />
            <button
              type="button"
              className="locate-gps-btn"
              onClick={handleLocateMe}
              title="Use Current Location / Sector"
              aria-label="Use Current Location"
            >
              <Crosshair size={18} />
            </button>
          </div>

          {/* Right Segment: Search Button (Exact 161px x 60px with icon) */}
          <div className="search-segment-right">
            <button type="submit" className="search-action-btn" title="Search Properties">
              <Search size={19} className="search-btn-icon" />
              <span>Search</span>
            </button>
          </div>
        </form>

        {/* Floating HexaHome Pro Promo Pill below Search (Centered on same axis) */}
        <div className="hero-pro-ribbon-pill">
          <span className="pro-crown">👑</span>
          <span className="pro-bold">HexaHome Pro:</span>
          <span className="pro-regular">Checkout our premium plans.</span>
          <a 
            href="#premium-ribbon" 
            className="pro-explore-link"
            onClick={(e) => {
              if (onOpenPremium) {
                e.preventDefault();
                onOpenPremium();
              }
            }}
          >
            Explore now
          </a>
        </div>
      </div>
    </section>
  );
}
