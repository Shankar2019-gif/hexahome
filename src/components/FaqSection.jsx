import React, { useState } from 'react';
import { FAQS } from '../data/hexahomeData';

function PlusCircleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
      <circle cx="12" cy="12" r="9.5" stroke="#0f172a" strokeWidth="1.75" />
      <path d="M12 8v8M8 12h8" stroke="#0f172a" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function MinusCircleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
      <circle cx="12" cy="12" r="9.5" stroke="#0f172a" strokeWidth="1.75" />
      <path d="M8 12h8" stroke="#0f172a" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export default function FaqSection() {
  const [openId, setOpenId] = useState(null);

  const toggleFaq = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq-section" className="faq-section">
      <div className="faq-container">
        {/* Left-Aligned Header Matching Reference Image */}
        <div className="faq-header">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <p className="faq-subtitle">
            Find quick answers to common questions. Contact us for further assistance.
          </p>
        </div>

        {/* 12 FAQ Accordion List */}
        <div className="faq-list">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div 
                key={faq.id} 
                className={`faq-card ${isOpen ? 'faq-card-open' : ''}`}
              >
                <button
                  type="button"
                  className="faq-card-btn"
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                >
                  <span className="faq-card-question">
                    {faq.id}. {faq.question}
                  </span>
                  {isOpen ? <MinusCircleIcon /> : <PlusCircleIcon />}
                </button>

                {isOpen && (
                  <div className="faq-card-answer-wrap animate-fade-in">
                    <p className="faq-card-answer">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
