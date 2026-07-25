<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/store/authStore';
import PageLayout from '@/layouts/PageLayout.vue';
import UserUpdateModal from '@/features/users/components/UserUpdateModal.vue';
import { IconEdit, IconShieldLock, IconInfoCircle, IconShieldLockFilled, IconArrowLeft } from '@tabler/icons-vue';
import { formatDate } from '@/shared/utils';
import { useLocale } from '@/shared/composables/useLocale';
import { mapRoleCode } from '@/shared/helpers';

const router = useRouter();
const { t } = useLocale();
const authStore = useAuthStore();
const { user, isLoading: loading } = storeToRefs(authStore);

const isUpdateModalOpen = ref(false);

onMounted(() => {
  if (!user.value) {
    authStore.fetchCurrentUser();
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

function handleUpdateSuccess() {
  authStore.fetchCurrentUser();
}
</script>

<template>
  <PageLayout>
    <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div class="flex flex-col gap-1">
        <h1 class="font-ibm text-text text-xl font-bold">
          {{ t('auth.myProfile', 'My Profile') }}
        </h1>
        <span class="text-text-muted text-sm">
          {{ t('auth.manageProfileDesc', 'View and manage your account information') }}
        </span>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <a-button
          type="default"
          @click="() => router.push('/statistic')"
          class="flex items-center justify-center gap-2"
        >
          <template #icon><IconArrowLeft class="size-4.5" /></template>
          <span class="font-medium">{{ t('user.backToDashboard') }}</span>
        </a-button>
        <a-button @click="handleEditProfile" type="primary" class="flex items-center justify-center gap-2">
          <template #icon><IconEdit class="size-4.5 text-white" /></template>
          <span class="font-medium text-white">{{ t('user.editProfile') }}</span>
        </a-button>
      </div>
    </div>

    <div v-if="loading" class="flex h-[60vh] items-center justify-center">
      <a-spin size="large" />
    </div>

    <div v-else-if="user" class="mt-6 flex flex-col gap-6 xl:flex-row">
      <!-- Left Panel -->
      <div class="flex w-full flex-col gap-6 xl:w-1/3">
        <div class="shadow-card border-divider bg-surface flex flex-col items-center rounded-md border p-6">
          <div v-if="user.avatarUrl" class="border-divider mb-4 size-24 overflow-hidden rounded-full border shadow-sm">
            <img :src="user.avatarUrl" alt="Avatar" class="h-full w-full object-cover" />
          </div>
          <div
            v-else
            class="bg-primary-soft text-primary border-primary-soft mb-4 flex size-24 items-center justify-center rounded-full border text-3xl font-bold shadow-sm"
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
              class="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
              :class="user.isActive ? 'bg-success-bg text-success' : 'bg-error-bg text-error'"
            >
              <span class="size-1.5 rounded-full" :class="user.isActive ? 'bg-success' : 'bg-error'"></span>
              {{ user.isActive ? t('active') : t('inactive') }}
            </span>
          </div>

          <div class="bg-divider mb-4 h-px w-full"></div>

          <p class="text-text-muted text-xs">
            {{ t('user.lastLogin') }}:
            {{ user.lastLoginAt ? formatDate(user.lastLoginAt, 'DD MMM YYYY, HH:mm') : 'N/A' }}
          </p>
        </div>

        <div class="shadow-card border-divider bg-surface rounded-md border">
          <div class="flex items-center gap-2 p-5 pb-3">
            <IconShieldLock class="text-primary size-5" />
            <h3 class="font-ibm text-text text-base font-semibold">{{ t('user.securitySettings') }}</h3>
          </div>
          <div class="flex flex-col">
            <div class="border-divider flex items-center justify-between border-b p-5">
              <div>
                <p class="text-text mb-0.5 text-xs font-medium">{{ t('user.password') }}</p>
                <p class="text-text-muted text-[11px]">******</p>
              </div>
              <a href="#" class="text-primary text-xs font-semibold hover:underline">Update</a>
            </div>
            <div class="border-divider flex items-center justify-between border-b p-5">
              <div>
                <p class="text-text mb-0.5 text-xs font-medium">{{ t('user.twoFactorAuth') }}</p>
                <p class="text-text-muted text-[11px]">-</p>
              </div>
              <a href="#" class="text-primary text-xs font-semibold hover:underline">Manage</a>
            </div>
            <div class="flex items-center justify-between p-5">
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
      <div class="flex w-full flex-col gap-6 xl:w-2/3">
        <div class="shadow-card border-divider bg-surface relative rounded-md border p-6">
          <h3 class="font-ibm text-text mb-6 text-base font-semibold">{{ t('user.accountInformation') }}</h3>
          <IconInfoCircle class="text-text-muted absolute top-6 right-6 size-5" />

          <div class="grid grid-cols-1 gap-y-6 sm:grid-cols-2">
            <div>
              <p class="text-text-muted mb-1 text-[11px] font-semibold tracking-wide uppercase">
                {{ t('user.email') }}
              </p>
              <p class="text-text text-sm font-medium">{{ user.email || '-' }}</p>
            </div>
            <div>
              <p class="text-text-muted mb-1 text-[11px] font-semibold tracking-wide uppercase">
                {{ t('user.status') }}
              </p>
              <p class="text-text text-sm font-medium">{{ user.isActive ? t('active') : t('inactive') }}</p>
            </div>
            <div>
              <p class="text-text-muted mb-1 text-[11px] font-semibold tracking-wide uppercase">{{ t('user.dob') }}</p>
              <p class="text-text text-sm font-medium">{{ formatDate(user.dob) }}</p>
            </div>
            <div>
              <p class="text-text-muted mb-1 text-[11px] font-semibold tracking-wide uppercase">
                {{ t('user.createdDate') }}
              </p>
              <p class="text-text text-sm font-medium">{{ formatDate(user.createdAt) }}</p>
            </div>
            <div>
              <p class="text-text-muted mb-1 text-[11px] font-semibold tracking-wide uppercase">
                {{ t('user.lastUpdated') }}
              </p>
              <p class="text-text text-sm font-medium">{{ formatDate(user.updatedAt) }}</p>
            </div>
          </div>
        </div>

        <div class="shadow-card border-divider bg-surface rounded-md border p-6">
          <h3 class="font-ibm text-text mb-6 text-base font-semibold">{{ t('user.contactDetails') }}</h3>
          <div class="mb-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2">
            <div>
              <p class="text-text-muted mb-1 text-[11px] font-semibold tracking-wide uppercase">
                {{ t('user.phoneNumber') }}
              </p>
              <p class="text-text text-sm font-medium">{{ user.phoneNumber || '-' }}</p>
            </div>
            <div>
              <p class="text-text-muted mb-1 text-[11px] font-semibold tracking-wide uppercase">
                {{ t('user.email') }}
              </p>
              <p class="text-text text-sm font-medium">{{ user.email || '-' }}</p>
            </div>
          </div>
        </div>

        <div class="shadow-card border-divider bg-surface rounded-md border p-6">
          <h3 class="font-ibm text-text mb-4 text-base font-semibold">{{ t('user.roleAndPermissions') }}</h3>

          <p class="text-text-muted mb-2 text-[11px] font-semibold tracking-wide uppercase">
            {{ t('user.accessLevel') }}
          </p>
          <div class="bg-primary-soft border-primary-soft mb-2 flex items-start gap-3 rounded-md border p-4 shadow-sm">
            <IconShieldLockFilled class="text-primary mt-0.5 size-6" />
            <div>
              <p class="text-primary text-sm font-bold">{{ mapRoleCode(user.role) }}</p>
              <p class="text-primary-soft-contrast mt-0.5 text-xs">
                Has full access based on their assigned role level.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="flex h-[60vh] flex-col items-center justify-center gap-4">
      <p class="text-text text-xl font-bold">{{ t('auth.userNotFound', 'User information not found') }}</p>
      <a-button type="primary" @click="() => router.push('/statistic')" class="mt-4">{{
        t('user.backToDashboard')
      }}</a-button>
    </div>

    <UserUpdateModal
      v-model:open="isUpdateModalOpen"
      :user-id="user?.id || null"
      :initial-data="user || undefined"
      @success="handleUpdateSuccess"
    />
  </PageLayout>
</template>
