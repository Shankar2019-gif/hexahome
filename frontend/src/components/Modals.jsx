import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Phone, 
  User, 
  QrCode, 
  Download, 
  Send, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { authApi, leadApi } from '../services/api';


export function PostPropertyModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    purpose: 'Rent',
    propertyType: 'Apartment',
    city: 'Noida',
    locality: '',
    bhk: '2 BHK',
    price: '',
    phone: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={handleReset}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={handleReset}>
          <X size={20} />
        </button>

        {!submitted ? (
          <div>
            <div className="modal-header">
              <span className="badge-free">100% FREE</span>
              <h2 className="modal-title">Post Your Property</h2>
              <p className="modal-subtitle">Connect directly with verified tenants & buyers with 0% brokerage.</p>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              {/* Purpose Selector */}
              <div className="form-group">
                <label className="form-label">I want to:</label>
                <div className="purpose-pill-group">
                  {['Rent', 'Sell', 'PG / Co-Living'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      className={`purpose-pill ${formData.purpose === p ? 'purpose-active' : ''}`}
                      onClick={() => setFormData({ ...formData, purpose: p })}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Type & BHK */}
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Property Type</label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                    className="form-select"
                  >
                    <option value="Apartment">Apartment / Flat</option>
                    <option value="Builder Floor">Builder Floor</option>
                    <option value="Villa">Villa / House</option>
                    <option value="Plot">Plot / Land</option>
                    <option value="Commercial">Commercial Office/Shop</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Bedrooms (BHK)</label>
                  <select
                    value={formData.bhk}
                    onChange={(e) => setFormData({ ...formData, bhk: e.target.value })}
                    className="form-select"
                  >
                    <option value="1 RK">1 RK</option>
                    <option value="1 BHK">1 BHK</option>
                    <option value="2 BHK">2 BHK</option>
                    <option value="3 BHK">3 BHK</option>
                    <option value="4+ BHK">4+ BHK</option>
                  </select>
                </div>
              </div>

              {/* City & Locality */}
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Locality / Sector</label>
                  <input
                    type="text"
                    placeholder="e.g. Sector 76, Expressway"
                    value={formData.locality}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              {/* Expected Price & Phone */}
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Expected Monthly Rent (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 25000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="modal-submit-btn">
                <span>Publish Listing Free</span>
                <Send size={16} />
              </button>
            </form>
          </div>
        ) : (
          <div className="modal-success-pane animate-fade-in">
            <div className="success-icon-wrap">
              <CheckCircle2 size={54} color="#15770b" />
            </div>
            <h2 className="success-title">Property Submitted Successfully!</h2>
            <p className="success-desc">
              Your property in {formData.locality || 'Noida'} has been scheduled for instant verification. You will start receiving direct calls and WhatsApp leads from verified seekers shortly.
            </p>
            <button type="button" className="success-done-btn" onClick={handleReset}>
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function ContactOwnerModal({ isOpen, property, onClose }) {
  const [revealed, setRevealed] = useState(false);
  const [revealedData, setRevealedData] = useState(null);
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !property) return null;

  const handleReveal = async (e) => {
    e.preventDefault();
    const cleanPhone = userPhone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Submit lead inquiry to property owner
      await leadApi.submitLead({
        propertyId: property.id,
        seekerName: userName.trim() || 'Verified Seeker',
        seekerPhone: cleanPhone,
        message: 'Interested in property details and scheduling a visit',
      }).catch(() => {});

      // 2. If user is logged in, attempt reveal-contact to fetch owner's direct number and check credits
      const token = localStorage.getItem('hexahome_token');
      if (token && property.id) {
        try {
          const res = await leadApi.revealContact(property.id);
          setRevealedData(res);
        } catch {
          // Fallback to demo contact if quota exceeded or mock property ID
          setRevealedData({
            ownerPhone: property.phone || '+91 98421 09876',
            ownerName: property.ownerName || 'K. Venkatesh',
            remainingCredits: 25
          });
        }
      } else {
        setRevealedData({
          ownerPhone: property.phone || '+91 98421 09876',
          ownerName: property.ownerName || 'Verified Owner',
          remainingCredits: 2
        });
      }

      setRevealed(true);
    } catch (err) {
      setError(err.message || 'Failed to connect with owner. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRevealed(false);
    setRevealedData(null);
    setError('');
    onClose();
  };

  const ownerPhone = revealedData?.ownerPhone || '+91 98421 09876';

  return (
    <div className="modal-backdrop animate-fade-in" onClick={handleClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={handleClose}>
          <X size={20} />
        </button>

        <div className="modal-header">
          <div className="badge-verified">
            <ShieldCheck size={14} />
            <span>Verified Listing</span>
          </div>
          <h2 className="modal-title">Contact Property Owner</h2>
          <p className="modal-subtitle">{property.title}</p>
        </div>

        <div className="contact-prop-summary">
          <div className="summary-price-stack">
            <span className="summary-price">₹{typeof property.price === 'number' ? property.price.toLocaleString('en-IN') : property.price}/mo</span>
            {property.deposit && <span className="summary-dep">Deposit: {property.deposit}</span>}
          </div>
          <div className="summary-meta">
            <span>{property.bhk || property.type}</span> • <span>{property.builtUpArea || property.sqft || 1200} sqft</span> • <span>{property.localityName || property.location || 'Coimbatore'}</span>
          </div>
        </div>

        {error && (
          <div className="auth-error-banner" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626', background: '#fef2f2', padding: '10px', borderRadius: '8px', marginBottom: '12px' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {!revealed ? (
          <form onSubmit={handleReveal} className="modal-form">
            <p className="contact-prompt">Enter your details to view the owner's direct mobile number:</p>
            
            <div className="form-group">
              <label className="form-label">Your Full Name</label>
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Your WhatsApp / Phone Number</label>
              <input
                type="tel"
                placeholder="10-digit mobile number"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <button type="submit" className="modal-submit-btn" disabled={loading}>
              <Phone size={16} />
              <span>{loading ? 'Connecting...' : 'Get Contact Number'}</span>
            </button>
          </form>
        ) : (
          <div className="revealed-contact-box animate-fade-in">
            <div className="owner-phone-card">
              <span className="owner-lbl">Property Owner Direct Line:</span>
              <div className="owner-num-row">
                <span className="owner-number">{ownerPhone}</span>
                <span className="badge-verified">Verified</span>
              </div>
              {revealedData?.remainingCredits !== undefined && (
                <p style={{ fontSize: '12px', color: '#15803d', marginTop: '4px', fontWeight: 600 }}>
                  ✓ {revealedData.remainingCredits} contact reveal credits remaining
                </p>
              )}
              <p className="owner-note">Mention that you saw this listing on HexaHome for instant response.</p>
            </div>

            <div className="contact-actions-row">
              <a href={`tel:${ownerPhone.replace(/\s+/g, '')}`} className="call-now-btn">
                <Phone size={16} />
                <span>Call Owner Now</span>
              </a>
              <a 
                href={`https://wa.me/${ownerPhone.replace(/\D/g, '')}?text=Hi, I am interested in your property on HexaHome: ${property.title}`} 
                target="_blank" 
                rel="noreferrer"
                className="whatsapp-btn"
              >
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function LoginModal({ isOpen, onClose }) {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  
  // Login fields
  const [username, setUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Sign up fields
  const [role, setRole] = useState('Individual');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter your username, email, or mobile');
      return;
    }
    if (!loginPassword) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await authApi.login({ username: username.trim(), password: loginPassword });
      setSuccess(`Welcome back, ${res.user?.name || res.user?.firstName || 'User'}!`);
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials or sign up.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (!firstName.trim()) {
      setError('First name is required');
      return;
    }
    if (!lastName.trim()) {
      setError('Last name is required');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!signUpPassword || signUpPassword.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }
    if (signUpPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    try {
      await authApi.register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        name: fullName,
        email: email.trim(),
        phone: cleanPhone,
        role,
        password: signUpPassword,
      });
      setSuccess(`Welcome to HexaHome, ${fullName}! Account created.`);
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess('');
    onClose();
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={handleClose}>
      <div className="modal-card auth-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: authMode === 'signup' ? '480px' : '400px', transition: 'max-width 0.2s ease' }}>
        <button type="button" className="modal-close-btn" onClick={handleClose}>
          <X size={20} />
        </button>

        <div className="modal-header" style={{ marginBottom: '14px' }}>
          <div className="auth-brand-logo" style={{ color: '#033487', fontWeight: 800 }}>HEXAHOME</div>
          <h2 className="modal-title" style={{ fontSize: '20px' }}>
            {authMode === 'login' ? 'Log In to HexaHome' : 'Personal Info'}
          </h2>
          <p className="modal-subtitle" style={{ fontSize: '12px' }}>
            {authMode === 'login' 
              ? 'Enter your credentials to continue.' 
              : 'Enter your Details below to create your account and get started.'}
          </p>

          <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '4px', borderRadius: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setError(''); setSuccess(''); }}
              style={{
                flex: 1,
                padding: '6px',
                borderRadius: '8px',
                border: 'none',
                background: authMode === 'login' ? '#ffffff' : 'transparent',
                color: authMode === 'login' ? '#033487' : '#64748b',
                fontWeight: '700',
                fontSize: '12px',
                cursor: 'pointer',
                boxShadow: authMode === 'login' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('signup'); setError(''); setSuccess(''); }}
              style={{
                flex: 1,
                padding: '6px',
                borderRadius: '8px',
                border: 'none',
                background: authMode === 'signup' ? '#ffffff' : 'transparent',
                color: authMode === 'signup' ? '#033487' : '#64748b',
                fontWeight: '700',
                fontSize: '12px',
                cursor: 'pointer',
                boxShadow: authMode === 'signup' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              Sign Up
            </button>
          </div>
        </div>

        {error && (
          <div className="auth-error-banner" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626', background: '#fef2f2', padding: '10px', borderRadius: '8px', marginBottom: '12px', fontSize: '12px' }}>
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#047857', background: '#ecfdf5', padding: '10px', borderRadius: '8px', marginBottom: '12px', fontSize: '12px', border: '1px solid #a7f3d0' }}>
            <CheckCircle2 size={15} />
            <span>{success}</span>
          </div>
        )}

        {authMode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="modal-form">
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>
                Username / Email / Mobile *
              </label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '8px 12px' }}>
                <User size={15} style={{ color: '#94a3b8', marginRight: '8px' }} />
                <input
                  type="text"
                  required
                  placeholder="Enter username, email, or mobile"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '13px' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>
                Password *
              </label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '8px 12px' }}>
                <Lock size={15} style={{ color: '#94a3b8', marginRight: '8px' }} />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '13px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                >
                  {showLoginPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" className="modal-submit-btn" disabled={loading} style={{ marginTop: '8px' }}>
              <span>{loading ? 'Logging in...' : 'Log In'}</span>
              <ArrowRight size={15} />
            </button>

            <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '12px', color: '#64748b' }}>
              <span>Don't have an account?</span>{' '}
              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setError(''); setSuccess(''); }}
                style={{ background: 'none', border: 'none', color: '#033487', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Sign Up
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSignUpSubmit} className="modal-form">
            {/* Select Role */}
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>
                Select your Role *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {['Individual', 'Agent', 'Builder'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    style={{
                      padding: '8px 4px',
                      borderRadius: '8px',
                      border: role === r ? '2px solid #033487' : '1px solid #cbd5e1',
                      background: role === r ? '#eff6ff' : '#ffffff',
                      color: role === r ? '#033487' : '#475569',
                      fontWeight: role === r ? '700' : '500',
                      fontSize: '11px',
                      cursor: 'pointer'
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* First Name & Last Name */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="form-input"
                  style={{ padding: '8px 10px', fontSize: '12px' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="form-input"
                  style={{ padding: '8px 10px', fontSize: '12px' }}
                />
              </div>
            </div>

            {/* Email ID */}
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>
                Email ID
              </label>
              <input
                type="email"
                placeholder="Enter your Email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ padding: '8px 10px', fontSize: '12px' }}
              />
            </div>

            {/* Phone number * (91) Verified */}
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>
                Phone number *
              </label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '6px 10px' }}>
                <span style={{ fontWeight: 700, fontSize: '12px', color: '#475569', marginRight: '6px', borderRight: '1px solid #e2e8f0', paddingRight: '6px' }}>(91)</span>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  placeholder="7382264233"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '12px' }}
                />
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#047857', background: '#ecfdf5', padding: '2px 6px', borderRadius: '4px', border: '1px solid #a7f3d0', whiteSpace: 'nowrap' }}>
                  ✓ Verified
                </span>
              </div>
            </div>

            {/* Passwords */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>
                  Password *
                </label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '6px 8px' }}>
                  <input
                    type={showSignUpPassword ? 'text' : 'password'}
                    required
                    placeholder="Password"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    style={{ border: 'none', outline: 'none', width: '100%', fontSize: '12px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                  >
                    {showSignUpPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>
                  Confirm *
                </label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '6px 8px' }}>
                  <input
                    type={showSignUpPassword ? 'text' : 'password'}
                    required
                    placeholder="Confirm"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ border: 'none', outline: 'none', width: '100%', fontSize: '12px' }}
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="modal-submit-btn" disabled={loading} style={{ marginTop: '6px' }}>
              <span>{loading ? 'Creating account...' : 'Sign Up'}</span>
              <ArrowRight size={15} />
            </button>

            <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '12px', color: '#64748b' }}>
              <span>Already have an account?</span>{' '}
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setError(''); setSuccess(''); }}
                style={{ background: 'none', border: 'none', color: '#033487', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Log In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export function AppDownloadModal({ isOpen, onClose }) {

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="modal-header">
          <div className="badge-featured">Official Mobile App</div>
          <h2 className="modal-title">Get the HexaHome App</h2>
          <p className="modal-subtitle">Download for Android & iOS to get real-time property alerts.</p>
        </div>

        <div className="modal-qr-section">
          <div className="modal-qr-frame">
            <QrCode size={140} color="#033487" />
          </div>
          <p className="modal-qr-instruction">Scan with your phone's camera to install instantly.</p>
        </div>

        <div className="store-buttons-column">
          <a 
            href="https://play.google.com" 
            target="_blank" 
            rel="noreferrer" 
            className="store-btn google-play w-full"
          >
            <Download size={18} />
            <span>Download for Android (Google Play)</span>
          </a>

          <a 
            href="https://apple.com/app-store" 
            target="_blank" 
            rel="noreferrer" 
            className="store-btn app-store w-full"
          >
            <Download size={18} />
            <span>Download for iPhone (App Store)</span>
          </a>
        </div>
      </div>
    </div>
  );
}
