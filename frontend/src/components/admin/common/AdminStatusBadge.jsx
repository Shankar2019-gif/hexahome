import React from 'react';

// ============================================================================
// Semantic Status Badge for Admin Entities
// Maps backend enums (PropertyStatus, LeadStatus, UserStatus, etc.) to badge styles
// ============================================================================

const STATUS_CLASS_MAP = {
  // Green / Success
  ACTIVE: 'admin-badge-success',
  APPROVED: 'admin-badge-success',
  RESOLVED: 'admin-badge-success',
  WON: 'admin-badge-success',
  PAID: 'admin-badge-success',
  COMPLETED: 'admin-badge-success',
  SUCCESS: 'admin-badge-success',

  // Amber / Warning / In Progress
  PENDING: 'admin-badge-warning',
  PENDING_VERIFICATION: 'admin-badge-warning',
  IN_PROGRESS: 'admin-badge-warning',
  CONTACTED: 'admin-badge-warning',
  QUALIFIED: 'admin-badge-warning',
  REVIEWED: 'admin-badge-warning',

  // Red / Danger
  REJECTED: 'admin-badge-danger',
  BLOCKED: 'admin-badge-danger',
  EXPIRED: 'admin-badge-danger',
  LOST: 'admin-badge-danger',
  FAILED: 'admin-badge-danger',
  DISMISSED: 'admin-badge-danger',
  CANCELLED: 'admin-badge-danger',

  // Neutral / Gray
  INACTIVE: 'admin-badge-neutral',
  CLOSED: 'admin-badge-neutral',
  DRAFT: 'admin-badge-neutral',
  ARCHIVED: 'admin-badge-neutral',

  // Info / Blue
  NEW: 'admin-badge-info',
  TRIAL: 'admin-badge-info',
  SUPER_ADMIN: 'admin-badge-info',
  MODERATOR: 'admin-badge-info',
  SALES: 'admin-badge-info',
  SUPPORT: 'admin-badge-info',
  CONTENT: 'admin-badge-info',
};

export default function AdminStatusBadge({ status, label, showDot = true, className = '' }) {
  if (!status) return null;

  const rawStatus = String(status).toUpperCase();
  const badgeClass = STATUS_CLASS_MAP[rawStatus] || 'admin-badge-neutral';
  const displayLabel = label || status.replace(/_/g, ' ');

  return (
    <span className={`admin-badge ${badgeClass} ${className}`}>
      {showDot && <span className="admin-badge-dot" />}
      <span>{displayLabel}</span>
    </span>
  );
}
