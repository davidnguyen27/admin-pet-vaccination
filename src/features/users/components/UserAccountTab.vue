<script setup lang="ts">
import { IconSearch, IconFilterOff, IconReportSearch, IconEdit, IconUsers } from '@tabler/icons-vue';
import { useUserStore } from '@/store/userStore';
import { onMounted, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useLocale } from '@/shared/composables/useLocale';
import { useDebounce } from '@/shared/composables/useDebounce';
import Pagination from '@/shared/components/ui/Pagination.vue';
import { useRouter } from 'vue-router';
import { mapRoleCode } from '@/shared/helpers';
import type { User } from '@/shared/types/user.type';
import type { TableColumnsType } from 'ant-design-vue';

const props = defineProps<{
  roleCode?: string;
  refreshToken?: number;
}>();

const emit = defineEmits<{
  (e: 'edit', user: User): void;
}>();

const { t } = useLocale();
const router = useRouter();
const userStore = useUserStore();
const { loading, listUser, filters } = storeToRefs(userStore);

type UserFilters = {
  search?: string;
  roleCode?: string;
  isActive?: boolean;
};

const roleOptions = computed(() => [
  { value: 'STAFF', label: t('staff') },
  { value: 'VET', label: t('veterinarian') },
  { value: 'OWN', label: t('owner') },
]);

const statusOptions = computed(() => [
  { value: true, label: t('active') },
  { value: false, label: t('inactive') },
]);

const columns = computed<TableColumnsType>(() => [
  { title: t('user.avatar'), dataIndex: 'avatarUrl', key: 'avatarUrl', width: 76 },
  { title: t('user.fullName'), dataIndex: 'fullName', key: 'fullName', width: 220 },
  { title: t('user.email'), dataIndex: 'email', key: 'email', width: 240 },
  { title: t('user.phoneNumber'), dataIndex: 'phoneNumber', key: 'phoneNumber', width: 160 },
  { title: t('user.role'), dataIndex: 'role', key: 'role', width: 150 },
  { title: t('user.status'), dataIndex: 'isActive', key: 'isActive', width: 130 },
  { title: t('user.action'), key: 'action', width: 120, align: 'center', fixed: 'right' },
]);

const usersData = computed(() => listUser.value.data);
const totalUsers = computed(() => listUser.value.total);
const currentRange = computed(() => {
  if (!totalUsers.value) return '0';

  const start = (listUser.value.page - 1) * listUser.value.limit + 1;
  const end = Math.min(listUser.value.page * listUser.value.limit, totalUsers.value);
  return `${start}-${end}`;
});

const { keyword: debouncedSearch } = useDebounce(async (value: string) => {
  userStore.setFilters({ search: value });
  await userStore.fetchUserList();
}, 500);

async function fetchUsers() {
  await userStore.fetchUserList();
}

function handleSearchInput(e: Event) {
  debouncedSearch.value = (e.target as HTMLInputElement).value;
}

function applyRoleFilter() {
  userStore.resetFilters();
  if (props.roleCode) {
    userStore.setFilters({ roleCode: mapRoleCode(props.roleCode) });
  }
}

function handleResetFilters() {
  applyRoleFilter();
  fetchUsers();
}

function handleFilterChange(filterUpdate: Partial<UserFilters>) {
  userStore.setFilters(filterUpdate);
  userStore.setPagination(1, listUser.value.limit);
  fetchUsers();
}

function onPageChange(page: number) {
  userStore.setPagination(page, listUser.value.limit);
  fetchUsers();
}

function onPageSizeChange(pageSize: number) {
  userStore.setPagination(1, pageSize);
  fetchUsers();
}

onMounted(() => {
  applyRoleFilter();
  fetchUsers();
});

watch(
  () => props.roleCode,
  () => {
    applyRoleFilter();
    fetchUsers();
  },
);

watch(
  () => props.refreshToken,
  () => {
    fetchUsers();
  },
);
</script>

<template>
  <div class="flex flex-col gap-5">
    <!-- Filters Row -->
    <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div class="flex flex-1 flex-wrap items-center gap-4">
        <div class="flex w-full flex-col gap-1.5 sm:w-[280px]">
          <label for="search" class="text-text-muted text-xs font-semibold tracking-wide uppercase">{{
            t('search')
          }}</label>
          <a-input
            id="search"
            :value="filters.search"
            @input="handleSearchInput"
            :placeholder="t('user.searchPlaceholder')"
            allow-clear
          >
            <template #prefix>
              <IconSearch class="text-text-muted size-4" />
            </template>
          </a-input>
        </div>

        <div v-if="!roleCode" class="flex w-full flex-col gap-1.5 sm:w-40">
          <label class="text-text-muted text-xs font-semibold tracking-wide uppercase">{{ t('role') }}</label>
          <a-select
            :value="filters.roleCode"
            @change="(value: string | undefined) => handleFilterChange({ roleCode: value })"
            :placeholder="t('user.allRoles')"
            class="w-full"
            :options="roleOptions"
            allow-clear
          />
        </div>

        <div class="flex w-full flex-col gap-1.5 sm:w-40">
          <label class="text-text-muted text-xs font-semibold tracking-wide uppercase">{{ t('status') }}</label>
          <a-select
            :value="filters.isActive"
            @change="(value: boolean | undefined) => handleFilterChange({ isActive: value })"
            :placeholder="t('user.allStatus')"
            class="w-full"
            :options="statusOptions"
            allow-clear
          />
        </div>
      </div>

      <div class="flex w-full sm:w-auto">
        <a-button @click="handleResetFilters" class="flex w-full items-center justify-center gap-2 sm:w-auto">
          <template #icon>
            <IconFilterOff class="size-4" />
          </template>
          <span class="font-medium">{{ t('reset') }}</span>
        </a-button>
      </div>
    </div>

    <!-- Table Section -->
    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-2 pb-1">
        <div class="bg-primary-soft text-primary flex size-8 items-center justify-center rounded-md">
          <IconUsers class="size-4.5" />
        </div>
        <div>
          <h2 class="text-text text-sm font-semibold">{{ t('user.accountList') }}</h2>
          <p class="text-text-muted text-xs">
            {{ t('user.showingRange', { range: currentRange, total: totalUsers }) }}
          </p>
        </div>
      </div>

      <a-table
        row-key="id"
        :columns="columns"
        :data-source="usersData"
        :loading="loading"
        :pagination="false"
        :scroll="{ x: 'max-content' }"
        class="border-divider cursor-pointer border-t"
        :custom-row="
          (record: any) => {
            return {
              onClick: () => {
                router.push({ name: 'UserDetail', params: { id: record.id } });
              },
            };
          }
        "
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'role'">
            <span class="capitalize">{{ mapRoleCode(record.role) }}</span>
          </template>
          <template v-else-if="column.key === 'isActive'">
            <span
              class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
              :class="record.isActive ? 'bg-success-bg text-success' : 'bg-error-bg text-error'"
            >
              <span class="size-1.5 rounded-full" :class="record.isActive ? 'bg-success' : 'bg-error'"></span>
              {{ record.isActive ? t('active') : t('inactive') }}
            </span>
          </template>
          <template v-else-if="column.key === 'avatarUrl'">
            <div class="flex items-center justify-center">
              <a-avatar
                :src="record.avatarUrl"
                class="bg-primary-soft text-primary border-primary-soft border shadow-sm"
              >
                {{ !record.avatarUrl && record.fullName ? record.fullName.charAt(0).toUpperCase() : '' }}
              </a-avatar>
            </div>
          </template>
          <template v-else-if="column.key === 'action'">
            <div class="flex items-center justify-center gap-1">
              <a-tooltip :title="t('user.viewDetails')">
                <a-button
                  type="text"
                  @click.stop="() => router.push({ name: 'UserDetail', params: { id: record.id } })"
                  class="text-text-muted hover:bg-primary-soft hover:text-primary flex items-center justify-center transition-colors"
                >
                  <template #icon><IconReportSearch class="size-4.5" stroke="1.5" /></template>
                </a-button>
              </a-tooltip>
              <a-tooltip :title="t('user.editUser')">
                <a-button
                  @click.stop="emit('edit', record)"
                  type="text"
                  class="text-text-muted hover:bg-primary-soft hover:text-primary flex items-center justify-center transition-colors"
                >
                  <template #icon><IconEdit class="size-4.5" stroke="1.5" /></template>
                </a-button>
              </a-tooltip>
            </div>
          </template>
        </template>
      </a-table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-end pt-2">
      <Pagination
        :current="listUser.page"
        :pageSize="listUser.limit"
        :total="listUser.total"
        @update:current="onPageChange"
        @update:pageSize="onPageSizeChange"
      />
    </div>
  </div>
</template>
