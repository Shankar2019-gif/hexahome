import React, { useState } from 'react';
import {
  X,
  Phone,
  Mail,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
  MessageCircle,
  Sparkles,
  Lock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { propertyService } from '../../services/propertyService';

export default function ContactOwnerModal({
  isOpen,
  property,
  currentUser,
  onClose,
  onNavigate,
  onOpenPricing,
}) {
  const [revealedData, setRevealedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isQuotaExhausted, setIsQuotaExhausted] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!isOpen || !property) return null;

  const handleRevealContact = async () => {
    // Check if user is logged in
    const token = localStorage.getItem('hexahome_token');
    if (!token && !currentUser) {
      if (onNavigate) {
        onNavigate('/auth?mode=login&redirect=' + encodeURIComponent(window.location.pathname));
      }
      return;
    }

    setLoading(true);
    setError('');
    setIsQuotaExhausted(false);

    try {
      const propertyId = property.id || property.uuid;
      const res = await propertyService.revealContact(propertyId);
      // res is ApiResponse.data -> ContactRevealResponseDto
      setRevealedData(res?.data || res);
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message || err.message || '';
      
      if (status === 402 || status === 403 || msg.toLowerCase().includes('exhausted') || msg.toLowerCase().includes('quota')) {
        setIsQuotaExhausted(true);
        setError('You have used all your free contact reveal credits. Please upgrade your plan to unlock direct owner numbers.');
      } else {
        setError(msg || 'Failed to reveal contact details. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, type) => {
    navigator.clipboard?.writeText(text);
    if (type === 'phone') {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } else {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleClose = () => {
    setRevealedData(null);
    setError('');
    setIsQuotaExhausted(false);
    onClose?.();
  };

  const formattedPrice = typeof property.price === 'number'
    ? `₹${property.price.toLocaleString('en-IN')}`
    : (property.price || 'Price on request');

  const unmaskedPhone = revealedData?.ownerPhone || property.phone;
  const unmaskedEmail = revealedData?.ownerEmail || property.email;
  const ownerName = revealedData?.ownerName || property.ownerName || 'Property Owner';

  return (
    <div className="modal-backdrop animate-fade-in" onClick={handleClose} style={{ zIndex: 9999 }}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        <button
          type="button"
          className="modal-close-btn"
          onClick={handleClose}
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="modal-header" style={{ paddingBottom: '12px' }}>
          <div className="badge-verified" style={{ marginBottom: '6px' }}>
            <ShieldCheck size={14} />
            <span>Verified Property Listing</span>
          </div>
          <h2 className="modal-title" style={{ fontSize: '20px' }}>Contact Property Owner</h2>
          <p className="modal-subtitle" style={{ fontSize: '14px', marginTop: '2px' }}>
            {property.title}
          </p>
        </div>

        {/* Quick Property Summary Pill */}
        <div className="contact-prop-summary" style={{ marginBottom: '16px' }}>
          <div className="summary-price-stack">
            <span className="summary-price">{formattedPrice}{property.adType !== 'BUY' ? '/mo' : ''}</span>
            {property.deposit && <span className="summary-dep">Deposit: ₹{Number(property.deposit).toLocaleString('en-IN')}</span>}
          </div>
          <div className="summary-meta">
            <span>{property.bhk || property.type || '2 BHK'}</span> •{' '}
            <span>{property.builtUpArea || property.carpetArea || property.sqft || 1200} sq.ft</span> •{' '}
            <span>{property.localityName || property.location || 'Coimbatore'}</span>
          </div>
        </div>

        {/* Error / Quota Exhausted Banner */}
        {error && (
          <div
            className="auth-error-banner"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              color: isQuotaExhausted ? '#9a3412' : '#dc2626',
              background: isQuotaExhausted ? '#fff7ed' : '#fef2f2',
              border: `1px solid ${isQuotaExhausted ? '#ffedd5' : '#fecaca'}`,
              padding: '12px 14px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '13.5px',
              lineHeight: 1.4,
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>{isQuotaExhausted ? 'Quota Limit Reached' : 'Error'}</strong>
              <p style={{ margin: '4px 0 0 0' }}>{error}</p>
            </div>
          </div>
        )}

        {/* Quota Exhausted Pricing Prompt */}
        {isQuotaExhausted ? (
          <div className="quota-upgrade-view animate-fade-in" style={{ textAlign: 'center', padding: '8px 0' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#eff6ff',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px auto',
              }}
            >
              <Sparkles size={28} />
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
              Upgrade to Tenant Pro
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px', lineHeight: 1.5 }}>
              Unlock direct verified owner phone numbers with zero brokerage and instant WhatsApp connectivity.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '20px',
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  border: '2px solid #0284c7',
                  borderRadius: '10px',
                  padding: '14px',
                  background: '#f8fafc',
                  position: 'relative',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '12px',
                    background: '#0284c7',
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    textTransform: 'uppercase',
                  }}
                >
                  Most Popular
                </span>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '15px' }}>Tenant Pro</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#033487', margin: '4px 0' }}>
                  ₹499 <span style={{ fontSize: '12px', fontWeight: 500, color: '#64748b' }}>/ 30 days</span>
                </div>
                <ul style={{ paddingLeft: '16px', margin: '8px 0 0 0', fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>
                  <li>25 Verified Owner Contacts</li>
                  <li>Instant WhatsApp Connect</li>
                  <li>Zero Brokerage Guaranteed</li>
                </ul>
              </div>

              <div
                style={{
                  border: '1px solid #e2e8f8',
                  borderRadius: '10px',
                  padding: '14px',
                  background: '#fff',
                }}
              >
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '15px' }}>Tenant Premium</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#033487', margin: '4px 0' }}>
                  ₹999 <span style={{ fontSize: '12px', fontWeight: 500, color: '#64748b' }}>/ 90 days</span>
                </div>
                <ul style={{ paddingLeft: '16px', margin: '8px 0 0 0', fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>
                  <li>Unlimited Owner Contacts</li>
                  <li>Dedicated Manager Support</li>
                  <li>Free Rental Agreement</li>
                </ul>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="modal-submit-btn"
                onClick={() => {
                  handleClose();
                  if (onOpenPricing) {
                    onOpenPricing();
                  } else if (onNavigate) {
                    onNavigate('/pricing');
                  }
                }}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Sparkles size={16} />
                <span>View Plans & Upgrade</span>
              </button>
              <button
                type="button"
                onClick={handleClose}
                style={{
                  padding: '10px 18px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#fff',
                  color: '#475569',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : !revealedData ? (
          /* Initial Reveal Trigger View */
          <div className="reveal-prompt-view" style={{ padding: '8px 0' }}>
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '16px',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <Lock size={18} style={{ color: '#0284c7' }} />
                <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '14.5px' }}>
                  Direct Owner Contact Protection
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>
                HexaHome protects owners from broker spam. Revealing this contact will use{' '}
                <strong style={{ color: '#0f172a' }}>1 contact credit</strong> from your subscription quota.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                className="modal-submit-btn"
                disabled={loading}
                onClick={handleRevealContact}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  height: '46px',
                  fontSize: '15px',
                }}
              >
                <Phone size={18} />
                <span>{loading ? 'Unlocking Contact...' : 'Get Owner Phone Number (1 Credit)'}</span>
              </button>

              <p style={{ margin: 0, fontSize: '12px', textAlign: 'center', color: '#94a3b8' }}>
                Zero Brokerage Guaranteed • Directly Connect with Landlord
              </p>
            </div>
          </div>
        ) : (
          /* Revealed Unmasked Contact Information View */
          <div className="revealed-contact-box animate-fade-in" style={{ padding: '4px 0' }}>
            <div className="owner-phone-card" style={{ padding: '16px' }}>
              <span className="owner-lbl" style={{ fontSize: '13px', color: '#64748b' }}>
                Property Owner Contact:
              </span>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '8px 0 12px 0' }}>
                <span style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>
                  {ownerName}
                </span>
                <span className="badge-verified">Verified Landlord</span>
              </div>

              {/* Phone Row */}
              {unmaskedPhone && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#f1f5f9',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    marginBottom: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={16} style={{ color: '#0284c7' }} />
                    <span style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', letterSpacing: '0.5px' }}>
                      {unmaskedPhone}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(unmaskedPhone, 'phone')}
                    title="Copy phone number"
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: copiedPhone ? '#16a34a' : '#64748b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  >
                    {copiedPhone ? <Check size={16} /> : <Copy size={16} />}
                    <span>{copiedPhone ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              )}

              {/* Email Row (if available) */}
              {unmaskedEmail && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#f1f5f9',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    marginBottom: '10px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={16} style={{ color: '#0284c7' }} />
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>
                      {unmaskedEmail}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(unmaskedEmail, 'email')}
                    title="Copy email"
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: copiedEmail ? '#16a34a' : '#64748b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  >
                    {copiedEmail ? <Check size={16} /> : <Copy size={16} />}
                    <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              )}

              {revealedData?.remainingCredits !== undefined && (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12.5px',
                    color: '#15803d',
                    fontWeight: 600,
                    background: '#f0fdf4',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    marginTop: '4px',
                  }}
                >
                  <Check size={14} />
                  <span>{revealedData.remainingCredits} contact reveal credits remaining in your plan</span>
                </div>
              )}
            </div>

            {/* Quick Connect Action Buttons */}
            <div className="contact-actions-row" style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {unmaskedPhone && (
                <>
                  <a
                    href={`tel:${unmaskedPhone.replace(/\s+/g, '')}`}
                    className="call-now-btn"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      height: '44px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                    }}
                  >
                    <Phone size={16} />
                    <span>Call Owner</span>
                  </a>

                  <a
                    href={`https://wa.me/${unmaskedPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Hi ${ownerName}, I found your property listing on HexaHome: "${property.title}". Is it still available for visit?`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="whatsapp-btn"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      height: '44px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                    }}
                  >
                    <MessageCircle size={16} />
                    <span>WhatsApp</span>
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
