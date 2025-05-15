import { saveToken } from '../utils/auth';
import { apiFetch } from '../utils/api';
import { navigateTo } from '../utils/router';
import { showModal } from '../components/Modal';

function renderLoginForm() {
    return `
        <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div>
                    <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Login
                    </h2>
                </div>
                <form id="loginForm" class="mt-8 space-y-6">
                    <div class="rounded-md shadow-sm space-y-4">
                        <div>
                            <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
                            <input 
                                id="username"
                                name="USERNAME" 
                                type="text" 
                                required 
                                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                autocomplete="username"
                            >
                        </div>
                        <div>
                            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                            <input 
                                id="password"
                                name="PASSWORD" 
                                type="password" 
                                required 
                                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                autocomplete="current-password"
                            >
                        </div>
                    </div>

                    <div>
                        <button 
                            type="submit"
                            id="loginButton"
                            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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