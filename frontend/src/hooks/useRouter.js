import { useState, useEffect, useCallback } from 'react';

function getInitialPath() {
  return (window.location.pathname + window.location.search) || '/';
}

export function useRouter() {
  const [currentPath, setCurrentPath] = useState(getInitialPath);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(getInitialPath());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((path, { scroll = true } = {}) => {
    const current = window.location.pathname + window.location.search;
    if (current !== path) {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
    if (scroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return {
    currentPath,
    navigate,
  };
}
