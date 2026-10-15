import { useState, useEffect, useCallback } from 'react';

const USER_STORAGE_KEY = 'hexahome_user';
const TOKEN_KEY = 'hexahome_token';
const REFRESH_TOKEN_KEY = 'hexahome_refresh_token';
const AUTH_EVENT = 'hexahome_auth_changed';

function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [currentUser, setCurrentUser] = useState(getStoredUser);

  const syncUser = useCallback(() => {
    setCurrentUser(getStoredUser());
  }, []);

  useEffect(() => {
    window.addEventListener(AUTH_EVENT, syncUser);
    window.addEventListener('storage', syncUser);
    return () => {
      window.removeEventListener(AUTH_EVENT, syncUser);
      window.removeEventListener('storage', syncUser);
    };
  }, [syncUser]);

  const login = useCallback((user) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    }
    window.dispatchEvent(new Event(AUTH_EVENT));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setCurrentUser(null);
    window.dispatchEvent(new Event(AUTH_EVENT));
  }, []);

  return {
    currentUser,
    isAuthenticated: !!currentUser,
    login,
    logout,
  };
}
