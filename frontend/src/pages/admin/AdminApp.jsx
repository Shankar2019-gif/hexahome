import React from 'react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import AdminLayout from '../../components/admin/common/AdminLayout';
import AdminLoginPage from './AdminLoginPage';
import AdminDashboardPage from './AdminDashboardPage';
import AdminPropertyModerationPage from './AdminPropertyModerationPage';
import AdminUserManagementPage from './AdminUserManagementPage';
import AdminLeadManagementPage from './AdminLeadManagementPage';
import AdminBillingPage from './AdminBillingPage';
import AdminContentPage from './AdminContentPage';
import AdminSystemPage from './AdminSystemPage';
import { Loader2 } from 'lucide-react';

// ============================================================================
// HexaHome Admin Master Route Handler
// Handles /admin/* routing, role protection, login flow, and layout wrapping
// ============================================================================

export default function AdminApp({ currentPath, onNavigate }) {
  const { isAuthenticated, isLoading, adminUser } = useAdminAuth();

  // If loading session from storage
  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#071739',
          color: '#ffffff',
          gap: '1rem',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
        }}
      >
        <Loader2 size={36} className="animate-spin" style={{ color: '#38bdf8' }} />
        <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>
          Initializing HexaHome Admin Console...
        </span>
      </div>
    );
  }

  // Public login page for admin staff
  if (currentPath === '/admin/login') {
    return <AdminLoginPage onNavigate={onNavigate} />;
  }

  // If not authenticated, require login
  if (!isAuthenticated) {
    return <AdminLoginPage onNavigate={onNavigate} />;
  }

  // Map sub-routes to pages and layout titles
  let title = 'Operations Dashboard';
  let pageContent = <AdminDashboardPage onNavigate={onNavigate} />;

  if (currentPath.startsWith('/admin/properties')) {
    title = 'Listing Moderation & Verification';
    pageContent = <AdminPropertyModerationPage onNavigate={onNavigate} />;
  } else if (currentPath.startsWith('/admin/users')) {
    title = 'Customer & User Management';
    pageContent = <AdminUserManagementPage onNavigate={onNavigate} />;
  } else if (currentPath.startsWith('/admin/leads')) {
    title = 'Lead Management & Sales Pipeline';
    pageContent = <AdminLeadManagementPage onNavigate={onNavigate} />;
  } else if (currentPath.startsWith('/admin/billing')) {
    title = 'Subscriptions & Payment Transactions';
    pageContent = <AdminBillingPage onNavigate={onNavigate} />;
  } else if (currentPath.startsWith('/admin/content')) {
    title = 'Content, Geographies & Media';
    pageContent = <AdminContentPage onNavigate={onNavigate} />;
  } else if (currentPath.startsWith('/admin/system')) {
    title = 'System Administration & Audit Logs';
    pageContent = <AdminSystemPage onNavigate={onNavigate} />;
  }

  return (
    <AdminLayout currentPath={currentPath} onNavigate={onNavigate} title={title}>
      {pageContent}
    </AdminLayout>
  );
}
