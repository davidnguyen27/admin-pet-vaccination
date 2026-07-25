<script setup lang="ts">
import { ref, computed, onMounted, type Component } from 'vue';
import { useRouter } from 'vue-router';
import {
  IconUserPlus,
  IconReceipt,
  IconCoin,
  IconCalendarEvent,
  IconCheckbox,
  IconClock,
  IconRefresh,
  IconListDetails,
  IconChartBar,
  IconArrowUpRight,
  IconArrowDownRight,
  IconStethoscope,
  IconVaccine,
  IconAlertTriangle,
  IconPackage,
  IconCash,
} from '@tabler/icons-vue';
import PageLayout from '@/layouts/PageLayout.vue';
import { useLocale } from '@/shared/composables/useLocale';
import { useStatisticsStore } from '../stores/statistics.store';
import AppointmentQueue from '../components/AppointmentQueue.vue';
import UpcomingVaccinations from '../components/UpcomingVaccinations.vue';
import InventoryAlerts from '../components/InventoryAlerts.vue';
import ViewChartModal from '../components/ViewChartModal.vue';

const ACTIVITY_ICON_MAP: Record<string, Component> = {
  appointment: IconCalendarEvent,
  exam: IconStethoscope,
  vaccine: IconVaccine,
  invoice: IconReceipt,
  register: IconUserPlus,
  alert: IconAlertTriangle,
};

const ACTIVITY_COLOR_MAP: Record<string, string> = {
  appointment: 'bg-primary-soft text-primary',
  exam: 'bg-info-bg text-info',
  vaccine: 'bg-success-bg text-success',
  invoice: 'bg-indigo-50 text-indigo-500',
  register: 'bg-primary-soft text-primary',
  alert: 'bg-warning-bg text-warning',
};

const CARD_ICON_MAP: Record<string, Component> = {
  IconCalendarEvent,
  IconVaccine,
  IconPackage,
  IconCash,
  IconCoin,
  IconClock,
  IconCheckbox,
};

const router = useRouter();
const { t } = useLocale();
const store = useStatisticsStore();

const isChartModalOpen = ref(false);

const overviewCards = computed(() => store.overviewCards);
const recentActivities = computed(() => store.recentActivities);

const getTrendIcon = (trend: 'up' | 'down' | 'neutral'): Component | null => {
  if (trend === 'up') return IconArrowUpRight;
  if (trend === 'down') return IconArrowDownRight;
  return null;
};

const getTrendClass = (trend: 'up' | 'down' | 'neutral'): string => {
  if (trend === 'up') return 'text-success';
  if (trend === 'down') return 'text-warning';
  return 'text-text-muted';
};

onMounted(() => {
  store.fetchDashboardData();
});
</script>

<template>
  <PageLayout>
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="font-ibm text-text text-xl font-bold">
          {{ t('statistics.dashboardOverview') }}
        </h1>
        <span class="text-text-muted mt-0.5 block text-sm">
          {{ t('statistics.dashboardDesc') }}
        </span>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <a-button @click="router.push('/user-management')">
          <template #icon><IconListDetails class="size-3.5" /></template>
          {{ t('statistics.appointmentList') }}
        </a-button>
        <a-button type="primary" @click="isChartModalOpen = true">
          <template #icon><IconChartBar class="size-3.5" /></template>
          {{ t('statistics.btnTitle') }}
        </a-button>
        <a-tooltip :title="t('statistics.refreshData')">
          <a-button shape="circle">
            <template #icon><IconRefresh class="size-3.5" /></template>
          </a-button>
        </a-tooltip>
      </div>
    </div>

    <!-- Metric Cards -->
    <div class="grid grid-cols-2 gap-3 xl:grid-cols-4">
      <div
        v-for="item in overviewCards"
        :key="item.key"
        class="shadow-card border-divider bg-surface group flex cursor-default flex-col gap-3 rounded border p-4 transition-all duration-200 hover:shadow-(--shadow-card-hover)"
      >
        <!-- Card top row -->
        <div class="flex items-start justify-between">
          <span class="text-text-muted text-xs font-medium tracking-wide">{{
            t('statistics.' + item.labelKey, item.labelKey)
          }}</span>
          <div :class="['flex size-8 items-center justify-center rounded-md', item.bgClass]">
            <component :is="CARD_ICON_MAP[item.iconName]" class="size-4 text-current opacity-70" />
          </div>
        </div>

        <!-- Value -->
        <span class="text-text text-2xl font-bold tracking-tight">{{ item.value }}</span>

        <!-- Trend -->
        <div class="flex items-center gap-1">
          <component
            :is="getTrendIcon(item.trend)"
            v-if="getTrendIcon(item.trend)"
            :class="['size-3.5', getTrendClass(item.trend)]"
          />
          <span :class="['text-xs font-medium', getTrendClass(item.trend)]">{{ item.trendValue }}</span>
          <span class="text-text-disabled text-xs">{{ t('statistics.' + item.subLabelKey, item.subLabelKey) }}</span>
        </div>
      </div>
    </div>

    <!-- Appointment Queue -->
    <AppointmentQueue />

    <!-- Vaccinations + Inventory -->
    <div class="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <UpcomingVaccinations />
      <InventoryAlerts />
    </div>

    <!-- Recent Activity + Quick Actions -->
    <div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <!-- Recent Activity -->
      <div class="shadow-card border-divider bg-surface flex flex-col rounded-md border p-5 xl:col-span-2">
        <div class="mb-5 flex items-center justify-between">
          <div>
            <h2 class="font-ibm text-text text-base font-semibold">
              {{ t('statistics.recentActivity', 'Recent Activity') }}
            </h2>
            <p class="text-text-muted mt-0.5 text-xs">{{ t('statistics.recentActivityDesc') }}</p>
          </div>
          <a-button type="link" size="small" class="p-0! text-xs! font-medium!">{{
            t('statistics.viewAll', 'View all')
          }}</a-button>
        </div>

        <div
          class="before:bg-divider relative ml-2 flex-1 space-y-6 before:absolute before:inset-y-2 before:left-[13px] before:w-px"
        >
          <div v-for="act in recentActivities" :key="act.id" class="group relative flex items-start gap-4">
            <div
              :class="[
                'ring-surface relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full ring-4 transition-transform duration-200 group-hover:scale-110',
                ACTIVITY_COLOR_MAP[act.type],
              ]"
            >
              <component :is="ACTIVITY_ICON_MAP[act.type]" class="size-3.5" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-text text-sm leading-snug font-medium">{{ act.text }}</p>
              <p class="text-text-muted mt-1 flex items-center gap-1.5 text-xs">
                <IconClock class="size-3.5 opacity-70" />
                <span>{{ act.time }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="shadow-card border-divider bg-surface flex flex-col rounded-md border p-5 xl:col-span-1">
        <div class="mb-5">
          <h2 class="font-ibm text-text text-base font-semibold">
            {{ t('statistics.quickActions', 'Quick Actions') }}
          </h2>
          <p class="text-text-muted mt-0.5 text-xs">{{ t('statistics.quickActionsDesc') }}</p>
        </div>
        <div class="grid flex-1 grid-cols-2 gap-3">
          <a-button
            class="group border-divider! bg-surface-soft! hover:border-primary! hover:bg-primary-xsoft! h-auto! flex-col! gap-2.5! px-2! py-4!"
            @click="router.push('/user-management')"
          >
            <div
              class="bg-primary-soft text-primary group-hover:bg-primary flex size-10 items-center justify-center rounded-full transition-colors group-hover:text-white"
            >
              <IconCalendarEvent class="size-5" />
            </div>
            <span class="text-text group-hover:text-primary text-xs font-medium tracking-wide">{{
              t('statistics.newAppointment', 'New Appointment')
            }}</span>
          </a-button>

          <a-button
            class="group border-divider! bg-surface-soft! hover:border-primary! hover:bg-primary-xsoft! h-auto! flex-col! gap-2.5! px-2! py-4!"
          >
            <div
              class="bg-primary-soft text-primary group-hover:bg-primary flex size-10 items-center justify-center rounded-full transition-colors group-hover:text-white"
            >
              <IconUserPlus class="size-5" />
            </div>
            <span class="text-text group-hover:text-primary text-xs font-medium tracking-wide">{{
              t('statistics.registerCustomer', 'Register Customer')
            }}</span>
          </a-button>

          <a-button
            class="group border-divider! bg-surface-soft! hover:border-primary! hover:bg-primary-xsoft! h-auto! flex-col! gap-2.5! px-2! py-4!"
            @click="router.push('/vaccine-management')"
          >
            <div
              class="bg-primary-soft text-primary group-hover:bg-primary flex size-10 items-center justify-center rounded-full transition-colors group-hover:text-white"
            >
              <IconVaccine class="size-5" />
            </div>
            <span class="text-text group-hover:text-primary text-xs font-medium tracking-wide">{{
              t('statistics.manageVaccines', 'Manage Vaccines')
            }}</span>
          </a-button>

          <a-button
            class="group border-divider! bg-surface-soft! hover:border-primary! hover:bg-primary-xsoft! h-auto! flex-col! gap-2.5! px-2! py-4!"
          >
            <div
              class="bg-primary-soft text-primary group-hover:bg-primary flex size-10 items-center justify-center rounded-full transition-colors group-hover:text-white"
            >
              <IconReceipt class="size-5" />
            </div>
            <span class="text-text group-hover:text-primary text-xs font-medium tracking-wide">{{
              t('statistics.createInvoice', 'Create Invoice')
            }}</span>
          </a-button>
        </div>
      </div>
    </div>

    <ViewChartModal
      :open="isChartModalOpen"
      :on-cancel="
        () => {
          isChartModalOpen = false;
        }
      "
    />
  </PageLayout>
</template>
