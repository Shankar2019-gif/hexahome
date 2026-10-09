import React from 'react';

const TOP_CITIES = [
  {
    name: 'Bangalore',
    subtitle: "India's Silicon Valley",
    img: 'https://assets.hexahome.in/static/home/top-cities-img/top-city-banaglore.webp',
  },
  {
    name: 'Chennai',
    subtitle: 'Gateway of South India',
    img: 'https://assets.hexahome.in/static/home/top-cities-img/top-city-chennai.webp',
  },
  {
    name: 'Cochin',
    subtitle: 'Queen of Arabian Sea',
    img: 'https://assets.hexahome.in/static/home/top-cities-img/top-city-cochin.webp',
  },
  {
    name: 'Coimbatore',
    subtitle: 'Manchester of South',
    img: 'https://assets.hexahome.in/static/home/top-cities-img/top-city-coimbatore.webp',
  },
  {
    name: 'Delhi',
    subtitle: 'The Nation Capital',
    img: 'https://assets.hexahome.in/static/home/top-cities-img/top-city-delhi.webp',
  },
  {
    name: 'Kolkata',
    subtitle: 'City of Joy',
    img: 'https://assets.hexahome.in/static/home/top-cities-img/top-city-kolkata.webp',
  },
  {
    name: 'Gurugram',
    subtitle: 'City of Millennium',
    img: 'https://assets.hexahome.in/static/home/top-cities-img/top-city-gurugram.webp',
  },
  {
    name: 'Hyderabad',
    subtitle: 'A City of Pearls',
    img: 'https://assets.hexahome.in/static/home/top-cities-img/top-city-hyderabad.webp',
  },
  {
    name: 'Lucknow',
    subtitle: 'City of Nawabs',
    img: 'https://assets.hexahome.in/static/home/top-cities-img/top-city-lucknow.webp',
  },
  {
    name: 'Mumbai',
    subtitle: 'The City of Dreams',
    img: 'https://assets.hexahome.in/static/home/top-cities-img/top-city-mumbai.webp',
  },
  {
    name: 'Noida',
    subtitle: 'The City of Hitech’s',
    img: 'https://assets.hexahome.in/static/home/top-cities-img/top-city-noida-img.webp',
  },
  {
    name: 'Pune',
    subtitle: 'Queen of Deccan',
    img: 'https://assets.hexahome.in/static/home/top-cities-img/top-city-pune.webp',
  }
];

export default function ExploreCities({ onSelectCity }) {
  return (
    <section className="flex w-full pl-3 xs:px-10 sm:px-20 py-3 xs:py-5 sm:py-9 flex-col gap-8 sm:bg-brand-100 my-3 xs:my-5 sm:my-9 max-sm:bg-brand-100">
      <div className="flex flex-col gap-3 xs:gap-5 sm:gap-8">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1 sm:items-start">
            <h2 className="text-dark-400 text-lg xs:text-2xl sm:text-[28px] font-semibold sm:font-extrabold">
              Explore Properties by Cities
            </h2>
          </div>
          <button
            type="button"
            className="rounded-[10px] text-nowrap py-2 sm:py-3.5 px-4 sm:px-7.5 cursor-pointer whitespace-nowrap flex items-center justify-center font-semibold w-fit bg-brand-300/[0.08] text-brand-300 stroke-brand-300 border border-transparent hover:border hover:border-brand-300 active:text-white active:bg-brand-300 text-xs sm:text-base rounded-full h-11 max-sm:hidden"
          >
            Explore Other Cities
          </button>
        </div>
        <div className="flex overflow-x-auto scrollbar-none flex-row gap-3 w-full sm:grid sm:grid-cols-4 sm:gap-5">
          {TOP_CITIES.map((city) => (
            <div
              key={city.name}
              role="button"
              tabIndex={0}
              onClick={() => onSelectCity && onSelectCity({ id: city.name.toLowerCase(), name: city.name })}
              onKeyDown={(e) => { if (e.key === 'Enter') onSelectCity && onSelectCity({ id: city.name.toLowerCase(), name: city.name }); }}
              className="relative overflow-hidden rounded-xl flex items-end hover:cursor-pointer min-w-[240px] flex-shrink-0 group"
              style={{ height: '140px', width: 'auto' }}
            >
              <div className="absolute w-full h-full">
                <div className="rounded-xl object-cover h-full w-full overflow-hidden z-10 transition-transform duration-300 ease-in-out scale-100 group-hover:scale-105">
                  <img
                    className="w-full h-full object-cover"
                    src={city.img}
                    alt={city.name}
                    title={city.name}
                    width="600"
                    height="240"
                    loading="lazy"
                  />
                </div>
                <div className="bg-gradient-to-t from-black to-transparent rounded-xl w-full h-full absolute top-0 transition-all ease-in-out z-0 opacity-100"></div>
              </div>
              <div className="w-full relative text-white flex justify-between items-end p-4 z-10">
                <div>
                  <p className="text-xl leading-7 font-bold">{city.name}</p>
                  <p className="text-sm leading-5 max-xs:text-nowrap">{city.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
