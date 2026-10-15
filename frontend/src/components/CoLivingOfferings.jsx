import React from 'react';

const COLIVING_ITEMS = [
  {
    id: 'shared_flats',
    title: 'Shared Flats',
    desc: 'List your Profile & find your second home in the new city and find the perfect co-living room/flat with us.',
    img: 'https://assets.hexahome.in/static/home/homepage/checkout-co-living/room-flat-img.webp',
  },
  {
    id: 'roommates',
    title: 'Roommates',
    desc: 'Find the perfect roommate and make your living space into sweet home & split your rent.',
    img: 'https://assets.hexahome.in/static/home/homepage/checkout-co-living/roommates-img.webp',
  }
];

export default function CoLivingOfferings({ onSelectCoLiving }) {
  return (
    <section className="coliving-section px-3 xs:px-10 sm:px-20 py-6 sm:py-8 my-3 xs:my-5 sm:my-8">
      <div className="coliving-container">
        {/* Left Header Column Matching Reference Image */}
        <div className="coliving-header-col">
          <h2 className="coliving-title">
            <span>Checkout the</span>
            <span>Co-Living</span>
            <span>Offerings</span>
          </h2>
          <button
            type="button"
            onClick={() => onSelectCoLiving && onSelectCoLiving()}
            className="coliving-explore-btn"
          >
            Explore Co-living &rarr;
          </button>
        </div>

        {/* Right Cards Grid Matching Reference Image */}
        <div className="coliving-cards-grid">
          {COLIVING_ITEMS.map((item) => (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectCoLiving && onSelectCoLiving(item)}
              onKeyDown={(e) => { if (e.key === 'Enter') onSelectCoLiving && onSelectCoLiving(item); }}
              className="coliving-card"
              aria-label={`${item.title} - ${item.desc}`}
            >
              <div className="coliving-card-img-wrap">
                <img
                  src={item.img}
                  alt={item.title}
                  title={item.title}
                  className="coliving-card-img"
                  loading="lazy"
                />
              </div>
              <div className="coliving-card-overlay"></div>
              <div className="coliving-card-content">
                <h3 className="coliving-card-title">
                  {item.title}
                </h3>
                <p className="coliving-card-desc">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
