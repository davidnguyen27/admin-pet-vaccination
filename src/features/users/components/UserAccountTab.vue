<script setup lang="ts">
import { IconSearch, IconFilterOff, IconReportSearch, IconEdit } from '@tabler/icons-vue';
import { useUserStore } from '@/store/userStore';
import { onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useLocale } from '@/shared/composables/useLocale';
import { useDebounce } from '@/shared/composables/useDebounce';
import Pagination from '@/shared/components/ui/Pagination.vue';
import { useRouter } from 'vue-router';
import { mapRoleCode } from '@/shared/helpers';

const props = defineProps<{
  roleCode?: string;
}>();

const emit = defineEmits<{
  (e: 'edit', user: any): void;
}>();

const { t } = useLocale();
const router = useRouter();
const userStore = useUserStore();
const { loading, listUser, filters } = storeToRefs(userStore);

const roleOptions = [
  { value: 'STAFF', label: t('staff') },
  { value: 'VET', label: t('veterinarian') },
  { value: 'OWN', label: t('owner') },
];

const statusOptions = [
  { value: true, label: t('active') },
  { value: false, label: t('inactive') },
];

const columns = [
  { title: t('user.avatar'), dataIndex: 'avatarUrl', key: 'avatarUrl', width: 80 },
  { title: t('user.fullName'), dataIndex: 'fullName', key: 'fullName' },
  { title: t('user.email'), dataIndex: 'email', key: 'email' },
  { title: t('user.phoneNumber'), dataIndex: 'phoneNumber', key: 'phoneNumber' },
  { title: t('user.role'), dataIndex: 'role', key: 'role' },
  { title: t('user.status'), dataIndex: 'isActive', key: 'isActive' },
  { title: t('user.action'), dataIndex: 'action', key: 'action', width: 100, align: 'center' },
];

const usersData = computed(() => listUser.value.data);

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

function handleResetFilters() {
  userStore.resetFilters();
  if (props.roleCode) {
    userStore.setFilters({ roleCode: mapRoleCode(props.roleCode) });
  }
  fetchUsers();
}

function handleFilterChange(filterUpdate: any) {
  userStore.setFilters(filterUpdate);
  userStore.setPagination(1, listUser.value.limit);
  fetchUsers();
}

function onPageChange(page: number) {
  userStore.setPagination(page, listUser.value.limit);
  fetchUsers();
}

function onPageSizeChange(pageSize: number) {
  userStore.setPagination(listUser.value.page, pageSize);
  fetchUsers();
}

onMounted(() => {
  userStore.resetFilters();
  if (props.roleCode) {
    userStore.setFilters({ roleCode: mapRoleCode(props.roleCode) });
  }
  fetchUsers();
});
</script>

<template>
  <div class="flex flex-col gap-5">
    <!-- Filter Section -->
    <div class="border-border bg-surface flex flex-col gap-4 border p-4 sm:flex-row sm:items-end sm:justify-between">
      <div class="flex flex-1 flex-wrap items-center gap-4">
        <!-- Search -->
        <div class="flex w-full flex-col gap-1 sm:w-[280px]">
          <label for="search" class="text-text-muted text-xs font-semibold">{{ t('search') }}</label>
          <a-input
            id="search"
            :value="filters.search"
            @input="handleSearchInput"
            :placeholder="t('user.searchPlaceholder')"
            allow-clear
            size="large"
          >
            <template #prefix>
              <IconSearch class="text-text-muted size-4" />
            </template>
          </a-input>
        </div>

        <!-- Roles -->
        <div v-if="!roleCode" class="flex w-full flex-col gap-1 sm:w-40">
          <label class="text-text-muted text-xs font-semibold">{{ t('role') }}</label>
          <a-select
            :value="filters.roleCode"
            @change="(value: string | undefined) => handleFilterChange({ roleCode: value })"
            :placeholder="t('user.allRoles')"
            class="w-full"
            size="large"
            :options="roleOptions"
            allow-clear
          />
        </div>

        <!-- Status -->
        <div class="flex w-full flex-col gap-1 sm:w-40">
          <label class="text-text-muted text-xs font-semibold">{{ t('status') }}</label>
          <a-select
            :value="filters.isActive"
            @change="(value: boolean) => handleFilterChange({ isActive: value })"
            :placeholder="t('user.allStatus')"
            class="w-full"
            size="large"
            :options="statusOptions"
            allow-clear
          />
        </div>
      </div>

      <!-- Reset Action -->
      <div class="flex w-full sm:w-auto">
        <a-button
          @click="handleResetFilters"
          size="large"
          class="flex w-full items-center justify-center gap-2 sm:w-auto"
        >
          <template #icon>
            <IconFilterOff class="size-4" />
          </template>
          <span class="font-medium">{{ t('reset') }}</span>
        </a-button>
      </div>
    </div>

    <!-- Table -->
    <div class="border-border bg-surface overflow-hidden border shadow-none">
      <a-table
        row-key="id"
        :columns="columns"
        :data-source="usersData"
        :loading="loading"
        :pagination="false"
        :scroll="{ x: 'max-content' }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'role'">
            <span class="capitalize">{{ mapRoleCode(record.role) }}</span>
          </template>
          <template v-else-if="column.key === 'isActive'">
            <a-tag :color="record.isActive ? 'green' : 'red'">
              {{ record.isActive ? t('active') : t('inactive') }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'avatarUrl'">
            <a-avatar :src="record.avatarUrl">
              {{ !record.avatarUrl && record.fullName ? record.fullName.charAt(0).toUpperCase() : '' }}
            </a-avatar>
          </template>
          <template v-else-if="column.key === 'action'">
            <div class="flex items-center justify-center gap-1">
              <a-tooltip :title="t('user.viewDetails')">
                <a-button
                  type="text"
                  @click="() => router.push({ name: 'UserDetail', params: { id: record.id } })"
                  class="text-primary flex items-center justify-center"
                >
                  <template #icon><IconReportSearch size="20" stroke="1.5" /></template>
                </a-button>
              </a-tooltip>
              <a-tooltip :title="t('user.editUser')">
                <a-button
                  @click="emit('edit', record)"
                  type="text"
                  class="text-primary flex items-center justify-center"
                >
                  <template #icon><IconEdit size="20" stroke="1.5" /></template>
                </a-button>
              </a-tooltip>
            </div>
          </template>
        </template>
      </a-table>
    </div>

    <Pagination
      :current="listUser.page"
      :pageSize="listUser.limit"
      :total="listUser.total"
      @update:current="onPageChange"
      @update:pageSize="onPageSizeChange"
    />
  </div>
</template>
