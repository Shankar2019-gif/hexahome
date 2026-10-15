import React from 'react';

const PLOT_ITEMS = [
  {
    id: 'res_plots',
    title: 'Residential Plots for sale',
    img: 'https://assets.hexahome.in/static/home/homepage/plots-section/residential-plots.webp',
  },
  {
    id: 'boundary_plots',
    title: 'Plots with Boundary Wall',
    img: 'https://assets.hexahome.in/static/home/homepage/plots-section/plots-with-boundary-wall.webp',
  },
  {
    id: 'corner_plots',
    title: 'Corner Plots for Sale',
    img: 'https://assets.hexahome.in/static/home/homepage/plots-section/corner-plots-for-sale.webp',
  },
  {
    id: 'north_east_plots',
    title: 'North- East Facing Plot',
    img: 'https://assets.hexahome.in/static/home/homepage/plots-section/north- east-facing-plot.webp',
  }
];

export default function PlotsSection({ selectedCity, onSelectPlot }) {
  const cityName = selectedCity?.name || 'Noida';

  return (
    <section className="plots-section pl-3 xs:px-10 sm:px-20 py-3 xs:py-5 sm:py-9 flex flex-col gap-3 sm:gap-5 sm:bg-brand-100 my-3 xs:my-6 sm:my-9">
      <div className="flex flex-col gap-1 sm:items-start">
        <h2 className="text-dark-400 text-lg xs:text-2xl sm:text-[28px] font-semibold sm:font-extrabold">
          Plots in {cityName}
        </h2>
      </div>
      <div className="flex overflow-x-auto scrollbar-none flex-row gap-3 w-full sm:grid sm:grid-cols-4 sm:gap-4">
        {PLOT_ITEMS.map((item) => (
          <div key={item.id} className="flex-shrink-0 w-[152px] sm:w-auto h-[132px] sm:h-[200px] sm:mx-1">
            <div
              role="button"
              tabIndex={0}
              onClick={() => onSelectPlot && onSelectPlot(item)}
              onKeyDown={(e) => { if (e.key === 'Enter') onSelectPlot && onSelectPlot(item); }}
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
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
