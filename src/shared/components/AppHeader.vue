<script setup lang="ts">
import {
  IconSearch,
  IconBell,
  IconHistory,
  IconMenu2,
  IconLanguage,
  IconSettings,
  IconLogout,
  IconUser,
  IconX,
} from '@tabler/icons-vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useLocale } from '@/shared/composables/useLocale';
import { useAuthStore } from '@/store/authStore';

defineEmits<{
  (e: 'toggle-sidebar'): void;
}>();

const router = useRouter();
const { t, locale, setLocale } = useLocale();
const authStore = useAuthStore();

const isMobileSearchOpen = ref(false);
const notificationCount = ref(3);

const userFirstName = () => {
  const name = authStore.user?.fullName ?? '';
  const parts = name.split(' ');
  return parts[parts.length - 1] ?? name;
};

const handleLogout = async () => {
  await authStore.logout();
  router.replace('/sign-in');
};

const goToSettings = () => {
  router.push('/settings');
};

const goToProfile = () => {
  router.push('/profile');
};

const handleMenuClick = (info: any) => {
  const key = info?.key;
  if (key === 'settings') {
    goToSettings();
  } else if (key === 'profile') {
    goToProfile();
  } else if (key === 'logout') {
    handleLogout();
  }
};
</script>

<template>
  <header
    class="border-divider bg-primary sticky top-0 z-10 flex h-14 w-full min-w-0 items-center justify-between gap-3 border-b px-3 sm:px-4"
  >
    <!-- Hamburger / Collapse toggle -->
    <button
      type="button"
      class="flex size-9 shrink-0 items-center justify-center rounded text-white! transition-all hover:bg-white/20"
      @click="$emit('toggle-sidebar')"
    >
      <IconMenu2 class="size-5" />
    </button>

    <!-- Desktop Search -->
    <div class="hidden min-w-0 flex-1 justify-center lg:flex">
      <div class="group relative w-full max-w-80 xl:max-w-96">
        <IconSearch
          class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white transition-opacity group-focus-within:opacity-100"
        />
        <input
          class="w-full rounded border border-white/20 bg-white/10 py-1.5 pr-3 pl-9 text-sm text-white placeholder-white/70 transition-all focus:border-white focus:bg-white/20 focus:outline-none"
          type="text"
          name="search"
          :placeholder="t('common.search')"
        />
      </div>
    </div>

    <!-- Right controls -->
    <div class="flex shrink-0 items-center gap-1.5 sm:gap-2">
      <!-- Mobile search toggle -->
      <button
        type="button"
        class="flex size-9 items-center justify-center rounded-md text-white! transition-all duration-200 hover:bg-white/20 lg:hidden"
        @click="isMobileSearchOpen = !isMobileSearchOpen"
      >
        <component :is="isMobileSearchOpen ? IconX : IconSearch" class="size-5" />
      </button>

      <!-- Language -->
      <a-dropdown placement="bottomRight" :trigger="['click']">
        <button
          type="button"
          class="flex size-9 items-center justify-center rounded text-white! transition-all duration-200 hover:bg-white/20"
        >
          <IconLanguage class="size-5" />
        </button>
        <template #overlay>
          <a-menu :selected-keys="[locale]" @click="(e: any) => setLocale(e.key as string)">
            <a-menu-item key="en">English</a-menu-item>
            <a-menu-item key="vi">Tiếng Việt</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>

      <!-- Notification Bell -->
      <a-tooltip title="Notifications" placement="bottom">
        <button
          type="button"
          class="relative flex size-9 items-center justify-center rounded text-white! transition-all duration-200 hover:bg-white/20"
        >
          <IconBell class="size-5" />
          <span
            v-if="notificationCount > 0"
            class="absolute top-1.5 right-1.5 flex size-[15px] items-center justify-center rounded-full border border-white bg-rose-500 text-xs leading-none font-bold text-white shadow-sm"
          >
            {{ notificationCount > 9 ? '9+' : notificationCount }}
          </span>
        </button>
      </a-tooltip>

      <!-- History -->
      <a-tooltip title="Activity history" placement="bottom">
        <button
          type="button"
          class="hidden size-9 items-center justify-center rounded-md text-white! transition-all duration-200 hover:bg-white/20 sm:flex"
        >
          <IconHistory class="size-5" />
        </button>
      </a-tooltip>

      <!-- Divider -->
      <div class="mx-1 h-5 w-px bg-white/20" />

      <!-- User Profile -->
      <a-dropdown placement="bottomRight" :trigger="['click']">
        <div
          class="flex cursor-pointer items-center gap-2.5 rounded px-2 py-1.5 transition-all duration-200 hover:bg-white/20"
        >
          <span
            class="text-primary flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold shadow-sm"
          >
            {{ authStore.user?.fullName?.charAt(0) ?? 'A' }}
          </span>
          <span class="hidden max-w-28 truncate text-sm font-medium text-white lg:block">
            {{ userFirstName() || 'Admin' }}
          </span>
        </div>
        <template #overlay>
          <a-menu @click="handleMenuClick">
            <div class="border-divider border-b px-4 py-3">
              <p class="text-text truncate text-sm font-semibold">{{ authStore.user?.fullName ?? 'Administrator' }}</p>
              <p class="text-text-muted truncate text-xs">{{ authStore.user?.email ?? '' }}</p>
            </div>
            <a-menu-item key="profile" @click="goToProfile">
              <router-link to="/profile" class="flex items-center gap-2.5 py-1 text-text hover:text-primary">
                <IconUser class="text-text-muted size-4" />
                <span>{{ t('user.userProfile') }}</span>
              </router-link>
            </a-menu-item>
            <a-menu-item key="settings" @click="goToSettings">
              <router-link to="/settings" class="flex items-center gap-2.5 py-1 text-text hover:text-primary">
                <IconSettings class="text-text-muted size-4" />
                <span>{{ t('navigation.settings') }}</span>
              </router-link>
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item key="logout" danger @click="handleLogout">
              <div class="flex items-center gap-2.5 py-1">
                <IconLogout class="size-4" />
                <span>{{ t('auth.signIn') ? 'Đăng xuất' : 'Logout' }}</span>
              </div>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>

    <!-- Mobile Search Overlay -->
    <Transition name="slide-down">
      <div
        v-if="isMobileSearchOpen"
        class="border-divider bg-primary absolute top-14 right-0 left-0 z-20 border-b px-4 py-3 shadow-md lg:hidden"
      >
        <div class="relative">
          <IconSearch class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white" />
          <input
            autofocus
            class="w-full rounded border border-white/30 bg-white/10 py-2 pr-3 pl-9 text-sm text-white placeholder-white/70 transition-all focus:border-white focus:bg-white/20 focus:outline-none"
            type="text"
            placeholder="Search patients, vaccines, staff..."
          />
        </div>
      </div>
    </Transition>
  </header>
</template>
