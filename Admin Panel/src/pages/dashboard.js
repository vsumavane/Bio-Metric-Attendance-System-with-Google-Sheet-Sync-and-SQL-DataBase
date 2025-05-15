// dashboard.js
import { apiFetch } from '../utils/api';
import { navigateTo } from '../utils/router';
import { showModal } from '../components/Modal';

function renderDashboard() {
    return `
        <div class="min-h-screen bg-gray-50">
            <!-- Header -->
            <header class="bg-white shadow">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex flex-col md:flex-row justify-between items-center py-6 gap-4">
                        <div class="flex items-center w-full md:w-auto justify-between">
                            <!-- Logo Placeholder -->
                            <div class="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                                <span class="text-gray-400 text-lg font-bold">BG</span>
                            </div>
                            <h1 class="text-2xl font-bold text-gray-900">BioGlyph Admin Panel</h1>
                            <!-- Burger menu button (mobile only) -->
                            <button id="dashboardMenuBtn" class="md:hidden ml-auto inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100" aria-label="Open menu">
                                <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                                </svg>
                            </button>
                        </div>
                        <!-- Desktop menu -->
                        <div class="hidden md:flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full md:w-auto" id="dashboardMenu">
                            <button class="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200" id="enrollBtn">
                                <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                                Enroll
                            </button>
                            <button class="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200" id="settingsBtn">
                                <svg class="h-5 w-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Settings
                            </button>
                            <button class="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200" id="signoutBtn">
                                <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Sign Out
                            </button>
                        </div>
                    </div>
                    <!-- Mobile menu, hidden by default -->
                    <div class="md:hidden" id="dashboardMobileMenu" style="display:none;">
                        <div class="flex flex-col space-y-2 mt-4">
                            <button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200" id="enrollBtnMobile">
                                <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                                Enroll
                            </button>
                            <button class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200" id="settingsBtnMobile">
                                <svg class="h-5 w-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Settings
                            </button>
                            <button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200" id="signoutBtnMobile">
                                <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Main Content -->
            <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <!-- Stats Section -->
                <div class="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <div class="bg-white overflow-hidden shadow rounded-lg">
                        <div class="p-5">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div class="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt class="text-sm font-medium text-gray-500 truncate">Total Employees</dt>
                                        <dd class="text-lg font-semibold text-gray-900" id="totalEmployees">-</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white overflow-hidden shadow rounded-lg">
                        <div class="p-5">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div class="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt class="text-sm font-medium text-gray-500 truncate">Active Today</dt>
                                        <dd class="text-lg font-semibold text-gray-900" id="activeToday">-</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white overflow-hidden shadow rounded-lg">
                        <div class="p-5">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div class="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt class="text-sm font-medium text-gray-500 truncate">Last Updated</dt>
                                        <dd class="text-lg font-semibold text-gray-900" id="lastUpdated">-</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Table Section -->
                <div class="bg-white shadow rounded-lg">
                    <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
                        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <h2 class="text-lg font-medium text-gray-900">Employee Records</h2>
                            <div class="flex items-center w-full sm:w-auto">
                                <div class="relative w-full sm:w-64">
                                    <input type="text" id="searchInput" placeholder="Search employees..." class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fingerprint ID</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="employeeTableBody" class="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
                                        <div class="flex items-center justify-center">
                                            <svg class="animate-spin h-5 w-5 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24">
                                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Loading...
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    `;
}

async function loadEmployeeData() {
    const tableBody = document.getElementById('employeeTableBody');
    const totalEmployees = document.getElementById('totalEmployees');
    const activeToday = document.getElementById('activeToday');
    const lastUpdated = document.getElementById('lastUpdated');
    
    if (!tableBody) return;

    try {
        const response = await apiFetch('/show');
        if (!response.ok) throw new Error('Failed to load employee data');
        
        const employees = await response.json();
        
        // Update stats
        totalEmployees.textContent = employees.length;
        activeToday.textContent = employees.filter(e => e.last_active === new Date().toISOString().split('T')[0]).length;
        lastUpdated.textContent = new Date().toLocaleTimeString();
        
        if (employees.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
                        <div class="flex flex-col items-center justify-center">
                            <svg class="h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            No employees found
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        // Render employee table
        tableBody.innerHTML = employees.map(employee => `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${employee.employee_id}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${employee.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${employee.email}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${employee.position}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${employee.fpid}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button 
                        onclick="deleteEmployee('${employee.employee_id}')"
                        class="text-red-600 hover:text-red-900"
                    >
                        Delete
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        showModal('error', 'Error loading employee data: ' + error.message);
    }
}

async function deleteEmployee(employeeId) {
    if (!confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
        return;
    }

    try {
        const response = await apiFetch('/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ employee_id: employeeId })
        });

        if (!response.ok) throw new Error('Failed to delete employee');
        
        showModal('success', 'Employee deleted successfully!');
        await loadEmployeeData();
    } catch (error) {
        showModal('error', 'Error deleting employee: ' + error.message);
    }
}

function attachDashboardHandlers() {
    // Burger menu toggle logic
    const menuBtn = document.getElementById('dashboardMenuBtn');
    const mobileMenu = document.getElementById('dashboardMobileMenu');
    if (menuBtn && mobileMenu) {
        menuBtn.onclick = function() {
            if (mobileMenu.style.display === 'none' || !mobileMenu.style.display) {
                mobileMenu.style.display = 'block';
            } else {
                mobileMenu.style.display = 'none';
            }
        };
    }
    // Mobile menu button handlers
    const enrollBtnMobile = document.getElementById('enrollBtnMobile');
    const settingsBtnMobile = document.getElementById('settingsBtnMobile');
    const signoutBtnMobile = document.getElementById('signoutBtnMobile');
    if (enrollBtnMobile) enrollBtnMobile.onclick = () => document.getElementById('enrollBtn')?.click();
    if (settingsBtnMobile) settingsBtnMobile.onclick = () => document.getElementById('settingsBtn')?.click();
    if (signoutBtnMobile) signoutBtnMobile.onclick = () => document.getElementById('signoutBtn')?.click();

    // Attach button handlers
    document.getElementById('enrollBtn')?.addEventListener('click', () => {
        navigateTo('/enroll');
    });

    document.getElementById('settingsBtn')?.addEventListener('click', () => {
        navigateTo('/settings');
    });

    document.getElementById('signoutBtn')?.addEventListener('click', async () => {
        try {
            await apiFetch('/signout', { method: 'POST' });
            navigateTo('/');
        } catch (error) {
            showModal('error', 'Error signing out: ' + error.message);
        }
    });

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('#employeeTableBody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }

    // Load initial data
    loadEmployeeData();

    // Refresh data every 30 seconds
    setInterval(loadEmployeeData, 30000);
}

export default function Dashboard() {
    setTimeout(attachDashboardHandlers, 0);
    return renderDashboard();
}
