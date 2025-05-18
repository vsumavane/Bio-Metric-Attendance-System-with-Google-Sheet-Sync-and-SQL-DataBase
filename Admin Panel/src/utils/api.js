import axios from 'axios';
import { clearToken, getToken, TOKEN_KEY } from './auth.js';
import { navigateTo } from './router.js';

/**
 * Wrapper around axios with error handling.
 * @param {string} url - API endpoint (relative to current origin or absolute)
 * @param {object} options - Axios options (method, headers, data, etc.)
 * @returns {Promise<any>}
 */
export async function apiFetch(url, options = {}) {
  const token = getToken(TOKEN_KEY);
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await axios({
      url,
      headers,
      withCredentials: true, // Important: include cookies in requests
      ...options,
    });

    return response.data;
  } catch (err) {
    if (err.response) {
      if (err.response.status === 401) {
        clearToken();
        navigateTo('/login');
        throw new Error('Unauthorized. Redirecting to login...');
      }
      throw new Error(err.response.data?.message || 'API Error');
    } else {
      console.error('API Error:', err.message);
      throw err;
    }
  }
}