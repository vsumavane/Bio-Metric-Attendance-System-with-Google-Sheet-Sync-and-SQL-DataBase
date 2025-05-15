import { apiFetch } from '../utils/api';
import { navigateTo } from '../utils/router';
import { showModal } from '../components/Modal';
import { getThemeToggleButtonHTML } from '../utils/theme';

function renderSettings() {
    // Helper to generate day options based on month and year
    function getDayOptions(month, year) {
        const daysInMonth = new Date(year, month, 0).getDate();
        return Array.from({length: daysInMonth}, (_, i) => `<option value="${i+1}">${i+1}</option>`).join('');
    }

    // Get current date for defaults
    const now = new Date();
    const currentDay = now.getDate();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Years range
    const years = [];
    for (let y = 2022; y <= 2030; y++) years.push(y);

    // Helper to format numbers to two digits
    function pad2(n) {
        return n.toString().padStart(2, '0');
    }

    return `
        <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <!-- Header -->
            <header class="bg-white dark:bg-gray-800 shadow transition-colors duration-200">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex flex-col sm:flex-row sm:items-center py-6 space-y-4 sm:space-y-0 sm:justify-between">
                        <!-- Left: Settings title -->
                        <div class="flex items-center">
                            <svg class="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <h1 class="ml-3 text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
                        </div>
                        <!-- Right: Theme toggle (always visible) and Back button -->
                        <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full sm:w-auto mt-4 sm:mt-0">
                            <div class="absolute top-6 right-6 sm:static flex justify-end sm:justify-center w-full sm:w-auto">
                                ${getThemeToggleButtonHTML()}
                            </div>
                            <button 
                                class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 w-full sm:w-auto mt-4 sm:mt-0"
                                id="backBtn"
                            >
                                <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Main Content -->
            <main class="max-w-7xl mx-auto py-6 px-2 sm:px-6 lg:px-8">
                <div class="space-y-6">
                    <!-- WiFi Settings -->
                    <div class="bg-white dark:bg-gray-800 shadow rounded-lg transition-colors duration-200">
                        <div class="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
                            <h2 class="text-lg font-medium text-gray-900 dark:text-white">WiFi Settings</h2>
                        </div>
                        <div class="px-4 py-5 sm:p-6">
                            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label for="wifi_ssid" class="block text-sm font-medium text-gray-700 dark:text-gray-300">SSID</label>
                                    <input 
                                        type="text" 
                                        id="wifi_ssid"
                                        name="ssid" 
                                        placeholder="SSID"
                                        class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                                    >
                                </div>
                                <div>
                                    <label for="wifi_password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">WiFi Password</label>
                                    <input 
                                        type="password" 
                                        id="wifi_password"
                                        name="password" 
                                        placeholder="Password"
                                        class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                                    >
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Device & Google Script Settings -->
                    <div class="bg-white dark:bg-gray-800 shadow rounded-lg transition-colors duration-200">
                        <div class="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
                            <h2 class="text-lg font-medium text-gray-900 dark:text-white">Device & Google Script</h2>
                        </div>
                        <div class="px-4 py-5 sm:p-6">
                            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label for="device_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Device Name</label>
                                    <input 
                                        type="text" 
                                        id="device_name"
                                        name="MDNS"
                                        placeholder="Device Name"
                                        class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                                    >
                                </div>
                                <div>
                                    <label for="googlesid" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Google Script ID</label>
                                    <input 
                                        type="text" 
                                        id="googlesid"
                                        name="GSID"
                                        placeholder="Google Script ID"
                                        class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                                    >
                                </div>
                                <div>
                                    <label for="wwwid" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Login Username</label>
                                    <input 
                                        type="text" 
                                        id="wwwid"
                                        name="wwwid"
                                        placeholder="Login Username"
                                        class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                                    >
                                </div>
                                <div>
                                    <label for="wwwpass" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Login Password</label>
                                    <input 
                                        type="password" 
                                        id="wwwpass"
                                        name="wwwpass"
                                        placeholder="Login Password"
                                        class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                                    >
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Organization & Network Settings -->
                    <div class="bg-white dark:bg-gray-800 shadow rounded-lg transition-colors duration-200">
                        <div class="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
                            <h2 class="text-lg font-medium text-gray-900 dark:text-white">Organization & Network</h2>
                        </div>
                        <div class="px-4 py-5 sm:p-6">
                            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label for="dispname" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Organization Name</label>
                                    <input 
                                        type="text" 
                                        id="dispname"
                                        name="dispname"
                                        placeholder="Organization Name"
                                        class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                                    >
                                </div>
                                <div>
                                    <label for="aip" class="block text-sm font-medium text-gray-700 dark:text-gray-300">IP Mode</label>
                                    <select id="aip" name="aip" class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200">
                                        <option value="1" selected>Auto IP</option>
                                        <option value="2">Manual IP</option>
                                    </select>
                                </div>
                                <div>
                                    <label for="mip" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Manual IP</label>
                                    <input 
                                        type="text" 
                                        id="mip"
                                        name="mnip"
                                        placeholder="Manual IP"
                                        class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                                    >
                                </div>
                                <div>
                                    <label for="gateway" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Gateway</label>
                                    <input 
                                        type="text" 
                                        id="gateway"
                                        name="gateway"
                                        placeholder="Gateway"
                                        class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                                    >
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Date & Time Settings -->
                    <div class="bg-white dark:bg-gray-800 shadow rounded-lg transition-colors duration-200">
                        <div class="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                            <h2 class="text-lg font-medium text-gray-900 dark:text-white">Date & Time</h2>
                            <button
                                type="button"
                                id="updateTimeBtn"
                                class="inline-flex items-center px-3 py-1 border border-blue-600 dark:border-blue-400 text-sm font-medium rounded-md text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 w-full sm:w-auto"
                                title="Set to current date and time"
                            >
                                <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Update to Current Time
                            </button>
                        </div>
                        <div class="px-4 py-5 sm:p-6">
                            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                                    <div class="flex flex-col xs:flex-row xs:space-x-2 space-y-2 xs:space-y-0">
                                        <select id="dtd" name="dtd" class="border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200">
                                            ${getDayOptions(currentMonth, currentYear)}
                                        </select>
                                        <select id="dtm" name="dtm" class="border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200">
                                            <option value="01"${currentMonth===1?' selected':''}>January</option>
                                            <option value="02"${currentMonth===2?' selected':''}>February</option>
                                            <option value="03"${currentMonth===3?' selected':''}>March</option>
                                            <option value="04"${currentMonth===4?' selected':''}>April</option>
                                            <option value="05"${currentMonth===5?' selected':''}>May</option>
                                            <option value="06"${currentMonth===6?' selected':''}>June</option>
                                            <option value="07"${currentMonth===7?' selected':''}>July</option>
                                            <option value="08"${currentMonth===8?' selected':''}>August</option>
                                            <option value="09"${currentMonth===9?' selected':''}>September</option>
                                            <option value="10"${currentMonth===10?' selected':''}>October</option>
                                            <option value="11"${currentMonth===11?' selected':''}>November</option>
                                            <option value="12"${currentMonth===12?' selected':''}>December</option>
                                        </select>
                                        <select id="dty" name="dty" class="border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200">
                                            ${years.map(y => `<option value="${y}"${currentYear===y?' selected':''}>${y}</option>`).join('')}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Time</label>
                                    <div class="flex flex-col xs:flex-row xs:space-x-2 space-y-2 xs:space-y-0">
                                        <select id="tmh" name="tmh" class="border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200">
                                            ${Array.from({length: 12}, (_, i) => {
                                                const val = pad2(i+1);
                                                return `<option value="${val}"${i+1===((now.getHours()%12)||12)?' selected':''}>${val}</option>`;
                                            }).join('')}
                                        </select>
                                        <select id="tmm" name="tmm" class="border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200">
                                            ${Array.from({length: 60}, (_, i) => {
                                                const val = pad2(i);
                                                return `<option value="${val}"${i===now.getMinutes()?' selected':''}>${val}</option>`;
                                            }).join('')}
                                        </select>
                                        <select id="tms" name="tms" class="border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200">
                                            ${Array.from({length: 60}, (_, i) => {
                                                const val = pad2(i);
                                                return `<option value="${val}"${i===now.getSeconds()?' selected':''}>${val}</option>`;
                                            }).join('')}
                                        </select>
                                        <select id="tmapm" name="tmapm" class="border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200">
                                            <option value="1"${now.getHours()<12?' selected':''}>AM</option>
                                            <option value="2"${now.getHours()>=12?' selected':''}>PM</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Save Button -->
                    <div class="flex flex-col sm:flex-row justify-end">
                        <button 
                            type="button"
                            id="saveBtn"
                            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 w-full sm:w-auto"
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

function validateSettings() {
    // Example validations
    const ssid = document.getElementById('wifi_ssid').value.trim();
    const wifiPassword = document.getElementById('wifi_password').value;
    const deviceName = document.getElementById('device_name').value.trim();
    const googleSid = document.getElementById('googlesid').value.trim();
    const wwwid = document.getElementById('wwwid').value.trim();
    const wwwpass = document.getElementById('wwwpass').value;
    const dispname = document.getElementById('dispname').value.trim();
    const aip = document.getElementById('aip').value;
    const mip = document.getElementById('mip').value.trim();
    const gateway = document.getElementById('gateway').value.trim();

    // Required fields
    if (!ssid) return 'SSID is required.';
    if (!wifiPassword) return 'WiFi Password is required.';
    if (wifiPassword.length < 8) return 'WiFi Password must be at least 8 characters.';
    if (!deviceName) return 'Device Name is required.';
    if (!googleSid) return 'Google Script ID is required.';
    if (!wwwid) return 'Login Username is required.';
    if (!wwwpass) return 'Login Password is required.';
    if (wwwpass.length < 6) return 'Login Password must be at least 6 characters.';
    if (!dispname) return 'Organization Name is required.';

    // Manual IP validation if selected
    if (aip === '2') {
        const ipRegex = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
        if (!mip || !ipRegex.test(mip)) return 'Manual IP is invalid.';
        if (!gateway || !ipRegex.test(gateway)) return 'Gateway is invalid.';
    }

    // Date & Time validation
    const dtd = document.getElementById('dtd').value;
    const dtm = document.getElementById('dtm').value;
    const dty = document.getElementById('dty').value;
    const tmh = document.getElementById('tmh').value;
    const tmm = document.getElementById('tmm').value;
    const tms = document.getElementById('tms').value;
    if (!dtd || !dtm || !dty || !tmh || !tmm || !tms) return 'Date and Time fields are required.';

    // All validations passed
    return null;
}

async function saveSettings() {
    const saveBtn = document.getElementById('saveBtn');

    // Field validation
    const validationError = validateSettings();
    if (validationError) {
        showModal('error', validationError);
        return;
    }
    
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

    // Update to Current Time button handler
    document.getElementById('updateTimeBtn')?.addEventListener('click', () => {
        const now = new Date();
        // Date
        document.getElementById('dtd').value = now.getDate().toString().padStart(2, '0');
        document.getElementById('dtm').value = (now.getMonth() + 1).toString().padStart(2, '0');
        document.getElementById('dty').value = now.getFullYear();
        // Time
        let hour = now.getHours();
        let ampm = hour < 12 ? '1' : '2';
        hour = hour % 12;
        if (hour === 0) hour = 12;
        document.getElementById('tmh').value = hour.toString().padStart(2, '0');
        document.getElementById('tmm').value = now.getMinutes().toString().padStart(2, '0');
        document.getElementById('tms').value = now.getSeconds().toString().padStart(2, '0');
        document.getElementById('tmapm').value = ampm;
    });

    // Load initial settings
    loadSettings();
}

export default function Settings() {
    setTimeout(attachSettingsHandlers, 0);
    return renderSettings();
}