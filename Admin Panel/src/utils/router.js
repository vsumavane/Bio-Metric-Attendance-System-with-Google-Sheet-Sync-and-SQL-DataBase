import { clearToken, isAuthenticated } from './auth.js';
import Dashboard from '../pages/dashboard.js';
import Enroll from '../pages/enroll.js';
import settings from '../pages/settings.js';
import NotFound from '../pages/notFound.js';
import loginForm from '../pages/loginForm.js';
import { showLoader, hideLoader } from '../components/loader.js';

// Lazy-load page components
const routes = {
  '/': () => {
    if (isAuthenticated()) {
      navigateTo('/dashboard');
    } else {
      navigateTo('/login');
    }
  },
  '/login': () => Promise.resolve({ default: loginForm }),
  '/dashboard': () => Promise.resolve({ default: Dashboard }),
  '/enroll': () => Promise.resolve({ default: Enroll }),
  '/settings': () => Promise.resolve({ default: settings }),
  '*': () => Promise.resolve({ default: NotFound }), // fallback
};

// Define protected routes
const protectedRoutes = ['/dashboard', '/enroll', '/settings'];

/**
 * Renders the correct page based on the path.
 * @param {string} path - The current URL path.
 */
export async function router(path) {
  const normalizedPath = path.toLowerCase();
  const isProtected = protectedRoutes.map(r => r.toLowerCase()).includes(normalizedPath);

  if (isProtected && !isAuthenticated()) {
    clearToken();
    return navigateTo('/login');
  }

  // Show loader before page transition
  showLoader();

  try {
    const loader = routes[normalizedPath] || routes['*'];
    const { default: view } = await loader();
    const app = document.getElementById('app');
    app.innerHTML = await view();
  } catch (error) {
    console.error('Error loading page:', error);
    const app = document.getElementById('app');
    app.innerHTML = await NotFound();
  } finally {
    // Hide loader after page is loaded
    hideLoader();
  }
}

/**
 * Navigates to a new URL and calls the router.
 * @param {string} url - The target path to navigate to.
 */
export function navigateTo(url) {
  history.pushState({}, '', url);
  router(url);
}