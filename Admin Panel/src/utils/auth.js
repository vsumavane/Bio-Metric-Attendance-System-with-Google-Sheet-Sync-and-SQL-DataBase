const TOKEN_KEY = 'jwt';

/**
 * Save JWT to session storage
 * @param {string} token
 */
export function saveToken(token) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

/**
 * Retrieve JWT from session storage
 * @returns {string|null}
 */
export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

/**
 * Clear the stored JWT (logout)
 */
export function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export function isAuthenticated() {
  const token = getToken();
  return token && isTokenValid();
}

/**
 * Optional: Decode JWT and check expiry (basic example)
 * @returns {boolean}
 */
export function isTokenValid() {
  const token = getToken();
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('Decoded payload:', payload);
    const now = Math.floor(Date.now() / 1000);
    return payload.exp && payload.exp > now;
  } catch (err) {
    console.error('Invalid token format', err);
    return false;
  }
}