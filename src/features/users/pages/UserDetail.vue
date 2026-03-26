<script setup lang="ts">
import { IconChevronLeft } from '@tabler/icons-vue';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AdminLayout from '@/layouts/AdminLayout.vue';
import InfoItem from '@/components/ui/InfoItem.vue';
import InfoSection from '@/components/ui/InfoSection.vue';
import type { User } from '../user.type';
import { userApi } from '../user.api';
import type { IResponse } from '@/interfaces/i-response';
import { formatDateTime } from '@/helpers/formatDateTime';

const route = useRoute();
const router = useRouter();

const user = ref<User | null>(null);
const loading = ref(false);
const error = ref('');

const roleLabelMap: Record<string, string> = {
  ADMIN: 'Administrator',
  STAFF: 'Staff',
  VET: 'Veterinarian',
  OWN: 'Owner',
};

const statusLabel = computed(() => (user.value?.isActive ? 'Active' : 'Inactive'));
const roleLabel = computed(() => {
  if (!user.value?.roleCode) {
    return 'Unassigned';
  }

  return roleLabelMap[user.value.roleCode] ?? user.value.roleCode;
});

const userInitial = computed(() => {
  const source = user.value?.fullName || user.value?.email || '';
  return source.trim().charAt(0).toUpperCase() || 'U';
});

const userId = computed(() => {
  const paramId = route.params.id;
  if (typeof paramId === 'string' && paramId) {
    return paramId;
  }

  const queryId = route.query.userId ?? route.query.id ?? route.query.Id;
  if (Array.isArray(queryId)) {
    return queryId[0] ?? '';
  }

  return typeof queryId === 'string' ? queryId : '';
});

const fetchUserDetail = async () => {
  if (!userId.value) {
    error.value = 'User ID not found';
    return;
  }

  loading.value = true;
  error.value = '';
  user.value = null;

  try {
    const payload = (await userApi.getUserById(userId.value)) as unknown as IResponse<User>;

    if (payload?.success && payload.data) {
      user.value = payload.data;
    } else {
      error.value = payload?.message || 'Failed to load user data';
    }
  } catch (err: any) {
    error.value = err?.message || 'Error loading user';
  } finally {
    loading.value = false;
  }
};

watch(
  () => [route.params.id, route.query.userId, route.query.id, route.query.Id],
  () => fetchUserDetail(),
  { immediate: true },
);

const goBack = () => {
  router.push('/user-management');
};
</script>

<template>
  <admin-layout>
    <div class="flex flex-col gap-4">
      <section class="border border-(--divider) bg-(--bg-card) p-3.5 shadow-sm">
        <div class="flex min-w-0 items-center gap-2">
          <a-button type="text" class="px-2!" @click="goBack">
            <template #icon>
              <icon-chevron-left :size="18" :stroke-width="2" />
            </template>
          </a-button>
          <h1 class="m-0! text-[18px]! font-bold tracking-[-0.02em] text-(--text-primary)">User Profile Detail</h1>
        </div>
      </section>

      <div v-if="error" class="border border-(--color-error)/20 bg-(--color-error-bg) px-4 py-3">
        <p class="m-0 text-sm text-(--color-error)">{{ error }}</p>
      </div>

      <div v-if="loading" class="border border-(--divider) bg-(--bg-card) px-4 py-5 text-center shadow-sm">
        <a-spin />
      </div>

      <template v-else-if="user">
        <section class="border border-(--divider) bg-(--bg-card) p-4 shadow-sm">
          <div class="grid gap-4 md:grid-cols-[auto_1fr] md:items-center">
            <div
              class="flex h-16 w-16 items-center justify-center border border-(--divider) bg-(--bg-page) text-xl font-semibold text-(--text-primary)"
            >
              {{ userInitial }}
            </div>

            <div class="min-w-0">
              <h2 class="m-0 truncate text-xl font-semibold tracking-[-0.02em] text-(--text-primary)">
                {{ user.fullName || 'Unknown User' }}
              </h2>
              <p class="mt-1 truncate text-sm text-(--text-secondary)">{{ user.email }}</p>

              <div class="mt-3 flex flex-wrap items-center gap-2">
                <span
                  class="inline-flex items-center border border-(--divider) bg-(--bg-page) px-2.5 py-1 text-xs font-semibold text-(--text-primary)"
                >
                  {{ roleLabel }}
                </span>

                <span
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold"
                  :class="
                    user.isActive
                      ? 'bg-(--color-success-bg) text-(--color-success)'
                      : 'bg-(--color-error-bg) text-(--color-error)'
                  "
                >
                  <span class="size-1.5 rounded-full bg-current"></span>
                  {{ statusLabel }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section class="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <info-section title="Contact Details" class="lg:col-span-2">
            <info-item label="Phone Number" :value="user.phoneNumber" />
            <info-item label="Date of Birth" :value="formatDateTime(user.dob, 'DD-MM-YYYY')" />
          </info-section>

          <info-section title="Authorization">
            <info-item label="Role Code" :value="user.roleCode" />
            <info-item label="Current State" :value="statusLabel" />
          </info-section>
        </section>

        <info-section title="Profile Metadata">
          <info-item label="Avatar URL" :value="user.avatarUrl" full-width />
        </info-section>

        <info-section title="Account Timeline" grid-cols="sm:grid-cols-3 lg:grid-cols-3">
          <info-item label="Created At" :value="formatDateTime(user?.createdAt)" />
          <info-item label="Updated At" :value="formatDateTime(user?.updatedAt)" />
          <info-item label="Last Login" :value="formatDateTime(user?.lastLogin)" />
        </info-section>

        <info-section v-if="user.owner" title="Owner Information" grid-cols="sm:grid-cols-2 lg:grid-cols-4">
          <info-item label="Total Points" :value="user.owner?.totalPoints" />
          <info-item label="Latitude" :value="user.owner?.locationLat" />
          <info-item label="Longitude" :value="user.owner?.locationLng" />
          <info-item label="Address" :value="user.owner?.address" full-width />
        </info-section>

        <info-section v-if="user.staff" title="Staff Information" grid-cols="sm:grid-cols-2 lg:grid-cols-3">
          <info-item label="Staff Code" :value="user.staff.code" />
          <info-item label="Job Title" :value="user.staff.jobTitle" />
          <info-item label="Department" :value="user.staff.department" />
          <info-item label="Employment Type" :value="user.staff.employmentType" />
          <info-item label="Employment Status" :value="user.staff.employmentStatus" />
          <info-item label="Citizen ID" :value="user.staff.citizenId" />
          <info-item label="Join Date" :value="formatDateTime(user.staff.joinDate)" />
          <info-item label="End Date" :value="formatDateTime(user.staff.endDate)" />
          <info-item label="Address" :value="user.staff.address" full-width />
          <info-item label="Notes" :value="user.staff.notes" full-width />
        </info-section>

        <info-section v-if="user.vet" title="Veterinarian Information" grid-cols="sm:grid-cols-2 lg:grid-cols-3">
          <info-item label="License Number" :value="user.vet.licenseNo" />
          <info-item label="Issued By" :value="user.vet.licenseIssueBy" />
          <info-item label="Employment Status" :value="user.vet.employmentStatus" />
          <info-item label="Valid From" :value="formatDateTime(user.vet.licenseValidFrom)" />
          <info-item label="Valid To" :value="formatDateTime(user.vet.licenseValidTo)" />
          <info-item label="Citizen ID" :value="user.vet.citizenId" />
          <info-item label="Join Date" :value="formatDateTime(user.vet.joinDate)" />
          <info-item label="End Date" :value="formatDateTime(user.vet.endDate)" />
          <info-item label="Address" :value="user.vet.address" full-width />
          <info-item label="Bio" :value="user.vet.bio" full-width />
        </info-section>
      </template>

      <div v-else class="border border-(--divider) bg-(--bg-card) px-4 py-4 shadow-sm">
        <p class="m-0 text-sm text-(--text-secondary)">No user data available</p>
      </div>
    </div>
  </admin-layout>
</template>
