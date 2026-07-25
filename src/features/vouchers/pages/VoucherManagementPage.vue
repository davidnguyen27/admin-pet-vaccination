<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { message } from 'ant-design-vue';
import PageLayout from '@/layouts/PageLayout.vue';
import { useLocale } from '@/shared/composables/useLocale';
import { useVoucherStore } from '@/store/voucherStore';
import type { Voucher, VoucherFilters } from '@/shared/types/voucher.type';

import VoucherStats from '../components/VoucherStats.vue';
import VoucherFilterPanel from '../components/VoucherFilterPanel.vue';
import VoucherTable from '../components/VoucherTable.vue';
import VoucherModal from '../components/VoucherModal.vue';
import VoucherDetailModal from '../components/VoucherDetailModal.vue';
import DeleteModal from '@/shared/components/DeleteModal.vue';

const { t } = useLocale();
const voucherStore = useVoucherStore();
const { listVoucher, loading } = storeToRefs(voucherStore);

// Modals
const isModalOpen = ref(false);
const selectedId = ref<string | null>(null);
const selectedData = ref<Voucher | null>(null);

const isDetailModalOpen = ref(false);
const detailData = ref<Voucher | null>(null);

const isDeleteModalOpen = ref(false);
const isDeleting = ref(false);

const refreshData = () => {
  voucherStore.fetchVoucherOverview();
  voucherStore.fetchVoucherList();
};

const handleSearch = (filters: VoucherFilters) => {
  voucherStore.setFilters(filters);
  voucherStore.fetchVoucherList();
};

const handleReset = () => {
  voucherStore.resetFilters();
  voucherStore.fetchVoucherList();
};

const handlePageChange = (page: number, pageSize: number) => {
  voucherStore.setPagination(page, pageSize);
  voucherStore.fetchVoucherList();
};

const openCreateModal = () => {
  selectedId.value = null;
  selectedData.value = null;
  isModalOpen.value = true;
};

const openEditModal = (voucher: Voucher) => {
  selectedId.value = voucher.id;
  selectedData.value = voucher;
  isModalOpen.value = true;
};

const openDetailModal = (voucher: Voucher) => {
  detailData.value = voucher;
  isDetailModalOpen.value = true;
};

const openDeleteModal = (voucher: Voucher) => {
  selectedId.value = voucher.id;
  isDeleteModalOpen.value = true;
};

const handleDeleteConfirm = async () => {
  if (!selectedId.value) return;
  isDeleting.value = true;
  try {
    await voucherStore.deleteVoucher(selectedId.value);
    message.success(t('success'));
    isDeleteModalOpen.value = false;
    refreshData();
  } finally {
    isDeleting.value = false;
  }
};

const handleSuccess = () => {
  message.success(t('success'));
  refreshData();
};

onMounted(() => {
  refreshData();
});
</script>

<template>
  <PageLayout>
    <div class="flex flex-col gap-6">
      <!-- Header Banner -->
      <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="font-ibm text-text text-xl font-bold">{{ t('voucher.management') }}</h1>
          <p class="text-text-muted text-sm">{{ t('voucher.manageSubtitle') }}</p>
        </div>
      </div>

      <!-- Overview Stats Cards -->
      <VoucherStats />

      <!-- Filters & Control Panel -->
      <VoucherFilterPanel @search="handleSearch" @reset="handleReset" @create="openCreateModal" />

      <!-- Main Workspace: Admin Table View -->
      <VoucherTable
        :vouchers="listVoucher.data"
        :total="listVoucher.total"
        :page="listVoucher.page"
        :limit="listVoucher.limit"
        :loading="loading"
        @view="openDetailModal"
        @edit="openEditModal"
        @delete="openDeleteModal"
        @page-change="handlePageChange"
      />

      <!-- Modals -->
      <VoucherModal
        v-model:open="isModalOpen"
        :voucher-id="selectedId"
        :initial-data="selectedData"
        @success="handleSuccess"
      />

      <VoucherDetailModal v-model:open="isDetailModalOpen" :data="detailData" />

      <DeleteModal
        v-model:open="isDeleteModalOpen"
        :loading="isDeleting"
        :content="t('voucher.deleteConfirm')"
        @confirm="handleDeleteConfirm"
      />
    </div>
  </PageLayout>
</template>
