<template>
  <div class="space-y-8">
    <!-- Collapsible Filters -->
    <details class="mb-8">
      <summary class="cursor-pointer text-apple-gray-300 font-semibold text-lg hover:text-apple-gray-100 transition-colors duration-200 list-none">
        <span class="flex items-center">
          📋 Filter & Sort
          <svg class="w-5 h-5 ml-2 transform transition-transform duration-200 details-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </span>
      </summary>

      <div class="mt-4 pt-4 border-t border-apple-gray-700">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Search -->
          <div>
            <label class="block text-sm font-semibold text-apple-gray-300 mb-2"
              >Search</label
            >
            <input
              v-model="filters.search"
              type="text"
              placeholder="Search titles or authors..."
              class="simple-input"
            />
          </div>

          <!-- Year Filter -->
          <div>
            <label class="block text-sm font-semibold text-apple-gray-300 mb-2"
              >Year</label
            >
            <select v-model="filters.year" class="simple-select">
              <option value="">All Years</option>
              <option v-for="year in getUniqueYears" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>

          <!-- Sort By -->
          <div>
            <label class="block text-sm font-semibold text-apple-gray-300 mb-2"
              >Sort By</label
            >
            <select v-model="sortBy" class="simple-select">
              <option value="year">Year</option>
              <option value="title">Title</option>
              <option value="author">Author</option>
            </select>
          </div>

          <!-- Sort Order -->
          <div>
            <label class="block text-sm font-semibold text-apple-gray-300 mb-2"
              >Order</label
            >
            <select v-model="sortOrder" class="simple-select">
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>

        <!-- Results Count -->
        <div class="mt-4">
          <p class="text-apple-gray-400 text-sm">
            Showing {{ getTotalFilteredBooks }} of {{ allBooks.length }} books
          </p>
        </div>
      </div>
    </details>

    <!-- Grouped Book Grid -->
    <div class="space-y-12">
      <div v-for="group in groupedBooks" :key="`${group.year}-${group.month}`">
        <!-- Year/Month Heading -->
        <div class="year-month-heading">
          <h3 class="text-2xl font-bold text-apple-gray-100">
            {{ group.year }}
            <span v-if="group.month && group.month !== 'Unknown'" class="text-apple-gray-300">
              • {{ group.month }}
            </span>
          </h3>
        </div>

        <!-- Books Grid - Wider cards with fewer columns -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          <div
            v-for="book in group.books"
            :key="book.id || `${book.title}-${book.author}`"
            class="book-card"
          >
            <!-- Book Cover -->
            <div class="mb-4 relative overflow-hidden rounded-xl bg-apple-gray-700 flex items-center justify-center">
              <img
                :src="getBookCoverUrl(book)"
                :alt="`Cover of ${book.title}`"
                class="w-full h-48 object-contain"
                @error="handleImageError"
                loading="lazy"
              />
            </div>

            <!-- Book Info -->
            <div class="space-y-3">
              <h4
                class="font-bold text-lg text-apple-gray-100 line-clamp-2 leading-tight"
              >
                {{ book.title }}
              </h4>
              <p class="text-apple-gray-300 text-base font-medium line-clamp-2">
                {{ book.author }}
              </p>

              <!-- Badges -->
              <div class="flex flex-wrap gap-1">
                <span v-if="book.reread" class="badge badge-reread text-sm">
                  🔄 Re-read
                </span>
              </div>

              <!-- Notes -->
              <div
                v-if="book.notes"
                class="text-sm text-apple-gray-400 mt-3 p-3 bg-apple-gray-700 rounded-lg"
              >
                <p class="italic leading-relaxed line-clamp-3">"{{ book.notes }}"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="groupedBooks.length === 0" class="text-center py-20">
      <div class="text-apple-gray-600 text-8xl mb-6">📚</div>
      <h3 class="text-2xl font-bold text-apple-gray-300 mb-3">
        No books found
      </h3>
      <p class="text-apple-gray-400 text-lg max-w-md mx-auto">
        Try adjusting your search criteria or add some books to your library.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useBooks } from "../composables/useBooks.js";

const { allBooks, filterBooks, sortBooks, groupBooksByYearMonth, getUniqueYears } = useBooks();

// Filter and sort state
const filters = ref({
  search: "",
  year: "",
});

const sortBy = ref("year");
const sortOrder = ref("desc");

// Computed filtered and sorted books
const filteredAndSortedBooks = computed(() => {
  let books = filterBooks(allBooks.value, filters.value);
  return sortBooks(books, sortBy.value, sortOrder.value);
});

// Group books by year/month
const groupedBooks = computed(() => {
  return groupBooksByYearMonth(filteredAndSortedBooks.value);
});

// Get total count for display
const getTotalFilteredBooks = computed(() => {
  return groupedBooks.value.reduce((total, group) => total + group.books.length, 0);
});

// Updated book cover URL function
const getBookCoverUrl = (book) => {
  // Use stored cover URL if available
  if (book.coverUrl) {
    return book.coverUrl;
  }

  // Fallback to the old method if no stored URL
  const encodedTitle = encodeURIComponent(
    book.title.toLowerCase().replace(/\s+/g, "-")
  );
  return `https://covers.openlibrary.org/b/title/${encodedTitle}-L.jpg`;
};

// Handle image load errors - now with better fallback
const handleImageError = (event) => {
  // Try a generic book cover placeholder
  event.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDIwMCAyNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjQwIiBmaWxsPSIjNDA0MDQwIi8+CjxwYXRoIGQ9Ik04MCA5MEg5MFY5NUg4MFY5MFpNOTAgMTEwSDE1MFYxMTVIOTBWMTEwWk04MCA5NUg5MFYxMDBIODBWOTVaTTkwIDEyMEgxMzBWMTI1SDkwVjEyMFpNODAgMTAwSDkwVjEwNUg4MFYxMDBaTTkwIDEzMEgxNDBWMTM1SDkwVjEzMFoiIGZpbGw9IiNhM2EzYTMiLz4KPC9zdmc+";
};
</script>

<style scoped>
.simple-input {
  @apply w-full px-3 py-2 border border-apple-gray-600 rounded focus:ring-1 focus:ring-apple-blue-500 focus:border-apple-blue-500 transition-colors duration-200 bg-apple-gray-800 text-apple-gray-100 placeholder-apple-gray-400 cursor-pointer;
}

.simple-select {
  @apply w-full px-3 py-2 border border-apple-gray-600 rounded focus:ring-1 focus:ring-apple-blue-500 focus:border-apple-blue-500 transition-colors duration-200 bg-apple-gray-800 text-apple-gray-100 appearance-none cursor-pointer;
}

details[open] .details-chevron {
  transform: rotate(180deg);
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
