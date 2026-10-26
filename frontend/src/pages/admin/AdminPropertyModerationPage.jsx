import React, { useState, useEffect, useCallback } from 'react';
import {
  Building2,
  Check,
  X,
  Clock,
  Flame,
  Eye,
  AlertCircle,
  Layers,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Trash2,
} from 'lucide-react';
import { adminPropertyApi } from '../../services/adminApi';
import AdminDataTable from '../../components/admin/common/AdminDataTable';
import AdminFilterBar from '../../components/admin/common/AdminFilterBar';
import AdminStatusBadge from '../../components/admin/common/AdminStatusBadge';
import AdminModal from '../../components/admin/common/AdminModal';
import AdminRoleGuard from '../../components/admin/common/AdminRoleGuard';

// ============================================================================
// Listing Moderation & Verification Workspace
// Real-time approval, rejection with mandatory notes, hot deals, and bulk actions
// ============================================================================

export default function AdminPropertyModerationPage() {
  const [listings, setListings] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  // Filters
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [city, setCity] = useState('');

  // Selection for bulk actions
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Action Modals State
  const [detailModal, setDetailModal] = useState({ isOpen: false, listing: null, loading: false });
  const [rejectModal, setRejectModal] = useState({ isOpen: false, listingId: null, reason: '', error: '' });
  const [bulkRejectModal, setBulkRejectModal] = useState({ isOpen: false, reason: '', error: '' });
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  // Read URL query params on initial mount (e.g. ?status=PENDING_VERIFICATION)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialStatus = params.get('status');
    if (initialStatus) {
      setStatus(initialStatus);
    }
  }, []);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setActionError('');
    try {
      const response = await adminPropertyApi.searchListings({
        keyword: keyword.trim() || undefined,
        status: status || undefined,
        propertyType: propertyType || undefined,
        city: city || undefined,
        page,
        size: pageSize,
        sortBy,
        sortDirection,
      });

      if (response && response.content) {
        setListings(response.content);
        setTotalItems(response.totalElements || 0);
      } else {
        setListings([]);
        setTotalItems(0);
      }
    } catch (err) {
      console.error('Failed to load listings:', err);
      setActionError(err.message || 'Error loading listings');
    } finally {
      setLoading(false);
    }
  }, [keyword, status, propertyType, city, page, pageSize, sortBy, sortDirection]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Selection toggles
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = new Set(listings.map((l) => l.id));
      setSelectedIds(allIds);
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleToggleSelect = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  // Inspect Listing
  const handleInspect = async (id) => {
    setDetailModal({ isOpen: true, listing: null, loading: true });
    try {
      const detail = await adminPropertyApi.getListingDetail(id);
      setDetailModal({ isOpen: true, listing: detail, loading: false });
    } catch (err) {
      setActionError(err.message || 'Failed to fetch listing detail');
      setDetailModal({ isOpen: false, listing: null, loading: false });
    }
  };

  // Quick Approve
  const handleApprove = async (id) => {
    try {
      await adminPropertyApi.approveListing(id);
      setActionSuccess('Listing approved and published successfully.');
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      fetchListings();
    } catch (err) {
      setActionError(err.message || 'Failed to approve listing');
    }
  };

  // Reject Single Listing
  const handleOpenReject = (id) => {
    setRejectModal({ isOpen: true, listingId: id, reason: '', error: '' });
  };

  const handleConfirmReject = async () => {
    if (!rejectModal.reason.trim()) {
      setRejectModal((prev) => ({ ...prev, error: 'Rejection reason is required.' }));
      return;
    }
    try {
      await adminPropertyApi.rejectListing(rejectModal.listingId, rejectModal.reason.trim());
      setActionSuccess('Listing rejected with feedback.');
      setRejectModal({ isOpen: false, listingId: null, reason: '', error: '' });
      fetchListings();
    } catch (err) {
      setRejectModal((prev) => ({ ...prev, error: err.message || 'Failed to reject listing' }));
    }
  };

  // Expire Listing
  const handleExpire = async (id) => {
    if (!window.confirm('Are you sure you want to expire and delist this property?')) return;
    try {
      await adminPropertyApi.expireListing(id);
      setActionSuccess('Listing expired.');
      fetchListings();
    } catch (err) {
      setActionError(err.message || 'Failed to expire listing');
    }
  };

  // Toggle Genuine / Verified
  const handleToggleVerified = async (id) => {
    try {
      const isVerified = await adminPropertyApi.toggleVerified(id);
      setActionSuccess(`Property genuine/verified status updated to ${isVerified}.`);
      fetchListings();
    } catch (err) {
      setActionError(err.message || "Failed to toggle genuine status");
    }
  };

  // Permanently Remove / Delete Listing
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently remove and delete this property listing? This cannot be undone.")) {
      return;
    }
    try {
      await adminPropertyApi.deleteListing(id);
      setActionSuccess("Property listing permanently removed from platform.");
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      fetchListings();
    } catch (err) {
      setActionError(err.message || "Failed to delete listing");
    }
  };

  // Toggle Hot Deal
  const handleToggleHotDeal = async (id) => {
    try {
      const isHot = await adminPropertyApi.toggleHotDeal(id);
      setActionSuccess(`Hot deal status updated to ${isHot}.`);
      fetchListings();
    } catch (err) {
      setActionError(err.message || 'Failed to toggle hot deal');
    }
  };

  // Bulk Actions
  const handleBulkAction = async (action, reason = '') => {
    if (selectedIds.size === 0) return;
    try {
      const result = await adminPropertyApi.bulkAction(
        action,
        Array.from(selectedIds),
        reason
      );
      setActionSuccess(
        `Bulk ${action} finished: ${result.successfulCount} updated, ${result.failedCount} skipped.`
      );
      setSelectedIds(new Set());
      setBulkRejectModal({ isOpen: false, reason: '', error: '' });
      fetchListings();
    } catch (err) {
      setActionError(err.message || 'Bulk action failed');
    }
  };

  const columns = [
    {
      header: (
        <input
          type="checkbox"
          checked={listings.length > 0 && selectedIds.size === listings.length}
          onChange={handleSelectAll}
          aria-label="Select all listings"
        />
      ),
      key: 'checkbox',
      width: '40px',
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedIds.has(row.id)}
          onChange={() => handleToggleSelect(row.id)}
          aria-label={`Select ${row.title}`}
        />
      ),
    },
    {
      header: 'Listing',
      key: 'title',
      sortable: true,
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '6px',
              backgroundColor: '#e2e8f0',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            {row.primaryImageUrl ? (
              <img
                src={row.primaryImageUrl}
                alt={row.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94a3b8',
                }}
              >
                <Building2 size={20} />
              </div>
            )}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>
              {row.title}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {row.locality || 'Unknown'}, {row.city} &bull; {row.propertyType}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Type & Price',
      key: 'price',
      sortable: true,
      render: (row) => (
        <div>
          <div style={{ fontWeight: 700, color: '#033487' }}>
            ₹{row.price ? Number(row.price).toLocaleString('en-IN') : '0'}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            {row.listingType === 'RENT' ? '/month' : 'Total Price'}
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      sortable: true,
      render: (row) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'flex-start' }}>
          <AdminStatusBadge status={row.status} />
          {row.isVerified || row.verified ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', fontSize: '0.7rem', color: '#16a34a', fontWeight: 700 }}>
              <ShieldCheck size={12} /> Genuine
            </span>
          ) : (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', fontSize: '0.7rem', color: '#94a3b8', fontWeight: 500 }}>
              <ShieldAlert size={12} /> Unverified
            </span>
          )}
          {row.isHotDeal && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                fontSize: '0.7rem',
                color: '#d97706',
                fontWeight: 700,
              }}
            >
              <Flame size={12} /> Hot Deal
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Submitted Date',
      key: 'createdAt',
      sortable: true,
      render: (row) => (
        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '—'}
        </span>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            type="button"
            className="admin-btn admin-btn-secondary admin-btn-sm"
            onClick={() => handleInspect(row.id)}
            title="Inspect Details"
          >
            <Eye size={14} />
          </button>

          <AdminRoleGuard allowedRoles={['SUPER_ADMIN', 'MODERATOR']}>
            {/* Toggle Genuine / Verified status */}
            <button
              type="button"
              className={`admin-btn admin-btn-sm ${row.isVerified || row.verified ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
              onClick={() => handleToggleVerified(row.id)}
              title={row.isVerified || row.verified ? "Mark as Not Genuine / Unverified" : "Mark as Genuine & Verified"}
            >
              <ShieldCheck size={14} />
            </button>

            {/* Keep / Approve: available for any non-active property */}
            {row.status !== 'ACTIVE' && (
              <button
                type="button"
                className="admin-btn admin-btn-success admin-btn-sm"
                onClick={() => handleApprove(row.id)}
                title="Keep & Approve Listing"
              >
                <Check size={14} />
              </button>
            )}

            {/* Reject with Reason */}
            {row.status !== 'REJECTED' && (
              <button
                type="button"
                className="admin-btn admin-btn-warning admin-btn-sm"
                onClick={() => handleOpenReject(row.id)}
                title="Reject with Reason"
              >
                <X size={14} />
              </button>
            )}

            {/* Expire / Delist */}
            {row.status === 'ACTIVE' && (
              <button
                type="button"
                className="admin-btn admin-btn-secondary admin-btn-sm"
                onClick={() => handleExpire(row.id)}
                title="Expire / Delist Listing"
              >
                <Clock size={14} />
              </button>
            )}

            {/* Remove / Permanently Delete Listing */}
            <button
              type="button"
              className="admin-btn admin-btn-danger admin-btn-sm"
              onClick={() => handleDelete(row.id)}
              title="Permanently Remove / Delete Listing"
            >
              <Trash2 size={14} />
            </button>
          </AdminRoleGuard>

          <AdminRoleGuard allowedRoles={['SUPER_ADMIN', 'MODERATOR', 'SALES']}>
            <button
              type="button"
              className={`admin-btn admin-btn-sm ${
                row.isHotDeal ? 'admin-btn-primary' : 'admin-btn-secondary'
              }`}
              onClick={() => handleToggleHotDeal(row.id)}
              title="Toggle Hot Deal Badge"
            >
              <Flame size={14} />
            </button>
          </AdminRoleGuard>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Notifications */}
      {actionSuccess && (
        <div
          style={{
            backgroundColor: '#dcfce7',
            border: '1px solid #86efac',
            color: '#15803d',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>{actionSuccess}</span>
          <button
            type="button"
            onClick={() => setActionSuccess('')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#15803d' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {actionError && (
        <div
          style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fca5a5',
            color: '#b91c1c',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>{actionError}</span>
          <button
            type="button"
            onClick={() => setActionError('')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#b91c1c' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Filter Toolbar */}
      <AdminFilterBar
        searchPlaceholder="Search properties by title, locality..."
        searchValue={keyword}
        onSearchChange={(val) => {
          setKeyword(val);
          setPage(0);
        }}
        filters={[
          {
            id: 'status',
            label: 'All Statuses',
            value: status,
            options: [
              { label: 'Pending Review', value: 'PENDING_VERIFICATION' },
              { label: 'Active', value: 'ACTIVE' },
              { label: 'Rejected', value: 'REJECTED' },
              { label: 'Expired', value: 'EXPIRED' },
            ],
            onChange: (val) => {
              setStatus(val);
              setPage(0);
            },
          },
          {
            id: 'propertyType',
            label: 'All Property Types',
            value: propertyType,
            options: [
              { label: 'Apartment', value: 'APARTMENT' },
              { label: 'Independent House', value: 'INDEPENDENT_HOUSE' },
              { label: 'Villa', value: 'VILLA' },
              { label: 'Plot', value: 'PLOT' },
              { label: 'Commercial Office', value: 'COMMERCIAL_OFFICE' },
            ],
            onChange: (val) => {
              setPropertyType(val);
              setPage(0);
            },
          },
          {
            id: 'city',
            label: 'All Cities',
            value: city,
            options: [
              { label: 'Bengaluru', value: 'Bengaluru' },
              { label: 'Mumbai', value: 'Mumbai' },
              { label: 'Hyderabad', value: 'Hyderabad' },
              { label: 'Pune', value: 'Pune' },
              { label: 'Delhi', value: 'Delhi' },
            ],
            onChange: (val) => {
              setCity(val);
              setPage(0);
            },
          },
        ]}
        onReset={() => {
          setKeyword('');
          setStatus('');
          setPropertyType('');
          setCity('');
          setPage(0);
        }}
        actions={
          selectedIds.size > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#033487' }}>
                {selectedIds.size} selected
              </span>
              <button
                type="button"
                className="admin-btn admin-btn-success admin-btn-sm"
                onClick={() => handleBulkAction('APPROVE')}
              >
                <Check size={14} />
                <span>Approve All</span>
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-danger admin-btn-sm"
                onClick={() => setBulkRejectModal({ isOpen: true, reason: '', error: '' })}
              >
                <X size={14} />
                <span>Reject All</span>
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-secondary admin-btn-sm"
                onClick={() => handleBulkAction('EXPIRE')}
              >
                <Clock size={14} />
                <span>Expire All</span>
              </button>
            </div>
          )
        }
      />

      {/* Main Data Table */}
      <AdminDataTable
        columns={columns}
        data={listings}
        loading={loading}
        totalItems={totalItems}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(0);
        }}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSort={(colKey) => {
          if (sortBy === colKey) {
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
          } else {
            setSortBy(colKey);
            setSortDirection('asc');
          }
        }}
        emptyMessage="No properties match your filter criteria."
      />

      {/* Detail Inspection Modal */}
      <AdminModal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, listing: null, loading: false })}
        title={detailModal.listing ? detailModal.listing.title : 'Listing Details'}
        maxWidth="720px"
        footer={
          detailModal.listing && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {detailModal.listing.status === 'PENDING_VERIFICATION' && (
                <>
                  <button
                    type="button"
                    className="admin-btn admin-btn-success"
                    onClick={() => {
                      handleApprove(detailModal.listing.id);
                      setDetailModal({ isOpen: false, listing: null, loading: false });
                    }}
                  >
                    <Check size={16} />
                    <span>Approve Listing</span>
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-danger"
                    onClick={() => {
                      const id = detailModal.listing.id;
                      setDetailModal({ isOpen: false, listing: null, loading: false });
                      handleOpenReject(id);
                    }}
                  >
                    <X size={16} />
                    <span>Reject Listing</span>
                  </button>
                </>
              )}
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => setDetailModal({ isOpen: false, listing: null, loading: false })}
              >
                Close
              </button>
            </div>
          )
        }
      >
        {detailModal.loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading property data...</div>
        ) : detailModal.listing ? (
          <div>
            {/* Image Gallery */}
            {detailModal.listing.images && detailModal.listing.images.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  overflowX: 'auto',
                  paddingBottom: '0.5rem',
                  marginBottom: '1rem',
                }}
              >
                {detailModal.listing.images.map((img, idx) => (
                  <img
                    key={img.id || idx}
                    src={img.imageUrl}
                    alt={`Property view ${idx + 1}`}
                    style={{
                      width: '160px',
                      height: '110px',
                      objectFit: 'cover',
                      borderRadius: '6px',
                    }}
                  />
                ))}
              </div>
            )}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1rem',
                marginBottom: '1rem',
              }}
            >
              <div>
                <strong>Price:</strong> ₹
                {Number(detailModal.listing.price).toLocaleString('en-IN')}{' '}
                ({detailModal.listing.listingType})
              </div>
              <div>
                <strong>Property Type:</strong> {detailModal.listing.propertyType}
              </div>
              <div>
                <strong>Location:</strong> {detailModal.listing.locality},{' '}
                {detailModal.listing.city}
              </div>
              <div>
                <strong>Bedrooms / Bathrooms:</strong> {detailModal.listing.bedrooms || '—'} BHK /{' '}
                {detailModal.listing.bathrooms || '—'} Baths
              </div>
              <div>
                <strong>Built-up Area:</strong> {detailModal.listing.builtUpAreaSqFt || '—'} sq ft
              </div>
              <div>
                <strong>Furnishing:</strong> {detailModal.listing.furnishingStatus || 'Unspecified'}
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <strong>Description:</strong>
              <p
                style={{
                  background: '#f8fafc',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  marginTop: '0.35rem',
                  fontSize: '0.875rem',
                  color: '#334155',
                }}
              >
                {detailModal.listing.description || 'No description provided.'}
              </p>
            </div>

            {detailModal.listing.owner && (
              <div
                style={{
                  borderTop: '1px solid #e2e8f0',
                  paddingTop: '0.75rem',
                  fontSize: '0.85rem',
                }}
              >
                <strong>Owner Info:</strong> {detailModal.listing.owner.name} &bull;{' '}
                {detailModal.listing.owner.maskedPhone || 'Phone Masked'}
              </div>
            )}
          </div>
        ) : null}
      </AdminModal>

      {/* Reject Reason Modal */}
      <AdminModal
        isOpen={rejectModal.isOpen}
        onClose={() => setRejectModal({ isOpen: false, listingId: null, reason: '', error: '' })}
        title="Reject Property Listing"
        footer={
          <>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => setRejectModal({ isOpen: false, listingId: null, reason: '', error: '' })}
            >
              Cancel
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-danger"
              onClick={handleConfirmReject}
            >
              Confirm Rejection
            </button>
          </>
        }
      >
        <p style={{ margin: '0 0 1rem 0' }}>
          Please specify the reason for rejecting this listing. This will be recorded in the audit log and notified to the owner.
        </p>

        {rejectModal.error && (
          <div className="admin-login-error" style={{ marginBottom: '0.75rem' }}>
            <AlertCircle size={16} />
            <span>{rejectModal.error}</span>
          </div>
        )}

        <textarea
          className="admin-input"
          rows={4}
          placeholder="e.g. Incomplete ownership proof, incorrect price denomination, blurry images..."
          value={rejectModal.reason}
          onChange={(e) => setRejectModal((prev) => ({ ...prev, reason: e.target.value, error: '' }))}
          required
        />
      </AdminModal>

      {/* Bulk Reject Modal */}
      <AdminModal
        isOpen={bulkRejectModal.isOpen}
        onClose={() => setBulkRejectModal({ isOpen: false, reason: '', error: '' })}
        title={`Reject ${selectedIds.size} Selected Listings`}
        footer={
          <>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => setBulkRejectModal({ isOpen: false, reason: '', error: '' })}
            >
              Cancel
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-danger"
              onClick={() => {
                if (!bulkRejectModal.reason.trim()) {
                  setBulkRejectModal((prev) => ({ ...prev, error: 'Rejection reason is required.' }));
                  return;
                }
                handleBulkAction('REJECT', bulkRejectModal.reason.trim());
              }}
            >
              Reject All Selected
            </button>
          </>
        }
      >
        <p style={{ margin: '0 0 1rem 0' }}>
          Specify a common rejection reason for all {selectedIds.size} selected listings:
        </p>
        {bulkRejectModal.error && (
          <div className="admin-login-error" style={{ marginBottom: '0.75rem' }}>
            <AlertCircle size={16} />
            <span>{bulkRejectModal.error}</span>
          </div>
        )}
        <textarea
          className="admin-input"
          rows={4}
          placeholder="e.g. Bulk moderation audit: KYC verification failure"
          value={bulkRejectModal.reason}
          onChange={(e) => setBulkRejectModal((prev) => ({ ...prev, reason: e.target.value, error: '' }))}
        />
      </AdminModal>
    </div>
  );
}
