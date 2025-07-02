<template>
  <div class="card">
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-apple-gray-100 mb-3">
        Reading Analytics
      </h2>
      <p class="text-apple-gray-300 text-lg">
        Visualize your reading journey over time
      </p>
    </div>

    <!-- Debug info -->
    <div v-if="debugMode" class="mb-4 p-4 bg-apple-gray-700 rounded-xl text-sm text-apple-gray-300">
      <p>Books by year: {{ JSON.stringify(booksByYear) }}</p>
      <p>Has data: {{ hasData }}</p>
      <p>Total books: {{ totalBooks }}</p>
    </div>

    <div v-if="hasData" class="relative bg-apple-gray-700 rounded-2xl p-6">
      <canvas
        ref="chartCanvas"
        class="w-full"
        style="max-height: 400px"
      ></canvas>
    </div>

    <!-- No data state -->
    <div v-else class="text-center py-20 bg-apple-gray-700 rounded-2xl">
      <div class="text-apple-gray-500 text-6xl mb-4">📊</div>
      <h3 class="text-xl font-bold text-apple-gray-300 mb-2">No data to display</h3>
      <p class="text-apple-gray-400">
        {{ totalBooks > 0 ? 'Books found but no year data available' : 'Start adding books to see your reading analytics' }}
      </p>
    </div>

    <!-- Chart Statistics -->
    <div v-if="hasData" class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        class="bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl p-6 text-center border border-blue-700"
      >
        <div class="text-3xl font-bold text-blue-200 mb-2">
          {{ Math.max(...Object.values(booksByYear)) || 0 }}
        </div>
        <div
          class="text-sm font-semibold text-blue-300 uppercase tracking-wide"
        >
          Peak Year
        </div>
        <div class="text-xs text-blue-400 mt-1">
          Most books in a single year
        </div>
      </div>
      <div
        class="bg-gradient-to-br from-emerald-800 to-emerald-900 rounded-2xl p-6 text-center border border-emerald-700"
      >
        <div class="text-3xl font-bold text-emerald-200 mb-2">
          {{ Math.round(averageBooksPerYear) || 0 }}
        </div>
        <div
          class="text-sm font-semibold text-emerald-300 uppercase tracking-wide"
        >
          Average/Year
        </div>
        <div class="text-xs text-emerald-400 mt-1">
          Books per year on average
        </div>
      </div>
      <div
        class="bg-gradient-to-br from-purple-800 to-purple-900 rounded-2xl p-6 text-center border border-purple-700"
      >
        <div class="text-3xl font-bold text-purple-200 mb-2">
          {{ Object.keys(booksByYear).length || 0 }}
        </div>
        <div
          class="text-sm font-semibold text-purple-300 uppercase tracking-wide"
        >
          Active Years
        </div>
        <div class="text-xs text-purple-400 mt-1">
          Years with recorded reading
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted, nextTick } from "vue";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useBooks } from "../composables/useBooks.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend
);

const { getBooksByYear, allBooks } = useBooks();

const chartCanvas = ref(null);
let chartInstance = null;
const debugMode = ref(false); // Set to true to see debug info

// Computed data for the chart
const booksByYear = computed(() => getBooksByYear.value);
const totalBooks = computed(() => allBooks.value.length);

const hasData = computed(() => {
  const yearKeys = Object.keys(booksByYear.value);
  console.log('Chart debug - booksByYear keys:', yearKeys);
  console.log('Chart debug - booksByYear values:', Object.values(booksByYear.value));
  return yearKeys.length > 0;
});

const chartData = computed(() => {
  if (!hasData.value) return null;

  const years = Object.keys(booksByYear.value).sort();
  const counts = years.map((year) => booksByYear.value[year]);

  console.log('Chart debug - years:', years);
  console.log('Chart debug - counts:', counts);

  return {
    labels: years,
    datasets: [
      {
        label: "Books Read",
        data: counts,
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
        hoverBackgroundColor: "rgba(59, 130, 246, 0.9)",
        hoverBorderColor: "rgba(59, 130, 246, 1)",
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: false,
    },
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: "rgba(17, 24, 39, 0.95)",
      titleColor: "white",
      bodyColor: "white",
      titleFont: {
        size: 14,
        weight: "bold",
      },
      bodyFont: {
        size: 13,
      },
      borderColor: "rgba(59, 130, 246, 0.5)",
      borderWidth: 1,
      cornerRadius: 12,
      padding: 12,
      callbacks: {
        title: function (context) {
          return `Year ${context[0].label}`;
        },
        label: function (context) {
          const count = context.parsed.y;
          return `${count} book${count !== 1 ? "s" : ""} read`;
        },
      },
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: "Year",
        font: {
          size: 14,
          weight: "bold",
          family: "-apple-system, BlinkMacSystemFont, SF Pro Display, sans-serif",
        },
        color: "#d1d5db",
      },
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 12,
          family: "-apple-system, BlinkMacSystemFont, SF Pro Display, sans-serif",
        },
        color: "#9ca3af",
      },
    },
    y: {
      title: {
        display: true,
        text: "Number of Books",
        font: {
          size: 14,
          weight: "bold",
          family: "-apple-system, BlinkMacSystemFont, SF Pro Display, sans-serif",
        },
        color: "#d1d5db",
      },
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        font: {
          size: 12,
          family: "-apple-system, BlinkMacSystemFont, SF Pro Display, sans-serif",
        },
        color: "#9ca3af",
      },
      grid: {
        color: "rgba(255, 255, 255, 0.1)",
        borderDash: [5, 5],
      },
    },
  },
  animation: {
    duration: 1200,
    easing: "easeInOutQuart",
  },
  interaction: {
    intersect: false,
    mode: "index",
  },
};

// Statistics
const averageBooksPerYear = computed(() => {
  if (!hasData.value) return 0;
  const years = Object.keys(booksByYear.value);
  const totalBooks = Object.values(booksByYear.value).reduce(
    (sum, count) => sum + count,
    0
  );
  return years.length > 0 ? totalBooks / years.length : 0;
});

// Create and update chart
const createChart = async () => {
  try {
    console.log('Creating chart...');
    console.log('chartCanvas.value:', chartCanvas.value);
    console.log('hasData.value:', hasData.value);
    console.log('chartData.value:', chartData.value);

    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }

    if (!chartCanvas.value || !hasData.value || !chartData.value) {
      console.log('Cannot create chart - missing requirements');
      return;
    }

    await nextTick();

    chartInstance = new ChartJS(chartCanvas.value, {
      type: "bar",
      data: chartData.value,
      options: chartOptions,
    });

    console.log('Chart created successfully');
  } catch (error) {
    console.error("Error creating chart:", error);
  }
};

const updateChart = () => {
  try {
    if (chartInstance && chartData.value) {
      chartInstance.data = chartData.value;
      chartInstance.update("active");
    }
  } catch (error) {
    console.error("Error updating chart:", error);
  }
};

// Lifecycle hooks
onMounted(async () => {
  console.log('YearlyChart mounted');
  console.log('Books data on mount:', booksByYear.value);

  // Wait a bit for data to load
  setTimeout(async () => {
    if (hasData.value) {
      await createChart();
    }
  }, 100);
});

// Watch for data changes
watch(
  [booksByYear, hasData],
  async () => {
    console.log('Data changed, hasData:', hasData.value);
    if (hasData.value) {
      if (chartInstance) {
        updateChart();
      } else {
        await createChart();
      }
    }
  },
  { deep: true, immediate: true }
);

// Cleanup
onUnmounted(() => {
  try {
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
  } catch (error) {
    console.error("Error destroying chart:", error);
  }
});
</script>
