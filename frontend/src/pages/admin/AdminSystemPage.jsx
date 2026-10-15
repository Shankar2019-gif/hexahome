import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldAlert,
  Users,
  Activity,
  Plus,
  Edit,
  Eye,
  RefreshCw,
  Cpu,
  HardDrive,
  Clock,
  CheckCircle,
  XCircle,
  X,
  Server,
} from 'lucide-react';
import { adminSystemApi } from '../../services/adminApi';
import AdminDataTable from '../../components/admin/common/AdminDataTable';
import AdminFilterBar from '../../components/admin/common/AdminFilterBar';
import AdminStatusBadge from '../../components/admin/common/AdminStatusBadge';
import AdminModal from '../../components/admin/common/AdminModal';
import { useAdminAuth } from '../../hooks/useAdminAuth';

// ============================================================================
// System Administration & Immutable Audit Logs Workspace
// Restrictive governance, staff account provisioning, and live JVM vitals
// ============================================================================

export default function AdminSystemPage() {
  const { hasRole } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('audit'); // 'audit' | 'staff' | 'vitals'

  // Notifications
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  // 1. Audit Logs State
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditTotal, setAuditTotal] = useState(0);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditPage, setAuditPage] = useState(0);
  const [auditSize, setAuditSize] = useState(20);
  const [auditKeyword, setAuditKeyword] = useState('');
  const [auditAction, setAuditAction] = useState('');
  const [auditEntityType, setAuditEntityType] = useState('');
  const [auditDetailModal, setAuditDetailModal] = useState({ isOpen: false, log: null, loading: false });

  // 2. Staff Accounts State
  const [staffAccounts, setStaffAccounts] = useState([]);
  const [staffTotal, setStaffTotal] = useState(0);
  const [staffLoading, setStaffLoading] = useState(false);
  const [staffPage, setStaffPage] = useState(0);
  const [staffSize, setStaffSize] = useState(20);
  const [staffKeyword, setStaffKeyword] = useState('');
  const [staffRole, setStaffRole] = useState('');
  const [staffModal, setStaffModal] = useState({
    isOpen: false,
    staff: null,
    username: '',
    email: '',
    fullName: '',
    password: '',
    role: 'MODERATOR',
    active: true,
    error: '',
  });

  // 3. JVM Vitals State
  const [vitals, setVitals] = useState(null);
  const [vitalsLoading, setVitalsLoading] = useState(false);
  const [vitalsLastUpdated, setVitalsLastUpdated] = useState(new Date());

  // Load Audit Logs
  const loadAuditLogs = useCallback(async () => {
    setAuditLoading(true);
    try {
      const res = await adminSystemApi.searchAuditLogs({
        keyword: auditKeyword.trim() || undefined,
        action: auditAction || undefined,
        entityType: auditEntityType || undefined,
        page: auditPage,
        size: auditSize,
      });
      if (res && res.content) {
        setAuditLogs(res.content);
        setAuditTotal(res.totalElements || 0);
      } else {
        setAuditLogs([]);
        setAuditTotal(0);
      }
    } catch (err) {
      setActionError(err.message || 'Failed to load audit logs');
    } finally {
      setAuditLoading(false);
    }
  }, [auditKeyword, auditAction, auditEntityType, auditPage, auditSize]);

  // Load Staff Accounts
  const loadStaffAccounts = useCallback(async () => {
    setStaffLoading(true);
    try {
      const res = await adminSystemApi.searchAdminUsers({
        keyword: staffKeyword.trim() || undefined,
        role: staffRole || undefined,
        page: staffPage,
        size: staffSize,
      });
      if (res && res.content) {
        setStaffAccounts(res.content);
        setStaffTotal(res.totalElements || 0);
      } else {
        setStaffAccounts([]);
        setStaffTotal(0);
      }
    } catch (err) {
      setActionError(err.message || 'Failed to load staff accounts');
    } finally {
      setStaffLoading(false);
    }
  }, [staffKeyword, staffRole, staffPage, staffSize]);

  // Load JVM Vitals
  const loadVitals = useCallback(async () => {
    setVitalsLoading(true);
    try {
      const data = await adminSystemApi.getHealthMetrics();
      setVitals(data);
      setVitalsLastUpdated(new Date());
    } catch (err) {
      setActionError(err.message || 'Failed to load system vitals');
    } finally {
      setVitalsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'audit') {
      loadAuditLogs();
    } else if (activeTab === 'staff') {
      loadStaffAccounts();
    } else if (activeTab === 'vitals') {
      loadVitals();
    }
  }, [activeTab, loadAuditLogs, loadStaffAccounts, loadVitals]);

  // Inspect Audit Log Detail
  const handleInspectAudit = async (id) => {
    setAuditDetailModal({ isOpen: true, log: null, loading: true });
    try {
      const detail = await adminSystemApi.getAuditLogDetail(id);
      setAuditDetailModal({ isOpen: true, log: detail, loading: false });
    } catch (err) {
      setActionError(err.message || 'Failed to retrieve audit log');
      setAuditDetailModal({ isOpen: false, log: null, loading: false });
    }
  };

  // Save Staff Account (Create or Update)
  const handleSaveStaff = async () => {
    if (!staffModal.staff) {
      // Create Validation
      if (!staffModal.username.trim() || !staffModal.email.trim() || !staffModal.password) {
        setStaffModal((prev) => ({ ...prev, error: 'Username, email, and password are all required.' }));
        return;
      }
      try {
        await adminSystemApi.createAdminUser({
          username: staffModal.username.trim(),
          email: staffModal.email.trim(),
          fullName: staffModal.fullName.trim() || staffModal.username.trim(),
          password: staffModal.password,
          role: staffModal.role,
        });
        setActionSuccess(`Admin user @${staffModal.username} provisioned successfully.`);
        setStaffModal((prev) => ({ ...prev, isOpen: false }));
        loadStaffAccounts();
      } catch (err) {
        setStaffModal((prev) => ({ ...prev, error: err.message || 'Provisioning failed' }));
      }
    } else {
      // Update
      try {
        await adminSystemApi.updateAdminUser(staffModal.staff.id, {
          email: staffModal.email.trim(),
          fullName: staffModal.fullName.trim(),
          password: staffModal.password ? staffModal.password : undefined,
          role: staffModal.role,
          active: staffModal.active,
        });
        setActionSuccess(`Admin user @${staffModal.staff.username} updated.`);
        setStaffModal((prev) => ({ ...prev, isOpen: false }));
        loadStaffAccounts();
      } catch (err) {
        setStaffModal((prev) => ({ ...prev, error: err.message || 'Update failed' }));
      }
    }
  };

  // Check SUPER_ADMIN authorization
  if (!hasRole('SUPER_ADMIN')) {
    return (
      <div className="admin-activity-card" style={{ padding: '3rem', textAlign: 'center' }}>
        <ShieldAlert size={48} style={{ color: '#dc2626', margin: '0 auto 1rem auto' }} />
        <h2 style={{ color: '#991b1b', margin: '0 0 0.5rem 0' }}>Restricted Governance Area</h2>
        <p style={{ color: '#64748b', maxWidth: '480px', margin: '0 auto' }}>
          This workspace is exclusively restricted to Super Administrators. Your current role does not possess the requisite clearance.
        </p>
      </div>
    );
  }

  const auditColumns = [
    {
      header: 'Timestamp',
      key: 'createdAt',
      render: (row) => (
        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
          {row.createdAt ? new Date(row.createdAt).toLocaleString() : '—'}
        </span>
      ),
    },
    {
      header: 'Admin Staff',
      key: 'adminUsername',
      render: (row) => (
        <div style={{ fontWeight: 600, color: '#0f172a' }}>
          @{row.adminUsername || 'SYSTEM'}
        </div>
      ),
    },
    {
      header: 'Action',
      key: 'action',
      render: (row) => (
        <code style={{ fontSize: '0.8rem', color: '#033487', fontWeight: 700 }}>
          {row.action}
        </code>
      ),
    },
    {
      header: 'Entity Type',
      key: 'entityType',
      render: (row) => (
        <span
          style={{
            padding: '2px 8px',
            borderRadius: '4px',
            backgroundColor: '#f1f5f9',
            fontSize: '0.75rem',
            fontWeight: 600,
          }}
        >
          {row.entityType}
        </span>
      ),
    },
    {
      header: 'Reason / Note',
      key: 'reason',
      render: (row) => (
        <span style={{ fontSize: '0.8rem', color: '#475569' }}>
          {row.reason || '—'}
        </span>
      ),
    },
    {
      header: 'Outcome',
      key: 'outcome',
      render: (row) => <AdminStatusBadge status={row.outcome || 'SUCCESS'} />,
    },
    {
      header: 'Client IP',
      key: 'ipAddress',
      render: (row) => (
        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
          {row.ipAddress || '127.0.0.1'}
        </span>
      ),
    },
    {
      header: 'Inspect',
      key: 'inspect',
      render: (row) => (
        <button
          type="button"
          className="admin-btn admin-btn-secondary admin-btn-sm"
          onClick={() => handleInspectAudit(row.id)}
          title="Inspect Audit Entry"
        >
          <Eye size={13} />
        </button>
      ),
    },
  ];

  const staffColumns = [
    {
      header: 'Admin Username',
      key: 'username',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 700, color: '#0f172a' }}>@{row.username}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{row.fullName}</div>
        </div>
      ),
    },
    {
      header: 'Email',
      key: 'email',
      render: (row) => <span style={{ fontSize: '0.85rem' }}>{row.email}</span>,
    },
    {
      header: 'Assigned Role',
      key: 'role',
      render: (row) => <AdminStatusBadge status={row.role} showDot={false} />,
    },
    {
      header: 'Status',
      key: 'active',
      render: (row) => <AdminStatusBadge status={row.active ? 'ACTIVE' : 'INACTIVE'} />,
    },
    {
      header: 'Last Login',
      key: 'lastLoginAt',
      render: (row) => (
        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
          {row.lastLoginAt ? new Date(row.lastLoginAt).toLocaleString() : 'Never'}
        </span>
      ),
    },
    {
      header: 'Action',
      key: 'actions',
      render: (row) => (
        <button
          type="button"
          className="admin-btn admin-btn-secondary admin-btn-sm"
          onClick={() =>
            setStaffModal({
              isOpen: true,
              staff: row,
              username: row.username,
              email: row.email,
              fullName: row.fullName || '',
              password: '',
              role: row.role,
              active: row.active,
              error: '',
            })
          }
          title="Edit Staff Account"
        >
          <Edit size={13} />
        </button>
      ),
    },
  ];

  return (
    <div>
      {/* Sub-Tabs Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '0.75rem',
        }}
      >
        <button
          type="button"
          className={`admin-btn ${activeTab === 'audit' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
          onClick={() => setActiveTab('audit')}
        >
          <ShieldAlert size={16} />
          <span>Immutable Audit Logs</span>
        </button>

        <button
          type="button"
          className={`admin-btn ${activeTab === 'staff' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
          onClick={() => setActiveTab('staff')}
        >
          <Users size={16} />
          <span>Staff Accounts Provisioning</span>
        </button>

        <button
          type="button"
          className={`admin-btn ${activeTab === 'vitals' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
          onClick={() => setActiveTab('vitals')}
        >
          <Activity size={16} />
          <span>JVM Runtime Vitals</span>
        </button>
      </div>

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

      {/* TAB 1: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <>
          <AdminFilterBar
            searchPlaceholder="Search audit logs by admin, entity, reason..."
            searchValue={auditKeyword}
            onSearchChange={(val) => {
              setAuditKeyword(val);
              setAuditPage(0);
            }}
            filters={[
              {
                id: 'entityType',
                label: 'All Entities',
                value: auditEntityType,
                options: [
                  { label: 'Property Listings', value: 'PROPERTY' },
                  { label: 'User Accounts', value: 'USER' },
                  { label: 'Leads', value: 'LEAD' },
                  { label: 'Subscriptions', value: 'SUBSCRIPTION' },
                  { label: 'Content', value: 'CONTENT' },
                  { label: 'Admin Staff', value: 'ADMIN_USER' },
                ],
                onChange: (val) => {
                  setAuditEntityType(val);
                  setAuditPage(0);
                },
              },
            ]}
            onReset={() => {
              setAuditKeyword('');
              setAuditAction('');
              setAuditEntityType('');
              setAuditPage(0);
            }}
          />

          <AdminDataTable
            columns={auditColumns}
            data={auditLogs}
            loading={auditLoading}
            totalItems={auditTotal}
            page={auditPage}
            pageSize={auditSize}
            onPageChange={setAuditPage}
            onPageSizeChange={(newSize) => {
              setAuditSize(newSize);
              setAuditPage(0);
            }}
            emptyMessage="No audit log entries found."
          />
        </>
      )}

      {/* TAB 2: STAFF PROVISIONING */}
      {activeTab === 'staff' && (
        <>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
                Operations Staff Directory
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                Provision accounts and grant role-based authorizations
              </p>
            </div>

            <button
              type="button"
              className="admin-btn admin-btn-primary"
              onClick={() =>
                setStaffModal({
                  isOpen: true,
                  staff: null,
                  username: '',
                  email: '',
                  fullName: '',
                  password: '',
                  role: 'MODERATOR',
                  active: true,
                  error: '',
                })
              }
            >
              <Plus size={16} />
              <span>Provision Staff User</span>
            </button>
          </div>

          <AdminDataTable
            columns={staffColumns}
            data={staffAccounts}
            loading={staffLoading}
            totalItems={staffTotal}
            page={staffPage}
            pageSize={staffSize}
            onPageChange={setStaffPage}
            onPageSizeChange={(newSize) => {
              setStaffSize(newSize);
              setStaffPage(0);
            }}
            emptyMessage="No staff accounts found."
          />
        </>
      )}

      {/* TAB 3: JVM RUNTIME VITALS */}
      {activeTab === 'vitals' && (
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
                Live JVM Runtime & Platform Health
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Synchronized: {vitalsLastUpdated.toLocaleTimeString()}
              </span>
            </div>

            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={loadVitals}
              disabled={vitalsLoading}
            >
              <RefreshCw size={15} className={vitalsLoading ? 'animate-spin' : ''} />
              <span>Refresh Health</span>
            </button>
          </div>

          {vitals ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1.25rem',
              }}
            >
              <div className="admin-activity-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <HardDrive size={20} style={{ color: '#033487' }} />
                  <strong style={{ fontSize: '0.95rem' }}>Heap Memory</strong>
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
                  {vitals.heapMemoryUsedMb} MB
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                  Total Committed: {vitals.heapMemoryTotalMb} MB &bull; Max: {vitals.heapMemoryMaxMb} MB
                </div>
              </div>

              <div className="admin-activity-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Cpu size={20} style={{ color: '#059669' }} />
                  <strong style={{ fontSize: '0.95rem' }}>CPU Processors</strong>
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
                  {vitals.availableProcessors} Cores
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                  Active Threads: {vitals.activeThreads || 0}
                </div>
              </div>

              <div className="admin-activity-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Clock size={20} style={{ color: '#d97706' }} />
                  <strong style={{ fontSize: '0.95rem' }}>Uptime</strong>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
                  {vitals.uptimeFormatted || `${Math.floor(vitals.uptimeSeconds / 60)} mins`}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                  Started: {vitals.startTime ? new Date(vitals.startTime).toLocaleString() : 'Recent'}
                </div>
              </div>

              <div className="admin-activity-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Server size={20} style={{ color: '#7c3aed' }} />
                  <strong style={{ fontSize: '0.95rem' }}>Runtime Environment</strong>
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                  {vitals.jvmName || 'OpenJDK 64-Bit'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                  Java {vitals.javaVersion} &bull; {vitals.osName} ({vitals.osArch})
                </div>
              </div>
            </div>
          ) : (
            <div>Loading diagnostics...</div>
          )}
        </div>
      )}

      {/* Audit Detail Modal */}
      <AdminModal
        isOpen={auditDetailModal.isOpen}
        onClose={() => setAuditDetailModal({ isOpen: false, log: null, loading: false })}
        title="Audit Log Entry Inspector"
        maxWidth="680px"
        footer={
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={() => setAuditDetailModal({ isOpen: false, log: null, loading: false })}
          >
            Close
          </button>
        }
      >
        {auditDetailModal.loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading log entry...</div>
        ) : auditDetailModal.log ? (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <strong>Audit ID:</strong> <code>{auditDetailModal.log.id}</code>
              </div>
              <div>
                <strong>Timestamp:</strong> {new Date(auditDetailModal.log.createdAt).toLocaleString()}
              </div>
              <div>
                <strong>Staff User:</strong> @{auditDetailModal.log.adminUsername}
              </div>
              <div>
                <strong>Action:</strong> <code>{auditDetailModal.log.action}</code>
              </div>
              <div>
                <strong>Entity:</strong> {auditDetailModal.log.entityType} ({auditDetailModal.log.entityId || 'N/A'})
              </div>
              <div>
                <strong>Outcome:</strong> <AdminStatusBadge status={auditDetailModal.log.outcome} />
              </div>
              <div>
                <strong>Client IP:</strong> {auditDetailModal.log.ipAddress || '127.0.0.1'}
              </div>
            </div>

            {auditDetailModal.log.reason && (
              <div style={{ marginBottom: '1rem' }}>
                <strong>Reason:</strong>
                <p style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '6px', margin: '0.25rem 0 0 0' }}>
                  {auditDetailModal.log.reason}
                </p>
              </div>
            )}

            {auditDetailModal.log.details && (
              <div>
                <strong>Payload / State Diff:</strong>
                <pre
                  style={{
                    background: '#071739',
                    color: '#e2e8f0',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    overflowX: 'auto',
                    maxHeight: '200px',
                  }}
                >
                  {typeof auditDetailModal.log.details === 'string'
                    ? auditDetailModal.log.details
                    : JSON.stringify(auditDetailModal.log.details, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ) : null}
      </AdminModal>

      {/* Staff Provisioning / Edit Modal */}
      <AdminModal
        isOpen={staffModal.isOpen}
        onClose={() => setStaffModal((prev) => ({ ...prev, isOpen: false }))}
        title={staffModal.staff ? `Edit @${staffModal.staff.username}` : 'Provision Staff Account'}
        footer={
          <>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => setStaffModal((prev) => ({ ...prev, isOpen: false }))}
            >
              Cancel
            </button>
            <button type="button" className="admin-btn admin-btn-primary" onClick={handleSaveStaff}>
              {staffModal.staff ? 'Save Changes' : 'Provision Staff'}
            </button>
          </>
        }
      >
        {staffModal.error && (
          <div className="admin-login-error" style={{ marginBottom: '0.75rem' }}>
            <span>{staffModal.error}</span>
          </div>
        )}

        {!staffModal.staff && (
          <div className="admin-form-group">
            <label className="admin-label">Username</label>
            <input
              type="text"
              className="admin-input"
              value={staffModal.username}
              onChange={(e) => setStaffModal({ ...staffModal, username: e.target.value, error: '' })}
              required
            />
          </div>
        )}

        <div className="admin-form-group">
          <label className="admin-label">Full Name</label>
          <input
            type="text"
            className="admin-input"
            value={staffModal.fullName}
            onChange={(e) => setStaffModal({ ...staffModal, fullName: e.target.value })}
            required
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-label">Email Address</label>
          <input
            type="email"
            className="admin-input"
            value={staffModal.email}
            onChange={(e) => setStaffModal({ ...staffModal, email: e.target.value, error: '' })}
            required
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-label">
            {staffModal.staff ? 'Reset Password (Leave blank to keep current)' : 'Initial Password'}
          </label>
          <input
            type="password"
            className="admin-input"
            value={staffModal.password}
            onChange={(e) => setStaffModal({ ...staffModal, password: e.target.value })}
            required={!staffModal.staff}
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-label">Administrative Role</label>
          <select
            className="admin-select-input"
            style={{ width: '100%' }}
            value={staffModal.role}
            onChange={(e) => setStaffModal({ ...staffModal, role: e.target.value })}
          >
            <option value="SUPER_ADMIN">SUPER_ADMIN (Full Platform Authority)</option>
            <option value="MODERATOR">MODERATOR (Listing Verification & Users)</option>
            <option value="SUPPORT">SUPPORT (Customer Accounts & Read-Only)</option>
            <option value="SALES">SALES (Lead Pipeline & Billing Extension)</option>
            <option value="CONTENT">CONTENT (Geographies, FAQs & Media)</option>
          </select>
        </div>

        {staffModal.staff && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
            <input
              type="checkbox"
              id="staff-active"
              checked={staffModal.active}
              onChange={(e) => setStaffModal({ ...staffModal, active: e.target.checked })}
            />
            <label htmlFor="staff-active" style={{ fontSize: '0.85rem' }}>Active Account</label>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
