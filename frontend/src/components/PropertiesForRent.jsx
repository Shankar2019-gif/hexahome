import React, { useState } from 'react';
import { 
  Heart, 
  Share2, 
  MapPin, 
  CheckCircle2, 
  Phone, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  Flame,
  Bed,
  Bath,
  Maximize2
} from 'lucide-react';
import { RENT_PROPERTIES } from '../data/hexahomeData';

export default function PropertiesForRent({ selectedCity, onContactOwner, onViewProperty }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [savedProps, setSavedProps] = useState({});
  const [activeImageIndices, setActiveImageIndices] = useState({});

  const filterTabs = [
    'All',
    'Apartments for Rent',
    '2 & 3 BHK Houses',
    'Budget friendly Homes',
    'Homes for Family',
    'Homes for Bachelor'
  ];

  const handleToggleFavorite = (e, propId) => {
    e.stopPropagation();
    setSavedProps(prev => ({
      ...prev,
      [propId]: !prev[propId]
    }));
  };

  const handleNextImage = (e, propId, total) => {
    e.stopPropagation();
    setActiveImageIndices(prev => ({
      ...prev,
      [propId]: ((prev[propId] || 0) + 1) % total
    }));
  };

  const handlePrevImage = (e, propId, total) => {
    e.stopPropagation();
    setActiveImageIndices(prev => ({
      ...prev,
      [propId]: ((prev[propId] || 0) - 1 + total) % total
    }));
  };

  const filteredProperties = RENT_PROPERTIES.filter(prop => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Apartments for Rent') return prop.title.toLowerCase().includes('apartment');
    if (activeFilter === '2 & 3 BHK Houses') return prop.type === '2 BHK' || prop.type === '3 BHK';
    if (activeFilter === 'Budget friendly Homes') return prop.price <= 20000;
    if (activeFilter === 'Homes for Family') return prop.tag?.includes('Family') || prop.baths >= 2;
    if (activeFilter === 'Homes for Bachelor') return prop.tag?.includes('Bachelor') || prop.type === '1 BHK' || prop.price < 20000;
    return true;
  });

  return (
    <section id="properties-for-rent" className="section-padding rent-section">
      <div className="container">
        <div className="section-header-row">
          <div>
            <div className="section-eyebrow">Verified Direct Listings</div>
            <h2 className="section-heading">Properties for Rent in {selectedCity?.name || 'Noida'}</h2>
            <p className="section-subtext">
              Zero brokerage and low-brokerage verified homes ready for immediate occupancy.
            </p>
          </div>

          <span className="properties-total-count">
            Showing {filteredProperties.length} handpicked listings
          </span>
        </div>

        {/* Sub-filter Category Tabs */}
        <div className="rent-tabs-bar">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`rent-tab-btn ${activeFilter === tab ? 'rent-tab-active' : ''}`}
              onClick={() => setActiveFilter(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Properties Cards Grid */}
        <div className="properties-grid">
          {filteredProperties.map((prop) => {
            const currentImgIndex = activeImageIndices[prop.id] || 0;
            const currentImg = prop.images[currentImgIndex] || prop.images[0];
            const isSaved = !!savedProps[prop.id];

            return (
              <div 
                key={prop.id} 
                className="property-card hover-lift"
                onClick={() => onViewProperty && onViewProperty(prop)}
              >
                {/* Media Image Carousel Container */}
                <div className="prop-media-box">
                  <img 
                    src={currentImg} 
                    alt={prop.title} 
                    className="prop-featured-img"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80';
                    }}
                  />

                  {/* Badges on Image */}
                  <div className="prop-badges-overlay">
                    {prop.verified && (
                      <span className="badge-verified">
                        <CheckCircle2 size={12} />
                        <span>Verified</span>
                      </span>
                    )}
                    {prop.featured && (
                      <span className="badge-featured">Featured</span>
                    )}
                    {prop.tag && (
                      <span className="badge-hot">
                        <Flame size={12} />
                        <span>{prop.tag}</span>
                      </span>
                    )}
                  </div>

                  {/* Favorite and Share action buttons */}
                  <div className="prop-action-overlay">
                    <button 
                      type="button" 
                      className={`prop-icon-btn ${isSaved ? 'favorite-active' : ''}`}
                      onClick={(e) => handleToggleFavorite(e, prop.id)}
                      aria-label="Save Property"
                    >
                      <Heart size={16} fill={isSaved ? '#ef4444' : 'none'} color={isSaved ? '#ef4444' : '#ffffff'} />
                    </button>
                  </div>

                  {/* Carousel Left/Right arrows if multiple images */}
                  {prop.images.length > 1 && (
                    <>
                      <button 
                        type="button" 
                        className="carousel-arrow arrow-left"
                        onClick={(e) => handlePrevImage(e, prop.id, prop.images.length)}
                        aria-label="Previous photo"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button 
                        type="button" 
                        className="carousel-arrow arrow-right"
                        onClick={(e) => handleNextImage(e, prop.id, prop.images.length)}
                        aria-label="Next photo"
                      >
                        <ChevronRight size={16} />
                      </button>

                      {/* Dots indicator */}
                      <div className="carousel-dots-wrap">
                        {prop.images.map((_, idx) => (
                          <span 
                            key={idx} 
                            className={`dot-indicator ${idx === currentImgIndex ? 'active-dot' : ''}`} 
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Card Body */}
                <div className="prop-card-body">
                  {/* Price & Deposit Row */}
                  <div className="prop-price-row">
                    <div className="price-stack">
                      <span className="prop-price">₹{prop.price.toLocaleString('en-IN')}</span>
                      <span className="prop-price-unit">/ month</span>
                    </div>
                    <span className="prop-deposit">Deposit: {prop.deposit}</span>
                  </div>

                  {/* Title & Locality */}
                  <h3 className="prop-card-title">{prop.title}</h3>
                  <div className="prop-location-row">
                    <MapPin size={14} className="location-pin" />
                    <span>{prop.location}</span>
                  </div>

                  {/* Key Specs Pill Row */}
                  <div className="prop-specs-row">
                    <div className="spec-pill">
                      <Bed size={14} />
                      <span>{prop.type}</span>
                    </div>
                    <div className="spec-pill">
                      <Bath size={14} />
                      <span>{prop.baths} Bath</span>
                    </div>
                    <div className="spec-pill">
                      <Maximize2 size={14} />
                      <span>{prop.sqft} sqft</span>
                    </div>
                    <div className="spec-pill furnishing-pill">
                      <span>{prop.furnishing}</span>
                    </div>
                  </div>

                  {/* Footer: Posted By & Contact CTA */}
                  <div className="prop-card-footer">
                    <div className="poster-info">
                      <span className="posted-tag">Posted by {prop.postedBy}</span>
                      <span className="posted-time">{prop.postedAgo}</span>
                    </div>

                    <button 
                      type="button" 
                      className="contact-owner-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onContactOwner && onContactOwner(prop);
                      }}
                    >
                      <Phone size={14} />
                      <span>Contact</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
