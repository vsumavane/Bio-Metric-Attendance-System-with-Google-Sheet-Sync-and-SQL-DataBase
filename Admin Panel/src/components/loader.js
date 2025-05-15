export default function renderLoading() {
  return `
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
      <div class="flex flex-col items-center">
        <div class="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        <p class="mt-4 text-blue-700 font-semibold">Loading...</p>
      </div>
    </div>
  `;
}