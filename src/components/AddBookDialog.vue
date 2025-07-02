<template>
  <div class="max-w-2xl mx-auto">
    <div class="card">
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Add New Book</h2>
        <p class="text-gray-600">
          Add a book to your reading history (stored in memory only)
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Title -->
        <div>
          <label
            for="title"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Title <span class="text-red-500">*</span>
          </label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            required
            placeholder="Enter book title"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            :class="{ 'border-red-300': errors.title }"
          />
          <p v-if="errors.title" class="mt-1 text-sm text-red-600">
            {{ errors.title }}
          </p>
        </div>

        <!-- Author -->
        <div>
          <label
            for="author"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Author <span class="text-red-500">*</span>
          </label>
          <input
            id="author"
            v-model="form.author"
            type="text"
            required
            placeholder="Enter author name"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            :class="{ 'border-red-300': errors.author }"
          />
          <p v-if="errors.author" class="mt-1 text-sm text-red-600">
            {{ errors.author }}
          </p>
        </div>

        <!-- Year and Month -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              for="year"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Year</label
            >
            <input
              id="year"
              v-model.number="form.year"
              type="number"
              :min="1900"
              :max="new Date().getFullYear()"
              placeholder="2024"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label
              for="month"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Month</label
            >
            <select
              id="month"
              v-model="form.month"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select month</option>
              <option v-for="month in months" :key="month" :value="month">
                {{ month }}
              </option>
            </select>
          </div>
        </div>

        <!-- Format -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Format</label
          >
          <div class="flex space-x-4">
            <label class="flex items-center">
              <input
                v-model="form.format"
                type="radio"
                value="print"
                class="text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <span class="ml-2 text-sm text-gray-700">📖 Print</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="form.format"
                type="radio"
                value="audiobook"
                class="text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <span class="ml-2 text-sm text-gray-700">🎧 Audiobook</span>
            </label>
          </div>
        </div>

        <!-- Re-read -->
        <div>
          <label class="flex items-center">
            <input
              v-model="form.reread"
              type="checkbox"
              class="text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span class="ml-2 text-sm text-gray-700">This is a re-read</span>
          </label>
        </div>

        <!-- Notes -->
        <div>
          <label
            for="notes"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Notes</label
          >
          <textarea
            id="notes"
            v-model="form.notes"
            rows="3"
            placeholder="Any additional notes or thoughts..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          ></textarea>
        </div>

        <!-- Buttons -->
        <div class="flex space-x-4">
          <button type="submit" class="btn-primary flex-1" :disabled="loading">
            <span v-if="loading">Adding...</span>
            <span v-else>Add Book</span>
          </button>
          <button type="button" @click="resetForm" class="btn-secondary">
            Clear
          </button>
        </div>
      </form>

      <!-- Success Message -->
      <div
        v-if="showSuccess"
        class="mt-6 bg-green-50 border border-green-200 rounded-lg p-4"
      >
        <div class="flex">
          <div class="text-green-400">✅</div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-green-800">
              Book Added Successfully!
            </h3>
            <div class="mt-2 text-sm text-green-700">
              "{{ lastAddedBook.title }}" by {{ lastAddedBook.author }} has been
              added to your library.
            </div>
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
    errors.value.title = "Title is required";
  }

  if (!form.author.trim()) {
    errors.value.author = "Author is required";
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
    await new Promise((resolve) => setTimeout(resolve, 500));

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
