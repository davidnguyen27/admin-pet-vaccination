<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { IconGridDots, IconUsers, IconSettings, IconPaw, IconVaccine } from '@tabler/icons-vue';
import AppSidebar from './components/AppSidebar.vue';
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
import { authStore } from '@/features/auth/auth.store';

const collapsed = ref(false);
const router = useRouter();
const route = useRoute();
const auth = authStore();

const menuItems = [
  {
    key: '/dashboard',
    icon: IconGridDots,
    label: 'Dashboard',
    group: 'Overview',
  },
  {
    key: '/user-management',
    icon: IconUsers,
    label: 'Users',
    group: 'Management',
  },
  {
    key: '/pet-management',
    icon: IconPaw,
    label: 'Pets',
    group: 'Management',
  },
  {
    key: '/vaccine-management',
    icon: IconVaccine,
    label: 'Vaccines',
    group: 'Management',
  },
  {
    key: '/settings',
    icon: IconSettings,
    label: 'System Settings',
    group: 'System',
    disabled: true,
  },
];

const selectedKeys = ref<string[]>([route.path]);

const routeMeta = computed(() => {
  const map: Record<string, { section: string; title: string; subtitle: string }> = {
    '/dashboard': {
      section: 'Overview',
      title: 'Operations Dashboard',
      subtitle: 'Track clinic performance and watch system activity in real time.',
    },
    '/user-management': {
      section: 'Management',
      title: 'User Management',
      subtitle: 'Manage team accounts, access levels, and account status safely.',
    },
    '/pet-management': {
      section: 'Management',
      title: 'Pet Management',
      subtitle: 'Manage pet profiles, ownership records, and lifecycle information.',
    },
    '/vaccine-management': {
      section: 'Management',
      title: 'Vaccine Management',
      subtitle: 'Manage vaccine inventory, schedules, and administration records.',
    },
  };

  return (
    map[route.path] ?? {
      section: 'Admin',
      title: 'Admin Workspace',
      subtitle: 'Operate modules, monitor usage, and keep data organized.',
    }
  );
});

watch(
  () => route.path,
  path => {
    selectedKeys.value = [path];
  },
  { immediate: true },
);

const handleMenuClick = ({ key }: { key: string }) => {
  selectedKeys.value = [key];
  router.push(key);
};

const handleLogout = async () => {
  await auth.logout();
  router.push('/login');
};
</script>

<template>
  <a-layout class="admin-shell h-screen overflow-hidden">
    <app-sidebar
      :collapsed="collapsed"
      :selected-keys="selectedKeys"
      :menu-items="menuItems"
      @menu-click="handleMenuClick"
    />

    <a-layout class="flex h-screen min-h-0 flex-col overflow-hidden bg-transparent">
      <app-header
        :collapsed="collapsed"
        :page-section="routeMeta.section"
        :page-title="routeMeta.title"
        :page-subtitle="routeMeta.subtitle"
        user-name="Admin User"
        user-initial="A"
        @toggle-collapse="collapsed = !collapsed"
        @logout="handleLogout"
      />

      <a-layout-content class="flex-1 overflow-y-auto p-5">
        <div class="flex min-h-full flex-col gap-4">
          <div class="admin-content__inner border border-(--divider) bg-(--bg-card) p-4.5 shadow-sm">
            <slot />
          </div>

          <app-footer />
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
