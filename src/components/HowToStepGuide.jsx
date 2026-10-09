import React from 'react';

const STEPS = [
  {
    step: 1,
    title: 'Download & Post Property',
    desc: 'Install the HexaHome app, create your account and start listing the property.',
    img: 'https://assets.hexahome.in/static/home/homepage/how-to-list/step-1.webp',
    hasLink: true
  },
  {
    step: 2,
    title: 'Choose Listing Type & Add Property Details',
    desc: 'Fill in key details like location, price, size, amenities, and property type to attract the right buyers/tenants.',
    img: 'https://assets.hexahome.in/static/home/homepage/how-to-list/step-2.webp'
  },
  {
    step: 3,
    title: 'Set Your Contact Preferences',
    desc: 'Choose whether you want your contact details to be Public or Private for easy and secure communication.',
    img: 'https://assets.hexahome.in/static/home/homepage/how-to-list/step-3-img.webp'
  },
  {
    step: 4,
    title: 'Upload Property Photos',
    desc: 'Listings with property photos receive significantly more responses.',
    img: 'https://assets.hexahome.in/static/home/homepage/how-to-list/step-4.webp'
  },
  {
    step: 5,
    title: 'Add Description with Help of AI',
    desc: 'Use AI-powered auto-descriptions to highlight your property’s key features and benefits.',
    img: 'https://assets.hexahome.in/static/home/homepage/how-to-list/step-5.webp'
  },
  {
    step: 6,
    title: 'Publish & Get Verified Leads for Free',
    desc: 'Start receiving inquiries from verified buyers and tenants, with no brokerage fees.',
    img: 'https://assets.hexahome.in/static/home/homepage/how-to-list/step-6.webp'
  }
];

export default function HowToStepGuide({ onOpenPostModal }) {
  return (
    <section className="px-3 xs:px-10 sm:px-20 py-3 xs:py-5 sm:py-9 flex flex-col gap-6">
      <div className="flex flex-col gap-1 sm:items-center text-center">
        <h2 className="text-dark-400 text-lg xs:text-2xl sm:text-[28px] font-semibold sm:font-extrabold">
          How to List Property on HexaHome
        </h2>
        <p className="text-center text-base text-dark-300">
          A simple, seamless, and hassle-free way to find your perfect space or list your property with ease!
        </p>
      </div>
      <div className="w-full grid gap-4 grid-cols-1 md:grid-cols-2">
        {STEPS.map((s) => (
          <div key={s.step} className="flex gap-4 text-dark-400 p-2 rounded-xl bg-white border border-gray-100 hover:shadow-sm transition-shadow">
            <div className="h-full min-w-[114px] flex-shrink-0">
              <img
                src={s.img}
                alt={`step-${s.step}`}
                height="126"
                width="114"
                className="w-full object-cover rounded-lg"
                loading="lazy"
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-bold text-sm text-dark-300">Step {s.step}:</p>
              <div className="flex flex-col gap-1">
                <p className="text-lg font-bold text-dark-400">
                  {s.hasLink ? (
                    <>
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={onOpenPostModal}
                        onKeyDown={(e) => { if (e.key === 'Enter') onOpenPostModal(); }}
                        className="underline text-brand-300 font-bold cursor-pointer"
                      >
                        Download
                      </span>{' '}
                      &amp; Post Property
                    </>
                  ) : (
                    s.title
                  )}
                </p>
                <p className="text-sm text-dark-300 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
