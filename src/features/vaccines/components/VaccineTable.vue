<script setup lang="ts">
import type { TablePaginationConfig } from 'ant-design-vue';
import { IconEdit, IconTrash, IconVaccine } from '@tabler/icons-vue';
import type { Vaccine } from '../vaccine.type';

const props = defineProps<{
  dataSource: Vaccine[];
  columns: object[];
  pagination: TablePaginationConfig;
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: 'tableChange', pagination: TablePaginationConfig): void;
  (e: 'edit', record: Vaccine): void;
  (e: 'delete', record: Vaccine): void;
}>();

const handleEditClick = (event: Event, record: Vaccine) => {
  event.preventDefault();
  event.stopPropagation();
  emit('edit', record);
};

const handleDeleteClick = (event: Event, record: Vaccine) => {
  event.preventDefault();
  event.stopPropagation();
  emit('delete', record);
};
</script>

<template>
  <div class="card overflow-hidden p-0">
    <a-table
      :data-source="props.dataSource"
      :columns="props.columns"
      :pagination="props.pagination"
      :loading="props.loading"
      :row-key="(record: Vaccine) => record.id"
      class="w-full"
      :scroll="{ x: 960 }"
      @change="(page: TablePaginationConfig) => emit('tableChange', page)"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'code'">
          <div class="flex items-center gap-3">
            <div
              class="flex size-9 min-w-9 items-center justify-center bg-(--color-primary-soft) text-(--color-primary)"
            >
              <icon-vaccine :size="18" stroke-width="1.9" />
            </div>
            <span class="text-sm font-semibold text-(--text-primary)">{{ record.code }}</span>
          </div>
        </template>

        <template v-else-if="column.key === 'name'">
          <div class="flex min-w-0 flex-col">
            <span class="truncate text-sm font-semibold text-(--text-primary)">{{ record.name }}</span>
            <span class="truncate text-xs text-(--text-label)">{{ record.description || 'No description' }}</span>
          </div>
        </template>

        <template v-else-if="column.key === 'species'">
          <span
            class="inline-block border border-(--border-default) bg-(--bg-table-header) px-2.5 py-0.5 text-[11.5px] font-semibold tracking-wide text-(--text-label)"
          >
            {{ (record as any).species?.name || (record as any).species || record.speciesId || 'N/A' }}
          </span>
        </template>

        <template v-else-if="column.key === 'brand'">
          <span class="text-sm text-(--text-primary)">{{ record.brand || 'N/A' }}</span>
        </template>

        <template v-else-if="column.key === 'status'">
          <span
            class="inline-flex items-center gap-1.5 px-2.5 py-0.75 text-xs font-semibold"
            :class="
              record.status === 'ACTIVE'
                ? 'bg-(--color-success-bg) text-(--color-success)'
                : 'bg-(--color-warning-bg) text-(--color-warning)'
            "
          >
            <span class="size-1.5 shrink-0 rounded-full bg-current"></span>
            {{ record.status || 'UNKNOWN' }}
          </span>
        </template>

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
