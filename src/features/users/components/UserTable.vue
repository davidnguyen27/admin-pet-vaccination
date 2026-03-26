<script setup lang="ts">
import type { TablePaginationConfig } from 'ant-design-vue';
import { IconEdit, IconTrash, IconUser } from '@tabler/icons-vue';
import type { UserRecord } from '../composables/useUserManagement';

const props = defineProps<{
  dataSource: UserRecord[];
  columns: object[];
  pagination: TablePaginationConfig;
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: 'tableChange', pagination: TablePaginationConfig): void;
  (e: 'edit', record: UserRecord): void;
  (e: 'delete', record: UserRecord): void;
  (e: 'viewDetail', record: UserRecord): void;
}>();

const roleConfig: Record<string, { label: string; class: string }> = {
  ADMIN: { label: 'Admin', class: 'bg-(--color-primary-soft) text-(--color-primary) border-(--color-primary)/20!' },
  STAFF: { label: 'Staff', class: 'bg-(--color-accent-soft) text-(--color-accent) border-(--color-accent)/20!' },
  VET: { label: 'Veterinarian', class: 'bg-(--color-accent-soft) text-(--color-accent) border-(--color-accent)/20!' },
  OWN: { label: 'Owner', class: 'bg-(--bg-table-header) text-(--text-label) border-(--border-default)!' },
};

const handleEditClick = (event: Event, record: UserRecord) => {
  event.preventDefault();
  event.stopPropagation();
  emit('edit', record);
};

const handleDeleteClick = (event: Event, record: UserRecord) => {
  event.preventDefault();
  event.stopPropagation();
  emit('delete', record);
};

const handleViewDetailClick = (event: Event, record: UserRecord) => {
  event.preventDefault();
  event.stopPropagation();
  emit('viewDetail', record);
};
</script>

<template>
  <div class="card overflow-hidden p-0">
    <a-table
      :data-source="props.dataSource"
      :columns="props.columns"
      :pagination="props.pagination"
      :loading="props.loading"
      :row-key="(record: UserRecord) => record.id"
      class="w-full"
      :scroll="{ x: 700 }"
      @change="(page: TablePaginationConfig) => emit('tableChange', page)"
    >
      <template #bodyCell="{ column, record }">
        <!-- User column -->
        <template v-if="column.key === 'user'">
          <button
            type="button"
            class="group flex w-full cursor-pointer items-center gap-3 bg-transparent! text-left"
            @click="(event: Event) => handleViewDetailClick(event, record)"
          >
            <div
              class="flex size-9 min-w-9 items-center justify-center overflow-hidden bg-(--color-primary-soft) text-(--color-primary)"
            >
              <img
                v-if="record.avatarUrl"
                :src="record.avatarUrl"
                :alt="record.fullName"
                class="h-full w-full object-cover"
              />
              <icon-user v-else :size="18" stroke-width="2" />
            </div>
            <div class="flex flex-col">
              <span
                class="text-sm font-semibold text-(--text-primary) transition-colors group-hover:text-(--color-primary)"
                >{{ record.fullName }}</span
              >
              <span class="text-xs text-(--text-label)">{{ record.email }}</span>
            </div>
          </button>
        </template>

        <!-- Role -->
        <template v-else-if="column.key === 'roleCode'">
          <span
            class="inline-block border px-2.5 py-0.5 text-[11.5px] font-semibold tracking-wide"
            :class="
              roleConfig[record.roleCode]?.class ??
              'border-(--border-default) bg-(--bg-table-header) text-(--text-label)'
            "
          >
            {{ roleConfig[record.roleCode]?.label ?? record.roleCode }}
          </span>
        </template>

        <!-- Status -->
        <template v-else-if="column.key === 'isActive'">
          <span
            class="my-auto inline-flex items-center gap-1.5 px-2.5 py-0.75 text-xs font-semibold"
            :class="
              record.isActive
                ? 'bg-(--color-success-bg) text-(--color-success)'
                : 'bg-(--color-error-bg) text-(--color-error)'
            "
          >
            <span class="size-1.5 shrink-0 rounded-full bg-current"></span>
            {{ record.isActive ? 'Active' : 'Inactive' }}
          </span>
        </template>

        <!-- Actions -->
        <template v-else-if="column.key === 'action'">
          <div class="flex items-center justify-center gap-1.5">
            <a-tooltip title="Edit">
              <button
                type="button"
                class="flex size-7.5 cursor-pointer items-center justify-center rounded-sm border border-transparent! bg-transparent! text-(--color-info)! transition-all hover:border-(--color-info)/20! hover:bg-(--color-info-bg)!"
                @click="(event: Event) => handleEditClick(event, record)"
              >
                <icon-edit :size="16" stroke-width="1.75" />
              </button>
            </a-tooltip>
            <a-tooltip title="Delete">
              <button
                type="button"
                class="flex size-7.5 cursor-pointer items-center justify-center rounded-sm border border-transparent! bg-transparent! text-(--color-error)! transition-all hover:border-(--color-error)/20! hover:bg-(--color-error-bg)!"
                @click="(event: Event) => handleDeleteClick(event, record)"
              >
                <icon-trash :size="16" stroke-width="1.75" />
              </button>
            </a-tooltip>
          </div>
        </template>
      </template>
    </a-table>
  </div>
</template>

<style scoped>
:deep(.ant-pagination) {
  display: flex !important;
  align-items: center !important;
  padding: 12px 16px !important;
  margin: 0 !important;
  border-top: 1px solid var(--divider);
  background: var(--bg-card);
}

:deep(.ant-pagination-total-text) {
  font-size: 13px;
  color: var(--text-label);
  font-weight: 500;
}

:deep(.ant-pagination-prev .ant-pagination-item-link),
:deep(.ant-pagination-next .ant-pagination-item-link) {
  border-radius: var(--radius-sm) !important;
  border-color: var(--border-default) !important;
  background: transparent !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}
</style>
