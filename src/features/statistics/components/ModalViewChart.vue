<template>
  <a-modal :open="open" @cancel="onCancel" :footer="null" title="Biểu Đồ Thống Kê Chi Tiết" width="1100px" centered>
    <div class="mt-4 space-y-6">
      <!-- Appointments -->
      <div class="border-divider bg-bg rounded-sm border p-5 shadow-sm">
        <div class="mb-4 flex flex-col justify-between sm:flex-row sm:items-center">
          <div class="mb-4 sm:mb-0">
            <h3 class="font-ibm text-text text-lg font-semibold tracking-tight">Thống Kê Lịch Hẹn</h3>
            <p class="text-text-muted text-sm">Biến động số lượng lịch hẹn theo thời gian</p>
          </div>
          <div class="flex items-center space-x-3">
            <a-select v-model:value="appointmentView" style="width: 140px" class="font-medium">
              <a-select-option value="year">Theo Các Tháng</a-select-option>
              <a-select-option value="month">Theo Ngày Trong Tháng</a-select-option>
            </a-select>
            <a-select
              v-if="appointmentView === 'month'"
              v-model:value="selectedMonth"
              style="width: 120px"
              class="font-medium"
            >
              <a-select-option v-for="m in 12" :key="m" :value="m">Tháng {{ m }}</a-select-option>
            </a-select>
          </div>
        </div>
        <div class="h-[320px] w-full">
          <Line :data="appointmentsChartData" :options="lineOptions" />
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <!-- Health Certificate -->
        <div class="border-divider bg-bg rounded-sm border p-4 shadow-sm">
          <div class="mb-4">
            <h3 class="font-ibm text-text text-base font-semibold tracking-tight">Giấy Chứng Nhận Sức Khỏe</h3>
            <p class="text-text-muted text-xs">Lượt đăng ký 6 tháng qua</p>
          </div>
          <div class="h-[200px] w-full">
            <Bar :data="healthCertData" :options="barOptions" />
          </div>
        </div>

        <!-- Microchip -->
        <div class="border-divider bg-bg rounded-sm border p-4 shadow-sm">
          <div class="mb-4">
            <h3 class="font-ibm text-text text-base font-semibold tracking-tight">Cấy Microchip</h3>
            <p class="text-text-muted text-xs">Lượt đăng ký 6 tháng qua</p>
          </div>
          <div class="h-[200px] w-full">
            <Bar :data="microchipData" :options="barOptions" />
          </div>
        </div>

        <!-- Vaccination -->
        <div class="border-divider bg-bg rounded-sm border p-4 shadow-sm">
          <div class="mb-4">
            <h3 class="font-ibm text-text text-base font-semibold tracking-tight">Tiêm Chủng</h3>
            <p class="text-text-muted text-xs">Lượt đăng ký 6 tháng qua</p>
          </div>
          <div class="h-[200px] w-full">
            <Bar :data="vaccinationData" :options="barOptions" />
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
} from 'chart.js';
import { Bar, Line } from 'vue-chartjs';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler);

defineProps<{ open: boolean; onCancel: () => void }>();

// State for filtering
const appointmentView = ref<'year' | 'month'>('month');
const selectedMonth = ref(new Date().getMonth() + 1);

// Mock Data Generators
const monthsList = ['Th 1', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7', 'Th 8', 'Th 9', 'Th 10', 'Th 11', 'Th 12'];
const getDaysInMonth = (month: number) =>
  new Array(new Date(new Date().getFullYear(), month, 0).getDate()).fill(0).map((_, i) => `${i + 1}`);

// --- APPOINTMENTS CHART ---
const appointmentsChartData = computed(() => {
  if (appointmentView.value === 'year') {
    return {
      labels: monthsList,
      datasets: [
        {
          label: 'Tổng số lịch hẹn',
          backgroundColor: 'rgba(15, 98, 254, 0.1)',
          borderColor: '#0F62FE',
          borderWidth: 2,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#0F62FE',
          pointBorderWidth: 2,
          pointRadius: 4,
          fill: true,
          data: [120, 150, 180, 130, 160, 210, 250, 220, 190, 170, 140, 180],
          tension: 0.4,
        },
      ],
    };
  } else {
    // By month -> show days
    const days = getDaysInMonth(selectedMonth.value);
    // Mock random stable data based on month length
    const data = days.map(day => {
      const base = 10 + (selectedMonth.value % 3) * 5;
      return base + Math.floor(Math.sin(Number(day)) * 5) + Math.floor(Math.random() * 8);
    });

    return {
      labels: days,
      datasets: [
        {
          label: `Lịch hẹn tháng ${selectedMonth.value}`,
          backgroundColor: 'rgba(138, 63, 252, 0.1)',
          borderColor: '#8A3FFC',
          borderWidth: 2,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#8A3FFC',
          pointBorderWidth: 2,
          pointRadius: 3,
          fill: true,
          data: data,
          tension: 0.3,
        },
      ],
    };
  }
});

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  plugins: {
    legend: {
      position: 'top' as const,
      labels: { usePointStyle: true, boxWidth: 6, font: { family: 'Inter', size: 13 } },
    },
    tooltip: {
      titleFont: { family: 'Inter' },
      bodyFont: { family: 'Inter' },
      padding: 10,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: '#e5e7eb', borderDash: [4, 4] },
      ticks: { font: { family: 'Inter' } },
    },
    x: {
      grid: { display: false },
      ticks: { font: { family: 'Inter' } },
    },
  },
};

// --- SERVICES CHARTS ---
const last6Months = monthsList.slice(
  new Date().getMonth() - 5 > 0 ? new Date().getMonth() - 5 : 0,
  new Date().getMonth() + 1,
);
if (last6Months.length < 6) {
  // If beginning of the year, just use first 6 months for mock
  last6Months.splice(0, last6Months.length, ...monthsList.slice(0, 6));
}

const createBarData = (label: string, color: string, data: number[]) => ({
  labels: last6Months,
  datasets: [
    {
      label,
      backgroundColor: color,
      hoverBackgroundColor: color + 'CC',
      borderRadius: 4,
      data,
    },
  ],
});

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      titleFont: { family: 'Inter' },
      bodyFont: { family: 'Inter' },
      padding: 10,
      callbacks: {
        label: function (context: any) {
          return `${context.dataset.label}: ${context.raw}`;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: '#e5e7eb', borderDash: [2, 2] },
      ticks: { font: { family: 'Inter' } },
    },
    x: {
      grid: { display: false },
      ticks: { font: { family: 'Inter' } },
    },
  },
};

const healthCertData = computed(() => createBarData('Giấy chứng nhận', '#198038', [15, 22, 18, 30, 25, 35]));
const microchipData = computed(() => createBarData('Microchip', '#F1C21B', [10, 12, 15, 8, 20, 18]));
const vaccinationData = computed(() => createBarData('Tiêm chủng', '#DA1E28', [45, 60, 55, 75, 80, 95]));
</script>
