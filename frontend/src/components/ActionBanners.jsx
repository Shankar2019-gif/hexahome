import React from 'react';
import { Download, Zap, Percent, Phone, ChevronRight } from 'lucide-react';

function FeatureRow({ icon, children }) {
  return (
    <li className="flex items-center gap-3 text-xs xs:text-sm sm:text-base leading-snug">
      <div className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1">{children}</div>
    </li>
  );
}

const LEFT_FEATURES = [
  {
    id: 'download',
    icon: <Download className="w-4 h-4 sm:w-5 sm:h-5 text-white stroke-[2.2]" aria-hidden="true" />,
    text: (
      <span className="text-white">
        Download Our App to Post property for <b className="font-extrabold">FREE</b>
      </span>
    ),
  },
  {
    id: 'quick-verified',
    icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white stroke-[1]" aria-hidden="true" />,
    text: (
      <span className="text-white">
        <b className="font-extrabold">Quick</b> &amp; <b className="font-extrabold">Verified</b> Buyers/Tenants
      </span>
    ),
  },
  {
    id: 'no-brokerage',
    icon: (
      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white flex items-center justify-center shrink-0" aria-hidden="true">
        <Percent className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#003893] stroke-[3]" />
      </div>
    ),
    text: (
      <span className="text-white">
        Pay <b className="font-extrabold">No</b> Brokerage!
      </span>
    ),
  },
];

const RIGHT_FEATURES = [
  {
    id: 'expert-help',
    icon: <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-[#003893] fill-[#003893] shrink-0" aria-hidden="true" />,
    text: (
      <span className="text-[#1e293b]">
        <b className="font-extrabold text-[#003893]">Get expert help</b> to sell or rent your property.
      </span>
    ),
  },
  {
    id: 'market-trends',
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-4 h-4 sm:w-5 sm:h-5 text-[#003893] shrink-0"
        aria-hidden="true"
      >
        <path d="M12 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm-7 14a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm14 0a2.5 2.5 0 0 0 0-5zM12 7v3.5M5 16.5V14a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2.5M12 10.5h.01" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
    text: (
      <span className="text-[#1e293b]">
        <b className="font-extrabold text-[#003893]">Know market trends</b> &amp; make the right property decisions.
      </span>
    ),
  },
  {
    id: 'sell-fast',
    icon: (
      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#003893] flex items-center justify-center shrink-0 text-white font-extrabold text-[10px] sm:text-[11px]" aria-hidden="true">
        ₹
      </div>
    ),
    text: (
      <span className="text-[#1e293b]">
        <b className="font-extrabold text-[#003893]">Sell or rent fast</b> at the best price with HexaHome!
      </span>
    ),
  },
];

export default function ActionBanners({ onOpenPostModal, onOpenAssistanceModal }) {
  return (
    <section id="action-banners" className="action-banners-section max-w-[1200px] mx-auto px-6 sm:px-12 md:px-16 lg:px-20 py-6 sm:py-9">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
        {/* Left Card: Looking for Buyers/Tenants! */}
        <div 
          className="relative overflow-hidden rounded-[22px] sm:rounded-[26px] min-h-[295px] sm:h-[315px] lg:h-[335px] p-6 sm:p-7 lg:p-8 flex flex-col justify-between shadow-sm"
          style={{ backgroundColor: '#003893' }}
        >
          {/* Natural Proportions Full-Height Background Image */}
          <img
            className="absolute right-0 bottom-0 top-0 h-full w-auto object-contain object-right-bottom pointer-events-none select-none z-0"
            src="https://assets.hexahome.in/static/home/banners/homepage-buyer-banner-bg-img.webp"
            alt="Looking for Buyers or Tenants"
            loading="lazy"
          />

          {/* Foreground Content */}
          <div className="relative z-10 max-w-[65%] xs:max-w-[60%] sm:max-w-[58%] flex flex-col justify-between h-full">
            <div>
              <h3 
                className="text-white text-base xs:text-lg sm:text-xl lg:text-[23px] font-extrabold leading-tight tracking-tight mb-4 sm:mb-5"
                style={{ color: '#ffffff' }}
              >
                Looking for Buyers/Tenants!
              </h3>
              <ul className="flex flex-col gap-3 sm:gap-3.5 text-white">
                {LEFT_FEATURES.map((item) => (
                  <FeatureRow key={item.id} icon={item.icon}>
                    {item.text}
                  </FeatureRow>
                ))}
              </ul>
            </div>

            <div className="pt-4 sm:pt-6">
              <button
                type="button"
                onClick={onOpenPostModal}
                className="inline-flex items-center gap-1.5 bg-white text-[#003893] font-bold rounded-xl px-4 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm cursor-pointer hover:bg-slate-50 active:scale-[0.98] transition-all shadow-sm w-fit"
                style={{ backgroundColor: '#ffffff', color: '#003893' }}
              >
                <span>Post Property for Free</span>
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 stroke-[2.5]" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Card: Need Assistance to Post Property? */}
        <div 
          className="relative overflow-hidden rounded-[22px] sm:rounded-[26px] min-h-[295px] sm:h-[315px] lg:h-[335px] p-6 sm:p-7 lg:p-8 flex flex-col justify-between shadow-sm"
          style={{ backgroundColor: '#e6f4f9', backgroundImage: 'linear-gradient(135deg, #e8f4fb 0%, #d8ecf8 100%)' }}
        >
          {/* Natural Proportions Full-Height Background Image */}
          <img
            className="absolute right-0 bottom-0 top-0 h-full w-auto object-contain object-right-bottom pointer-events-none select-none z-0"
            src="https://assets.hexahome.in/static/home/banners/homepage-post-property-banner-bg-img.webp"
            alt="Need Assistance to Post Property"
            loading="lazy"
          />

          {/* Foreground Content */}
          <div className="relative z-10 max-w-[65%] xs:max-w-[60%] sm:max-w-[58%] flex flex-col justify-between h-full">
            <div>
              <h3 
                className="text-[#003893] text-base xs:text-lg sm:text-xl lg:text-[23px] font-extrabold leading-tight tracking-tight mb-4 sm:mb-5"
                style={{ color: '#003893' }}
              >
                Need Assistance to Post Property?
              </h3>
              <ul className="flex flex-col gap-3 sm:gap-3.5">
                {RIGHT_FEATURES.map((item) => (
                  <FeatureRow key={item.id} icon={item.icon}>
                    {item.text}
                  </FeatureRow>
                ))}
              </ul>
            </div>

            <div className="pt-4 sm:pt-6">
              <button
                type="button"
                onClick={onOpenAssistanceModal}
                className="inline-flex items-center gap-1.5 bg-[#003893] text-white font-bold rounded-xl px-4 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm cursor-pointer hover:bg-[#002b75] active:scale-[0.98] transition-all shadow-sm w-fit"
                style={{ backgroundColor: '#003893', color: '#ffffff' }}
              >
                <span>Get Free Advice</span>
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 stroke-[2.5]" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


