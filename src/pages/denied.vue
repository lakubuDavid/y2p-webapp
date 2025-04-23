<script setup lang="ts">
// AccessDenied.vue
import { useRouter } from "vue-router";

const router = useRouter();

const goBack = () => {
  router.back();
};

const goHome = () => {
  router.push("/");
};
</script>

<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen py-12 px-4"
  >
    <div
      class="bg-white dark:bg-gray-800 shadow-xl rounded-lg max-w-md w-full p-8 text-center"
    >
      <div class="mb-6">
        <div
          class="inline-flex items-center justify-center h-24 w-24 rounded-full bg-red-100 text-red-500 mb-4"
        >
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 6C12.5523 6 13 6.44772 13 7V13C13 13.5523 12.5523 14 12 14C11.4477 14 11 13.5523 11 13V7C11 6.44772 11.4477 6 12 6Z"
              fill="currentColor"
            />
            <path
              d="M12 16C11.4477 16 11 16.4477 11 17C11 17.5523 11.4477 18 12 18C12.5523 18 13 17.5523 13 17C13 16.4477 12.5523 16 12 16Z"
              fill="currentColor"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>

      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Access Denied
      </h1>
      <p class="text-gray-600 dark:text-gray-300 mb-6">
        You don't have permission to access this resource. Please contact your
        administrator if you believe this is an error.
      </p>

      <div class="flex justify-center gap-15px space-x-4">
        <button
          @click="goBack"
          class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
        >
          Go Back
        </button>
        <button
          @click="goHome"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-200"
        >
          Go Home
        </button>
      </div>
    </div>
  </div>
</template>
