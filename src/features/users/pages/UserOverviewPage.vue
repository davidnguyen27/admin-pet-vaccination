<script setup lang="ts">
import PageLayout from '@/layouts/PageLayout.vue';
import { IconPlus, IconReload, IconUsers, IconBriefcase, IconStethoscope, IconHome } from '@tabler/icons-vue';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import UserAccountTab from '../components/UserAccountTab.vue';
import UserUpdateModal from '../components/UserUpdateModal.vue';
import { useLocale } from '@/shared/composables/useLocale';
import { useUserStore } from '@/store/userStore';
import { storeToRefs } from 'pinia';
import type { User } from '@/shared/types/user.type';

const { t } = useLocale();
const userStore = useUserStore();
const router = useRouter();
const { overView } = storeToRefs(userStore);

type UserTabKey = 'all' | 'staff' | 'veterinarian' | 'owner';

const activeTab = ref<UserTabKey>('all');
const refreshToken = ref(0);

const isUpdateModalOpen = ref(false);
const selectedUserId = ref<string | null>(null);
const selectedUserInitialData = ref<User | null>(null);

const activeRoleCode = computed(() => (activeTab.value === 'all' ? undefined : activeTab.value));

const overviewCards = computed(() => [
  {
    key: 'all' as const,
    label: t('all'),
    value: overView.value.users,
    icon: IconUsers,
    description: t('user.totalAccounts'),
  },
  {
    key: 'staff' as const,
    label: t('staff'),
    value: overView.value.staffs,
    icon: IconBriefcase,
    description: t('user.staffAccounts'),
  },
  {
    key: 'veterinarian' as const,
    label: t('veterinarian'),
    value: overView.value.vets,
    icon: IconStethoscope,
    description: t('user.vetAccounts'),
  },
  {
    key: 'owner' as const,
    label: t('owner'),
    value: overView.value.owners,
    icon: IconHome,
    description: t('user.ownerAccounts'),
  },
]);

function handleEditUser(user: User) {
  selectedUserId.value = user.id;
  selectedUserInitialData.value = user;
  isUpdateModalOpen.value = true;
}

onMounted(() => {
  userStore.fetchUserOverView();
});

function refreshData() {
  refreshToken.value += 1;
  userStore.fetchUserOverView();
}

function handleUpdateSuccess() {
  refreshData();
}
</script>

<template>
  <PageLayout>
    <div class="flex flex-col gap-6">
      <!-- Page Header -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="font-ibm text-text text-xl font-bold">{{ t('user.userOverview') }}</h1>
          <span class="text-text-muted mt-0.5 block text-sm">{{ t('user.manageUserAccounts') }}</span>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <a-tooltip :title="t('refresh')">
            <a-button shape="circle" @click="refreshData">
              <template #icon><IconReload class="size-4" /></template>
            </a-button>
          </a-tooltip>
          <a-button type="primary" class="flex items-center gap-2" @click="router.push('/user-management/create')">
            <template #icon><IconPlus class="size-4" /></template>
            <span class="font-medium">{{ t('user.addUser') }}</span>
          </a-button>
        </div>
      </div>

      <!-- Metric Cards (Tabs) -->
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <button
          v-for="item in overviewCards"
          :key="item.key"
          type="button"
          :class="[
            'shadow-card border-divider group flex cursor-pointer flex-col gap-3 rounded border p-4 transition-all duration-200 hover:shadow-(--shadow-card-hover)',
            activeTab === item.key ? 'border-primary bg-primary-xsoft' : 'bg-surface',
          ]"
          @click="activeTab = item.key"
        >
          <!-- Card top row -->
          <div class="flex w-full items-start justify-between">
            <span
              :class="[
                'text-xs font-medium tracking-wide transition-colors',
                activeTab === item.key ? 'text-primary' : 'text-text-muted group-hover:text-text',
              ]"
            >
              {{ item.label }}
            </span>
            <div
              :class="[
                'flex size-8 items-center justify-center rounded-md transition-colors',
                activeTab === item.key ? 'bg-primary text-white' : 'bg-primary-soft text-primary',
              ]"
            >
              <component :is="item.icon" class="size-4" stroke="1.5" />
            </div>
          </div>

          <!-- Value -->
          <span class="text-text flex w-full text-left text-2xl font-bold tracking-tight">{{ item.value }}</span>

          <!-- Description -->
          <span class="text-text-disabled flex w-full text-left text-xs">{{ item.description }}</span>
        </button>
      </div>

      <!-- User List -->
      <div class="shadow-card border-divider bg-surface flex flex-col gap-4 rounded-md border p-5">
        <UserAccountTab :role-code="activeRoleCode" :refresh-token="refreshToken" @edit="handleEditUser" />
      </div>
    </div>

    <UserUpdateModal
      v-model:open="isUpdateModalOpen"
      :user-id="selectedUserId"
      :initial-data="selectedUserInitialData"
      @success="handleUpdateSuccess"
    />
  </PageLayout>
</template>
