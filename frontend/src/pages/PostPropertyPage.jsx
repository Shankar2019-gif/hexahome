import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PostPropertyWizard from '../components/property/PostPropertyWizard';
import { usePropertyForm } from '../hooks/usePropertyForm';
import { CITIES } from '../data/hexahomeData';
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  Mail,
} from 'lucide-react';

const LISTING_STEPS = [
  { step: 1, title: 'Download & Post Property', desc: 'Create your account with your mobile number in seconds.' },
  { step: 2, title: 'Add Property Details', desc: 'Enter locality, BHK, price, amenities & specs to attract verified buyers.' },
  { step: 3, title: 'Set Contact Preferences', desc: 'Choose to keep your phone number public or use privacy call masking.' },
  { step: 4, title: 'Upload Photos', desc: 'Add clear images of your property to increase engagement by 5x.' },
  { step: 5, title: 'Use AI for Description', desc: 'Let our AI assistant generate a catchy description automatically.' },
  { step: 6, title: 'Publish & Get Direct Leads', desc: 'Finish your listing and receive calls and messages instantly.' },
];

const PLATFORM_FEATURES = [
  { title: 'Post Property for Free', desc: 'List your flats, houses, rooms, or projects with zero upfront cost and no hidden charges.' },
  { title: 'Direct Leads & High Response', desc: 'Get genuine inquiries directly on your phone with zero intermediary interference.' },
  { title: 'Instant SMS & WhatsApp Alerts', desc: 'Get instant real-time notifications when a potential buyer views or requests your property.' },
  { title: 'Verified Genuine Buyers', desc: 'Connect with verified buyers and corporate tenants for faster, hassle-free deals.' },
  { title: 'Zero Brokerage Guarantee', desc: 'Keep 100% of your rental or sale value without paying hefty commissions to brokers.' },
  { title: '24/7 Dedicated Support', desc: 'Our real estate customer service team is ready to assist you every step of the journey.' },
];

export default function PostPropertyPage({ onNavigate, currentUser, onLogout }) {
  const {
    formData,
    errors,
    updateField,
    currentStep,
    nextStep,
    prevStep,
    isWizardOpen,
    openWizard,
    closeWizard,
    imageUrls,
    isUploading,
    uploadError,
    fileInputRef,
    uploadImages,
    removeImage,
    generateAiDescription,
    isSubmitting,
    submitError,
    submitSuccess,
    submitProperty,
    isEditMode,
  } = usePropertyForm({
    currentUser,
    onSuccess: () => onNavigate && onNavigate('/dashboard?tab=listings'),
  });

  const handleStartListing = (e) => {
    e.preventDefault();
    openWizard();
  };

  return (
    <div className="post-property-page-wrapper">
      <Header
        selectedCity={CITIES[0]}
        onSelectCity={() => {}}
        onOpenPostModal={openWizard}
        onOpenLoginModal={() => onNavigate && onNavigate('/auth')}
        onOpenAppModal={() => {}}
        onSearch={() => onNavigate && onNavigate('/')}
        onNavigate={onNavigate}
        currentUser={currentUser}
        onLogout={onLogout}
      />

      <section className="post-property-hero-section">
        <div className="post-property-container">
          <div className="post-hero-left">
            <div className="post-pill-badge">
              <Sparkles size={14} className="text-amber-400" />
              Zero Brokerage • 100% Free Listing
            </div>

            <h1 className="post-hero-heading">
              Download the <span>HexaHome</span> app to <span>Find</span> or <span>Post your ads</span> for <span>free</span>, anytime and anywhere.
            </h1>

            <ul className="post-benefits-list">
              <li className="post-benefit-row">
                <CheckCircle2 size={22} className="text-sky-400 shrink-0" />
                <span>Free Listings & Verified Buyers or Tenants</span>
              </li>
              <li className="post-benefit-row">
                <CheckCircle2 size={22} className="text-sky-400 shrink-0" />
                <span>Direct Leads & High Response Rate</span>
              </li>
              <li className="post-benefit-row">
                <CheckCircle2 size={22} className="text-sky-400 shrink-0" />
                <span>Property Promotions & Instant Alerts</span>
              </li>
              <li className="post-benefit-row">
                <CheckCircle2 size={22} className="text-sky-400 shrink-0" />
                <span>Certified Badges & 24/7 Dedicated Assistance</span>
              </li>
            </ul>

            <div className="post-qr-card">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://www.hexahome.in/"
                alt="HexaHome App QR"
                className="post-qr-img"
              />
              <div className="post-qr-text">
                <h4>Scan to Install HexaHome App</h4>
                <p>Point your phone camera to download directly on iOS & Android</p>
                <div className="post-qr-contacts">
                  <a href="tel:+919311214726">
                    <PhoneCall size={13} /> +91 93112 14726
                  </a>
                  <a href="mailto:support@hexadecimalsoftware.com">
                    <Mail size={13} /> support@hexadecimalsoftware.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="post-hero-right-card">
            <h2 className="post-card-title">Looking to Post Your Ad?</h2>
            <p className="post-card-sub">Enter your details and we’ll help you list your property</p>

            <form onSubmit={handleStartListing} noValidate>
              <div className="post-field-block">
                <label className="post-field-label">
                  Select your role <span className="text-rose-500">*</span>
                </label>
                <div className="post-role-selector">
                  {['Individual', 'Agent', 'Builder'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => updateField('role', r)}
                      className={`post-role-btn ${formData.role === r ? 'active' : ''}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="post-field-block">
                  <label className="post-field-label">First name *</label>
                  <input
                    type="text"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                    className={`post-input-box ${errors.firstName ? 'border-rose-500' : ''}`}
                  />
                  {errors.firstName && <span className="text-xs text-rose-500 font-semibold">{errors.firstName}</span>}
                </div>
                <div className="post-field-block">
                  <label className="post-field-label">Last name *</label>
                  <input
                    type="text"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    className={`post-input-box ${errors.lastName ? 'border-rose-500' : ''}`}
                  />
                  {errors.lastName && <span className="text-xs text-rose-500 font-semibold">{errors.lastName}</span>}
                </div>
              </div>

              <div className="post-field-block">
                <label className="post-field-label">Phone Number *</label>
                <div className="post-phone-box">
                  <span className="post-phone-prefix">+91</span>
                  <input
                    type="tel"
                    maxLength="10"
                    placeholder="Enter 10-digit phone number"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value.replace(/\D/g, ''))}
                    className="post-phone-input"
                  />
                </div>
                {errors.phone && <span className="text-xs text-rose-500 font-semibold mt-1 block">{errors.phone}</span>}
              </div>

              <div className="post-field-block">
                <label className="post-field-label">Email (Optional)</label>
                <input
                  type="email"
                  placeholder="Enter your email id"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="post-input-box"
                />
              </div>

              <div className="text-xs text-slate-500 text-center my-2">
                By continuing, you agree to HexaHome's Terms & Conditions and Privacy Policy
              </div>

              <button type="submit" className="post-cta-btn">
                <span>Continue to Post Property</span>
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="post-steps-section">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px auto' }}>
          <h3 style={{ fontSize: '28px', fontWeight: '900', color: '#1e293b', margin: '0 0 8px 0' }}>
            How to List Property on HexaHome in 6 Simple Steps
          </h3>
          <p style={{ fontSize: '14.5px', color: '#64748b', margin: 0 }}>
            Follow these simple steps to post your residential or commercial property with ease.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '32px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div className="post-steps-grid" style={{ flex: '1.2' }}>
            {LISTING_STEPS.map((item) => (
              <div key={item.step} className="post-step-card">
                <div className="post-step-number">{item.step}</div>
                <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#1e293b', margin: '0 0 6px 0' }}>{item.title}</h4>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.4' }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ flex: '0.8', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '360px', aspectRatio: '9/16', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.18)', border: '4px solid #ffffff', background: '#000' }}>
              <iframe
                style={{ width: '100%', height: '100%', border: 'none' }}
                src="https://www.youtube.com/embed/NjWZsZ-q3Ls"
                title="How to post property in hexahome in 5 simple steps"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      <section className="post-features-banner">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h3 style={{ fontSize: '28px', fontWeight: '900', color: '#033487', margin: '0 0 8px 0' }}>
            Features You'll Find Only on HexaHome
          </h3>
          <p style={{ fontSize: '14.5px', color: '#64748b', margin: 0 }}>Smart tools engineered for property owners and tenants alike</p>
        </div>

        <div className="post-features-grid">
          {PLATFORM_FEATURES.map((card, idx) => (
            <div key={idx} className="post-feature-card">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#033487', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <ShieldCheck size={26} />
              </div>
              <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', margin: '0 0 8px 0' }}>{card.title}</h4>
              <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0, lineHeight: '1.5' }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <PostPropertyWizard
        isOpen={isWizardOpen}
        onClose={closeWizard}
        step={currentStep}
        onNext={nextStep}
        onBack={prevStep}
        formData={formData}
        onUpdateField={updateField}
        onAiDescription={generateAiDescription}
        imageUrls={imageUrls}
        isUploading={isUploading}
        uploadError={uploadError}
        fileInputRef={fileInputRef}
        onUploadImages={uploadImages}
        onRemoveImage={removeImage}
        isSubmitting={isSubmitting}
        submitError={submitError}
        submitSuccess={submitSuccess}
        onSubmit={submitProperty}
        isEditMode={isEditMode}
      />

      <Footer
        onOpenPostModal={openWizard}
        onOpenAppModal={() => {}}
      />
    </div>
  );
}
