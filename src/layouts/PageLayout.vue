<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import {
  IconCpu,
  IconLayoutDashboard,
  IconUsers,
  IconPaw,
  IconVaccine,
  IconCertificate,
  IconTicket,
  IconCalendarTime,
} from '@tabler/icons-vue';
import { useLocale } from '@/shared/composables/useLocale';
import { useAuthStore } from '@/store/authStore';
import AppHeader from '@/shared/components/AppHeader.vue';
import AppSidebar from '@/shared/components/AppSidebar.vue';

const route = useRoute();
const auth = useAuthStore();
const { t } = useLocale();

const menuItems = computed(() => [
  {
    key: '/statistic',
    to: '/statistic',
    icon: IconLayoutDashboard,
    label: t('navigation.statistics'),
    group: t('navigation.overview'),
  },
  {
    key: '/user-management',
    to: '/user-management',
    icon: IconUsers,
    label: t('navigation.users'),
    group: t('navigation.management'),
  },
  {
    key: '/vaccine-management',
    to: '/vaccine-management',
    icon: IconVaccine,
    label: t('navigation.vaccines'),
    group: t('navigation.management'),
  },
  {
    key: '/microchip-management',
    to: '/microchip-management',
    icon: IconCpu,
    label: t('navigation.microchips'),
    group: t('navigation.management'),
  },
  {
    key: '/health-certificate-management',
    to: '/health-certificate-management',
    icon: IconCertificate,
    label: t('navigation.healthCertificate'),
    group: t('navigation.management'),
  },
  {
    key: '/pet-management',
    to: '/pet-management',
    icon: IconPaw,
    label: t('navigation.pets'),
    group: t('navigation.management'),
  },
  {
    key: '/voucher-management',
    to: '/voucher-management',
    icon: IconTicket,
    label: t('navigation.vouchers'),
    group: t('navigation.management'),
  },
  {
    key: '/schedules-working',
    to: '/schedules-working',
    icon: IconCalendarTime,
    label: t('navigation.schedulesWorking'),
    group: t('navigation.management'),
  },
]);

const selectedKeys = ref<string[]>([route.path]);
const isCollapsed = ref(false);

onMounted(async () => {
  if (auth.accessToken && !auth.user) {
    try {
      await auth.fetchCurrentUser();
    } catch (error) {
      console.error('Failed to fetch current user:', error);
    }
  }
});

watch(
  () => route.path,
  path => {
    selectedKeys.value = [path];
  },
  { immediate: true },
);
</script>

<template>
  <div class="bg-bg text-text flex min-h-screen">
    <AppSidebar :menuItems="menuItems" :selectedKeys="selectedKeys" :isCollapsed="isCollapsed" />

    <div
      :class="[
        'flex min-h-screen flex-1 flex-col transition-all duration-300 ease-in-out',
        isCollapsed ? 'ml-20' : 'ml-60',
      ]"
    >
      <AppHeader @toggle-sidebar="isCollapsed = !isCollapsed" />

      <main class="flex-1 space-y-4 overflow-y-auto p-4">
        <slot></slot>
      </main>
    </div>
  </div>
</template>
