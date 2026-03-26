<script setup lang="ts">
import type { Component } from 'vue';
import { computed } from 'vue';
import { IconCloudUp, IconShieldCheck } from '@tabler/icons-vue';

interface MenuItem {
  key: string;
  icon: Component;
  label: string;
  group?: string;
  disabled?: boolean;
}

const props = defineProps<{
  collapsed: boolean;
  selectedKeys: string[];
  menuItems: MenuItem[];
}>();

const emit = defineEmits<{
  (e: 'menuClick', payload: { key: string }): void;
}>();

const groupedMenuItems = computed(() => {
  const grouped: Record<string, MenuItem[]> = {};

  props.menuItems.forEach(item => {
    const group = item.group ?? 'General';
    if (!grouped[group]) {
      grouped[group] = [];
    }
    grouped[group].push(item);
  });

  return grouped;
});
</script>

<template>
  <a-layout-sider
    :collapsed="props.collapsed"
    :trigger="null"
    collapsible
    :width="260"
    :collapsed-width="78"
    class="sticky top-0 flex min-h-screen flex-col overflow-hidden border-r border-(--divider)! bg-(--bg-card)!"
  >
    <!-- Logo -->
    <div
      class="flex h-16 min-h-16 items-center gap-2 overflow-hidden border-b border-(--divider) bg-(--bg-card) px-4"
      :class="{ 'justify-center p-0': props.collapsed }"
    >
      <div
        class="flex h-9 w-9 min-w-9 items-center justify-center border border-(--color-primary) bg-(--color-primary-soft)"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 2C8.5 2 5.5 4.5 5.5 8C5.5 10.5 6.8 12.7 8.8 13.9L7.5 20H16.5L15.2 13.9C17.2 12.7 18.5 10.5 18.5 8C18.5 4.5 15.5 2 12 2Z"
            fill="var(--color-primary)"
            opacity="0.15"
          />
          <path
            d="M12 2C8.5 2 5.5 4.5 5.5 8C5.5 10.5 6.8 12.7 8.8 13.9L7.5 20H16.5L15.2 13.9C17.2 12.7 18.5 10.5 18.5 8C18.5 4.5 15.5 2 12 2Z"
            stroke="var(--color-primary)"
            stroke-width="1.5"
            stroke-linejoin="round"
          />
          <path
            d="M9 8.5C9 7.1 10.3 6 12 6C13.7 6 15 7.1 15 8.5"
            stroke="var(--color-primary)"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
      </div>
      <transition name="logo-text">
        <div v-if="!props.collapsed" class="flex flex-col overflow-hidden leading-snug">
          <span class="text-sm font-bold tracking-[-0.3px] whitespace-nowrap text-(--text-primary)">PetClinic</span>
          <span class="text-xs font-semibold tracking-wider whitespace-nowrap text-(--color-primary) uppercase"
            >Admin</span
          >
        </div>
      </transition>
    </div>

    <!-- Navigation -->
    <div class="flex-1 overflow-x-hidden overflow-y-auto py-3">
      <a-menu
        :selected-keys="props.selectedKeys"
        mode="inline"
        :inline-collapsed="props.collapsed"
        class="border-none bg-transparent! px-2.5"
        @click="(payload: { key: string }) => emit('menuClick', payload)"
      >
        <template v-for="(items, groupName) in groupedMenuItems" :key="groupName">
          <a-menu-item-group v-if="!props.collapsed" :title="groupName" class="sidebar-menu__group" />
          <a-menu-item v-for="item in items" :key="item.key" :disabled="item.disabled" class="sidebar-menu__item">
            <template #icon>
              <component :is="item.icon" :size="18" stroke-width="1.75" class="sidebar-menu__icon" />
            </template>
            <span class="text-sm font-medium">{{ item.label }}</span>
          </a-menu-item>
        </template>
      </a-menu>
    </div>

    <!-- Footer -->
    <div v-if="!props.collapsed" class="border-t border-(--divider) px-4 py-3">
      <div class="border border-(--divider) bg-[#f8fafc] px-3 py-2">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-semibold tracking-wide text-(--text-label) uppercase">System</span>
          <span class="inline-flex items-center gap-1 text-[11px] text-(--color-success)">
            <icon-cloud-up :size="13" />
            Online
          </span>
        </div>
        <div class="mt-2 flex items-center gap-1.5 text-[11px] text-(--text-label)">
          <icon-shield-check :size="13" />
          Security policy active
        </div>
      </div>
    </div>
  </a-layout-sider>
</template>

<style scoped>
:deep(.ant-layout-sider-children) {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
</style>
