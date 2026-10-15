import React, { useState, useEffect } from 'react';
import { Phone, ArrowUp } from 'lucide-react';
import './FloatingWidgets.css';

export default function FloatingWidgets({ currentPath = '/', onNavigate }) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isCallExpanded, setIsCallExpanded] = useState(false);

  // Monitor scroll position to reveal the left-side Up Arrow
  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down past 220px
      if (window.scrollY > 220) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle clicking the Up Arrow: scroll smoothly to top and navigate home
  const handleScrollToHome = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (currentPath !== '/' && onNavigate) {
      onNavigate('/');
    }
  };

  const phoneNumber = '7382264233';

  return (
    <>
      {/* ========================================================
          1. LEFT SIDE BOTTOM: Floating Up Arrow (Scroll Up to Home)
         ======================================================== */}
      <div className="floating-scroll-widget">
        <button
          type="button"
          onClick={handleScrollToHome}
          className={`floating-scroll-btn ${showScrollTop ? 'visible' : ''}`}
          aria-label="Scroll back to top and go to Home"
          title="Back to Home & Top"
        >
          <ArrowUp size={22} strokeWidth={2.5} />
          <span className="scroll-tooltip">Back to Home</span>
        </button>
      </div>

      {/* ========================================================
          2. RIGHT SIDE BOTTOM: Floating Call Widget (Expands on Hover)
         ======================================================== */}
      <div className="floating-call-widget">
        <a
          href={`tel:${phoneNumber}`}
          className={`floating-call-btn ${isCallExpanded ? 'expanded' : ''}`}
          onMouseEnter={() => setIsCallExpanded(true)}
          onMouseLeave={() => setIsCallExpanded(false)}
          onClick={(e) => {
            // On touch devices, first tap expands, second tap dials
            if ('ontouchstart' in window && !isCallExpanded) {
              e.preventDefault();
              setIsCallExpanded(true);
            }
          }}
          aria-label={`Call HexaHome support at ${phoneNumber}`}
          title={`Call HexaHome: ${phoneNumber}`}
        >
          {/* Animated Ringing Phone Icon */}
          <div className="call-icon-wrap">
            <Phone size={22} strokeWidth={2.4} />
          </div>

          {/* Reveal Cell Number on Hover */}
          <div className="call-text-wrap">
            <span className="call-text-label">Instant Support</span>
            <span className="call-text-number">{phoneNumber}</span>
          </div>
        </a>
      </div>
    </>
  );
}
