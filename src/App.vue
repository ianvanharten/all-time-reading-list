<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">📚 Reading History</h1>
            <p class="text-gray-600">
              Track and visualize your personal library
            </p>
          </div>
          <div class="flex space-x-4">
            <button
              @click="activeTab = 'books'"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                activeTab === 'books'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 hover:text-gray-900',
              ]"
            >
              Book List
            </button>
            <button
              @click="activeTab = 'add'"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                activeTab === 'add'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 hover:text-gray-900',
              ]"
            >
              Add Book
            </button>
            <button
              @click="activeTab = 'charts'"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                activeTab === 'charts'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 hover:text-gray-900',
              ]"
            >
              Analytics
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"
        ></div>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
      >
        <div class="flex">
          <div class="text-red-400">⚠️</div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error</h3>
            <div class="mt-2 text-sm text-red-700">{{ error }}</div>
          </div>
        </div>
      </div>

      <!-- Tab Content -->
      <div v-else>
        <!-- Book List Tab -->
        <BookList v-if="activeTab === 'books'" />

        <!-- Add Book Tab -->
        <AddBookDialog v-if="activeTab === 'add'" @book-added="onBookAdded" />

        <!-- Charts Tab -->
        <div v-if="activeTab === 'charts'" class="space-y-8">
          <YearlyChart />

          <!-- Stats Cards -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="card text-center">
              <div class="text-3xl font-bold text-primary-600">
                {{ getTotalBooks }}
              </div>
              <div class="text-sm text-gray-600 mt-1">Total Books</div>
            </div>
            <div class="card text-center">
              <div class="text-3xl font-bold text-green-600">
                {{ getTotalReReads }}
              </div>
              <div class="text-sm text-gray-600 mt-1">Re-reads</div>
            </div>
            <div class="card text-center">
              <div class="text-3xl font-bold text-blue-600">
                {{ getUniqueYears.length }}
              </div>
              <div class="text-sm text-gray-600 mt-1">Years Reading</div>
            </div>
            <div class="card text-center">
              <div class="text-3xl font-bold text-purple-600">
                {{ getUniqueAuthors.length }}
              </div>
              <div class="text-sm text-gray-600 mt-1">Unique Authors</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useBooks } from "./composables/useBooks.js";
import BookList from "./components/BookList.vue";
import AddBookDialog from "./components/AddBookDialog.vue";
import YearlyChart from "./components/YearlyChart.vue";

const activeTab = ref("books");

const {
  loading,
  error,
  fetchBooks,
  getTotalBooks,
  getTotalReReads,
  getUniqueYears,
  getUniqueAuthors,
} = useBooks();

onMounted(() => {
  fetchBooks();
});

const onBookAdded = () => {
  // Switch to books tab to show the newly added book
  activeTab.value = "books";
};
</script>
