// Theme utility functions
const THEME_KEY = 'theme-preference';

// Get system preference
function getSystemPreference() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Get stored theme or system preference
export function getTheme() {
    return localStorage.getItem(THEME_KEY) || getSystemPreference();
}

// Set theme
export function setTheme(theme) {
    document.documentElement.classList.toggle('dark', theme === 'dark');
}

// Initialize theme
export function initTheme() {
    const theme = getTheme();
    setTheme(theme);
    
    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(THEME_KEY)) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
}

// Toggle theme
export function toggleTheme() {
    const currentTheme = getTheme();
    if (currentTheme === 'dark') {
        localStorage.setItem(THEME_KEY, 'light');
    } else {
        localStorage.setItem(THEME_KEY, 'dark');
    }
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');

} 

export function getThemeToggleButtonHTML() {
  setTimeout(() => {
      initTheme();
    const themeToggleBtn = document.getElementById("theme-toggle");
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener("click", toggleTheme);
    }
  }, 0);
  return `
<button id="theme-toggle" aria-label="Toggle dark mode"
    class="group relative w-14 h-8 bg-gray-300 dark:bg-gray-600 rounded-full transition-colors duration-500 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-hidden">
    
    <!-- Switch Thumb -->
    <span class="absolute top-1 left-1 w-6 h-6 bg-white dark:bg-gray-900 rounded-full shadow-md transform transition-all duration-500 ease-in-out
        dark:translate-x-6">
    </span>

    <!-- Sun Icon (Light mode) -->
    <svg class="absolute left-2 top-2 w-4 h-4 text-yellow-400 transition-opacity duration-300 ease-in-out dark:opacity-0"
        fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 15a5 5 0 100-10 5 5 0 000 10z"/>
    </svg>

    <!-- Moon Icon (Dark mode) -->
    <svg class="absolute right-2 top-2 w-4 h-4 text-gray-200 transition-opacity duration-300 ease-in-out opacity-0 dark:opacity-100"
        fill="currentColor" viewBox="0 0 20 20">
        <path d="M17.293 13.293A8 8 0 016.707 2.707a8 8 0 1010.586 10.586z"/>
    </svg>
</button>

    `;
}