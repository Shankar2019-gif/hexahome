import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  X, 
  Search,
  Crosshair
} from 'lucide-react';
import { CITIES } from '../data/hexahomeData';

export default function Header({ 
  selectedCity, 
  onSelectCity, 
  onOpenPostModal, 
  onOpenLoginModal, 
  onOpenAppModal,
  onSearch 
}) {
  const [findPropertiesOpen, setFindPropertiesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [stickyPropertyType, setStickyPropertyType] = useState('Residential Rent');
  const [stickyTypeOpen, setStickyTypeOpen] = useState(false);
  const [stickyQuery, setStickyQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      // Toggle sticky scrolled header appearance on scroll down
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.find-properties-wrapper')) {
        setFindPropertiesOpen(false);
      }
      if (!e.target.closest('.sticky-search-type-wrapper')) {
        setStickyTypeOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleStickySearch = (e) => {
    if (e) e.preventDefault();
    if (onSearch) {
      onSearch({
        type: stickyPropertyType,
        query: stickyQuery,
        city: selectedCity?.name
      });
    }
  };

  return (
    <header className={`header-wrapper w-full sm:h-[80px] xs:h-[60px] h-[46px] ${isScrolled ? 'is-scrolled-header' : ''}`}>
      <nav className={`main-nav-bar ${isScrolled ? 'nav-scrolled' : ''}`}>
        <div className="nav-container-fixed">
          {/* Left: Official HexaHome Logo SVG + "Find Properties ⌵" Pill */}
          <div className="nav-left-section">
            <a href="/" className="brand-logo-link" aria-label="HexaHome Home">
              {/* Desktop Full Logo SVG (House + Hexagon + HEXAHOME) */}
              <svg 
                className="desktop-logo-svg"
                viewBox="0 0 184 36" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  fillRule="evenodd" 
                  clipRule="evenodd" 
                  d="M.98 14.39a7.22 7.22 0 0 0-.02 7.232L7.207 32.47a7 7 0 0 0 6.06 3.53h13.375a6.96 6.96 0 0 0 4.66-1.797l-4.18-4.216a13.45 13.45 0 0 1-7.288 2.148c-7.534 0-13.627-6.148-13.627-13.75S12.3 4.634 19.834 4.634c7.533 0 13.626 6.148 13.626 13.75 0 3.138-1.058 6.004-2.805 8.317l3.41 3.432 4.955-8.494a7.22 7.22 0 0 0-.005-7.275L32.651 3.487A7 7 0 0 0 26.615 0h-13.24a7 7 0 0 0-6.04 3.496zm18.854-6.52c5.77 0 10.42 4.691 10.42 10.514 0 5.824-4.65 10.516-10.42 10.516-5.771 0-10.42-4.692-10.42-10.515s4.649-10.516 10.42-10.516m6.137 11.158c.44 0 .823-.293.978-.746.155-.454.04-.953-.276-1.257l-5.477-5.702a1.627 1.627 0 0 0-2.392 0l-5.463 5.689a1.22 1.22 0 0 0-.29 1.27c.155.454.538.746.977.746h.358v5.658c0 .284.21.514.468.514h2.807v-3.6c0-1.418 1.05-2.572 2.34-2.572s2.338 1.154 2.338 2.572v3.6h2.807c.258 0 .468-.23.468-.514v-5.658z" 
                  fill={isScrolled ? "#0284c7" : "#ffffff"}
                />
                <path 
                  d="M55.76 6.4h5.6V26h-5.6v-7.224H51V26h-5.6V6.4H51v6.944h4.76zm12.738 14.364q.672 1.4 2.856 1.4 1.288 0 2.38-.896l3.388 2.856q-2.1 2.268-5.936 2.268-3.584 0-5.768-2.072-2.157-2.1-2.156-5.264 0-3.192 2.1-5.32 2.128-2.128 5.348-2.128 3.192 0 5.236 2.1 2.072 2.072 2.072 5.236 0 .924-.224 1.82zm-.084-3.332h4.704q-.475-1.68-2.268-1.68-1.82 0-2.436 1.68M93.674 26h-5.74l-2.24-3.136L83.455 26h-5.74l5.125-7.168L77.94 12h5.74l2.016 2.828L87.71 12h5.74l-4.872 6.832zm9.693-14h5.18v14h-5.18v-1.26q-1.344 1.652-3.752 1.652-2.828 0-4.62-2.1-1.791-2.1-1.792-5.292 0-3.192 1.792-5.292t4.62-2.1q2.408 0 3.752 1.652zm-4.312 8.876q.7.756 1.82.756t1.792-.756q.7-.756.7-1.876t-.7-1.876q-.672-.756-1.792-.756t-1.82.756q-.672.756-.672 1.876t.672 1.876M121.44 6.4h5.6V26h-5.6v-7.224h-4.76V26h-5.6V6.4h5.6v6.944h4.76zm15.034 19.992q-3.137 0-5.348-2.128-2.184-2.128-2.184-5.264 0-3.135 2.184-5.264 2.183-2.128 5.348-2.128t5.348 2.128T144.006 19q0 3.135-2.184 5.264-2.184 2.128-5.348 2.128m-1.708-5.6q.672.672 1.708.672 1.035 0 1.68-.672.672-.7.672-1.792t-.672-1.764q-.645-.7-1.68-.7-1.036 0-1.708.7-.644.672-.644 1.764t.644 1.792m27.39-9.184q2.436 0 3.808 1.54 1.371 1.512 1.372 4.34V26h-5.18v-7.812q0-1.596-1.428-1.596-1.652 0-1.652 2.072V26h-5.18v-7.812q0-1.596-1.428-1.596-1.653 0-1.652 2.072V26h-5.18V12h5.18v1.316q1.371-1.708 3.808-1.708 2.408 0 3.5 1.736 1.512-1.736 4.032-1.736m11.834 9.156q.672 1.4 2.856 1.4 1.288 0 2.38-.896l3.388 2.856q-2.1 2.268-5.936 2.268-3.584 0-5.768-2.072-2.156-2.1-2.156-5.264 0-3.192 2.1-5.32 2.128-2.128 5.348-2.128 3.192 0 5.236 2.1 2.072 2.072 2.072 5.236 0 .924-.224 1.82zm-.084-3.332h4.704q-.476-1.68-2.268-1.68-1.82 0-2.436 1.68" 
                  fill={isScrolled ? "#033487" : "#ffffff"}
                />
              </svg>

              {/* Mobile compact Icon SVG */}
              <svg 
                className="mobile-logo-svg"
                viewBox="0 0 36 32" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  fillRule="evenodd" 
                  clipRule="evenodd" 
                  d="M.882 12.791a6.352 6.352 0 0 0-.018 6.428l5.622 9.643A6.315 6.315 0 0 0 11.94 32h12.037a6.308 6.308 0 0 0 4.194-1.597l-3.76-3.748a12.211 12.211 0 0 1-6.56 1.91c-6.78 0-12.265-5.466-12.265-12.223 0-6.758 5.484-12.223 12.264-12.223 6.78 0 12.264 5.465 12.264 12.223 0 2.789-.952 5.336-2.525 7.392l3.07 3.051 4.459-7.55a6.352 6.352 0 0 0-.005-6.467L29.386 3.1A6.315 6.315 0 0 0 23.953 0H12.038a6.315 6.315 0 0 0-5.436 3.107l-5.72 9.684ZM17.85 6.995c5.194 0 9.378 4.17 9.378 9.347 0 5.176-4.184 9.347-9.378 9.347-5.193 0-9.378-4.171-9.378-9.347 0-5.176 4.185-9.347 9.378-9.347Zm5.524 9.919c.396 0 .74-.26.88-.664.14-.403.037-.846-.249-1.117l-4.929-5.068a1.477 1.477 0 0 0-2.152 0l-4.917 5.056c-.298.283-.4.726-.261 1.13.139.403.484.663.88.663h.322v5.029c0 .252.188.457.42.457h2.527v-3.2c0-1.26.944-2.286 2.105-2.286 1.16 0 2.105 1.025 2.105 2.286v3.2h2.526c.233 0 .421-.205.421-.457v-5.029h.322Z" 
                  fill={isScrolled ? "#0284c7" : "#ffffff"}
                />
              </svg>
            </a>

            {/* "Find Properties ⌵" pill */}
            <div className="find-properties-wrapper">
              <button 
                type="button" 
                className="find-properties-btn"
                onClick={() => setFindPropertiesOpen(!findPropertiesOpen)}
                aria-expanded={findPropertiesOpen}
              >
                <span>Find Properties</span>
                <ChevronDown size={15} className={`chevron-icon transition-transform ${findPropertiesOpen ? 'rotate-180' : ''}`} />
              </button>

              {findPropertiesOpen && (
                <div className="find-dropdown-menu animate-fade-in">
                  <div className="dropdown-category-title">Select City / Region</div>
                  <div className="cities-dropdown-list">
                    {CITIES.map((city) => (
                      <button
                        key={city.id}
                        type="button"
                        className={`city-select-row ${selectedCity?.id === city.id ? 'city-active' : ''}`}
                        onClick={() => {
                          onSelectCity(city);
                          setFindPropertiesOpen(false);
                        }}
                      >
                        <span className="city-title-text">{city.name}</span>
                        <span className="city-count-text">{city.count}</span>
                      </button>
                    ))}
                  </div>

                  <div className="dropdown-divider" />
                  <div className="dropdown-category-title">Quick Categories</div>
                  <div className="quick-cat-links">
                    <a href="#properties-for-rent" onClick={() => setFindPropertiesOpen(false)}>Properties for Rent</a>
                    <a href="#properties-for-rent" onClick={() => setFindPropertiesOpen(false)}>Properties for Sale</a>
                    <a href="#action-banners" onClick={() => setFindPropertiesOpen(false)}>Commercial Spaces</a>
                    <a href="#emi-calculator" onClick={() => setFindPropertiesOpen(false)}>Home Loan Calculator</a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Center: In hero shows navigation links; in scrolled state shows sticky search bar */}
          <div className="nav-center-section desktop-only">
            {!isScrolled ? (
              <>
                <div className="nav-menu-pills">
                  <a href="#properties-for-rent" className="nav-menu-link">For Buyers</a>
                  <a href="#properties-for-rent" className="nav-menu-link">For Tenants</a>
                  <a href="#action-banners" className="nav-menu-link">For Owners</a>
                  <a href="#premium-ribbon" className="nav-menu-link">Pricings</a>
                </div>

                {/* Download App Link in Hero */}
                <button 
                  type="button" 
                  className="download-app-pill-link"
                  onClick={onOpenAppModal}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="download-app-svg">
                    <path d="M3.75 2.073c0-.92.746-1.667 1.667-1.667h9.166c.92 0 1.667.746 1.667 1.667v15.833c0 .92-.746 1.667-1.667 1.667H5.417c-.92 0-1.667-.746-1.667-1.667z" fill="#ffffff" />
                    <path d="M5 2.49c0-.46.373-.834.833-.834h8.334c.46 0 .833.373.833.834v12.916c0 .46-.373.834-.833.834H5.833A.833.833 0 0 1 5 15.406z" fill="#033487" />
                    <path d="M14.098 0H5.887a2.487 2.487 0 0 0-2.489 2.488v15.024A2.487 2.487 0 0 0 5.887 20h8.21a2.487 2.487 0 0 0 2.489-2.488V2.488A2.487 2.487 0 0 0 14.098 0m1.918 17.512c0 1.058-.86 1.914-1.918 1.918H5.887a1.92 1.92 0 0 1-1.918-1.918V2.488c0-1.058.86-1.914 1.918-1.918h8.21c1.06 0 1.915.86 1.919 1.918z" fill="#ffffff" />
                    <rect x="9.004" y="4" width="2" height="8" rx="1" fill="#ffffff" />
                  </svg>
                  <span>Download App</span>
                </button>
              </>
            ) : (
              /* Scrolled State: Compact Inline Search Console */
              <div className="sticky-search-capsule animate-fade-in">
                {/* Property Type Dropdown */}
                <div className="sticky-search-type-wrapper">
                  <button 
                    type="button" 
                    className="sticky-search-type-btn"
                    onClick={() => setStickyTypeOpen(!stickyTypeOpen)}
                    aria-expanded={stickyTypeOpen}
                  >
                    <span>{stickyPropertyType}</span>
                    <ChevronDown size={14} className={`chevron-icon transition-transform ${stickyTypeOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {stickyTypeOpen && (
                    <div className="sticky-search-type-dropdown animate-fade-in">
                      {[
                        'Residential Rent', 
                        'Residential Buy', 
                        'Commercial Rent', 
                        'Commercial Buy', 
                        'PG / Co-Living', 
                        'Plots'
                      ].map((type) => (
                        <button
                          key={type}
                          type="button"
                          className={`sticky-type-option ${stickyPropertyType === type ? 'active' : ''}`}
                          onClick={() => {
                            setStickyPropertyType(type);
                            setStickyTypeOpen(false);
                          }}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Vertical Divider */}
                <div className="sticky-search-divider" />

                {/* Locality Input + GPS Locate Icon */}
                <div className="sticky-search-input-wrapper">
                  <input 
                    type="text" 
                    className="sticky-search-input" 
                    placeholder="Type any locality" 
                    value={stickyQuery}
                    onChange={(e) => setStickyQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleStickySearch(e);
                    }}
                  />
                  <button 
                    type="button" 
                    className="sticky-locate-btn"
                    title="Detect my current location"
                    onClick={() => setStickyQuery(selectedCity?.name || 'Noida')}
                    aria-label="Locate"
                  >
                    <Crosshair size={16} />
                  </button>
                </div>

                {/* Search Button */}
                <button 
                  type="button" 
                  className="sticky-search-btn"
                  onClick={handleStickySearch}
                  aria-label="Search properties"
                >
                  <Search size={14} strokeWidth={2.4} />
                  <span>Search</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Actions: Download App (when scrolled) + Post Property [FREE] + Login ⌵ + Hamburger menu */}
          <div className="nav-right-section">
            {isScrolled && (
              <button 
                type="button" 
                className="download-app-link-scrolled desktop-only"
                onClick={onOpenAppModal}
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.098 0H5.887a2.487 2.487 0 0 0-2.489 2.488v15.024A2.487 2.487 0 0 0 5.887 20h8.21a2.487 2.487 0 0 0 2.489-2.488V2.488A2.487 2.487 0 0 0 14.098 0m1.918 17.512c0 1.058-.86 1.914-1.918 1.918H5.887a1.92 1.92 0 0 1-1.918-1.918V2.488c0-1.058.86-1.914 1.918-1.918h8.21c1.06 0 1.915.86 1.919 1.918z" fill="#1f2937" />
                  <rect x="9" y="3.5" width="2" height="7.5" rx="1" fill="#1f2937" />
                  <path d="M7 8.5L10 11.5L13 8.5" stroke="#1f2937" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Download App</span>
              </button>
            )}

            <button 
              type="button" 
              className="post-property-capsule"
              onClick={onOpenPostModal}
            >
              <span className="post-text">Post Property</span>
              <span className="badge-free-green">FREE</span>
            </button>

            {/* Login trigger */}
            <button 
              type="button" 
              className="nav-login-trigger desktop-only"
              onClick={onOpenLoginModal}
            >
              <span>Login</span>
              <ChevronDown size={15} />
            </button>

            {/* Hamburger Menu Icon */}
            <button 
              type="button" 
              className="nav-hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X size={26} color={isScrolled ? "#1f2937" : "#ffffff"} />
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isScrolled ? "#1f2937" : "#ffffff"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-nav-drawer animate-fade-in">
            <div className="mobile-nav-links">
              <a href="#properties-for-rent" onClick={() => setMobileMenuOpen(false)}>For Buyers</a>
              <a href="#properties-for-rent" onClick={() => setMobileMenuOpen(false)}>For Tenants</a>
              <a href="#action-banners" onClick={() => setMobileMenuOpen(false)}>For Owners</a>
              <a href="#premium-ribbon" onClick={() => setMobileMenuOpen(false)}>Pricings</a>
              <a href="#emi-calculator" onClick={() => setMobileMenuOpen(false)}>EMI Calculator</a>
              <a href="#faq-section" onClick={() => setMobileMenuOpen(false)}>FAQs & Help</a>
            </div>

            <div className="mobile-drawer-bottom">
              <button 
                type="button" 
                className="mobile-login-action"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLoginModal();
                }}
              >
                Login or Sign Up
              </button>
              <button 
                type="button" 
                className="mobile-download-action"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAppModal();
                }}
              >
                Download HexaHome App
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
