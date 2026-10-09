import React from 'react';

const BHK_ITEMS = [
  {
    label: '1BHK',
    img: 'https://assets.hexahome.in/static/home/homepage/bhk-types/1bhk-property.webp',
  },
  {
    label: '2BHK',
    img: 'https://assets.hexahome.in/static/home/homepage/bhk-types/2bhk-property.webp',
  },
  {
    label: '3BHK',
    img: 'https://assets.hexahome.in/static/home/homepage/bhk-types/3bhk-property.webp',
  },
  {
    label: '4BHK',
    img: 'https://assets.hexahome.in/static/home/homepage/bhk-types/4bhk-property.webp',
  },
  {
    label: '4+BHK',
    img: 'https://assets.hexahome.in/static/home/homepage/bhk-types/4-bhk-property.webp',
  }
];

export default function BhkFilterSection({ onSelectBhk }) {
  return (
    <section className="pl-3 xs:px-10 sm:px-20 py-3 xs:py-5 sm:py-9 flex flex-col gap-5 bg-brand-100 my-3 xs:my-6 sm:my-9">
      <div className="flex flex-col gap-1 sm:items-start">
        <h2 className="text-dark-400 text-lg xs:text-2xl sm:text-[28px] font-semibold sm:font-extrabold">
          BHK in Mind?
        </h2>
      </div>
      <section className="flex overflow-x-auto scrollbar-none flex-row gap-3 w-full sm:grid grid-cols-5 max-sm:h-20 min-h-[80px] sm:min-h-[140px]">
        {BHK_ITEMS.map((item) => (
          <div
            key={item.label}
            role="button"
            tabIndex={0}
            onClick={() => onSelectBhk && onSelectBhk(item.label)}
            onKeyDown={(e) => { if (e.key === 'Enter') onSelectBhk && onSelectBhk(item.label); }}
            className="block relative h-full w-full min-w-[80px] sm:min-w-[158px] cursor-pointer group"
          >
            <div className="relative flex h-full w-full justify-center items-center">
              <div className="absolute w-full h-full rounded-xl overflow-hidden">
                <div className="object-cover h-full w-full overflow-hidden z-10 transition-transform duration-300 ease-in-out group-hover:scale-105">
                  <img
                    src={item.img}
                    alt={`${item.label} Properties`}
                    title={`${item.label} Properties`}
                    height="400"
                    width="400"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="h-full w-full bg-gradient-to-t from-black/80 to-black/30 absolute bottom-0 transition-all ease-in-out z-0"></div>
              </div>
              <div className="z-10 m-4 w-full flex justify-center items-center">
                <p className="font-semibold text-xl text-white text-nowrap">
                  {item.label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </section>
    </section>
  );
}
