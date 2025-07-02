<template>
  <div class="max-w-3xl mx-auto">
    <div class="card">
      <div class="mb-8 text-center">
        <div class="text-5xl mb-4">📖</div>
        <h2 class="text-3xl font-bold text-apple-gray-900 mb-3">
          Add New Book
        </h2>
        <p class="text-apple-gray-600 text-lg">
          Add a book to your personal library
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-8">
        <!-- Title -->
        <div>
          <label
            for="title"
            class="block text-sm font-semibold text-apple-gray-700 mb-3"
          >
            Book Title <span class="text-red-500">*</span>
          </label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            required
            placeholder="Enter the book title"
            class="input-field"
            :class="{
              'border-red-300 focus:border-red-500 focus:ring-red-500':
                errors.title,
            }"
          />
          <p v-if="errors.title" class="mt-2 text-sm text-red-600 font-medium">
            {{ errors.title }}
          </p>
        </div>

        <!-- Author -->
        <div>
          <label
            for="author"
            class="block text-sm font-semibold text-apple-gray-700 mb-3"
          >
            Author <span class="text-red-500">*</span>
          </label>
          <input
            id="author"
            v-model="form.author"
            type="text"
            required
            placeholder="Enter the author's name"
            class="input-field"
            :class="{
              'border-red-300 focus:border-red-500 focus:ring-red-500':
                errors.author,
            }"
          />
          <p v-if="errors.author" class="mt-2 text-sm text-red-600 font-medium">
            {{ errors.author }}
          </p>
        </div>

        <!-- Year and Month -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              for="year"
              class="block text-sm font-semibold text-apple-gray-700 mb-3"
              >Year Read</label
            >
            <input
              id="year"
              v-model.number="form.year"
              type="number"
              :min="1900"
              :max="new Date().getFullYear()"
              placeholder="2024"
              class="input-field"
            />
          </div>
          <div>
            <label
              for="month"
              class="block text-sm font-semibold text-apple-gray-700 mb-3"
              >Month Read</label
            >
            <select id="month" v-model="form.month" class="select-field">
              <option value="">Select month (optional)</option>
              <option v-for="month in months" :key="month" :value="month">
                {{ month }}
              </option>
            </select>
          </div>
        </div>

        <!-- Format -->
        <div>
          <label class="block text-sm font-semibold text-apple-gray-700 mb-4"
            >Format</label
          >
          <div class="grid grid-cols-2 gap-4">
            <label
              class="flex items-center p-4 bg-apple-gray-50 rounded-2xl border-2 border-transparent cursor-pointer transition-all duration-200 hover:bg-apple-gray-100"
              :class="{
                'border-apple-blue-500 bg-apple-blue-50':
                  form.format === 'print',
              }"
            >
              <input
                v-model="form.format"
                type="radio"
                value="print"
                class="sr-only"
              />
              <span class="text-2xl mr-3">📖</span>
              <div>
                <div class="font-semibold text-apple-gray-900">Print Book</div>
                <div class="text-sm text-apple-gray-600">
                  Physical or digital text
                </div>
              </div>
            </label>
            <label
              class="flex items-center p-4 bg-apple-gray-50 rounded-2xl border-2 border-transparent cursor-pointer transition-all duration-200 hover:bg-apple-gray-100"
              :class="{
                'border-apple-blue-500 bg-apple-blue-50':
                  form.format === 'audiobook',
              }"
            >
              <input
                v-model="form.format"
                type="radio"
                value="audiobook"
                class="sr-only"
              />
              <span class="text-2xl mr-3">🎧</span>
              <div>
                <div class="font-semibold text-apple-gray-900">Audiobook</div>
                <div class="text-sm text-apple-gray-600">Audio narration</div>
              </div>
            </label>
          </div>
        </div>

        <!-- Re-read -->
        <div class="bg-apple-gray-50 rounded-2xl p-6">
          <label class="flex items-center cursor-pointer">
            <input
              v-model="form.reread"
              type="checkbox"
              class="w-5 h-5 text-apple-blue-600 bg-white border-2 border-apple-gray-300 rounded focus:ring-apple-blue-500 focus:ring-2"
            />
            <div class="ml-4">
              <div class="font-semibold text-apple-gray-900">
                This is a re-read
              </div>
              <div class="text-sm text-apple-gray-600">
                I've read this book before
              </div>
            </div>
          </label>
        </div>

        <!-- Notes -->
        <div>
          <label
            for="notes"
            class="block text-sm font-semibold text-apple-gray-700 mb-3"
            >Notes & Thoughts</label
          >
          <textarea
            id="notes"
            v-model="form.notes"
            rows="4"
            placeholder="Share your thoughts, favorite quotes, or memorable moments..."
            class="input-field resize-none"
          ></textarea>
        </div>

        <!-- Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            type="submit"
            class="btn-primary flex-1 flex items-center justify-center"
            :disabled="loading"
          >
            <span v-if="loading" class="flex items-center">
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Adding Book...
            </span>
            <span v-else class="flex items-center">
              <svg
                class="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
              Add to Library
            </span>
          </button>
          <button
            type="button"
            @click="resetForm"
            class="btn-secondary sm:w-auto"
          >
            Clear Form
          </button>
        </div>
      </form>

      <!-- Success Message -->
      <div
        v-if="showSuccess"
        class="mt-8 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-3xl p-6"
      >
        <div class="flex items-start">
          <div class="text-emerald-500 text-3xl mr-4">✅</div>
          <div>
            <h3 class="text-lg font-bold text-emerald-800 mb-2">
              Successfully Added!
            </h3>
            <p class="text-emerald-700">
              "<strong>{{ lastAddedBook.title }}</strong
              >" by {{ lastAddedBook.author }} has been added to your library.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useBooks } from "../composables/useBooks.js";

const emit = defineEmits(["book-added"]);

const { addBook } = useBooks();

// Form state
const form = reactive({
  title: "",
  author: "",
  year: new Date().getFullYear(),
  month: "",
  format: "print",
  reread: false,
  notes: "",
});

const errors = ref({});
const loading = ref(false);
const showSuccess = ref(false);
const lastAddedBook = ref({});

// Month options
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Form validation
const validateForm = () => {
  errors.value = {};

  if (!form.title.trim()) {
    errors.value.title = "Please enter a book title";
  }

  if (!form.author.trim()) {
    errors.value.author = "Please enter the author name";
  }

  return Object.keys(errors.value).length === 0;
};

// Form submission
const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  loading.value = true;

  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const bookData = {
      title: form.title.trim(),
      author: form.author.trim(),
      year: form.year || null,
      month: form.month || null,
      format: form.format,
      reread: form.reread,
      notes: form.notes.trim(),
    };

    addBook(bookData);

    lastAddedBook.value = bookData;
    showSuccess.value = true;

    // Hide success message after 5 seconds
    setTimeout(() => {
      showSuccess.value = false;
    }, 5000);

    // Reset form
    resetForm();

    // Emit event to parent
    emit("book-added");
  } catch (error) {
    console.error("Error adding book:", error);
  } finally {
    loading.value = false;
  }
};

// Reset form
const resetForm = () => {
  form.title = "";
  form.author = "";
  form.year = new Date().getFullYear();
  form.month = "";
  form.format = "print";
  form.reread = false;
  form.notes = "";
  errors.value = {};
};
</script>
