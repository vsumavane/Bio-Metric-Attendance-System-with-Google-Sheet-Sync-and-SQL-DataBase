// dashboard.js
import { apiFetch } from '../utils/api';
import { navigateTo } from '../utils/router';
import { showConfirmModal, showModal } from '../components/Modal';
import { getThemeToggleButtonHTML } from '../utils/theme';
import logoIcon from '../assets/Logo.png';

function renderDashboard() {
    return `
        <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200" style="font-family: 'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;">
            <!-- Header -->
            <header class="bg-white dark:bg-gray-800 shadow transition-colors duration-300">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex flex-wrap md:flex-nowrap justify-between items-center py-4 gap-4">
      <!-- Left Section: Logo and Title -->
      <div class="flex items-center space-x-3 flex-grow md:flex-grow-0">
        <img src="${logoIcon}" alt="Logo" class="h-10 w-10" />
        <h1 class="text-xl sm:text-2xl font-bold text-blue-600 dark:text-white" style="font-family: 'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;"><span class="hidden sm:inline">BioGlyph</span> Dashboard </h1>
      </div>

      <!-- Center Section: Theme Toggle and Mobile Menu Button -->
      <div class="flex items-center space-x-3">
        <!-- Theme Toggle -->
        ${getThemeToggleButtonHTML()}

        <!-- Mobile Menu Button -->
        <button id="dashboardMenuBtn"
          class="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
          aria-label="Open menu">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <!-- Right Section: Desktop Navigation Buttons -->
      <div id="dashboardMenu"
        class="hidden md:flex items-center space-x-3 w-full md:w-auto justify-end flex-wrap">
        <button id="enrollBtn"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition">
          <svg class="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Enroll
        </button>
        <button id="settingsBtn"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md transition">
          <svg class="h-5 w-5 mr-1 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings
        </button>
        <button id="signoutBtn"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition">
          <svg class="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </div>

    <!-- Mobile Dropdown Menu -->
    <div class="md:hidden mt-3 space-y-2 hidden" id="dashboardMobileMenu">
      <button id="enrollBtnMobile"
        class="w-full inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition">
        <svg class="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
        Enroll
      </button>
      <button id="settingsBtnMobile"
        class="w-full inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md transition">
        <svg class="h-5 w-5 mr-1 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor"
          viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Settings
      </button>
      <button id="signoutBtnMobile"
        class="w-full inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition mb-2">
        <svg class="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Sign Out
      </button>
    </div>
  </div>
</header>


            <!-- Main Content -->
            <main class="max-w-7xl mx-auto py-4 sm:px-4 px-2">
                <!-- Stats Section -->
                <div class="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg transition-colors duration-200">
                        <div class="p-4">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <svg class="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div class="ml-4 w-0 flex-1">
                                    <dl>
                                        <dt class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Employees</dt>
                                        <dd class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white" id="totalEmployees">-</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg transition-colors duration-200">
                        <div class="p-4">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <svg class="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div class="ml-4 w-0 flex-1">
                                    <dl>
                                        <dt class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Active Today</dt>
                                        <dd class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white" id="activeToday">-</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg transition-colors duration-200">
                        <div class="p-4">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <svg class="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div class="ml-4 w-0 flex-1">
                                    <dl>
                                        <dt class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Last Updated</dt>
                                        <dd class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white" id="lastUpdated">-</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Table Section -->
                <div class="bg-white dark:bg-gray-800 shadow rounded-lg transition-colors duration-200">
                    <div class="px-2 py-3 border-b border-gray-200 dark:border-gray-700 sm:px-4">
                        <div class="flex flex-col sm:flex-row items-center justify-between gap-2">
                            <h2 class="text-base sm:text-lg font-medium text-gray-900 dark:text-white">Employee Records</h2>
                            <div class="flex items-center w-full sm:w-auto">
                                <div class="relative w-full sm:w-64">
                                    <input type="text" id="searchInput" placeholder="Search employees..." class="block w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-500 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm">
                                    <div class="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                        <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-xs sm:text-sm">
                            <thead class="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th scope="col" class="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Employee ID</th>
                                    <th scope="col" class="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                    <th scope="col" class="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                                    <th scope="col" class="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Position</th>
                                    <th scope="col" class="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fingerprint ID</th>
                                    <th scope="col" class="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="employeeTableBody" class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                <tr>
                                    <td colspan="6" class="px-2 sm:px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                        <div class="flex items-center justify-center">
                                            <svg class="animate-spin h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" fill="none" viewBox="0 0 24 24">
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

let dashboardDataInterval = null;

async function loadEmployeeData() {
    const tableBody = document.getElementById('employeeTableBody');
    const totalEmployees = document.getElementById('totalEmployees');
    const activeToday = document.getElementById('activeToday');
    const lastUpdated = document.getElementById('lastUpdated');
    
    if (!tableBody) return;

    try {
        const response = await apiFetch('/api/show');
        if (!response.ok) throw new Error('Failed to load employee data');

        const html = await response.text();

        // Try to extract the table rows from the HTML response
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        const table = tempDiv.querySelector('table');
        if (!table) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        <div class="flex flex-col items-center justify-center">
                            <svg class="h-12 w-12 text-gray-400 dark:text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            No employees found
                        </div>
                    </td>
                </tr>
            `;
            totalEmployees.textContent = '0';
            activeToday.textContent = '0';
            lastUpdated.textContent = new Date().toLocaleTimeString();
            return;
        }

        // Get all rows except the header
        const rows = Array.from(table.querySelectorAll('tr')).slice(1);

        // Parse employee data from each row
        const employees = rows.map(row => {
            const cells = row.querySelectorAll('td');
            return {
                employee_id: cells[1]?.textContent.trim() || '',
                name: cells[2]?.textContent.trim() || '',
                email: cells[3]?.textContent.trim() || '',
                position: cells[4]?.textContent.trim() || '',
                fpid: cells[5]?.textContent.trim() || '',
                // No last_active info in this response, so leave blank
                last_active: ''
            };
        });

        // Update stats
        totalEmployees.textContent = employees.length;
        activeToday.textContent = '-'; // Not available in this response
        lastUpdated.textContent = new Date().toLocaleTimeString();
        
        if (employees.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        <div class="flex flex-col items-center justify-center">
                            <svg class="h-12 w-12 text-gray-400 dark:text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">${employee.employee_id}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">${employee.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">${employee.email}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">${employee.position}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">${employee.fpid}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <button 
                        onclick="deleteEmployee('${employee.employee_id}')"
                        class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-700"
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
    const confirmed = await showConfirmModal('Are you sure you want to delete this employee? This action cannot be undone.');
    if (!confirmed) {
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
    // Clear previous interval if any
    if (dashboardDataInterval) {
        clearInterval(dashboardDataInterval);
        dashboardDataInterval = null;
    }

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
 
  setTimeout(() => {
    function handleResize() {
      const mobileMenu = document.getElementById("dashboardMobileMenu");
      if (window.innerWidth >= 768 && mobileMenu) {
        mobileMenu.style.display = "none";
      }
    }
    window.addEventListener("resize", handleResize);
    handleResize();
  }, 0);
  
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
        // Clear interval on signout
        if (dashboardDataInterval) {
            clearInterval(dashboardDataInterval);
            dashboardDataInterval = null;
        }
        try {
            await apiFetch('/api/signout', { method: 'POST' });
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

    // Refresh data every 30 seconds, clear previous if any
    dashboardDataInterval = setInterval(loadEmployeeData, 30000);
}

export default function Dashboard() {
    setTimeout(attachDashboardHandlers, 0);
    return renderDashboard();
}
