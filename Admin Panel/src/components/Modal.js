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

    // Modal configuration
    const modalConfig = {
        success: {
            icon: `<svg class="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>`,
            bgColor: 'bg-green-50',
            textColor: 'text-green-800',
            borderColor: 'border-green-200',
            iconBg: 'bg-green-100'
        },
        error: {
            icon: `<svg class="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>`,
            bgColor: 'bg-red-50',
            textColor: 'text-red-800',
            borderColor: 'border-red-200',
            iconBg: 'bg-red-100'
        },
        info: {
            icon: `<svg class="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>`,
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-800',
            borderColor: 'border-blue-200',
            iconBg: 'bg-blue-100'
        },
        warning: {
            icon: `<svg class="h-6 w-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                   </svg>`,
            bgColor: 'bg-yellow-50',
            textColor: 'text-yellow-800',
            borderColor: 'border-yellow-200',
            iconBg: 'bg-yellow-100'
        }
    };

    const config = modalConfig[type] || modalConfig.info;

    // Create modal content (no overlay, just the dialog)
    const modalContent = `
        <div class="relative transform overflow-hidden rounded-xl ${config.bgColor} border ${config.borderColor} shadow-2xl transition-all sm:w-full sm:max-w-sm p-5"
            style="min-width:340px;">
            <button type="button" 
                id="modal-close-btn"
                aria-label="Close"
                class="absolute top-3 right-3 rounded-full p-1.5 bg-white/80 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 shadow transition"
                style="line-height:0;">
                <svg class="h-5 w-5 text-gray-500 hover:text-gray-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
            <div class="flex items-start gap-3">
                <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${config.iconBg}">
                    ${config.icon}
                </div>
                <div class="flex-1">
                    <h3 class="text-lg font-semibold leading-6 ${config.textColor} mb-1" id="modal-title">
                        ${type.charAt(0).toUpperCase() + type.slice(1)}
                    </h3>
                    <div>
                        <p class="text-sm ${config.textColor}">
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

    // Close button handler to clear timeout
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
