// Client-side auth helpers
let accessToken: string | null = null;

/**
 * Set the access token in module-level closure variable
 * @param token - The access token or null to clear
 */
export function setAccessToken(token: string | null) {
  accessToken = token;
}

/**
 * Get the current access token
 * @returns The access token or null if not set
 */
export function getAccessToken(): string | null {
  return accessToken;
}

/**
 * Login with email and password
 * @param email - User's email
 * @param password - User's password
 */
export async function login(email: string, password: string): Promise<void> {
  const response = await fetch('/api/proxy/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Login failed');
  }

  const data = await response.json();
  setAccessToken(data.accessToken);
}

/**
 * Logout the current user
 */
export async function logout(): Promise<void> {
  try {
    // Get refresh token from cookie and call logout endpoint
    const response = await fetch('/api/proxy/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      console.error('Logout endpoint returned error:', response.status);
    }
  } catch (error) {
    console.error('Logout error:', error);
  }

  // Clear access token
  setAccessToken(null);

  // Broadcast logout to other tabs
  localStorage.setItem('nv-logout-broadcast', Date.now().toString());

  // Redirect to login page
  window.location.assign('/auth/login');
}

/**
 * Refresh the access token
 * @returns The new access token or null if refresh failed
 */
export async function refreshAccessToken(): Promise<string | null> {
  try {
    const response = await fetch('/api/proxy/auth/refresh', {
      method: 'POST',
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    setAccessToken(data.accessToken);
    return data.accessToken;
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
}

/**
 * Custom error class for auth expiration
 */
export class AuthExpiredError extends Error {
  constructor() {
    super('Authentication expired');
    this.name = 'AuthExpiredError';
  }
}

/**
 * Fetch wrapper that adds Authorization header and handles 401 retries
 * @param path - API path (without /api/proxy prefix)
 * @param init - Fetch options
 * @returns Fetch response
 */
export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  // Try the request with current access token
  const url = path.startsWith('/api/proxy/') ? path : `/api/proxy/${path}`;
  const response = await fetch(url, {
    ...init,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      ...init?.headers,
    },
  });

  // If we get a 401, try to refresh the token and retry once
  if (response.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      // Retry the request with the new token
      const retryResponse = await fetch(url, {
        ...init,
        headers: {
          'Authorization': `Bearer ${newToken}`,
          ...init?.headers,
        },
      });
      return retryResponse;
    } else {
      // Refresh failed, throw auth expired error
      throw new AuthExpiredError();
    }
  }

  return response;
}