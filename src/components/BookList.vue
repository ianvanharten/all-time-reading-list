<template>
  <div class="space-y-6">
    <!-- Filters and Controls -->
    <div class="card">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <!-- Search -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Search</label
          >
          <input
            v-model="filters.search"
            type="text"
            placeholder="Search titles or authors..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <!-- Year Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Year</label
          >
          <select
            v-model="filters.year"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Years</option>
            <option v-for="year in getUniqueYears" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>

        <!-- Format Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Format</label
          >
          <select
            v-model="filters.format"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Formats</option>
            <option value="print">Print</option>
            <option value="audiobook">Audiobook</option>
          </select>
        </div>

        <!-- Sort By -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Sort By</label
          >
          <select
            v-model="sortBy"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="year">Year</option>
            <option value="title">Title</option>
            <option value="author">Author</option>
          </select>
        </div>

        <!-- Sort Order -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Order</label
          >
          <select
            v-model="sortOrder"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      <!-- Results Count -->
      <div class="mt-4 text-sm text-gray-600">
        Showing {{ filteredAndSortedBooks.length }} of
        {{ allBooks.length }} books
      </div>
    </div>

    <!-- Book Grid -->
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <div
        v-for="book in filteredAndSortedBooks"
        :key="book.id || `${book.title}-${book.author}`"
        class="card hover:shadow-lg transition-shadow duration-200"
      >
        <!-- Book Cover -->
        <div class="mb-4">
          <img
            :src="getBookCoverUrl(book.title)"
            :alt="`Cover of ${book.title}`"
            class="w-full h-48 object-cover rounded-lg bg-gray-200"
            @error="handleImageError"
            loading="lazy"
          />
        </div>

        <!-- Book Info -->
        <div class="space-y-2">
          <h3 class="font-semibold text-lg text-gray-900 line-clamp-2">
            {{ book.title }}
          </h3>
          <p class="text-gray-600">{{ book.author }}</p>

          <!-- Year and Month -->
          <div class="text-sm text-gray-500">
            <span v-if="book.year">{{ book.year }}</span>
            <span v-if="book.month && book.year"> • {{ book.month }}</span>
            <span v-if="!book.year && !book.month">Date unknown</span>
          </div>

          <!-- Badges -->
          <div class="flex flex-wrap gap-2">
            <span
              :class="[
                'badge',
                book.format === 'audiobook' ? 'badge-audiobook' : 'badge-print',
              ]"
            >
              {{ book.format === "audiobook" ? "🎧 Audiobook" : "📖 Print" }}
            </span>
            <span v-if="book.reread" class="badge badge-reread">
              🔄 Re-read
            </span>
          </div>

          <!-- Notes -->
          <div v-if="book.notes" class="text-sm text-gray-600 mt-2">
            <p class="italic">"{{ book.notes }}"</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredAndSortedBooks.length === 0" class="text-center py-12">
      <div class="text-gray-400 text-6xl mb-4">📚</div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No books found</h3>
      <p class="text-gray-600">Try adjusting your filters or search terms.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useBooks } from "../composables/useBooks.js";

const { allBooks, filterBooks, sortBooks, getUniqueYears } = useBooks();

// Filter and sort state
const filters = ref({
  search: "",
  year: "",
  format: "",
});

const sortBy = ref("year");
const sortOrder = ref("desc");

// Computed filtered and sorted books
const filteredAndSortedBooks = computed(() => {
  let books = filterBooks(allBooks.value, filters.value);
  return sortBooks(books, sortBy.value, sortOrder.value);
});

// Book cover URL generation
const getBookCoverUrl = (title) => {
  const encodedTitle = encodeURIComponent(
    title.toLowerCase().replace(/\s+/g, "-")
  );
  return `https://covers.openlibrary.org/b/title/${encodedTitle}-L.jpg`;
};

// Handle image load errors
const handleImageError = (event) => {
  event.target.src =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDIwMCAyNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04MCA5MEg5MFY5NUg4MFY5MFpNOTAgMTEwSDE1MFYxMTVIOTBWMTEwWk04MCA5NUg5MFYxMDBIODBWOTVaTTkwIDEyMEgxMzBWMTI1SDkwVjEyMFpNODAgMTAwSDkwVjEwNUg4MFYxMDBaTTkwIDEzMEgxNDBWMTM1SDkwVjEzMFoiIGZpbGw9IiM5Q0E5QjQiLz4KPC9zdmc+";
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
