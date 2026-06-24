<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/userStore';
import PageLayout from '@/layouts/PageLayout.vue';
import UserUpdateModal from '../components/UserUpdateModal.vue';
import DeleteModal from '@/shared/components/ui/DeleteModal.vue';
import {
  IconEdit,
  IconShieldLock,
  IconInfoCircle,
  IconShieldLockFilled,
  IconCircleFilled,
  IconArrowLeft,
  IconTrash,
} from '@tabler/icons-vue';
import { formatDate } from '@/shared/utils';
import { useLocale } from '@/shared/composables/useLocale';
import { mapRoleCode } from '@/shared/helpers';
import { message } from 'ant-design-vue';

const route = useRoute();
const router = useRouter();
const { t } = useLocale();

const userStore = useUserStore();

const { user, loading } = storeToRefs(userStore);
const isUpdateModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const isDeleting = ref(false);
const userId = computed(() => route.params.id as string);

onMounted(() => {
  if (userId.value) {
    userStore.getUser(userId.value);
  }
});

function renderUserName() {
  return (
    user.value?.fullName
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 3)
      .toUpperCase() || 'U'
  );
}

function handleEditProfile() {
  isUpdateModalOpen.value = true;
}

async function handleDeleteUser() {
  if (!userId.value) return;
  isDeleting.value = true;
  try {
    const res = await userStore.deleteUser(userId.value);
    if (res && res.success) {
      message.success(t('success') || 'User deleted successfully');
      router.push('/user-management');
    }
  } catch (error: any) {
    message.error(error.response?.data?.message || t('error') || 'Failed to delete user');
  } finally {
    isDeleting.value = false;
  }
}

function handleUpdateSuccess() {
  if (userId.value) {
    userStore.getUser(userId.value);
  }
}
</script>

<template>
  <PageLayout>
    <div class="flex items-start justify-between">
      <div class="flex flex-col gap-1">
        <span class="font-ibm text-text text-xl font-bold">
          {{ t('user.userProfile') }}
        </span>
        <span class="text-text-muted text-sm">
          {{ t('user.manageUserDesc') }}
        </span>
      </div>
      <div class="flex items-center gap-3">
        <a-button
          type="default"
          size="large"
          @click="() => router.push('/user-management')"
          class="hover:border-border! flex items-center justify-center gap-2 shadow-sm"
        >
          <template #icon><IconArrowLeft size="18" /></template>
          <span class="font-medium">{{ t('user.backToDashboard') }}</span>
        </a-button>
        <a-button
          danger
          size="large"
          class="flex items-center justify-center gap-2 shadow-sm"
          @click="isDeleteModalOpen = true"
        >
          <template #icon><IconTrash size="18" class="text-error" /></template>
          <span class="text-error font-medium">{{ t('Delete') }}</span>
        </a-button>
        <a-button
          @click="handleEditProfile"
          type="primary"
          size="large"
          class="hover:bg-primary-hover flex items-center justify-center gap-2 shadow-sm"
        >
          <template #icon><IconEdit size="18" class="text-white" /></template>
          <span class="font-medium text-white">{{ t('user.editProfile') }}</span>
        </a-button>
      </div>
    </div>

    <div v-if="loading" class="flex h-[60vh] items-center justify-center">
      <a-spin size="large" />
    </div>

    <div v-else-if="user" class="mt-6 flex flex-col gap-6 lg:flex-row">
      <!-- Left Panel -->
      <div class="flex w-full flex-col gap-6 lg:w-1/3">
        <div class="border-border bg-surface flex flex-col items-center rounded border p-6">
          <div v-if="user.avatarUrl" class="border-border mb-4 h-24 w-24 overflow-hidden rounded-full border">
            <img :src="user.avatarUrl" alt="Avatar" class="h-full w-full object-cover" />
          </div>
          <div
            v-else
            class="bg-primary-soft text-primary mb-4 flex h-24 w-24 items-center justify-center rounded-full text-3xl font-bold"
          >
            {{ renderUserName() }}
          </div>

          <h2 class="text-text text-lg font-bold">{{ user.fullName }}</h2>
          <p class="text-text-muted mb-4 text-sm">{{ user.email }}</p>

          <div class="mb-6 flex items-center gap-2">
            <span class="bg-primary-soft text-primary rounded px-3 py-1 text-xs font-semibold tracking-wider uppercase">
              {{ mapRoleCode(user.role) }}
            </span>
            <span
              class="flex items-center gap-1 rounded px-3 py-1 text-xs font-semibold"
              :class="user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
            >
              <IconCircleFilled size="8" />
              {{ user.isActive ? t('active') : t('inactive') }}
            </span>
          </div>

          <div class="bg-border mb-4 h-px w-full"></div>

          <p class="text-text-muted text-xs">
            {{ t('user.lastLogin') }}:
            {{ user.lastLoginAt ? formatDate(user.lastLoginAt, 'DD MMM YYYY, HH:mm') : 'N/A' }}
          </p>
        </div>

        <div class="border-border bg-surface rounded border">
          <div class="flex items-center gap-2 p-4 pb-2">
            <IconShieldLock class="text-primary" size="20" />
            <h3 class="text-text text-sm font-semibold">{{ t('user.securitySettings') }}</h3>
          </div>
          <div class="flex flex-col">
            <div class="border-border flex items-center justify-between border-b p-4">
              <div>
                <p class="text-text mb-0.5 text-xs font-medium">{{ t('user.password') }}</p>
                <p class="text-text-muted text-[11px]">******</p>
              </div>
              <a href="#" class="text-primary text-xs font-semibold hover:underline">Update</a>
            </div>
            <div class="border-border flex items-center justify-between border-b p-4">
              <div>
                <p class="text-text mb-0.5 text-xs font-medium">{{ t('user.twoFactorAuth') }}</p>
                <p class="text-text-muted text-[11px]">-</p>
              </div>
              <a href="#" class="text-primary text-xs font-semibold hover:underline">Manage</a>
            </div>
            <div class="flex items-center justify-between p-4">
              <div>
                <p class="text-text mb-0.5 text-xs font-medium">{{ t('user.activeSessions') }}</p>
                <p class="text-text-muted text-[11px]">-</p>
              </div>
              <a href="#" class="text-primary text-xs font-semibold hover:underline">View All</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Panel -->
      <div class="flex w-full flex-col gap-6 lg:w-2/3">
        <div class="border-border bg-surface relative rounded border p-6">
          <h3 class="text-text mb-6 text-sm font-semibold">{{ t('user.accountInformation') }}</h3>
          <IconInfoCircle class="text-text-muted absolute top-6 right-6" size="20" />

          <div class="grid grid-cols-1 gap-y-6 sm:grid-cols-2">
            <div>
              <p class="text-text-muted mb-1 text-[11px]">{{ t('user.email') }}</p>
              <p class="text-text text-sm font-medium">{{ user.email || '-' }}</p>
            </div>
            <div>
              <p class="text-text-muted mb-1 text-[11px]">{{ t('user.status') }}</p>
              <p class="text-text text-sm font-medium">{{ user.isActive ? t('active') : t('inactive') }}</p>
            </div>
            <div>
              <p class="text-text-muted mb-1 text-[11px]">{{ t('user.dob') }}</p>
              <p class="text-text text-sm font-medium">{{ formatDate(user.dob) }}</p>
            </div>
            <div>
              <p class="text-text-muted mb-1 text-[11px]">{{ t('user.createdDate') }}</p>
              <p class="text-text text-sm font-medium">{{ formatDate(user.createdAt) }}</p>
            </div>
            <div>
              <p class="text-text-muted mb-1 text-[11px]">{{ t('user.lastUpdated') }}</p>
              <p class="text-text text-sm font-medium">{{ formatDate(user.updatedAt) }}</p>
            </div>
          </div>
        </div>

        <div class="border-border bg-surface rounded border p-6">
          <h3 class="text-text mb-6 text-sm font-semibold">{{ t('user.contactDetails') }}</h3>
          <div class="mb-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2">
            <div>
              <p class="text-text-muted mb-1 text-[11px]">{{ t('user.phoneNumber') }}</p>
              <p class="text-text text-sm font-medium">{{ user.phoneNumber || '-' }}</p>
            </div>
            <div>
              <p class="text-text-muted mb-1 text-[11px]">{{ t('user.email') }}</p>
              <p class="text-text text-sm font-medium">{{ user.email || '-' }}</p>
            </div>
          </div>
        </div>

        <div class="border-border bg-surface rounded border p-6">
          <h3 class="text-text mb-4 text-sm font-semibold">{{ t('user.roleAndPermissions') }}</h3>

          <p class="text-text-muted mb-2 text-[11px]">{{ t('user.accessLevel') }}</p>
          <div class="bg-primary-soft border-primary/20 mb-6 flex items-start gap-3 rounded border p-4">
            <IconShieldLockFilled class="text-primary mt-0.5" size="24" />
            <div>
              <p class="text-primary text-sm font-semibold">{{ mapRoleCode(user.role) }}</p>
              <p class="text-text-muted mt-0.5 text-xs">-</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="flex h-[60vh] flex-col items-center justify-center gap-4">
      <p class="text-text text-xl font-bold">{{ t('user.userNotFound') }}</p>
      <p class="text-text-muted">{{ t('user.userNotFoundDesc') }}</p>
      <a-button type="primary" @click="() => router.push('/user-management')" class="mt-4">{{
        t('user.backToDashboard')
      }}</a-button>
    </div>

    <UserUpdateModal
      v-model:open="isUpdateModalOpen"
      :user-id="user?.id || null"
      :initial-data="user"
      @success="handleUpdateSuccess"
    />

    <DeleteModal v-model:open="isDeleteModalOpen" :loading="isDeleting" @confirm="handleDeleteUser" />
  </PageLayout>
</template>
