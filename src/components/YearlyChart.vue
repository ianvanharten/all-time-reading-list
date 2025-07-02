<template>
  <div class="card">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Books Read Per Year</h2>
      <p class="text-gray-600">Visualize your reading activity over time</p>
    </div>

    <div class="relative">
      <canvas
        ref="chartCanvas"
        class="w-full"
        style="max-height: 400px"
      ></canvas>
    </div>

    <!-- Chart Statistics -->
    <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
      <div class="bg-blue-50 rounded-lg p-4">
        <div class="text-2xl font-bold text-blue-600">
          {{ Math.max(...Object.values(booksByYear)) }}
        </div>
        <div class="text-sm text-blue-700">Peak Year</div>
      </div>
      <div class="bg-green-50 rounded-lg p-4">
        <div class="text-2xl font-bold text-green-600">
          {{ Math.round(averageBooksPerYear) }}
        </div>
        <div class="text-sm text-green-700">Average/Year</div>
      </div>
      <div class="bg-purple-50 rounded-lg p-4">
        <div class="text-2xl font-bold text-purple-600">
          {{ Object.keys(booksByYear).length }}
        </div>
        <div class="text-sm text-purple-700">Active Years</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
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
  Title,
  Tooltip,
  Legend
);

const { getBooksByYear } = useBooks();

const chartCanvas = ref(null);
let chartInstance = null;

// Computed data for the chart
const booksByYear = computed(() => getBooksByYear.value);

const chartData = computed(() => {
  const years = Object.keys(booksByYear.value).sort();
  const counts = years.map((year) => booksByYear.value[year]);

  return {
    labels: years,
    datasets: [
      {
        label: "Books Read",
        data: counts,
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
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
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      titleColor: "white",
      bodyColor: "white",
      borderColor: "rgba(59, 130, 246, 1)",
      borderWidth: 1,
      callbacks: {
        label: function (context) {
          const year = context.label;
          const count = context.parsed.y;
          return `${count} book${count !== 1 ? "s" : ""} in ${year}`;
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
        },
      },
      grid: {
        display: false,
      },
    },
    y: {
      title: {
        display: true,
        text: "Number of Books",
        font: {
          size: 14,
          weight: "bold",
        },
      },
      beginAtZero: true,
      ticks: {
        stepSize: 1,
      },
      grid: {
        color: "rgba(0, 0, 0, 0.1)",
      },
    },
  },
  animation: {
    duration: 1000,
    easing: "easeInOutQuart",
  },
};

// Statistics
const averageBooksPerYear = computed(() => {
  const years = Object.keys(booksByYear.value);
  const totalBooks = Object.values(booksByYear.value).reduce(
    (sum, count) => sum + count,
    0
  );
  return years.length > 0 ? totalBooks / years.length : 0;
});

// Create and update chart
const createChart = () => {
  if (chartInstance) {
    chartInstance.destroy();
  }

  if (chartCanvas.value) {
    chartInstance = new ChartJS(chartCanvas.value, {
      type: "bar",
      data: chartData.value,
      options: chartOptions,
    });
  }
};

const updateChart = () => {
  if (chartInstance) {
    chartInstance.data = chartData.value;
    chartInstance.update("active");
  }
};

// Lifecycle hooks
onMounted(() => {
  createChart();
});

// Watch for data changes
watch(
  chartData,
  () => {
    updateChart();
  },
  { deep: true }
);

// Cleanup
import { onUnmounted } from "vue";
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});
</script>
