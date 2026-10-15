import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import OurOfferings from '../components/OurOfferings';
import ExploreResidential from '../components/ExploreResidential';
import FurnishingSection from '../components/FurnishingSection';
import PgSection from '../components/PgSection';
import ActionBanners from '../components/ActionBanners';
import CommercialOfferings from '../components/CommercialOfferings';
import PropertiesForRent from '../components/PropertiesForRent';
import BhkFilterSection from '../components/BhkFilterSection';
import PlotsSection from '../components/PlotsSection';
import CommercialPropertiesSale from '../components/CommercialPropertiesSale';
import AppDownloadBanner from '../components/AppDownloadBanner';
import HotDealProperties from '../components/HotDealProperties';
import CoLivingOfferings from '../components/CoLivingOfferings';
import ExploreCities from '../components/ExploreCities';
import HowToStepGuide from '../components/HowToStepGuide';
import FaqSection from '../components/FaqSection';
import TestimonialsSection from '../components/TestimonialsSection';
import GuidanceBanner from '../components/GuidanceBanner';
import Footer from '../components/Footer';

export default function HomePage({
  selectedCity,
  onSelectCity,
  currentUser,
  onLogout,
  onNavigate,
  onOpenPostModal,
  onOpenAppModal,
  onOpenLoginModal,
  onSelectProperty,
}) {
  const scrollTo = (selector) => {
    const el = selector.startsWith('#')
      ? document.getElementById(selector.slice(1))
      : document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSearch = (searchData) => {
    if (onNavigate) {
      const params = new URLSearchParams();
      if (searchData?.category) params.set('category', searchData.category.toUpperCase());
      if (searchData?.location) params.set('locality', searchData.location);
      if (searchData?.furnishing) params.set('furnishing', searchData.furnishing.toUpperCase());
      if (searchData?.type) params.set('bhk', searchData.type);
      if (selectedCity?.slug || selectedCity?.name) {
        params.set('city', (selectedCity.slug || selectedCity.name).toLowerCase());
      }
      onNavigate(`/search${params.toString() ? '?' + params.toString() : ''}`);
    } else {
      scrollTo('#properties-for-rent');
    }
  };

  const handleSelectOffering = (offering) => {
    if (onNavigate) {
      const catMap = {
        rent: 'RENT',
        buy: 'BUY',
        pg: 'PG',
        commercial: 'COMMERCIAL',
        plots: 'BUY',
        coliving: 'PG',
      };
      const cat = catMap[offering?.id] || 'RENT';
      onNavigate(`/search?category=${cat}`);
    } else {
      const targets = {
        pg: '.pg-section',
        commercial: '.commercial-section',
        plots: '.plots-section',
      };
      scrollTo(targets[offering.id] || '#properties-for-rent');
    }
  };

  return (
    <div className="app-main-wrapper">
      <Header
        selectedCity={selectedCity}
        onSelectCity={onSelectCity}
        onOpenPostModal={onOpenPostModal}
        onOpenLoginModal={onOpenLoginModal}
        onOpenAppModal={onOpenAppModal}
        onSearch={handleSearch}
        onNavigate={onNavigate}
        currentUser={currentUser}
        onLogout={onLogout}
      />

      <main>
        <Hero
          selectedCity={selectedCity}
          onSearch={handleSearch}
          onOpenPremium={onOpenPostModal}
        />

        <OurOfferings onSelectOffering={handleSelectOffering} />

        <ExploreResidential onSelectType={handleSearch} />

        <FurnishingSection onSelectFurnishing={handleSearch} />

        <PgSection selectedCity={selectedCity} onSelectPg={handleSearch} />

        <ActionBanners
          onOpenPostModal={() => onNavigate('/post-property')}
          onOpenAssistanceModal={onOpenPostModal}
        />

        <CommercialOfferings onSelectCommercial={handleSearch} />

        <PropertiesForRent
          selectedCity={selectedCity}
          onContactOwner={onSelectProperty}
          onViewProperty={onSelectProperty}
        />

        <BhkFilterSection onSelectBhk={() => scrollTo('#properties-for-rent')} />

        <PlotsSection
          selectedCity={selectedCity}
          onSelectPlot={() => onNavigate('/post-property')}
        />

        <CommercialPropertiesSale
          selectedCity={selectedCity}
          onSelectCommercialItem={() => onNavigate('/post-property')}
        />

        <AppDownloadBanner onOpenAppModal={onOpenAppModal} />

        <HotDealProperties
          selectedCity={selectedCity}
          onSelectDeal={() => onSelectProperty({
            id: 'hot-deal-1',
            title: `Hot Deal: 3 BHK Apartment in ${selectedCity.name}`,
            price: 24000,
            locality: 'Sector 76',
            city: selectedCity.name,
          })}
        />

        <CoLivingOfferings onSelectCoLiving={handleSearch} />

        <ExploreCities
          onSelectCity={(city) => {
            onSelectCity(city);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        <HowToStepGuide onOpenPostModal={() => onNavigate('/post-property')} />

        <FaqSection onOpenAssistanceModal={onOpenPostModal} />

        <TestimonialsSection />

        <GuidanceBanner />
      </main>

      <Footer
        onOpenPostModal={() => onNavigate('/post-property')}
        onOpenAppModal={onOpenAppModal}
      />
    </div>
  );
}
