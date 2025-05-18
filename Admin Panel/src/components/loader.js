export default function renderLoading() {
  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div class="flex flex-col items-center space-y-4">
        <!-- Animated Spinner -->
        <div class="relative">
          <div class="w-16 h-16 border-4 border-blue-500 dark:border-blue-400 border-dashed rounded-full animate-spin"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-8 h-8 rounded-full bg-white dark:bg-gray-800"></div>
          </div>
        </div>
        <!-- Loading Text -->
        <div class="flex flex-col items-center space-y-1">
          <p class="text-blue-700 dark:text-blue-400 font-semibold">Loading</p>
          <div class="flex space-x-1">
            <span class="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
            <span class="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
            <span class="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Function to show loader
export function showLoader() {
  // Remove any existing loader
  const existingLoader = document.getElementById('page-loader');
  if (existingLoader) {
    existingLoader.remove();
  }

  // Create and append loader
  const loaderContainer = document.createElement('div');
  loaderContainer.id = 'page-loader';
  loaderContainer.innerHTML = renderLoading();
  document.body.appendChild(loaderContainer);
}

// Function to hide loader
export function hideLoader() {
  const loader = document.getElementById('page-loader');
  if (loader) {
    // Add fade out animation
    loader.style.opacity = '0';
    loader.style.transition = 'opacity 0.3s ease-out';
    
    // Remove after animation
    setTimeout(() => {
      loader.remove();
    }, 300);
  }
}