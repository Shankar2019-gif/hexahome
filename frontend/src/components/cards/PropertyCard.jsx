import React, { useState } from 'react';
import {
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Flame,
  Bed,
  Bath,
  Maximize2,
  Heart,
  Share2,
  PhoneCall,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function PropertyCard({
  property,
  onViewDetails,
  onContactOwner,
  onToggleFavorite,
  isFavorite = false,
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!property) return null;

  // Resolve cover and secondary images
  const images = property.images && property.images.length > 0
    ? (typeof property.images[0] === 'string' ? property.images : property.images.map(img => img.imageUrl || img))
    : [property.coverImageUrl || property.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'];

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Price formatting
  const formatPrice = (price, adType) => {
    if (!price && price !== 0) return 'Price on Request';
    const numPrice = Number(price);
    if (adType?.toUpperCase() === 'RENT' || adType?.toUpperCase() === 'PG') {
      return `₹ ${numPrice.toLocaleString('en-IN')}/mo`;
    }
    if (numPrice >= 10000000) {
      return `₹ ${(numPrice / 10000000).toFixed(2)} Cr`;
    }
    if (numPrice >= 100000) {
      return `₹ ${(numPrice / 100000).toFixed(2)} Lac`;
    }
    return `₹ ${numPrice.toLocaleString('en-IN')}`;
  };

  const title = property.title || `${property.bhk || '2 BHK'} ${property.propertyType || 'Apartment'}`;
  const locationText = property.localityName && property.cityName
    ? `${property.localityName}, ${property.cityName}`
    : (property.location || property.address || 'Coimbatore');

  const area = property.builtUpArea || property.carpetArea || property.area || property.sqft || 1200;
  const bhk = property.bhk || property.type || '2 BHK';
  const baths = property.bathrooms || property.baths || 2;
  const furnishing = property.furnishing || 'Semi-Furnished';
  const isVerified = property.isVerified || property.verified;
  const isZeroBrokerage = property.isZeroBrokerage || property.zeroBrokerage;
  const isHotDeal = property.isHotDeal || property.hotDeal;

  return (
    <article className="search-property-card" onClick={() => onViewDetails?.(property)}>
      {/* Image Carousel / Thumbnail Container */}
      <div className="search-card-media">
        <img
          src={images[currentImageIndex]}
          alt={title}
          className="search-card-img"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Carousel controls if multi-image */}
        {images.length > 1 && (
          <div className="card-carousel-nav">
            <button
              type="button"
              className="carousel-btn prev"
              onClick={handlePrevImage}
              aria-label="Previous image"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="carousel-counter">{currentImageIndex + 1}/{images.length}</span>
            <button
              type="button"
              className="carousel-btn next"
              onClick={handleNextImage}
              aria-label="Next image"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Badges Top Left */}
        <div className="search-card-badges">
          {isVerified && (
            <span className="badge-verified">
              <ShieldCheck size={13} />
              <span>Verified</span>
            </span>
          )}
          {isZeroBrokerage && (
            <span className="badge-zero-brokerage">0 Brokerage</span>
          )}
          {isHotDeal && (
            <span className="badge-hot-deal">
              <Flame size={13} />
              <span>Hot Deal</span>
            </span>
          )}
        </div>

        {/* Action icons Top Right */}
        <div className="search-card-actions">
          <button
            type="button"
            className={`card-action-btn ${isFavorite ? 'favorite-active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.(property);
            }}
            title="Save to Wishlist"
          >
            <Heart size={16} fill={isFavorite ? '#ef4444' : 'none'} color={isFavorite ? '#ef4444' : '#ffffff'} />
          </button>
        </div>
      </div>

      {/* Card Content Details */}
      <div className="search-card-body">
        <div className="search-card-header">
          <div className="search-card-price">
            {formatPrice(property.price, property.adType)}
          </div>
          {property.deposit && (
            <div className="search-card-deposit">
              Dep: ₹{Number(property.deposit).toLocaleString('en-IN')}
            </div>
          )}
        </div>

        <h3 className="search-card-title" title={title}>
          {title}
        </h3>

        <div className="search-card-location">
          <MapPin size={14} className="icon-location" />
          <span>{locationText}</span>
        </div>

        {/* Key Features row */}
        <div className="search-card-specs">
          <div className="spec-item" title="BHK Layout">
            <Bed size={15} />
            <span>{bhk}</span>
          </div>
          <div className="spec-item" title="Bathrooms">
            <Bath size={15} />
            <span>{baths} Bath</span>
          </div>
          <div className="spec-item" title="Built-up / Carpet Area">
            <Maximize2 size={15} />
            <span>{area} sq.ft</span>
          </div>
        </div>

        <div className="search-card-meta">
          <span className="meta-tag">{furnishing}</span>
          {property.preferredTenant && (
            <span className="meta-tag">{property.preferredTenant}</span>
          )}
          {property.propertyType && (
            <span className="meta-tag">{property.propertyType}</span>
          )}
        </div>

        {/* Card Footer with CTA buttons */}
        <div className="search-card-footer">
          <button
            type="button"
            className="btn-card-details"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails?.(property);
            }}
          >
            <Eye size={15} />
            <span>View Details</span>
          </button>

          <button
            type="button"
            className="btn-card-contact"
            onClick={(e) => {
              e.stopPropagation();
              onContactOwner?.(property);
            }}
          >
            <PhoneCall size={15} />
            <span>Contact</span>
          </button>
        </div>
      </div>
    </article>
  );
}
