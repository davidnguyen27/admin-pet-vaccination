<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { message } from 'ant-design-vue';
import { IconPlus, IconLayoutGrid, IconList } from '@tabler/icons-vue';

import PageLayout from '@/layouts/PageLayout.vue';
import HealthCertificateStats from '../components/HealthCertificateStats.vue';
import HealthCertificateFilterPanel from '../components/HealthCertificateFilterPanel.vue';
import HealthCertificateCardGrid from '../components/HealthCertificateCardGrid.vue';
import HealthCertificateTable from '../components/HealthCertificateTable.vue';
import HealthCertificateModal from '../components/HealthCertificateModal.vue';
import HealthCertificateDetailModal from '../components/HealthCertificateDetailModal.vue';
import DeleteModal from '@/shared/components/DeleteModal.vue';

import { useLocale } from '@/shared/composables/useLocale';
import { useHealthCertificateStore } from '@/store/healthCertificateStore';
import type { HealthCertificate } from '@/shared/types/healthCertificate.type';

const { t } = useLocale();
const certStore = useHealthCertificateStore();
const { listHealthCertificate, filters, overview, loading } = storeToRefs(certStore);

const isModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const isDetailModalOpen = ref(false);
const isDeleting = ref(false);
const viewMode = ref<'grid' | 'table'>('grid');

const selectedId = ref<string | null>(null);
const selectedData = ref<HealthCertificate | null>(null);
const detailData = ref<HealthCertificate | null>(null);

const localSearch = ref(filters.value.search || '');
const localStatus = ref<string | undefined>(filters.value.status);
const localPurpose = ref<string | undefined>(filters.value.purpose);

onMounted(() => {
  certStore.fetchOverview();
  certStore.fetchList();
});

const handleSearch = () => {
  certStore.setFilters({
    search: localSearch.value,
    status: localStatus.value,
    purpose: localPurpose.value,
  });
  certStore.fetchList();
};

const handleReset = () => {
  localSearch.value = '';
  localStatus.value = undefined;
  localPurpose.value = undefined;
  certStore.resetFilters();
  certStore.fetchList();
};

const handlePageChange = (page: number, pageSize: number) => {
  certStore.setPagination(page, pageSize);
  certStore.fetchList();
};

const openAddModal = () => {
  selectedId.value = null;
  selectedData.value = null;
  isModalOpen.value = true;
};

const openEditModal = (record: HealthCertificate) => {
  selectedId.value = record.id;
  selectedData.value = record;
  isModalOpen.value = true;
};

const openDetailModal = (record: HealthCertificate) => {
  detailData.value = record;
  isDetailModalOpen.value = true;
};

const openDeleteModal = (record: HealthCertificate) => {
  selectedId.value = record.id;
  isDeleteModalOpen.value = true;
};

const handleDeleteConfirm = async () => {
  if (!selectedId.value) return;
  isDeleting.value = true;
  try {
    const res = await certStore.deleteCertificate(selectedId.value);
    if (res.success) {
      message.success(t('success'));
      isDeleteModalOpen.value = false;
    }
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : t('error');
    message.error(errMessage);
  } finally {
    isDeleting.value = false;
  }
};

const handleSuccess = () => {
  message.success(t('success'));
  certStore.fetchOverview();
  certStore.fetchList();
};
</script>

<template>
  <PageLayout>
    <div class="flex flex-col gap-6">
      <!-- Header -->
      <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div class="flex flex-col gap-1">
          <h1 class="font-ibm text-text text-xl font-bold">
            {{ t('healthCertificate.management') }}
          </h1>
          <span class="text-text-muted text-sm">
            {{ t('healthCertificate.subtitle') }}
          </span>
        </div>

        <div class="flex items-center gap-3">
          <!-- View mode switcher -->
          <div class="bg-surface border-divider flex items-center rounded border p-1">
            <button
              type="button"
              :class="[
                'flex items-center gap-1 rounded px-2.5 py-1 text-xs font-semibold transition',
                viewMode === 'grid' ? 'bg-primary-soft text-primary shadow-xs' : 'text-text-muted hover:text-text',
              ]"
              @click="viewMode = 'grid'"
            >
              <IconLayoutGrid class="size-4" />
              <span>Grid</span>
            </button>
            <button
              type="button"
              :class="[
                'flex items-center gap-1 rounded px-2.5 py-1 text-xs font-semibold transition',
                viewMode === 'table' ? 'bg-primary-soft text-primary shadow-xs' : 'text-text-muted hover:text-text',
              ]"
              @click="viewMode = 'table'"
            >
              <IconList class="size-4" />
              <span>Table</span>
            </button>
          </div>

          <a-button type="primary" class="flex items-center gap-2" size="large" @click="openAddModal">
            <template #icon><IconPlus class="size-4.5" /></template>
            <span class="font-medium">{{ t('healthCertificate.issueCertificate') }}</span>
          </a-button>
        </div>
      </div>

      <!-- Stats Grid Component -->
      <HealthCertificateStats :overview="overview" />

      <!-- Filter Panel Component -->
      <HealthCertificateFilterPanel
        v-model:search="localSearch"
        v-model:status="localStatus"
        v-model:purpose="localPurpose"
        @search="handleSearch"
        @reset="handleReset"
      />

      <!-- Content View (Grid or Table Sub-components) -->
      <HealthCertificateCardGrid
        v-if="viewMode === 'grid'"
        :data="listHealthCertificate.data"
        :loading="loading"
        @viewDetail="openDetailModal"
        @edit="openEditModal"
        @delete="openDeleteModal"
      />

      <HealthCertificateTable
        v-else
        :data="listHealthCertificate.data"
        :loading="loading"
        @viewDetail="openDetailModal"
        @edit="openEditModal"
        @delete="openDeleteModal"
      />

      <!-- Pagination -->
      <div class="flex justify-end pt-2">
        <a-pagination
          :current="listHealthCertificate.page"
          :page-size="listHealthCertificate.limit"
          :total="listHealthCertificate.total"
          show-size-changer
          :show-total="
            (total: number, range: [number, number]) =>
              t('user.showingRange', { range: `${range[0]}-${range[1]}`, total })
          "
          @change="handlePageChange"
          @show-size-change="handlePageChange"
        />
      </div>

      <!-- Modals -->
      <HealthCertificateModal
        v-model:open="isModalOpen"
        :certificate-id="selectedId"
        :initial-data="selectedData"
        @success="handleSuccess"
      />

      <DeleteModal v-model:open="isDeleteModalOpen" :loading="isDeleting" @confirm="handleDeleteConfirm" />

      <HealthCertificateDetailModal v-model:open="isDetailModalOpen" :data="detailData" />
    </div>
  </PageLayout>
</template>
