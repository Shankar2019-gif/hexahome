import React from 'react';

const PG_ITEMS = [
  {
    id: 'girls',
    title: 'PG’s for Girls',
    img: 'https://assets.hexahome.in/static/home/homepage/pg-section/girls-pg.webp',
  },
  {
    id: 'boys',
    title: 'PG’s for Boys',
    img: 'https://assets.hexahome.in/static/home/homepage/pg-section/boys-pg.webp',
  },
  {
    id: 'with_meal',
    title: 'PG’s With Meal',
    img: 'https://assets.hexahome.in/static/home/homepage/pg-section/pg-with-meal.webp',
  }
];

export default function PgSection({ selectedCity, onSelectPg }) {
  const cityName = selectedCity?.name || 'Noida';

  return (
    <section className="pg-section px-3 xs:px-10 sm:px-20 py-3 xs:py-5 sm:py-7 my-2 xs:my-3 sm:my-5 flex flex-col gap-3 sm:gap-4">
      <div className="flex flex-col gap-1 sm:items-start">
        <h2 className="text-dark-400 text-lg xs:text-2xl sm:text-[28px] font-semibold sm:font-extrabold">
          PG's in {cityName}
        </h2>
      </div>

      <div className="pg-cards-container flex overflow-x-auto scrollbar-none flex-row gap-3 sm:gap-4 w-full sm:grid sm:grid-cols-3">
        {PG_ITEMS.map((item) => (
          <div
            key={item.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelectPg && onSelectPg(item)}
            onKeyDown={(e) => { if (e.key === 'Enter') onSelectPg && onSelectPg(item); }}
            className="pg-offering-card flex-shrink-0 w-[240px] sm:w-full"
            aria-label={item.title}
          >
            <div className="pg-offering-card-inner">
              <img
                src={item.img}
                alt={item.title}
                title={item.title}
                className="pg-offering-card-img"
                loading="lazy"
              />
              <div className="pg-offering-card-overlay"></div>
              <div className="pg-offering-card-bottom">
                <h3 className="pg-offering-card-title">
                  {item.title}
                </h3>
                <button
                  className="pg-offering-explore-btn"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPg && onSelectPg(item);
                  }}
                >
                  Explore
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
