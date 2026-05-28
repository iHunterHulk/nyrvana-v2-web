import { describe, it, expect, vi, beforeEach } from 'vitest';
// @vitest-environment jsdom
import { 
  setAccessToken, 
  getAccessToken, 
  login, 
  logout, 
  refreshAccessToken, 
  apiFetch, 
  AuthExpiredError 
} from './client';

describe('Auth Client', () => {
  beforeEach(() => {
    // Reset module state
    setAccessToken(null);
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should store access token on successful login', async () => {
      // Mock successful login response
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ accessToken: 'test-access-token' })
      }) as any;

      await login('test@example.com', 'password');

      expect(getAccessToken()).toBe('test-access-token');
    });

    it('should throw error on failed login', async () => {
      // Mock failed login response
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: 'Invalid credentials' })
      }) as any;

      await expect(login('test@example.com', 'wrong-password'))
        .rejects
        .toThrow('Invalid credentials');
    });
  });

  describe('apiFetch', () => {
    it('should add Authorization header', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({})
      }) as any;

      setAccessToken('test-access-token');
      await apiFetch('/test');

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/proxy//test',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-access-token'
          })
        })
      );
    });

    it('should retry once on 401 and succeed', async () => {
      // First call returns 401, second call succeeds
      global.fetch = vi.fn()
        .mockResolvedValueOnce({
          status: 401,
          ok: false
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ accessToken: 'new-token' })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({})
        }) as any;

      setAccessToken('old-token');
      await apiFetch('/test');

      // Should have been called three times:
      // 1. Initial call with old token
      // 2. Refresh token call
      // 3. Retry call with new token
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });

    it('should throw AuthExpiredError when refresh fails', async () => {
      // First call returns 401, refresh fails
      global.fetch = vi.fn()
        .mockResolvedValueOnce({
          status: 401,
          ok: false
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 401
        }) as any;

      setAccessToken('old-token');
      
      await expect(apiFetch('/test')).rejects.toThrow(AuthExpiredError);
    });
  });
});