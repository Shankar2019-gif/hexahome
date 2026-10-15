import React, { useState } from 'react';
import { ShieldCheck, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import '../../components/admin/admin.css';

// ============================================================================
// HexaHome Admin Login Page
// Isolated authentication interface for operations, moderation & system staff
// ============================================================================

export default function AdminLoginPage({ onNavigate, onLoginSuccess }) {
  const { login, isAuthenticated } = useAdminAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      if (onNavigate) {
        onNavigate('/admin/dashboard');
      } else {
        window.history.pushState({}, '', '/admin/dashboard');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    }
  }, [isAuthenticated, onNavigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const authResult = await login(username.trim(), password);
      if (onLoginSuccess) {
        onLoginSuccess(authResult);
      }
      if (onNavigate) {
        onNavigate('/admin/dashboard');
      } else {
        window.history.pushState({}, '', '/admin/dashboard');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <div className="admin-login-icon">
            <ShieldCheck size={32} />
          </div>
          <h2 className="admin-login-heading">HexaHome Console</h2>
          <p className="admin-login-subheading">
            Administrative Access & Operations Command Center
          </p>
        </div>

        {errorMessage && (
          <div className="admin-login-error">
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label className="admin-label" htmlFor="admin-username">
              Staff Username or Email
            </label>
            <input
              id="admin-username"
              type="text"
              className="admin-input"
              placeholder="e.g. admin or staff.name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              autoComplete="username"
              required
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label" htmlFor="admin-password">
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                className="admin-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8',
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="admin-login-submit"
            disabled={loading}
          >
            {loading ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <Loader2 size={18} className="animate-spin" />
                Authenticating...
              </span>
            ) : (
              'Sign In to Console'
            )}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('/')}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              fontSize: '0.85rem',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            &larr; Return to Public Portal
          </button>
        </div>
      </div>
    </div>
  );
}
