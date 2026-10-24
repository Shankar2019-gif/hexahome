import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  setAdminSession,
  getAdminToken,
  getAdminRefreshToken,
  getAdminUser,
  clearAdminSession,
  ADMIN_TOKEN_KEY,
  ADMIN_REFRESH_TOKEN_KEY,
  ADMIN_USER_KEY,
} from '../services/adminApiClient';

describe('AdminApiClient Session Management', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('stores and retrieves admin token and refresh token', () => {
    const mockUser = { id: 'admin_1', email: 'admin@hexahome.in', role: 'SUPER_ADMIN' };
    setAdminSession('token_123', 'refresh_456', mockUser);

    expect(getAdminToken()).toBe('token_123');
    expect(getAdminRefreshToken()).toBe('refresh_456');
    expect(getAdminUser()).toEqual(mockUser);
  });

  it('handles invalid user JSON in localStorage gracefully without throwing', () => {
    localStorage.setItem(ADMIN_USER_KEY, 'invalid-json{');
    const user = getAdminUser();
    expect(user).toBeNull();
  });

  it('dispatches custom event hexahome_admin_auth_changed on set and clear', () => {
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

    setAdminSession('tok', 'ref', { name: 'Admin' });
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy.mock.calls[0][0].type).toBe('hexahome_admin_auth_changed');

    clearAdminSession();
    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy.mock.calls[1][0].type).toBe('hexahome_admin_auth_changed');
  });

  it('clears all session keys from localStorage on clearAdminSession', () => {
    setAdminSession('tok', 'ref', { name: 'Admin' });
    expect(localStorage.getItem(ADMIN_TOKEN_KEY)).toBe('tok');

    clearAdminSession();
    expect(getAdminToken()).toBeNull();
    expect(getAdminRefreshToken()).toBeNull();
    expect(getAdminUser()).toBeNull();
  });
});
