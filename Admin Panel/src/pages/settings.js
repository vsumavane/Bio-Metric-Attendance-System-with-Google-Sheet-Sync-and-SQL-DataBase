import { apiFetch } from '../utils/api';
import { navigateTo } from '../utils/router';
import { showModal } from '../components/Modal';

function renderSettings() {
    return `
        <div class="min-h-screen bg-gray-50">
            <!-- Header -->
            <header class="bg-white shadow">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between items-center py-6">
                        <div class="flex items-center">
                            <svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <h1 class="ml-3 text-2xl font-bold text-gray-900">Settings</h1>
                        </div>
                        <button 
                            class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                            id="backBtn"
                        >
                            <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </header>

            <!-- Main Content -->
            <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div class="space-y-6">
                    <!-- Database Settings -->
                    <div class="bg-white shadow rounded-lg">
                        <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
                            <h2 class="text-lg font-medium text-gray-900">Database Settings</h2>
                        </div>
                        <div class="px-4 py-5 sm:p-6">
                            <div class="space-y-6">
                                <div>
                                    <label for="dbHost" class="block text-sm font-medium text-gray-700">Database Host</label>
                                    <input 
                                        type="text" 
                                        id="dbHost"
                                        name="dbHost" 
                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    >
                                </div>
                                <div>
                                    <label for="dbName" class="block text-sm font-medium text-gray-700">Database Name</label>
                                    <input 
                                        type="text" 
                                        id="dbName"
                                        name="dbName" 
                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    >
                                </div>
                                <div>
                                    <label for="dbUser" class="block text-sm font-medium text-gray-700">Database User</label>
                                    <input 
                                        type="text" 
                                        id="dbUser"
                                        name="dbUser" 
                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    >
                                </div>
                                <div>
                                    <label for="dbPassword" class="block text-sm font-medium text-gray-700">Database Password</label>
                                    <input 
                                        type="password" 
                                        id="dbPassword"
                                        name="dbPassword" 
                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    >
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Google Sheets Settings -->
                    <div class="bg-white shadow rounded-lg">
                        <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
                            <h2 class="text-lg font-medium text-gray-900">Google Sheets Integration</h2>
                        </div>
                        <div class="px-4 py-5 sm:p-6">
                            <div class="space-y-6">
                                <div>
                                    <label for="sheetId" class="block text-sm font-medium text-gray-700">Sheet ID</label>
                                    <input 
                                        type="text" 
                                        id="sheetId"
                                        name="sheetId" 
                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    >
                                </div>
                                <div>
                                    <label for="sheetName" class="block text-sm font-medium text-gray-700">Sheet Name</label>
                                    <input 
                                        type="text" 
                                        id="sheetName"
                                        name="sheetName" 
                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    >
                                </div>
                                <div>
                                    <label for="credentials" class="block text-sm font-medium text-gray-700">Service Account Credentials</label>
                                    <textarea 
                                        id="credentials"
                                        name="credentials" 
                                        rows="4"
                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Sync Settings -->
                    <div class="bg-white shadow rounded-lg">
                        <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
                            <h2 class="text-lg font-medium text-gray-900">Sync Settings</h2>
                        </div>
                        <div class="px-4 py-5 sm:p-6">
                            <div class="space-y-6">
                                <div class="flex items-center">
                                    <input 
                                        type="checkbox" 
                                        id="autoSync"
                                        name="autoSync" 
                                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    >
                                    <label for="autoSync" class="ml-2 block text-sm text-gray-900">Enable Auto Sync</label>
                                </div>
                                <div>
                                    <label for="syncInterval" class="block text-sm font-medium text-gray-700">Sync Interval (minutes)</label>
                                    <input 
                                        type="number" 
                                        id="syncInterval"
                                        name="syncInterval" 
                                        min="1"
                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    >
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Save Button -->
                    <div class="flex justify-end">
                        <button 
                            type="button"
                            id="saveBtn"
                            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </main>
        </div>
    `;
}

async function loadSettings() {
    try {
        const response = await apiFetch('/settings');
        if (!response.ok) throw new Error('Failed to load settings');
        
        const settings = await response.json();
        
        // Populate form fields
        document.getElementById('dbHost').value = settings.dbHost || '';
        document.getElementById('dbName').value = settings.dbName || '';
        document.getElementById('dbUser').value = settings.dbUser || '';
        document.getElementById('dbPassword').value = settings.dbPassword || '';
        document.getElementById('sheetId').value = settings.sheetId || '';
        document.getElementById('sheetName').value = settings.sheetName || '';
        document.getElementById('credentials').value = settings.credentials || '';
        document.getElementById('autoSync').checked = settings.autoSync || false;
        document.getElementById('syncInterval').value = settings.syncInterval || 5;
    } catch (error) {
        showModal('error', 'Failed to load settings: ' + error.message);
    }
}

async function saveSettings() {
    const saveBtn = document.getElementById('saveBtn');
    
    // Disable save button and show loading state
    saveBtn.disabled = true;
    saveBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Saving...
    `;

    try {
        const settings = {
            dbHost: document.getElementById('dbHost').value,
            dbName: document.getElementById('dbName').value,
            dbUser: document.getElementById('dbUser').value,
            dbPassword: document.getElementById('dbPassword').value,
            sheetId: document.getElementById('sheetId').value,
            sheetName: document.getElementById('sheetName').value,
            credentials: document.getElementById('credentials').value,
            autoSync: document.getElementById('autoSync').checked,
            syncInterval: parseInt(document.getElementById('syncInterval').value)
        };

        const response = await apiFetch('/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings)
        });

        if (!response.ok) throw new Error('Failed to save settings');

        // Show success message
        showModal('success', 'Settings saved successfully!');
        
        // Reload settings after a short delay
        setTimeout(loadSettings, 1000);
    } catch (error) {
        showModal('error', 'Failed to save settings: ' + error.message);
    } finally {
        // Reset save button
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Changes';
    }
}

function attachSettingsHandlers() {
    // Back button handler
    document.getElementById('backBtn')?.addEventListener('click', () => {
        navigateTo('/dashboard');
    });

    // Save button handler
    document.getElementById('saveBtn')?.addEventListener('click', saveSettings);

    // Load initial settings
    loadSettings();
}

export default function Settings() {
    setTimeout(attachSettingsHandlers, 0);
    return renderSettings();
}