export function showModal(type, message, duration = 3000) {
    // Remove any existing modal
    const existingModal = document.getElementById('modal-container');
    if (existingModal) {
        if(existingModal._timeoutId) {
            clearTimeout(existingModal._timeoutId); // Clear the existing timeout
        }
        existingModal.remove();
    }

    // Create modal container
    const modalContainer = document.createElement('div');
    modalContainer.id = 'modal-container';
    modalContainer.className = 'fixed z-50';
    modalContainer.setAttribute('aria-labelledby', 'modal-title');
    modalContainer.setAttribute('role', 'dialog');
    modalContainer.setAttribute('aria-modal', 'true');
    // Position bottom right
    modalContainer.style.right = '1.5rem';
    modalContainer.style.bottom = '1.5rem';
    modalContainer.style.top = 'auto';
    modalContainer.style.left = 'auto';

    // Modal configuration with dark mode support
    const modalConfig = {
        success: {
            icon: `<svg class="h-6 w-6 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>`,
            bgColor: 'bg-green-50 dark:bg-green-900/50',
            textColor: 'text-green-800 dark:text-green-200',
            borderColor: 'border-green-200 dark:border-green-800',
            iconBg: 'bg-green-100 dark:bg-green-800'
        },
        error: {
            icon: `<svg class="h-6 w-6 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>`,
            bgColor: 'bg-red-50 dark:bg-red-900/50',
            textColor: 'text-red-800 dark:text-red-200',
            borderColor: 'border-red-200 dark:border-red-800',
            iconBg: 'bg-red-100 dark:bg-red-800'
        },
        info: {
            icon: `<svg class="h-6 w-6 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>`,
            bgColor: 'bg-blue-50 dark:bg-blue-900/50',
            textColor: 'text-blue-800 dark:text-blue-200',
            borderColor: 'border-blue-200 dark:border-blue-800',
            iconBg: 'bg-blue-100 dark:bg-blue-800'
        },
        warning: {
            icon: `<svg class="h-6 w-6 text-yellow-500 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                   </svg>`,
            bgColor: 'bg-yellow-50 dark:bg-yellow-900/50',
            textColor: 'text-yellow-800 dark:text-yellow-200',
            borderColor: 'border-yellow-200 dark:border-yellow-800',
            iconBg: 'bg-yellow-100 dark:bg-yellow-800'
        }
    };

    const config = modalConfig[type] || modalConfig.info;

    // Create modal content with dark mode support
    const modalContent = `
        <div class="relative transform overflow-hidden rounded-xl ${config.bgColor} border ${config.borderColor} shadow-2xl transition-all w-full max-w-xs sm:max-w-sm p-4 sm:p-5 dark:shadow-gray-900/50"
             style="min-width:0;">
            <button type="button" 
                id="modal-close-btn"
                aria-label="Close"
                class="absolute top-2 right-2 sm:top-3 sm:right-3 rounded-full p-1 bg-white/80 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:focus:ring-gray-600 shadow transition"
                style="line-height:0;">
                <svg class="h-5 w-5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
            <div class="flex items-start gap-2 sm:gap-3">
                <div class="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-full ${config.iconBg}">
                    ${config.icon}
                </div>
                <div class="flex-1 min-w-0">
                    <h3 class="text-base sm:text-lg font-semibold leading-6 ${config.textColor} mb-0.5 sm:mb-1" id="modal-title">
                        ${type.charAt(0).toUpperCase() + type.slice(1)}
                    </h3>
                    <div>
                        <p class="text-xs sm:text-sm ${config.textColor} break-words">
                            ${message}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add modal content to container
    modalContainer.innerHTML = modalContent;

    // Add modal to document
    document.body.appendChild(modalContainer);

    // Add slide-in animation from right
    const modal = modalContainer.querySelector('.transform');
    modal.style.opacity = '0';
    modal.style.transform = 'translateX(100%) scale(0.95)';
    setTimeout(() => {
        modal.style.transition = 'all 0.3s cubic-bezier(0.4,0,0.2,1)';
        modal.style.opacity = '1';
        modal.style.transform = 'translateX(0) scale(1)';
    }, 10);

    // Auto close after duration
    let timeoutId = null;
    if (duration > 0) {
      const modal = document.getElementById("modal-container");
      timeoutId = setTimeout(() => {
        if (modal) {
          const modalElement = modal.querySelector(".transform");
          modalElement.style.opacity = "0";
          modalElement.style.transform = "translateX(100%) scale(0.95)";
          setTimeout(() => modal.remove(), 300);
        }
      }, duration);
      modal._timeoutId = timeoutId; // Store the timeout ID for later reference
    }

    // Close button handler
    const closeBtn = modalContainer.querySelector('#modal-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (timeoutId) clearTimeout(timeoutId);
            const modalElement = modalContainer.querySelector('.transform');
            modalElement.style.opacity = '0';
            modalElement.style.transform = 'translateX(100%) scale(0.95)';
            setTimeout(() => modalContainer.remove(), 300);
        });
    }
}

export function showConfirmModal(message, confirmText = 'Confirm', cancelText = 'Cancel') {
    return new Promise((resolve) => {
        // Remove any existing modal
        const existingModal = document.getElementById('modal-container');
        if (existingModal) {
            if(existingModal._timeoutId) {
                clearTimeout(existingModal._timeoutId);
            }
            existingModal.remove();
        }

        // Create modal container
        const modalContainer = document.createElement('div');
        modalContainer.id = 'modal-container';
        modalContainer.className = 'fixed z-50';
        modalContainer.setAttribute('aria-labelledby', 'modal-title');
        modalContainer.setAttribute('role', 'dialog');
        modalContainer.setAttribute('aria-modal', 'true');
        modalContainer.style.right = '1.5rem';
        modalContainer.style.bottom = '1.5rem';
        modalContainer.style.top = 'auto';
        modalContainer.style.left = 'auto';

        // Create modal content
        const modalContent = `
            <div class="fixed inset-0 flex items-center justify-center z-50 bg-black/30 dark:bg-black/50">
                <div class="relative transform overflow-hidden rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl transition-all w-full max-w-xs sm:max-w-sm p-4 sm:p-5 dark:shadow-gray-900/50 scale-95 opacity-0"
                     style="min-width:0;">
                    <div class="flex items-start gap-2 sm:gap-3">
                        <div class="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800">
                            <svg class="h-6 w-6 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div class="flex-1 min-w-0">
                            <h3 class="text-base sm:text-lg font-semibold leading-6 text-gray-900 dark:text-gray-100 mb-0.5 sm:mb-1" id="modal-title">
                                Confirm Action
                            </h3>
                            <div>
                                <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 break-words mb-4">
                                    ${message}
                                </p>
                                <div class="flex gap-2 justify-end">
                                    <button type="button" 
                                        id="modal-cancel-btn"
                                        class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:focus:ring-gray-600 transition">
                                        ${cancelText}
                                    </button>
                                    <button type="button" 
                                        id="modal-confirm-btn"
                                        class="px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition">
                                        ${confirmText}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add modal content to container
        modalContainer.innerHTML = modalContent;

        // Add modal to document
        document.body.appendChild(modalContainer);

        // Animation: zoom and fade in only (no slide)
        const modal = modalContainer.querySelector('.transform');
        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.95)';
        setTimeout(() => {
            modal.style.transition = 'all 0.3s cubic-bezier(0.4,0,0.2,1)';
            modal.style.opacity = '1';
            modal.style.transform = 'scale(1)';
        }, 10);

        // Button handlers
        const confirmBtn = modalContainer.querySelector('#modal-confirm-btn');
        const cancelBtn = modalContainer.querySelector('#modal-cancel-btn');

        const closeModal = (result) => {
            const modalElement = modalContainer.querySelector('.transform');
            modalElement.style.opacity = '0';
            modalElement.style.transform = 'scale(0.95)';
            setTimeout(() => {
                modalContainer.remove();
                resolve(result);
            }, 300);
        };

        confirmBtn.addEventListener('click', () => closeModal(true));
        cancelBtn.addEventListener('click', () => closeModal(false));
    });
}
