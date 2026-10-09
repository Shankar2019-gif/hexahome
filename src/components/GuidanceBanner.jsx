import React from 'react';

export default function GuidanceBanner() {
  return (
    <section id="guidance" className="max-sm:hidden relative h-full w-full text-white scroll-mt-[100px]">
      <div className="absolute w-full h-full overflow-hidden">
        <div className="object-cover h-full w-full overflow-hidden z-10">
          <img
            className="w-full h-full object-cover"
            src="https://assets.hexahome.in/static/images/guidance-section-bg-img.webp"
            alt="Guidance Image"
            width="400"
            height="400"
            loading="lazy"
          />
        </div>
      </div>
      <div className="flex relative justify-between py-10 px-28">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">Guidance and assistance from start to finish.</h2>
          <p>Talk to a professional and get the right property insights.</p>
        </div>
        <div className="flex gap-10 items-center">
          <div className="flex flex-col gap-2">
            <div className="text-xl font-bold">Help Desk:</div>
            <div className="text-xl">support@hexadecimalsoftware.com</div>
          </div>
          <div className="bg-dark-100 w-[1px] h-full min-h-[50px] bg-white/30"></div>
          <div className="flex flex-col gap-2">
            <div className="text-xl font-bold">Contact:</div>
            <div className="text-xl">+91 93112 14726</div>
          </div>
        </div>
      </div>
    </section>
  );
}
