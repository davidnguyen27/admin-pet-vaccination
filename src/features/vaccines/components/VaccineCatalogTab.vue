<script setup lang="ts">
import { computed, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import type { TableColumnsType } from 'ant-design-vue';
import {
  IconVaccine,
  IconShieldCheck,
  IconArchive,
  IconAlertTriangle,
  IconSearch,
  IconFilterOff,
  IconEye,
  IconEdit,
  IconTrash,
} from '@tabler/icons-vue';

import Pagination from '@/shared/components/ui/Pagination.vue';
import { useLocale } from '@/shared/composables/useLocale';
import { useVaccineStore } from '@/store/vaccineStore';
import type { Vaccine } from '@/shared/types/vaccine.type';

const emit = defineEmits<{
  (e: 'openAdd'): void;
  (e: 'openEdit', record: Vaccine): void;
  (e: 'openDelete', record: Vaccine): void;
}>();

const { t } = useLocale();
const router = useRouter();
const vaccineStore = useVaccineStore();
const { loading, listVaccine, overView, filters } = storeToRefs(vaccineStore);

const filterState = reactive({
  search: filters.value.search || '',
  status: filters.value.status,
  species: filters.value.species,
});

const statusOptions = computed(() => [
  { value: 'ACTIVE', label: t('vaccine.status.active') },
  { value: 'INACTIVE', label: t('vaccine.status.inactive') },
]);

const speciesOptions = computed(() => [
  { value: 'dog', label: t('vaccine.speciesOptions.dog') },
  { value: 'cat', label: t('vaccine.speciesOptions.cat') },
]);

const overviewCards = computed(() => [
  {
    key: 'total',
    label: t('all'),
    value: overView.value.total,
    icon: IconVaccine,
    description: t('vaccine.totalVaccines'),
  },
  {
    key: 'active',
    label: t('vaccine.status.active'),
    value: overView.value.active,
    icon: IconShieldCheck,
    description: t('vaccine.activeVaccines'),
  },
  {
    key: 'stock',
    label: t('vaccine.stock'),
    value: overView.value.totalStock,
    icon: IconArchive,
    description: t('vaccine.totalDoses'),
  },
  {
    key: 'alerts',
    label: t('vaccine.alerts'),
    value: overView.value.lowStockLots + overView.value.expiringLots,
    icon: IconAlertTriangle,
    description: t('vaccine.inventoryAlerts'),
  },
]);

const columns = computed<TableColumnsType>(() => [
  { title: t('vaccine.vaccine'), dataIndex: 'name', key: 'name', width: 280 },
  { title: t('vaccine.disease'), dataIndex: 'disease', key: 'disease', width: 220 },
  { title: t('vaccine.species'), dataIndex: 'species', key: 'species', width: 120 },
  { title: t('vaccine.schedule'), dataIndex: 'schedule', key: 'schedule', width: 180 },
  { title: t('vaccine.inventory'), dataIndex: 'inventory', key: 'inventory', width: 200 },
  { title: t('status'), dataIndex: 'status', key: 'status', width: 120 },
  { title: t('action'), key: 'action', align: 'center', fixed: 'right', width: 128 },
]);

const vaccinesData = computed(() => listVaccine.value.data);

function fetchVaccines() {
  vaccineStore.fetchVaccineList();
}

function applyFilters() {
  vaccineStore.setFilters({
    search: filterState.search,
    status: filterState.status,
    species: filterState.species,
  });
  fetchVaccines();
}

function resetFilters() {
  vaccineStore.resetFilters();
  filterState.search = '';
  filterState.status = undefined;
  filterState.species = undefined;
  fetchVaccines();
}

function handlePageChange(page: number) {
  vaccineStore.setPagination(page, listVaccine.value.limit);
  fetchVaccines();
}

function handlePageSizeChange(pageSize: number) {
  vaccineStore.setPagination(1, pageSize);
  fetchVaccines();
}

function openVaccineDetail(vaccine: Vaccine) {
  router.push({ name: 'VaccineDetail', params: { id: vaccine.id } });
}

function getSpeciesLabel(species?: string) {
  if (!species) return '-';
  return t(`vaccine.speciesOptions.${species}`);
}

function getStatusColor(status: string) {
  return status === 'ACTIVE' ? 'green' : 'default';
}
</script>

<template>
  <div class="flex flex-col gap-6 pt-2">
    <!-- Overview Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="item in overviewCards"
        :key="item.key"
        class="bg-surface border-border flex flex-col border p-4"
      >
        <div class="flex items-center justify-between">
          <span class="text-text-muted text-sm font-medium">{{ item.label }}</span>
          <div class="bg-primary-soft text-primary flex h-10 w-10 items-center justify-center rounded-sm">
            <component :is="item.icon" size="22" stroke="1.5" />
          </div>
        </div>
        <div class="text-text mt-2 text-2xl font-bold">{{ item.value }}</div>
        <span class="text-text-muted mt-1 text-xs">{{ item.description }}</span>
      </div>
    </div>

    <!-- Filters -->
    <div class="border-border bg-surface border">
      <div class="border-border flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-end lg:justify-between">
        <div class="flex flex-1 flex-wrap items-center gap-4">
          <div class="flex w-full flex-col gap-1 sm:w-[300px]">
            <label for="vaccine-search" class="text-text-muted text-xs font-semibold">{{ t('search') }}</label>
            <a-input
              id="vaccine-search"
              v-model:value="filterState.search"
              :placeholder="t('vaccine.searchPlaceholder')"
              allow-clear
              size="large"
              @press-enter="applyFilters"
            >
              <template #prefix>
                <IconSearch class="text-text-muted size-4" />
              </template>
            </a-input>
          </div>

          <div class="flex w-full flex-col gap-1 sm:w-44">
            <label class="text-text-muted text-xs font-semibold">{{ t('status') }}</label>
            <a-select
              v-model:value="filterState.status"
              :placeholder="t('vaccine.statusPlaceholder')"
              :options="statusOptions"
              allow-clear
              class="w-full"
              size="large"
              @change="applyFilters"
            />
          </div>

          <div class="flex w-full flex-col gap-1 sm:w-44">
            <label class="text-text-muted text-xs font-semibold">{{ t('vaccine.species') }}</label>
            <a-select
              v-model:value="filterState.species"
              :placeholder="t('vaccine.speciesPlaceholder')"
              :options="speciesOptions"
              allow-clear
              class="w-full"
              size="large"
              @change="applyFilters"
            />
          </div>
        </div>

        <div class="flex w-full gap-3 sm:w-auto">
          <a-button
            size="large"
            class="flex w-full items-center justify-center gap-2 rounded-sm sm:w-auto"
            @click="applyFilters"
          >
            <template #icon><IconSearch class="size-4" /></template>
            <span class="font-medium">{{ t('search') }}</span>
          </a-button>
          <a-button
            size="large"
            class="flex w-full items-center justify-center gap-2 rounded-sm sm:w-auto"
            @click="resetFilters"
          >
            <template #icon><IconFilterOff class="size-4" /></template>
            <span class="font-medium">{{ t('reset') }}</span>
          </a-button>
        </div>
      </div>

      <!-- Table -->
      <a-table
        row-key="id"
        :columns="columns"
        :data-source="vaccinesData"
        :loading="loading"
        :pagination="false"
        :scroll="{ x: 'max-content' }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <div class="flex min-w-0 flex-col">
              <span
                class="text-primary cursor-pointer truncate text-sm font-semibold hover:underline"
                @click="openVaccineDetail(record)"
              >
                {{ record.name }}
              </span>
              <span class="text-text-muted truncate text-xs"
                >{{ record.code }} · {{ record.manufacturer }}</span
              >
            </div>
          </template>

          <template v-else-if="column.key === 'disease'">
            <div class="text-text max-w-[240px] truncate text-sm">{{ record.disease }}</div>
          </template>

          <template v-else-if="column.key === 'species'">
            <a-tag color="processing" class="m-0">{{ getSpeciesLabel(record.species) }}</a-tag>
          </template>

          <template v-else-if="column.key === 'schedule'">
            <div class="flex flex-col">
              <span class="text-text text-sm">{{ record.dose }}</span>
              <span class="text-text-muted text-xs">{{
                t('vaccine.intervalDays', { days: record.intervalDays })
              }}</span>
            </div>
          </template>

          <template v-else-if="column.key === 'inventory'">
            <div class="flex flex-col gap-1">
              <span class="text-text text-sm">{{ t('vaccine.stockCount', { count: record.totalStock }) }}</span>
              <span class="text-text-muted text-xs">
                {{ t('vaccine.lotSummary', { count: record.lotCount }) }}
              </span>
            </div>
          </template>

          <template v-else-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)" class="m-0">
              {{ record.status === 'ACTIVE' ? t('vaccine.status.active') : t('vaccine.status.inactive') }}
            </a-tag>
          </template>

          <template v-else-if="column.key === 'action'">
            <div class="flex items-center justify-center gap-1">
              <a-tooltip :title="t('view')">
                <a-button
                  type="text"
                  class="text-primary flex items-center justify-center"
                  @click="openVaccineDetail(record)"
                >
                  <template #icon><IconEye size="18" /></template>
                </a-button>
              </a-tooltip>
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
        :current="listVaccine.page"
        :pageSize="listVaccine.limit"
        :total="listVaccine.total"
        @update:current="handlePageChange"
        @update:pageSize="handlePageSizeChange"
      />
    </div>
  </div>
</template>
