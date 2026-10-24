import { describe, it, expect, beforeEach, vi } from 'vitest';
import { clearAuthSession } from '../services/apiClient';

describe('Customer ApiClient Session Management', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('clears token, refresh token and user data from localStorage and dispatches event', () => {
    localStorage.setItem('hexahome_token', 'cust_token_123');
    localStorage.setItem('hexahome_refresh_token', 'cust_refresh_123');
    localStorage.setItem('hexahome_user', JSON.stringify({ id: 'u1', name: 'Test' }));

    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

    clearAuthSession();

    expect(localStorage.getItem('hexahome_token')).toBeNull();
    expect(localStorage.getItem('hexahome_refresh_token')).toBeNull();
    expect(localStorage.getItem('hexahome_user')).toBeNull();
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy.mock.calls[0][0].type).toBe('hexahome_auth_changed');
  });
});
