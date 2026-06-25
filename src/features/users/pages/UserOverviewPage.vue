<script setup lang="ts">
import PageLayout from '@/layouts/PageLayout.vue';
import { IconPlus, IconReload, IconUsers, IconBriefcase, IconStethoscope, IconHome } from '@tabler/icons-vue';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import UserAccountTab from '../components/UserAccountTab.vue';
import UserUpdateModal from '../components/UserUpdateModal.vue';
import TabToggle from '@/shared/components/ui/TabToggle.vue';
import { useLocale } from '@/shared/composables/useLocale.ts';
import { useUserStore } from '@/store/userStore';
import { storeToRefs } from 'pinia';

const { t } = useLocale();
const userStore = useUserStore();
const router = useRouter();
const { overView } = storeToRefs(userStore);

const activeTab = ref('all');
const refreshKey = ref(0);

const isUpdateModalOpen = ref(false);
const selectedUserId = ref<string | null>(null);
const selectedUserInitialData = ref<any>(null);

function handleEditUser(user: any) {
  selectedUserId.value = user.id;
  selectedUserInitialData.value = user;
  isUpdateModalOpen.value = true;
}

function handleUpdateSuccess() {
  userStore.fetchUserList();
}

const overviewCards = computed(() => [
  { key: 'all', label: t('all'), value: overView.value?.users || 0, icon: IconUsers },
  { key: 'staff', label: t('staff'), value: overView.value?.staffs || 0, icon: IconBriefcase },
  {
    key: 'veterinarian',
    label: t('veterinarian'),
    value: overView.value?.vets || 0,
    icon: IconStethoscope,
  },
  { key: 'owner', label: t('owner'), value: overView.value?.owners || 0, icon: IconHome },
]);

onMounted(() => {
  userStore.fetchUserOverView();
});

function refreshData() {
  refreshKey.value += 1;
  userStore.fetchUserOverView();
}

const tabs = [
  { label: t('all'), key: 'all' },
  { label: t('staff'), key: 'staff' },
  { label: t('veterinarian'), key: 'veterinarian' },
  { label: t('owner'), key: 'owner' },
];
</script>

<template>
  <PageLayout>
    <div class="flex flex-col gap-6">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex flex-col">
          <span class="font-ibm text-text text-xl font-bold">{{ t('user.userOverview') }}</span>
          <span class="text-text-muted text-sm">{{ t('user.manageUserAccounts') }}</span>
        </div>
        <div class="flex items-center gap-3">
          <a-tooltip :title="t('refresh')">
            <a-button
              type="default"
              class="flex items-center justify-center shadow-sm"
              size="large"
              @click="refreshData"
            >
              <template #icon><IconReload size="18" class="text-text-muted" /></template>
            </a-button>
          </a-tooltip>
          <a-button type="primary" size="large" class="flex items-center justify-center gap-2 shadow-sm" @click="router.push('/user-management/create')">
            <template #icon><IconPlus size="18" /></template>
            <span class="font-medium">{{ t('add') }}</span>
          </a-button>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <div
          v-for="item in overviewCards"
          :key="item.key"
          class="bg-surface border-border flex flex-col justify-center border p-5"
        >
          <div class="flex items-center justify-between">
            <span class="text-text-muted text-sm font-medium">{{ item.label }}</span>
            <div class="bg-primary-soft text-primary flex h-10 w-10 items-center justify-center">
              <component :is="item.icon" size="22" stroke="1.5" />
            </div>
          </div>
          <div class="text-text mt-2 text-2xl font-bold">{{ item.value }}</div>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <TabToggle v-model="activeTab" :options="tabs" />

        <div class="mt-2">
          <UserAccountTab
            :key="`${activeTab}-${refreshKey}`"
            :role-code="activeTab === 'all' ? undefined : activeTab"
            @edit="handleEditUser"
          />
        </div>
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
