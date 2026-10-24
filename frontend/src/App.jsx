import React, { useState, lazy, Suspense } from 'react';
import HomePage from './pages/HomePage';
import ContactOwnerModal from './components/property/ContactOwnerModal';
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

// Lazy-loaded pages to reduce initial bundle size
const AdminApp = lazy(() => import('./pages/admin/AdminApp'));
const UserDashboard = lazy(() => import('./pages/dashboard/UserDashboard'));
const PostPropertyPage = lazy(() => import('./pages/PostPropertyPage'));
const PropertySearchPage = lazy(() => import('./pages/PropertySearchPage'));
const PropertyDetailPage = lazy(() => import('./pages/PropertyDetailPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));

function PageLoader() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: '16px',
        color: '#02225e',
      }}
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          border: '3px solid #e2e8f0',
          borderTopColor: '#0284c7',
          borderRadius: '50%',
          animation: 'pageSpin 0.8s linear infinite',
        }}
      />
      <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}>Loading...</span>
      <style>{`
        @keyframes pageSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

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
      <Suspense fallback={<PageLoader />}>
        <AdminApp
          key={currentPath}
          currentPath={currentPath}
          onNavigate={navigate}
        />
      </Suspense>
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
      <Suspense fallback={<PageLoader />}>
        {renderCustomerContent()}
      </Suspense>
      <FloatingWidgets currentPath={currentPath} onNavigate={navigate} />
    </>
  );
}
