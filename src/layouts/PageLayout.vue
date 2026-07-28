<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
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
import AppHeader from '@/shared/components/AppHeader.vue';
import AppSidebar from '@/shared/components/AppSidebar.vue';

const route = useRoute();
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
const isCollapsed = ref(window.innerWidth >= 1024 && window.innerWidth < 1280);
const isSidebarOpen = ref(false);
const viewportWidth = ref(window.innerWidth || 1440);

const isMobileLayout = computed(() => viewportWidth.value < 1024);

const contentOffsetClass = computed(() => {
  if (isMobileLayout.value) return 'ml-0';
  return isCollapsed.value ? 'ml-20' : 'ml-60';
});

const updateViewportWidth = () => {
  const prevWidth = viewportWidth.value;
  viewportWidth.value = window.innerWidth;

  if (viewportWidth.value < 1024) {
    isSidebarOpen.value = false;
  } else if (viewportWidth.value >= 1024 && viewportWidth.value < 1280) {
    if (prevWidth >= 1280) {
      isCollapsed.value = true;
    }
  } else if (viewportWidth.value >= 1280) {
    if (prevWidth < 1280 && prevWidth >= 1024) {
      isCollapsed.value = false;
    }
  }
};

const toggleSidebar = () => {
  if (isMobileLayout.value) {
    isSidebarOpen.value = !isSidebarOpen.value;
  } else {
    isCollapsed.value = !isCollapsed.value;
  }
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
};

onMounted(() => {
  updateViewportWidth();
  window.addEventListener('resize', updateViewportWidth);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateViewportWidth);
});

watch(
  () => route.path,
  path => {
    selectedKeys.value = [path];
    if (isMobileLayout.value) {
      closeSidebar();
    }
  },
  { immediate: true },
);

/** Map route path segments to human-readable labels.
 * Extend this map whenever a new route is added.
 */
const ROUTE_LABEL_MAP: Record<string, string> = {
  statistic: 'Dashboard',
  'user-management': 'Users',
  'pet-management': 'Pets',
  'vaccine-management': 'Vaccines',
  'microchip-management': 'Microchips',
  'health-certificate-management': 'Health Certificates',
  'voucher-management': 'Vouchers',
  'schedules-working': 'Schedules',
  settings: 'Settings',
  profile: 'Profile',
  create: 'Create',
};

const breadcrumbs = computed(() => {
  const matched = route.matched.filter(record => record.meta && record.meta.breadcrumb);
  if (matched.length > 0) {
    return matched.map(record => ({
      path: record.path,
      breadcrumbName:
        typeof record.meta.breadcrumb === 'function' ? record.meta.breadcrumb(route) : record.meta.breadcrumb,
    }));
  }

  const paths = route.path.split('/').filter(p => p);
  let currentPath = '';
  const crumbs = paths.map(segment => {
    currentPath += `/${segment}`;
    const label =
      ROUTE_LABEL_MAP[segment] ??
      segment
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    return { path: currentPath, breadcrumbName: label };
  });

  return [{ path: '/statistic', breadcrumbName: 'Home' }, ...crumbs];
});
</script>

<template>
  <div class="bg-bg text-text flex h-screen overflow-hidden">
    <div
      v-if="isMobileLayout && isSidebarOpen"
      class="fixed inset-0 z-20 bg-black/35"
      aria-hidden="true"
      @click="closeSidebar"
    ></div>

    <AppSidebar
      :menuItems="menuItems"
      :selectedKeys="selectedKeys"
      :isCollapsed="isCollapsed"
      :isOpen="isSidebarOpen"
      :isMobile="isMobileLayout"
      @close="closeSidebar"
    />

    <div :class="['flex h-screen min-w-0 flex-1 flex-col transition-all duration-300 ease-in-out', contentOffsetClass]">
      <AppHeader @toggle-sidebar="toggleSidebar" />

      <div class="bg-surface border-divider border-b px-4 py-2 sm:px-5">
        <a-breadcrumb class="text-xs!">
          <a-breadcrumb-item v-for="(crumb, idx) in breadcrumbs" :key="idx">
            <router-link
              v-if="idx < breadcrumbs.length - 1"
              :to="crumb.path"
              class="text-text-muted hover:text-primary transition-colors"
            >
              {{ crumb.breadcrumbName }}
            </router-link>
            <span v-else class="text-text-subtle font-medium">{{ crumb.breadcrumbName }}</span>
          </a-breadcrumb-item>
        </a-breadcrumb>
      </div>

      <main class="flex-1 space-y-4 overflow-x-hidden overflow-y-auto p-4 sm:p-5 lg:p-5">
        <slot></slot>
      </main>
    </div>
  </div>
</template>
