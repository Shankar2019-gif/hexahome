import React from 'react';

const ROW_1_REVIEWS = [
  {
    id: 'neha-sharma',
    text: "HexaHome made my house hunting very simple. No need to deal with brokers or middlemen. Directly talked to the owner and finalized the deal. Very smooth process!",
    image: "https://assets.hexahome.in/static/home/homepage/reviews/review-neha-sharma.webp",
    name: "Neha Sharma",
    city: "Noida"
  },
  {
    id: 'anjali-verma',
    text: "As a student, I needed a budget-friendly PG in Delhi. HexaHome showed me many options with real photos. I found a good place near my college easily. Very helpful for students.",
    image: "https://assets.hexahome.in/static/home/homepage/reviews/review-anjali-sharma.webp",
    name: "Anjali Verma",
    city: "Kochi"
  },
  {
    id: 'suresh-patel',
    text: "I listed my property for sale in Jaipur, and within two weeks, I got genuine buyers. The platform is easy to use, and the customer support is very helpful. Highly recommended!",
    image: "https://assets.hexahome.in/static/home/homepage/reviews/review-suresh-patel.webp",
    name: "Suresh Patel",
    city: "Jaipur"
  },
  {
    id: 'ravi-gupta',
    text: "I wanted to rent out my house in Pune but was worried about tenant verification. HexaHome’s verification process gave me complete peace of mind. Highly recommended",
    image: "https://assets.hexahome.in/static/home/homepage/reviews/review-ravi-gupta.webp",
    name: "Ravi Gupta",
    city: "Pune"
  }
];

const ROW_2_REVIEWS = [
  {
    id: 'neha-gupta',
    text: "I listed my 2BHK for rent in Gurgaon, and within a few days, I got genuine tenant inquiries. The platform is easy to use, and I didn't have to pay any commission to anyone.",
    image: "https://assets.hexahome.in/static/home/homepage/reviews/review-neha-gupta.webp",
    name: "Neha Gupta",
    city: "Gurgaon"
  },
  {
    id: 'vikram-singh',
    text: "Tried many property websites before, but HexaHome is different. The listings are genuine, and I found a rental home in Ahmedabad without any hassle.",
    image: "https://assets.hexahome.in/static/home/homepage/reviews/review-vikram-singh.webp",
    name: "Vikram Singh",
    city: "Ahmedabad"
  },
  {
    id: 'varun-tiwari',
    text: "Buying home in Delhi felt overwhelming, but HexaHome made it stress-free. I found a great property and connected with the owner directly. No unnecessary calls or fake listings!",
    image: "https://assets.hexahome.in/static/home/homepage/reviews/review-varun-tiwari.webp",
    name: "Varun Tiwari",
    city: "Delhi"
  },
  {
    id: 'shruti-bansal',
    text: "As a working professional in Bangalore, finding a PG was tough. HexaHome had many verified options, and I got a place near my office at a reasonable price. Super convenient",
    image: "https://assets.hexahome.in/static/home/homepage/reviews/review-shruti-bansal.webp",
    name: "Shruti Bansal",
    city: "Noida"
  },
  {
    id: 'ramesh-kumar',
    text: "I wanted to rent my 1BHK appartment in Noida, Hexahome helped me connect with tenants directly. No extra charges, no broker tension. Very helpful! Highly recommended!",
    image: "https://assets.hexahome.in/static/home/homepage/reviews/review-ramesh-kumar.webp",
    name: "Ramesh Kumar",
    city: "Noida"
  }
];

function BlueQuoteIcon() {
  return (
    <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="testimonial-quote-icon">
      <path d="M10.739 0v5.087q-2.595.488-4.108 2.16-1.442 1.603-1.442 3.764 0 1.323.36 2.508l-3.17 1.812a12 12 0 0 1-.217-.976 7 7 0 0 1-.072-.975q0-1.255.577-1.951a4.1 4.1 0 0 1 1.585-1.046q.937-.348 1.658-.348 2.235 0 3.676 1.463 1.513 1.464 1.513 3.415 0 2.091-1.513 3.624Q8.144 20 5.91 20q-1.874 0-3.243-1.115Q1.369 17.77.649 16.028q-.65-1.743-.649-3.763 0-1.673.505-3.624.576-1.95 1.801-3.763 1.297-1.881 3.316-3.206Q7.712.35 10.739 0m12.9 0v5.087q-2.594.488-4.107 2.16-1.442 1.603-1.442 3.764 0 1.323.36 2.508l-3.17 1.812a12 12 0 0 1-.217-.976 7 7 0 0 1-.072-.975q0-1.255.649-1.951a4.2 4.2 0 0 1 1.513-1.046q.937-.348 1.658-.348 2.235 0 3.675 1.463Q24 12.962 24 14.913q0 2.091-1.514 3.624Q21.047 20 18.812 20q-1.874 0-3.243-1.115-1.298-1.115-2.018-2.857-.65-1.743-.65-3.763.001-1.673.505-3.624.577-1.95 1.802-3.763 1.297-1.881 3.316-3.206Q20.613.35 23.64 0" fill="#003893"></path>
    </svg>
  );
}

function ReviewCard({ review }) {
  return (
    <div 
      className="testimonial-card"
      style={{ borderRadius: '24px' }}
    >
      <div>
        <BlueQuoteIcon />
        <p className="testimonial-text">
          {review.text}
        </p>
      </div>

      <div className="flex gap-3.5 items-center mt-auto pt-2 text-left">
        <img
          src={review.image}
          alt={review.name}
          className="testimonial-avatar"
          loading="lazy"
        />
        <div>
          <p className="testimonial-author-name">
            {review.name}
          </p>
          <p className="testimonial-author-city">
            {review.city}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const row1Repeated = [...ROW_1_REVIEWS, ...ROW_1_REVIEWS, ...ROW_1_REVIEWS];
  const row2Repeated = [...ROW_2_REVIEWS, ...ROW_2_REVIEWS, ...ROW_2_REVIEWS];

  return (
    <section id="testimonials-section" className="testimonials-container">
      {/* Bold Centered Header */}
      <div className="max-w-4xl mx-auto text-center px-4 mb-8 sm:mb-10">
        <h2 className="testimonials-title">
          Real People, Real Connections
        </h2>
        <p className="testimonials-subtitle">
          Don’t just take our word for it. Hear from real HexaHome users.
        </p>
      </div>

      {/* Row 1 Auto-Sliding Marquee (Left) */}
      <div className="overflow-hidden w-full mb-4 sm:mb-6">
        <div className="animate-marquee-left gap-4 sm:gap-6 px-2">
          {row1Repeated.map((review, idx) => (
            <ReviewCard key={`row1-${idx}`} review={review} />
          ))}
        </div>
      </div>

      {/* Row 2 Auto-Sliding Marquee (Right) */}
      <div className="overflow-hidden w-full">
        <div className="animate-marquee-right gap-4 sm:gap-6 px-2">
          {row2Repeated.map((review, idx) => (
            <ReviewCard key={`row2-${idx}`} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}
