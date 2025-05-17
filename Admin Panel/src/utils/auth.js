import { apiFetch } from "./api";

export const TOKEN_KEY = 'auth_token';

export function clearToken() {
  apiFetch('/api/signout', {
    method: 'POST',
  })
}
  
/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export function isAuthenticated() {
  const token = getToken(TOKEN_KEY);
  return token && isTokenValid(token);
}

// Helper to get cookie by name
export function getToken(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

export function isTokenValid(token) {
  return isTokenFormatValid(token) && !isTokenExpired(token);
}

export function isTokenFormatValid(token) {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  try {
    const payload = JSON.parse(atob(parts[1]));
    return typeof payload === 'object' && payload !== null && 'exp' in payload;
  } catch (err) {
    return false;
  }
}

export function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return !payload.exp || payload.exp <= now;
  } catch (err) {
    return true;
  }
}