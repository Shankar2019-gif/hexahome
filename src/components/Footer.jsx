import React, { useState } from 'react';

// Data from live HexaHome reference
const POPULAR_LINKS = [
  {
    title: 'Popular Calculators',
    links: [
      { label: 'EMI Calculator', href: '/home-loan-emi-calculator-hmemic/' },
      { label: 'Stamp Duty', href: '/stamp-duty-calculator-hmsd/' },
      { label: 'Loan Eligibility', href: '/home-loan-eligibility-calculator-hmhlec/' },
      { label: 'Capital Gains Tax', href: '/capital-gains-tax-calculator-hmcgtc/' },
      { label: 'Rent Receipt', href: '/rent-receipt-generator-hmrrg/' },
      { label: 'Rent Agreement', href: '/rent-agreement-generator-hmrag/' },
      { label: 'Vastu Score', href: '/vastu-score-calculator-hmvsc/' },
      { label: 'Compare Property Prices', href: '/compare-property-prices-hmcpp/' },
      { label: 'Area Converter', href: '/area-converter-hmac/' },
      { label: 'Down Payment', href: '/down-payment-calculator-hmdpc/' },
      { label: 'Legal Fees', href: '/legal-fees-calculator-hmlfc/' },
      { label: 'Property Registration', href: '/property-registration-charges-calculator-hmprcc/' }
    ]
  },
  {
    title: 'Popular Cities',
    links: [
      { label: 'Delhi', href: '/sale/property-for-sale-in-delhi/' },
      { label: 'Mumbai', href: '/sale/property-for-sale-in-mumbai/' },
      { label: 'Bangalore', href: '/sale/property-for-sale-in-bangalore/' },
      { label: 'Noida', href: '/sale/property-for-sale-in-noida/' },
      { label: 'Gurgaon', href: '/sale/property-for-sale-in-gurgaon/' },
      { label: 'Hyderabad', href: '/sale/property-for-sale-in-hyderabad/' },
      { label: 'Pune', href: '/sale/property-for-sale-in-pune/' },
      { label: 'Chennai', href: '/sale/property-for-sale-in-chennai/' },
      { label: 'Kolkata', href: '/sale/property-for-sale-in-kolkata/' },
      { label: 'Ahmedabad', href: '/sale/property-for-sale-in-ahmedabad/' },
      { label: 'Jaipur', href: '/sale/property-for-sale-in-jaipur/' },
      { label: 'Chandigarh', href: '/sale/property-for-sale-in-chandigarh/' },
      { label: 'Lucknow', href: '/sale/property-for-sale-in-lucknow/' },
      { label: 'Indore', href: '/sale/property-for-sale-in-indore/' },
      { label: 'Kochi', href: '/sale/property-for-sale-in-kochi/' },
      { label: 'Coimbatore', href: '/sale/property-for-sale-in-coimbatore/' },
      { label: 'Bhubaneswar', href: '/sale/property-for-sale-in-bhubaneswar/' },
      { label: 'Patna', href: '/sale/property-for-sale-in-patna/' }
    ]
  },
  {
    title: 'Post Your Property Free',
    links: [
      { label: 'Delhi', href: '/post-property-in-delhi-hmpp/' },
      { label: 'Mumbai', href: '/post-property-in-mumbai-hmpp/' },
      { label: 'Bangalore', href: '/post-property-in-bangalore-hmpp/' },
      { label: 'Noida', href: '/post-property-in-noida-hmpp/' },
      { label: 'Gurgaon', href: '/post-property-in-gurgaon-hmpp/' },
      { label: 'Hyderabad', href: '/post-property-in-hyderabad-hmpp/' },
      { label: 'Pune', href: '/post-property-in-pune-hmpp/' },
      { label: 'Chennai', href: '/post-property-in-chennai-hmpp/' },
      { label: 'Kolkata', href: '/post-property-in-kolkata-hmpp/' },
      { label: 'Ahmedabad', href: '/post-property-in-ahmedabad-hmpp/' },
      { label: 'Jaipur', href: '/post-property-in-jaipur-hmpp/' },
      { label: 'Chandigarh', href: '/post-property-in-chandigarh-hmpp/' },
      { label: 'Lucknow', href: '/post-property-in-lucknow-hmpp/' },
      { label: 'Indore', href: '/post-property-in-indore-hmpp/' },
      { label: 'Kochi', href: '/post-property-in-kochi-hmpp/' },
      { label: 'Coimbatore', href: '/post-property-in-coimbatore-hmpp/' },
      { label: 'Bhubaneswar', href: '/post-property-in-bhubaneswar-hmpp/' },
      { label: 'Patna', href: '/post-property-in-patna-hmpp/' }
    ]
  },
  {
    title: 'Browse by Category',
    links: [
      { label: 'Flats for Sale', href: '/sale/' },
      { label: 'Flats for Rent', href: '/rent/' },
      { label: 'PG & Hostels', href: '/pg/' },
      { label: 'Plots & Land', href: '/plot/' },
      { label: 'Co-Living', href: '/roommates/' }
    ]
  }
];

const RIGHT_COLUMNS = [
  {
    title: 'Our Company',
    links: [
      { label: 'About us', href: '/help/about/' },
      { label: 'Feedback', href: '/account/feedback/' },
      { label: 'Careers with us', href: '/jobs-at-hexadecimal-software/' },
      { label: 'Support', href: '/help/support/' },
      { label: 'Privacy Policy', href: '/help/privacy-policy/' },
      { label: 'Terms & Conditions', href: '/help/terms-and-conditions/' },
      { label: "FAQ's", href: '/help/faq/' },
      { label: 'Report a problem', href: '/account/feedback/' }
    ]
  },
  {
    title: 'Quick Links',
    links: [
      { label: 'Blog', href: 'https://www.hexahome.in/blog/?utm_source=hexahome&utm_medium=web' },
      { label: 'Area Converter', href: '/area-converter-hmac/' },
      { label: 'EMI Calculator', href: '/home-loan-emi-calculator-hmemic/' },
      { label: 'Vastu Score', href: '/vastu-score-calculator-hmvsc/' },
      { label: 'Rent Agreement', href: '/rent-agreement-generator-hmrag/' },
      { label: 'Packers and Movers', href: '/packers-and-movers/noida/' },
      { label: 'Compare Plans', href: '/list-property-for-free-rent-buy-pg-coliving/' },
      { label: 'Safety Guide', href: '/help/safety-guide/' }
    ]
  },
  {
    title: 'Premium Plan',
    links: [
      { label: 'Agent Plans', href: '/plans/agent/' },
      { label: 'Seller Plans', href: '/plans/seller/' },
      { label: 'Landlord Plans', href: '/plans/landlord/' },
      { label: 'PG Owner Plans', href: '/plans/pg_owner/' },
      { label: 'Buyer Plans', href: '/plans/buyer/' },
      { label: 'Tenant Plans', href: '/plans/tenant/' },
      { label: 'Pg Seeker Plans', href: '/plans/pg_seeker/' },
      { label: 'Co Living Plans', href: '/plans/co_living/' }
    ]
  }
];

export default function Footer({ onOpenPostModal, onOpenAppModal }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [openAccordion, setOpenAccordion] = useState(null);

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const handleSendConsultation = (e) => {
    e.preventDefault();
    if (phoneNumber) {
      alert('Thank you! We have received your consultation request.');
      setPhoneNumber('');
    }
  };

  // Combine categories for mobile accordion: 3 from right cols + 4 from popular links
  const mobileAccordionItems = [
    ...RIGHT_COLUMNS,
    ...POPULAR_LINKS
  ];

  return (
    <footer className="footer-root">
      {/* 1. TOP SECTION: Popular HexaHome Links (Hidden on mobile < 640px) */}
      <section className="popular-links-section" aria-label="Popular HexaHome links">
        <div className="popular-links-grid">
          {POPULAR_LINKS.map((col, idx) => (
            <div key={idx} className="popular-col">
              <h3 className="popular-col-heading">{col.title}</h3>
              <div className="popular-pills-wrap">
                {col.links.map((link, lIdx) => (
                  <a key={lIdx} href={link.href} className="popular-pill">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. SPLIT SECTION: 35% Left (Brand & Contact) + 65% Right (Links & Apps) */}
      <div className="footer-main-split">
        {/* Left Section (35%) */}
        <section className="footer-left-col">
          <div className="footer-left-content">
            {/* HexaHome White Vector Logo */}
            <div className="footer-logo-wrap">
              <svg 
                viewBox="0 0 130 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg" 
                className="footer-logo-svg"
              >
                <path 
                  fillRule="evenodd" 
                  clipRule="evenodd" 
                  d="M.662 9.594a4.76 4.76 0 0 0-.014 4.82l4.216 7.232A4.74 4.74 0 0 0 8.955 24h9.028c1.176 0 2.29-.437 3.145-1.198l-2.82-2.81a9.16 9.16 0 0 1-4.92 1.432c-5.085 0-9.198-4.1-9.198-9.168S8.303 3.09 13.388 3.09s9.198 4.1 9.198 9.167a9.1 9.1 0 0 1-1.894 5.544l2.302 2.289 3.345-5.663a4.76 4.76 0 0 0-.004-4.85L22.04 2.325A4.74 4.74 0 0 0 17.965 0H9.028a4.74 4.74 0 0 0-4.077 2.33zm12.726-4.348c3.895 0 7.033 3.128 7.033 7.01 0 3.883-3.138 7.01-7.033 7.01s-7.034-3.127-7.034-7.01 3.139-7.01 7.034-7.01m4.143 7.44c.296 0 .555-.196.66-.498a.8.8 0 0 0-.187-.838l-3.697-3.801a1.11 1.11 0 0 0-1.614 0l-3.688 3.792a.8.8 0 0 0-.196.847c.105.302.364.497.66.497h.242v3.772c0 .19.141.343.316.343h1.894v-2.4c0-.945.709-1.715 1.58-1.715.87 0 1.578.77 1.578 1.715v2.4h1.895c.174 0 .315-.154.315-.343v-3.772z" 
                  fill="#fff" 
                />
                <path 
                  d="M38.4 4h4v14h-4v-5.16H35V18h-4V4h4v4.96h3.4zm9.098 10.26q.48 1 2.04 1 .92 0 1.7-.64l2.42 2.04q-1.5 1.62-4.24 1.62-2.56 0-4.12-1.48-1.54-1.5-1.54-3.76 0-2.28 1.5-3.8 1.52-1.52 3.82-1.52 2.28 0 3.74 1.5 1.48 1.48 1.48 3.74 0 .66-.16 1.3zm-.06-2.38h3.36q-.339-1.2-1.62-1.2-1.299 0-1.74 1.2M65.48 18h-4.1l-1.6-2.24L58.18 18h-4.1l3.66-5.12L54.24 8h4.1l1.44 2.02L61.22 8h4.1l-3.48 4.88zm6.924-10h3.7v10h-3.7v-.9q-.96 1.18-2.68 1.18-2.02 0-3.3-1.5-1.28-1.5-1.28-3.78 0-2.28 1.28-3.78t3.3-1.5q1.72 0 2.68 1.18zm-3.08 6.34q.5 0 1-.54.5-.54.5-1.34 0-.8-.5-1.34-.5-.54-1-.54t-1 .54q-.5.54-.5 1.34 0 .8.5 1.34.5.54 1 .54M85.3 4h4v14h-4v-5.16H81.9V18h-4V4h4v4.96H85.3zm10.74 14.28q-2.24 0-3.82-1.52-1.56-1.52-1.56-3.76 0-2.24 1.56-3.76 1.58-1.52 3.82-1.52 2.24 0 3.82 1.52t1.58 3.76q0 2.24-1.58 3.76t-3.82 1.52m-1.22-4q.48.48 1.22.48.74 0 1.2-.48.48-.5.48-1.28 0-.78-.48-1.26-.46-.5-1.2-.5-.74 0-1.22.5-.46.48-.46 1.26 0 .78.46 1.28m19.564-6.56q1.74 0 2.72 1.1 1 1.08 1 3.1V18h-3.7v-5.58q0-1.14-1.02-1.14-1.18 0-1.18 1.48V18h-3.7v-5.58q0-1.14-1.02-1.14-1.18 0-1.18 1.48V18h-3.7V8h3.7v.94q.98-1.22 2.72-1.22 1.72 0 2.5 1.24 1.08-1.24 2.88-1.24m8.452 6.54q.48 1 2.04 1 .92 0 1.7-.64l2.42 2.04q-1.5 1.62-4.24 1.62-2.56 0-4.12-1.48-1.54-1.5-1.54-3.76 0-2.28 1.5-3.8 1.52-1.52 3.82-1.52 2.28 0 3.74 1.5 1.48 1.48 1.48 3.74 0 .66-.16 1.3zm-.06-2.38h3.36q-.34-1.2-1.62-1.2-1.3 0-1.74 1.2" 
                  fill="#fff" 
                />
              </svg>
            </div>

            {/* Desktop Prohibited Usage Disclaimer */}
            <p className="footer-desktop-disclaimer">
              Usage of HexaHome.in uploading content with non-standard area units or targeting by religion, community, caste, or race is strictly prohibited. Report misuse at [<a href="/account/feedback/" className="underline-link">Report Abuse</a>].
            </p>

            {/* Mobile Accordion Dropdowns (< 640px) */}
            <div className="footer-mobile-accordions">
              <div className="accordion-divider-top" />
              {mobileAccordionItems.map((item, idx) => {
                const isOpen = openAccordion === idx;
                return (
                  <div key={idx} className="accordion-item">
                    <button 
                      type="button" 
                      className="accordion-trigger" 
                      onClick={() => toggleAccordion(idx)}
                      aria-expanded={isOpen}
                    >
                      <span className="accordion-label">{item.title}</span>
                      <span className={`accordion-chevron ${isOpen ? 'rotated' : ''}`}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="m9 18 6-6-6-6" stroke="#fefefe" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </button>
                    {isOpen && (
                      <div className="accordion-content">
                        <ul className="accordion-links-list">
                          {item.links.map((link, lIdx) => (
                            <li key={lIdx}>
                              <a href={link.href}>{link.label}</a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="accordion-divider" />
                  </div>
                );
              })}
            </div>

            {/* Contact Inquiries Block */}
            <div className="contact-inquiries-block">
              <p className="contact-heading">Contact Inquiries</p>
              
              <div className="contact-lines-wrap">
                <div className="contact-line-item">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="contact-icon">
                    <path d="M10 10.83a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" stroke="#fff" strokeWidth="1.667" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10 18.33c3.334-3.333 6.667-6.317 6.667-10a6.667 6.667 0 0 0-13.333 0c0 3.683 3.333 6.667 6.667 10" stroke="#fff" strokeWidth="1.667" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Corporate Park, Tower-A1, Sector 142, Noida, <span className="nowrap">Uttar Pradesh</span> 201305</span>
                </div>

                <a href="mailto:support@hexadecimalsoftware.com" title="Send us an email" className="contact-line-item contact-link">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="contact-icon">
                    <path d="m17.916 15.003-5.536-5m-4.762 0-5.535 5m-.417-9.167 6.804 4.763c.551.386.827.578 1.126.653.265.066.542.066.806 0 .3-.075.576-.268 1.127-.653l6.804-4.763M5.666 16.669h8.667c1.4 0 2.1 0 2.635-.272a2.5 2.5 0 0 0 1.092-1.093c.273-.534.273-1.235.273-2.635V7.336c0-1.4 0-2.1-.273-2.635a2.5 2.5 0 0 0-1.092-1.093c-.535-.272-1.235-.272-2.635-.272H5.666c-1.4 0-2.1 0-2.635.272a2.5 2.5 0 0 0-1.093 1.093c-.272.535-.272 1.235-.272 2.635v5.333c0 1.4 0 2.1.272 2.635a2.5 2.5 0 0 0 1.093 1.093c.535.272 1.235.272 2.635.272" stroke="#fff" strokeWidth="1.667" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>support@hexadecimalsoftware.com</span>
                </a>

                <a href="tel:+919311214726" className="contact-line-item contact-link">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="contact-icon">
                    <path d="M6.984 7.374c.58 1.208 1.37 2.34 2.372 3.341a12.2 12.2 0 0 0 3.341 2.372c.104.05.156.075.222.094.233.069.52.02.718-.122.056-.04.103-.088.199-.183.29-.291.437-.437.583-.532a1.67 1.67 0 0 1 1.817 0c.146.095.292.24.584.532l.162.163c.443.442.664.664.785.902a1.67 1.67 0 0 1 0 1.504c-.12.238-.342.46-.785.902l-.131.132c-.442.441-.662.662-.962.83-.333.187-.85.322-1.232.32-.344 0-.58-.067-1.05-.2a15.87 15.87 0 0 1-6.903-4.062 15.87 15.87 0 0 1-4.061-6.903c-.134-.47-.2-.706-.202-1.05a2.8 2.8 0 0 1 .32-1.232c.17-.3.39-.52.831-.962l.132-.131c.443-.443.664-.664.902-.785a1.67 1.67 0 0 1 1.504 0c.238.12.46.342.902.785l.163.162c.291.292.437.437.532.584.36.552.36 1.264 0 1.817-.095.146-.24.292-.532.583a2 2 0 0 0-.183.199.87.87 0 0 0-.122.718c.019.066.044.118.094.222" stroke="#fff" strokeWidth="1.667" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>+91 93112 14726</span>
                </a>
              </div>

              {/* Social Icons with Exact White Circular Badges */}
              <div className="social-badges-row">
                {/* Facebook */}
                <a target="_blank" rel="noreferrer" aria-label="HexaHome on Facebook" href="https://www.facebook.com/hexahome.in" className="social-badge-link">
                  <div className="social-badge-circle">
                    <svg width="20" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 .08A7.92 7.92 0 0 0 .08 8c0 3.97 2.925 7.25 6.736 7.822V10.1h-1.96V8.017h1.96V6.632c0-2.293 1.118-3.3 3.024-3.3.913 0 1.396.067 1.624.098v1.818h-1.3c-.81 0-1.092.767-1.092 1.631v1.138h2.372l-.322 2.082h-2.05v5.74c3.866-.524 6.848-3.83 6.848-7.839A7.92 7.92 0 0 0 8 .08Z" fill="#000" />
                    </svg>
                  </div>
                </a>

                {/* Instagram */}
                <a target="_blank" rel="noreferrer" aria-label="HexaHome on Instagram" href="https://www.instagram.com/hexahome_india?igsh=aDhtMG02YWI1ZTU1" className="social-badge-link">
                  <div className="social-badge-circle">
                    <svg width="20" height="23" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 .25A3.754 3.754 0 0 0 .25 4v6A3.754 3.754 0 0 0 4 13.75h6A3.754 3.754 0 0 0 13.75 10V4A3.754 3.754 0 0 0 10 .25H4Zm0 1.5h6c1.24 0 2.25 1.01 2.25 2.25v6c0 1.24-1.01 2.25-2.25 2.25H4c-1.24 0-2.25-1.01-2.25-2.25V4c0-1.24 1.01-2.25 2.25-2.25Zm6.75.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM7 3.25A3.754 3.754 0 0 0 3.25 7 3.754 3.754 0 0 0 7 10.75 3.754 3.754 0 0 0 10.75 7 3.754 3.754 0 0 0 7 3.25Zm0 1.5c1.24 0 2.25 1.01 2.25 2.25S8.24 9.25 7 9.25 4.75 8.24 4.75 7 5.76 4.75 7 4.75Z" fill="#000" />
                    </svg>
                  </div>
                </a>

                {/* X Twitter */}
                <a target="_blank" rel="noreferrer" aria-label="HexaHome on X" href="https://x.com/hexahome_india" className="social-badge-link">
                  <div className="social-badge-circle social-x-circle">
                    <svg width="19" height="22" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="m.15.25 5.152 7.364L.051 13.75h1.985L6.19 8.882l3.406 4.868h4.432L8.63 6.023 13.558.25h-1.954L7.747 4.757 4.6.25H.15Z" fill="#000" />
                    </svg>
                  </div>
                </a>

                {/* LinkedIn */}
                <a target="_blank" rel="noreferrer" aria-label="HexaHome on LinkedIn" href="https://in.linkedin.com/company/hexadecimal-software" className="social-badge-link">
                  <div className="social-badge-circle">
                    <svg width="19" height="23" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.4 14h-3V5h3v9ZM1.901 3.8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm12.3 10.2h-2.885V9.62c0-1.044-.02-2.387-1.5-2.387-1.501 0-1.732 1.137-1.732 2.312v4.456H5.2V4.994H7.97v1.23h.039c.385-.707 1.326-1.454 2.73-1.454 2.922 0 3.462 1.866 3.462 4.291v4.94Z" fill="#000" />
                    </svg>
                  </div>
                </a>
              </div>

              {/* Consultation Divider */}
              <div className="consultation-divider" />

              {/* Free Consultation Form (Desktop) */}
              <form onSubmit={handleSendConsultation} className="consultation-form-wrap">
                <div className="consultation-header">
                  <p className="consultation-title">Connect with Us</p>
                  <p className="consultation-subtitle">Get a free consultation. just leave a request below</p>
                </div>
                <div className="consultation-input-row">
                  <input 
                    type="tel" 
                    placeholder="Your Phone Number" 
                    pattern="\d{10}"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="consultation-phone-input"
                    required
                  />
                  <button type="submit" className="consultation-send-btn" title="Send request">
                    <span>Send</span>
                    <svg width="16" height="16" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.25 8H3.667m-.071.243L1.65 14.056c-.153.456-.23.684-.174.825.047.122.15.215.276.25.145.04.365-.058.804-.256l13.926-6.267c.429-.193.643-.29.71-.423a.42.42 0 0 0 0-.37c-.067-.133-.281-.23-.71-.423L2.552 1.123c-.44-.197-.659-.295-.804-.255a.42.42 0 0 0-.276.25c-.055.14-.022.368.174.825l1.946 5.813Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Right Section (65%) */}
        <section className="footer-right-col">
          {/* 3 Columns Desktop Grid */}
          <div className="right-columns-grid">
            {RIGHT_COLUMNS.map((col, idx) => (
              <div key={idx} className="right-col-item">
                <h3 className="right-col-heading">{col.title}</h3>
                <div className="right-col-links-wrap">
                  <ul className="right-links-list">
                    {col.links.map((link, lIdx) => (
                      <li key={lIdx}>
                        <a href={link.href} target="_blank" rel="noreferrer">
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* App Download Strip */}
          <div className="app-download-strip">
            <div className="app-download-left">
              <p className="app-download-heading">
                <span className="desktop-app-title">Available on iOS &amp; Android</span>
                <span className="mobile-app-title">Download HexaHome App now for Free</span>
              </p>
              <div className="app-badges-row">
                <a target="_blank" rel="noreferrer" href="https://play.google.com/store/apps/details?id=com.hexahome">
                  <img 
                    src="/play-store-white.webp" 
                    alt="download-playstore" 
                    title="download-via-playstore" 
                    className="app-badge-img"
                    loading="lazy" 
                  />
                </a>
                <a target="_blank" rel="noreferrer" href="https://apps.apple.com/in/app/hexahome-buy-rent-sell-pg/id6451411101">
                  <img 
                    src="/app-store-white.webp" 
                    alt="download-ios" 
                    title="download-via-appstore" 
                    className="app-badge-img"
                    loading="lazy" 
                  />
                </a>
              </div>
            </div>

            {/* QR Code Block (Hidden on mobile < 640px) */}
            <div className="qr-download-wrap">
              <div className="qr-code-box">
                <img 
                  src="/download-app-qr.webp" 
                  alt="Scan QR code to download HexaHome real estate app" 
                  title="Download HexaHome app via QR code" 
                  className="qr-code-img"
                  loading="lazy" 
                />
              </div>
              <p className="qr-download-text">
                Scan to<br /> Download our<br /> App
              </p>
            </div>
          </div>

          {/* Mobile Disclaimer Text */}
          <p className="footer-mobile-disclaimer">
            Usage of HexaHome.in uploading content with non-standard area units or targeting by religion, community, caste, or race is strictly prohibited. Report misuse at [<a href="/account/feedback/" className="underline-link">Report Abuse</a>].
          </p>

          {/* Centered Absolute Copyright Notice */}
          <p className="footer-copyright-text">
            All rights reserved - &copy; {new Date().getFullYear()} <a href="https://www.hexadecimalsoftware.com/" target="_blank" rel="noreferrer" className="copyright-company-link">Hexadecimal Software Pvt Ltd</a>
          </p>
        </section>
      </div>
    </footer>
  );
}
