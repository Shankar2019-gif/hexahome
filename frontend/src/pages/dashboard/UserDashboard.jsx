import React, { useState, useEffect } from 'react';
import {
  Building,
  MessageSquare,
  Heart,
  CreditCard,
  User,
  Phone,
  Mail,
  ShieldCheck,
  Sparkles,
  LogOut,
  PlusCircle,
  Clock,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MyListingsTab from './MyListingsTab';
import MyInquiriesTab from './MyInquiriesTab';
import SavedPropertiesTab from './SavedPropertiesTab';
import { billingApi } from '../../services/api';
import './UserDashboard.css';

export default function UserDashboard({ onNavigate, currentUser, onLogout }) {
  // Read initial tab from URL ?tab=listings | inquiries | saved | subscription
  const getInitialTab = () => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const t = searchParams.get('tab');
      if (['listings', 'inquiries', 'saved', 'subscription'].includes(t)) {
        return t;
      }
    } catch {}
    return 'listings';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [subscription, setSubscription] = useState(null);
  const [loadingSub, setLoadingSub] = useState(true);

  // Redirect to login if unauthenticated
  useEffect(() => {
    const token = localStorage.getItem('hexahome_token');
    if (!token && !currentUser) {
      if (onNavigate) {
        onNavigate('/auth?mode=login&redirect=/dashboard');
      }
    }
  }, [currentUser, onNavigate]);

  // Fetch user active subscription
  useEffect(() => {
    async function loadSubscription() {
      try {
        setLoadingSub(true);
        const res = await billingApi.getCurrentSubscription();
        setSubscription(res?.data || res);
      } catch (err) {
        console.warn('[UserDashboard] Could not fetch subscription:', err.message);
      } finally {
        setLoadingSub(false);
      }
    }
    loadSubscription();
  }, []);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tabKey);
    window.history.replaceState({}, '', url.toString());
  };

  const userName = currentUser?.name || currentUser?.firstName
    ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.name
    : 'Valued Member';

  const userPhone = currentUser?.phone ? `+91 ${currentUser.phone}` : '+91 98765 43210';
  const userEmail = currentUser?.email || 'member@hexahome.in';
  const userRole = currentUser?.role || 'INDIVIDUAL';
  const remainingCredits = subscription?.remainingCredits ?? 25;

  return (
    <div className="dashboard-page-container">
      <Header currentUser={currentUser} onNavigate={onNavigate} onLogout={onLogout} />

      {/* Hero Profile Banner */}
      <section className="dashboard-hero-header">
        <div className="dashboard-hero-inner">
          <div className="dashboard-user-profile">
            <div className="dashboard-user-avatar">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="dashboard-user-info">
              <h1 className="dashboard-user-name">{userName}</h1>
              <div className="dashboard-user-meta">
                <span className="dashboard-role-badge">{userRole}</span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Phone size={13} /> {userPhone}
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Mail size={13} /> {userEmail}
                </span>
              </div>
            </div>
          </div>

          {/* Quota & Credits Header Widget */}
          <div className="dashboard-quota-widget">
            <div className="quota-stats-stack">
              <span className="quota-stats-lbl">Contact Credits</span>
              <span className="quota-stats-val">
                {remainingCredits} <span style={{ fontSize: '13px', fontWeight: 500 }}>Remaining</span>
              </span>
            </div>
            <button
              type="button"
              className="btn-quota-upgrade"
              onClick={() => handleTabChange('subscription')}
            >
              <Sparkles size={14} />
              <span>Manage Plan</span>
            </button>
          </div>
        </div>
      </section>

      {/* Sticky Dashboard Tab Navigation */}
      <nav className="dashboard-nav-strip" aria-label="Dashboard Navigation">
        <div className="dashboard-nav-inner">
          <button
            type="button"
            className={`dash-tab-btn ${activeTab === 'listings' ? 'active' : ''}`}
            onClick={() => handleTabChange('listings')}
          >
            <Building size={16} />
            <span>My Listings</span>
          </button>

          <button
            type="button"
            className={`dash-tab-btn ${activeTab === 'inquiries' ? 'active' : ''}`}
            onClick={() => handleTabChange('inquiries')}
          >
            <MessageSquare size={16} />
            <span>Inquiries & Leads</span>
          </button>

          <button
            type="button"
            className={`dash-tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => handleTabChange('saved')}
          >
            <Heart size={16} />
            <span>Saved Properties</span>
          </button>

          <button
            type="button"
            className={`dash-tab-btn ${activeTab === 'subscription' ? 'active' : ''}`}
            onClick={() => handleTabChange('subscription')}
          >
            <CreditCard size={16} />
            <span>My Plan & Billing</span>
          </button>
        </div>
      </nav>

      {/* Tab Panels */}
      <main className="dashboard-main-body">
        {activeTab === 'listings' && (
          <MyListingsTab onNavigate={onNavigate} />
        )}

        {activeTab === 'inquiries' && (
          <MyInquiriesTab onNavigate={onNavigate} currentUser={currentUser} />
        )}

        {activeTab === 'saved' && (
          <SavedPropertiesTab onNavigate={onNavigate} />
        )}

        {activeTab === 'subscription' && (
          /* Subscription & Quota Management Tab */
          <div className="dashboard-tab-panel animate-fade-in">
            <div className="tab-header-row">
              <div>
                <h2 className="tab-main-title">Subscription & Credit Balance</h2>
                <p className="tab-subtitle">
                  Manage your HexaHome membership, review contact reveal quotas, and upgrade your privileges.
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px',
                marginTop: '12px',
              }}
            >
              {/* Current Active Plan Card */}
              <div
                style={{
                  border: '2px solid #0284c7',
                  borderRadius: '14px',
                  padding: '24px',
                  background: '#f8fafc',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span
                    style={{
                      background: '#0284c7',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '12px',
                      textTransform: 'uppercase',
                    }}
                  >
                    Current Active Plan
                  </span>
                  <span style={{ fontSize: '13px', color: '#15803d', fontWeight: 700 }}>
                    ● ACTIVE
                  </span>
                </div>

                <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#033487', margin: '0 0 6px 0' }}>
                  {subscription?.plan?.name || 'Tenant Starter Plan'}
                </h3>

                <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', margin: '12px 0 16px 0' }}>
                  {remainingCredits}{' '}
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>
                    / {subscription?.totalCredits || 25} Credits Remaining
                  </span>
                </div>

                <div
                  style={{
                    height: '8px',
                    borderRadius: '4px',
                    background: '#e2e8f0',
                    overflow: 'hidden',
                    marginBottom: '16px',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.min(100, Math.max(10, ((remainingCredits) / (subscription?.totalCredits || 25)) * 100))}%`,
                      background: '#0284c7',
                      borderRadius: '4px',
                    }}
                  />
                </div>

                <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '13.5px', color: '#475569', lineHeight: 1.8 }}>
                  <li>Instant verified owner mobile number reveals</li>
                  <li>Direct Landlord WhatsApp chat access</li>
                  <li>Zero brokerage guarantee on all listings</li>
                  <li>Dedicated customer support assistance</li>
                </ul>
              </div>

              {/* Upgrade Recommendation Card */}
              <div
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '24px',
                  background: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Sparkles size={18} style={{ color: '#0284c7' }} />
                    <span style={{ fontWeight: 700, fontSize: '16px', color: '#0f172a' }}>
                      Upgrade to Tenant Premium
                    </span>
                  </div>

                  <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                    Get unlimited owner contact reveals, customized rental agreement drafting, and relationship manager support.
                  </p>

                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#033487', marginBottom: '14px' }}>
                    ₹999 <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}>/ 90 Days</span>
                  </div>

                  <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '13.5px', color: '#475569', lineHeight: 1.8 }}>
                    <li>Unlimited Verified Owner Contact Unlocks</li>
                    <li>Relationship Manager Assistance</li>
                    <li>Free Digital Rental Agreement Generator</li>
                    <li>Priority Property Alerts on WhatsApp</li>
                  </ul>
                </div>

                <button
                  type="button"
                  className="dashboard-primary-btn"
                  style={{ width: '100%', marginTop: '20px', justifyContent: 'center' }}
                  onClick={() => onNavigate?.('/pricing')}
                >
                  <Sparkles size={16} />
                  <span>Explore All Plans & Pricing</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
