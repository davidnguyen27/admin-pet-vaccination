<script setup lang="ts">
import { ref, computed } from 'vue';
import { useLocale } from '@/shared/composables/useLocale';
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
import { IconChartBar, IconCalendarEvent, IconCertificate, IconCpu, IconVaccine } from '@tabler/icons-vue';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler);

defineProps<{ open: boolean; onCancel: () => void }>();

const { t } = useLocale();

// State for filtering
const appointmentView = ref<'year' | 'month'>('month');
const selectedMonth = ref(new Date().getMonth() + 1);

// Mock Data Generators
const getDaysInMonth = (month: number) =>
  new Array(new Date(new Date().getFullYear(), month, 0).getDate()).fill(0).map((_, i) => `${i + 1}`);

// --- APPOINTMENTS CHART ---
const appointmentsChartData = computed(() => {
  const monthsList = [
    t('common.jan', 'Jan'),
    t('common.feb', 'Feb'),
    t('common.mar', 'Mar'),
    t('common.apr', 'Apr'),
    t('common.may', 'May'),
    t('common.jun', 'Jun'),
    t('common.jul', 'Jul'),
    t('common.aug', 'Aug'),
    t('common.sep', 'Sep'),
    t('common.oct', 'Oct'),
    t('common.nov', 'Nov'),
    t('common.dec', 'Dec'),
  ];

  if (appointmentView.value === 'year') {
    return {
      labels: monthsList,
      datasets: [
        {
          label: t('statistics.totalAppointments', 'Total Appointments'),
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
    const data = days.map(day => {
      const base = 10 + (selectedMonth.value % 3) * 5;
      return base + Math.floor(Math.sin(Number(day)) * 5) + Math.floor(Math.random() * 8);
    });

    return {
      labels: days,
      datasets: [
        {
          label: `${t('common.month', 'Month')} ${selectedMonth.value}`,
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
const getBarLabels = () => {
  const months = [
    t('common.jan', 'Jan'),
    t('common.feb', 'Feb'),
    t('common.mar', 'Mar'),
    t('common.apr', 'Apr'),
    t('common.may', 'May'),
    t('common.jun', 'Jun'),
    t('common.jul', 'Jul'),
    t('common.aug', 'Aug'),
    t('common.sep', 'Sep'),
    t('common.oct', 'Oct'),
    t('common.nov', 'Nov'),
    t('common.dec', 'Dec'),
  ];
  let last6 = months.slice(new Date().getMonth() - 5 > 0 ? new Date().getMonth() - 5 : 0, new Date().getMonth() + 1);
  if (last6.length < 6) {
    last6.splice(0, last6.length, ...months.slice(0, 6));
  }
  return last6;
};

const createBarData = (label: string, color: string, data: number[]) => ({
  labels: getBarLabels(),
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
      ticks: { font: { family: 'Inter', stepSize: 20 } },
    },
    x: {
      grid: { display: false },
      ticks: { font: { family: 'Inter' } },
    },
  },
};

const healthCertData = computed(() =>
  createBarData(t('statistics.healthCert', 'Health Certificate'), '#198038', [15, 22, 18, 30, 25, 35]),
);
const microchipData = computed(() =>
  createBarData(t('statistics.microchip', 'Microchip'), '#F1C21B', [10, 12, 15, 8, 20, 18]),
);
const vaccinationData = computed(() =>
  createBarData(t('statistics.vaccination', 'Vaccination'), '#DA1E28', [45, 60, 55, 75, 80, 95]),
);
</script>

<template>
  <a-modal
    :open="open"
    @cancel="onCancel"
    :footer="null"
    width="1100px"
    centered
    :bodyStyle="{
      backgroundColor: 'var(--color-bg)',
      padding: '20px',
      maxHeight: 'calc(100vh - 140px)',
      overflowY: 'auto',
    }"
  >
    <template #title>
      <div class="flex items-center gap-2">
        <IconChartBar class="text-primary size-5" />
        <span class="font-ibm text-lg font-semibold">{{ t('statistics.modalTitle', 'Detailed Statistics') }}</span>
      </div>
    </template>

    <div class="mt-1 space-y-4">
      <!-- Appointments -->
      <div class="border-divider bg-surface rounded-md border p-5" style="box-shadow: var(--shadow-card)">
        <div class="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div class="flex items-start gap-3">
            <div class="bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-lg">
              <IconCalendarEvent class="text-primary size-5" />
            </div>
            <div>
              <h3 class="font-ibm text-text text-base font-semibold tracking-tight">
                {{ t('statistics.appointmentsChart', 'Appointments Overview') }}
              </h3>
              <p class="text-text-muted mt-0.5 text-xs">
                {{ t('statistics.appointmentsChartDesc', 'Analyze appointment volume and trends over time') }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <a-select v-model:value="appointmentView" style="width: 140px" class="font-medium" size="middle">
              <a-select-option value="year">{{ t('statistics.byMonth', 'By Month') }}</a-select-option>
              <a-select-option value="month">{{ t('statistics.byDay', 'By Day in Month') }}</a-select-option>
            </a-select>
            <a-select
              v-if="appointmentView === 'month'"
              v-model:value="selectedMonth"
              style="width: 120px"
              class="font-medium"
              size="middle"
            >
              <a-select-option v-for="m in 12" :key="m" :value="m"
                >{{ t('common.month', 'Month') }} {{ m }}</a-select-option
              >
            </a-select>
          </div>
        </div>
        <div class="h-[320px] w-full">
          <Line :data="appointmentsChartData" :options="lineOptions" />
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <!-- Health Certificate -->
        <div class="border-divider bg-surface rounded-md border p-4" style="box-shadow: var(--shadow-card)">
          <div class="mb-5 flex items-start gap-3">
            <div class="bg-success-bg flex size-8 shrink-0 items-center justify-center rounded-md">
              <IconCertificate class="text-success size-4" />
            </div>
            <div>
              <h3 class="font-ibm text-text text-sm font-semibold tracking-tight">
                {{ t('statistics.healthCert', 'Health Certificate') }}
              </h3>
              <p class="text-text-muted mt-0.5 text-[11px]">
                {{ t('statistics.last6Months', 'Registrations in last 6 months') }}
              </p>
            </div>
          </div>
          <div class="h-[200px] w-full">
            <Bar :data="healthCertData" :options="barOptions" />
          </div>
        </div>

        <!-- Microchip -->
        <div class="border-divider bg-surface rounded-md border p-4" style="box-shadow: var(--shadow-card)">
          <div class="mb-5 flex items-start gap-3">
            <div class="bg-warning-bg flex size-8 shrink-0 items-center justify-center rounded-md">
              <IconCpu class="text-warning size-4" />
            </div>
            <div>
              <h3 class="font-ibm text-text text-sm font-semibold tracking-tight">
                {{ t('statistics.microchip', 'Microchip') }}
              </h3>
              <p class="text-text-muted mt-0.5 text-[11px]">
                {{ t('statistics.last6Months', 'Registrations in last 6 months') }}
              </p>
            </div>
          </div>
          <div class="h-[200px] w-full">
            <Bar :data="microchipData" :options="barOptions" />
          </div>
        </div>

        <!-- Vaccination -->
        <div class="border-divider bg-surface rounded-md border p-4" style="box-shadow: var(--shadow-card)">
          <div class="mb-5 flex items-start gap-3">
            <div class="bg-error-bg flex size-8 shrink-0 items-center justify-center rounded-md">
              <IconVaccine class="text-error size-4" />
            </div>
            <div>
              <h3 class="font-ibm text-text text-sm font-semibold tracking-tight">
                {{ t('statistics.vaccination', 'Vaccination') }}
              </h3>
              <p class="text-text-muted mt-0.5 text-[11px]">
                {{ t('statistics.last6Months', 'Registrations in last 6 months') }}
              </p>
            </div>
          </div>
          <div class="h-[200px] w-full">
            <Bar :data="vaccinationData" :options="barOptions" />
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>
