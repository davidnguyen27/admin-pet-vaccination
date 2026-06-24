<script setup lang="ts">
import { ref } from 'vue';
import PageLayout from '@/layouts/PageLayout.vue';
import { IconUserPlus, IconReceipt, IconFileDescription } from '@tabler/icons-vue';
import AppointmentQueue from '../components/AppointmentQueue.vue';
import UpcomingVaccinations from '../components/UpcomingVaccinations.vue';
import InventoryAlerts from '../components/InventoryAlerts.vue';
import ModalViewChart from '../components/ModalViewChart.vue';

const isChartModalOpen = ref(false);

interface OverviewCard {
  key: string;
  label: string;
  value: number;
  color: string;
}

interface Activity {
  id: string;
  text: string;
  time: string;
  color: string;
}

const overviewCards: OverviewCard[] = [
  {
    key: 'today',
    label: "Today's appointment",
    value: 42,
    color: 'text-text',
  },
  {
    key: 'checked-in',
    label: 'Checked in',
    value: 18,
    color: 'text-primary',
  },
  {
    key: 'completed',
    label: 'Completed',
    value: 12,
    color: 'text-success',
  },
  {
    key: 'pending',
    label: 'Pending',
    value: 10,
    color: 'text-warning',
  },
  {
    key: 'cancelled',
    label: 'Cancelled',
    value: 2,
    color: 'text-error',
  },
];

const recentActivities: Activity[] = [
  { id: '1', text: 'Dr. Smith completed exam for Rocky.', time: '10 mins ago', color: 'bg-success' },
  { id: '2', text: 'Vaccination record updated for Mittens (FVRCP).', time: '45 mins ago', color: 'bg-gray-300' },
  { id: '3', text: 'New patient registered: Buster (Beagle).', time: '1 hour ago', color: 'bg-success' },
];
</script>

<template>
  <PageLayout>
    <div class="flex justify-between">
      <div class="flex flex-col">
        <h1 class="font-ibm text-text text-xl font-bold">Dashboard Overview</h1>
        <span class="text-text-muted text-sm">Monitor today's vaccination operations and inventory alerts</span>
      </div>
      <div class="flex items-end gap-3">
        <div class="cursor-pointer rounded-sm bg-[#ccc] p-1.5 text-sm hover:bg-[#ccc]/80">Appointment List</div>
        <div
          @click="isChartModalOpen = true"
          class="bg-primary hover:bg-secondary cursor-pointer rounded-sm p-1.5 text-sm text-white"
        >
          Statistics
        </div>
      </div>
    </div>

    <div class="my-4 grid grid-cols-1 gap-1.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      <div
        v-for="item in overviewCards"
        :key="item.key"
        class="border-divider bg-surface shadow-card flex flex-col gap-1.5 border p-3"
      >
        <span class="text-text-subtle text-sm">{{ item.label }}</span>
        <span :class="['text-xl font-semibold', item.color ?? 'text-text']">{{ item.value }}</span>
      </div>
    </div>

    <div class="mt-6 flex flex-col gap-6 pb-6">
      <AppointmentQueue />

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <UpcomingVaccinations />

        <InventoryAlerts />
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div class="border-divider rounded border bg-white p-4 shadow-sm lg:col-span-2">
          <h2 class="font-ibm text-text mb-4 font-semibold">Recent Activity</h2>
          <div class="border-divider relative ml-2 space-y-6 border-l py-1 pl-5">
            <div v-for="act in recentActivities" :key="act.id" class="relative">
              <div :class="['absolute top-1.5 -left-[23px] size-1.5 rounded-full', act.color]"></div>
              <div class="text-text text-sm">{{ act.text }}</div>
              <div class="text-text-muted mt-0.5 text-xs">{{ act.time }}</div>
            </div>
          </div>
        </div>

        <div class="border-divider rounded border bg-white p-4 shadow-sm lg:col-span-1">
          <h2 class="font-ibm text-text mb-4 font-semibold">Quick Actions</h2>
          <div class="flex flex-col gap-3">
            <button
              class="border-divider text-text flex w-full items-center gap-3 rounded border p-2.5 text-sm transition-colors hover:bg-black/5"
            >
              <IconUserPlus class="text-text-muted size-5" />
              Register New Patient
            </button>
            <button
              class="border-divider text-text flex w-full items-center gap-3 rounded border p-2.5 text-sm transition-colors hover:bg-black/5"
            >
              <IconReceipt class="text-text-muted size-5" />
              Create Invoice
            </button>
            <button
              class="border-divider text-text flex w-full items-center gap-3 rounded border p-2.5 text-sm transition-colors hover:bg-black/5"
            >
              <IconFileDescription class="text-text-muted size-5" />
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>

    <ModalViewChart
      :open="isChartModalOpen"
      :on-cancel="
        () => {
          isChartModalOpen = false;
        }
      "
    />
  </PageLayout>
</template>
