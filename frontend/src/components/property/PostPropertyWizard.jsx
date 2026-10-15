import React from 'react';
import { CheckCircle2, Upload, Sparkles, X, Loader2 } from 'lucide-react';
import { CITIES } from '../../data/hexahomeData';

export default function PostPropertyWizard({
  isOpen,
  onClose,
  step,
  onNext,
  onBack,
  formData,
  onUpdateField,
  onAiDescription,
  imageUrls,
  isUploading,
  uploadError,
  fileInputRef,
  onUploadImages,
  onRemoveImage,
  isSubmitting,
  submitError,
  submitSuccess,
  onSubmit,
  isEditMode = false,
}) {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(4px)', padding: '16px', overflowY: 'auto' }}>
      <div style={{ background: '#ffffff', borderRadius: '24px', maxWidth: '640px', width: '100%', padding: '36px', boxShadow: '0 25px 60px rgba(0,0,0,0.3)', position: 'relative', border: '1px solid #e2e8f0', margin: 'auto' }}>
        <button
          type="button"
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '20px', color: '#94a3b8', cursor: 'pointer', fontWeight: 'bold' }}
        >
          ✕
        </button>

        {submitSuccess ? (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', background: '#d1fae5', color: '#059669', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <CheckCircle2 size={36} />
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', margin: '0 0 8px 0' }}>
              {isEditMode ? 'Property Listing Updated Successfully!' : 'Property Listed Successfully!'}
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '420px', margin: '0 auto', lineHeight: '1.5' }}>
              {isEditMode
                ? 'Your changes have been saved and your listing is updated. Redirecting to dashboard...'
                : 'Your property is now live and visible to thousands of verified buyers and tenants across India. Redirecting to dashboard...'}
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#033487', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Step {step} of 3
              </span>
              <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#1e293b', margin: '4px 0 0 0' }}>
                {step === 1 && 'Basic Property Information'}
                {step === 2 && 'Location & Specifications'}
                {step === 3 && 'Pricing, Description & Photos'}
              </h3>
            </div>

            {submitError && (
              <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', color: '#b91c1c', fontSize: '13px', fontWeight: '600' }}>
                {submitError}
              </div>
            )}

            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#475569' }}>Listing For *</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {['RENT', 'SALE'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => onUpdateField('listingType', type)}
                        style={{
                          flex: 1,
                          padding: '12px',
                          borderRadius: '12px',
                          border: formData.listingType === type ? '2px solid #033487' : '1.5px solid #cbd5e1',
                          background: formData.listingType === type ? '#033487' : '#ffffff',
                          color: formData.listingType === type ? '#ffffff' : '#475569',
                          fontWeight: '700',
                          fontSize: '14px',
                          cursor: 'pointer'
                        }}
                      >
                        For {type === 'RENT' ? 'Rent' : 'Sale'}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#475569' }}>Property Category *</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                    {['RESIDENTIAL', 'COMMERCIAL', 'PG', 'PLOT'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => onUpdateField('category', cat)}
                        style={{
                          padding: '8px 4px',
                          borderRadius: '10px',
                          border: formData.category === cat ? '2px solid #033487' : '1.5px solid #cbd5e1',
                          background: formData.category === cat ? '#eff6ff' : '#ffffff',
                          color: formData.category === cat ? '#033487' : '#475569',
                          fontWeight: '700',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#475569' }}>Property Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Luxury 3BHK Apartment in Sector 76"
                    value={formData.title}
                    onChange={(e) => onUpdateField('title', e.target.value)}
                    className="post-input-box"
                  />
                </div>

                <button
                  type="button"
                  onClick={onNext}
                  className="post-cta-btn"
                >
                  Next: Location & Specs →
                </button>
              </div>
            )}

            {/* Step 2: Location & Specifications */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#475569' }}>City *</label>
                    <select
                      value={formData.city}
                      onChange={(e) => onUpdateField('city', e.target.value)}
                      className="post-input-box"
                    >
                      {CITIES.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#475569' }}>Locality / Sector *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sector 76, Central Park"
                      value={formData.locality}
                      onChange={(e) => onUpdateField('locality', e.target.value)}
                      className="post-input-box"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#475569' }}>BHK Config</label>
                    <select
                      value={formData.bhk}
                      onChange={(e) => onUpdateField('bhk', e.target.value)}
                      className="post-input-box"
                    >
                      {['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK', '4+ BHK'].map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#475569' }}>Furnishing</label>
                    <select
                      value={formData.furnishing}
                      onChange={(e) => onUpdateField('furnishing', e.target.value)}
                      className="post-input-box"
                    >
                      {['Fully Furnished', 'Semi-Furnished', 'Unfurnished'].map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#475569' }}>Area (sq.ft)</label>
                    <input
                      type="number"
                      value={formData.areaSqFt}
                      onChange={(e) => onUpdateField('areaSqFt', e.target.value)}
                      className="post-input-box"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={onBack}
                    style={{ padding: '12px 20px', border: '1.5px solid #cbd5e1', borderRadius: '12px', background: '#ffffff', color: '#475569', fontWeight: '700', cursor: 'pointer' }}
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={onNext}
                    className="post-cta-btn"
                    style={{ margin: 0, flex: 1 }}
                  >
                    Next: Pricing & Photos →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Pricing & Photos */}
            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#475569' }}>
                      Expected {formData.listingType === 'RENT' ? 'Rent (₹ / month)' : 'Price (₹)'} *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 28000"
                      value={formData.price}
                      onChange={(e) => onUpdateField('price', e.target.value)}
                      className="post-input-box"
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#475569' }}>Deposit (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 50000"
                      value={formData.securityDeposit}
                      onChange={(e) => onUpdateField('securityDeposit', e.target.value)}
                      className="post-input-box"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#475569' }}>Property Description</label>
                    <button
                      type="button"
                      onClick={onAiDescription}
                      style={{ fontSize: '12px', fontWeight: '700', color: '#033487', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Sparkles size={12} style={{ color: '#facc15' }} />
                      Generate with AI
                    </button>
                  </div>
                  <textarea
                    rows="3"
                    placeholder="Highlight details like connectivity, nearby metro, parking, amenities..."
                    value={formData.description}
                    onChange={(e) => onUpdateField('description', e.target.value)}
                    className="post-input-box"
                    style={{ resize: 'none' }}
                  />
                </div>

                {/* S3 Media Upload Component */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => onUploadImages(e.target.files)}
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  style={{ display: 'none' }}
                />
                <div
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                  style={{
                    border: '2px dashed #033487',
                    borderRadius: '14px',
                    padding: '20px',
                    textAlign: 'center',
                    background: isUploading ? '#f1f5f9' : '#eff6ff',
                    cursor: isUploading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isUploading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <Loader2 size={26} className="animate-spin" style={{ color: '#033487' }} />
                      <p style={{ fontSize: '13px', fontWeight: '700', color: '#033487', margin: 0 }}>Uploading photos to cloud storage...</p>
                    </div>
                  ) : (
                    <>
                      <Upload size={24} style={{ color: '#033487', margin: '0 auto 6px auto', display: 'block' }} />
                      <p style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', margin: '0 0 2px 0' }}>
                        Click or drag to upload property images
                      </p>
                      <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>
                        Upload JPG, PNG, or WEBP photos (Max 15MB each)
                      </p>
                    </>
                  )}
                </div>

                {uploadError && (
                  <p style={{ fontSize: '12px', color: '#ef4444', margin: '4px 0 0 0', fontWeight: '600' }}>
                    {uploadError}
                  </p>
                )}

                {/* Photos Preview Grid */}
                {imageUrls.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: '10px' }}>
                    {imageUrls.map((url, idx) => (
                      <div
                        key={idx}
                        style={{
                          position: 'relative',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          aspectRatio: '1',
                          border: '1px solid #cbd5e1'
                        }}
                      >
                        <img
                          src={url}
                          alt={`Upload ${idx + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveImage(idx);
                          }}
                          style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            background: 'rgba(0,0,0,0.65)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          <X size={12} />
                        </button>
                        {idx === 0 && (
                          <span style={{ position: 'absolute', bottom: '4px', left: '4px', background: '#033487', color: '#fff', fontSize: '9px', fontWeight: 'bold', padding: '2px 5px', borderRadius: '4px' }}>
                            Cover
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={onBack}
                    style={{ padding: '12px 20px', border: '1.5px solid #cbd5e1', borderRadius: '12px', background: '#ffffff', color: '#475569', fontWeight: '700', cursor: 'pointer' }}
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{ flex: 1, padding: '14px', background: '#16a34a', color: '#ffffff', fontWeight: '800', fontSize: '15px', border: 'none', borderRadius: '12px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(22, 163, 74, 0.3)' }}
                  >
                    {isSubmitting
                      ? (isEditMode ? 'Saving Changes...' : 'Publishing Listing...')
                      : (isEditMode ? '✓ Save & Update Listing' : '✓ Publish Property Free')}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
