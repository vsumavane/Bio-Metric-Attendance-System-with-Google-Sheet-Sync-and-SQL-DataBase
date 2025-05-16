import { saveToken } from '../utils/auth';
import { apiFetch } from '../utils/api';
import { navigateTo } from '../utils/router';
import { showModal } from '../components/Modal';
import { initTheme } from '../utils/theme';

function renderLoginForm() {
    return `
        <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-6 px-2 sm:py-12 sm:px-6 lg:px-8">
            <div class="max-w-md w-full space-y-6 sm:space-y-8 bg-white dark:bg-gray-900 p-6 sm:p-10 rounded-xl shadow-lg mx-2">
                <div class="text-center">
                    <div class="mx-auto h-16 w-16 sm:h-20 sm:w-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                        <!-- Logo placeholder -->
                        <span class="text-gray-400 dark:text-gray-300 text-xs sm:text-sm">LOGO</span>
                    </div>
                    <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                        Welcome Back
                    </h2>
                    <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Please sign in to continue</p>
                </div>
                <form id="loginForm" class="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
                    <div class="space-y-4 sm:space-y-5">
                        <div class="relative">
                            <input 
                                id="username"
                                name="USERNAME" 
                                type="text" 
                                required 
                                placeholder=" "
                                class="appearance-none block w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 ease-in-out peer text-sm sm:text-base"
                                autocomplete="username"
                            >
                            <label 
                                for="username" 
                                class="absolute text-xs sm:text-sm text-gray-500 dark:text-gray-400 duration-100 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 dark:peer-focus:text-blue-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 cursor-text"
                            >Username</label>
                        </div>
                        <div class="relative">
                            <input 
                                id="password"
                                name="PASSWORD" 
                                type="password" 
                                required 
                                placeholder=" "
                                class="appearance-none block w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 ease-in-out peer text-sm sm:text-base"
                                autocomplete="current-password"
                            >
                            <label 
                                for="password" 
                                class="absolute text-xs sm:text-sm text-gray-500 dark:text-gray-400 duration-100 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 dark:peer-focus:text-blue-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 cursor-text"
                            >Password</label>
                        </div>
                    </div>

                    <div>
                        <button 
                            type="submit"
                            id="loginButton"
                            class="group relative w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent text-xs sm:text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

function attachLoginHandler() {
    initTheme(); // Initialize theme on load
    const form = document.getElementById('loginForm');
    const loginButton = document.getElementById('loginButton');
    
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = form.USERNAME.value.trim();
        const password = form.PASSWORD.value.trim();
        
        // Disable button and show loading state
        loginButton.disabled = true;
        loginButton.textContent = 'Logging in...';

        try {
            const response = await apiFetch('/login', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                const { message } = await response.json();
                throw new Error(message || 'Login failed');
            }

            const { token } = await response.json();
            saveToken(token);
            navigateTo('/dashboard');
        } catch (err) {
            showModal('error', err.message);
        } finally {
            // Reset button state
            loginButton.disabled = false;
            loginButton.textContent = 'Login';
        }
    });
}

export default function LoginForm() {
    setTimeout(attachLoginHandler, 0);
    return renderLoginForm();
}