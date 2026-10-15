import React, { useState, useEffect, useCallback } from 'react';
import {
  Heart,
  Trash2,
  Eye,
  MapPin,
  Building,
  AlertTriangle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { engagementApi } from '../../services/api';

export default function SavedPropertiesTab({ onNavigate }) {
  const [savedListings, setSavedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [removingId, setRemovingId] = useState(null);
  const [toast, setToast] = useState('');

  const fetchWishlist = useCallback(async (targetPage = 0) => {
    try {
      setLoading(true);
      setError('');
      const res = await engagementApi.getWishlist(targetPage, 12);
      const data = res?.data || res;
      if (data && Array.isArray(data.content)) {
        setSavedListings(data.content);
        setTotalPages(data.totalPages || 1);
        setPage(data.number || targetPage);
      } else if (Array.isArray(data)) {
        setSavedListings(data);
        setTotalPages(1);
      } else {
        setSavedListings([]);
      }
    } catch (err) {
      console.warn('[SavedPropertiesTab] Error loading wishlist:', err);
      // Fallback to local storage if API error
      const localSaved = JSON.parse(localStorage.getItem('hexahome_saved_properties') || '[]');
      setSavedListings(localSaved);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist(0);
  }, [fetchWishlist]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleRemoveBookmark = async (propertyId, e) => {
    if (e) e.stopPropagation();
    try {
      setRemovingId(propertyId);
      await engagementApi.removeFromWishlist(propertyId).catch(() => {});
      
      // Update local state
      setSavedListings((prev) => prev.filter((p) => p.id !== propertyId && p.uuid !== propertyId));
      showToast('Removed property from your saved bookmarks.');
    } catch (err) {
      console.error('[SavedPropertiesTab] Error removing bookmark:', err);
      showToast('Failed to remove bookmark.');
    } finally {
      setRemovingId(null);
    }
  };

  const formatPrice = (price, adType) => {
    if (!price && price !== 0) return '₹ Price on Request';
    const num = Number(price);
    if (adType?.toUpperCase() === 'RENT' || adType?.toUpperCase() === 'PG') {
      return `₹${num.toLocaleString('en-IN')}/mo`;
    }
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} Lac`;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  return (
    <div className="dashboard-tab-panel animate-fade-in">
      <div className="tab-header-row">
        <div>
          <h2 className="tab-main-title">Saved Properties & Bookmarks</h2>
          <p className="tab-subtitle">
            Quickly revisit homes and commercial spaces you've bookmarked for later review.
          </p>
        </div>
      </div>

      {toast && (
        <div className="dashboard-toast animate-fade-in">
          {toast}
        </div>
      )}

      {/* Loading Skeletons */}
      {loading ? (
        <div className="saved-grid">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="saved-card skeleton-card">
              <div className="skeleton-thumb" style={{ height: '180px' }} />
              <div className="skeleton-content" style={{ padding: '16px' }}>
                <div className="skeleton-line" style={{ width: '40%' }} />
                <div className="skeleton-line" style={{ width: '70%' }} />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="tab-error-state">
          <AlertTriangle size={32} />
          <p>{error}</p>
          <button type="button" onClick={() => fetchWishlist(page)} className="btn-retry">
            <RefreshCw size={15} />
            <span>Try Again</span>
          </button>
        </div>
      ) : savedListings.length === 0 ? (
        /* Empty State */
        <div className="tab-empty-state">
          <div className="empty-state-icon" style={{ color: '#ef4444', background: '#fef2f2' }}>
            <Heart size={36} />
          </div>
          <h3>No saved properties yet</h3>
          <p>
            When searching properties, click the heart icon on any listing to bookmark it here for quick comparison.
          </p>
          <button
            type="button"
            className="dashboard-primary-btn"
            onClick={() => onNavigate?.('/search')}
          >
            Explore Property Catalog
          </button>
        </div>
      ) : (
        /* Saved Properties Grid */
        <div className="saved-grid">
          {savedListings.map((property) => {
            const propId = property.id || property.uuid;
            const cover = property.coverImageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80';
            const locationText = property.localityName
              ? `${property.localityName}, ${property.cityName || ''}`
              : (property.address || 'Coimbatore');

            return (
              <div
                key={propId}
                className="saved-card"
                onClick={() => onNavigate?.(`/properties/${property.slug || propId}`)}
              >
                <div className="saved-thumb-wrap">
                  <img src={cover} alt={property.title} className="saved-thumb-img" />

                  {/* Remove Bookmark Button */}
                  <button
                    type="button"
                    className="btn-saved-remove"
                    title="Remove from saved"
                    disabled={removingId === propId}
                    onClick={(e) => handleRemoveBookmark(propId, e)}
                  >
                    <Trash2 size={16} />
                  </button>

                  <div className="saved-badge-overlay">
                    <span className="saved-type-pill">{property.adType || 'RENT'}</span>
                    {property.isZeroBrokerage && <span className="saved-zb-pill">0 Brokerage</span>}
                  </div>
                </div>

                <div className="saved-body">
                  <div className="saved-price-row">
                    <span className="saved-price">{formatPrice(property.price, property.adType)}</span>
                    <span className="saved-bhk">{property.bhk || property.propertyType || '2 BHK'}</span>
                  </div>

                  <h3 className="saved-title" title={property.title}>
                    {property.title}
                  </h3>

                  <div className="saved-location-row">
                    <MapPin size={14} />
                    <span>{locationText}</span>
                  </div>

                  <div className="saved-footer">
                    <span className="saved-area">{property.builtUpArea || 1200} sq.ft</span>
                    <button
                      type="button"
                      className="btn-saved-view"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate?.(`/properties/${property.slug || propId}`);
                      }}
                    >
                      <Eye size={14} />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="dashboard-pagination">
          <button
            type="button"
            className="dash-page-btn"
            disabled={page <= 0}
            onClick={() => fetchWishlist(page - 1)}
          >
            <ChevronLeft size={16} />
            <span>Prev</span>
          </button>
          <span className="dash-page-info">
            Page {page + 1} of {totalPages}
          </span>
          <button
            type="button"
            className="dash-page-btn"
            disabled={page >= totalPages - 1}
            onClick={() => fetchWishlist(page + 1)}
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
