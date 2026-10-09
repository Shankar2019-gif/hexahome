import React from 'react';
import { Building2, TrendingUp, MapPin, ArrowRight } from 'lucide-react';
import { COMMERCIAL_LISTINGS } from '../data/hexahomeData';

export default function CommercialPropertiesSale({ selectedCity, onSelectCommercialItem }) {
  const cityName = selectedCity?.name || 'Noida';

  return (
    <section className="section-padding commercial-sale-section bg-subtle">
      <div className="container">
        <div className="section-header-row">
          <div>
            <div className="section-eyebrow">Institutional Grade Assets</div>
            <h2 className="section-heading">Commercial Properties for Sale in {cityName}</h2>
            <p className="section-subtext">
              High-yield retail storefronts and Grade-A business IT parks with assured lease guarantees.
            </p>
          </div>
        </div>

        <div className="commercial-sale-grid">
          {COMMERCIAL_LISTINGS.map((item) => (
            <div 
              key={item.id} 
              className="comm-sale-card hover-lift"
              onClick={() => onSelectCommercialItem && onSelectCommercialItem(item)}
            >
              <div className="comm-sale-media">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="comm-sale-img"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <span className="comm-yield-tag">
                  <TrendingUp size={12} />
                  <span>{item.rentalYield}</span>
                </span>
              </div>

              <div className="comm-sale-body">
                <div className="comm-price-row">
                  <span className="comm-price">{item.price}</span>
                  <span className="comm-area">{item.area}</span>
                </div>

                <h3 className="comm-title">{item.title}</h3>
                
                <div className="comm-location">
                  <MapPin size={14} />
                  <span>{item.location}</span>
                </div>

                <div className="comm-status-pill">
                  <span>Status: {item.status}</span>
                </div>

                <div className="comm-footer">
                  <span className="comm-inquire-btn">
                    <span>Inquire Property</span>
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
