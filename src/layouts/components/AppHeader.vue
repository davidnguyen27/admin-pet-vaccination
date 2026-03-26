<script setup lang="ts">
import {
  IconMenu2,
  IconLayoutSidebarLeftCollapse,
  IconBell,
  IconLogout,
  IconSearch,
  IconKeyboard,
} from '@tabler/icons-vue';

const props = defineProps<{
  collapsed: boolean;
  pageSection: string;
  pageTitle: string;
  pageSubtitle: string;
  userName?: string;
  userInitial?: string;
}>();

const emit = defineEmits<{
  (e: 'toggleCollapse'): void;
  (e: 'logout'): void;
}>();
</script>

<template>
  <a-layout-header
    class="sticky top-0 z-100 flex min-h-16 items-center justify-between border-b border-(--divider) bg-(--bg-card)! px-4! py-2 leading-none!"
  >
    <div class="flex min-w-0 items-center gap-3">
      <button
        class="flex size-8.5 shrink-0 cursor-pointer items-center justify-center border border-transparent bg-transparent text-(--text-label) transition hover:border-(--divider) hover:bg-(--bg-page) hover:text-(--color-primary)"
        :aria-label="props.collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        @click="emit('toggleCollapse')"
      >
        <icon-layout-sidebar-left-collapse v-if="!props.collapsed" :size="20" stroke-width="1.75" />
        <icon-menu2 v-else :size="20" stroke-width="1.75" />
      </button>

      <div class="min-w-0">
        <div class="text-[11px] font-semibold tracking-[0.08em] text-(--text-disabled) uppercase">
          {{ props.pageSection }}
        </div>
        <div class="truncate text-[16px] font-semibold text-(--text-primary)">{{ props.pageTitle }}</div>
        <div class="hidden truncate text-[12px] text-(--text-label) lg:block">{{ props.pageSubtitle }}</div>
      </div>
    </div>

    <!-- Right: actions -->
    <div class="flex items-center gap-2">
      <button
        class="hidden h-8.5 min-w-52.5 items-center justify-between border border-(--divider) bg-white px-3 text-(--text-label) transition hover:border-(--color-primary) md:flex"
        type="button"
      >
        <span class="flex items-center gap-1.5 text-[12px]">
          <icon-search :size="14" />
          Search modules
        </span>
        <span class="flex items-center gap-1 text-[11px] text-(--text-disabled)">
          <icon-keyboard :size="13" />
          Ctrl+K
        </span>
      </button>

      <!-- Notification bell -->
      <a-tooltip title="Notifications">
        <button
          class="relative flex size-8.5 cursor-pointer items-center justify-center border border-transparent bg-transparent text-(--text-label) transition-colors hover:border-(--divider) hover:bg-(--bg-page) hover:text-(--color-primary)"
        >
          <icon-bell :size="18" stroke-width="1.75" />
          <span class="right-1.75size-1.75 absolute top-1.75 border border-(--bg-card) bg-(--color-error)"></span>
        </button>
      </a-tooltip>

      <!-- Divider -->
      <div class="mx-1 h-6 w-px bg-(--divider)"></div>

      <!-- User info -->
      <div class="flex cursor-default items-center gap-2 border border-(--divider) bg-(--bg-page) px-2 py-1">
        <div
          class="flex h-8 w-8 min-w-8 items-center justify-center bg-linear-to-br from-(--color-primary) to-(--color-accent) text-[13px] font-bold tracking-[0.5px] text-white"
        >
          {{ props.userInitial ?? 'A' }}
        </div>
        <div class="hidden flex-col leading-snug sm:flex">
          <span class="text-[13px] font-semibold whitespace-nowrap text-(--text-primary)">
            {{ props.userName ?? 'Admin User' }}
          </span>
          <span class="text-[11px] whitespace-nowrap text-(--text-label)">Administrator</span>
        </div>
      </div>

      <!-- Logout -->
      <a-tooltip title="Logout">
        <button
          class="flex size-8.5 cursor-pointer items-center justify-center border border-transparent bg-transparent text-(--text-label) transition-colors hover:border-(--color-error)/30 hover:bg-(--color-error-bg) hover:text-(--color-error)"
          @click="emit('logout')"
        >
          <icon-logout :size="18" stroke-width="1.75" />
        </button>
      </a-tooltip>
    </div>
  </a-layout-header>
</template>
