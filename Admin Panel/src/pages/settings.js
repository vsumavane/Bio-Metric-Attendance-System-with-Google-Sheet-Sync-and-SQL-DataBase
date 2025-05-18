import { apiFetch } from '../utils/api';
import { navigateTo } from '../utils/router';
import { showModal } from '../components/Modal';
import { getThemeToggleButtonHTML } from '../utils/theme';

// Date utility functions
const dateUtils = {
    pad2: (n) => n.toString().padStart(2, '0'),
    
    getDaysInMonth: (month, year) => new Date(year, month, 0).getDate(),
    
    formatDate: (date) => ({
        day: dateUtils.pad2(date.getDate()),
        month: dateUtils.pad2(date.getMonth() + 1),
        year: date.getFullYear(),
        hour: dateUtils.pad2((date.getHours() % 12) || 12),
        minute: dateUtils.pad2(date.getMinutes()),
        second: dateUtils.pad2(date.getSeconds()),
        ampm: date.getHours() < 12 ? '1' : '2'
    }),
    
    isValidDate: (day, month, year) => {
        const date = new Date(year, month - 1, day);
        return date.getDate() === day && 
               date.getMonth() === month - 1 && 
               date.getFullYear() === year;
    }
};

function renderSettings() {
    // Helper to generate day options based on month and year
    function getDayOptions(month, year) {
        const daysInMonth = dateUtils.getDaysInMonth(month, year);
        return Array.from({length: daysInMonth}, (_, i) => {
            const val = dateUtils.pad2(i + 1);
            return `<option value="${val}">${i + 1}</option>`;
        }).join('');
    }

    // Get current date for defaults
    const now = new Date();
    const currentDate = dateUtils.formatDate(now);

    // Years range
    const years = Array.from({length: 9}, (_, i) => 2022 + i);

    // Helper to format numbers to two digits
    function pad2(n) {
        return n.toString().padStart(2, '0');
    }

    // Define settings sections and fields as an object
    const settingsSections = [
        {
            title: "WiFi Settings",
            fields: [
                {
                    label: "SSID",
                    id: "wifi_ssid",
                    type: "text",
                    placeholder: "SSID",
                },
                {
                    label: "WiFi Password",
                    id: "wifi_password",
                    type: "password",
                    placeholder: "Password",
                }
            ]
        },
        {
            title: "Device & Google Script",
            fields: [
                {
                    label: "Device Name",
                    id: "device_name",
                    type: "text",
                    placeholder: "Device Name",
                },
                {
                    label: "Google Script ID",
                    id: "googlesid",
                    type: "text",
                    placeholder: "Google Script ID",
                },
                {
                    label: "Login Username",
                    id: "wwwid",
                    type: "text",
                    placeholder: "Login Username",
                },
                {
                    label: "Login Password",
                    id: "wwwpass",
                    type: "password",
                    placeholder: "Login Password",
                }
            ]
        },
        {
            title: "Organization & Network",
            fields: [
                {
                    label: "Organization Name",
                    id: "dispname",
                    type: "text",
                    placeholder: "Organization Name",
                },
                {
                    label: "IP Mode",
                    id: "aip",
                    type: "select",
                    options: [
                        { value: "1", text: "Auto IP" },
                        { value: "2", text: "Manual IP" }
                    ]
                },
                {
                    label: "Manual IP",
                    id: "mip",
                    type: "text",
                    placeholder: "Manual IP",
                },
                {
                    label: "Gateway",
                    id: "gateway",
                    type: "text",
                    placeholder: "Gateway",
                }
            ]
        }
    ];

    // Helper to render fields
    function renderField(field) {
        if (field.type === "select") {
            return `
                <div class="flex flex-col">
                    <label for="${field.id}" class="block text-sm font-medium text-gray-700 dark:text-gray-300">${field.label}</label>
                    <select 
                        id="${field.id}" 
                        name="${field.id}" 
                        disabled
                        class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        ${field.options.map(opt => `<option value="${opt.value}">${opt.text}</option>`).join('')}
                    </select>
                </div>
            `;
        } else {
            return `
                <div class="flex flex-col">
                    <label for="${field.id}" class="block text-sm font-medium text-gray-700 dark:text-gray-300">${field.label}</label>
                    <input 
                        type="${field.type}" 
                        id="${field.id}"
                        name="${field.id}" 
                        disabled
                        placeholder="${field.placeholder || ''}"
                        class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                </div>
            `;
        }
    }

    // Render settings sections using the object
    const settingsSectionsHTML = settingsSections.map(section => `
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg transition-colors duration-200">
            <div class="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
                <h2 class="text-lg font-medium text-gray-900 dark:text-white">${section.title}</h2>
            </div>
            <div class="px-4 py-5 sm:p-6">
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    ${section.fields.map(field => `<div>${renderField(field)}</div>`).join('')}
                </div>
            </div>
        </div>
    `).join('');

    // Month mapping object
    const months = [
        { value: "01", text: "January" },
        { value: "02", text: "February" },
        { value: "03", text: "March" },
        { value: "04", text: "April" },
        { value: "05", text: "May" },
        { value: "06", text: "June" },
        { value: "07", text: "July" },
        { value: "08", text: "August" },
        { value: "09", text: "September" },
        { value: "10", text: "October" },
        { value: "11", text: "November" },
        { value: "12", text: "December" }
    ];

    const dateTimeSection = `
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg transition-colors duration-200">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6 gap-3">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Date & Time</h2>
                <button
                    type="button"
                    id="updateTimeBtn"
                    class="inline-flex items-center px-4 py-2 border border-blue-600 dark:border-blue-400 text-sm font-medium rounded-md text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    title="Set to current date and time"
                >
                    <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Update to Current Time & Date
                </button>
            </div>
            <div class="px-4 py-5 sm:p-6">
                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex-1">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
                        <div class="flex flex-row gap-2 w-full">
                            <select id="dtd" name="dtd" disabled class="flex-1 min-w-0 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                                ${getDayOptions(currentDate.month, currentDate.year)}
                            </select>
                            <select id="dtm" name="dtm" disabled class="flex-1 min-w-0 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                                ${months.map((m, i) => `<option value="${m.value}"${currentDate.month === m.value ? ' selected' : ''}>${m.text}</option>`).join('')}
                            </select>
                            <select id="dty" name="dty" disabled class="flex-1 min-w-0 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                                ${years.map(y => `<option value="${y}"${currentDate.year === y ? ' selected' : ''}>${y}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    <div class="flex-1 mt-4 md:mt-0">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time</label>
                        <div class="flex flex-row gap-2 w-full">
                            <select id="tmh" name="tmh" disabled class="flex-1 min-w-0 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                                ${Array.from({length: 12}, (_, i) => {
                                    const val = dateUtils.pad2(i + 1);
                                    return `<option value="${val}"${val === currentDate.hour ? ' selected' : ''}>${val}</option>`;
                                }).join('')}
                            </select>
                            <select id="tmm" name="tmm" disabled class="flex-1 min-w-0 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                                ${Array.from({length: 60}, (_, i) => {
                                    const val = dateUtils.pad2(i);
                                    return `<option value="${val}"${val === currentDate.minute ? ' selected' : ''}>${val}</option>`;
                                }).join('')}
                            </select>
                            <select id="tms" name="tms" disabled class="flex-1 min-w-0 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                                ${Array.from({length: 60}, (_, i) => {
                                    const val = dateUtils.pad2(i);
                                    return `<option value="${val}"${val === currentDate.second ? ' selected' : ''}>${val}</option>`;
                                }).join('')}
                            </select>
                            <select id="tmapm" name="tmapm" disabled class="flex-1 min-w-0 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                                <option value="1"${currentDate.ampm === '1' ? ' selected' : ''}>AM</option>
                                <option value="2"${currentDate.ampm === '2' ? ' selected' : ''}>PM</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Return the full settings page
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
                        <!-- Right: Theme toggle and Edit mode toggle -->
                        <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full sm:w-auto mt-4 sm:mt-0">
                            <div class="flex items-center space-x-4">
                                ${getThemeToggleButtonHTML()}
                                <button
                                    type="button"
                                    id="editModeToggle"
                                    class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                >
                                    <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                    Edit Mode
                                </button>
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
                    ${settingsSectionsHTML}
                    ${dateTimeSection}
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
        const response = await apiFetch('/api/settings');
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
    
    if (!dtd || !dtm || !dty || !tmh || !tmm || !tms) {
        return 'Date and Time fields are required.';
    }

    // Validate date using the new utility
    if (!dateUtils.isValidDate(parseInt(dtd), parseInt(dtm), parseInt(dty))) {
        return 'Invalid date selected.';
    }

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

function attachDayOptionsHandler() {
    const daySelect = document.getElementById('dtd');
    const monthSelect = document.getElementById('dtm');
    const yearSelect = document.getElementById('dty');
    if (!daySelect || !monthSelect || !yearSelect) return;

    function updateDays() {
        const month = parseInt(monthSelect.value, 10);
        const year = parseInt(yearSelect.value, 10);
        const daysInMonth = dateUtils.getDaysInMonth(month, year);
        const currentDay = parseInt(daySelect.value, 10) || 1;
        daySelect.innerHTML = Array.from({length: daysInMonth}, (_, i) => {
            const val = dateUtils.pad2(i + 1);
            return `<option value="${val}"${i + 1 === currentDay ? ' selected' : ''}>${i + 1}</option>`;
        }).join('');
    }

    monthSelect.addEventListener('change', updateDays);
    yearSelect.addEventListener('change', updateDays);
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
        const currentDate = dateUtils.formatDate(new Date());
        
        // Update date fields
        document.getElementById('dtd').value = currentDate.day;
        document.getElementById('dtm').value = currentDate.month;
        document.getElementById('dty').value = currentDate.year;
        
        // Update time fields
        document.getElementById('tmh').value = currentDate.hour;
        document.getElementById('tmm').value = currentDate.minute;
        document.getElementById('tms').value = currentDate.second;
        document.getElementById('tmapm').value = currentDate.ampm;
    });

    // Add universal edit mode toggle handler
    const editModeToggle = document.getElementById('editModeToggle');
    let isEditMode = false;

    editModeToggle.addEventListener('click', () => {
        isEditMode = !isEditMode;
        
        // Toggle all input fields
        document.querySelectorAll('input, select').forEach(field => {
            field.disabled = !isEditMode;
        });

        // Update toggle button appearance
        editModeToggle.classList.toggle('bg-blue-50', isEditMode);
        editModeToggle.classList.toggle('text-blue-600', isEditMode);
        editModeToggle.classList.toggle('border-blue-600', isEditMode);
        
        // Update button text and icon
        editModeToggle.innerHTML = `
            <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${isEditMode ? 'M5 13l4 4L19 7' : 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'}" />
            </svg>
            ${isEditMode ? 'Done Editing' : 'Edit Mode'}
        `;

        // Toggle save button visibility
        const saveBtn = document.getElementById('saveBtn');
        saveBtn.style.display = isEditMode ? 'inline-flex' : 'none';
    });

    // Initially hide save button
    document.getElementById('saveBtn').style.display = 'none';

    attachDayOptionsHandler();
    loadSettings();
}

export default function Settings() {
    setTimeout(attachSettingsHandlers, 0);
    return renderSettings();
}