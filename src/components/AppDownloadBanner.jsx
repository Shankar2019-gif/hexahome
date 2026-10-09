import React from 'react';

export default function AppDownloadBanner({ onOpenAppModal }) {
  return (
    <section id="download-banner" className="scroll-mt-[100px]">
      <div className="relative mx-3 xs:mx-10 sm:mx-20 my-3 xs:my-5 sm:my-9 p-4 sm:p-11 min-h-[160px] bg-gradient-to-r from-brand-300 to-[#02245e] rounded-2xl sm:rounded-[32px] text-white overflow-hidden scroll-mt-[150px]">
        {/* Subtle geometric background overlay */}
        <div className="absolute inset-0 bg-white/[0.04] pointer-events-none"></div>

        <div className="flex flex-col gap-2 sm:gap-8 w-full max-w-[78%] sm:max-w-[70%] z-20 relative">
          <div className="flex flex-col gap-2 xs:gap-4 sm:gap-6">
            <h2 className="font-semibold sm:font-extrabold text-base xs:text-2xl sm:text-[32px] leading-tight">
              Buy, Sell &amp; Rent Properties on the HexaHome App
            </h2>
            <ul className="flex flex-col gap-2 sm:gap-3 text-base sm:text-lg">
              <li className="flex items-center gap-3">
                <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:w-6 flex-shrink-0">
                  <path d="M9.232.172A9.055 9.055 0 0 0 .174 9.23a9.055 9.055 0 0 0 9.058 9.057 9.02 9.02 0 0 0 5.596-1.961l.807.807a1.7 1.7 0 0 0 .318 1.99l4.24 4.27c.66.66 1.734.66 2.394 0l.808-.808c.66-.66.66-1.734 0-2.394l-4.27-4.24a1.68 1.68 0 0 0-1.99-.289l-.807-.807A9.055 9.055 0 0 0 9.232.172m0 1.673a7.385 7.385 0 1 1-.001 14.77 7.385 7.385 0 0 1 0-14.77M4.558 6.893a5.04 5.04 0 0 0-.75 2.654 5.04 5.04 0 0 0 5.049 5.048 5.1 5.1 0 0 0 2.913-.923c-.22.025-.465.029-.692.029a6.503 6.503 0 0 1-6.52-6.52c0-.097-.003-.19 0-.288" fill="#fff"></path>
                </svg>
                <p className="gap-0 max-sm:text-sm">
                  <span className="inline font-medium">Find a home</span>
                  <span className="max-sm:hidden inline">, PG, or rental directly from verified owners.</span>
                </p>
              </li>
              <li className="flex items-center gap-3">
                <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:w-6 flex-shrink-0">
                  <path d="M11.999 3c-.38 0-.76.126-1.069.38l-8.601 7.054c-.32.261-.433.717-.221 1.068a.843.843 0 0 0 1.255.216l8.502-6.971a.21.21 0 0 1 .268 0l8.502 6.972c.156.128.345.19.534.19.29 0 .577-.148.736-.432.194-.347.08-.785-.23-1.038l-1.34-1.099V5.864a.826.826 0 0 0-.833-.819h-.834a.826.826 0 0 0-.833.819v1.425L13.068 3.38c-.31-.254-.69-.38-1.069-.38m0 3.273-8.337 6.834v5.848c0 1.129.933 2.045 2.084 2.045h12.506c1.15 0 2.084-.916 2.084-2.046v-5.847zm-1.667 6.545h3.334c.46 0 .834.366.834.818v5.728H9.498v-5.728c0-.452.373-.818.834-.818" fill="#fff"></path>
                </svg>
                <p className="gap-0 max-sm:text-sm">
                  Post your property at ₹0<span className="max-sm:hidden"> cost and get genuine buyers &amp; tenants fast.</span>
                </p>
              </li>
              <li className="hidden sm:flex items-center gap-3">
                <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:w-6 flex-shrink-0">
                  <path d="M19.11.96c-.927 0-1.73.522-2.16 1.276.743.163 1.495.45 2.266.87.883.482 1.556 1.016 2.055 1.59.212-.371.33-.797.33-1.245A2.49 2.49 0 0 0 19.11.96m-3.66 2.07c-2.93.072-4.788 2.71-6.014 4.456-.499.71-.926 1.33-1.275 1.59-.44.322-1.256.4-2.13.495-1.153.126-2.52.285-3.33 1.11.307-.073.667-.12 1.095-.12 2.12 0 4.751.221 9.255 2.805 3.776 2.15 6.864 5.203 7.605 7.5.281-.919.035-2.057-1.095-3.93-.51-.846.112-2.374.765-3.99 1.2-2.974 2.685-6.673-1.575-9-1.236-.671-2.323-.94-3.3-.915M3.797 11.52c-.89 0-1.52.228-1.755.63l-.045-.03c-.557 2.123 2.593 5.322 6.3 7.606A3.79 3.79 0 0 0 12 22.56c.543 0 1.05-.105 1.515-.3 1.541.516 2.883.78 3.96.78.963 0 1.717-.229 2.205-.66.035-.04.063-.09.09-.135.157-.274.092-.664.015-.945-.47-1.72-3.146-4.802-7.2-7.11-4.3-2.468-6.701-2.67-8.79-2.67M12 15.84a2.85 2.85 0 0 1 2.88 2.88A2.85 2.85 0 0 1 12 21.6a2.85 2.85 0 0 1-2.88-2.88A2.85 2.85 0 0 1 12 15.84" fill="#fff"></path>
                </svg>
                <span>Smart alerts &amp; search helps you find homes that fit your budget.</span>
              </li>
            </ul>
          </div>

          <p className="text-xs font-semibold mt-1 sm:hidden">Available on iOS &amp; Android</p>
          <div className="z-20 flex justify-start gap-2 sm:hidden">
            <button type="button" onClick={onOpenAppModal} className="cursor-pointer">
              <img src="/playstore.webp" alt="download-playstore" height="32" width="98" style={{ objectFit: 'cover' }} />
            </button>
            <button type="button" onClick={onOpenAppModal} className="cursor-pointer">
              <img src="/appstore.webp" alt="download-ios" height="32" width="98" style={{ objectFit: 'cover' }} />
            </button>
          </div>

          <div className="hidden sm:flex z-20 gap-6 items-center">
            <div className="flex-shrink-0 bg-white p-2 rounded-xl">
              <img src="/download-app-qr.webp" alt="QR code" height="120" width="120" style={{ objectFit: 'cover' }} />
            </div>
            <div className="flex flex-col gap-3">
              <p className="font-semibold text-2xl">Scan to Download our App</p>
              <div className="flex flex-col gap-2">
                <p className="text-base opacity-90">Available on iOS &amp; Android.</p>
                <div className="flex justify-start gap-2">
                  <button type="button" onClick={onOpenAppModal} className="cursor-pointer hover:opacity-90">
                    <img src="/playstore.webp" alt="download-playstore" height="42" width="140" style={{ objectFit: 'contain' }} />
                  </button>
                  <button type="button" onClick={onOpenAppModal} className="cursor-pointer hover:opacity-90">
                    <img src="/appstore.webp" alt="download-ios" height="42" width="140" style={{ objectFit: 'contain' }} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <picture>
          <img
            src="https://img.hexahome.in/media/static/hexahome/download-app-banner-img.webp?&rs=fill:360:460"
            alt="Mobile App Banner"
            title="Mobile App Banner"
            width="360"
            height="460"
            loading="lazy"
            className="absolute bottom-0 p-0 right-2 sm:right-6 md:right-10 z-20 w-[140px] h-[180px] sm:h-[380px] sm:w-[300px] md:h-[440px] md:w-[350px] object-cover object-right"
          />
        </picture>
      </div>
    </section>
  );
}
