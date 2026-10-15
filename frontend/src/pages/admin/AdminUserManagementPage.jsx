import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  ShieldAlert,
  Lock,
  Unlock,
  Eye,
  KeyRound,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
  Phone,
  Mail,
} from 'lucide-react';
import { adminUserApi } from '../../services/adminApi';
import AdminDataTable from '../../components/admin/common/AdminDataTable';
import AdminFilterBar from '../../components/admin/common/AdminFilterBar';
import AdminStatusBadge from '../../components/admin/common/AdminStatusBadge';
import AdminModal from '../../components/admin/common/AdminModal';
import AdminRoleGuard from '../../components/admin/common/AdminRoleGuard';
import { useAdminAuth } from '../../hooks/useAdminAuth';

// ============================================================================
// User Management Workspace
// Search customer profiles, block/unblock accounts, audited PII revelation
// ============================================================================

export default function AdminUserManagementPage() {
  const { hasRole } = useAdminAuth();
  const [users, setUsers] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  // Filters
  const [keyword, setKeyword] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');

  // Notifications
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  // Modals
  const [detailModal, setDetailModal] = useState({ isOpen: false, user: null, loading: false });
  const [blockModal, setBlockModal] = useState({ isOpen: false, userId: null, userName: '', isBlocking: true, reason: '', error: '' });
  const [revealModal, setRevealModal] = useState({ isOpen: false, userId: null, userName: '', reason: '', revealedData: null, error: '' });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setActionError('');
    try {
      const response = await adminUserApi.searchUsers({
        keyword: keyword.trim() || undefined,
        role: role || undefined,
        status: status || undefined,
        page,
        size: pageSize,
        sortBy,
        sortDirection,
      });

      if (response && response.content) {
        setUsers(response.content);
        setTotalItems(response.totalElements || 0);
      } else {
        setUsers([]);
        setTotalItems(0);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
      setActionError(err.message || 'Error loading users');
    } finally {
      setLoading(false);
    }
  }, [keyword, role, status, page, pageSize, sortBy, sortDirection]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Inspect User
  const handleInspect = async (id) => {
    setDetailModal({ isOpen: true, user: null, loading: true });
    try {
      const detail = await adminUserApi.getUserDetail(id);
      setDetailModal({ isOpen: true, user: detail, loading: false });
    } catch (err) {
      setActionError(err.message || 'Failed to fetch user detail');
      setDetailModal({ isOpen: false, user: null, loading: false });
    }
  };

  // Block / Unblock Confirmation
  const handleConfirmBlockToggle = async () => {
    if (!blockModal.reason.trim()) {
      setBlockModal((prev) => ({ ...prev, error: 'Reason is required for account status changes.' }));
      return;
    }
    try {
      if (blockModal.isBlocking) {
        await adminUserApi.blockUser(blockModal.userId, blockModal.reason.trim());
        setActionSuccess(`User account ${blockModal.userName} blocked.`);
      } else {
        await adminUserApi.unblockUser(blockModal.userId, blockModal.reason.trim());
        setActionSuccess(`User account ${blockModal.userName} unblocked.`);
      }
      setBlockModal({ isOpen: false, userId: null, userName: '', isBlocking: true, reason: '', error: '' });
      fetchUsers();
    } catch (err) {
      setBlockModal((prev) => ({ ...prev, error: err.message || 'Failed to update user status' }));
    }
  };

  // Reveal Sensitive PII
  const handleConfirmRevealPii = async () => {
    if (!revealModal.reason.trim()) {
      setRevealModal((prev) => ({ ...prev, error: 'Mandatory justification reason required to reveal PII.' }));
      return;
    }
    try {
      const response = await adminUserApi.revealPii(revealModal.userId, revealModal.reason.trim());
      setRevealModal((prev) => ({
        ...prev,
        revealedData: response,
        error: '',
      }));
      setActionSuccess('Sensitive PII unmasked and audited.');
    } catch (err) {
      setRevealModal((prev) => ({ ...prev, error: err.message || 'Failed to reveal PII' }));
    }
  };

  const columns = [
    {
      header: 'Customer',
      key: 'fullName',
      sortable: true,
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: '#e0f2fe',
              color: '#0369a1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem',
            }}
          >
            {(row.fullName || row.name || 'U').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: '#0f172a' }}>{row.fullName || row.name || 'Unnamed User'}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Joined: {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '—'}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Contact Info',
      key: 'phone',
      render: (row) => (
        <div style={{ fontSize: '0.85rem', color: '#334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Phone size={13} style={{ color: '#94a3b8' }} />
            <span>{row.maskedPhone || row.phone || '—'}</span>
            {row.phoneVerified && <CheckCircle size={13} style={{ color: '#16a34a' }} title="Phone Verified" />}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '2px' }}>
            <Mail size={13} style={{ color: '#94a3b8' }} />
            <span>{row.maskedEmail || row.email || '—'}</span>
            {row.emailVerified && <CheckCircle size={13} style={{ color: '#16a34a' }} title="Email Verified" />}
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      key: 'role',
      sortable: true,
      render: (row) => <AdminStatusBadge status={row.role || 'USER'} showDot={false} />,
    },
    {
      header: 'Listings',
      key: 'listingCount',
      render: (row) => (
        <span style={{ fontWeight: 600, color: '#033487' }}>
          {row.listingCount || 0}
        </span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      sortable: true,
      render: (row) => <AdminStatusBadge status={row.status || 'ACTIVE'} />,
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
            title="Inspect Profile"
          >
            <Eye size={14} />
          </button>

          <AdminRoleGuard allowedRoles={['SUPER_ADMIN', 'MODERATOR']}>
            {row.status === 'BLOCKED' ? (
              <button
                type="button"
                className="admin-btn admin-btn-success admin-btn-sm"
                onClick={() =>
                  setBlockModal({
                    isOpen: true,
                    userId: row.id,
                    userName: row.fullName || 'User',
                    isBlocking: false,
                    reason: '',
                    error: '',
                  })
                }
                title="Unblock User"
              >
                <Unlock size={14} />
              </button>
            ) : (
              <button
                type="button"
                className="admin-btn admin-btn-danger admin-btn-sm"
                onClick={() =>
                  setBlockModal({
                    isOpen: true,
                    userId: row.id,
                    userName: row.fullName || 'User',
                    isBlocking: true,
                    reason: '',
                    error: '',
                  })
                }
                title="Block User"
              >
                <Lock size={14} />
              </button>
            )}
          </AdminRoleGuard>

          <AdminRoleGuard allowedRoles={['SUPER_ADMIN']}>
            <button
              type="button"
              className="admin-btn admin-btn-secondary admin-btn-sm"
              onClick={() =>
                setRevealModal({
                  isOpen: true,
                  userId: row.id,
                  userName: row.fullName || 'User',
                  reason: '',
                  revealedData: null,
                  error: '',
                })
              }
              title="Reveal Masked PII (Audited)"
              style={{ color: '#b45309' }}
            >
              <KeyRound size={14} />
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
        searchPlaceholder="Search users by name, email, phone..."
        searchValue={keyword}
        onSearchChange={(val) => {
          setKeyword(val);
          setPage(0);
        }}
        filters={[
          {
            id: 'role',
            label: 'All Roles',
            value: role,
            options: [
              { label: 'Owner', value: 'OWNER' },
              { label: 'Buyer', value: 'BUYER' },
              { label: 'Tenant', value: 'TENANT' },
              { label: 'Agent', value: 'AGENT' },
            ],
            onChange: (val) => {
              setRole(val);
              setPage(0);
            },
          },
          {
            id: 'status',
            label: 'All Statuses',
            value: status,
            options: [
              { label: 'Active', value: 'ACTIVE' },
              { label: 'Blocked', value: 'BLOCKED' },
            ],
            onChange: (val) => {
              setStatus(val);
              setPage(0);
            },
          },
        ]}
        onReset={() => {
          setKeyword('');
          setRole('');
          setStatus('');
          setPage(0);
        }}
      />

      {/* Main Table */}
      <AdminDataTable
        columns={columns}
        data={users}
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
        emptyMessage="No customer accounts match your criteria."
      />

      {/* User Details Modal */}
      <AdminModal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, user: null, loading: false })}
        title={detailModal.user ? `${detailModal.user.fullName || 'User'} Profile` : 'User Profile'}
        maxWidth="600px"
        footer={
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={() => setDetailModal({ isOpen: false, user: null, loading: false })}
          >
            Close
          </button>
        }
      >
        {detailModal.loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading user details...</div>
        ) : detailModal.user ? (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div>
                <strong>Full Name:</strong> {detailModal.user.fullName || '—'}
              </div>
              <div>
                <strong>Role:</strong> <AdminStatusBadge status={detailModal.user.role} showDot={false} />
              </div>
              <div>
                <strong>Phone:</strong> {detailModal.user.maskedPhone || detailModal.user.phone || '—'}
              </div>
              <div>
                <strong>Email:</strong> {detailModal.user.maskedEmail || detailModal.user.email || '—'}
              </div>
              <div>
                <strong>Account Status:</strong> <AdminStatusBadge status={detailModal.user.status} />
              </div>
              <div>
                <strong>Registered On:</strong>{' '}
                {detailModal.user.createdAt ? new Date(detailModal.user.createdAt).toLocaleString() : '—'}
              </div>
              <div>
                <strong>Total Properties:</strong> {detailModal.user.listingCount || 0}
              </div>
              <div>
                <strong>Total Inquiries / Leads:</strong> {detailModal.user.leadCount || 0}
              </div>
            </div>
          </div>
        ) : null}
      </AdminModal>

      {/* Block/Unblock Account Modal */}
      <AdminModal
        isOpen={blockModal.isOpen}
        onClose={() => setBlockModal({ isOpen: false, userId: null, userName: '', isBlocking: true, reason: '', error: '' })}
        title={blockModal.isBlocking ? `Block ${blockModal.userName}` : `Unblock ${blockModal.userName}`}
        footer={
          <>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => setBlockModal({ isOpen: false, userId: null, userName: '', isBlocking: true, reason: '', error: '' })}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`admin-btn ${blockModal.isBlocking ? 'admin-btn-danger' : 'admin-btn-success'}`}
              onClick={handleConfirmBlockToggle}
            >
              {blockModal.isBlocking ? 'Confirm Block' : 'Confirm Unblock'}
            </button>
          </>
        }
      >
        <p style={{ margin: '0 0 1rem 0' }}>
          {blockModal.isBlocking
            ? 'Blocking this account will immediately revoke active sessions and prevent further property submissions.'
            : 'Unblocking this account will restore standard user capabilities.'}
        </p>

        {blockModal.error && (
          <div className="admin-login-error" style={{ marginBottom: '0.75rem' }}>
            <AlertCircle size={16} />
            <span>{blockModal.error}</span>
          </div>
        )}

        <textarea
          className="admin-input"
          rows={3}
          placeholder="Specify mandatory reason for this account status change..."
          value={blockModal.reason}
          onChange={(e) => setBlockModal((prev) => ({ ...prev, reason: e.target.value, error: '' }))}
          required
        />
      </AdminModal>

      {/* PII Reveal Modal */}
      <AdminModal
        isOpen={revealModal.isOpen}
        onClose={() => setRevealModal({ isOpen: false, userId: null, userName: '', reason: '', revealedData: null, error: '' })}
        title={`Reveal PII: ${revealModal.userName}`}
        maxWidth="550px"
        footer={
          revealModal.revealedData ? (
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => setRevealModal({ isOpen: false, userId: null, userName: '', reason: '', revealedData: null, error: '' })}
            >
              Done
            </button>
          ) : (
            <>
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => setRevealModal({ isOpen: false, userId: null, userName: '', reason: '', revealedData: null, error: '' })}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-primary"
                onClick={handleConfirmRevealPii}
              >
                Reveal & Audit
              </button>
            </>
          )
        }
      >
        <div
          style={{
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
            padding: '0.85rem',
            borderRadius: '6px',
            marginBottom: '1rem',
            fontSize: '0.825rem',
            color: '#92400e',
            display: 'flex',
            gap: '0.5rem',
          }}
        >
          <ShieldAlert size={18} style={{ flexShrink: 0 }} />
          <span>
            <strong>Data Privacy Warning:</strong> Access to customer unmasked PII is strictly restricted to Super Administrators and will generate an immutable, tamper-evident audit record containing your staff ID and client IP.
          </span>
        </div>

        {revealModal.error && (
          <div className="admin-login-error" style={{ marginBottom: '0.75rem' }}>
            <AlertCircle size={16} />
            <span>{revealModal.error}</span>
          </div>
        )}

        {!revealModal.revealedData ? (
          <div>
            <label className="admin-label" htmlFor="pii-justification">
              Mandatory Business Justification
            </label>
            <textarea
              id="pii-justification"
              className="admin-input"
              rows={3}
              placeholder="e.g. Legal inquiry case #4912, law enforcement subpoena, emergency customer fraud investigation..."
              value={revealModal.reason}
              onChange={(e) => setRevealModal((prev) => ({ ...prev, reason: e.target.value, error: '' }))}
              required
            />
          </div>
        ) : (
          <div
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '1rem',
              borderRadius: '8px',
            }}
          >
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Unmasked Phone Number</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#033487' }}>
                {revealModal.revealedData.phone || 'N/A'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Unmasked Email Address</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#033487' }}>
                {revealModal.revealedData.email || 'N/A'}
              </div>
            </div>
            <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#16a34a' }}>
              &check; Audit Log ID: <code>{revealModal.revealedData.auditLogId || 'Logged'}</code>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
