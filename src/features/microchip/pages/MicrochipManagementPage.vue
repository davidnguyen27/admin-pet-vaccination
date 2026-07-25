<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useLocale } from '@/shared/composables/useLocale';
import { useMicrochipStore } from '@/store/microchipStore';
import PageLayout from '@/layouts/PageLayout.vue';
import MicrochipStats from '../components/MicrochipStats.vue';
import MicrochipFilterPanel from '../components/MicrochipFilterPanel.vue';
import MicrochipTable from '../components/MicrochipTable.vue';
import MicrochipModal from '../components/MicrochipModal.vue';
import MicrochipDetailModal from '../components/MicrochipDetailModal.vue';
import DeleteModal from '@/shared/components/DeleteModal.vue';
import { message } from 'ant-design-vue';
import type { Microchip } from '@/shared/types/microchip.type';

const { t } = useLocale();
const microchipStore = useMicrochipStore();
const { listMicrochip, filters, overView, loading } = storeToRefs(microchipStore);

const isModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const selectedId = ref<string | null>(null);
const selectedData = ref<Microchip | null>(null);
const isDeleting = ref(false);
const isDetailModalOpen = ref(false);
const detailData = ref<Microchip | null>(null);

const localSearch = ref(filters.value.search || '');
const localStatus = ref<string | undefined>(filters.value.status);

onMounted(() => {
  microchipStore.fetchMicrochipOverView();
  microchipStore.fetchMicrochipList();
});

const handleSearch = () => {
  microchipStore.setFilters({
    search: localSearch.value,
    status: localStatus.value,
  });
  microchipStore.fetchMicrochipList();
};

const handleReset = () => {
  localSearch.value = '';
  localStatus.value = undefined;
  microchipStore.resetFilters();
  microchipStore.fetchMicrochipList();
};

const handlePageChange = (page: number, pageSize: number) => {
  microchipStore.setPagination(page, pageSize);
  microchipStore.fetchMicrochipList();
};

const openAddModal = () => {
  selectedId.value = null;
  selectedData.value = null;
  isModalOpen.value = true;
};

const openEditModal = (record: Microchip) => {
  selectedId.value = record.id;
  selectedData.value = record;
  isModalOpen.value = true;
};

const openDetailModal = (record: Microchip) => {
  detailData.value = record;
  isDetailModalOpen.value = true;
};

const openDeleteModal = (record: Microchip) => {
  selectedId.value = record.id;
  isDeleteModalOpen.value = true;
};

const handleDeleteConfirm = async () => {
  if (!selectedId.value) return;
  isDeleting.value = true;
  try {
    const res = await microchipStore.deleteMicrochip(selectedId.value);
    if (res.success) {
      message.success(t('success'));
      isDeleteModalOpen.value = false;
    }
  } catch (error: any) {
    message.error(error.message || t('error'));
  } finally {
    isDeleting.value = false;
  }
};

const handleSuccess = () => {
  message.success(t('success'));
  microchipStore.fetchMicrochipOverView();
  microchipStore.fetchMicrochipList();
};
</script>

<template>
  <PageLayout>
    <div class="flex flex-col gap-6">
      <!-- Header -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex flex-col gap-1">
          <h1 class="font-ibm text-text text-xl font-bold">
            {{ t('microchip.management') }}
          </h1>
          <span class="text-text-muted text-xs sm:text-sm">
            Manage pet microchips, track implant status, and client associations across your clinic.
          </span>
        </div>
      </div>

      <!-- Stats Grid -->
      <MicrochipStats :overview="overView" />

      <!-- Filters Panel -->
      <MicrochipFilterPanel
        v-model:search="localSearch"
        v-model:status="localStatus"
        @search="handleSearch"
        @reset="handleReset"
        @create="openAddModal"
      />

      <!-- Data Table -->
      <MicrochipTable
        :data="listMicrochip.data"
        :loading="loading"
        :page="listMicrochip.page"
        :limit="listMicrochip.limit"
        :total="listMicrochip.total"
        @view-detail="openDetailModal"
        @edit="openEditModal"
        @delete="openDeleteModal"
        @page-change="handlePageChange"
      />

      <!-- Add/Edit Modal -->
      <MicrochipModal
        v-model:open="isModalOpen"
        :microchip-id="selectedId"
        :initial-data="selectedData"
        @success="handleSuccess"
      />

      <!-- Delete Modal -->
      <DeleteModal v-model:open="isDeleteModalOpen" :loading="isDeleting" @confirm="handleDeleteConfirm" />

      <!-- Detail Modal -->
      <MicrochipDetailModal v-model:open="isDetailModalOpen" :data="detailData" />
    </div>
  </PageLayout>
</template>
