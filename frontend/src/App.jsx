import React, { useState } from 'react';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import PostPropertyPage from './pages/PostPropertyPage';
import PropertySearchPage from './pages/PropertySearchPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import ContactOwnerModal from './components/property/ContactOwnerModal';
import AdminApp from './pages/admin/AdminApp';
import UserDashboard from './pages/dashboard/UserDashboard';
import {
  PostPropertyModal,
  LoginModal,
  AppDownloadModal,
} from './components/Modals';
import FloatingWidgets from './components/FloatingWidgets';
import { useAuth } from './hooks/useAuth';
import { useRouter } from './hooks/useRouter';
import { CITIES } from './data/hexahomeData';
import './App.css';

export default function App() {
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [activeModal, setActiveModal] = useState(null);
  const [contactProperty, setContactProperty] = useState(null);

  const { currentPath, navigate } = useRouter();
  const { currentUser, login, logout } = useAuth();

  const handleLoginSuccess = (user) => {
    login(user);
    navigate('/');
  };

  if (currentPath.startsWith('/admin')) {
    return (
      <AdminApp
        key={currentPath}
        currentPath={currentPath}
        onNavigate={navigate}
      />
    );
  }

  const renderCustomerContent = () => {
    if (currentPath.startsWith('/auth')) {
      return (
        <AuthPage
          key={currentPath}
          currentPath={currentPath}
          onNavigate={navigate}
          onLoginSuccess={handleLoginSuccess}
        />
      );
    }

    if (currentPath.startsWith('/dashboard')) {
      return (
        <UserDashboard
          key={currentPath}
          onNavigate={navigate}
          currentUser={currentUser}
          onLogout={logout}
        />
      );
    }

    if (currentPath.startsWith('/post-property')) {
      return (
        <PostPropertyPage
          key={currentPath}
          onNavigate={navigate}
          currentUser={currentUser}
          onLogout={logout}
        />
      );
    }

    // Single Property Detail view: /properties/:slugOrId or /property/:slugOrId
    const detailMatch = currentPath.match(/^\/(?:properties|property)\/([^?#]+)/);
    if (detailMatch) {
      const slugOrId = detailMatch[1];
      return (
        <PropertyDetailPage
          key={slugOrId}
          propertyIdOrSlug={slugOrId}
          onNavigate={navigate}
          currentUser={currentUser}
          onLogout={logout}
        />
      );
    }

    // Property Catalog & Search view: /search or /properties
    if (currentPath.startsWith('/search') || currentPath === '/properties' || currentPath === '/properties/') {
      return (
        <>
          <PropertySearchPage
            key={currentPath}
            onNavigate={navigate}
            currentUser={currentUser}
            onSelectProperty={setContactProperty}
          />
          <ContactOwnerModal
            isOpen={!!contactProperty}
            property={contactProperty}
            currentUser={currentUser}
            onClose={() => setContactProperty(null)}
            onNavigate={navigate}
          />
        </>
      );
    }

    return (
      <>
        <HomePage
          selectedCity={selectedCity}
          onSelectCity={setSelectedCity}
          currentUser={currentUser}
          onLogout={logout}
          onNavigate={navigate}
          onOpenPostModal={() => setActiveModal('post')}
          onOpenAppModal={() => setActiveModal('app')}
          onOpenLoginModal={() => navigate('/auth')}
          onSelectProperty={setContactProperty}
        />

        <PostPropertyModal
          isOpen={activeModal === 'post'}
          onClose={() => setActiveModal(null)}
        />

        <ContactOwnerModal
          isOpen={!!contactProperty}
          property={contactProperty}
          onClose={() => setContactProperty(null)}
        />

        <LoginModal
          isOpen={activeModal === 'login'}
          onClose={() => setActiveModal(null)}
        />

        <AppDownloadModal
          isOpen={activeModal === 'app'}
          onClose={() => setActiveModal(null)}
        />
      </>
    );
  };

  return (
    <>
      {renderCustomerContent()}
      <FloatingWidgets currentPath={currentPath} onNavigate={navigate} />
    </>
  );
}
