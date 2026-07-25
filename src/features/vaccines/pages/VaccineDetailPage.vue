<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { message } from 'ant-design-vue';
import type { TableColumnsType } from 'ant-design-vue';
import { useRoute, useRouter } from 'vue-router';
import {
  IconAlertTriangle,
  IconArrowLeft,
  IconCalendarTime,
  IconEdit,
  IconPlus,
  IconRefresh,
  IconShieldCheck,
  IconVaccine,
} from '@tabler/icons-vue';
import PageLayout from '@/layouts/PageLayout.vue';
import { useLocale } from '@/shared/composables/useLocale';
import { formatDate } from '@/shared/utils';
import { useVaccineStore } from '@/store/vaccineStore';
import type { VaccineLot } from '@/shared/types/vaccine.type';

const route = useRoute();
const router = useRouter();
const { t } = useLocale();
const vaccineStore = useVaccineStore();
const { vaccine, loading } = storeToRefs(vaccineStore);

const activeTab = ref('overview');
const vaccineId = computed(() => route.params.id as string);
const vaccineLots = computed(() => (vaccineId.value ? vaccineStore.getVaccineLots(vaccineId.value) : []));
const availableDoses = computed(() =>
  vaccineLots.value.reduce((sum, lot) => sum + Math.max(0, lot.quantity - lot.reservedQuantity), 0),
);

const lotColumns = computed<TableColumnsType>(() => [
  { title: t('vaccine.lotNo'), dataIndex: 'lotNo', key: 'lotNo', width: 160 },
  { title: t('vaccine.manufacturer'), dataIndex: 'manufacturer', key: 'manufacturer', width: 180 },
  { title: t('vaccine.quantity'), dataIndex: 'quantity', key: 'quantity', width: 140 },
  { title: t('vaccine.importDate'), dataIndex: 'importDate', key: 'importDate', width: 140 },
  { title: t('vaccine.expiryDate'), dataIndex: 'expiryDate', key: 'expiryDate', width: 140 },
  { title: t('status'), dataIndex: 'status', key: 'status', width: 140 },
]);

const flowSteps = computed(() => [
  t('vaccine.flow.selectAppointment'),
  t('vaccine.flow.selectVaccine'),
  t('vaccine.flow.selectLot'),
  t('vaccine.flow.submitAdministration'),
  t('vaccine.flow.backendUpdates'),
  t('vaccine.flow.refreshState'),
]);

function fetchVaccine() {
  if (vaccineId.value) {
    vaccineStore.getVaccine(vaccineId.value);
  }
}

function handleUnavailableAction() {
  message.info(t('vaccine.actionUnavailable'));
}

function getSpeciesLabel(species?: string) {
  if (!species) return '-';
  return t(`vaccine.speciesOptions.${species}`);
}

function getLotStatusColor(status: string) {
  const colorMap: Record<string, string> = {
    AVAILABLE: 'green',
    LOW_STOCK: 'orange',
    EXPIRING: 'red',
    EXPIRED: 'default',
  };
  return colorMap[status] || 'default';
}

function getLotStatusLabel(status: string) {
  const labelMap: Record<string, string> = {
    AVAILABLE: t('vaccine.lotStatus.available'),
    LOW_STOCK: t('vaccine.lotStatus.lowStock'),
    EXPIRING: t('vaccine.lotStatus.expiring'),
    EXPIRED: t('vaccine.lotStatus.expired'),
  };
  return labelMap[status] || status;
}

function getAvailableLotDoses(lot: VaccineLot) {
  return Math.max(0, lot.quantity - lot.reservedQuantity);
}

onMounted(() => {
  fetchVaccine();
});

watch(vaccineId, () => {
  fetchVaccine();
});
</script>

<template>
  <PageLayout>
    <div class="flex flex-col gap-6">
      <div
        class="border-border bg-surface flex flex-col gap-4 border p-4 lg:flex-row lg:items-center lg:justify-between"
      >
        <div class="flex min-w-0 items-start gap-3">
          <a-button
            type="text"
            class="mt-0.5 flex items-center justify-center p-2"
            @click="router.push('/vaccine-management')"
          >
            <template #icon><IconArrowLeft size="20" /></template>
          </a-button>
          <div class="flex min-w-0 flex-col gap-1">
            <h1 class="font-ibm text-text truncate text-xl font-bold">
              {{ vaccine?.name || t('vaccine.detailTitle') }}
            </h1>
            <p class="text-text-muted text-sm">{{ t('vaccine.detailDescription') }}</p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <a-button type="default" size="large" class="flex items-center justify-center gap-2" @click="fetchVaccine">
            <template #icon><IconRefresh size="18" /></template>
            <span>{{ t('refresh') }}</span>
          </a-button>
          <a-button
            type="default"
            size="large"
            class="flex items-center justify-center gap-2"
            @click="handleUnavailableAction"
          >
            <template #icon><IconPlus size="18" /></template>
            <span>{{ t('vaccine.addLot') }}</span>
          </a-button>
          <a-button
            type="primary"
            size="large"
            class="flex items-center justify-center gap-2"
            @click="handleUnavailableAction"
          >
            <template #icon><IconEdit size="18" /></template>
            <span>{{ t('edit') }}</span>
          </a-button>
        </div>
      </div>

      <div v-if="loading" class="flex h-[50vh] items-center justify-center">
        <a-spin size="large" />
      </div>

      <div v-else-if="vaccine" class="flex flex-col gap-6">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div class="border-border bg-surface border p-4">
            <div class="flex items-center justify-between">
              <span class="text-text-muted text-sm font-medium">{{ t('vaccine.statusLabel') }}</span>
              <IconShieldCheck class="text-primary size-5" />
            </div>
            <div class="mt-2">
              <a-tag :color="vaccine.status === 'ACTIVE' ? 'green' : 'default'" class="m-0">
                {{ vaccine.status === 'ACTIVE' ? t('vaccine.status.active') : t('vaccine.status.inactive') }}
              </a-tag>
            </div>
          </div>

          <div class="border-border bg-surface border p-4">
            <div class="flex items-center justify-between">
              <span class="text-text-muted text-sm font-medium">{{ t('vaccine.availableDoses') }}</span>
              <IconVaccine class="text-primary size-5" />
            </div>
            <div class="text-text mt-2 text-2xl font-bold">{{ availableDoses }}</div>
          </div>

          <div class="border-border bg-surface border p-4">
            <div class="flex items-center justify-between">
              <span class="text-text-muted text-sm font-medium">{{ t('vaccine.lots') }}</span>
              <IconCalendarTime class="text-primary size-5" />
            </div>
            <div class="text-text mt-2 text-2xl font-bold">{{ vaccineLots.length }}</div>
          </div>

          <div class="border-border bg-surface border p-4">
            <div class="flex items-center justify-between">
              <span class="text-text-muted text-sm font-medium">{{ t('vaccine.alerts') }}</span>
              <IconAlertTriangle class="text-warning size-5" />
            </div>
            <div class="text-text mt-2 text-2xl font-bold">{{ vaccine.lowStockLots + vaccine.expiringLots }}</div>
          </div>
        </div>

        <div class="border-border bg-surface border">
          <a-tabs v-model:activeKey="activeTab" class="px-4">
            <a-tab-pane key="overview" :tab="t('vaccine.tabs.overview')">
              <div class="grid grid-cols-1 gap-4 pb-4 xl:grid-cols-3">
                <div class="border-border border p-4 xl:col-span-2">
                  <h2 class="text-text mb-4 text-sm font-semibold">{{ t('vaccine.basicInformation') }}</h2>
                  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <p class="text-text-muted mb-1 text-xs">{{ t('vaccine.code') }}</p>
                      <p class="text-text text-sm font-medium">{{ vaccine.code }}</p>
                    </div>
                    <div>
                      <p class="text-text-muted mb-1 text-xs">{{ t('vaccine.manufacturer') }}</p>
                      <p class="text-text text-sm font-medium">{{ vaccine.manufacturer }}</p>
                    </div>
                    <div>
                      <p class="text-text-muted mb-1 text-xs">{{ t('vaccine.species') }}</p>
                      <p class="text-text text-sm font-medium">{{ getSpeciesLabel(vaccine.species) }}</p>
                    </div>
                    <div>
                      <p class="text-text-muted mb-1 text-xs">{{ t('vaccine.type') }}</p>
                      <p class="text-text text-sm font-medium">{{ vaccine.type }}</p>
                    </div>
                    <div>
                      <p class="text-text-muted mb-1 text-xs">{{ t('vaccine.disease') }}</p>
                      <p class="text-text text-sm font-medium">{{ vaccine.disease }}</p>
                    </div>
                    <div>
                      <p class="text-text-muted mb-1 text-xs">{{ t('vaccine.dose') }}</p>
                      <p class="text-text text-sm font-medium">{{ vaccine.dose }}</p>
                    </div>
                    <div>
                      <p class="text-text-muted mb-1 text-xs">{{ t('vaccine.interval') }}</p>
                      <p class="text-text text-sm font-medium">
                        {{ t('vaccine.intervalDays', { days: vaccine.intervalDays }) }}
                      </p>
                    </div>
                    <div>
                      <p class="text-text-muted mb-1 text-xs">{{ t('vaccine.booster') }}</p>
                      <p class="text-text text-sm font-medium">{{ vaccine.boosterRequired ? t('yes') : t('no') }}</p>
                    </div>
                  </div>
                </div>

                <div class="border-border border p-4">
                  <h2 class="text-text mb-4 text-sm font-semibold">{{ t('vaccine.description') }}</h2>
                  <p class="text-text-muted text-sm">{{ vaccine.description || '-' }}</p>
                  <div class="border-border mt-4 border-t pt-4">
                    <p class="text-text-muted mb-1 text-xs">{{ t('user.lastUpdated') }}</p>
                    <p class="text-text text-sm font-medium">{{ formatDate(vaccine.updatedAt) }}</p>
                  </div>
                </div>
              </div>
            </a-tab-pane>

            <a-tab-pane key="lots" :tab="t('vaccine.tabs.lots')">
              <div class="pb-4">
                <a-table
                  row-key="id"
                  :columns="lotColumns"
                  :data-source="vaccineLots"
                  :pagination="false"
                  :scroll="{ x: 'max-content' }"
                >
                  <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'quantity'">
                      <div class="flex flex-col">
                        <span class="text-text text-sm">{{ t('vaccine.stockCount', { count: record.quantity }) }}</span>
                        <span class="text-text-muted text-xs">
                          {{ t('vaccine.availableCount', { count: getAvailableLotDoses(record) }) }}
                        </span>
                      </div>
                    </template>
                    <template v-else-if="column.key === 'importDate'">
                      {{ formatDate(record.importDate) }}
                    </template>
                    <template v-else-if="column.key === 'expiryDate'">
                      {{ formatDate(record.expiryDate) }}
                    </template>
                    <template v-else-if="column.key === 'status'">
                      <a-tag :color="getLotStatusColor(record.status)" class="m-0">
                        {{ getLotStatusLabel(record.status) }}
                      </a-tag>
                    </template>
                  </template>
                </a-table>
              </div>
            </a-tab-pane>

            <a-tab-pane key="workflow" :tab="t('vaccine.tabs.workflow')">
              <div class="pb-4">
                <div class="border-border border p-4">
                  <h2 class="text-text mb-4 text-sm font-semibold">{{ t('vaccine.workflowTitle') }}</h2>
                  <div class="flex flex-col gap-3">
                    <div v-for="(step, index) in flowSteps" :key="step" class="flex items-start gap-3">
                      <div
                        class="bg-primary-soft text-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-sm text-xs font-bold"
                      >
                        {{ index + 1 }}
                      </div>
                      <p class="text-text text-sm">{{ step }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>

      <div v-else class="flex h-[50vh] flex-col items-center justify-center gap-4">
        <p class="text-text text-xl font-bold">{{ t('vaccine.notFound') }}</p>
        <p class="text-text-muted">{{ t('vaccine.notFoundDesc') }}</p>
        <a-button type="primary" @click="router.push('/vaccine-management')">
          {{ t('vaccine.backToList') }}
        </a-button>
      </div>
    </div>
  </PageLayout>
</template>
