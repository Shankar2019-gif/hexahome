import adminApiClient, {
  setAdminSession,
  clearAdminSession,
  getAdminToken,
  getAdminUser,
} from './adminApiClient';

// ============================================================================
// HexaHome Admin API Gateway
// Provides structured methods for all administrative operations
// ============================================================================

export const adminAuthApi = {
  login: async (username, password) => {
    const res = await adminApiClient.post('/auth/login', {
      usernameOrEmail: username,
      username,
      password,
    });
    if (res && res.accessToken) {
      setAdminSession(res.accessToken, res.refreshToken, res.user);
    }
    return res;
  },

  refresh: async (refreshToken) => {
    return adminApiClient.post('/auth/refresh', { refreshToken });
  },

  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('hexahome_admin_refresh_token');
      await adminApiClient.post('/auth/logout', { refreshToken });
    } catch (e) {
      console.warn('Logout endpoint call warning:', e);
    } finally {
      clearAdminSession();
    }
  },

  getMe: async () => {
    return adminApiClient.get('/auth/me');
  },
};

export const adminDashboardApi = {
  getMetrics: async () => {
    return adminApiClient.get('/dashboard/metrics');
  },
};

export const adminPropertyApi = {
  searchListings: async (params = {}) => {
    return adminApiClient.get('/properties', { params });
  },

  getListingDetail: async (id) => {
    return adminApiClient.get(`/properties/${id}`);
  },

  approveListing: async (id) => {
    return adminApiClient.post(`/properties/${id}/approve`);
  },

  rejectListing: async (id, reason) => {
    return adminApiClient.post(`/properties/${id}/reject`, { reason });
  },

  expireListing: async (id) => {
    return adminApiClient.post(`/properties/${id}/expire`);
  },

  toggleHotDeal: async (id) => {
    return adminApiClient.post(`/properties/${id}/toggle-hot-deal`);
  },

  toggleVerified: async (id) => {
    return adminApiClient.post(`/properties/${id}/toggle-verified`);
  },

  deleteListing: async (id) => {
    return adminApiClient.delete(`/properties/${id}`);
  },

  bulkAction: async (action, propertyIds, reason = '') => {
    return adminApiClient.post('/properties/bulk-action', {
      action,
      propertyIds,
      reason,
    });
  },
};

export const adminUserApi = {
  searchUsers: async (params = {}) => {
    return adminApiClient.get('/users', { params });
  },

  getUserDetail: async (id) => {
    return adminApiClient.get(`/users/${id}`);
  },

  blockUser: async (id, reason) => {
    return adminApiClient.post(`/users/${id}/block`, { reason });
  },

  unblockUser: async (id, reason) => {
    return adminApiClient.post(`/users/${id}/unblock`, { reason });
  },

  revealPii: async (id, reason) => {
    return adminApiClient.post(`/users/${id}/reveal-pii`, { reason });
  },
};

export const adminLeadApi = {
  searchLeads: async (params = {}) => {
    return adminApiClient.get('/leads', { params });
  },

  getLeadDetail: async (id) => {
    return adminApiClient.get(`/leads/${id}`);
  },

  assignLead: async (id, assignedToId, notes = '') => {
    return adminApiClient.post(`/leads/${id}/assign`, { assignedToId, notes });
  },

  updateLeadStatus: async (id, status, notes = '') => {
    return adminApiClient.patch(`/leads/${id}/status`, { status, notes });
  },

  getLeadActivityHistory: async (id) => {
    return adminApiClient.get(`/leads/${id}/activity`);
  },

  exportLeadsCsv: async (params = {}) => {
    const response = await adminApiClient.get('/leads/export', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};

export const adminBillingApi = {
  searchSubscriptions: async (params = {}) => {
    return adminApiClient.get('/billing/subscriptions', { params });
  },

  getSubscriptionDetail: async (id) => {
    return adminApiClient.get(`/billing/subscriptions/${id}`);
  },

  extendSubscription: async (id, additionalDays, reason) => {
    return adminApiClient.post(`/billing/subscriptions/${id}/extend`, {
      additionalDays,
      reason,
    });
  },

  cancelSubscription: async (id, reason) => {
    return adminApiClient.post(`/billing/subscriptions/${id}/cancel`, { reason });
  },

  grantCredits: async (id, credits, reason) => {
    return adminApiClient.post(`/billing/subscriptions/${id}/grant-credits`, {
      credits,
      reason,
    });
  },

  searchPayments: async (params = {}) => {
    return adminApiClient.get('/billing/payments', { params });
  },
};

export const adminContentApi = {
  generatePresignedUploadUrl: async ({ fileName, contentType, folder, fileSize }) => {
    return adminApiClient.post('/content/media/presigned-upload', {
      fileName,
      contentType,
      folder,
      fileSize,
    });
  },

  getCities: async () => {
    return adminApiClient.get('/content/cities');
  },

  createCity: async (payload) => {
    return adminApiClient.post('/content/cities', payload);
  },

  updateCity: async (id, payload) => {
    return adminApiClient.put(`/content/cities/${id}`, payload);
  },

  getLocalities: async (cityId) => {
    return adminApiClient.get('/content/localities', { params: { cityId } });
  },

  createLocality: async (payload) => {
    return adminApiClient.post('/content/localities', payload);
  },

  updateLocality: async (id, payload) => {
    return adminApiClient.put(`/content/localities/${id}`, payload);
  },

  getFaqs: async () => {
    return adminApiClient.get('/content/faqs');
  },

  createFaq: async (payload) => {
    return adminApiClient.post('/content/faqs', payload);
  },

  updateFaq: async (id, payload) => {
    return adminApiClient.put(`/content/faqs/${id}`, payload);
  },

  deleteFaq: async (id) => {
    return adminApiClient.delete(`/content/faqs/${id}`);
  },

  searchReports: async (params = {}) => {
    return adminApiClient.get('/content/reports', { params });
  },

  updateReportStatus: async (id, status, resolutionNotes = '') => {
    return adminApiClient.patch(`/content/reports/${id}/status`, {
      status,
      resolutionNotes,
    });
  },
};

export const adminSystemApi = {
  searchAuditLogs: async (params = {}) => {
    return adminApiClient.get('/system/audit-logs', { params });
  },

  getAuditLogDetail: async (id) => {
    return adminApiClient.get(`/system/audit-logs/${id}`);
  },

  searchAdminUsers: async (params = {}) => {
    return adminApiClient.get('/system/admins', { params });
  },

  createAdminUser: async (payload) => {
    return adminApiClient.post('/system/admins', payload);
  },

  updateAdminUser: async (id, payload) => {
    return adminApiClient.put(`/system/admins/${id}`, payload);
  },

  getHealthMetrics: async () => {
    return adminApiClient.get('/system/health');
  },
};

export default {
  auth: adminAuthApi,
  dashboard: adminDashboardApi,
  properties: adminPropertyApi,
  users: adminUserApi,
  leads: adminLeadApi,
  billing: adminBillingApi,
  content: adminContentApi,
  system: adminSystemApi,
};
