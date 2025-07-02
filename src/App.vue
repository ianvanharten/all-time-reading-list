<template>
  <div
    id="app"
    class="min-h-screen bg-gradient-to-br from-apple-gray-900 to-black"
  >
    <!-- Header -->
    <header class="glass-header sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div class="flex justify-between items-center py-8">
          <div>
            <h1 class="text-4xl font-bold text-apple-gray-100 mb-2">
              📚 My Library
            </h1>
            <p class="text-apple-gray-300 font-medium">
              Track and discover your reading journey
            </p>
          </div>
          <div class="flex space-x-2 bg-apple-gray-800 p-2 rounded-3xl">
            <button
              @click="activeTab = 'books'"
              :class="[
                'nav-tab',
                activeTab === 'books' ? 'nav-tab-active' : 'nav-tab-inactive',
              ]"
            >
              Books
            </button>
            <button
              @click="activeTab = 'add'"
              :class="[
                'nav-tab',
                activeTab === 'add' ? 'nav-tab-active' : 'nav-tab-inactive',
              ]"
            >
              Add Book
            </button>
            <button
              @click="activeTab = 'charts'"
              :class="[
                'nav-tab',
                activeTab === 'charts' ? 'nav-tab-active' : 'nav-tab-inactive',
              ]"
            >
              Insights
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="flex flex-col items-center space-y-4">
          <div
            class="animate-spin rounded-full h-12 w-12 border-2 border-apple-blue-500 border-t-transparent"
          ></div>
          <p class="text-apple-gray-300 font-medium">Loading your library...</p>
        </div>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-red-900 border border-red-800 rounded-3xl p-6 mb-8"
      >
        <div class="flex items-start">
          <div class="text-red-400 text-2xl mr-4">⚠️</div>
          <div>
            <h3 class="text-lg font-semibold text-red-200 mb-2">
              Something went wrong
            </h3>
            <p class="text-red-300">{{ error }}</p>
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
        <div v-if="activeTab === 'charts'" class="space-y-10">
          <YearlyChart />

          <!-- Stats Cards -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="stats-card from-blue-500 to-blue-600 text-white">
              <div class="text-3xl font-bold mb-2">{{ getTotalBooks }}</div>
              <div class="text-sm opacity-90 font-medium">Total Books</div>
            </div>
            <div class="stats-card from-emerald-500 to-emerald-600 text-white">
              <div class="text-3xl font-bold mb-2">{{ getTotalReReads }}</div>
              <div class="text-sm opacity-90 font-medium">Re-reads</div>
            </div>
            <div class="stats-card from-purple-500 to-purple-600 text-white">
              <div class="text-3xl font-bold mb-2">
                {{ getUniqueYears.length }}
              </div>
              <div class="text-sm opacity-90 font-medium">Years Reading</div>
            </div>
            <div class="stats-card from-orange-500 to-orange-600 text-white">
              <div class="text-3xl font-bold mb-2">
                {{ getUniqueAuthors.length }}
              </div>
              <div class="text-sm opacity-90 font-medium">Authors</div>
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
