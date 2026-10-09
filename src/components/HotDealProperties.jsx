import React from 'react';

const HOT_DEAL_ITEMS = [
  {
    id: 'res_deals',
    title: 'Residential Properties',
    img: 'https://assets.hexahome.in/static/home/homepage/hot-deals/residential-property-deals-img.webp',
  },
  {
    id: 'comm_deals',
    title: 'Commercial Properties',
    img: 'https://assets.hexahome.in/static/home/homepage/hot-deals/commercial-property-deals-img.webp',
  },
  {
    id: 'res_plot_deals',
    title: 'Residential Plots',
    img: 'https://assets.hexahome.in/static/home/homepage/hot-deals/residential-plots-deals-img.webp',
  },
  {
    id: 'comm_plot_deals',
    title: 'Commercial Plots',
    img: 'https://assets.hexahome.in/static/home/homepage/hot-deals/commercial-plots-deals-img.webp',
  }
];

export default function HotDealProperties({ selectedCity, onSelectDeal }) {
  const cityName = selectedCity?.name || 'Noida';

  return (
    <section className="pl-3 xs:px-10 sm:px-20 py-3 xs:py-5 sm:py-9 flex flex-col gap-3 sm:gap-5 max-sm:bg-brand-100 max-sm:mb-3 max-sm:mt-6">
      <div className="flex flex-col gap-1 sm:items-start">
        <h2 className="text-dark-400 text-lg xs:text-2xl sm:text-[28px] font-semibold sm:font-extrabold">
          Hot Deal Properties in {cityName}
        </h2>
      </div>
      <section className="flex overflow-x-auto scrollbar-none flex-row gap-3 w-full sm:grid grid-cols-4">
        {HOT_DEAL_ITEMS.map((item) => (
          <div key={item.id} className="flex-shrink-0 w-[200px] sm:w-full h-[132px] sm:h-[200px]">
            <div
              role="button"
              tabIndex={0}
              onClick={() => onSelectDeal && onSelectDeal(item)}
              onKeyDown={(e) => { if (e.key === 'Enter') onSelectDeal && onSelectDeal(item); }}
              className="block relative h-full min-h-[100px] w-full cursor-pointer group"
              aria-label={item.title}
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
                    <h3 className="font-bold text-white sm:text-xl text-base xs:text-lg text-start text-wrap">
                      {item.title}
                    </h3>
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
