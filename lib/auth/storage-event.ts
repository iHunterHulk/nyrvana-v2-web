// Subscribe to storage event for cross-tab logout sync
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === 'nv-logout-broadcast') {
      // Clear access token and redirect to login
      const { setAccessToken } = require('@/lib/auth/client');
      setAccessToken(null);
      window.location.assign('/auth/login');
    }
  });
}