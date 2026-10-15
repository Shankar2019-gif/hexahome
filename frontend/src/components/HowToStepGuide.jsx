import React from 'react';

const STEPS = [
  {
    step: 1,
    title: 'Download & Post Property',
    desc: (
      <>
        Install the <strong className="font-bold text-[#111827]">HexaHome</strong> app, create your account and start listing the property.
      </>
    ),
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
    <section className="how-to-step-section px-3 xs:px-10 sm:px-20 py-3 xs:py-5 sm:py-9 my-3 xs:my-5 sm:my-9 bg-white w-full">
      <div className="how-to-step-container">
        {/* Header Section */}
        <div className="how-to-header">
          <h2 className="how-to-header-title">
            How to List Property on HexaHome
          </h2>
          <p className="how-to-header-subtitle">
            A simple, seamless, and hassle-free way to find your perfect space or list your property with ease!
          </p>
        </div>

        {/* 
          2-Column Responsive Grid matching reference image:
          - Row 1: Step 1 (Left) & Step 2 (Right)
          - Row 2: Step 3 (Left) & Step 4 (Right)
          - Row 3: Step 5 (Left) & Step 6 (Right)
          => Left column: Step 1, Step 3, Step 5
          => Right column: Step 2, Step 4, Step 6
        */}
        <div className="how-to-steps-grid">
          {STEPS.map((s) => (
            <div key={s.step} className="how-to-step-item">
              {/* Illustration Image */}
              <div className="how-to-step-img-wrap">
                <img
                  src={s.img}
                  alt={`step-${s.step}`}
                  width="112"
                  height="112"
                  className="how-to-step-img"
                  loading="lazy"
                />
              </div>

              {/* Text Block */}
              <div className="how-to-step-content">
                <span className="how-to-step-label">
                  Step {s.step}:
                </span>
                <h3 className="how-to-step-heading">
                  {s.hasLink ? (
                    <>
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={onOpenPostModal}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            if (onOpenPostModal) onOpenPostModal();
                          }
                        }}
                        className="how-to-step-link"
                      >
                        Download
                      </span>{' '}
                      &amp; Post Property
                    </>
                  ) : (
                    s.title
                  )}
                </h3>
                <p className="how-to-step-desc">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
