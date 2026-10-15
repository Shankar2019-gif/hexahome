import { useState, useEffect, useCallback } from 'react';
import { adminAuthApi } from '../services/adminApi';
import {
  getAdminToken,
  getAdminUser,
  setAdminSession,
  clearAdminSession,
} from '../services/adminApiClient';

export function useAdminAuth() {
  const [adminUser, setAdminUser] = useState(getAdminUser);
  const [token, setToken] = useState(getAdminToken);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const isAuthenticated = Boolean(token && adminUser);

  const syncAuth = useCallback(() => {
    const activeToken = getAdminToken();
    const activeUser = getAdminUser();
    setToken(activeToken);
    setAdminUser(activeUser);
  }, []);

  useEffect(() => {
    const handleAuthChange = () => {
      syncAuth();
    };

    window.addEventListener('hexahome_admin_auth_changed', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    // Initial session verification if token is present
    const verifySession = async () => {
      const activeToken = getAdminToken();
      if (!activeToken) {
        setIsLoading(false);
        return;
      }
      try {
        const profile = await adminAuthApi.getMe();
        if (profile) {
          setAdminUser(profile);
          // Update cached user profile
          const currentRefresh = localStorage.getItem('hexahome_admin_refresh_token');
          setAdminSession(activeToken, currentRefresh, profile);
        }
      } catch (err) {
        console.warn('Admin session validation failed or token expired:', err.message);
        // Interceptor handles 401 refresh; if that also fails, clearAdminSession is called
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();

    return () => {
      window.removeEventListener('hexahome_admin_auth_changed', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [syncAuth]);

  const login = useCallback(async (username, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminAuthApi.login(username, password);
      setToken(data.accessToken);
      setAdminUser(data.user);
      return data;
    } catch (err) {
      const msg = err.message || 'Login failed';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await adminAuthApi.logout();
    } finally {
      clearAdminSession();
      setToken(null);
      setAdminUser(null);
      setIsLoading(false);
    }
  }, []);

  const hasRole = useCallback(
    (role) => {
      if (!adminUser || !adminUser.role) return false;
      return adminUser.role.toUpperCase() === role.toUpperCase();
    },
    [adminUser]
  );

  const hasAnyRole = useCallback(
    (roles = []) => {
      if (!adminUser || !adminUser.role) return false;
      const userRole = adminUser.role.toUpperCase();
      return roles.map((r) => r.toUpperCase()).includes(userRole);
    },
    [adminUser]
  );

  return {
    adminUser,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    hasRole,
    hasAnyRole,
  };
}

export default useAdminAuth;
