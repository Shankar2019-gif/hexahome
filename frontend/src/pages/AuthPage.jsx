import React, { useState, useRef, useEffect } from 'react';
import LoginForm from '../components/auth/LoginForm';
import SignUpForm from '../components/auth/SignUpForm';
import { authApi, mediaApi } from '../services/api';
import { ArrowRight } from 'lucide-react';

const SIDEBAR_BENEFITS = [
  'List unlimited properties for free every day.',
  'Set up personalized property alerts.',
  'Connect with buyers across the nation.',
  'Showcase your property for Rent, PG, or Sale.',
  'Receive quick inquiries via phone, email, and SMS.',
  'Track search performance and monitor responses and views online.',
  'Add extensive property details and multiple photos per listing.',
];

export default function AuthPage({ currentPath, onNavigate, onLoginSuccess }) {
  const getRedirectUrl = () => {
    try {
      const search = window.location.search || (window.location.href.includes("?") ? "?" + window.location.href.split("?")[1] : "");
      return new URLSearchParams(search).get("redirect") || "/";
    } catch {
      return "/";
    }
  };
  const [authMode, setAuthMode] = useState(() => {
    try {
      const search = window.location.search || (window.location.href.includes('?') ? '?' + window.location.href.split('?')[1] : '');
      return new URLSearchParams(search).get('mode') === 'signup' ? 'signup' : 'login';
    } catch {
      return 'login';
    }
  });

  const [profilePic, setProfilePic] = useState(null);
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    try {
      const search = window.location.search || (currentPath?.includes('?') ? '?' + currentPath.split('?')[1] : '');
      const mode = new URLSearchParams(search).get('mode');
      if (mode === 'signup' || mode === 'login') {
        setAuthMode(mode);
      }
    } catch {
      // ignore
    }
  }, [currentPath]);

  const switchMode = (mode) => {
    setAuthMode(mode);
    setErrorMsg('');
    setSuccessMsg('');
    if (window.history.pushState) {
      window.history.pushState({}, '', `/auth?mode=${mode}`);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPG, PNG, WEBP)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('Photo size should be under 10MB');
      return;
    }

    setErrorMsg('');
    try {
      const res = await mediaApi.uploadImage(file, 'avatars');
      if (res?.url) {
        setProfilePic(res.url);
      } else {
        const reader = new FileReader();
        reader.onload = () => setProfilePic(reader.result);
        reader.readAsDataURL(file);
      }
    } catch {
      const reader = new FileReader();
      reader.onload = () => setProfilePic(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleLogin = async ({ identifier, password }) => {
    if (!identifier) {
      setErrorMsg('Please enter your username, email, or mobile number');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await authApi.login({ username: identifier, password });
      const user = res.user;
      setSuccessMsg(`Welcome back, ${user.name || user.firstName || 'User'}! Logging you in...`);
      if (onLoginSuccess) onLoginSuccess(user);
      setTimeout(() => {
        const dest = getRedirectUrl();
        if (onNavigate) onNavigate(dest);
      }, 700);
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please verify your credentials or create an account.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (formData) => {
    const cleanPhone = formData.phone.replace(/\D/g, '').slice(-10);
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setErrorMsg('First and last name are required');
      return;
    }
    if (!cleanPhone || cleanPhone.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!formData.password || formData.password.length < 4) {
      setErrorMsg('Password must be at least 4 characters');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
    const payload = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      name: fullName,
      email: formData.email.trim(),
      phone: cleanPhone,
      role: formData.role,
      password: formData.password,
      profilePicUrl: profilePic || null,
    };

    try {
      const res = await authApi.register(payload);
      setSuccessMsg(`Welcome to HexaHome, ${fullName}! Your account has been created.`);
      if (onLoginSuccess) onLoginSuccess(res.user);
      setTimeout(() => {
        const dest = getRedirectUrl();
        if (onNavigate) onNavigate(dest);
      }, 800);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to complete registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      {/* Mobile Top App Bar */}
      <div className="overflow-hidden bg-[#e0effe] text-[#1e293b] flex justify-between py-3 items-center px-4 sm:hidden border-b border-[#cbd5e1]">
        <div className="flex gap-2 items-center">
          <img
            src="https://img.hexahome.in/media/static/hexahome/favicon.ico?&rs=fill:32:32"
            alt="HexaHome Icon"
            height="28"
            width="28"
            className="rounded"
          />
          <div>
            <h3 className="font-semibold text-xs text-[#033487] m-0">HexaHome Property Portal</h3>
            <div className="flex items-center text-[#eab308] text-xs">
              ★★★★★ <span className="text-[#334155] font-semibold text-[10px] ml-1">(5.0) Zero Brokerage</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => onNavigate && onNavigate('/')}
          className="rounded-[10px] py-1.5 px-3 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-semibold whitespace-nowrap cursor-pointer border-none"
        >
          Explore Site
        </button>
      </div>

      <div className="auth-split-main">
        {/* Desktop Sidebar Hero matching Screenshot 1 & 2 */}
        <div className="auth-sidebar-hero">
          <img
            className="auth-sidebar-bg"
            src="https://assets.hexahome.in/static/login/login-hero-side-image.webp"
            alt="Login Page Hero"
          />
          <div className="auth-sidebar-overlay" />

          {/* HexaHome Logo matching Screenshot 1 & 2 */}
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('/')}
            className="auth-sidebar-logo bg-transparent border-none p-0 cursor-pointer flex items-center gap-2.5"
            title="HexaHome Home"
          >
            <svg
              viewBox="0 0 36 32"
              className="w-8 h-8 shrink-0"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M.882 12.791a6.352 6.352 0 0 0-.018 6.428l5.622 9.643A6.315 6.315 0 0 0 11.94 32h12.037a6.308 6.308 0 0 0 4.194-1.597l-3.76-3.748a12.211 12.211 0 0 1-6.56 1.91c-6.78 0-12.265-5.466-12.265-12.223 0-6.758 5.484-12.223 12.264-12.223 6.78 0 12.264 5.465 12.264 12.223 0 2.789-.952 5.336-2.525 7.392l3.07 3.051 4.459-7.55a6.352 6.352 0 0 0-.005-6.467L29.386 3.1A6.315 6.315 0 0 0 23.953 0H12.038a6.315 6.315 0 0 0-5.436 3.107l-5.72 9.684ZM17.85 6.995c5.194 0 9.378 4.17 9.378 9.347 0 5.176-4.184 9.347-9.378 9.347-5.193 0-9.378-4.171-9.378-9.347 0-5.176 4.185-9.347 9.378-9.347Zm5.524 9.919c.396 0 .74-.26.88-.664.14-.403.037-.846-.249-1.117l-4.929-5.068a1.477 1.477 0 0 0-2.152 0l-4.917 5.056c-.298.283-.4.726-.261 1.13.139.403.484.663.88.663h.322v5.029c0 .252.188.457.42.457h2.527v-3.2c0-1.26.944-2.286 2.105-2.286 2.105 1.025 2.105 2.286v3.2h2.526c.233 0 .421-.205.421-.457v-5.029h.322Z"
                fill="#ffffff"
              />
            </svg>
            <span className="text-2xl font-extrabold text-white tracking-tight">HexaHome</span>
          </button>

          {/* Features list matching Screenshot 1 & 2 */}
          <div className="auth-sidebar-content">
            <h2 className="auth-sidebar-title">Features of a HexaHome Account</h2>
            <ul className="auth-sidebar-list">
              {SIDEBAR_BENEFITS.map((benefit, i) => (
                <li key={i} className="auth-sidebar-item">
                  <span className="auth-sidebar-item-dot">•</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Content Column matching Screenshot 1 & 2 */}
        <div className="auth-content-column">
          {/* Top-right "Continue as guest ->" matching Screenshot 1 & 2 */}
          <div className="auth-top-bar">
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('/')}
              className="auth-guest-link"
            >
              <span>Continue as guest</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Feedback messages */}
          {errorMsg && (
            <div className="max-w-[540px] mx-auto w-full my-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-fade-in shadow-2xs">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="max-w-[540px] mx-auto w-full my-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2 animate-fade-in shadow-2xs">
              <span>✓</span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Centered Card */}
          <div className="auth-center-area">
            {authMode === 'login' ? (
              <LoginForm
                key="login"
                onSubmit={handleLogin}
                loading={loading}
                onSwitchMode={() => switchMode('signup')}
              />
            ) : (
              <SignUpForm
                key="signup"
                onSubmit={handleSignUp}
                loading={loading}
                profilePic={profilePic}
                onPhotoUpload={handlePhotoUpload}
                fileInputRef={fileInputRef}
                onSwitchMode={() => switchMode('login')}
              />
            )}
          </div>

          {/* Bottom subtle copyright */}
          <div className="text-center text-xs text-gray-400 py-2">
            &copy; 2026 HexaHome Technologies. Zero Brokerage Property Network.
          </div>
        </div>
      </div>
    </div>
  );
}
