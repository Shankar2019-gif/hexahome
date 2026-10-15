import axios from 'axios';

// ============================================================================
// HexaHome Axios Client with Real Request & Response Interceptors
// Features:
// 1. Request Interceptor: Automatic Authorization header injection
// 2. Response Interceptor: Automatic 401 Unauthorized handling, refresh token
//    rotation & queued request replay
// 3. Centralized API response unpacking and error normalization
// ============================================================================

const API_BASE = '/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE,
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

export const clearAuthSession = () => {
  localStorage.removeItem('hexahome_token');
  localStorage.removeItem('hexahome_refresh_token');
  localStorage.removeItem('hexahome_user');
  delete apiClient.defaults.headers.common['Authorization'];
  window.dispatchEvent(new Event('hexahome_auth_changed'));
};

// ----------------------------------------------------------------------------
// 1. Request Interceptor
// Injects the active JWT Bearer token from localStorage into outgoing requests
// ----------------------------------------------------------------------------
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hexahome_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('[Request Interceptor Error]:', error);
    return Promise.reject(error);
  }
);

// ----------------------------------------------------------------------------
// 2. Response Interceptor
// Handles HTTP responses, unwraps payload, and catches 401 for silent token refresh
// ----------------------------------------------------------------------------
apiClient.interceptors.response.use(
  (response) => {
    // Standard backend wraps payloads in { success: true, data: ..., message: ... }
    const data = response.data;
    if (data && typeof data === 'object' && 'data' in data) {
      return data.data;
    }
    return data;
  },
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      console.error('[Network Error]: Server unavailable or connection dropped', error.message);
      return Promise.reject(new Error(error.message || 'Network connection error'));
    }

    const { status, data } = error.response;
    const errorMsg = data?.message || data?.error || `Request failed with status ${status}`;

    // 401 Unauthorized Handling & Silent Token Refresh
    if (status === 401 && !originalRequest._retry) {
      const requestUrl = originalRequest.url || '';

      // Don't loop refresh for auth endpoints
      if (
        requestUrl.includes('/auth/refresh') ||
        requestUrl.includes('/auth/verify-otp') ||
        requestUrl.includes('/auth/send-otp')
      ) {
        return Promise.reject(new Error(errorMsg));
      }

      if (isRefreshing) {
        // Queue concurrent requests while a refresh request is pending
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('hexahome_refresh_token');
      if (!refreshToken) {
        isRefreshing = false;
        clearAuthSession();
        return Promise.reject(new Error('Session expired. Please log in again.'));
      }

      try {
        console.info('[React Interceptor] 401 received. Initiating silent token refresh...');
        const refreshResponse = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken });
        const authData = refreshResponse.data?.data || refreshResponse.data;

        const newAccessToken = authData?.accessToken;
        const newRefreshToken = authData?.refreshToken;

        if (newAccessToken) {
          localStorage.setItem('hexahome_token', newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem('hexahome_refresh_token', newRefreshToken);
          }
          if (authData.user) {
            localStorage.setItem('hexahome_user', JSON.stringify(authData.user));
          }

          apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

          processQueue(null, newAccessToken);
          console.info('[React Interceptor] Token successfully refreshed. Replaying original request.');
          return apiClient(originalRequest);
        } else {
          throw new Error('Refresh response did not return a valid access token');
        }
      } catch (refreshErr) {
        console.warn('[React Interceptor] Token refresh failed:', refreshErr.message);
        processQueue(refreshErr, null);
        clearAuthSession();
        return Promise.reject(new Error('Session expired. Please log in again.'));
      } finally {
        isRefreshing = false;
      }
    }

    console.error(`[API Error] ${originalRequest.method?.toUpperCase()} ${originalRequest.url}:`, errorMsg);
    return Promise.reject(new Error(errorMsg));
  }
);

export default apiClient;
