<script setup lang="ts">
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/store/authStore';
import PageLayout from '@/layouts/PageLayout.vue';
import { IconArrowLeft, IconMail, IconClock, IconShieldCheck } from '@tabler/icons-vue';
import { formatDate } from '@/shared/utils';
import { useLocale } from '@/shared/composables/useLocale';
import { mapRoleCode } from '@/shared/helpers';
import { computed } from 'vue';

const router = useRouter();
const { t } = useLocale();
const authStore = useAuthStore();
const { user, isLoading: loading } = storeToRefs(authStore);

const displayName = computed(() => {
  if (user.value?.full_name) return user.value.full_name;
  if (user.value?.email) return user.value.email.split('@')[0];
  return 'Admin';
});

const getInitials = () => {
  const name = displayName.value || '-';
  return name
    .split(/[\s._]+/)
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};
</script>

<template>
  <PageLayout>
    <div class="mx-auto flex max-w-3xl flex-col gap-6">
      <!-- Header Bar -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex flex-col gap-1">
          <h1 class="font-ibm text-text text-xl font-bold">{{ t('auth.myProfile') }}</h1>
          <p class="text-text-muted text-xs sm:text-sm">
            {{ t('auth.manageProfileDesc') }}
          </p>
        </div>
        <div>
          <a-button
            type="default"
            @click="() => router.push('/statistic')"
            class="flex items-center justify-center gap-2"
          >
            <template #icon><IconArrowLeft class="size-4" /></template>
            <span>{{ t('user.backToDashboard') }}</span>
          </a-button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex h-64 items-center justify-center">
        <a-spin size="large" />
      </div>

      <!-- User Profile Card -->
      <a-card v-else-if="user" :bordered="true" class="border-divider bg-surface rounded p-2 shadow-none sm:p-4">
        <div class="flex flex-col items-center gap-6 py-4 text-center">
          <!-- Avatar -->
          <div class="relative">
            <a-avatar
              :size="104"
              :src="user.avatar_url || undefined"
              class="border-primary-soft bg-primary-soft text-primary border-4 text-3xl font-bold shadow-sm"
            >
              {{ getInitials() }}
            </a-avatar>
          </div>

          <!-- Name & Role -->
          <div class="flex flex-col items-center gap-2">
            <h2 class="text-text mb-0 text-2xl font-bold">{{ displayName }}</h2>
            <a-tag color="blue" class="rounded px-3 py-0.5 text-xs font-semibold tracking-wider uppercase">
              {{ mapRoleCode(user.role) }}
            </a-tag>
          </div>

          <a-divider class="border-divider my-2" />

          <!-- Details Grid -->
          <div class="grid w-full max-w-lg grid-cols-1 gap-4 pt-2 text-left sm:grid-cols-2">
            <!-- Email -->
            <div class="border-divider bg-surface-hover flex items-center gap-3 rounded border p-3.5">
              <div class="bg-primary-soft text-primary shrink-0 rounded p-2.5">
                <IconMail class="size-5" />
              </div>
              <div class="overflow-hidden">
                <span class="text-text-muted block text-[11px] font-semibold tracking-wider uppercase">
                  {{ t('user.email') }}
                </span>
                <span class="text-text block truncate text-sm font-medium" :title="user.email">
                  {{ user.email || '-' }}
                </span>
              </div>
            </div>

            <!-- Role -->
            <div class="border-divider bg-surface-hover flex items-center gap-3 rounded border p-3.5">
              <div class="bg-primary-soft text-primary shrink-0 rounded p-2.5">
                <IconShieldCheck class="size-5" />
              </div>
              <div>
                <span class="text-text-muted block text-[11px] font-semibold tracking-wider uppercase">
                  {{ t('user.role') }}
                </span>
                <span class="text-primary block text-sm font-semibold">
                  {{ mapRoleCode(user.role) }}
                </span>
              </div>
            </div>

            <!-- Last Login -->
            <div class="border-divider bg-surface-hover flex items-center gap-3 rounded border p-3.5 sm:col-span-2">
              <div class="bg-primary-soft text-primary shrink-0 rounded p-2.5">
                <IconClock class="size-5" />
              </div>
              <div>
                <span class="text-text-muted block text-[11px] font-semibold tracking-wider uppercase">
                  {{ t('user.lastLogin') }}
                </span>
                <span class="text-text block text-sm font-medium">
                  {{ user.last_login_at ? formatDate(user.last_login_at, 'DD MMM YYYY, HH:mm') : 'N/A' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </a-card>

      <!-- User Not Found -->
      <div v-else class="flex h-64 flex-col items-center justify-center gap-4">
        <p class="text-text text-lg font-bold">{{ t('auth.userNotFound') }}</p>
        <a-button type="primary" @click="() => router.push('/statistic')">
          {{ t('user.backToDashboard') }}
        </a-button>
      </div>
    </div>
  </PageLayout>
</template>
