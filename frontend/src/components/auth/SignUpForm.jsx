import React, { useState } from 'react';
import { CheckCircle, Edit2, Loader2, Eye, EyeOff } from 'lucide-react';

const ROLES = ['Individual', 'Agent', 'Builder'];

/**
 * SignUpForm matching Screenshot 2026-10-12 145415.png with pixel precision.
 * Dedicated CSS classes ensure 100% visual fidelity without relying on missing utility classes.
 */
export default function SignUpForm({
  onSubmit,
  loading,
  profilePic,
  onPhotoUpload,
  fileInputRef,
  onSwitchMode
}) {
  const [formData, setFormData] = useState({
    role: 'Individual',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const update = (key, val) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setErrorMsg('First and last name are required');
      return;
    }
    const cleanPhone = formData.phone.replace(/\D/g, '').slice(-10);
    if (!cleanPhone || cleanPhone.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!formData.password || formData.password.length < 4) {
      setErrorMsg('Password must be at least 4 characters');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    onSubmit({
      ...formData,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: cleanPhone,
    });
  };

  return (
    <div className="auth-card-box">
      {/* Title & Subtitle matching Screenshot 2 */}
      <h2 className="auth-card-title">Personal Info</h2>
      <p className="auth-card-subtitle">
        Enter your Details below to create your account and get started.
      </p>

      {errorMsg && (
        <div style={{
          marginBottom: '16px',
          padding: '10px 14px',
          borderRadius: '12px',
          backgroundColor: '#fff1f2',
          border: '1px solid #fecdd3',
          color: '#be123c',
          fontSize: '12.5px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Avatar Upload matching Screenshot 2 */}
        <div className="auth-avatar-section">
          <div className="auth-avatar-wrap">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="auth-avatar-circle"
              title="Upload profile photo"
            >
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="auth-avatar-img" />
              ) : (
                <svg viewBox="0 0 100 100" className="auth-avatar-svg">
                  <circle cx="50" cy="35" r="16" />
                  <path d="M 20 82 C 20 62, 34 56, 50 56 C 66 56, 80 62, 80 82 Z" />
                </svg>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="auth-avatar-badge"
              title="Edit photo"
            >
              <Edit2 size={13} strokeWidth={2.5} />
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onPhotoUpload}
            style={{ display: 'none' }}
          />
        </div>

        {/* Select your Role * matching Screenshot 2 */}
        <div className="auth-role-section">
          <label className="auth-role-label">
            Select your Role <span className="req">*</span>
          </label>
          <div className="auth-role-grid">
            {ROLES.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => update('role', role)}
                className={`auth-role-btn ${formData.role === role ? 'active' : ''}`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* First Name & Last Name (2-Column Grid) matching Screenshot 2 */}
        <div className="auth-form-row-2col">
          <div className="auth-field-col">
            <label className="auth-field-label">
              First Name <span className="req">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.firstName}
              onChange={(e) => update('firstName', e.target.value)}
              placeholder="Enter first name"
              className="auth-text-input"
            />
          </div>

          <div className="auth-field-col">
            <label className="auth-field-label">
              Last Name <span className="req">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.lastName}
              onChange={(e) => update('lastName', e.target.value)}
              placeholder="Enter last name"
              className="auth-text-input"
            />
          </div>
        </div>

        {/* Email ID & Phone number (2-Column Grid) matching Screenshot 2 */}
        <div className="auth-form-row-2col">
          <div className="auth-field-col">
            <label className="auth-field-label">Email ID</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => update('email', e.target.value)}
              placeholder="Enter your Email ID"
              className="auth-text-input"
            />
          </div>

          <div className="auth-field-col">
            <label className="auth-field-label">
              Phone number <span className="req">*</span>
            </label>
            <div className="auth-phone-capsule">
              <div className="auth-phone-left">
                <svg viewBox="0 0 24 16" className="auth-flag-icon">
                  <rect width="24" height="5.33" fill="#FF9933" />
                  <rect y="5.33" width="24" height="5.34" fill="#FFFFFF" />
                  <rect y="10.67" width="24" height="5.33" fill="#138808" />
                  <circle cx="12" cy="8" r="2.2" fill="#000080" />
                  <circle cx="12" cy="8" r="1.7" fill="#FFFFFF" />
                  <circle cx="12" cy="8" r="0.8" fill="#000080" />
                </svg>
                <span className="auth-phone-code">(91)</span>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  value={formData.phone}
                  onChange={(e) => update('phone', e.target.value.replace(/\D/g, ''))}
                  placeholder="Mobile number"
                  className="auth-phone-input"
                />
              </div>
              {formData.phone.replace(/\D/g, '').length === 10 && (
                <span className="auth-verified-badge animate-fade-in">
                  <span>Verified</span>
                  <CheckCircle size={11} />
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Passwords (2-Column Grid) for Pure Credential Auth */}
        <div className="auth-form-row-2col">
          <div className="auth-field-col">
            <label className="auth-field-label">
              Password <span className="req">*</span>
            </label>
            <div className="auth-password-capsule">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => update('password', e.target.value)}
                placeholder="Password"
                className="auth-password-input"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="auth-password-toggle"
                title={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className="auth-field-col">
            <label className="auth-field-label">
              Confirm Password <span className="req">*</span>
            </label>
            <div className="auth-password-capsule">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={formData.confirmPassword}
                onChange={(e) => update('confirmPassword', e.target.value)}
                placeholder="Confirm password"
                className="auth-password-input"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="auth-password-toggle"
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button matching Screenshot 2 */}
        <button
          type="submit"
          disabled={loading}
          className="auth-submit-btn-primary"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin text-white" />
              <span>Signing up...</span>
            </>
          ) : (
            <span>Sign up</span>
          )}
        </button>
      </form>

      {/* Switch to Log In matching Screenshot 2 */}
      <div className="auth-switch-footer">
        <span>Already have an account?</span>
        <button
          type="button"
          onClick={onSwitchMode}
          className="auth-switch-link-btn"
        >
          Log In
        </button>
      </div>
    </div>
  );
}
