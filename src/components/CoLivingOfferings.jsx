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
    <section className="px-3 xs:px-10 sm:px-20 py-3 xs:py-5 sm:py-9 my-3 xs:my-5 sm:my-9 bg-brand-100 max-sm:bg-white">
      <div className="flex gap-2 sm:gap-7 flex-col sm:flex-row">
        <div className="flex flex-col gap-5 justify-center items-start w-full sm:w-1/3">
          <h2 className="text-lg leading-6 sm:text-[52px] sm:leading-[70px] font-semibold sm:font-extrabold text-dark-400 w-full sm:w-11/12">
            Co-Living Offerings
          </h2>
          <button
            type="button"
            onClick={() => onSelectCoLiving && onSelectCoLiving()}
            className="rounded-[10px] text-nowrap py-2 sm:py-3.5 px-4 sm:px-7 cursor-pointer whitespace-nowrap flex items-center justify-center font-semibold w-[85%] text-white bg-brand-300 hover:bg-[#02245e] text-xs sm:text-base max-sm:hidden"
          >
            Explore Co-living
            <svg width="1em" height="1em" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1">
              <path d="M3.834 10h13.333m0 0-5-5m5 5-5 5" stroke="#fff" stroke-width="1.667" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </button>
        </div>
        <div className="w-full sm:w-2/3 grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3 sm:h-[252px]">
          {COLIVING_ITEMS.map((item) => (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectCoLiving && onSelectCoLiving(item)}
              onKeyDown={(e) => { if (e.key === 'Enter') onSelectCoLiving && onSelectCoLiving(item); }}
              className="block relative h-full min-h-[100px] w-full max-sm:h-[180px] cursor-pointer group"
              aria-label={`${item.title} - ${item.desc}`}
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
                    <h3 className="font-bold text-white sm:text-xl text-xl text-start text-wrap">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white text-wrap">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
