import React, { useState, useEffect, useCallback } from 'react';
import {
  Target,
  Download,
  UserCheck,
  Clock,
  History,
  Eye,
  X,
  AlertCircle,
  Building,
  Phone,
  Mail,
  ArrowRight,
} from 'lucide-react';
import { adminLeadApi } from '../../services/adminApi';
import AdminDataTable from '../../components/admin/common/AdminDataTable';
import AdminFilterBar from '../../components/admin/common/AdminFilterBar';
import AdminStatusBadge from '../../components/admin/common/AdminStatusBadge';
import AdminModal from '../../components/admin/common/AdminModal';
import AdminRoleGuard from '../../components/admin/common/AdminRoleGuard';

// ============================================================================
// Lead Management Workspace
// Inquiries pipeline, sales representative assignment, status flow & CSV export
// ============================================================================

export default function AdminLeadManagementPage() {
  const [leads, setLeads] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  // Filters
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [leadType, setLeadType] = useState('');

  // Notifications
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');
  const [exporting, setExporting] = useState(false);

  // Modals
  const [detailModal, setDetailModal] = useState({ isOpen: false, lead: null, loading: false });
  const [assignModal, setAssignModal] = useState({ isOpen: false, leadId: null, assignedToId: '', notes: '', error: '' });
  const [statusModal, setStatusModal] = useState({ isOpen: false, leadId: null, currentStatus: '', nextStatus: '', notes: '', error: '' });
  const [activityModal, setActivityModal] = useState({ isOpen: false, leadId: null, activities: [], loading: false });

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setActionError('');
    try {
      const response = await adminLeadApi.searchLeads({
        keyword: keyword.trim() || undefined,
        status: status || undefined,
        leadType: leadType || undefined,
        page,
        size: pageSize,
        sortBy,
        sortDirection,
      });

      if (response && response.content) {
        setLeads(response.content);
        setTotalItems(response.totalElements || 0);
      } else {
        setLeads([]);
        setTotalItems(0);
      }
    } catch (err) {
      console.error('Failed to load leads:', err);
      setActionError(err.message || 'Error loading leads');
    } finally {
      setLoading(false);
    }
  }, [keyword, status, leadType, page, pageSize, sortBy, sortDirection]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Export CSV
  const handleExportCsv = async () => {
    setExporting(true);
    setActionError('');
    try {
      const csvBlob = await adminLeadApi.exportLeadsCsv({
        keyword: keyword.trim() || undefined,
        status: status || undefined,
        leadType: leadType || undefined,
      });

      const blob = new Blob([csvBlob], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `leads_export_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setActionSuccess('Leads CSV exported successfully.');
    } catch (err) {
      console.error('CSV export failed:', err);
      setActionError(err.message || 'CSV export failed.');
    } finally {
      setExporting(false);
    }
  };

  // Inspect Lead
  const handleInspect = async (id) => {
    setDetailModal({ isOpen: true, lead: null, loading: true });
    try {
      const detail = await adminLeadApi.getLeadDetail(id);
      setDetailModal({ isOpen: true, lead: detail, loading: false });
    } catch (err) {
      setActionError(err.message || 'Failed to fetch lead details');
      setDetailModal({ isOpen: false, lead: null, loading: false });
    }
  };

  // Assign Lead
  const handleConfirmAssign = async () => {
    if (!assignModal.assignedToId.trim()) {
      setAssignModal((prev) => ({ ...prev, error: 'Staff User ID or Username is required.' }));
      return;
    }
    try {
      await adminLeadApi.assignLead(assignModal.leadId, assignModal.assignedToId.trim(), assignModal.notes);
      setActionSuccess('Lead assigned to representative successfully.');
      setAssignModal({ isOpen: false, leadId: null, assignedToId: '', notes: '', error: '' });
      fetchLeads();
    } catch (err) {
      setAssignModal((prev) => ({ ...prev, error: err.message || 'Failed to assign lead' }));
    }
  };

  // Update Status
  const handleConfirmStatus = async () => {
    if (!statusModal.nextStatus) {
      setStatusModal((prev) => ({ ...prev, error: 'Please choose target status.' }));
      return;
    }
    try {
      await adminLeadApi.updateLeadStatus(statusModal.leadId, statusModal.nextStatus, statusModal.notes);
      setActionSuccess(`Lead status updated to ${statusModal.nextStatus}.`);
      setStatusModal({ isOpen: false, leadId: null, currentStatus: '', nextStatus: '', notes: '', error: '' });
      fetchLeads();
    } catch (err) {
      setStatusModal((prev) => ({ ...prev, error: err.message || 'Failed to update lead status' }));
    }
  };

  // View Activity History
  const handleViewActivity = async (id) => {
    setActivityModal({ isOpen: true, leadId: id, activities: [], loading: true });
    try {
      const history = await adminLeadApi.getLeadActivityHistory(id);
      setActivityModal({ isOpen: true, leadId: id, activities: history || [], loading: false });
    } catch (err) {
      setActionError(err.message || 'Failed to fetch lead history');
      setActivityModal({ isOpen: false, leadId: null, activities: [], loading: false });
    }
  };

  const columns = [
    {
      header: 'Inquirer',
      key: 'userName',
      sortable: true,
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: '#0f172a' }}>{row.userName || 'Prospective Client'}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            {row.userPhone || '—'} &bull; {row.userEmail || '—'}
          </div>
        </div>
      ),
    },
    {
      header: 'Property Interested',
      key: 'propertyTitle',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: '#033487', fontSize: '0.875rem' }}>
            {row.propertyTitle || 'Direct Inquire'}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            {row.locality || 'General'}, {row.city || ''}
          </div>
        </div>
      ),
    },
    {
      header: 'Type',
      key: 'leadType',
      sortable: true,
      render: (row) => <AdminStatusBadge status={row.leadType} showDot={false} />,
    },
    {
      header: 'Status',
      key: 'status',
      sortable: true,
      render: (row) => <AdminStatusBadge status={row.status} />,
    },
    {
      header: 'Assigned Representative',
      key: 'assignedToUsername',
      render: (row) =>
        row.assignedToUsername ? (
          <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.85rem' }}>
            @{row.assignedToUsername}
          </span>
        ) : (
          <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.85rem' }}>
            Unassigned
          </span>
        ),
    },
    {
      header: 'Inquired On',
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

          <AdminRoleGuard allowedRoles={['SUPER_ADMIN', 'SALES']}>
            <button
              type="button"
              className="admin-btn admin-btn-secondary admin-btn-sm"
              onClick={() =>
                setAssignModal({
                  isOpen: true,
                  leadId: row.id,
                  assignedToId: row.assignedToUsername || '',
                  notes: '',
                  error: '',
                })
              }
              title="Assign to Sales Rep"
            >
              <UserCheck size={14} />
            </button>
          </AdminRoleGuard>

          <AdminRoleGuard allowedRoles={['SUPER_ADMIN', 'SALES', 'SUPPORT']}>
            <button
              type="button"
              className="admin-btn admin-btn-primary admin-btn-sm"
              onClick={() =>
                setStatusModal({
                  isOpen: true,
                  leadId: row.id,
                  currentStatus: row.status,
                  nextStatus: row.status,
                  notes: '',
                  error: '',
                })
              }
              title="Update Lifecycle Status"
            >
              <ArrowRight size={14} />
            </button>
          </AdminRoleGuard>

          <button
            type="button"
            className="admin-btn admin-btn-secondary admin-btn-sm"
            onClick={() => handleViewActivity(row.id)}
            title="Audit Activity Timeline"
          >
            <History size={14} />
          </button>
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

      {/* Filter Toolbar with CSV Export */}
      <AdminFilterBar
        searchPlaceholder="Search leads by inquirer, property title..."
        searchValue={keyword}
        onSearchChange={(val) => {
          setKeyword(val);
          setPage(0);
        }}
        filters={[
          {
            id: 'status',
            label: 'All Stages',
            value: status,
            options: [
              { label: 'New', value: 'NEW' },
              { label: 'Contacted', value: 'CONTACTED' },
              { label: 'Qualified', value: 'QUALIFIED' },
              { label: 'In Progress', value: 'IN_PROGRESS' },
              { label: 'Won', value: 'WON' },
              { label: 'Lost', value: 'LOST' },
            ],
            onChange: (val) => {
              setStatus(val);
              setPage(0);
            },
          },
          {
            id: 'leadType',
            label: 'All Types',
            value: leadType,
            options: [
              { label: 'Buy Inquiry', value: 'BUY' },
              { label: 'Rent Inquiry', value: 'RENT' },
            ],
            onChange: (val) => {
              setLeadType(val);
              setPage(0);
            },
          },
        ]}
        onReset={() => {
          setKeyword('');
          setStatus('');
          setLeadType('');
          setPage(0);
        }}
        actions={
          <AdminRoleGuard allowedRoles={['SUPER_ADMIN', 'SALES']}>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={handleExportCsv}
              disabled={exporting}
            >
              <Download size={15} />
              <span>{exporting ? 'Exporting...' : 'Export CSV'}</span>
            </button>
          </AdminRoleGuard>
        }
      />

      {/* Data Table */}
      <AdminDataTable
        columns={columns}
        data={leads}
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
        emptyMessage="No leads found matching your criteria."
      />

      {/* Detail Modal */}
      <AdminModal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, lead: null, loading: false })}
        title="Lead Inspection"
        maxWidth="600px"
        footer={
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={() => setDetailModal({ isOpen: false, lead: null, loading: false })}
          >
            Close
          </button>
        }
      >
        {detailModal.loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading lead details...</div>
        ) : detailModal.lead ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div>
              <strong>Inquirer:</strong> {detailModal.lead.userName}
            </div>
            <div>
              <strong>Status:</strong> <AdminStatusBadge status={detailModal.lead.status} />
            </div>
            <div>
              <strong>Phone:</strong> {detailModal.lead.userPhone || '—'}
            </div>
            <div>
              <strong>Email:</strong> {detailModal.lead.userEmail || '—'}
            </div>
            <div>
              <strong>Property Title:</strong> {detailModal.lead.propertyTitle || 'General'}
            </div>
            <div>
              <strong>Location:</strong> {detailModal.lead.locality}, {detailModal.lead.city}
            </div>
            <div>
              <strong>Assigned Staff:</strong> {detailModal.lead.assignedToUsername || 'None'}
            </div>
            <div>
              <strong>Inquiry Date:</strong>{' '}
              {detailModal.lead.createdAt ? new Date(detailModal.lead.createdAt).toLocaleString() : '—'}
            </div>
            {detailModal.lead.message && (
              <div style={{ gridColumn: 'span 2' }}>
                <strong>Client Message:</strong>
                <p
                  style={{
                    background: '#f8fafc',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    margin: '0.25rem 0 0 0',
                    fontSize: '0.85rem',
                  }}
                >
                  {detailModal.lead.message}
                </p>
              </div>
            )}
          </div>
        ) : null}
      </AdminModal>

      {/* Assign Modal */}
      <AdminModal
        isOpen={assignModal.isOpen}
        onClose={() => setAssignModal({ isOpen: false, leadId: null, assignedToId: '', notes: '', error: '' })}
        title="Assign Lead to Representative"
        footer={
          <>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => setAssignModal({ isOpen: false, leadId: null, assignedToId: '', notes: '', error: '' })}
            >
              Cancel
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              onClick={handleConfirmAssign}
            >
              Assign Lead
            </button>
          </>
        }
      >
        {assignModal.error && (
          <div className="admin-login-error" style={{ marginBottom: '0.75rem' }}>
            <AlertCircle size={16} />
            <span>{assignModal.error}</span>
          </div>
        )}

        <div className="admin-form-group">
          <label className="admin-label">Representative Staff ID or Username</label>
          <input
            type="text"
            className="admin-input"
            placeholder="e.g. sales_rep1"
            value={assignModal.assignedToId}
            onChange={(e) => setAssignModal((prev) => ({ ...prev, assignedToId: e.target.value, error: '' }))}
            required
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-label">Assignment Note (Optional)</label>
          <textarea
            className="admin-input"
            rows={3}
            placeholder="e.g. Client requested callback regarding 3BHK flat in Indiranagar"
            value={assignModal.notes}
            onChange={(e) => setAssignModal((prev) => ({ ...prev, notes: e.target.value }))}
          />
        </div>
      </AdminModal>

      {/* Status Modal */}
      <AdminModal
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal({ isOpen: false, leadId: null, currentStatus: '', nextStatus: '', notes: '', error: '' })}
        title="Update Lead Lifecycle Status"
        footer={
          <>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => setStatusModal({ isOpen: false, leadId: null, currentStatus: '', nextStatus: '', notes: '', error: '' })}
            >
              Cancel
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              onClick={handleConfirmStatus}
            >
              Update Status
            </button>
          </>
        }
      >
        {statusModal.error && (
          <div className="admin-login-error" style={{ marginBottom: '0.75rem' }}>
            <AlertCircle size={16} />
            <span>{statusModal.error}</span>
          </div>
        )}

        <div className="admin-form-group">
          <label className="admin-label">Target Stage</label>
          <select
            className="admin-select-input"
            style={{ width: '100%' }}
            value={statusModal.nextStatus}
            onChange={(e) => setStatusModal((prev) => ({ ...prev, nextStatus: e.target.value, error: '' }))}
          >
            <option value="NEW">NEW</option>
            <option value="CONTACTED">CONTACTED</option>
            <option value="QUALIFIED">QUALIFIED</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="WON">WON</option>
            <option value="LOST">LOST</option>
          </select>
        </div>

        <div className="admin-form-group">
          <label className="admin-label">Progress Note</label>
          <textarea
            className="admin-input"
            rows={3}
            placeholder="e.g. Spoke with client. Site visit scheduled for Saturday."
            value={statusModal.notes}
            onChange={(e) => setStatusModal((prev) => ({ ...prev, notes: e.target.value }))}
          />
        </div>
      </AdminModal>

      {/* Activity Timeline Modal */}
      <AdminModal
        isOpen={activityModal.isOpen}
        onClose={() => setActivityModal({ isOpen: false, leadId: null, activities: [], loading: false })}
        title="Lead Activity History"
        maxWidth="600px"
        footer={
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={() => setActivityModal({ isOpen: false, leadId: null, activities: [], loading: false })}
          >
            Close
          </button>
        }
      >
        {activityModal.loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading activity history...</div>
        ) : activityModal.activities.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
            No status changes or activity recorded yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {activityModal.activities.map((item, idx) => (
              <div
                key={item.id || idx}
                style={{
                  borderLeft: '3px solid #033487',
                  paddingLeft: '0.75rem',
                  paddingBottom: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>
                    {item.action || 'STATUS_UPDATE'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {item.createdAt ? new Date(item.createdAt).toLocaleString() : '—'}
                  </span>
                </div>
                {item.notes && (
                  <div style={{ fontSize: '0.825rem', color: '#334155', marginTop: '2px' }}>
                    {item.notes}
                  </div>
                )}
                {item.adminUsername && (
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Updated by: @{item.adminUsername}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </AdminModal>
    </div>
  );
}
