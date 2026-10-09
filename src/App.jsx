import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import OurOfferings from './components/OurOfferings';
import ExploreResidential from './components/ExploreResidential';
import FurnishingSection from './components/FurnishingSection';
import PgSection from './components/PgSection';
import ActionBanners from './components/ActionBanners';
import CommercialOfferings from './components/CommercialOfferings';
import PropertiesForRent from './components/PropertiesForRent';
import BhkFilterSection from './components/BhkFilterSection';
import PlotsSection from './components/PlotsSection';
import CommercialPropertiesSale from './components/CommercialPropertiesSale';
import AppDownloadBanner from './components/AppDownloadBanner';
import HotDealProperties from './components/HotDealProperties';
import CoLivingOfferings from './components/CoLivingOfferings';
import ExploreCities from './components/ExploreCities';
import HowToStepGuide from './components/HowToStepGuide';
import FaqSection from './components/FaqSection';
import TestimonialsSection from './components/TestimonialsSection';
import GuidanceBanner from './components/GuidanceBanner';
import Footer from './components/Footer';
import { 
  PostPropertyModal, 
  ContactOwnerModal, 
  LoginModal, 
  AppDownloadModal 
} from './components/Modals';
import { CITIES } from './data/hexahomeData';
import './App.css';

export default function App() {
  const [selectedCity, setSelectedCity] = useState(CITIES[0]); // Noida by default
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [appModalOpen, setAppModalOpen] = useState(false);
  const [contactProperty, setContactProperty] = useState(null);

  const handleSearch = (searchParams) => {
    // Scroll directly to matching listings
    const target = document.getElementById('properties-for-rent');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectOffering = (offering) => {
    if (offering.id === 'pg') {
      const el = document.querySelector('.pg-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (offering.id === 'commercial') {
      const el = document.querySelector('.commercial-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (offering.id === 'plots') {
      const el = document.querySelector('.plots-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      const el = document.getElementById('properties-for-rent');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectBhk = (bhk) => {
    const el = document.getElementById('properties-for-rent');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="app-main-wrapper">
      {/* 1. Global Navigation Header */}
      <Header
        selectedCity={selectedCity}
        onSelectCity={(city) => setSelectedCity(city)}
        onOpenPostModal={() => setPostModalOpen(true)}
        onOpenLoginModal={() => setLoginModalOpen(true)}
        onOpenAppModal={() => setAppModalOpen(true)}
        onSearch={handleSearch}
      />

      <main>
        {/* 2. Hero Banner & Search Console */}
        <Hero
          selectedCity={selectedCity}
          onSearch={handleSearch}
          onOpenPremium={() => setPostModalOpen(true)}
        />

        {/* 3. Our Offerings Horizontal Carousel */}
        <OurOfferings 
          onSelectOffering={handleSelectOffering} 
        />

        {/* 5. Explore Residential Properties */}
        <ExploreResidential 
          onSelectType={() => handleSearch()} 
        />

        {/* 6. Explore by Furnishing Type */}
        <FurnishingSection 
          onSelectFurnishing={() => handleSearch()} 
        />

        {/* 7. PG's in City */}
        <PgSection 
          selectedCity={selectedCity} 
          onSelectPg={() => handleSearch()} 
        />

        {/* 8. Dual Action Banners (Post Property & Assistance) */}
        <ActionBanners
          onOpenPostModal={() => setPostModalOpen(true)}
          onOpenAssistanceModal={() => setPostModalOpen(true)}
        />

        {/* 9. Commercial Offerings */}
        <CommercialOfferings 
          onSelectCommercial={() => handleSearch()} 
        />

        {/* 10. Featured Properties for Rent in City */}
        <PropertiesForRent
          selectedCity={selectedCity}
          onContactOwner={(prop) => setContactProperty(prop)}
          onViewProperty={(prop) => setContactProperty(prop)}
        />

        {/* 11. BHK in Mind Quick Filter */}
        <BhkFilterSection 
          onSelectBhk={handleSelectBhk} 
        />

        {/* 12. Plots in City */}
        <PlotsSection 
          selectedCity={selectedCity} 
          onSelectPlot={() => setPostModalOpen(true)} 
        />

        {/* 13. Commercial Properties for Sale */}
        <CommercialPropertiesSale 
          selectedCity={selectedCity} 
          onSelectCommercialItem={() => setPostModalOpen(true)} 
        />

        {/* 14. Mobile App Download Promo */}
        <AppDownloadBanner 
          onOpenAppModal={() => setAppModalOpen(true)} 
        />

        {/* 15. Hot Deal Properties */}
        <HotDealProperties
          selectedCity={selectedCity}
          onSelectDeal={() => setPostModalOpen(true)}
        />

        {/* 16. Co-Living Offerings */}
        <CoLivingOfferings
          onSelectCoLiving={() => handleSearch()}
        />

        {/* 17. Explore Properties by Cities */}
        <ExploreCities 
          onSelectCity={(city) => {
            setSelectedCity(city);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
        />

        {/* 18. Step-by-Step Listing Guide & Trust Card */}
        <HowToStepGuide 
          onOpenPostModal={() => setPostModalOpen(true)} 
        />

        {/* 19. Frequently Asked Questions (Accordion) */}
        <FaqSection 
          onOpenAssistanceModal={() => setPostModalOpen(true)} 
        />

        {/* 20. Real People, Real Connections (Testimonials) */}
        <TestimonialsSection />

        {/* 21. Guidance & Assistance Banner */}
        <GuidanceBanner />
      </main>

      {/* 19. Comprehensive HexaHome Footer */}
      <Footer
        onOpenPostModal={() => setPostModalOpen(true)}
        onOpenAppModal={() => setAppModalOpen(true)}
      />

      {/* Interactive Modal Dialogs */}
      <PostPropertyModal
        isOpen={postModalOpen}
        onClose={() => setPostModalOpen(false)}
      />

      <ContactOwnerModal
        isOpen={!!contactProperty}
        property={contactProperty}
        onClose={() => setContactProperty(null)}
      />

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />

      <AppDownloadModal
        isOpen={appModalOpen}
        onClose={() => setAppModalOpen(false)}
      />
    </div>
  );
}
