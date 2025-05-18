import { apiFetch } from "./api";

export const TOKEN_KEY = 'auth_token';

export function clearToken() {
  console.log('Clearing token...');
  // Clear token from storage
  document.cookie = `${TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  // Call signout endpoint
  apiFetch('/api/signout', {
    method: 'POST',
  });
}

export function setToken(token) {
  console.log('Setting token...');
  // Store token in cookie without HttpOnly flag
  document.cookie = `${TOKEN_KEY}=${token}; path=/; SameSite=Strict`;
  console.log('Cookie after setting:', document.cookie);
}

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export function isAuthenticated() {
  console.log('Checking authentication...');
  const token = getToken(TOKEN_KEY);
  const isAuth = token && isTokenValid(token);
  console.log('Authentication status:', isAuth);
  return isAuth;
}

// Helper to get cookie by name
export function getToken(name) {
  console.log('Getting token...');
  console.log('All cookies:', document.cookie);
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const token = parts.pop().split(';').shift();
    console.log('Token found:', token ? 'exists' : 'null');
    return token;
  }
  console.log('No token found in cookies');
  return null;
}

export function isTokenValid(token) {
  if (!token) {
    console.log('Token validation failed: no token provided');
    return false;
  }
  const isValid = isTokenFormatValid(token) && !isTokenExpired(token);
  console.log('Token validation result:', isValid);
  return isValid;
}

export function isTokenFormatValid(token) {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) {
    console.log('Token format invalid: wrong number of parts');
    return false;
  }
  try {
    const payload = JSON.parse(atob(parts[1]));
    const isValid = typeof payload === 'object' && payload !== null && 'exp' in payload;
    console.log('Token format validation result:', isValid);
    return isValid;
  } catch (err) {
    console.log('Token format validation error:', err.message);
    return false;
  }
}

export function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    const isExpired = !payload.exp || payload.exp <= now;
    console.log('Token expiration check:', {
      now,
      exp: payload.exp,
      isExpired
    });
    return isExpired;
  } catch (err) {
    console.log('Token expiration check error:', err.message);
    return true;
  }
}