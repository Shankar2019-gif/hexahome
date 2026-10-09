import React from 'react';

const FURNISHING_ITEMS = [
  {
    id: 'fully_furnished',
    title: 'Fully Furnished',
    subtitle: 'Properties with All Essentials',
    img: 'https://assets.hexahome.in/static/home/homepage/furnishing-type/fully-furnished-img.webp',
  },
  {
    id: 'semi_furnished',
    title: 'Semi Furnished',
    subtitle: 'Properties with Basic Amenities',
    img: 'https://assets.hexahome.in/static/home/homepage/furnishing-type/semi-furnished-img.webp',
  },
  {
    id: 'unfurnished',
    title: 'Unfurnished',
    subtitle: 'Properties, Ready to styled by You',
    img: 'https://assets.hexahome.in/static/home/homepage/furnishing-type/unfurnished-img.webp',
  }
];

export default function FurnishingSection({ onSelectFurnishing }) {
  return (
    <section className="pl-3 xs:px-10 sm:px-20 py-3 xs:py-5 sm:py-9 flex flex-col gap-3 sm:gap-5 max-sm:bg-brand-100 max-sm:my-3">
      <div className="flex flex-col gap-1 sm:items-start">
        <h2 className="text-dark-400 text-lg xs:text-2xl sm:text-[28px] font-semibold sm:font-extrabold">
          Explore by Furnishing Type
        </h2>
      </div>
      <section className="flex overflow-x-auto scrollbar-none flex-row gap-3 w-full sm:grid grid-cols-3">
        {FURNISHING_ITEMS.map((item) => (
          <div key={item.id} className="flex-shrink-0 w-fit sm:w-full h-[132px] sm:h-[180px]">
            <div
              role="button"
              tabIndex={0}
              onClick={() => onSelectFurnishing && onSelectFurnishing(item)}
              onKeyDown={(e) => { if (e.key === 'Enter') onSelectFurnishing && onSelectFurnishing(item); }}
              className="block relative h-full min-h-[100px] w-full cursor-pointer group"
              aria-label={`${item.title} - ${item.subtitle}`}
            >
              <div className="relative flex h-full w-full justify-start items-end">
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
                  <div className="w-full flex flex-col items-start">
                    <h3 className="font-bold text-white sm:text-xl text-base xs:text-lg text-start text-nowrap">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white text-nowrap">
                      {item.subtitle}
                    </p>
                  </div>
                  <button
                    className="max-sm:hidden h-8 w-8 rounded-full bg-white grid place-items-center hover:scale-105 flex-shrink-0"
                    aria-label="View details"
                    type="button"
                  >
                    <svg width="1em" height="1em" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                      <path d="M14.694 9.263 8.236 2.805a1.043 1.043 0 0 0-1.663 1.214L9.66 10l-3.087 5.98a1.041 1.041 0 0 0 1.663 1.215l6.458-6.458a1.04 1.04 0 0 0 0-1.474" fill="#000"></path>
                    </svg>
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
