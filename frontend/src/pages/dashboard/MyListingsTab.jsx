import React, { useState, useEffect, useCallback } from 'react';
import {
  Building,
  PlusCircle,
  Eye,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Home,
  Check,
  Edit2,
} from 'lucide-react';
import { propertyApi } from '../../services/api';
import { resolveImageUrl, handleImageError, DEFAULT_PROPERTY_IMAGE } from '../../utils/imageUrl';

export default function MyListingsTab({ onNavigate }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [toast, setToast] = useState('');

  const fetchMyListings = useCallback(async (targetPage = 0) => {
    try {
      setLoading(true);
      setError('');
      const localListings = JSON.parse(localStorage.getItem('hexahome_user_properties') || '[]');
      const res = await propertyApi.getMyProperties(targetPage, 10);
      const data = res?.data || res;
      let fetched = [];
      if (data && Array.isArray(data.content)) {
        fetched = data.content;
        setTotalPages(data.totalPages || 1);
        setTotalElements((data.totalElements || data.content.length) + localListings.length);
        setPage(data.number || targetPage);
      } else if (Array.isArray(data)) {
        fetched = data;
        setTotalPages(1);
        setTotalElements(data.length + localListings.length);
      }
      // Merge unique by id
      const combined = [...localListings];
      fetched.forEach((fp) => {
        if (!combined.some((cp) => cp.id === fp.id)) {
          combined.push(fp);
        }
      });
      setProperties(combined);
    } catch (err) {
      console.warn('[MyListingsTab] Error fetching user properties, checking local fallback:', err);
      const localListings = JSON.parse(localStorage.getItem('hexahome_user_properties') || '[]');
      if (localListings.length > 0) {
        setProperties(localListings);
        setTotalPages(1);
        setTotalElements(localListings.length);
      } else {
        setError('Failed to load your listings. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyListings(0);
  }, [fetchMyListings]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setActionLoadingId(id);
      await propertyApi.updatePropertyStatus(id, newStatus);
      showToast(`Property marked as ${newStatus.replace('_', ' ')}!`);
      // Update local state
      setProperties((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
      );
    } catch (err) {
      console.error('[MyListingsTab] Status update failed:', err);
      showToast('Failed to update status. Please try again.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteListing = async (id) => {
    try {
      setActionLoadingId(id);
      // Remove from local storage if present
      const localListings = JSON.parse(localStorage.getItem('hexahome_user_properties') || '[]');
      const filtered = localListings.filter((p) => p.id !== id);
      localStorage.setItem('hexahome_user_properties', JSON.stringify(filtered));

      try {
        await propertyApi.deleteProperty(id);
      } catch (e) {
        console.warn('Backend delete skipped/failed, removed locally:', e.message);
      }
      showToast('Property listing deleted successfully.');
      setDeleteConfirmId(null);
      // Refresh listings
      fetchMyListings(page);
    } catch (err) {
      console.error('[MyListingsTab] Delete listing failed:', err);
      showToast('Failed to delete property. Please try again.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const renderStatusBadge = (status) => {
    const s = (status || 'ACTIVE').toUpperCase();
    switch (s) {
      case 'ACTIVE':
        return (
          <span className="status-badge status-active">
            <CheckCircle size={13} />
            <span>Active</span>
          </span>
        );
      case 'PENDING_APPROVAL':
      case 'PENDING_VERIFICATION':
        return (
          <span className="status-badge status-pending">
            <Clock size={13} />
            <span>Pending Approval</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="status-badge status-rejected">
            <XCircle size={13} />
            <span>Rejected</span>
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="status-badge status-expired">
            <AlertTriangle size={13} />
            <span>Expired</span>
          </span>
        );
      case 'RENTED':
      case 'SOLD':
        return (
          <span className="status-badge status-sold">
            <Check size={13} />
            <span>{s === 'RENTED' ? 'Rented Out' : 'Sold'}</span>
          </span>
        );
      default:
        return (
          <span className="status-badge status-inactive">
            <span>{s}</span>
          </span>
        );
    }
  };

  const formatPrice = (price, adType) => {
    if (!price && price !== 0) return '₹ N/A';
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
      {/* Tab Header Action */}
      <div className="tab-header-row">
        <div>
          <h2 className="tab-main-title">My Properties & Listings</h2>
          <p className="tab-subtitle">
            Manage your posted properties, view approval status, or update availability.
          </p>
        </div>
        <button
          type="button"
          className="dashboard-primary-btn"
          onClick={() => onNavigate?.('/post-property')}
        >
          <PlusCircle size={16} />
          <span>Post New Property</span>
        </button>
      </div>

      {toast && (
        <div className="dashboard-toast animate-fade-in">
          {toast}
        </div>
      )}

      {/* Loading Skeletons */}
      {loading ? (
        <div className="listings-grid">
          {[1, 2, 3].map((n) => (
            <div key={n} className="listing-card skeleton-card">
              <div className="skeleton-thumb" />
              <div className="skeleton-content">
                <div className="skeleton-line" style={{ width: '40%' }} />
                <div className="skeleton-line" style={{ width: '80%' }} />
                <div className="skeleton-line" style={{ width: '60%' }} />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="tab-error-state">
          <AlertTriangle size={32} />
          <p>{error}</p>
          <button type="button" onClick={() => fetchMyListings(page)} className="btn-retry">
            <RefreshCw size={15} />
            <span>Try Again</span>
          </button>
        </div>
      ) : properties.length === 0 ? (
        /* Empty State */
        <div className="tab-empty-state">
          <div className="empty-state-icon">
            <Home size={36} />
          </div>
          <h3>No properties listed yet</h3>
          <p>
            You haven't posted any property listings yet. Post your flat, house, or PG with Zero Brokerage!
          </p>
          <button
            type="button"
            className="dashboard-primary-btn"
            onClick={() => onNavigate?.('/post-property')}
          >
            <PlusCircle size={16} />
            <span>Post Your First Property Free</span>
          </button>
        </div>
      ) : (
        /* Listings Cards List */
        <div className="listings-grid">
          {properties.map((property) => {
            const propId = property.id || property.uuid;
            const rawCover = property.coverImageUrl || property.images?.[0]?.imageUrl || (typeof property.images?.[0] === 'string' ? property.images[0] : null) || property.imageUrls?.[0] || DEFAULT_PROPERTY_IMAGE;
            const cover = resolveImageUrl(rawCover);
            const status = property.status || 'ACTIVE';
            const isSoldOrRented = status === 'RENTED' || status === 'SOLD';

            return (
              <div key={propId} className="listing-card">
                <div className="listing-thumb-wrap">
                  <img src={cover} alt={property.title} className="listing-thumb-img" onError={handleImageError} />
                  <div className="listing-status-wrap">
                    {renderStatusBadge(status)}
                  </div>
                </div>

                <div className="listing-body">
                  <div className="listing-type-price">
                    <span className="listing-bhk">{property.bhk || property.propertyType || 'Apartment'}</span>
                    <span className="listing-price">{formatPrice(property.price, property.adType)}</span>
                  </div>

                  <h3 className="listing-title" title={property.title}>
                    {property.title}
                  </h3>

                  <p className="listing-location">
                    {property.localityName ? `${property.localityName}, ${property.cityName || ''}` : (property.address || 'Coimbatore')}
                  </p>

                  <div className="listing-meta-tags">
                    <span className="meta-pill">{property.adType || 'RENT'}</span>
                    <span className="meta-pill">{property.builtUpArea || 1200} sq.ft</span>
                    {property.zeroBrokerage && <span className="meta-pill highlight">Zero Brokerage</span>}
                  </div>

                  {/* Actions Row */}
                  <div className="listing-actions-row">
                    <button
                      type="button"
                      className="btn-action view"
                      onClick={() => onNavigate?.(`/properties/${property.slug || propId}`)}
                      title="View public details"
                    >
                      <Eye size={15} />
                      <span>View</span>
                    </button>

                    {/* Edit Listing Action */}
                    <button
                      type="button"
                      className="btn-action edit"
                      onClick={() => onNavigate?.(`/post-property?edit=${propId}`)}
                      title="Edit property listing"
                    >
                      <Edit2 size={14} />
                      <span>Edit</span>
                    </button>

                    {/* Status Toggle Action */}
                    {!isSoldOrRented ? (
                      <button
                        type="button"
                        className="btn-action status"
                        disabled={actionLoadingId === propId}
                        onClick={() => handleUpdateStatus(propId, property.adType === 'BUY' ? 'SOLD' : 'RENTED')}
                        title="Mark as Rented or Sold"
                      >
                        <Check size={14} />
                        <span>Mark as {property.adType === 'BUY' ? 'Sold' : 'Rented'}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn-action status active-again"
                        disabled={actionLoadingId === propId}
                        onClick={() => handleUpdateStatus(propId, 'ACTIVE')}
                        title="Reactivate Listing"
                      >
                        <RefreshCw size={14} />
                        <span>Reactivate</span>
                      </button>
                    )}

                    {/* Delete Action with inline confirm */}
                    {deleteConfirmId === propId ? (
                      <div className="inline-delete-confirm">
                        <span>Delete?</span>
                        <button
                          type="button"
                          className="btn-confirm-yes"
                          disabled={actionLoadingId === propId}
                          onClick={() => handleDeleteListing(propId)}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          className="btn-confirm-no"
                          onClick={() => setDeleteConfirmId(null)}
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="btn-action delete"
                        onClick={() => setDeleteConfirmId(propId)}
                        title="Delete listing"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
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
            onClick={() => fetchMyListings(page - 1)}
          >
            <ChevronLeft size={16} />
            <span>Prev</span>
          </button>
          <span className="dash-page-info">
            Page {page + 1} of {totalPages} ({totalElements} listings)
          </span>
          <button
            type="button"
            className="dash-page-btn"
            disabled={page >= totalPages - 1}
            onClick={() => fetchMyListings(page + 1)}
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
