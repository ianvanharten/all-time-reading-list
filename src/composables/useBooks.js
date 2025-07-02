import { ref, computed } from "vue";
import axios from "axios";

const books = ref([]);
const loading = ref(false);
const error = ref(null);

// Add book function (in-memory only)
const addedBooks = ref([]);

export function useBooks() {
  const fetchBooks = async () => {
    try {
      loading.value = true;
      error.value = null;
      const response = await axios.get("/books.json");
      books.value = response.data;
    } catch (err) {
      error.value = "Failed to load books";
      console.error("Error fetching books:", err);
    } finally {
      loading.value = false;
    }
  };

  const addBook = (book) => {
    const newBook = {
      ...book,
      id: Date.now(), // Simple ID for in-memory storage
    };
    addedBooks.value.push(newBook);
  };

  // Combined books (original + added)
  const allBooks = computed(() => [...books.value, ...addedBooks.value]);

  // Filter and sort functions
  const filterBooks = (books, filters) => {
    return books.filter((book) => {
      if (filters.year && book.year !== filters.year) return false;
      if (
        filters.author &&
        !book.author.toLowerCase().includes(filters.author.toLowerCase())
      )
        return false;
      if (filters.format && book.format !== filters.format) return false;
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return (
          book.title.toLowerCase().includes(searchTerm) ||
          book.author.toLowerCase().includes(searchTerm)
        );
      }
      return true;
    });
  };

  const sortBooks = (books, sortBy, sortOrder = "asc") => {
    return [...books].sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  };

  // Get unique values for filters
  const getUniqueYears = computed(() => {
    const years = [
      ...new Set(allBooks.value.map((book) => book.year).filter(Boolean)),
    ];
    return years.sort((a, b) => b - a);
  });

  const getUniqueAuthors = computed(() => {
    const authors = [...new Set(allBooks.value.map((book) => book.author))];
    return authors.sort();
  });

  const getFormats = () => ["print", "audiobook"];

  // Analytics data
  const getBooksByYear = computed(() => {
    const yearCounts = {};
    allBooks.value.forEach((book) => {
      if (book.year) {
        yearCounts[book.year] = (yearCounts[book.year] || 0) + 1;
      }
    });
    return yearCounts;
  });

  const getBooksByFormat = computed(() => {
    const formatCounts = {};
    allBooks.value.forEach((book) => {
      formatCounts[book.format] = (formatCounts[book.format] || 0) + 1;
    });
    return formatCounts;
  });

  const getTotalBooks = computed(() => allBooks.value.length);
  const getTotalReReads = computed(
    () => allBooks.value.filter((book) => book.reread).length
  );

  return {
    books,
    loading,
    error,
    allBooks,
    fetchBooks,
    addBook,
    filterBooks,
    sortBooks,
    getUniqueYears,
    getUniqueAuthors,
    getFormats,
    getBooksByYear,
    getBooksByFormat,
    getTotalBooks,
    getTotalReReads,
  };
}
