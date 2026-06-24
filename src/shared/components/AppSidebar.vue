<script setup lang="ts">
import { useAuthStore } from '@/store/authStore';
import { IconPlus, IconSettings, IconLogout } from '@tabler/icons-vue';
import { computed, type Component } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

type MenuItem = {
  key: string;
  to: string;
  icon: Component;
  label: string;
  group: string;
};

const props = defineProps<{ menuItems: MenuItem[]; selectedKeys: string[]; isCollapsed?: boolean }>();
const authStore = useAuthStore();
const router = useRouter();

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

async function handleLogout() {
  await authStore.logout();
  router.replace('/sign-in');
}
</script>

<template>
  <nav
    :class="[
      'bg-surface-soft border-border fixed top-0 left-0 z-20 flex h-screen flex-col border-r py-2 transition-all duration-300 ease-in-out',
      isCollapsed ? 'w-20 px-2' : 'w-60 px-4',
    ]"
  >
    <div :class="['mb-4.5 flex items-center overflow-hidden', isCollapsed ? 'justify-center' : 'gap-3']">
      <img src="@/assets/images/logo-nbg.png" alt="PetClinic Logo" class="size-14 shrink-0 object-contain" />
      <span v-if="!isCollapsed" class="font-ibm! text-primary text-xl font-semibold transition-opacity duration-300"
        >PetVax</span
      >
    </div>
    <div class="mb-6">
      <button
        type="button"
        :class="[
          'bg-primary flex w-full items-center justify-center rounded-sm py-2 text-sm! font-medium text-white! transition-all duration-300 hover:opacity-80',
          isCollapsed ? 'px-0' : 'gap-2 px-4',
        ]"
      >
        <IconPlus class="size-5 shrink-0" />
        <span v-if="!isCollapsed" class="whitespace-nowrap transition-opacity duration-300">Quick Register</span>
      </button>
    </div>

    <div class="flex-1 space-y-6 overflow-x-hidden overflow-y-auto">
      <div v-for="group in groupedMenuItems" :key="group.group">
        <h3
          v-if="!isCollapsed"
          class="text-text-muted mb-2 px-3 text-xs font-semibold tracking-wider uppercase transition-opacity duration-300"
        >
          {{ group.group }}
        </h3>
        <ul class="space-y-1">
          <li v-for="item in group.items" :key="item.key">
            <RouterLink
              :to="item.to"
              :title="isCollapsed ? item.label : undefined"
              :class="[
                'flex items-center py-2.5 text-sm font-medium transition-colors duration-150',
                isCollapsed ? 'justify-center px-0' : 'gap-3 px-3',
                selectedKeys.includes(item.key)
                  ? 'text-primary! border-secondary bg-primary/10 rounded-sm border-r-2 font-bold'
                  : 'text-text rounded-sm hover:bg-black/5',
              ]"
            >
              <component :is="item.icon" class="size-5 shrink-0" />
              <span v-if="!isCollapsed" class="whitespace-nowrap transition-opacity duration-300">{{
                item.label
              }}</span>
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>

    <div :class="['border-accent mt-auto border-t pt-3', isCollapsed ? 'px-0' : '']">
      <ul class="space-y-2">
        <li>
          <RouterLink
            :to="'/settings'"
            :title="isCollapsed ? 'Settings' : undefined"
            :class="[
              'text-text flex items-center rounded-sm py-1.5 text-sm font-medium transition-colors duration-150 hover:bg-black/5',
              isCollapsed ? 'justify-center px-0' : 'gap-3 px-3',
            ]"
          >
            <IconSettings class="size-5 shrink-0" />
            <span v-if="!isCollapsed" class="whitespace-nowrap transition-opacity duration-300">Settings</span>
          </RouterLink>
        </li>
        <li>
          <button
            @click="handleLogout"
            :title="isCollapsed ? 'Logout' : undefined"
            :class="[
              'text-text flex items-center rounded-sm py-1.5 text-sm font-medium transition-colors duration-150 hover:bg-black/5',
              isCollapsed ? 'justify-center px-0' : 'gap-3 px-3',
            ]"
          >
            <IconLogout class="size-5 shrink-0" />
            <span v-if="!isCollapsed" class="whitespace-nowrap transition-opacity duration-300">Logout</span>
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>
