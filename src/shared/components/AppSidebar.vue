<script setup lang="ts">
import { computed, type Component } from 'vue';
import { RouterLink } from 'vue-router';
import { IconPlus } from '@tabler/icons-vue';
import { useLocale } from '@/shared/composables/useLocale';

type MenuItem = {
  key: string;
  to: string;
  icon: Component;
  label: string;
  group: string;
};

const props = defineProps<{
  menuItems: MenuItem[];
  selectedKeys: string[];
  isCollapsed?: boolean;
  isOpen?: boolean;
  isMobile?: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const { t } = useLocale();

const groupedMenuItems = computed(() => {
  const groups = new Map<string, MenuItem[]>();
  for (const item of props.menuItems) {
    if (!groups.has(item.group)) {
      groups.set(item.group, []);
    }
    groups.get(item.group)!.push(item);
  }
  return Array.from(groups, ([group, items]) => ({
    group,
    items,
  }));
});
</script>

<template>
  <nav
    :class="[
      'bg-surface-soft border-border fixed top-0 left-0 z-30 flex h-screen flex-col border-r transition-all duration-300 ease-in-out',
      isCollapsed ? 'w-[68px] px-2 py-3' : 'w-60 px-3 py-3',
      isMobile ? (isOpen ? 'shadow-popup translate-x-0' : '-translate-x-full') : 'translate-x-0',
    ]"
  >
    <!-- Logo Area -->
    <div :class="['mb-3 flex items-center overflow-hidden', isCollapsed ? 'justify-center px-0' : 'gap-2.5 px-1']">
      <img src="@/assets/images/logo-nbg.png" alt="PetVax Logo" class="size-9 shrink-0 object-contain" />
      <div v-if="!isCollapsed" class="min-w-0 transition-opacity duration-300">
        <span class="font-ibm! text-primary block truncate text-base leading-tight font-bold">PetVax</span>
        <span class="text-text-muted block truncate text-[10px] tracking-wide uppercase">Admin Portal</span>
      </div>
    </div>

    <!-- Separator -->
    <div class="border-divider mb-3 border-t" />

    <!-- Quick Register -->
    <div class="mb-3">
      <a-tooltip :title="isCollapsed ? t('navigation.quickRegister') : ''" placement="right">
        <a-button type="primary" class="w-full" :class="isCollapsed ? 'px-0!' : 'gap-2 px-3'">
          <template #icon>
            <IconPlus class="size-4 shrink-0" />
          </template>
          <span v-if="!isCollapsed" class="truncate whitespace-nowrap transition-opacity duration-300">
            {{ t('navigation.quickRegister') }}
          </span>
        </a-button>
      </a-tooltip>
    </div>

    <!-- Navigation Groups -->
    <div class="flex-1 space-y-5 overflow-x-hidden overflow-y-auto">
      <div v-for="group in groupedMenuItems" :key="group.group">
        <h3
          v-if="!isCollapsed"
          class="text-text-disabled mb-1.5 truncate px-2 text-[10px] font-semibold tracking-wider uppercase transition-opacity duration-300"
        >
          {{ group.group }}
        </h3>
        <ul class="space-y-0.5">
          <li v-for="item in group.items" :key="item.key">
            <a-tooltip :title="isCollapsed ? item.label : ''" placement="right">
              <RouterLink
                :to="item.to"
                @click="emit('close')"
                :class="[
                  'relative flex items-center rounded py-2 text-sm font-medium transition-all duration-150',
                  isCollapsed ? 'justify-center px-0' : 'gap-3 px-3',
                  selectedKeys.includes(item.key)
                    ? 'text-primary bg-primary/8 font-semibold'
                    : 'text-text-subtle hover:text-text hover:bg-black/5',
                ]"
              >
                <!-- Active left accent bar -->
                <span
                  v-if="selectedKeys.includes(item.key) && !isCollapsed"
                  class="bg-primary absolute top-1 bottom-1 left-0 w-0.5 rounded-full"
                />
                <component
                  :is="item.icon"
                  :class="[
                    'size-[18px] shrink-0 transition-colors',
                    selectedKeys.includes(item.key) ? 'text-primary' : 'text-text-muted',
                  ]"
                />
                <span v-if="!isCollapsed" class="truncate whitespace-nowrap transition-opacity duration-300">{{
                  item.label
                }}</span>
              </RouterLink>
            </a-tooltip>
          </li>
        </ul>
      </div>
    </div>

    <!-- Footer version tag -->
    <div v-if="!isCollapsed" class="border-divider mt-3 border-t pt-3">
      <span class="text-text-disabled block px-2 text-[10px]">v1.0.0 · PetVax System</span>
    </div>
  </nav>
</template>
