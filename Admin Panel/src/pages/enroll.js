// enroll.js

import { apiFetch } from '../utils/api';
import { navigateTo } from '../utils/router';
import { showConfirmModal, showModal } from '../components/Modal';
import { getThemeToggleButtonHTML } from '../utils/theme';

function renderEnrollForm() {
    return `
        <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
            <div class="max-w-md mx-auto">
                <div class="bg-white dark:bg-gray-800 shadow rounded-lg transition-colors duration-200">
                    <div class="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6 flex items-center justify-between">
                        <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white flex-1">Enroll Employee</h2>
                        <div class="ml-4 flex-shrink-0">
                            ${getThemeToggleButtonHTML()}
                        </div>
                    </div>
                    <div class="px-4 py-5 sm:p-6">
                        <form id="enrollForm" class="space-y-6">
                            <div>
                                <label for="employeeId" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Employee ID</label>
                                <input 
                                    type="text" 
                                    id="employeeId"
                                    name="employee_id" 
                                    required
                                    class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                                >
                            </div>
                            <div>
                                <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                                <input 
                                    type="text" 
                                    id="name"
                                    name="name" 
                                    required
                                    class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                                >
                            </div>
                            <div>
                                <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                                <input 
                                    type="email" 
                                    id="email"
                                    name="email" 
                                    required
                                    class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                                >
                            </div>
                            <div>
                                <label for="position" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Position</label>
                                <input 
                                    type="text" 
                                    id="position"
                                    name="position" 
                                    required
                                    class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                                >
                            </div>
                            <div>
                                <label for="fpid" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Fingerprint ID</label>
                                <input 
                                    type="text" 
                                    id="fpid"
                                    name="fpid" 
                                    required
                                    readonly
                                    class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                                >
                            </div>
                            <div class="flex space-x-3">
                                <button 
                                    type="button"
                                    id="cancelBtn"
                                    class="flex-1 inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    id="submitBtn"
                                    class="flex-1 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                    Enroll
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function pollFingerprintId() {
    try {
        const response = await apiFetch('/api/getfpid');
        if (!response.ok) throw new Error('Failed to get fingerprint ID');
        
        const fpid = await response.text();
        if (fpid) {
            document.getElementById('fpid').value = fpid;
        }
    } catch (error) {
        console.error('Error polling fingerprint ID:', error);
    }
}

function attachEnrollHandlers() {
    const form = document.getElementById('enrollForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const submitBtn = document.getElementById('submitBtn');

    if (!form || !cancelBtn || !submitBtn) return;

    // Start polling for fingerprint ID
    const pollInterval = setInterval(pollFingerprintId, 1000);

    // Cancel button handler
    cancelBtn.addEventListener('click', () => {
        clearInterval(pollInterval);
        navigateTo('/dashboard');
    });

    // Form submit handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const confirmed = await showConfirmModal('Are you sure you want to enroll this employee? The page will automatically redirect when the process is complete.');
        if (!confirmed) {
            return;
        }

        // Disable form
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enrolling...';

        try {
            const formData = new URLSearchParams({
                memployee_id: form.employee_id.value.trim(),
                mname: form.name.value.trim(),
                memail_id: form.email.value.trim(),
                mpos: form.position.value.trim(),
                mfpid: form.fpid.value.trim()
            });

            const response = await apiFetch('/api/insert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData.toString()
            });

            if (!response.ok) throw new Error('Failed to enroll employee');

            // Stop polling and redirect
            clearInterval(pollInterval);
            showModal('success', 'Employee enrolled successfully!');
            setTimeout(() => navigateTo('/dashboard'), 1500);
        } catch (error) {
            showModal('error', 'Error enrolling employee: ' + error.message);
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enroll';
        }
    });
}

export default function Enroll() {
    setTimeout(attachEnrollHandlers, 0);
    return renderEnrollForm();
}