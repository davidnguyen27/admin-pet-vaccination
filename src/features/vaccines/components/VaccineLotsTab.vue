<script setup lang="ts">
import { computed, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import type { TableColumnsType } from 'ant-design-vue';
import {
  IconBox,
  IconCheck,
  IconAlertTriangle,
  IconSearch,
  IconFilterOff,
  IconEdit,
  IconTrash,
} from '@tabler/icons-vue';

import Pagination from '@/shared/components/ui/Pagination.vue';
import { useLocale } from '@/shared/composables/useLocale';
import { useVaccineStore } from '@/store/vaccineStore';
import { formatDate } from '@/shared/utils';
import type { VaccineLot } from '@/shared/types/vaccine.type';

const emit = defineEmits<{
  (e: 'openAdd'): void;
  (e: 'openEdit', record: VaccineLot): void;
  (e: 'openDelete', record: VaccineLot): void;
}>();

const { t } = useLocale();
const vaccineStore = useVaccineStore();
const { loading, listLot, lotFilters, lotOverview } = storeToRefs(vaccineStore);

const lotFilterState = reactive({
  search: lotFilters.value.search || '',
  status: lotFilters.value.status,
  vaccineId: lotFilters.value.vaccineId,
});

const lotStatusOptions = computed(() => [
  { value: 'AVAILABLE', label: t('vaccine.lotStatus.available') },
  { value: 'LOW_STOCK', label: t('vaccine.lotStatus.lowStock') },
  { value: 'EXPIRING', label: t('vaccine.lotStatus.expiring') },
  { value: 'EXPIRED', label: t('vaccine.lotStatus.expired') },
]);

const lotOverviewCards = computed(() => [
  {
    key: 'totalLots',
    label: t('vaccine.totalLots'),
    value: lotOverview.value.total,
    icon: IconBox,
    colorClass: 'bg-primary-soft text-primary',
  },
  {
    key: 'availableLots',
    label: t('vaccine.availableLots'),
    value: lotOverview.value.available,
    icon: IconCheck,
    colorClass: 'bg-success-bg text-success',
  },
  {
    key: 'lowStockLots',
    label: t('vaccine.lotStatus.lowStock'),
    value: lotOverview.value.lowStock,
    icon: IconAlertTriangle,
    colorClass: 'bg-warning-bg text-warning',
  },
  {
    key: 'expiringExpiredLots',
    label: t('vaccine.expiringExpiredLots'),
    value: lotOverview.value.expiring + lotOverview.value.expired,
    icon: IconAlertTriangle,
    colorClass: 'bg-error-bg text-error',
  },
]);

const lotColumns = computed<TableColumnsType>(() => [
  { title: t('vaccine.lotNo'), dataIndex: 'lotNo', key: 'lotNo', width: 140 },
  { title: t('vaccine.vaccine'), dataIndex: 'vaccineName', key: 'vaccineName', width: 240 },
  { title: t('vaccine.manufacturer'), dataIndex: 'manufacturer', key: 'manufacturer', width: 180 },
  { title: t('vaccine.quantity'), dataIndex: 'quantity', key: 'quantity', width: 160 },
  { title: t('vaccine.importDate'), dataIndex: 'importDate', key: 'importDate', width: 130 },
  { title: t('vaccine.expiryDate'), dataIndex: 'expiryDate', key: 'expiryDate', width: 130 },
  { title: t('status'), dataIndex: 'status', key: 'status', width: 130 },
  { title: t('action'), key: 'action', align: 'center', fixed: 'right', width: 110 },
]);

const applyLotFilters = () => {
  vaccineStore.setLotFilters({
    search: lotFilterState.search,
    status: lotFilterState.status,
    vaccineId: lotFilterState.vaccineId,
  });
  vaccineStore.fetchLotList();
};

const resetLotFilters = () => {
  vaccineStore.resetLotFilters();
  lotFilterState.search = '';
  lotFilterState.status = undefined;
  lotFilterState.vaccineId = undefined;
  vaccineStore.fetchLotList();
};

const handleLotPageChange = (page: number) => {
  vaccineStore.setLotPagination(page, listLot.value.limit);
  vaccineStore.fetchLotList();
};

const handleLotPageSizeChange = (pageSize: number) => {
  vaccineStore.setLotPagination(1, pageSize);
  vaccineStore.fetchLotList();
};

const getLotStatusTagColor = (status: string) => {
  const map: Record<string, string> = {
    AVAILABLE: 'green',
    LOW_STOCK: 'orange',
    EXPIRING: 'red',
    EXPIRED: 'default',
  };
  return map[status] || 'default';
};

const getLotStatusTagLabel = (status: string) => {
  const map: Record<string, string> = {
    AVAILABLE: t('vaccine.lotStatus.available'),
    LOW_STOCK: t('vaccine.lotStatus.lowStock'),
    EXPIRING: t('vaccine.lotStatus.expiring'),
    EXPIRED: t('vaccine.lotStatus.expired'),
  };
  return map[status] || status;
};
</script>

<template>
  <div class="flex flex-col gap-6 pt-2">
    <!-- Lot Overview Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div v-for="item in lotOverviewCards" :key="item.key" class="bg-surface border-border flex flex-col border p-4">
        <div class="flex items-center justify-between">
          <span class="text-text-muted text-sm font-medium">{{ item.label }}</span>
          <div :class="['flex h-10 w-10 items-center justify-center rounded-sm', item.colorClass]">
            <component :is="item.icon" size="22" stroke="1.5" />
          </div>
        </div>
        <div class="text-text mt-2 text-2xl font-bold">{{ item.value }}</div>
      </div>
    </div>

    <!-- Lots Filters & Table -->
    <div class="border-border bg-surface border">
      <div class="border-border flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-end lg:justify-between">
        <div class="flex flex-1 flex-wrap items-center gap-4">
          <div class="flex w-full flex-col gap-1 sm:w-[280px]">
            <label class="text-text-muted text-xs font-semibold">{{ t('search') }}</label>
            <a-input
              v-model:value="lotFilterState.search"
              placeholder="Số lô, nhà sản xuất..."
              allow-clear
              size="large"
              @press-enter="applyLotFilters"
            >
              <template #prefix>
                <IconSearch class="text-text-muted size-4" />
              </template>
            </a-input>
          </div>

          <div class="flex w-full flex-col gap-1 sm:w-44">
            <label class="text-text-muted text-xs font-semibold">{{ t('status') }}</label>
            <a-select
              v-model:value="lotFilterState.status"
              :placeholder="t('vaccine.statusPlaceholder')"
              :options="lotStatusOptions"
              allow-clear
              class="w-full"
              size="large"
              @change="applyLotFilters"
            />
          </div>
        </div>

        <div class="flex w-full gap-3 sm:w-auto">
          <a-button
            size="large"
            class="flex w-full items-center justify-center gap-2 rounded-sm sm:w-auto"
            @click="applyLotFilters"
          >
            <template #icon><IconSearch class="size-4" /></template>
            <span class="font-medium">{{ t('search') }}</span>
          </a-button>
          <a-button
            size="large"
            class="flex w-full items-center justify-center gap-2 rounded-sm sm:w-auto"
            @click="resetLotFilters"
          >
            <template #icon><IconFilterOff class="size-4" /></template>
            <span class="font-medium">{{ t('reset') }}</span>
          </a-button>
        </div>
      </div>

      <!-- Lots Table -->
      <a-table
        row-key="id"
        :columns="lotColumns"
        :data-source="listLot.data"
        :loading="loading"
        :pagination="false"
        :scroll="{ x: 'max-content' }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'lotNo'">
            <span class="font-ibm text-primary text-sm font-bold">{{ record.lotNo }}</span>
          </template>

          <template v-else-if="column.key === 'vaccineName'">
            <div class="flex flex-col">
              <span class="text-text text-sm font-semibold">{{ record.vaccineName }}</span>
              <span class="text-text-muted text-xs">{{ record.vaccineCode }}</span>
            </div>
          </template>

          <template v-else-if="column.key === 'quantity'">
            <div class="flex flex-col">
              <span class="text-text text-sm font-medium">{{ record.quantity }} liều</span>
              <span class="text-text-muted text-xs">
                Còn: {{ Math.max(0, record.quantity - (record.reservedQuantity || 0)) }}
              </span>
            </div>
          </template>

          <template v-else-if="column.key === 'importDate'">
            <span>{{ formatDate(record.importDate) }}</span>
          </template>

          <template v-else-if="column.key === 'expiryDate'">
            <span>{{ formatDate(record.expiryDate) }}</span>
          </template>

          <template v-else-if="column.key === 'status'">
            <a-tag :color="getLotStatusTagColor(record.status)" class="m-0">
              {{ getLotStatusTagLabel(record.status) }}
            </a-tag>
          </template>

          <template v-else-if="column.key === 'action'">
            <div class="flex items-center justify-center gap-1">
              <a-tooltip :title="t('edit')">
                <a-button
                  type="text"
                  class="text-primary flex items-center justify-center"
                  @click="emit('openEdit', record)"
                >
                  <template #icon><IconEdit size="18" /></template>
                </a-button>
              </a-tooltip>
              <a-tooltip :title="t('delete')">
                <a-button
                  type="text"
                  danger
                  class="flex items-center justify-center"
                  @click="emit('openDelete', record)"
                >
                  <template #icon><IconTrash size="18" /></template>
                </a-button>
              </a-tooltip>
            </div>
          </template>
        </template>
      </a-table>

      <Pagination
        :current="listLot.page"
        :pageSize="listLot.limit"
        :total="listLot.total"
        @update:current="handleLotPageChange"
        @update:pageSize="handleLotPageSizeChange"
      />
    </div>
  </div>
</template>
