import React from 'react';
import { useAdminAuth } from '../../../hooks/useAdminAuth';

// ============================================================================
// Admin Role Guard Component
// Conditionally renders children only if the logged-in admin has allowed role(s)
// ============================================================================

export default function AdminRoleGuard({ allowedRoles = [], fallback = null, children }) {
  const { adminUser, hasAnyRole } = useAdminAuth();

  if (!adminUser) return fallback;

  if (allowedRoles.length === 0) return children;

  const isAuthorized = hasAnyRole(allowedRoles);

  if (!isAuthorized) {
    return fallback;
  }

  return <>{children}</>;
}
