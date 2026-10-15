import React, { useState, useEffect, useCallback } from 'react';
import {
  Building2,
  Clock,
  CheckCircle2,
  Users,
  Target,
  RefreshCw,
  AlertTriangle,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { adminDashboardApi } from '../../services/adminApi';
import AdminStatusBadge from '../../components/admin/common/AdminStatusBadge';

// ============================================================================
// HexaHome Admin Operational Dashboard Page
// Aggregates real-time platform KPIs, pending moderation counters, and audit feed
// ============================================================================

export default function AdminDashboardPage({ onNavigate }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const fetchMetrics = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const data = await adminDashboardApi.getMetrics();
      setStats(data);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
      setError(err.message || 'Unable to retrieve operational metrics.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  const formatTimestamp = (isoString) => {
    if (!isoString) return 'Just now';
    try {
      const d = new Date(isoString);
      return d.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div>
      {/* Top Action Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
            Platform Overview
          </h2>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Last synchronized: {lastRefreshed.toLocaleTimeString()}
          </span>
        </div>

        <button
          type="button"
          className="admin-btn admin-btn-secondary"
          onClick={() => fetchMetrics(true)}
          disabled={loading || refreshing}
        >
          <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {error && (
        <div className="admin-login-error" style={{ marginBottom: '1.5rem' }}>
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Pending Moderation Callout (if pending listings exist) */}
      {stats && stats.pendingListings > 0 && (
        <div
          style={{
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '8px',
            padding: '1rem 1.25rem',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#fef3c7',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
              }}
            >
              <Clock size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#92400e', fontSize: '0.95rem' }}>
                {stats.pendingListings} Property Listings Pending Moderation
              </div>
              <div style={{ fontSize: '0.825rem', color: '#b45309' }}>
                New customer submissions awaiting verification before appearing publicly.
              </div>
            </div>
          </div>

          <button
            type="button"
            className="admin-btn admin-btn-primary admin-btn-sm"
            onClick={() => onNavigate && onNavigate('/admin/properties?status=PENDING_VERIFICATION')}
          >
            <span>Review Queue</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="admin-metrics-grid">
        <div
          className="admin-metric-card"
          onClick={() => onNavigate && onNavigate('/admin/properties')}
          style={{ cursor: 'pointer' }}
        >
          <div>
            <div className="admin-metric-label">Total Listings</div>
            <div className="admin-metric-value">{stats ? stats.totalListings : '—'}</div>
          </div>
          <div className="admin-metric-icon-box blue">
            <Building2 size={24} />
          </div>
        </div>

        <div
          className="admin-metric-card"
          onClick={() => onNavigate && onNavigate('/admin/properties?status=PENDING_VERIFICATION')}
          style={{ cursor: 'pointer' }}
        >
          <div>
            <div className="admin-metric-label">Pending Review</div>
            <div
              className="admin-metric-value"
              style={stats?.pendingListings > 0 ? { color: '#d97706' } : {}}
            >
              {stats ? stats.pendingListings : '—'}
            </div>
          </div>
          <div className="admin-metric-icon-box amber">
            <Clock size={24} />
          </div>
        </div>

        <div
          className="admin-metric-card"
          onClick={() => onNavigate && onNavigate('/admin/properties?status=ACTIVE')}
          style={{ cursor: 'pointer' }}
        >
          <div>
            <div className="admin-metric-label">Active Listings</div>
            <div className="admin-metric-value">{stats ? stats.activeListings : '—'}</div>
          </div>
          <div className="admin-metric-icon-box green">
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div
          className="admin-metric-card"
          onClick={() => onNavigate && onNavigate('/admin/users')}
          style={{ cursor: 'pointer' }}
        >
          <div>
            <div className="admin-metric-label">Total Users</div>
            <div className="admin-metric-value">{stats ? stats.totalUsers : '—'}</div>
          </div>
          <div className="admin-metric-icon-box purple">
            <Users size={24} />
          </div>
        </div>

        <div
          className="admin-metric-card"
          onClick={() => onNavigate && onNavigate('/admin/leads')}
          style={{ cursor: 'pointer' }}
        >
          <div>
            <div className="admin-metric-label">Total Leads</div>
            <div className="admin-metric-value">{stats ? stats.totalLeads : '—'}</div>
          </div>
          <div className="admin-metric-icon-box blue">
            <Target size={24} />
          </div>
        </div>
      </div>

      {/* Activity Feed Section */}
      <div className="admin-activity-card">
        <div className="admin-activity-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={18} style={{ color: '#033487' }} />
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
              Recent Administrative Activity
            </h3>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Latest audited operations
          </span>
        </div>

        <div className="admin-activity-list">
          {loading && !stats ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              Loading recent activities...
            </div>
          ) : !stats?.recentActivities || stats.recentActivities.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              No recent audit activity recorded yet.
            </div>
          ) : (
            stats.recentActivities.map((act) => (
              <div key={act.id || act.createdAt} className="admin-activity-item">
                <div className="admin-activity-avatar">
                  {(act.adminUsername || 'SYS').slice(0, 2).toUpperCase()}
                </div>
                <div className="admin-activity-content">
                  <div className="admin-activity-text">
                    <span className="admin-activity-actor">@{act.adminUsername}</span> executed{' '}
                    <strong>{act.action}</strong> on <code>{act.entityType}</code>
                    {act.reason && (
                      <span style={{ color: '#64748b' }}> &mdash; "{act.reason}"</span>
                    )}
                  </div>
                  <div className="admin-activity-time">
                    {formatTimestamp(act.createdAt)}
                    {act.outcome && (
                      <AdminStatusBadge
                        status={act.outcome}
                        showDot={false}
                        className="admin-btn-sm"
                        style={{ marginLeft: '0.5rem', fontSize: '0.7rem' }}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
