import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Phone, 
  User, 
  MapPin, 
  Home, 
  QrCode, 
  Download, 
  Send,
  Building,
  ShieldCheck,
  Check
} from 'lucide-react';

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
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');

  if (!isOpen || !property) return null;

  const handleReveal = (e) => {
    e.preventDefault();
    if (userPhone.length >= 10) {
      setRevealed(true);
    }
  };

  const handleClose = () => {
    setRevealed(false);
    onClose();
  };

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
            <span className="summary-price">₹{property.price.toLocaleString('en-IN')}/mo</span>
            <span className="summary-dep">Deposit: {property.deposit}</span>
          </div>
          <div className="summary-meta">
            <span>{property.type}</span> • <span>{property.sqft} sqft</span> • <span>{property.location}</span>
          </div>
        </div>

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

            <button type="submit" className="modal-submit-btn">
              <Phone size={16} />
              <span>Get Contact Number</span>
            </button>
          </form>
        ) : (
          <div className="revealed-contact-box animate-fade-in">
            <div className="owner-phone-card">
              <span className="owner-lbl">Property Owner Direct Line:</span>
              <div className="owner-num-row">
                <span className="owner-number">+91 93112 14726</span>
                <span className="badge-verified">Verified</span>
              </div>
              <p className="owner-note">Mention that you saw this listing on HexaHome for instant response.</p>
            </div>

            <div className="contact-actions-row">
              <a href="tel:+919311214726" className="call-now-btn">
                <Phone size={16} />
                <span>Call Owner Now</span>
              </a>
              <a 
                href={`https://wa.me/919311214726?text=Hi, I am interested in your property on HexaHome: ${property.title}`} 
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
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phone.length >= 10) {
      setOtpSent(true);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setLoggedIn(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div className="modal-card auth-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="modal-header">
          <div className="auth-brand-logo">HEXAHOME</div>
          <h2 className="modal-title">Login or Create Account</h2>
          <p className="modal-subtitle">Access your saved homes, inquiries & direct owner chats.</p>
        </div>

        {!loggedIn ? (
          !otpSent ? (
            <form onSubmit={handleSendOtp} className="modal-form">
              <div className="form-group">
                <label className="form-label">Enter Mobile Number</label>
                <div className="phone-input-wrap">
                  <span className="country-prefix">+91</span>
                  <input
                    type="tel"
                    placeholder="Enter 10 digit number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-input phone-no"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="modal-submit-btn">
                <span>Continue with OTP</span>
              </button>

              <div className="auth-divider">
                <span>OR</span>
              </div>

              <button 
                type="button" 
                className="social-auth-btn"
                onClick={() => {
                  setLoggedIn(true);
                  setTimeout(onClose, 800);
                }}
              >
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="modal-form">
              <div className="form-group">
                <label className="form-label">Enter 4-digit OTP sent to +91 {phone}</label>
                <input
                  type="text"
                  maxLength={4}
                  placeholder="1 2 3 4"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="form-input otp-input"
                  required
                />
              </div>

              <button type="submit" className="modal-submit-btn">
                <span>Verify & Login</span>
              </button>
            </form>
          )
        ) : (
          <div className="modal-success-pane animate-fade-in">
            <CheckCircle2 size={48} color="#15770b" />
            <h3 className="success-title">Welcome to HexaHome!</h3>
            <p className="success-desc">You are now logged in successfully.</p>
          </div>
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
