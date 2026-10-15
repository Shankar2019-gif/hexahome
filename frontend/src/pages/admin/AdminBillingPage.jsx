import React, { useState, useEffect, useCallback } from 'react';
import {
  CreditCard,
  Receipt,
  Calendar,
  Gift,
  AlertTriangle,
  X,
  CheckCircle,
  Eye,
  Plus,
  Ban,
  Clock,
} from 'lucide-react';
import { adminBillingApi } from '../../services/adminApi';
import AdminDataTable from '../../components/admin/common/AdminDataTable';
import AdminFilterBar from '../../components/admin/common/AdminFilterBar';
import AdminStatusBadge from '../../components/admin/common/AdminStatusBadge';
import AdminModal from '../../components/admin/common/AdminModal';
import AdminRoleGuard from '../../components/admin/common/AdminRoleGuard';

// ============================================================================
// Plans, Subscriptions & Billing Workspace
// Lifecycle extensions, contact credit grants, and payment transaction logs
// ============================================================================

export default function AdminBillingPage() {
  const [activeTab, setActiveTab] = useState('subscriptions'); // 'subscriptions' | 'payments'

  // Subscriptions State
  const [subscriptions, setSubscriptions] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [subLoading, setSubLoading] = useState(false);
  const [subPage, setSubPage] = useState(0);
  const [subSize, setSubSize] = useState(20);
  const [subKeyword, setSubKeyword] = useState('');
  const [subStatus, setSubStatus] = useState('');

  // Payments State
  const [payments, setPayments] = useState([]);
  const [payTotal, setPayTotal] = useState(0);
  const [payLoading, setPayLoading] = useState(false);
  const [payPage, setPayPage] = useState(0);
  const [paySize, setPaySize] = useState(20);
  const [payKeyword, setPayKeyword] = useState('');
  const [payStatus, setPayStatus] = useState('');

  // Notifications
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  // Action Modals
  const [extendModal, setExtendModal] = useState({ isOpen: false, subId: null, days: 30, reason: '', error: '' });
  const [grantModal, setGrantModal] = useState({ isOpen: false, subId: null, credits: 10, reason: '', error: '' });
  const [cancelModal, setCancelModal] = useState({ isOpen: false, subId: null, reason: '', error: '' });
  const [subDetailModal, setSubDetailModal] = useState({ isOpen: false, detail: null, loading: false });

  // Fetch Subscriptions
  const fetchSubscriptions = useCallback(async () => {
    setSubLoading(true);
    setActionError('');
    try {
      const res = await adminBillingApi.searchSubscriptions({
        keyword: subKeyword.trim() || undefined,
        status: subStatus || undefined,
        page: subPage,
        size: subSize,
      });
      if (res && res.content) {
        setSubscriptions(res.content);
        setSubTotal(res.totalElements || 0);
      } else {
        setSubscriptions([]);
        setSubTotal(0);
      }
    } catch (err) {
      console.error('Failed to load subscriptions:', err);
      setActionError(err.message || 'Error loading subscriptions');
    } finally {
      setSubLoading(false);
    }
  }, [subKeyword, subStatus, subPage, subSize]);

  // Fetch Payments
  const fetchPayments = useCallback(async () => {
    setPayLoading(true);
    setActionError('');
    try {
      const res = await adminBillingApi.searchPayments({
        keyword: payKeyword.trim() || undefined,
        status: payStatus || undefined,
        page: payPage,
        size: paySize,
      });
      if (res && res.content) {
        setPayments(res.content);
        setPayTotal(res.totalElements || 0);
      } else {
        setPayments([]);
        setPayTotal(0);
      }
    } catch (err) {
      console.error('Failed to load payments:', err);
      setActionError(err.message || 'Error loading payments');
    } finally {
      setPayLoading(false);
    }
  }, [payKeyword, payStatus, payPage, paySize]);

  useEffect(() => {
    if (activeTab === 'subscriptions') {
      fetchSubscriptions();
    } else {
      fetchPayments();
    }
  }, [activeTab, fetchSubscriptions, fetchPayments]);

  // Extend Subscription
  const handleConfirmExtend = async () => {
    if (!extendModal.reason.trim()) {
      setExtendModal((prev) => ({ ...prev, error: 'Reason for validity extension is required.' }));
      return;
    }
    try {
      await adminBillingApi.extendSubscription(
        extendModal.subId,
        Number(extendModal.days),
        extendModal.reason.trim()
      );
      setActionSuccess(`Subscription extended by ${extendModal.days} days.`);
      setExtendModal({ isOpen: false, subId: null, days: 30, reason: '', error: '' });
      fetchSubscriptions();
    } catch (err) {
      setExtendModal((prev) => ({ ...prev, error: err.message || 'Extension failed' }));
    }
  };

  // Grant Credits
  const handleConfirmGrant = async () => {
    if (!grantModal.reason.trim()) {
      setGrantModal((prev) => ({ ...prev, error: 'Reason for manual credit grant is required.' }));
      return;
    }
    try {
      await adminBillingApi.grantCredits(
        grantModal.subId,
        Number(grantModal.credits),
        grantModal.reason.trim()
      );
      setActionSuccess(`Granted ${grantModal.credits} contact credits successfully.`);
      setGrantModal({ isOpen: false, subId: null, credits: 10, reason: '', error: '' });
      fetchSubscriptions();
    } catch (err) {
      setGrantModal((prev) => ({ ...prev, error: err.message || 'Credit grant failed' }));
    }
  };

  // Cancel Subscription
  const handleConfirmCancel = async () => {
    if (!cancelModal.reason.trim()) {
      setCancelModal((prev) => ({ ...prev, error: 'Reason for subscription cancellation is required.' }));
      return;
    }
    try {
      await adminBillingApi.cancelSubscription(cancelModal.subId, cancelModal.reason.trim());
      setActionSuccess('Subscription cancelled.');
      setCancelModal({ isOpen: false, subId: null, reason: '', error: '' });
      fetchSubscriptions();
    } catch (err) {
      setCancelModal((prev) => ({ ...prev, error: err.message || 'Cancellation failed' }));
    }
  };

  // Inspect Subscription Detail
  const handleInspectSub = async (id) => {
    setSubDetailModal({ isOpen: true, detail: null, loading: true });
    try {
      const detail = await adminBillingApi.getSubscriptionDetail(id);
      setSubDetailModal({ isOpen: true, detail, loading: false });
    } catch (err) {
      setActionError(err.message || 'Failed to fetch subscription detail');
      setSubDetailModal({ isOpen: false, detail: null, loading: false });
    }
  };

  const subscriptionColumns = [
    {
      header: 'Customer',
      key: 'customerName',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: '#0f172a' }}>{row.customerName || 'Subscriber'}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{row.customerEmail || '—'}</div>
        </div>
      ),
    },
    {
      header: 'Plan',
      key: 'planName',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 700, color: '#033487' }}>{row.planName || 'Standard'}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>₹{row.pricePaid || 0}</div>
        </div>
      ),
    },
    {
      header: 'Credits Remaining',
      key: 'creditsRemaining',
      render: (row) => (
        <div>
          <span style={{ fontWeight: 700, color: '#16a34a', fontSize: '0.95rem' }}>
            {row.creditsRemaining || 0}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}> / {row.totalCredits || 0} total</span>
        </div>
      ),
    },
    {
      header: 'Valid Until',
      key: 'validUntil',
      render: (row) => (
        <span style={{ fontSize: '0.825rem', color: '#334155' }}>
          {row.validUntil ? new Date(row.validUntil).toLocaleDateString() : '—'}
        </span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
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
            onClick={() => handleInspectSub(row.id)}
            title="Inspect Details"
          >
            <Eye size={14} />
          </button>

          <AdminRoleGuard allowedRoles={['SUPER_ADMIN', 'SALES']}>
            <button
              type="button"
              className="admin-btn admin-btn-secondary admin-btn-sm"
              onClick={() =>
                setExtendModal({
                  isOpen: true,
                  subId: row.id,
                  days: 30,
                  reason: '',
                  error: '',
                })
              }
              title="Extend Validity Duration"
            >
              <Calendar size={14} />
            </button>

            <button
              type="button"
              className="admin-btn admin-btn-secondary admin-btn-sm"
              onClick={() =>
                setGrantModal({
                  isOpen: true,
                  subId: row.id,
                  credits: 10,
                  reason: '',
                  error: '',
                })
              }
              title="Grant Bonus Credits"
            >
              <Gift size={14} />
            </button>

            {row.status === 'ACTIVE' && (
              <button
                type="button"
                className="admin-btn admin-btn-danger admin-btn-sm"
                onClick={() =>
                  setCancelModal({
                    isOpen: true,
                    subId: row.id,
                    reason: '',
                    error: '',
                  })
                }
                title="Cancel Subscription"
              >
                <Ban size={14} />
              </button>
            )}
          </AdminRoleGuard>
        </div>
      ),
    },
  ];

  const paymentColumns = [
    {
      header: 'Payment ID / Order',
      key: 'paymentId',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: '#0f172a' }}>{row.paymentId || row.id}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Order: {row.orderId || '—'}</div>
        </div>
      ),
    },
    {
      header: 'Customer',
      key: 'customerName',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.customerName || 'Customer'}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{row.customerEmail || '—'}</div>
        </div>
      ),
    },
    {
      header: 'Amount',
      key: 'amount',
      render: (row) => (
        <span style={{ fontWeight: 700, color: '#033487' }}>
          ₹{Number(row.amount || 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      header: 'Method',
      key: 'paymentMethod',
      render: (row) => <AdminStatusBadge status={row.paymentMethod || 'UPI'} showDot={false} />,
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <AdminStatusBadge status={row.status || 'PAID'} />,
    },
    {
      header: 'Date & Time',
      key: 'createdAt',
      render: (row) => (
        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
          {row.createdAt ? new Date(row.createdAt).toLocaleString() : '—'}
        </span>
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
          className={`admin-btn ${activeTab === 'subscriptions' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
          onClick={() => setActiveTab('subscriptions')}
        >
          <CreditCard size={16} />
          <span>Customer Subscriptions</span>
        </button>

        <button
          type="button"
          className={`admin-btn ${activeTab === 'payments' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
          onClick={() => setActiveTab('payments')}
        >
          <Receipt size={16} />
          <span>Payment Transactions</span>
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

      {/* Subscriptions View */}
      {activeTab === 'subscriptions' && (
        <>
          <AdminFilterBar
            searchPlaceholder="Search subscriptions by customer..."
            searchValue={subKeyword}
            onSearchChange={(val) => {
              setSubKeyword(val);
              setSubPage(0);
            }}
            filters={[
              {
                id: 'status',
                label: 'All Statuses',
                value: subStatus,
                options: [
                  { label: 'Active', value: 'ACTIVE' },
                  { label: 'Expired', value: 'EXPIRED' },
                  { label: 'Cancelled', value: 'CANCELLED' },
                ],
                onChange: (val) => {
                  setSubStatus(val);
                  setSubPage(0);
                },
              },
            ]}
            onReset={() => {
              setSubKeyword('');
              setSubStatus('');
              setSubPage(0);
            }}
          />

          <AdminDataTable
            columns={subscriptionColumns}
            data={subscriptions}
            loading={subLoading}
            totalItems={subTotal}
            page={subPage}
            pageSize={subSize}
            onPageChange={setSubPage}
            onPageSizeChange={(newSize) => {
              setSubSize(newSize);
              setSubPage(0);
            }}
            emptyMessage="No customer subscriptions found."
          />
        </>
      )}

      {/* Payments View */}
      {activeTab === 'payments' && (
        <>
          <AdminFilterBar
            searchPlaceholder="Search payments by ID, customer..."
            searchValue={payKeyword}
            onSearchChange={(val) => {
              setPayKeyword(val);
              setPayPage(0);
            }}
            filters={[
              {
                id: 'status',
                label: 'All Payment States',
                value: payStatus,
                options: [
                  { label: 'Success / Paid', value: 'SUCCESS' },
                  { label: 'Pending', value: 'PENDING' },
                  { label: 'Failed', value: 'FAILED' },
                ],
                onChange: (val) => {
                  setPayStatus(val);
                  setPayPage(0);
                },
              },
            ]}
            onReset={() => {
              setPayKeyword('');
              setPayStatus('');
              setPayPage(0);
            }}
          />

          <AdminDataTable
            columns={paymentColumns}
            data={payments}
            loading={payLoading}
            totalItems={payTotal}
            page={payPage}
            pageSize={paySize}
            onPageChange={setPayPage}
            onPageSizeChange={(newSize) => {
              setPaySize(newSize);
              setPayPage(0);
            }}
            emptyMessage="No payment transactions found."
          />
        </>
      )}

      {/* Extend Validity Modal */}
      <AdminModal
        isOpen={extendModal.isOpen}
        onClose={() => setExtendModal({ isOpen: false, subId: null, days: 30, reason: '', error: '' })}
        title="Extend Subscription Validity"
        footer={
          <>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => setExtendModal({ isOpen: false, subId: null, days: 30, reason: '', error: '' })}
            >
              Cancel
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              onClick={handleConfirmExtend}
            >
              Extend Validity
            </button>
          </>
        }
      >
        {extendModal.error && (
          <div className="admin-login-error" style={{ marginBottom: '0.75rem' }}>
            <AlertTriangle size={16} />
            <span>{extendModal.error}</span>
          </div>
        )}

        <div className="admin-form-group">
          <label className="admin-label">Additional Days</label>
          <input
            type="number"
            className="admin-input"
            min={1}
            max={365}
            value={extendModal.days}
            onChange={(e) => setExtendModal((prev) => ({ ...prev, days: e.target.value, error: '' }))}
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-label">Mandatory Audit Reason</label>
          <textarea
            className="admin-input"
            rows={3}
            placeholder="e.g. Courtesy extension granted for platform downtime resolution"
            value={extendModal.reason}
            onChange={(e) => setExtendModal((prev) => ({ ...prev, reason: e.target.value, error: '' }))}
            required
          />
        </div>
      </AdminModal>

      {/* Grant Credits Modal */}
      <AdminModal
        isOpen={grantModal.isOpen}
        onClose={() => setGrantModal({ isOpen: false, subId: null, credits: 10, reason: '', error: '' })}
        title="Grant Contact Credits"
        footer={
          <>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => setGrantModal({ isOpen: false, subId: null, credits: 10, reason: '', error: '' })}
            >
              Cancel
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              onClick={handleConfirmGrant}
            >
              Grant Credits
            </button>
          </>
        }
      >
        {grantModal.error && (
          <div className="admin-login-error" style={{ marginBottom: '0.75rem' }}>
            <AlertTriangle size={16} />
            <span>{grantModal.error}</span>
          </div>
        )}

        <div className="admin-form-group">
          <label className="admin-label">Credits to Grant</label>
          <input
            type="number"
            className="admin-input"
            min={1}
            max={500}
            value={grantModal.credits}
            onChange={(e) => setGrantModal((prev) => ({ ...prev, credits: e.target.value, error: '' }))}
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-label">Mandatory Audit Reason</label>
          <textarea
            className="admin-input"
            rows={3}
            placeholder="e.g. Promotional campaign compensation or loyalty customer reward"
            value={grantModal.reason}
            onChange={(e) => setGrantModal((prev) => ({ ...prev, reason: e.target.value, error: '' }))}
            required
          />
        </div>
      </AdminModal>

      {/* Cancel Subscription Modal */}
      <AdminModal
        isOpen={cancelModal.isOpen}
        onClose={() => setCancelModal({ isOpen: false, subId: null, reason: '', error: '' })}
        title="Cancel Subscription"
        footer={
          <>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => setCancelModal({ isOpen: false, subId: null, reason: '', error: '' })}
            >
              Back
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-danger"
              onClick={handleConfirmCancel}
            >
              Confirm Cancellation
            </button>
          </>
        }
      >
        <p style={{ margin: '0 0 1rem 0' }}>
          Are you sure you want to cancel this subscription immediately? The remaining credits will be frozen.
        </p>

        {cancelModal.error && (
          <div className="admin-login-error" style={{ marginBottom: '0.75rem' }}>
            <AlertTriangle size={16} />
            <span>{cancelModal.error}</span>
          </div>
        )}

        <textarea
          className="admin-input"
          rows={3}
          placeholder="Specify mandatory reason for cancelling this customer subscription..."
          value={cancelModal.reason}
          onChange={(e) => setCancelModal((prev) => ({ ...prev, reason: e.target.value, error: '' }))}
          required
        />
      </AdminModal>

      {/* Subscription Detail Modal */}
      <AdminModal
        isOpen={subDetailModal.isOpen}
        onClose={() => setSubDetailModal({ isOpen: false, detail: null, loading: false })}
        title="Subscription Detail"
        footer={
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={() => setSubDetailModal({ isOpen: false, detail: null, loading: false })}
          >
            Close
          </button>
        }
      >
        {subDetailModal.loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading subscription...</div>
        ) : subDetailModal.detail ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div>
              <strong>Subscriber:</strong> {subDetailModal.detail.customerName}
            </div>
            <div>
              <strong>Plan Name:</strong> {subDetailModal.detail.planName}
            </div>
            <div>
              <strong>Status:</strong> <AdminStatusBadge status={subDetailModal.detail.status} />
            </div>
            <div>
              <strong>Price:</strong> ₹{subDetailModal.detail.pricePaid || 0}
            </div>
            <div>
              <strong>Credits Remaining:</strong> {subDetailModal.detail.creditsRemaining} / {subDetailModal.detail.totalCredits}
            </div>
            <div>
              <strong>Expires On:</strong>{' '}
              {subDetailModal.detail.validUntil ? new Date(subDetailModal.detail.validUntil).toLocaleString() : '—'}
            </div>
          </div>
        ) : null}
      </AdminModal>
    </div>
  );
}
