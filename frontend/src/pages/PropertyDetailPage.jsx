import React, { useState, useEffect } from 'react';
import {
  MapPin,
  ShieldCheck,
  Flame,
  Bed,
  Bath,
  Maximize2,
  Heart,
  Share2,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Compass,
  Building,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Users,
  Car,
  Wifi,
  Tv,
  Dumbbell,
  Waves,
  ShieldAlert,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContactOwnerModal from '../components/property/ContactOwnerModal';
import { propertyService } from '../services/propertyService';
import './PropertyDetailPage.css';

export default function PropertyDetailPage({
  propertyIdOrSlug,
  onNavigate,
  currentUser,
  onLogout,
}) {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function fetchProperty() {
      if (!propertyIdOrSlug) return;
      try {
        setLoading(true);
        setError(null);
        const data = await propertyService.getPropertyDetail(propertyIdOrSlug);
        if (isMounted) {
          setProperty(data);
        }
      } catch (err) {
        if (isMounted) {
          console.error('[PropertyDetailPage] Error loading property:', err);
          setError('Property listing could not be found or has been unlisted.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchProperty();
    return () => {
      isMounted = false;
    };
  }, [propertyIdOrSlug]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.title || 'HexaHome Property',
        text: `Check out this listing on HexaHome: ${property?.title}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showToast('Listing link copied to clipboard!');
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    showToast(!isFavorite ? 'Saved to your favorites!' : 'Removed from favorites');
  };

  if (loading) {
    return (
      <div className="detail-page-container">
        <Header currentUser={currentUser} onNavigate={onNavigate} onLogout={onLogout} />
        <div style={{ maxWidth: '1240px', margin: '40px auto', padding: '0 20px' }}>
          <div style={{ height: '400px', background: '#e2e8f0', borderRadius: '14px', animation: 'shimmer 1.5s infinite linear' }} />
          <div style={{ height: '40px', width: '60%', background: '#e2e8f0', borderRadius: '8px', margin: '24px 0' }} />
          <div style={{ height: '120px', background: '#e2e8f0', borderRadius: '12px' }} />
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="detail-page-container">
        <Header currentUser={currentUser} onNavigate={onNavigate} onLogout={onLogout} />
        <div style={{ maxWidth: '600px', margin: '80px auto', textAlign: 'center', padding: '0 20px' }}>
          <ShieldAlert size={56} style={{ color: '#ef4444', margin: '0 auto 16px auto' }} />
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            Listing Not Found
          </h2>
          <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '24px', lineHeight: 1.5 }}>
            {error || 'The property you are looking for does not exist or may have been rented out.'}
          </p>
          <button
            type="button"
            className="contact-reveal-cta-btn"
            onClick={() => onNavigate?.('/search')}
            style={{ maxWidth: '240px', margin: '0 auto' }}
          >
            <ArrowLeft size={16} />
            <span>Browse All Listings</span>
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // Resolve images
  const images = property.images && property.images.length > 0
    ? property.images.map((img) => (typeof img === 'string' ? img : img.imageUrl || ''))
    : [property.coverImageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'];

  const formattedPrice = typeof property.price === 'number'
    ? `₹${property.price.toLocaleString('en-IN')}`
    : (property.price || 'Price on request');

  const locationText = property.localityName && property.cityName
    ? `${property.localityName}, ${property.cityName}`
    : (property.address || property.location || 'Coimbatore');

  const area = property.builtUpArea || property.carpetArea || property.area || property.sqft || 1200;
  const depositText = property.deposit
    ? `₹${Number(property.deposit).toLocaleString('en-IN')}`
    : '2 Months Rent';

  const maintenanceText = property.maintenanceCharges
    ? `₹${Number(property.maintenanceCharges).toLocaleString('en-IN')} / mo`
    : (property.isMaintenanceIncluded ? 'Included in Rent' : '₹0');

  // Owner masked info
  const ownerName = property.ownerName || 'Verified Property Owner';
  const ownerPhoneMasked = property.ownerPhoneMasked || (property.phone ? property.phone.slice(0, 5) + 'XXXXX' : '+91 98421 XXXXX');
  const ownerEmailMasked = property.ownerEmailMasked || 'c***@hexahome.in';

  // Map URL
  const mapQuery = encodeURIComponent(`${property.address || locationText}`);
  const mapUrl = `https://maps.google.com/maps?q=${mapQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="detail-page-container">
      <Header currentUser={currentUser} onNavigate={onNavigate} onLogout={onLogout} />

      {/* Breadcrumb Navigation */}
      <nav className="detail-breadcrumb-bar" aria-label="Breadcrumb">
        <div className="detail-breadcrumb-inner">
          <span className="detail-breadcrumb-link" onClick={() => onNavigate?.('/')}>Home</span>
          <span>/</span>
          <span className="detail-breadcrumb-link" onClick={() => onNavigate?.('/search')}>Properties</span>
          <span>/</span>
          {property.cityName && (
            <>
              <span className="detail-breadcrumb-link" onClick={() => onNavigate?.(`/search?city=${property.cityName.toLowerCase()}`)}>
                {property.cityName}
              </span>
              <span>/</span>
            </>
          )}
          {property.localityName && (
            <>
              <span className="detail-breadcrumb-link" onClick={() => onNavigate?.(`/search?locality=${encodeURIComponent(property.localityName)}`)}>
                {property.localityName}
              </span>
              <span>/</span>
            </>
          )}
          <span className="detail-breadcrumb-current">{property.title}</span>
        </div>
      </nav>

      <main className="detail-main-layout">
        {/* Left Column: Gallery, Specs, Description, Amenities */}
        <div className="detail-content-column">
          {/* Image Gallery */}
          <div className="detail-gallery-card">
            <div className="detail-main-image-wrap">
              <img
                src={images[currentImageIdx]}
                alt={property.title}
                className="detail-main-img"
              />

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    className="detail-gallery-nav-btn prev"
                    onClick={() => setCurrentImageIdx((prev) => (prev - 1 + images.length) % images.length)}
                    aria-label="Previous photo"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    type="button"
                    className="detail-gallery-nav-btn next"
                    onClick={() => setCurrentImageIdx((prev) => (prev + 1) % images.length)}
                    aria-label="Next photo"
                  >
                    <ChevronRight size={22} />
                  </button>
                </>
              )}

              <div className="detail-photo-badge">
                <span>{currentImageIdx + 1} / {images.length} Photos</span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="detail-thumbnail-strip">
                {images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className={`detail-thumb-item ${idx === currentImageIdx ? 'active' : ''}`}
                    onClick={() => setCurrentImageIdx(idx)}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="detail-thumb-img" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Title & Price Card */}
          <div className="detail-card">
            <div className="detail-header-top">
              <div>
                <div className="detail-badges-row">
                  {property.isVerified && (
                    <span className="badge-verified" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldCheck size={14} />
                      <span>Verified Listing</span>
                    </span>
                  )}
                  {property.isZeroBrokerage && (
                    <span className="badge-zerobroker" style={{ background: '#eff6ff', color: '#0284c7', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 700 }}>
                      Zero Brokerage
                    </span>
                  )}
                  {property.isHotDeal && (
                    <span className="badge-hotdeal" style={{ background: '#fef2f2', color: '#dc2626', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 700 }}>
                      Hot Deal
                    </span>
                  )}
                  <span style={{ background: '#f1f5f9', color: '#475569', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
                    {property.furnishing?.replace('_', ' ') || 'Semi-Furnished'}
                  </span>
                </div>

                <h1 className="detail-title">{property.title}</h1>
                <div className="detail-address-row">
                  <MapPin size={16} />
                  <span>{locationText}</span>
                </div>
              </div>

              {/* Actions: Wishlist & Share */}
              <div className="detail-action-buttons">
                <button
                  type="button"
                  className={`detail-icon-btn ${isFavorite ? 'is-favorite' : ''}`}
                  onClick={handleToggleFavorite}
                  title="Save to favorites"
                >
                  <Heart size={20} fill={isFavorite ? '#ef4444' : 'none'} />
                </button>
                <button
                  type="button"
                  className="detail-icon-btn"
                  onClick={handleShare}
                  title="Share property"
                >
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {/* Price Breakdown Grid */}
            <div className="detail-pricing-grid">
              <div className="pricing-box">
                <span className="pricing-label">
                  {property.adType === 'BUY' ? 'Total Price' : 'Monthly Rent'}
                </span>
                <span className="pricing-value">{formattedPrice}</span>
                <span className="pricing-sub">Zero Brokerage</span>
              </div>

              {property.adType !== 'BUY' && (
                <div className="pricing-box">
                  <span className="pricing-label">Security Deposit</span>
                  <span className="pricing-value" style={{ fontSize: '18px', color: '#334155' }}>
                    {depositText}
                  </span>
                  <span className="pricing-sub" style={{ color: '#64748b' }}>Refundable</span>
                </div>
              )}

              <div className="pricing-box">
                <span className="pricing-label">Maintenance</span>
                <span className="pricing-value" style={{ fontSize: '18px', color: '#334155' }}>
                  {maintenanceText}
                </span>
                <span className="pricing-sub" style={{ color: '#64748b' }}>Monthly</span>
              </div>

              <div className="pricing-box">
                <span className="pricing-label">Available From</span>
                <span className="pricing-value" style={{ fontSize: '18px', color: '#0284c7' }}>
                  {property.availableFrom || 'Immediately'}
                </span>
                <span className="pricing-sub">Ready to Move</span>
              </div>
            </div>
          </div>

          {/* Specifications Overview Grid */}
          <div className="detail-card">
            <h2 className="detail-section-title">
              <Building size={20} style={{ color: '#0284c7' }} />
              <span>Property Overview</span>
            </h2>

            <div className="specs-grid">
              <div className="spec-item">
                <div className="spec-icon-wrap">
                  <Bed size={20} />
                </div>
                <div className="spec-meta">
                  <span className="spec-lbl">Configuration</span>
                  <span className="spec-val">{property.bhk || `${property.bedrooms || 2} BHK`}</span>
                </div>
              </div>

              <div className="spec-item">
                <div className="spec-icon-wrap">
                  <Bath size={20} />
                </div>
                <div className="spec-meta">
                  <span className="spec-lbl">Bathrooms</span>
                  <span className="spec-val">{property.bathrooms || 2} Baths</span>
                </div>
              </div>

              <div className="spec-item">
                <div className="spec-icon-wrap">
                  <Maximize2 size={20} />
                </div>
                <div className="spec-meta">
                  <span className="spec-lbl">Built-Up Area</span>
                  <span className="spec-val">{area} sq.ft</span>
                </div>
              </div>

              <div className="spec-item">
                <div className="spec-icon-wrap">
                  <Compass size={20} />
                </div>
                <div className="spec-meta">
                  <span className="spec-lbl">Facing</span>
                  <span className="spec-val">{property.facing || 'East Facing'}</span>
                </div>
              </div>

              <div className="spec-item">
                <div className="spec-icon-wrap">
                  <Layers size={20} />
                </div>
                <div className="spec-meta">
                  <span className="spec-lbl">Floor Level</span>
                  <span className="spec-val">
                    {property.floorNumber ? `${property.floorNumber} of ${property.totalFloors || 10} Floors` : '4th of 12 Floors'}
                  </span>
                </div>
              </div>

              <div className="spec-item">
                <div className="spec-icon-wrap">
                  <Users size={20} />
                </div>
                <div className="spec-meta">
                  <span className="spec-lbl">Preferred Tenant</span>
                  <span className="spec-val">{property.preferredTenant || 'Family / Working'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Amenities Section */}
          <div className="detail-card">
            <h2 className="detail-section-title">
              <Sparkles size={20} style={{ color: '#0284c7' }} />
              <span>Amenities & Society Features</span>
            </h2>

            <div className="amenities-badges-grid">
              {property.amenities && property.amenities.length > 0 ? (
                property.amenities.map((amenity, idx) => (
                  <div key={idx} className="amenity-chip">
                    <CheckCircle2 size={16} />
                    <span>{amenity.name || amenity}</span>
                  </div>
                ))
              ) : (
                <>
                  <div className="amenity-chip"><Waves size={16} /><span>Swimming Pool</span></div>
                  <div className="amenity-chip"><Dumbbell size={16} /><span>Equipped Gym</span></div>
                  <div className="amenity-chip"><ShieldCheck size={16} /><span>24x7 Security & CCTV</span></div>
                  <div className="amenity-chip"><Car size={16} /><span>Covered Car Parking</span></div>
                  <div className="amenity-chip"><Layers size={16} /><span>High Speed Lifts</span></div>
                  <div className="amenity-chip"><CheckCircle2 size={16} /><span>100% Power Backup</span></div>
                  <div className="amenity-chip"><Wifi size={16} /><span>Gated Community</span></div>
                  <div className="amenity-chip"><CheckCircle2 size={16} /><span>Clubhouse & Park</span></div>
                </>
              )}
            </div>
          </div>

          {/* Description Section */}
          <div className="detail-card">
            <h2 className="detail-section-title">Description</h2>
            <div style={{ fontSize: '15px', color: '#475569', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
              {property.description ||
                `Spacious and elegantly maintained ${property.bhk || '3 BHK'} apartment located in prime ${locationText}. Featuring premium ventilation, abundant natural daylight, and modular kitchen fittings. Located within close proximity to major IT parks, reputed international schools, supermarkets, and healthcare facilities. Ideal for families and professionals seeking a peaceful yet well-connected lifestyle.`}
            </div>
          </div>

          {/* Location & Map View */}
          <div className="detail-card">
            <h2 className="detail-section-title">
              <MapPin size={20} style={{ color: '#0284c7' }} />
              <span>Location & Neighborhood</span>
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '14px' }}>
              {property.address || `${property.localityName}, ${property.cityName}`}
            </p>
            <div className="detail-map-wrap">
              <iframe
                title="Property Location Map"
                src={mapUrl}
                className="detail-map-iframe"
                loading="lazy"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        {/* Right Sticky Sidebar: Owner Contact Reveal Box */}
        <div className="detail-sidebar-wrap">
          <div className="owner-lead-card">
            <div className="owner-profile-header">
              <div className="owner-avatar">
                {ownerName.charAt(0).toUpperCase()}
              </div>
              <div className="owner-info-text">
                <span className="owner-name-title">{ownerName}</span>
                <span className="owner-role-tag">
                  <ShieldCheck size={14} />
                  <span>Verified Property Owner</span>
                </span>
              </div>
            </div>

            {/* Masked Contact Info Box */}
            <div className="masked-contact-row">
              <div className="masked-item">
                <Phone size={15} style={{ color: '#0284c7' }} />
                <span>Phone: <strong>{ownerPhoneMasked}</strong></span>
              </div>
              <div className="masked-item">
                <Mail size={15} style={{ color: '#0284c7' }} />
                <span>Email: <strong>{ownerEmailMasked}</strong></span>
              </div>
            </div>

            {/* Big Reveal Trigger CTA */}
            <button
              type="button"
              className="contact-reveal-cta-btn"
              onClick={() => setIsContactModalOpen(true)}
            >
              <Phone size={18} />
              <span>Contact Owner / Get Phone Number</span>
            </button>

            {/* Safety Guarantee Banner */}
            <div className="safety-note-box">
              <ShieldCheck size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Zero Brokerage Verified</strong>
                <p style={{ margin: '2px 0 0 0' }}>
                  Deal directly with the owner without paying any commission or broker fees.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Contact Reveal Dialog */}
      <ContactOwnerModal
        isOpen={isContactModalOpen}
        property={property}
        currentUser={currentUser}
        onClose={() => setIsContactModalOpen(false)}
        onNavigate={onNavigate}
        onOpenPricing={() => {
          setIsContactModalOpen(false);
          onNavigate?.('/pricing');
        }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="detail-toast animate-fade-in">
          {toastMessage}
        </div>
      )}

      <Footer />
    </div>
  );
}
