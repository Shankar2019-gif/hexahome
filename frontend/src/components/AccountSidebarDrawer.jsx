import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  ChevronRight,
  ArrowUpRight,
  Percent,
  Home,
  BadgeIndianRupee,
  Building2,
  Crown,
  FileText,
  Package,
  Headphones,
  Compass,
  BookOpen,
  Calculator,
  Briefcase,
  ShieldCheck,
  Info
} from 'lucide-react';
import './AccountSidebarDrawer.css';

export default function AccountSidebarDrawer({
  isOpen,
  onClose,
  currentUser,
  onNavigate,
  onOpenLoginModal,
  onOpenPostModal,
  onOpenAppModal,
  onLogout,
  onOpenActivityModal,
  onOpenAboutModal,
  onOpenTermsModal,
  onOpenFaqModal,
  onOpenExpertsModal,
  onOpenComparePlansModal
}) {
  const [expandedSection, setExpandedSection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Trigger brief shimmer effect when drawer is opened to show polished skeleton state
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Determine user display info
  const isLoggedIn = Boolean(
    currentUser && (currentUser.name || currentUser.phone || currentUser.id || currentUser.email)
  );

  const getDisplayName = () => {
    if (!currentUser) return 'Guest User';
    if (currentUser.name && currentUser.name.trim()) return currentUser.name.trim();
    if (currentUser.fullName && currentUser.fullName.trim()) return currentUser.fullName.trim();
    if (currentUser.phone) return `+91 ${currentUser.phone}`;
    if (currentUser.email) return currentUser.email.split('@')[0];
    return 'User';
  };

  const getSubtitle = () => {
    if (!isLoggedIn) return 'Login/Signup with HexaHome';
    if (currentUser.phone) return `+91 ${currentUser.phone}`;
    if (currentUser.email) return currentUser.email;
    return 'HexaHome Verified Account';
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  };

  const toggleAccordion = (key) => {
    setExpandedSection((prev) => (prev === key ? null : key));
  };

  const handleAction = (callback, route) => {
    onClose();
    if (route && onNavigate) {
      onNavigate(route);
    } else if (callback) {
      callback();
    }
  };

  return (
    <>
      {/* Backdrop Blur Overlay */}
      <div
        className={`account-sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <aside
        className={`account-sidebar-drawer ${isOpen ? 'open' : ''}`}
        aria-label="Account Menu"
        role="dialog"
        aria-modal="true"
      >
        {/* Sticky Top Header */}
        <div className="account-sidebar-header">
          <h2 className="account-sidebar-title">Account</h2>
          <button
            type="button"
            className="account-sidebar-close-btn"
            onClick={onClose}
            aria-label="Close Account Menu"
          >
            <X size={22} strokeWidth={2.4} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="account-sidebar-body">
          {isLoading ? (
            /* ================= SKELETON SHIMMER STATE ================= */
            <div className="animate-fade-in" aria-busy="true">
              {/* Skeleton User Profile */}
              <div className="sidebar-user-section">
                <div className="sidebar-user-left">
                  <div className="skeleton-shimmer skeleton-avatar" />
                  <div className="sidebar-user-info">
                    <div className="skeleton-shimmer skeleton-text-lg" />
                    <div className="skeleton-shimmer skeleton-text-sm" />
                  </div>
                </div>
                <div className="skeleton-shimmer skeleton-btn-sm" />
              </div>

              {/* Skeleton Banner */}
              <div className="skeleton-shimmer skeleton-banner-card" />

              {/* Skeleton Menu Items */}
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <div key={n} className="skeleton-item-row">
                  <div className="sidebar-item-left">
                    <div className="skeleton-shimmer skeleton-icon-box" />
                    <div className="skeleton-shimmer skeleton-item-text" />
                  </div>
                  <div
                    className="skeleton-shimmer"
                    style={{ width: '18px', height: '18px', borderRadius: '4px' }}
                  />
                </div>
              ))}

              {/* Skeleton App Card */}
              <div className="skeleton-shimmer skeleton-app-card" />
            </div>
          ) : (
            /* ================= REAL CONTENT STATE ================= */
            <>
              {/* 1. User Profile Bar */}
              <div className="sidebar-user-section">
                <div className="sidebar-user-left">
                  {isLoggedIn ? (
                    <div className="sidebar-avatar-circle auth">
                      {getInitials(getDisplayName())}
                    </div>
                  ) : (
                    <div className="sidebar-avatar-circle">
                      <User size={30} strokeWidth={2.2} />
                    </div>
                  )}
                  <div className="sidebar-user-info">
                    <h3 className="sidebar-user-greeting">
                      Hi {getDisplayName()} <span role="img" aria-label="wave">👋</span>
                    </h3>
                    <p className="sidebar-user-subtitle">{getSubtitle()}</p>
                  </div>
                </div>

                {isLoggedIn ? (
                  <button
                    type="button"
                    className="sidebar-auth-btn"
                    onClick={() => handleAction(null, '/dashboard')}
                  >
                    Dashboard
                  </button>
                ) : (
                  <button
                    type="button"
                    className="sidebar-auth-btn"
                    onClick={() => {
                      if (onNavigate) {
                        handleAction(null, '/auth?mode=login');
                      } else if (onOpenLoginModal) {
                        handleAction(onOpenLoginModal);
                      }
                    }}
                  >
                    Login/Signup
                  </button>
                )}
              </div>

              {/* 2. Promotional Banner Card ("Looking to Sell/Rent your Property?") */}
              <div className="sidebar-promo-card">
                <div className="sidebar-promo-content">
                  <h4 className="sidebar-promo-heading">
                    Looking to Sell/Rent your Property?
                  </h4>
                  <button
                    type="button"
                    className="sidebar-promo-btn"
                    onClick={() => {
                      if (onNavigate) {
                        handleAction(null, '/post-property');
                      } else if (onOpenPostModal) {
                        handleAction(onOpenPostModal);
                      }
                    }}
                  >
                    Post Property for Free
                  </button>
                </div>

                {/* Vector Illustration matching Screenshot */}
                <div className="sidebar-promo-illustration" aria-hidden="true">
                  <svg
                    width="118"
                    height="98"
                    viewBox="0 0 118 98"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Soft background glow */}
                    <circle cx="68" cy="48" r="42" fill="#dbeafe" opacity="0.6" />
                    <circle cx="92" cy="38" r="22" fill="#bfdbfe" opacity="0.5" />

                    {/* Happy Couple & House Illustration */}
                    {/* House Graphic */}
                    <path
                      d="M62 48L76 37L90 48V66C90 67.1 89.1 68 88 68H64C62.9 68 62 67.1 62 66V48Z"
                      fill="#ffffff"
                      stroke="#93c5fd"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M76 35L58 49H64L76 40L88 49H94L76 35Z"
                      fill="#38bdf8"
                    />
                    <rect x="71" y="52" width="10" height="16" rx="2" fill="#3b82f6" />
                    <rect x="65" y="51" width="5" height="5" rx="1" fill="#93c5fd" />
                    <rect x="82" y="51" width="5" height="5" rx="1" fill="#93c5fd" />

                    {/* Male Character (Right) */}
                    <circle cx="86" cy="28" r="8" fill="#fcd34d" /> {/* Face */}
                    <path
                      d="M80 24C80 21 83 19 87 19C91 19 94 21 94 24C94 24 93 27 91 27C89 27 88 28 85 28C82 28 80 26 80 24Z"
                      fill="#1e293b"
                    /> {/* Hair & Beard */}
                    <path
                      d="M82 32C84 34 88 34 90 32C92 34 90 36 86 36C82 36 80 34 82 32Z"
                      fill="#1e293b"
                    />
                    <path
                      d="M78 40C80 37 92 37 94 40L102 65H70L78 40Z"
                      fill="#f59e0b"
                    /> {/* Yellow Shirt */}

                    {/* Document with Verified Shield */}
                    <rect
                      x="86"
                      y="42"
                      width="16"
                      height="20"
                      rx="2"
                      fill="#ffffff"
                      stroke="#cbd5e1"
                      strokeWidth="1"
                    />
                    <line x1="89" y1="46" x2="99" y2="46" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="89" y1="50" x2="97" y2="50" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="94" cy="56" r="3" fill="#10b981" />

                    {/* Female Character (Left) */}
                    <circle cx="70" cy="30" r="7.5" fill="#fcd34d" />
                    <path
                      d="M62 27C62 22 66 20 72 20C77 20 80 23 80 28C80 34 76 34 76 34C73 34 71 36 68 36C65 36 62 32 62 27Z"
                      fill="#1e3a8a"
                    /> {/* Dark blue hair */}
                    <path
                      d="M62 42C64 39 74 39 76 42L82 66H58L62 42Z"
                      fill="#f472b6"
                    /> {/* Pink top */}
                  </svg>
                </div>
              </div>

              {/* 3. Navigation Menu Items List */}
              <nav className="sidebar-menu-list">
                {/* 1. For Buyers */}
                <div>
                  <button
                    type="button"
                    className="sidebar-menu-item"
                    onClick={() => toggleAccordion('buyers')}
                  >
                    <div className="sidebar-item-left">
                      <div className="sidebar-icon-box">
                        <Percent size={20} strokeWidth={2.2} />
                      </div>
                      <span className="sidebar-item-label">For Buyers</span>
                    </div>
                    <div
                      className="sidebar-item-right"
                      style={{
                        transform:
                          expandedSection === 'buyers' ? 'rotate(90deg)' : 'none'
                      }}
                    >
                      <ChevronRight size={20} strokeWidth={2.4} />
                    </div>
                  </button>

                  {expandedSection === 'buyers' && (
                    <div className="sidebar-accordion-body animate-fade-in">
                      <button
                        type="button"
                        className="sidebar-sub-link"
                        onClick={() => handleAction(null, '/search?purpose=BUY&type=Residential')}
                      >
                        Buy Residential Properties
                      </button>
                      <button
                        type="button"
                        className="sidebar-sub-link"
                        onClick={() => handleAction(null, '/search?purpose=BUY&type=Commercial')}
                      >
                        Commercial Properties
                      </button>
                      <button
                        type="button"
                        className="sidebar-sub-link"
                        onClick={() => handleAction(null, '/search?purpose=BUY&type=Plots')}
                      >
                        Plots & Land
                      </button>
                      <button
                        type="button"
                        className="sidebar-sub-link"
                        onClick={() => handleAction(null, '/search?purpose=BUY&featured=true')}
                      >
                        New Project Launches
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. For Tenants */}
                <div>
                  <button
                    type="button"
                    className="sidebar-menu-item"
                    onClick={() => toggleAccordion('tenants')}
                  >
                    <div className="sidebar-item-left">
                      <div className="sidebar-icon-box">
                        <Home size={20} strokeWidth={2.2} />
                      </div>
                      <span className="sidebar-item-label">For Tenants</span>
                    </div>
                    <div
                      className="sidebar-item-right"
                      style={{
                        transform:
                          expandedSection === 'tenants' ? 'rotate(90deg)' : 'none'
                      }}
                    >
                      <ChevronRight size={20} strokeWidth={2.4} />
                    </div>
                  </button>

                  {expandedSection === 'tenants' && (
                    <div className="sidebar-accordion-body animate-fade-in">
                      <button
                        type="button"
                        className="sidebar-sub-link"
                        onClick={() => handleAction(null, '/search?purpose=RENT&type=Residential')}
                      >
                        Rental Flats & Apartments
                      </button>
                      <button
                        type="button"
                        className="sidebar-sub-link"
                        onClick={() => handleAction(null, '/search?purpose=RENT&type=PG')}
                      >
                        PG & Co-Living Spaces
                      </button>
                      <button
                        type="button"
                        className="sidebar-sub-link"
                        onClick={() => handleAction(null, '/search?purpose=RENT&furnished=Fully')}
                      >
                        Fully Furnished Homes
                      </button>
                      <button
                        type="button"
                        className="sidebar-sub-link"
                        onClick={() => handleAction(null, '/search?purpose=RENT&brokerage=0')}
                      >
                        Zero Brokerage Listings
                      </button>
                    </div>
                  )}
                </div>

                {/* 3. For Owners */}
                <div>
                  <button
                    type="button"
                    className="sidebar-menu-item"
                    onClick={() => toggleAccordion('owners')}
                  >
                    <div className="sidebar-item-left">
                      <div className="sidebar-icon-box">
                        <BadgeIndianRupee size={20} strokeWidth={2.2} />
                      </div>
                      <span className="sidebar-item-label">For Owners</span>
                    </div>
                    <div
                      className="sidebar-item-right"
                      style={{
                        transform:
                          expandedSection === 'owners' ? 'rotate(90deg)' : 'none'
                      }}
                    >
                      <ChevronRight size={20} strokeWidth={2.4} />
                    </div>
                  </button>

                  {expandedSection === 'owners' && (
                    <div className="sidebar-accordion-body animate-fade-in">
                      <button
                        type="button"
                        className="sidebar-sub-link"
                        onClick={() => {
                          if (onNavigate) handleAction(null, '/post-property');
                          else if (onOpenPostModal) handleAction(onOpenPostModal);
                        }}
                      >
                        Post Property (Free)
                      </button>
                      <button
                        type="button"
                        className="sidebar-sub-link"
                        onClick={() => handleAction(null, '/dashboard?tab=listings')}
                      >
                        My Property Listings
                      </button>
                      <button
                        type="button"
                        className="sidebar-sub-link"
                        onClick={() => {
                          if (onOpenComparePlansModal) handleAction(onOpenComparePlansModal);
                          else handleAction(null, '/search');
                        }}
                      >
                        Owner Plans & Promotion
                      </button>
                      <button
                        type="button"
                        className="sidebar-sub-link"
                        onClick={() => {
                          if (onOpenActivityModal) handleAction(onOpenActivityModal);
                        }}
                      >
                        Tenant Inquiries & Leads
                      </button>
                    </div>
                  )}
                </div>

                {/* 4. Dealers and Builders */}
                <div>
                  <button
                    type="button"
                    className="sidebar-menu-item"
                    onClick={() => toggleAccordion('builders')}
                  >
                    <div className="sidebar-item-left">
                      <div className="sidebar-icon-box">
                        <Building2 size={20} strokeWidth={2.2} />
                      </div>
                      <span className="sidebar-item-label">Dealers and Builders</span>
                    </div>
                    <div
                      className="sidebar-item-right"
                      style={{
                        transform:
                          expandedSection === 'builders' ? 'rotate(90deg)' : 'none'
                      }}
                    >
                      <ChevronRight size={20} strokeWidth={2.4} />
                    </div>
                  </button>

                  {expandedSection === 'builders' && (
                    <div className="sidebar-accordion-body animate-fade-in">
                      <button
                        type="button"
                        className="sidebar-sub-link"
                        onClick={() => handleAction(null, '/search?type=Commercial')}
                      >
                        Commercial Project Listings
                      </button>
                      <button
                        type="button"
                        className="sidebar-sub-link"
                        onClick={() => {
                          if (onOpenExpertsModal) handleAction(onOpenExpertsModal);
                          else handleAction(null, '/search');
                        }}
                      >
                        Builder Marketing Solutions
                      </button>
                    </div>
                  )}
                </div>

                {/* 5. Premium Plan */}
                <button
                  type="button"
                  className="sidebar-menu-item"
                  onClick={() => {
                    if (onOpenComparePlansModal) handleAction(onOpenComparePlansModal);
                    else handleAction(null, '/search');
                  }}
                >
                  <div className="sidebar-item-left">
                    <div className="sidebar-icon-box">
                      <Crown size={20} strokeWidth={2.2} />
                    </div>
                    <span className="sidebar-item-label">Premium Plan</span>
                  </div>
                  <div className="sidebar-item-right">
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-full mr-1">
                      PRO
                    </span>
                  </div>
                </button>

                {/* 6. Compare Plans */}
                <button
                  type="button"
                  className="sidebar-menu-item"
                  onClick={() => {
                    if (onOpenComparePlansModal) handleAction(onOpenComparePlansModal);
                    else handleAction(null, '/search');
                  }}
                >
                  <div className="sidebar-item-left">
                    <div className="sidebar-icon-box">
                      <FileText size={20} strokeWidth={2.2} />
                    </div>
                    <span className="sidebar-item-label">Compare Plans</span>
                  </div>
                  <div className="sidebar-item-right external">
                    <ArrowUpRight size={20} strokeWidth={2.4} />
                  </div>
                </button>

                {/* 7. Packers and Movers */}
                <button
                  type="button"
                  className="sidebar-menu-item"
                  onClick={() => {
                    if (onOpenExpertsModal) handleAction(onOpenExpertsModal);
                    else handleAction(null, '/search');
                  }}
                >
                  <div className="sidebar-item-left">
                    <div className="sidebar-icon-box">
                      <Package size={20} strokeWidth={2.2} />
                    </div>
                    <span className="sidebar-item-label">Packers and Movers</span>
                  </div>
                  <div className="sidebar-item-right external">
                    <ArrowUpRight size={20} strokeWidth={2.4} />
                  </div>
                </button>

                {/* 8. Talk to Our Experts */}
                <button
                  type="button"
                  className="sidebar-menu-item"
                  onClick={() => {
                    if (onOpenExpertsModal) handleAction(onOpenExpertsModal);
                    else window.location.href = 'tel:18001234567';
                  }}
                >
                  <div className="sidebar-item-left">
                    <div className="sidebar-icon-box">
                      <Headphones size={20} strokeWidth={2.2} />
                    </div>
                    <span className="sidebar-item-label">Talk to Our Experts</span>
                  </div>
                  <div className="sidebar-item-right">
                    <span className="text-xs font-semibold text-[#003882] bg-blue-50 px-2 py-0.5 rounded-full">
                      Free
                    </span>
                  </div>
                </button>

                {/* 9. Locality Overview */}
                <button
                  type="button"
                  className="sidebar-menu-item"
                  onClick={() => handleAction(null, '/search')}
                >
                  <div className="sidebar-item-left">
                    <div className="sidebar-icon-box">
                      <Compass size={20} strokeWidth={2.2} />
                    </div>
                    <span className="sidebar-item-label">Locality Overview</span>
                  </div>
                  <div className="sidebar-item-right external">
                    <ArrowUpRight size={20} strokeWidth={2.4} />
                  </div>
                </button>

                {/* 10. Blogs */}
                <button
                  type="button"
                  className="sidebar-menu-item"
                  onClick={() => {
                    if (onOpenAboutModal) handleAction(onOpenAboutModal);
                    else handleAction(null, '/');
                  }}
                >
                  <div className="sidebar-item-left">
                    <div className="sidebar-icon-box">
                      <BookOpen size={20} strokeWidth={2.2} />
                    </div>
                    <span className="sidebar-item-label">Blogs</span>
                  </div>
                  <div className="sidebar-item-right external">
                    <ArrowUpRight size={20} strokeWidth={2.4} />
                  </div>
                </button>

                {/* 11. Tools */}
                <div>
                  <button
                    type="button"
                    className="sidebar-menu-item"
                    onClick={() => toggleAccordion('tools')}
                  >
                    <div className="sidebar-item-left">
                      <div className="sidebar-icon-box">
                        <Calculator size={20} strokeWidth={2.2} />
                      </div>
                      <span className="sidebar-item-label">Tools</span>
                    </div>
                    <div
                      className="sidebar-item-right"
                      style={{
                        transform:
                          expandedSection === 'tools' ? 'rotate(90deg)' : 'none'
                      }}
                    >
                      <ChevronRight size={20} strokeWidth={2.4} />
                    </div>
                  </button>

                  {expandedSection === 'tools' && (
                    <div className="sidebar-accordion-body animate-fade-in">
                      <button
                        type="button"
                        className="sidebar-sub-link"
                        onClick={() => handleAction(null, '/search?tool=emi')}
                      >
                        Home Loan EMI Calculator
                      </button>
                      <button
                        type="button"
                        className="sidebar-sub-link"
                        onClick={() => handleAction(null, '/search?tool=yield')}
                      >
                        Rental Yield Calculator
                      </button>
                      <button
                        type="button"
                        className="sidebar-sub-link"
                        onClick={() => handleAction(null, '/search?tool=stamp')}
                      >
                        Stamp Duty & Registration Calculator
                      </button>
                    </div>
                  )}
                </div>

                {/* 12. Career */}
                <button
                  type="button"
                  className="sidebar-menu-item"
                  onClick={() => {
                    if (onOpenAboutModal) handleAction(onOpenAboutModal);
                    else handleAction(null, '/');
                  }}
                >
                  <div className="sidebar-item-left">
                    <div className="sidebar-icon-box">
                      <Briefcase size={20} strokeWidth={2.2} />
                    </div>
                    <span className="sidebar-item-label">Career</span>
                  </div>
                  <div className="sidebar-item-right external">
                    <ArrowUpRight size={20} strokeWidth={2.4} />
                  </div>
                </button>

                {/* 13. Terms and Conditions */}
                <button
                  type="button"
                  className="sidebar-menu-item"
                  onClick={() => {
                    if (onOpenTermsModal) handleAction(onOpenTermsModal);
                  }}
                >
                  <div className="sidebar-item-left">
                    <div className="sidebar-icon-box">
                      <ShieldCheck size={20} strokeWidth={2.2} />
                    </div>
                    <span className="sidebar-item-label">Terms and Conditions</span>
                  </div>
                </button>

                {/* 14. FAQ’s */}
                <button
                  type="button"
                  className="sidebar-menu-item"
                  onClick={() => {
                    if (onOpenFaqModal) handleAction(onOpenFaqModal);
                    else if (onOpenAboutModal) handleAction(onOpenAboutModal);
                  }}
                >
                  <div className="sidebar-item-left">
                    <div className="sidebar-icon-box">
                      <Info size={20} strokeWidth={2.2} />
                    </div>
                    <span className="sidebar-item-label">FAQ’s</span>
                  </div>
                </button>
              </nav>

              {/* 4. App Download Box */}
              <div className="sidebar-app-box">
                <div className="sidebar-app-left">
                  <h5 className="sidebar-app-heading">
                    Download HexaHome App now for Free
                  </h5>
                  <div className="sidebar-store-buttons">
                    {/* Google Play Button */}
                    <button
                      type="button"
                      className="sidebar-store-pill"
                      onClick={() => {
                        if (onOpenAppModal) handleAction(onOpenAppModal);
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M3.6 1.8L14.2 12.4L3.6 23C3.2 22.6 3 22 3 21.2V3.6C3 2.8 3.2 2.2 3.6 1.8Z" fill="#2196F3" />
                        <path d="M17.7 8.9L14.2 12.4L3.6 1.8C4.1 1.3 4.9 1.1 5.7 1.6L17.7 8.9Z" fill="#4CAF50" />
                        <path d="M17.7 15.9L5.7 23.2C4.9 23.7 4.1 23.5 3.6 23L14.2 12.4L17.7 15.9Z" fill="#F44336" />
                        <path d="M21.7 11.2L17.7 8.9L14.2 12.4L17.7 15.9L21.7 13.6C22.6 13 22.6 11.8 21.7 11.2Z" fill="#FFEB3B" />
                      </svg>
                      <div className="sidebar-store-pill-text">
                        <span className="sidebar-store-pill-sub">GET IT ON</span>
                        <span className="sidebar-store-pill-main">Google Play</span>
                      </div>
                    </button>

                    {/* App Store Button */}
                    <button
                      type="button"
                      className="sidebar-store-pill"
                      onClick={() => {
                        if (onOpenAppModal) handleAction(onOpenAppModal);
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.78 1.06-1.85.94-2.93-.93.04-2.02.63-2.66 1.4-.56.65-.99 1.74-.86 2.79 1.02.08 2.02-.54 2.58-1.26z" />
                      </svg>
                      <div className="sidebar-store-pill-text">
                        <span className="sidebar-store-pill-sub">Download on the</span>
                        <span className="sidebar-store-pill-main">App Store</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* QR Code Graphic matching reference */}
                <div className="sidebar-qr-wrap" aria-label="QR Code to Download HexaHome App">
                  <svg width="68" height="68" viewBox="0 0 68 68" fill="none">
                    {/* Outer frame */}
                    <rect width="68" height="68" fill="white" />
                    {/* Top-Left Corner Box */}
                    <rect x="4" y="4" width="22" height="22" rx="3" fill="#0f172a" />
                    <rect x="8" y="8" width="14" height="14" rx="1.5" fill="white" />
                    <rect x="11" y="11" width="8" height="8" rx="1" fill="#003882" />

                    {/* Top-Right Corner Box */}
                    <rect x="42" y="4" width="22" height="22" rx="3" fill="#0f172a" />
                    <rect x="46" y="8" width="14" height="14" rx="1.5" fill="white" />
                    <rect x="49" y="11" width="8" height="8" rx="1" fill="#003882" />

                    {/* Bottom-Left Corner Box */}
                    <rect x="4" y="42" width="22" height="22" rx="3" fill="#0f172a" />
                    <rect x="8" y="46" width="14" height="14" rx="1.5" fill="white" />
                    <rect x="11" y="49" width="8" height="8" rx="1" fill="#003882" />

                    {/* QR Matrix Pattern Dots */}
                    <rect x="30" y="6" width="4" height="4" fill="#0f172a" />
                    <rect x="30" y="14" width="4" height="4" fill="#0f172a" />
                    <rect x="30" y="22" width="4" height="4" fill="#0f172a" />
                    <rect x="6" y="30" width="4" height="4" fill="#0f172a" />
                    <rect x="14" y="30" width="4" height="4" fill="#0f172a" />
                    <rect x="22" y="30" width="4" height="4" fill="#0f172a" />

                    <rect x="30" y="30" width="8" height="8" rx="1" fill="#003882" />
                    <rect x="42" y="30" width="5" height="5" fill="#0f172a" />
                    <rect x="52" y="30" width="4" height="4" fill="#0f172a" />
                    <rect x="60" y="32" width="4" height="4" fill="#0f172a" />

                    <rect x="30" y="42" width="5" height="5" fill="#0f172a" />
                    <rect x="38" y="42" width="5" height="5" fill="#0f172a" />
                    <rect x="48" y="40" width="4" height="4" fill="#0f172a" />
                    <rect x="56" y="42" width="6" height="6" fill="#003882" />

                    <rect x="30" y="52" width="4" height="4" fill="#0f172a" />
                    <rect x="38" y="50" width="5" height="5" fill="#0f172a" />
                    <rect x="46" y="52" width="5" height="5" fill="#0f172a" />
                    <rect x="56" y="54" width="6" height="6" fill="#0f172a" />
                  </svg>
                </div>
              </div>

              {/* 5. Follow Us Social Section */}
              <div className="sidebar-social-section">
                <h6 className="sidebar-social-heading">Follow us on</h6>
                <div className="sidebar-social-icons">
                  {/* Facebook */}
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sidebar-social-btn fb"
                    aria-label="Facebook"
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                    </svg>
                  </a>

                  {/* X / Twitter */}
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sidebar-social-btn x"
                    aria-label="Twitter / X"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>

                  {/* LinkedIn */}
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sidebar-social-btn in"
                    aria-label="LinkedIn"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.62 1.62 0 1 0 0-3.24 1.62 1.62 0 0 0 0 3.24m1.4 9.74v-8.37H5.06v8.37z" />
                    </svg>
                  </a>

                  {/* Instagram */}
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sidebar-social-btn ig"
                    aria-label="Instagram"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                    </svg>
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
