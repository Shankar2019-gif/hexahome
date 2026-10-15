import React, { useState } from 'react';
import {
  LayoutDashboard,
  Building2,
  Users,
  Target,
  CreditCard,
  FolderKanban,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';
import { useAdminAuth } from '../../../hooks/useAdminAuth';
import AdminStatusBadge from './AdminStatusBadge';
import '../admin.css';

// ============================================================================
// Master Admin Layout Component
// Dark sidebar with role-restricted navigation, top header, and content slot
// ============================================================================

export default function AdminLayout({
  currentPath = '/admin',
  onNavigate,
  title = 'Operations Dashboard',
  children,
}) {
  const { adminUser, logout, hasRole } = useAdminAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      group: 'OVERVIEW',
      items: [
        {
          label: 'Dashboard',
          path: '/admin/dashboard',
          icon: LayoutDashboard,
          roles: ['SUPER_ADMIN', 'MODERATOR', 'SUPPORT', 'SALES', 'CONTENT'],
        },
      ],
    },
    {
      group: 'OPERATIONS',
      items: [
        {
          label: 'Property Moderation',
          path: '/admin/properties',
          icon: Building2,
          roles: ['SUPER_ADMIN', 'MODERATOR', 'SUPPORT', 'SALES', 'CONTENT'],
        },
        {
          label: 'User Management',
          path: '/admin/users',
          icon: Users,
          roles: ['SUPER_ADMIN', 'MODERATOR', 'SUPPORT'],
        },
        {
          label: 'Lead Pipeline',
          path: '/admin/leads',
          icon: Target,
          roles: ['SUPER_ADMIN', 'MODERATOR', 'SUPPORT', 'SALES'],
        },
        {
          label: 'Plans & Billing',
          path: '/admin/billing',
          icon: CreditCard,
          roles: ['SUPER_ADMIN', 'SALES', 'SUPPORT'],
        },
        {
          label: 'Content & Media',
          path: '/admin/content',
          icon: FolderKanban,
          roles: ['SUPER_ADMIN', 'MODERATOR', 'CONTENT'],
        },
      ],
    },
    {
      group: 'GOVERNANCE',
      items: [
        {
          label: 'System & Audit',
          path: '/admin/system',
          icon: ShieldCheck,
          roles: ['SUPER_ADMIN'],
        },
      ],
    },
  ];

  const handleNavClick = (path) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const isItemActive = (path) => {
    if (path === '/admin/dashboard' && (currentPath === '/admin' || currentPath === '/admin/dashboard')) {
      return true;
    }
    return currentPath === path || currentPath.startsWith(path + '/');
  };

  const userInitials = (adminUser?.fullName || adminUser?.username || 'AD')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="admin-shell">
      {/* Sidebar Navigation */}
      <aside className={`admin-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-logo-mark">H</div>
          <div>
            <div className="admin-logo-text">HexaHome</div>
            <span className="admin-logo-badge">Operations</span>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          {navItems.map((grp) => {
            const visibleItems = grp.items.filter(
              (item) => !item.roles || item.roles.some((r) => hasRole(r))
            );

            if (visibleItems.length === 0) return null;

            return (
              <div key={grp.group} style={{ marginBottom: '1rem' }}>
                <div className="admin-nav-group-label">{grp.group}</div>
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const active = isItemActive(item.path);
                  return (
                    <button
                      key={item.path}
                      type="button"
                      className={`admin-nav-item ${active ? 'active' : ''}`}
                      onClick={() => handleNavClick(item.path)}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-avatar">{userInitials}</div>
            <div className="admin-user-meta">
              <div className="admin-user-name">
                {adminUser?.fullName || adminUser?.username || 'Admin Staff'}
              </div>
              <div className="admin-user-role">{adminUser?.role || 'STAFF'}</div>
            </div>
          </div>
          <button
            type="button"
            className="admin-btn admin-btn-secondary admin-btn-sm"
            onClick={logout}
            title="Sign out of Admin Console"
            style={{ padding: '6px', borderRadius: '50%' }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Body */}
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              type="button"
              className="admin-btn admin-btn-secondary admin-btn-sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ display: 'none' }} /* Visible on mobile via CSS */
              id="admin-mobile-toggle"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <h1 className="admin-page-title">{title}</h1>
          </div>

          <div className="admin-topbar-right">
            {adminUser && <AdminStatusBadge status={adminUser.role} showDot={false} />}

            <button
              type="button"
              className="admin-btn admin-btn-secondary admin-btn-sm"
              onClick={() => handleNavClick('/')}
              title="Switch to public HexaHome website"
            >
              <ExternalLink size={14} />
              <span>Public Portal</span>
            </button>
          </div>
        </header>

        <main className="admin-content-area">{children}</main>
      </div>
    </div>
  );
}
