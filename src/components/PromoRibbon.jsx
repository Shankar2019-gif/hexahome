import React from 'react';
import { Crown, ArrowRight, Sparkles, Check } from 'lucide-react';

export default function PromoRibbon({ onExplorePremium }) {
  return (
    <div id="premium-ribbon" className="promo-ribbon-section container">
      <div className="promo-ribbon-card">
        <div className="ribbon-glow" />
        
        <div className="ribbon-content-left">
          <div className="ribbon-crown-badge">
            <img 
              src="https://assets.hexahome.in/static/images/premium-crown-img.webp" 
              alt="Premium Crown" 
              className="crown-img"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <Crown size={22} className="crown-fallback-icon" />
          </div>

          <div className="ribbon-text-content">
            <div className="ribbon-headline-row">
              <span className="ribbon-highlight-pill">LIMITED TIME DEAL</span>
              <h3 className="ribbon-title">
                Upgrade to Premium <span>Up To 50% OFF</span>
              </h3>
            </div>
            <p className="ribbon-desc">
              Get unlimited owner contacts, dedicated property manager support, and top listing visibility.
            </p>

            <div className="ribbon-features-list">
              <div className="ribbon-feature-item">
                <Check size={14} className="feature-check" />
                <span>Zero Brokerage Verified</span>
              </div>
              <div className="ribbon-feature-item">
                <Check size={14} className="feature-check" />
                <span>Unlimited Owner Phone Numbers</span>
              </div>
              <div className="ribbon-feature-item">
                <Check size={14} className="feature-check" />
                <span>Priority Relationship Manager</span>
              </div>
            </div>
          </div>
        </div>

        <div className="ribbon-action-right">
          <button 
            type="button" 
            className="ribbon-cta-btn"
            onClick={onExplorePremium}
          >
            <span>Claim Discount</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
