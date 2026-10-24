import axios from 'axios';

// ============================================================================
// HexaHome Admin Axios Client
// Dedicated API client for Administrative Platform Operations
// Base URL: /api/admin
// Isolation: Uses hexahome_admin_* storage keys to prevent customer session clash
// Features:
// 1. Automatic Bearer JWT Injection
// 2. Silent Refresh Token Rotation (/api/admin/auth/refresh)
// 3. Concurrency Queuing during refresh
// 4. Standard ApiResponse data unwrapping
// ============================================================================

const ADMIN_API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api/admin`
  : '/api/admin';

export const ADMIN_TOKEN_KEY = 'hexahome_admin_token';
export const ADMIN_REFRESH_TOKEN_KEY = 'hexahome_admin_refresh_token';
export const ADMIN_USER_KEY = 'hexahome_admin_user';

export const getAdminToken = () => localStorage.getItem(ADMIN_TOKEN_KEY);
export const getAdminRefreshToken = () => localStorage.getItem(ADMIN_REFRESH_TOKEN_KEY);
export const getAdminUser = () => {
  try {
    const raw = localStorage.getItem(ADMIN_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Failed to parse cached admin user:', e);
    return null;
  }
};

export const setAdminSession = (token, refreshToken, user) => {
  if (token) localStorage.setItem(ADMIN_TOKEN_KEY, token);
  if (refreshToken) localStorage.setItem(ADMIN_REFRESH_TOKEN_KEY, refreshToken);
  if (user) localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
  adminApiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  window.dispatchEvent(new Event('hexahome_admin_auth_changed'));
};

export const clearAdminSession = () => {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_REFRESH_TOKEN_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
  delete adminApiClient.defaults.headers.common['Authorization'];
  window.dispatchEvent(new Event('hexahome_admin_auth_changed'));
};

export const adminApiClient = axios.create({
  baseURL: ADMIN_API_BASE,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ----------------------------------------------------------------------------
// Request Interceptor: Attach Admin JWT
// ----------------------------------------------------------------------------
adminApiClient.interceptors.request.use(
  (config) => {
    const token = getAdminToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ----------------------------------------------------------------------------
// Response Interceptor: Unwrap ApiResponse and handle 401 Silent Refresh
// ----------------------------------------------------------------------------
adminApiClient.interceptors.response.use(
  (response) => {
    // If response is raw binary/blob (e.g. CSV export)
    if (response.config?.responseType === 'blob' || response.config?.responseType === 'arraybuffer') {
      return response;
    }
    const data = response.data;
    if (data && typeof data === 'object' && 'data' in data) {
      return data.data;
    }
    return data;
  },
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      console.error('[Admin Network Error]: Connection failed or backend unreachable', error.message);
      return Promise.reject(new Error(error.message || 'Admin network connection error'));
    }

    const { status, data } = error.response;
    const errorMsg = data?.message || data?.error || `Request failed with status ${status}`;

    // Handle 401 Unauthorized with token refresh
    if (status === 401 && !originalRequest._retry) {
      const requestUrl = originalRequest.url || '';

      // Don't retry auth login or refresh requests
      if (requestUrl.includes('/auth/login') || requestUrl.includes('/auth/refresh')) {
        return Promise.reject(new Error(errorMsg));
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return adminApiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getAdminRefreshToken();
      if (!refreshToken) {
        isRefreshing = false;
        clearAdminSession();
        return Promise.reject(new Error('Admin session expired. Please sign in again.'));
      }

      try {
        const refreshResponse = await axios.post(`${ADMIN_API_BASE}/auth/refresh`, {
          refreshToken,
        });

        const authPayload = refreshResponse.data?.data || refreshResponse.data;
        const newAccessToken = authPayload?.accessToken;
        const newRefreshToken = authPayload?.refreshToken;

        if (newAccessToken) {
          localStorage.setItem(ADMIN_TOKEN_KEY, newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem(ADMIN_REFRESH_TOKEN_KEY, newRefreshToken);
          }
          if (authPayload.user) {
            localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(authPayload.user));
          }

          adminApiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

          processQueue(null, newAccessToken);
          return adminApiClient(originalRequest);
        } else {
          throw new Error('Refresh response missing access token');
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        clearAdminSession();
        return Promise.reject(new Error('Admin session expired. Please sign in again.'));
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(new Error(errorMsg));
  }
);

export default adminApiClient;
