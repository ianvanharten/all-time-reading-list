<template>
  <div class="space-y-8">
    <!-- Filters and Controls -->
    <div class="card">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Search -->
        <div>
          <label class="block text-sm font-semibold text-apple-gray-300 mb-3"
            >Search</label
          >
          <input
            v-model="filters.search"
            type="text"
            placeholder="Search titles or authors..."
            class="input-field"
          />
        </div>

        <!-- Year Filter -->
        <div>
          <label class="block text-sm font-semibold text-apple-gray-300 mb-3"
            >Year</label
          >
          <select v-model="filters.year" class="select-field">
            <option value="">All Years</option>
            <option v-for="year in getUniqueYears" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>

        <!-- Sort By -->
        <div>
          <label class="block text-sm font-semibold text-apple-gray-300 mb-3"
            >Sort By</label
          >
          <select v-model="sortBy" class="select-field">
            <option value="year">Year</option>
            <option value="title">Title</option>
            <option value="author">Author</option>
          </select>
        </div>

        <!-- Sort Order -->
        <div>
          <label class="block text-sm font-semibold text-apple-gray-300 mb-3"
            >Order</label
          >
          <select v-model="sortOrder" class="select-field">
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      <!-- Results Count -->
      <div class="mt-6">
        <p class="text-apple-gray-300 font-medium">
          Showing {{ getTotalFilteredBooks }} of {{ allBooks.length }} books
        </p>
      </div>
    </div>

    <!-- Grouped Book List -->
    <div class="space-y-10">
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

        <!-- Books in this group -->
        <div class="space-y-4">
          <div
            v-for="book in group.books"
            :key="book.id || `${book.title}-${book.author}`"
            class="book-item flex items-start space-x-4 hover:bg-apple-gray-750"
          >
            <!-- Book Cover -->
            <div class="flex-shrink-0">
              <img
                :src="getBookCoverUrl(book.title)"
                :alt="`Cover of ${book.title}`"
                class="w-16 h-20 object-cover rounded-lg shadow-md"
                @error="handleImageError"
                loading="lazy"
              />
            </div>

            <!-- Book Details -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between">
                <div class="flex-1 min-w-0">
                  <h4 class="font-bold text-lg text-apple-gray-100 truncate">
                    {{ book.title }}
                  </h4>
                  <p class="text-apple-gray-300 font-medium mb-2">
                    {{ book.author }}
                  </p>

                  <!-- Badges -->
                  <div class="flex flex-wrap gap-2 mb-3">
                    <span v-if="book.reread" class="badge badge-reread">
                      🔄 Re-read
                    </span>
                  </div>

                  <!-- Notes -->
                  <div
                    v-if="book.notes"
                    class="text-sm text-apple-gray-400 mt-3 p-3 bg-apple-gray-700 rounded-xl"
                  >
                    <p class="italic leading-relaxed">"{{ book.notes }}"</p>
                  </div>
                </div>
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
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDIwMCAyNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjQwIiBmaWxsPSIjNDA0MDQwIi8+CjxwYXRoIGQ9Ik04MCA5MEg5MFY5NUg4MFY5MFpNOTAgMTEwSDE1MFYxMTVIOTBWMTEwWk04MCA5NUg5MFYxMDBIODBWOTVaTTkwIDEyMEgxMzBWMTI1SDkwVjEyMFpNODAgMTAwSDkwVjEwNUg4MFYxMDBaTTkwIDEzMEgxNDBWMTM1SDkwVjEzMFoiIGZpbGw9IiNhM2EzYTMiLz4KPC9zdmc+";
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
