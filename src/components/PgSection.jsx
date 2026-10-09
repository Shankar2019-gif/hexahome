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
    <section className="pl-3 xs:px-10 sm:px-20 py-3 xs:py-5 sm:py-9 flex flex-col gap-3 sm:gap-5">
      <div className="flex flex-col gap-1 sm:items-start">
        <h2 className="text-dark-400 text-lg xs:text-2xl sm:text-[28px] font-semibold sm:font-extrabold">
          PG's in {cityName}
        </h2>
      </div>
      <section className="flex overflow-x-auto scrollbar-none flex-row gap-3 w-full sm:grid grid-cols-3">
        {PG_ITEMS.map((item) => (
          <div key={item.id} className="flex-shrink-0 w-[212px] sm:w-full h-[120px] sm:h-[180px]">
            <div
              role="button"
              tabIndex={0}
              onClick={() => onSelectPg && onSelectPg(item)}
              onKeyDown={(e) => { if (e.key === 'Enter') onSelectPg && onSelectPg(item); }}
              className="block relative h-full min-h-[100px] w-full cursor-pointer group"
              aria-label={item.title}
            >
              <div className="relative flex h-full w-full justify-center items-center">
                <div className="absolute w-full h-full rounded-xl overflow-hidden">
                  <div className="object-cover h-full w-full overflow-hidden z-10 transition-transform duration-300 ease-in-out scale-100 group-hover:scale-105">
                    <img
                      src={item.img}
                      alt={item.title}
                      title={item.title}
                      height="400"
                      width="400"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="h-4/5 w-full bg-gradient-to-t from-black via-dark-900 to-transparent absolute bottom-0 transition-all ease-in-out z-0"></div>
                </div>
                <div className="z-10 m-4 w-full flex justify-between items-end">
                  <div className="w-full flex flex-col items-center">
                    <h3 className="font-bold text-white sm:text-xl text-base xs:text-lg text-center text-wrap">
                      {item.title}
                    </h3>
                  </div>
                  <button
                    className="max-sm:hidden rounded-lg bg-white flex-shrink-0 px-3 py-[6px] font-bold text-sm text-dark-400 hover:scale-105 transition-transform"
                    type="button"
                  >
                    Explore
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </section>
  );
}
