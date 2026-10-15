import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronDown, 
  X, 
  Search, 
  Crosshair, 
  Building, 
  Home, 
  CheckCircle, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  MapPin, 
  User, 
  UserPlus,
  Key, 
  Check, 
  Compass, 
  CreditCard, 
  PlusCircle, 
  LogIn, 
  LogOut, 
  Phone, 
  Mail,
  Clock,
  Info,
  FileText,
  Smartphone,
  Activity,
  Crown,
  Headphones
} from 'lucide-react';
import { CITIES } from '../data/hexahomeData';
import CustomDropdown from './CustomDropdown';
import AccountSidebarDrawer from './AccountSidebarDrawer';

export default function Header({ 
  selectedCity, 
  onSelectCity, 
  onOpenPostModal, 
  onOpenLoginModal, 
  onOpenAppModal, 
  onSearch, 
  onNavigate, 
  currentUser, 
  onLogout 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDrawerOpen, setAccountDrawerOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState(null); // 'city' | 'buyers' | 'tenants' | 'owners'
  const [isScrolled, setIsScrolled] = useState(false);
  const [stickyPropertyType, setStickyPropertyType] = useState('Residential Rent');
  const [stickyQuery, setStickyQuery] = useState('');
  
  // Single coordinated active dropdown state:
  // 'findProperties' | 'buyers' | 'tenants' | 'owners' | 'pricings' | 'login' | 'profile' | 'stickyType' | 'exploreScrolled' | null
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Active top-level modal: 'activity' | 'about' | 'terms' | 'faq' | 'experts' | 'comparePlans' | null
  const [activeModal, setActiveModal] = useState(null);

  // Search filter for cities in custom city dropdown
  const [citySearchFilter, setCitySearchFilter] = useState('');

  // Helper to safely parse user from localStorage
  const parseStoredUser = () => {
    try {
      const stored = localStorage.getItem('hexahome_user');
      if (!stored) return null;
      const parsed = typeof stored === 'string' ? JSON.parse(stored) : stored;
      if (parsed && typeof parsed === 'object') {
        if (parsed.user && typeof parsed.user === 'object') return parsed.user;
        if (parsed.data && typeof parsed.data === 'object') return parsed.data;
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  };

  // Synchronized authenticated user state
  const [storedUser, setStoredUser] = useState(() => parseStoredUser());
  const user = currentUser !== undefined ? currentUser : storedUser;

  useEffect(() => {
    const handleAuthChange = () => {
      setStoredUser(parseStoredUser());
    };
    window.addEventListener('hexahome_auth_changed', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    return () => {
      window.removeEventListener('hexahome_auth_changed', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Compute boolean whether user is truly logged in
  const isLoggedIn = Boolean(user && (user.name || user.phone || user.id || user.email));

  // Compute user display name
  const getUserDisplayName = (u) => {
    if (!u) return '';
    if (typeof u === 'string') return u;
    if (u.name && u.name.trim()) return u.name.trim();
    if (u.fullName && u.fullName.trim()) return u.fullName.trim();
    if (u.firstName) return `${u.firstName} ${u.lastName || ''}`.trim();
    if (u.username) return u.username;
    if (u.phone) return `+91 ${u.phone}`;
    if (u.email) return u.email.split('@')[0];
    return 'User';
  };

  const displayName = getUserDisplayName(user);

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  };

  const getRoleLabel = (roles) => {
    if (!roles) return 'Member';
    const str = Array.isArray(roles) ? roles.join(' ') : (typeof roles === 'object' && roles.size ? Array.from(roles).join(' ') : String(roles));
    if (str.includes('BUILDER')) return 'Builder';
    if (str.includes('AGENT')) return 'Agent';
    if (str.includes('OWNER') || str.includes('LANDLORD')) return 'Owner';
    if (str.includes('BUYER')) return 'Buyer';
    if (str.includes('TENANT')) return 'Tenant';
    return 'Member';
  };

  const handleLogoutClick = () => {
    setActiveDropdown(null);
    localStorage.removeItem('hexahome_token');
    localStorage.removeItem('hexahome_refresh_token');
    localStorage.removeItem('hexahome_user');
    setStoredUser(null);
    if (onLogout) onLogout();
    window.dispatchEvent(new Event('hexahome_auth_changed'));
  };

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

  const cityName = selectedCity?.name || 'Noida';

  const handleCategoryClick = (categoryFilter) => {
    setActiveDropdown(null);
    if (onNavigate) {
      onNavigate('/');
    }
    setTimeout(() => {
      const target = document.getElementById('properties-for-rent');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
      if (onSearch) {
        onSearch({ category: categoryFilter, city: cityName });
      }
    }, 100);
  };

  // Filtered cities list for Custom City Dropdown
  const filteredCities = useMemo(() => {
    if (!citySearchFilter.trim()) return CITIES;
    const q = citySearchFilter.toLowerCase().trim();
    return CITIES.filter(c => c.name.toLowerCase().includes(q));
  }, [citySearchFilter]);

  const popularCities = useMemo(() => {
    return CITIES.filter(c => c.popular);
  }, []);

  return (
    <header className={`header-wrapper w-full sm:h-[80px] xs:h-[60px] h-[52px] ${isScrolled ? 'is-scrolled-header' : ''}`}>
      <nav className={`main-nav-bar ${isScrolled ? 'nav-scrolled' : ''}`}>
        <div className="nav-container-fixed">
          
          {/* ========================================================
              LEFT: Official HexaHome Logo SVG + Custom City Dropdown
             ======================================================== */}
          <div className="nav-left-section">
            <button 
              type="button" 
              onClick={() => onNavigate ? onNavigate('/') : window.scrollTo({ top: 0, behavior: 'smooth' })} 
              className="brand-logo-link bg-transparent border-none p-0 cursor-pointer" 
              aria-label="HexaHome Home"
            >
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
            </button>

            {/* CUSTOM DROPDOWN: Find Properties / City Selector */}
            <CustomDropdown
              id="find-properties-custom-dropdown"
              isOpen={activeDropdown === 'findProperties'}
              onOpenChange={(open) => setActiveDropdown(open ? 'findProperties' : null)}
              align="left"
              width={350}
              offset={10}
              trigger={({ isOpen }) => (
                <div 
                  className={`find-properties-btn flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                    isOpen ? 'ring-2 ring-blue-400/50 bg-white/40' : ''
                  }`}
                  role="button"
                  tabIndex={0}
                >
                  <MapPin size={15} className={isScrolled ? "text-[#033487]" : "text-white/90"} />
                  <span className="font-semibold text-sm">
                    {selectedCity ? selectedCity.name : 'Find Properties'}
                  </span>
                  <ChevronDown 
                    size={14} 
                    className={`chevron-icon transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                  />
                </div>
              )}
            >
              {({ close }) => (
                <div className="p-4 bg-white text-gray-800">
                  {/* City Search Filter Input */}
                  <div className="relative mb-3">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={citySearchFilter}
                      onChange={(e) => setCitySearchFilter(e.target.value)}
                      placeholder="Search city or locality..."
                      className="w-full pl-8 pr-7 py-2 text-xs bg-gray-50 hover:bg-gray-100/70 focus:bg-white border border-gray-200 focus:border-[#033487] rounded-xl outline-none transition font-medium text-gray-700"
                      onClick={(e) => e.stopPropagation()}
                    />
                    {citySearchFilter && (
                      <button
                        type="button"
                        onClick={() => setCitySearchFilter('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Popular Cities Quick Pills */}
                  {!citySearchFilter && (
                    <div className="mb-3">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 flex items-center gap-1">
                        <Sparkles size={11} className="text-amber-500" />
                        <span>Popular Metro Cities</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {popularCities.slice(0, 5).map((city) => (
                          <button
                            key={city.id}
                            type="button"
                            onClick={() => {
                              onSelectCity(city);
                              close();
                            }}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition cursor-pointer border ${
                              selectedCity?.id === city.id 
                                ? 'bg-[#033487] text-white border-[#033487] shadow-sm' 
                                : 'bg-gray-50 hover:bg-blue-50 text-gray-700 border-gray-200 hover:border-blue-200'
                            }`}
                          >
                            {city.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* All Cities Scrollable List */}
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                    {citySearchFilter ? `Search Results (${filteredCities.length})` : 'All Available Cities'}
                  </div>
                  <div className="max-h-[190px] overflow-y-auto divide-y divide-gray-50 pr-1">
                    {filteredCities.length > 0 ? (
                      filteredCities.map((city) => {
                        const isSelected = selectedCity?.id === city.id;
                        return (
                          <button
                            key={city.id}
                            type="button"
                            className={`w-full flex items-center justify-between py-2 px-2.5 rounded-lg transition text-left cursor-pointer ${
                              isSelected 
                                ? 'bg-blue-50/80 text-[#033487] font-bold' 
                                : 'hover:bg-gray-50 text-gray-700'
                            }`}
                            onClick={() => {
                              onSelectCity(city);
                              close();
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <MapPin size={13} className={isSelected ? 'text-[#033487]' : 'text-gray-400'} />
                              <span className="text-xs font-semibold">{city.name}</span>
                              {city.popular && (
                                <span className="bg-amber-100 text-amber-700 text-[9px] font-bold px-1.5 py-0.2 rounded">
                                  HOT
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] text-gray-400 font-medium">{city.count}</span>
                              {isSelected && <Check size={14} className="text-[#033487]" />}
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className="py-6 text-center text-xs text-gray-400">
                        No cities found matching "{citySearchFilter}"
                      </div>
                    )}
                  </div>

                  {/* Quick Direct Category Shortcuts */}
                  <div className="mt-3 pt-2.5 border-t border-gray-100 flex flex-col gap-1">
                    <button 
                      type="button"
                      className="text-left py-1.5 px-2 hover:bg-blue-50/70 rounded-lg text-xs font-semibold text-gray-700 hover:text-[#033487] flex items-center justify-between transition cursor-pointer"
                      onClick={() => {
                        close();
                        handleCategoryClick('Residential Rent');
                      }}
                    >
                      <span>Properties for Rent in {cityName}</span>
                      <ArrowRight size={12} className="text-gray-400" />
                    </button>
                    <button 
                      type="button"
                      className="text-left py-1.5 px-2 hover:bg-blue-50/70 rounded-lg text-xs font-semibold text-gray-700 hover:text-[#033487] flex items-center justify-between transition cursor-pointer"
                      onClick={() => {
                        close();
                        handleCategoryClick('Residential Buy');
                      }}
                    >
                      <span>Properties for Sale in {cityName}</span>
                      <ArrowRight size={12} className="text-gray-400" />
                    </button>
                    <button 
                      type="button"
                      className="text-left py-1.5 px-2 hover:bg-blue-50/70 rounded-lg text-xs font-semibold text-gray-700 hover:text-[#033487] flex items-center justify-between transition cursor-pointer"
                      onClick={() => {
                        close();
                        handleCategoryClick('Commercial');
                      }}
                    >
                      <span>Commercial Spaces in {cityName}</span>
                      <ArrowRight size={12} className="text-gray-400" />
                    </button>
                  </div>
                </div>
              )}
            </CustomDropdown>
          </div>

          {/* ========================================================
              CENTER: Navigation Menu Pills (Hero) OR Sticky Search Bar
             ======================================================== */}
          <div className="nav-center-section desktop-only">
            {!isScrolled ? (
              <>
                <div className="nav-menu-pills flex items-center gap-1 sm:gap-2">
                  
                  {/* 1. CUSTOM DROPDOWN: For Buyers */}
                  <CustomDropdown
                    id="buyers-custom-dropdown"
                    isOpen={activeDropdown === 'buyers'}
                    onOpenChange={(open) => setActiveDropdown(open ? 'buyers' : null)}
                    align="left"
                    width={580}
                    offset={6}
                    trigger={({ isOpen }) => (
                      <button 
                        type="button"
                        className={`nav-menu-link flex items-center gap-1 px-3.5 py-1.5 rounded-full text-[14.5px] font-medium transition cursor-pointer ${
                          isOpen 
                            ? 'bg-white/25 text-white font-semibold shadow-inner' 
                            : 'text-white hover:bg-white/15'
                        }`}
                      >
                        <span>For Buyers</span>
                        <ChevronDown size={13} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  >
                    {({ close }) => (
                      <div className="p-6 grid grid-cols-3 gap-6 bg-white">
                        {/* Col 1: Buy Categories */}
                        <div className="flex flex-col gap-2 border-r border-gray-100 pr-4">
                          <span className="text-[11px] font-bold text-[#033487] uppercase tracking-wider flex items-center gap-1">
                            <Home size={12} />
                            <span>Buy Categories</span>
                          </span>
                          <button 
                            type="button" 
                            onClick={() => { close(); handleCategoryClick('Residential Buy'); }}
                            className="text-left text-sm font-semibold text-gray-700 hover:text-[#033487] hover:bg-blue-50/70 p-2 rounded-xl transition cursor-pointer"
                          >
                            Buy A Home
                          </button>
                          <button 
                            type="button" 
                            onClick={() => { close(); handleCategoryClick('Commercial'); }}
                            className="text-left text-sm font-semibold text-gray-700 hover:text-[#033487] hover:bg-blue-50/70 p-2 rounded-xl transition cursor-pointer"
                          >
                            Commercial Property
                          </button>
                          <button 
                            type="button" 
                            onClick={() => { close(); handleCategoryClick('Plots'); }}
                            className="text-left text-sm font-semibold text-gray-700 hover:text-[#033487] hover:bg-blue-50/70 p-2 rounded-xl transition cursor-pointer"
                          >
                            Plots / Land
                          </button>
                          <button 
                            type="button" 
                            onClick={() => { close(); handleCategoryClick('Projects'); }}
                            className="text-left text-sm font-semibold text-gray-700 hover:text-[#033487] hover:bg-blue-50/70 p-2 rounded-xl transition cursor-pointer"
                          >
                            Builder Projects
                          </button>
                        </div>

                        {/* Col 2: Properties in City */}
                        <div className="flex flex-col gap-1.5 border-r border-gray-100 pr-4">
                          <span className="text-[11px] font-bold text-[#033487] uppercase tracking-wider flex items-center gap-1">
                            <Building size={12} />
                            <span>In {cityName}</span>
                          </span>
                          {['Apartments', 'Individual Floor', 'Independent House', 'Independent Villa', 'Plots / Land'].map((item) => (
                            <button 
                              key={item}
                              type="button" 
                              onClick={() => { close(); handleCategoryClick(item); }}
                              className="text-left text-xs font-medium text-gray-600 hover:text-[#033487] hover:bg-blue-50/60 p-1.5 rounded-lg transition cursor-pointer"
                            >
                              {item}
                            </button>
                          ))}
                        </div>

                        {/* Col 3: Popular Searches */}
                        <div className="flex flex-col gap-2">
                          <span className="text-[11px] font-bold text-[#033487] uppercase tracking-wider flex items-center gap-1">
                            <TrendingUp size={12} />
                            <span>Trending Searches</span>
                          </span>
                          {[
                            `Buy Apartments in ${cityName}`,
                            `Newly Listed Houses in ${cityName}`,
                            `Popular Localities in ${cityName}`,
                            `Exclusive Verified Projects`
                          ].map((search, i) => (
                            <button 
                              key={i}
                              type="button" 
                              onClick={() => { close(); handleCategoryClick(search); }}
                              className="text-left text-xs text-gray-500 hover:text-[#033487] hover:underline py-1 transition cursor-pointer flex items-center gap-1"
                            >
                              <ArrowRight size={10} className="text-gray-300" />
                              <span className="truncate">{search}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </CustomDropdown>

                  {/* 2. CUSTOM DROPDOWN: For Tenants */}
                  <CustomDropdown
                    id="tenants-custom-dropdown"
                    isOpen={activeDropdown === 'tenants'}
                    onOpenChange={(open) => setActiveDropdown(open ? 'tenants' : null)}
                    align="center"
                    width={580}
                    offset={6}
                    trigger={({ isOpen }) => (
                      <button 
                        type="button"
                        className={`nav-menu-link flex items-center gap-1 px-3.5 py-1.5 rounded-full text-[14.5px] font-medium transition cursor-pointer ${
                          isOpen 
                            ? 'bg-white/25 text-white font-semibold shadow-inner' 
                            : 'text-white hover:bg-white/15'
                        }`}
                      >
                        <span>For Tenants</span>
                        <ChevronDown size={13} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  >
                    {({ close }) => (
                      <div className="p-6 grid grid-cols-3 gap-6 bg-white">
                        {/* Col 1: Rent Categories */}
                        <div className="flex flex-col gap-2 border-r border-gray-100 pr-4">
                          <span className="text-[11px] font-bold text-[#033487] uppercase tracking-wider flex items-center gap-1">
                            <Key size={12} />
                            <span>Rent Categories</span>
                          </span>
                          <button 
                            type="button" 
                            onClick={() => { close(); handleCategoryClick('Residential Rent'); }}
                            className="text-left text-sm font-semibold text-gray-700 hover:text-[#033487] hover:bg-blue-50/70 p-2 rounded-xl transition cursor-pointer"
                          >
                            Rent A Home
                          </button>
                          <button 
                            type="button" 
                            onClick={() => { close(); handleCategoryClick('Commercial'); }}
                            className="text-left text-sm font-semibold text-gray-700 hover:text-[#033487] hover:bg-blue-50/70 p-2 rounded-xl transition cursor-pointer"
                          >
                            Commercial Rentals
                          </button>
                          <button 
                            type="button" 
                            onClick={() => { close(); handleCategoryClick('PG'); }}
                            className="text-left text-sm font-semibold text-gray-700 hover:text-[#033487] hover:bg-blue-50/70 p-2 rounded-xl transition cursor-pointer"
                          >
                            PG's & Hostels
                          </button>
                          <button 
                            type="button" 
                            onClick={() => { close(); handleCategoryClick('Co-Living'); }}
                            className="text-left text-sm font-semibold text-gray-700 hover:text-[#033487] hover:bg-blue-50/70 p-2 rounded-xl transition cursor-pointer"
                          >
                            Co-Living Spaces
                          </button>
                        </div>

                        {/* Col 2: Properties in City */}
                        <div className="flex flex-col gap-1.5 border-r border-gray-100 pr-4">
                          <span className="text-[11px] font-bold text-[#033487] uppercase tracking-wider flex items-center gap-1">
                            <Building size={12} />
                            <span>In {cityName}</span>
                          </span>
                          {['Apartments', 'Individual Floor', 'Independent House', 'Independent Villa', '1 RK/Studio Houses'].map((item) => (
                            <button 
                              key={item}
                              type="button" 
                              onClick={() => { close(); handleCategoryClick(item); }}
                              className="text-left text-xs font-medium text-gray-600 hover:text-[#033487] hover:bg-blue-50/60 p-1.5 rounded-lg transition cursor-pointer"
                            >
                              {item}
                            </button>
                          ))}
                        </div>

                        {/* Col 3: Popular Searches */}
                        <div className="flex flex-col gap-2">
                          <span className="text-[11px] font-bold text-[#033487] uppercase tracking-wider flex items-center gap-1">
                            <TrendingUp size={12} />
                            <span>Zero Brokerage</span>
                          </span>
                          {[
                            `Rental Homes in ${cityName}`,
                            `Furnished 2 BHK in ${cityName}`,
                            `Affordable PG / Hostels`,
                            `Near Tech Parks & Metros`
                          ].map((search, i) => (
                            <button 
                              key={i}
                              type="button" 
                              onClick={() => { close(); handleCategoryClick(search); }}
                              className="text-left text-xs text-gray-500 hover:text-[#033487] hover:underline py-1 transition cursor-pointer flex items-center gap-1"
                            >
                              <ArrowRight size={10} className="text-gray-300" />
                              <span className="truncate">{search}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </CustomDropdown>

                  {/* 3. CUSTOM DROPDOWN: For Owners */}
                  <CustomDropdown
                    id="owners-custom-dropdown"
                    isOpen={activeDropdown === 'owners'}
                    onOpenChange={(open) => setActiveDropdown(open ? 'owners' : null)}
                    align="center"
                    width={330}
                    offset={6}
                    trigger={({ isOpen }) => (
                      <button 
                        type="button"
                        className={`nav-menu-link flex items-center gap-1 px-3.5 py-1.5 rounded-full text-[14.5px] font-medium transition cursor-pointer ${
                          isOpen 
                            ? 'bg-white/25 text-white font-semibold shadow-inner' 
                            : 'text-white hover:bg-white/15'
                        }`}
                      >
                        <span>For Owners</span>
                        <ChevronDown size={13} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  >
                    {({ close }) => (
                      <div className="p-5 bg-white text-gray-800">
                        <span className="text-[11px] font-bold text-[#033487] uppercase tracking-wider block mb-3 flex items-center gap-1">
                          <ShieldCheck size={13} />
                          <span>Owner Privileges</span>
                        </span>
                        <div className="flex flex-col gap-2">
                          <button 
                            type="button" 
                            onClick={() => {
                              close();
                              if (onNavigate) onNavigate('/post-property');
                              else onOpenPostModal();
                            }}
                            className="flex items-center justify-between p-3 rounded-xl bg-blue-50/80 hover:bg-blue-100/80 text-left transition text-sm font-bold text-[#033487] cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <PlusCircle size={16} />
                              <span>Post Property Free</span>
                            </div>
                            <span className="bg-[#15770b] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                              FREE
                            </span>
                          </button>
                          <button 
                            type="button" 
                            onClick={() => {
                              close();
                              if (onNavigate) onNavigate('/post-property');
                            }}
                            className="text-left text-xs font-semibold text-gray-700 hover:text-[#033487] hover:bg-gray-50 p-2.5 rounded-lg transition cursor-pointer flex items-center justify-between"
                          >
                            <span>Zero Brokerage Tenant Matching</span>
                            <CheckCircle size={13} className="text-emerald-500" />
                          </button>
                          <button 
                            type="button" 
                            onClick={() => {
                              close();
                              if (onNavigate) onNavigate('/dashboard?tab=listings');
                            }}
                            className="text-left text-xs font-semibold text-gray-700 hover:text-[#033487] hover:bg-gray-50 p-2.5 rounded-lg transition cursor-pointer"
                          >
                            <span>Manage My Listings</span>
                          </button>
                          <button 
                            type="button" 
                            onClick={() => {
                              close();
                              if (onNavigate) onNavigate('/dashboard?tab=inquiries');
                            }}
                            className="text-left text-xs font-semibold text-gray-700 hover:text-[#033487] hover:bg-gray-50 p-2.5 rounded-lg transition cursor-pointer"
                          >
                            <span>Direct Buyer / Tenant Leads</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </CustomDropdown>

                  {/* 4. CUSTOM DROPDOWN: Pricings (Safe Right-Aligned) */}
                  <CustomDropdown
                    id="pricings-custom-dropdown"
                    isOpen={activeDropdown === 'pricings'}
                    onOpenChange={(open) => setActiveDropdown(open ? 'pricings' : null)}
                    align="right"
                    width={360}
                    offset={6}
                    trigger={({ isOpen }) => (
                      <button 
                        type="button"
                        className={`nav-menu-link flex items-center gap-1 px-3.5 py-1.5 rounded-full text-[14.5px] font-medium transition cursor-pointer ${
                          isOpen 
                            ? 'bg-white/25 text-white font-semibold shadow-inner' 
                            : 'text-white hover:bg-white/15'
                        }`}
                      >
                        <span>Pricings</span>
                        <ChevronDown size={13} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  >
                    {({ close }) => (
                      <div className="p-5 bg-white text-gray-800">
                        <span className="text-[11px] font-bold text-[#033487] uppercase tracking-wider block mb-3 flex items-center gap-1">
                          <CreditCard size={13} />
                          <span>Verified Pricing Plans</span>
                        </span>
                        <div className="flex flex-col gap-2.5">
                          <div className="p-3 rounded-xl border border-gray-100 bg-[#f8fafc] hover:border-blue-200 transition flex justify-between items-center">
                            <div>
                              <div className="text-xs font-bold text-[#1e293b]">Freemium User Plan</div>
                              <div className="text-[11px] text-gray-500">10 listings • 2 contact unlocks</div>
                            </div>
                            <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                              ₹0 Free
                            </span>
                          </div>

                          <div className="p-3 rounded-xl border border-gray-100 bg-[#f8fafc] hover:border-blue-200 transition flex justify-between items-center">
                            <div>
                              <div className="text-xs font-bold text-[#1e293b]">Agent Pro (60 Days)</div>
                              <div className="text-[11px] text-gray-500">15 listings • 150 contacts • 3X Leads</div>
                            </div>
                            <span className="text-xs font-bold text-[#033487] bg-blue-50 px-2.5 py-0.5 rounded-full">
                              ₹3,999
                            </span>
                          </div>

                          <div className="p-3 rounded-xl border border-gray-100 bg-[#f8fafc] hover:border-blue-200 transition flex justify-between items-center">
                            <div>
                              <div className="text-xs font-bold text-[#1e293b]">Agent Pro Plus</div>
                              <div className="text-[11px] text-gray-500">25 listings • 300 contacts • 5X Exposure</div>
                            </div>
                            <span className="text-xs font-bold text-[#033487] bg-blue-50 px-2.5 py-0.5 rounded-full">
                              ₹7,999
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              close();
                              onOpenPostModal();
                            }}
                            className="mt-1 w-full py-2.5 bg-[#033487] hover:bg-[#022c70] text-white text-xs font-bold rounded-xl transition text-center cursor-pointer shadow-sm"
                          >
                            View All Features & Subscribe →
                          </button>
                        </div>
                      </div>
                    )}
                  </CustomDropdown>

                </div>

                {/* Download App Pill */}
                <button 
                  type="button" 
                  className="download-app-pill-link flex items-center gap-1.5 text-white hover:bg-white/20 px-3 py-1.5 rounded-full text-sm font-medium transition cursor-pointer"
                  onClick={onOpenAppModal}
                >
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.75 2.073c0-.92.746-1.667 1.667-1.667h9.166c.92 0 1.667.746 1.667 1.667v15.833c0 .92-.746 1.667-1.667 1.667H5.417c-.92 0-1.667-.746-1.667-1.667z" fill="#ffffff" />
                    <path d="M5 2.49c0-.46.373-.834.833-.834h8.334c.46 0 .833.373.833.834v12.916c0 .46-.373.834-.833.834H5.833A.833.833 0 0 1 5 15.406z" fill="#033487" />
                    <path d="M14.098 0H5.887a2.487 2.487 0 0 0-2.489 2.488v15.024A2.487 2.487 0 0 0 5.887 20h8.21a2.487 2.487 0 0 0 2.489-2.488V2.488A2.487 2.487 0 0 0 14.098 0m1.918 17.512c0 1.058-.86 1.914-1.918 1.918H5.887a1.92 1.92 0 0 1-1.918-1.918V2.488c0-1.058.86-1.914 1.918-1.918h8.21c1.06 0 1.915.86 1.919 1.918z" fill="#ffffff" />
                    <rect x="9.004" y="4" width="2" height="8" rx="1" fill="#ffffff" />
                  </svg>
                  <span>App</span>
                </button>
              </>
            ) : (
              /* Scrolled State: Sticky Search Capsule + Scrolled Explore Dropdown */
              <div className="flex items-center gap-2">
                
                {/* Scrolled Quick Explore Dropdown to prevent navigation loss */}
                <CustomDropdown
                  id="scrolled-explore-custom-dropdown"
                  isOpen={activeDropdown === 'exploreScrolled'}
                  onOpenChange={(open) => setActiveDropdown(open ? 'exploreScrolled' : null)}
                  align="left"
                  width={220}
                  offset={6}
                  trigger={({ isOpen }) => (
                    <button
                      type="button"
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        isOpen 
                          ? 'bg-blue-50 border-[#033487] text-[#033487]' 
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Compass size={14} className="text-[#033487]" />
                      <span>Explore</span>
                      <ChevronDown size={13} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                >
                  {({ close }) => (
                    <div className="p-2 flex flex-col gap-1 text-xs font-semibold bg-white">
                      <button 
                        type="button" 
                        onClick={() => { close(); handleCategoryClick('Residential Buy'); }}
                        className="p-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-[#033487] text-left transition flex items-center justify-between"
                      >
                        <span>For Buyers</span>
                        <ArrowRight size={12} className="text-gray-400" />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => { close(); handleCategoryClick('Residential Rent'); }}
                        className="p-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-[#033487] text-left transition flex items-center justify-between"
                      >
                        <span>For Tenants</span>
                        <ArrowRight size={12} className="text-gray-400" />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => {
                          close();
                          if (onNavigate) onNavigate('/post-property');
                          else onOpenPostModal();
                        }}
                        className="p-2 rounded-lg hover:bg-blue-50 text-[#033487] font-bold text-left transition flex items-center justify-between"
                      >
                        <span>Post Property Free</span>
                        <span className="bg-[#15770b] text-white text-[9px] px-1.5 py-0.2 rounded-full">FREE</span>
                      </button>
                      <button 
                        type="button" 
                        onClick={() => { close(); onOpenPostModal(); }}
                        className="p-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-[#033487] text-left transition flex items-center justify-between"
                      >
                        <span>Pricings & Plans</span>
                        <ArrowRight size={12} className="text-gray-400" />
                      </button>
                    </div>
                  )}
                </CustomDropdown>

                {/* Sticky Inline Search Capsule */}
                <div className="sticky-search-capsule animate-fade-in">
                  {/* Property Type Custom Dropdown in Sticky Bar */}
                  <CustomDropdown
                    id="sticky-search-type-dropdown"
                    isOpen={activeDropdown === 'stickyType'}
                    onOpenChange={(open) => setActiveDropdown(open ? 'stickyType' : null)}
                    align="left"
                    width={190}
                    offset={8}
                    hoverable={false}
                    trigger={({ isOpen }) => (
                      <div className="sticky-search-type-btn flex items-center gap-1.5 py-1 px-2 cursor-pointer">
                        <span className="text-xs font-semibold text-gray-800">{stickyPropertyType}</span>
                        <ChevronDown size={13} className={`chevron-icon transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                      </div>
                    )}
                  >
                    {({ close }) => (
                      <div className="py-1 bg-white">
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
                            className={`w-full text-left px-3 py-2 text-xs font-medium transition cursor-pointer flex items-center justify-between ${
                              stickyPropertyType === type 
                                ? 'bg-blue-50 text-[#033487] font-bold' 
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                            onClick={() => {
                              setStickyPropertyType(type);
                              close();
                            }}
                          >
                            <span>{type}</span>
                            {stickyPropertyType === type && <Check size={13} className="text-[#033487]" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </CustomDropdown>

                  <div className="sticky-search-divider" />

                  {/* Locality Input + GPS Locate Icon */}
                  <div className="sticky-search-input-wrapper">
                    <input 
                      type="text" 
                      className="sticky-search-input text-xs" 
                      placeholder="Type locality or area..." 
                      value={stickyQuery}
                      onChange={(e) => setStickyQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleStickySearch(e);
                      }}
                    />
                    <button 
                      type="button" 
                      className="sticky-locate-btn"
                      title="Detect current location"
                      onClick={() => setStickyQuery(selectedCity?.name || 'Noida')}
                      aria-label="Locate"
                    >
                      <Crosshair size={15} />
                    </button>
                  </div>

                  {/* Search Button */}
                  <button 
                    type="button" 
                    className="sticky-search-btn"
                    onClick={handleStickySearch}
                    aria-label="Search properties"
                  >
                    <Search size={13} strokeWidth={2.4} />
                    <span>Search</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ========================================================
              RIGHT: Post Property [FREE] + Custom Login/Profile Dropdown
             ======================================================== */}
          <div className="nav-right-section flex items-center gap-2.5">
            {/* Post Property Capsule Button */}
            <button 
              type="button" 
              className="post-property-capsule flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-[#033487] font-semibold text-xs shadow-sm hover:scale-105 transition cursor-pointer"
              onClick={() => onNavigate ? onNavigate('/post-property') : onOpenPostModal()}
            >
              <span className="post-text whitespace-nowrap">Post Property</span>
              <span className="badge-free-green bg-[#15770b] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                FREE
              </span>
            </button>

            {/* Authenticated User Profile Dropdown OR Guest Login Custom Dropdown */}
            {isLoggedIn ? (
              <CustomDropdown
                id="user-profile-custom-dropdown"
                isOpen={activeDropdown === 'profile'}
                onOpenChange={(open) => setActiveDropdown(open ? 'profile' : null)}
                hoverable={false}
                align="right"
                width={280}
                offset={8}
                trigger={({ isOpen }) => (
                  <div 
                    style={isScrolled ? {
                      backgroundColor: '#eff6ff',
                      color: '#033487',
                      borderColor: '#bfdbfe'
                    } : {
                      backgroundColor: 'rgba(255, 255, 255, 0.25)',
                      color: '#ffffff',
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      backdropFilter: 'blur(8px)'
                    }}
                    className={`nav-profile-trigger flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer border shadow-sm hover:scale-[1.02] ${
                      isOpen ? 'ring-2 ring-blue-400/80 shadow-md' : ''
                    }`}
                    role="button"
                    tabIndex={0}
                    title={`Logged in as ${displayName}`}
                  >
                    {/* User Avatar Initials or Photo */}
                    <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-tr from-[#0284c7] to-[#033487] text-white text-[10.5px] font-bold ring-1 ring-white/60 shrink-0">
                      {user.profilePicUrl ? (
                        <img src={user.profilePicUrl} alt={displayName} className="w-full h-full object-cover" />
                      ) : (
                        <span>{getInitials(displayName)}</span>
                      )}
                    </div>
                    {/* Prominent User Name Display */}
                    <span className="max-w-[130px] truncate text-xs font-bold tracking-tight">
                      {displayName}
                    </span>
                    <ChevronDown size={13} className={`transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                )}
              >
                {({ close }) => (
                  <div className="p-3.5 bg-white text-gray-800 rounded-2xl shadow-2xl border border-gray-100 flex flex-col select-none">
                    {/* 1. User Profile Information Card */}
                    <div className="flex items-center gap-3 pb-3 border-b border-gray-100 bg-blue-50/60 p-3 rounded-xl mb-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-tr from-[#0284c7] to-[#033487] text-white flex items-center justify-center text-sm font-bold shrink-0 ring-2 ring-blue-200 shadow-sm">
                        {user.profilePicUrl ? (
                          <img src={user.profilePicUrl} alt={displayName} className="w-full h-full object-cover" />
                        ) : (
                          <span>{getInitials(displayName)}</span>
                        )}
                      </div>
                      <div className="overflow-hidden flex-1 min-w-0">
                        <div className="font-bold text-sm text-[#033487] truncate flex items-center gap-1.5">
                          <span className="truncate">{displayName}</span>
                          <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                        </div>
                        {user.phone && (
                          <div className="text-[12px] text-gray-700 font-semibold flex items-center gap-1.5 mt-0.5 whitespace-nowrap">
                            <Phone size={11} className="text-gray-400 shrink-0" />
                            <span>+91 {user.phone}</span>
                            <span className="text-emerald-600 font-bold text-[11px]">✓</span>
                          </div>
                        )}
                        {user.email && (
                          <div className="text-[11px] text-gray-400 truncate font-normal flex items-center gap-1 mt-0.5">
                            <Mail size={11} className="text-gray-400 shrink-0" />
                            <span className="truncate">{user.email}</span>
                          </div>
                        )}
                        <div className="mt-1.5">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-blue-100/90 text-[#033487] border border-blue-200">
                            {getRoleLabel(user.roles || user.role)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 2. ONLY Logout Button (All navigation items are now in the Account Sidebar Drawer) */}
                    <button
                      type="button"
                      onClick={() => {
                        close();
                        handleLogoutClick();
                      }}
                      style={{
                        backgroundColor: '#dc2626',
                        color: '#ffffff',
                        border: 'none',
                        boxShadow: '0 3px 10px rgba(220, 38, 38, 0.35)'
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-white text-xs font-bold hover:bg-red-700 active:scale-[0.98] transition cursor-pointer"
                    >
                      <LogOut size={16} className="text-white shrink-0" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </CustomDropdown>
            ) : (
              /* GUEST CUSTOM DROPDOWN: Exact Match with Provided Design */
              <CustomDropdown
                id="guest-login-custom-dropdown"
                isOpen={activeDropdown === 'login'}
                onOpenChange={(open) => setActiveDropdown(open ? 'login' : null)}
                hoverable={true}
                hoverDelay={250}
                align="right"
                width={260}
                offset={10}
                trigger={({ isOpen }) => (
                  <button 
                    type="button" 
                    className={`nav-login-trigger flex items-center gap-1 px-2 py-1 text-[15px] font-semibold transition cursor-pointer select-none ${
                      isScrolled 
                        ? 'text-[#033487] hover:text-blue-900' 
                        : 'text-white hover:text-white/90'
                    }`}
                  >
                    <span>Login</span>
                    <ChevronDown 
                      size={15} 
                      strokeWidth={2.4} 
                      className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                    />
                  </button>
                )}
              >
                {({ close }) => (
                  <div className="pt-4 pb-4 px-5 bg-white text-gray-800 flex flex-col select-none">
                    {/* 1. Header: My Activity with extending divider line */}
                    <div className="flex items-center gap-3 pt-0.5 pb-3.5">
                      <button
                        type="button"
                        onClick={() => {
                          close();
                          setActiveModal('activity');
                        }}
                        className="text-[#64748b] hover:text-[#033487] text-[14px] font-medium transition-colors cursor-pointer text-left whitespace-nowrap"
                      >
                        My Activity
                      </button>
                      <div className="flex-1 h-[1px] bg-gray-200" />
                    </div>

                    {/* 2. Menu Links (Clean text without icons, matching design) */}
                    <div className="flex flex-col gap-3 py-1 text-[15px] font-medium text-[#111827]">
                      <button
                        type="button"
                        onClick={() => {
                          close();
                          if (onNavigate) onNavigate('/post-property');
                          else onOpenPostModal();
                        }}
                        className="text-left text-[#111827] hover:text-[#033487] transition-colors cursor-pointer py-0.5"
                      >
                        Post Property
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          close();
                          setActiveModal('about');
                        }}
                        className="text-left text-[#111827] hover:text-[#033487] transition-colors cursor-pointer py-0.5"
                      >
                        About Us
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          close();
                          setActiveModal('terms');
                        }}
                        className="text-left text-[#111827] hover:text-[#033487] transition-colors cursor-pointer py-0.5"
                      >
                        Terms & Condition
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          close();
                          onOpenAppModal();
                        }}
                        className="text-left text-[#111827] hover:text-[#033487] transition-colors cursor-pointer py-0.5"
                      >
                        Download App
                      </button>
                    </div>

                    {/* 3. Horizontal Divider Line (Edge to Edge) */}
                    <div className="h-[1px] bg-gray-100 my-4 -mx-5" />

                    {/* 4. Bottom Prominent Pill Button: Login/Signup */}
                    <button
                      type="button"
                      onClick={() => {
                        close();
                        if (onNavigate) onNavigate('/auth?mode=login');
                        else onOpenLoginModal();
                      }}
                      style={{
                        backgroundColor: '#033487'
                      }}
                      className="w-full py-2.5 px-4 rounded-full text-white text-[15px] font-bold tracking-wide hover:bg-[#022869] active:scale-[0.98] transition cursor-pointer text-center shadow-sm"
                    >
                      Login/Signup
                    </button>
                  </div>
                )}
              </CustomDropdown>
            )}

            {/* Three-Line Menu Button (Visible on Desktop & Mobile, Beside Login) */}
            <button 
              type="button" 
              className={`nav-hamburger-btn flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl transition cursor-pointer select-none ${
                isScrolled 
                  ? 'text-[#033487] hover:bg-gray-100 active:scale-95' 
                  : 'text-white hover:bg-white/15 active:scale-95'
              }`}
              onClick={() => setAccountDrawerOpen(true)}
              aria-label="Open Account & Navigation Sidebar"
              title="Menu & Account"
            >
              <svg 
                width="22" 
                height="22" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.3" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <line x1="3.5" y1="6" x2="20.5" y2="6"></line>
                <line x1="3.5" y1="12" x2="20.5" y2="12"></line>
                <line x1="3.5" y1="18" x2="20.5" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* ========================================================
            MOBILE ACCORDION DRAWER MENU
           ======================================================== */}
        {mobileMenuOpen && (
          <div className="mobile-nav-drawer sm:hidden bg-white text-[#1e293b] p-5 shadow-2xl border-t border-gray-100 flex flex-col gap-3 animate-fade-in max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="font-bold text-sm text-[#033487] flex items-center gap-1.5">
                <Compass size={16} />
                <span>HexaHome Menu</span>
              </span>
              <button 
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-400 hover:text-gray-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Mobile Authentication Summary & Controls */}
            {isLoggedIn ? (
              <div className="flex flex-col gap-2 p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-tr from-[#0284c7] to-[#033487] text-white text-xs font-bold shrink-0">
                    {user.profilePicUrl ? (
                      <img src={user.profilePicUrl} alt={displayName} className="w-full h-full object-cover" />
                    ) : (
                      <span>{getInitials(displayName)}</span>
                    )}
                  </div>
                  <div className="overflow-hidden flex-1">
                    <div className="font-bold text-xs text-[#033487] truncate flex items-center gap-1">
                      <span>{displayName}</span>
                      <CheckCircle size={12} className="text-emerald-500 shrink-0" />
                    </div>
                    <div className="text-[10px] text-gray-500 truncate">
                      {user.phone ? `+91 ${user.phone}` : getRoleLabel(user.roles || user.role)}
                    </div>
                  </div>
                </div>

                {/* Mobile Logout Option - Solid Red */}
                <button 
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogoutClick();
                  }}
                  style={{ backgroundColor: '#dc2626', color: '#ffffff' }}
                  className="mt-1 w-full py-2.5 px-3 rounded-lg text-white text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-sm hover:bg-red-700"
                >
                  <LogOut size={14} className="text-white" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 p-2.5 bg-gray-50 rounded-xl">
                <button 
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onNavigate) onNavigate('/auth?mode=login');
                    else onOpenLoginModal();
                  }}
                  style={{ backgroundColor: '#033487', color: '#ffffff' }}
                  className="w-full py-2.5 px-3 rounded-lg text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer hover:bg-[#022c70]"
                >
                  <LogIn size={14} className="text-white" />
                  <span>Log In to Account</span>
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onNavigate) onNavigate('/auth?mode=signup');
                    else onOpenLoginModal();
                  }}
                  style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
                  className="w-full py-2.5 px-3 rounded-lg text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer hover:bg-[#15803d]"
                >
                  <UserPlus size={14} className="text-white" />
                  <span>Sign Up Free</span>
                </button>
              </div>
            )}

            {/* Mobile City Selector Accordion */}
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setMobileAccordion(mobileAccordion === 'city' ? null : 'city')}
                className="w-full flex items-center justify-between p-3 bg-gray-50/80 text-left font-bold text-xs text-gray-800"
              >
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-[#033487]" />
                  <span>City: <span className="text-[#033487]">{selectedCity?.name || 'Noida'}</span></span>
                </div>
                <ChevronDown size={14} className={`transition-transform ${mobileAccordion === 'city' ? 'rotate-180' : ''}`} />
              </button>
              {mobileAccordion === 'city' && (
                <div className="p-2 grid grid-cols-2 gap-1.5 bg-white border-t border-gray-100">
                  {CITIES.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        onSelectCity(c);
                        setMobileAccordion(null);
                      }}
                      className={`text-left p-2 rounded-lg text-xs font-semibold ${
                        selectedCity?.id === c.id ? 'bg-[#033487] text-white' : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Links with Exact Dropdown Match */}
            <div className="flex flex-col gap-1.5 font-semibold text-xs">
              {isLoggedIn && (
                <>
                  <button 
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onNavigate) onNavigate('/dashboard');
                    }}
                    className="text-left py-2.5 px-3 rounded-xl bg-blue-50/80 hover:bg-blue-100 flex items-center gap-2.5 text-[#033487] font-bold cursor-pointer"
                  >
                    <Activity size={15} className="text-[#033487]" />
                    <span>My Dashboard</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onNavigate) onNavigate('/dashboard?tab=listings');
                    }}
                    className="text-left py-2.5 px-3 rounded-xl hover:bg-gray-50 flex items-center gap-2.5 text-gray-700 cursor-pointer"
                  >
                    <Building size={15} className="text-[#033487]" />
                    <span>My Listings</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onNavigate) onNavigate('/dashboard?tab=inquiries');
                    }}
                    className="text-left py-2.5 px-3 rounded-xl hover:bg-gray-50 flex items-center gap-2.5 text-gray-700 cursor-pointer"
                  >
                    <Phone size={15} className="text-[#033487]" />
                    <span>Inquiries & Leads</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onNavigate) onNavigate('/dashboard?tab=saved');
                    }}
                    className="text-left py-2.5 px-3 rounded-xl hover:bg-gray-50 flex items-center gap-2.5 text-gray-700 cursor-pointer"
                  >
                    <Sparkles size={15} className="text-[#033487]" />
                    <span>Saved Properties</span>
                  </button>
                </>
              )}

              <button 
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setActiveModal('activity');
                }}
                className="text-left py-2.5 px-3 rounded-xl hover:bg-gray-50 flex items-center gap-2.5 text-gray-700 cursor-pointer"
              >
                <Clock size={15} className="text-[#033487]" />
                <span>My Activity</span>
              </button>

              <button 
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onNavigate) onNavigate('/post-property');
                  else onOpenPostModal();
                }}
                className="text-left py-2.5 px-3 rounded-xl bg-blue-50/80 hover:bg-blue-100 flex items-center justify-between font-bold text-[#033487] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <PlusCircle size={15} className="text-[#033487]" />
                  <span>Post Property</span>
                </div>
                <span className="bg-[#15770b] text-white text-[9px] px-2 py-0.5 rounded-full font-bold">FREE</span>
              </button>

              <button 
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setActiveModal('about');
                }}
                className="text-left py-2.5 px-3 rounded-xl hover:bg-gray-50 flex items-center gap-2.5 text-gray-700 cursor-pointer"
              >
                <Info size={15} className="text-[#033487]" />
                <span>About Us</span>
              </button>

              <button 
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setActiveModal('terms');
                }}
                className="text-left py-2.5 px-3 rounded-xl hover:bg-gray-50 flex items-center gap-2.5 text-gray-700 cursor-pointer"
              >
                <FileText size={15} className="text-[#033487]" />
                <span>Terms & Condition</span>
              </button>

              <button 
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAppModal();
                }}
                className="text-left py-2.5 px-3 rounded-xl hover:bg-gray-50 flex items-center gap-2.5 text-gray-700 cursor-pointer"
              >
                <Smartphone size={15} className="text-[#033487]" />
                <span>Download App</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ========================================================
          MY ACTIVITY MODAL
         ======================================================== */}
      {activeModal === 'activity' && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setActiveModal(null)} style={{ zIndex: 9999 }}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', borderRadius: '24px' }}>
            <button type="button" className="modal-close-btn" onClick={() => setActiveModal(null)}>
              <X size={20} />
            </button>

            <div className="modal-header" style={{ textAlign: 'left', marginBottom: '20px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '20px', background: '#eff6ff', color: '#033487', fontSize: '12px', fontWeight: '700', marginBottom: '8px' }}>
                <Clock size={14} />
                <span>Activity Center</span>
              </div>
              <h2 className="modal-title" style={{ fontSize: '22px', fontWeight: '800', color: '#033487', margin: '0 0 6px 0' }}>
                My Activity
              </h2>
              <p className="modal-subtitle" style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                {isLoggedIn ? `Track inquiries, searches & contacts for ${displayName}` : 'Log in to track your inquiries and saved searches'}
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-center">
                  <div className="text-xl font-extrabold text-[#033487]">0</div>
                  <div className="text-[11px] font-semibold text-gray-600 mt-0.5">Saved Homes</div>
                </div>
                <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-center">
                  <div className="text-xl font-extrabold text-emerald-700">0</div>
                  <div className="text-[11px] font-semibold text-gray-600 mt-0.5">Owners Contacted</div>
                </div>
                <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl text-center">
                  <div className="text-xl font-extrabold text-purple-700">0</div>
                  <div className="text-[11px] font-semibold text-gray-600 mt-0.5">My Listings</div>
                </div>
              </div>

              <div className="py-6 px-4 bg-gray-50 border border-dashed border-gray-200 rounded-2xl text-center">
                <Activity size={32} className="mx-auto text-gray-400 mb-2" />
                <h4 className="text-sm font-bold text-gray-800 mb-1">No Recent Inquiries Yet</h4>
                <p className="text-xs text-gray-500 mb-4 max-w-xs mx-auto">
                  {isLoggedIn 
                    ? 'Start exploring verified properties with 0% brokerage or post your property for free.' 
                    : 'Log in or sign up to save homes, reveal owner numbers, and sync activity across devices.'}
                </p>

                <div className="flex justify-center gap-2">
                  {!isLoggedIn ? (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveModal(null);
                        if (onNavigate) onNavigate('/auth');
                        else onOpenLoginModal();
                      }}
                      className="px-4 py-2 bg-[#033487] text-white text-xs font-bold rounded-xl hover:bg-[#022c70] transition shadow-sm cursor-pointer"
                    >
                      Log In / Sign Up
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveModal(null);
                        if (onNavigate) onNavigate('/post-property');
                        else onOpenPostModal();
                      }}
                      className="px-4 py-2 bg-[#033487] text-white text-xs font-bold rounded-xl hover:bg-[#022c70] transition shadow-sm cursor-pointer"
                    >
                      Post Property Free
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveModal(null);
                      if (onNavigate) onNavigate('/');
                    }}
                    className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-50 transition cursor-pointer"
                  >
                    Explore Homes
                  </button>
                  {isLoggedIn && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveModal(null);
                        if (onNavigate) onNavigate('/dashboard');
                      }}
                      className="px-4 py-2 bg-blue-50 border border-blue-200 text-[#033487] text-xs font-bold rounded-xl hover:bg-blue-100 transition shadow-sm cursor-pointer"
                    >
                      Go to Dashboard →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          ABOUT US MODAL
         ======================================================== */}
      {activeModal === 'about' && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setActiveModal(null)} style={{ zIndex: 9999 }}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px', borderRadius: '24px' }}>
            <button type="button" className="modal-close-btn" onClick={() => setActiveModal(null)}>
              <X size={20} />
            </button>

            <div className="modal-header" style={{ textAlign: 'left', marginBottom: '18px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '20px', background: '#eff6ff', color: '#033487', fontSize: '12px', fontWeight: '700', marginBottom: '8px' }}>
                <Info size={14} />
                <span>India's Zero Brokerage Network</span>
              </div>
              <h2 className="modal-title" style={{ fontSize: '22px', fontWeight: '800', color: '#033487', margin: '0 0 6px 0' }}>
                About HexaHome
              </h2>
              <p className="modal-subtitle" style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                Connecting genuine tenants, buyers, owners, builders & agents transparently.
              </p>
            </div>

            <div className="space-y-3 text-xs text-gray-600 leading-relaxed">
              <p>
                <strong className="text-gray-800">HexaHome</strong> is India’s fast-growing zero brokerage real estate platform built to eliminate middleman commissions and bring total transparency to finding and renting homes.
              </p>

              <div className="grid grid-cols-2 gap-2.5 my-3">
                <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl">
                  <div className="font-bold text-[#033487] text-xs mb-1">0% Brokerage Guarantee</div>
                  <div className="text-[11px] text-gray-600">Direct connections with verified owners and builders without extra fees.</div>
                </div>
                <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl">
                  <div className="font-bold text-emerald-800 text-xs mb-1">Verified Contacts</div>
                  <div className="text-[11px] text-gray-600">Mobile-verified identities ensuring genuine inquiries and spam protection.</div>
                </div>
                <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl">
                  <div className="font-bold text-purple-800 text-xs mb-1">Free Daily Listings</div>
                  <div className="text-[11px] text-gray-600">Post properties for rent, sell, PG or plots with high-speed indexing.</div>
                </div>
                <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-xl">
                  <div className="font-bold text-amber-800 text-xs mb-1">Pan-India Reach</div>
                  <div className="text-[11px] text-gray-600">Serving major metro hubs: Noida, Bengaluru, Mumbai, Chennai, and more.</div>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex justify-between items-center mt-2">
                <div>
                  <div className="font-bold text-gray-800 text-xs">Customer Support & Inquiries</div>
                  <div className="text-[11px] text-gray-500">support@hexahome.in • Mon–Sat 9AM–7PM</div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-3.5 py-1.5 bg-[#033487] text-white text-xs font-bold rounded-lg hover:bg-[#022c70] transition cursor-pointer"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TERMS & CONDITION MODAL
         ======================================================== */}
      {activeModal === 'terms' && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setActiveModal(null)} style={{ zIndex: 9999 }}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px', borderRadius: '24px' }}>
            <button type="button" className="modal-close-btn" onClick={() => setActiveModal(null)}>
              <X size={20} />
            </button>

            <div className="modal-header" style={{ textAlign: 'left', marginBottom: '18px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '20px', background: '#eff6ff', color: '#033487', fontSize: '12px', fontWeight: '700', marginBottom: '8px' }}>
                <FileText size={14} />
                <span>Platform Policies</span>
              </div>
              <h2 className="modal-title" style={{ fontSize: '22px', fontWeight: '800', color: '#033487', margin: '0 0 6px 0' }}>
                Terms & Conditions
              </h2>
              <p className="modal-subtitle" style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                User agreement and listing guidelines for HexaHome.
              </p>
            </div>

            <div className="space-y-3 text-xs text-gray-600 leading-relaxed max-h-[55vh] overflow-y-auto pr-1">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="font-bold text-[#033487] text-xs mb-1">1. Zero Brokerage Policy</h4>
                <p className="text-[11.5px] text-gray-600 leading-normal">
                  HexaHome provides a direct discovery engine. No commission or brokerage fee is charged by HexaHome on transactions between owners and seekers.
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="font-bold text-[#033487] text-xs mb-1">2. Listing Authenticity & Accuracy</h4>
                <p className="text-[11.5px] text-gray-600 leading-normal">
                  Users posting property ads represent that all information (pricing, photos, locality, BHK) is genuine and truthful. Misleading listings are removed upon review.
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="font-bold text-[#033487] text-xs mb-1">3. Privacy & Contact Reveal Quotas</h4>
                <p className="text-[11.5px] text-gray-600 leading-normal">
                  Contact phone numbers are shared strictly for property negotiations. Unsolicited marketing or misuse of revealed numbers is strictly prohibited.
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="font-bold text-[#033487] text-xs mb-1">4. Account Security</h4>
                <p className="text-[11.5px] text-gray-600 leading-normal">
                  Users are responsible for safeguarding their login credentials. All registered accounts are verified via phone and email verification.
                </p>
              </div>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="w-full py-2.5 bg-[#033487] text-white text-xs font-bold rounded-xl hover:bg-[#022c70] transition shadow-sm cursor-pointer"
                >
                  I Understand & Agree
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          COMPARE PLANS MODAL
         ======================================================== */}
      {activeModal === 'comparePlans' && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setActiveModal(null)} style={{ zIndex: 9999 }}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px', borderRadius: '24px' }}>
            <button type="button" className="modal-close-btn" onClick={() => setActiveModal(null)}>
              <X size={20} />
            </button>

            <div className="modal-header" style={{ textAlign: 'left', marginBottom: '20px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '20px', background: '#eff6ff', color: '#033487', fontSize: '12px', fontWeight: '700', marginBottom: '8px' }}>
                <Crown size={14} />
                <span>Zero Brokerage Upgrades</span>
              </div>
              <h2 className="modal-title" style={{ fontSize: '22px', fontWeight: '800', color: '#033487', margin: '0 0 6px 0' }}>
                Compare HexaHome Plans
              </h2>
              <p className="modal-subtitle" style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                Transparent pricing with guaranteed owner connects and maximum property visibility.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              {/* Plan 1 */}
              <div className="p-4 rounded-2xl border border-gray-200 bg-white flex flex-col justify-between hover:border-[#033487] transition shadow-sm">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Free Tier</span>
                  <div className="text-xl font-extrabold text-[#0f172a] mt-1">₹0</div>
                  <p className="text-[12px] text-gray-500 mt-1">Basic discovery for home searchers</p>
                  <ul className="mt-4 space-y-2 text-xs text-gray-600">
                    <li className="flex items-center gap-1.5"><Check size={14} className="text-emerald-600 shrink-0" /> Free 1 property post</li>
                    <li className="flex items-center gap-1.5"><Check size={14} className="text-emerald-600 shrink-0" /> Search verified homes</li>
                    <li className="flex items-center gap-1.5"><Check size={14} className="text-emerald-600 shrink-0" /> Direct chat with owners</li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveModal(null);
                    if (onNavigate) onNavigate('/search');
                  }}
                  className="mt-5 w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Current Plan
                </button>
              </div>

              {/* Plan 2: Pro Owner */}
              <div className="p-4 rounded-2xl border-2 border-[#033487] bg-blue-50/40 flex flex-col justify-between relative shadow-md">
                <span className="absolute -top-3 right-4 bg-[#033487] text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                  Popular
                </span>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#033487]">Owner Pro</span>
                  <div className="text-xl font-extrabold text-[#033487] mt-1">₹999 <span className="text-xs font-normal text-gray-500">/mo</span></div>
                  <p className="text-[12px] text-gray-500 mt-1">Sell or rent your home 3x faster</p>
                  <ul className="mt-4 space-y-2 text-xs text-gray-700 font-medium">
                    <li className="flex items-center gap-1.5"><Check size={14} className="text-emerald-600 shrink-0" /> Featured Homepage Placement</li>
                    <li className="flex items-center gap-1.5"><Check size={14} className="text-emerald-600 shrink-0" /> Verified Tenant Lead alerts</li>
                    <li className="flex items-center gap-1.5"><Check size={14} className="text-emerald-600 shrink-0" /> Automated Rent Agreement</li>
                    <li className="flex items-center gap-1.5"><Check size={14} className="text-emerald-600 shrink-0" /> Professional photo tag</li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveModal(null);
                    if (onNavigate) onNavigate('/post-property');
                    else onOpenPostModal();
                  }}
                  className="mt-5 w-full py-2 bg-[#033487] hover:bg-[#022c70] text-white font-bold text-xs rounded-xl transition shadow-sm cursor-pointer"
                >
                  Upgrade to Pro
                </button>
              </div>

              {/* Plan 3: Tenant VIP */}
              <div className="p-4 rounded-2xl border border-gray-200 bg-white flex flex-col justify-between hover:border-[#033487] transition shadow-sm">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">Buyer / Tenant VIP</span>
                  <div className="text-xl font-extrabold text-[#0f172a] mt-1">₹499 <span className="text-xs font-normal text-gray-500">/mo</span></div>
                  <p className="text-[12px] text-gray-500 mt-1">Instant contact unlock with owners</p>
                  <ul className="mt-4 space-y-2 text-xs text-gray-600">
                    <li className="flex items-center gap-1.5"><Check size={14} className="text-emerald-600 shrink-0" /> 25 Verified Owner Unlocks</li>
                    <li className="flex items-center gap-1.5"><Check size={14} className="text-emerald-600 shrink-0" /> Instant WhatsApp alert on new listings</li>
                    <li className="flex items-center gap-1.5"><Check size={14} className="text-emerald-600 shrink-0" /> Dedicated RM Assistance</li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveModal(null);
                    if (onNavigate) onNavigate('/search');
                  }}
                  className="mt-5 w-full py-2 bg-gray-900 hover:bg-black text-white font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Get VIP Pass
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TALK TO OUR EXPERTS MODAL
         ======================================================== */}
      {activeModal === 'experts' && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setActiveModal(null)} style={{ zIndex: 9999 }}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', borderRadius: '24px' }}>
            <button type="button" className="modal-close-btn" onClick={() => setActiveModal(null)}>
              <X size={20} />
            </button>

            <div className="modal-header" style={{ textAlign: 'left', marginBottom: '16px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '20px', background: '#eff6ff', color: '#033487', fontSize: '12px', fontWeight: '700', marginBottom: '8px' }}>
                <Headphones size={14} />
                <span>Free Dedicated Advisory</span>
              </div>
              <h2 className="modal-title" style={{ fontSize: '22px', fontWeight: '800', color: '#033487', margin: '0 0 6px 0' }}>
                Talk to Our Property Experts
              </h2>
              <p className="modal-subtitle" style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                Need help finding the right apartment, price negotiation, or legal verification?
              </p>
            </div>

            <div className="space-y-3.5 text-left text-xs">
              <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#033487] text-white flex items-center justify-center shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-gray-500">Toll Free Consultation</div>
                  <div className="text-sm font-bold text-[#033487]">1800-120-HEXA (4392)</div>
                  <div className="text-[10.5px] text-gray-500">Mon - Sat: 9:00 AM to 8:00 PM</div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-gray-500">Email Advisory Team</div>
                  <div className="text-sm font-bold text-emerald-800">advisory@hexahome.in</div>
                  <div className="text-[10.5px] text-gray-500">Guaranteed response within 2 business hours</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  window.location.href = 'tel:18001204392';
                }}
                className="w-full py-3 bg-[#003882] hover:bg-[#022c70] text-white font-bold text-sm rounded-xl transition shadow-md cursor-pointer text-center mt-2"
              >
                Call Advisory Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          FREQUENTLY ASKED QUESTIONS (FAQ) MODAL
         ======================================================== */}
      {activeModal === 'faq' && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setActiveModal(null)} style={{ zIndex: 9999 }}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px', borderRadius: '24px' }}>
            <button type="button" className="modal-close-btn" onClick={() => setActiveModal(null)}>
              <X size={20} />
            </button>

            <div className="modal-header" style={{ textAlign: 'left', marginBottom: '18px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '20px', background: '#eff6ff', color: '#033487', fontSize: '12px', fontWeight: '700', marginBottom: '8px' }}>
                <Info size={14} />
                <span>Help & Knowledge Center</span>
              </div>
              <h2 className="modal-title" style={{ fontSize: '22px', fontWeight: '800', color: '#033487', margin: '0 0 6px 0' }}>
                Frequently Asked Questions
              </h2>
              <p className="modal-subtitle" style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                Everything you need to know about searching, posting, and renting on HexaHome.
              </p>
            </div>

            <div className="space-y-2.5 text-left text-xs max-h-[55vh] overflow-y-auto pr-1">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="font-bold text-gray-900 text-xs mb-1">Is HexaHome really 100% zero brokerage?</div>
                <div className="text-gray-600 leading-relaxed text-[11.5px]">
                  Yes. We connect buyers/tenants directly with verified owners and builder properties. Neither side pays brokerage to HexaHome.
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="font-bold text-gray-900 text-xs mb-1">How can I post my property for free?</div>
                <div className="text-gray-600 leading-relaxed text-[11.5px]">
                  Click the "Post Property for Free" button in the header or sidebar drawer, fill in basic details and photos, and submit. Your listing is verified and activated quickly.
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="font-bold text-gray-900 text-xs mb-1">How do I contact a property owner?</div>
                <div className="text-gray-600 leading-relaxed text-[11.5px]">
                  Open any verified property page, click "Contact Owner", and verify your phone number to immediately reveal the owner's direct mobile number.
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="font-bold text-gray-900 text-xs mb-1">Are all listings verified?</div>
                <div className="text-gray-600 leading-relaxed text-[11.5px]">
                  Our administration moderation team verifies property details, geolocation coordinates, and owner identity before marking listings as ACTIVE on the platform.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          ACCOUNT SIDEBAR DRAWER (Pixel-Precise to Reference Images)
         ======================================================== */}
      <AccountSidebarDrawer
        isOpen={accountDrawerOpen}
        onClose={() => setAccountDrawerOpen(false)}
        currentUser={user}
        onNavigate={onNavigate}
        onOpenLoginModal={onOpenLoginModal}
        onOpenPostModal={onOpenPostModal}
        onOpenAppModal={onOpenAppModal}
        onLogout={handleLogoutClick}
        onOpenActivityModal={() => setActiveModal('activity')}
        onOpenAboutModal={() => setActiveModal('about')}
        onOpenTermsModal={() => setActiveModal('terms')}
        onOpenFaqModal={() => setActiveModal('faq')}
        onOpenExpertsModal={() => setActiveModal('experts')}
        onOpenComparePlansModal={() => setActiveModal('comparePlans')}
      />
    </header>
  );
}
