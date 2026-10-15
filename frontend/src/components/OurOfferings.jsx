import React from 'react';

const OFFERINGS = [
  {
    id: 'residential',
    title: 'Residential Properties',
    image: 'https://assets.hexahome.in/static/home/homepage/our-offerings/residential-properties-img.webp',
  },
  {
    id: 'commercial',
    title: 'Commercial Properties',
    image: 'https://assets.hexahome.in/static/home/homepage/our-offerings/commercial-properties-img.webp',
  },
  {
    id: 'pg',
    title: 'Search PG’s',
    image: 'https://assets.hexahome.in/static/home/homepage/our-offerings/search-pg-img.webp',
  },
  {
    id: 'plots',
    title: 'Plots for sale',
    image: 'https://assets.hexahome.in/static/home/homepage/our-offerings/plot-land-img.webp',
  },
  {
    id: 'coliving',
    title: 'Co-Living',
    image: 'https://assets.hexahome.in/static/home/homepage/our-offerings/coliving-img.webp',
  }
];

export default function OurOfferings({ onSelectOffering }) {
  return (
    <section className="offerings-section" id="our-offerings">
      <div className="offerings-container">
        <div className="offerings-heading-wrap">
          <h2 className="offerings-heading">Our Offerings</h2>
        </div>
        <div className="offerings-grid">
          {OFFERINGS.map((item) => (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              className="offering-card group"
              onClick={() => onSelectOffering && onSelectOffering(item)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSelectOffering && onSelectOffering(item);
              }}
              aria-label={item.title}
            >
              <div className="offering-card-inner">
                <div className="offering-media-wrap">
                  <img
                    src={item.image}
                    alt={item.title}
                    title={item.title}
                    width="400"
                    height="400"
                    loading="lazy"
                    className="offering-card-img"
                  />
                  <div className="offering-card-gradient" />
                </div>
                <div className="offering-card-content">
                  <h3 className="offering-card-title">{item.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
