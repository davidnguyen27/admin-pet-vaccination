<script setup lang="ts">
import { IconVaccine } from '@tabler/icons-vue';
import AdminLayout from '@/layouts/AdminLayout.vue';
import VaccineFilter from '../components/VaccineFilter.vue';
import VaccineTable from '../components/VaccineTable.vue';
import VaccineModal from '../components/VaccineModal.vue';
import { useVaccineManagement } from '../composables/useVaccineManagement';

const {
  loading,
  modalLoading,
  isModalOpen,
  editingVaccine,
  searchQuery,
  speciesFilter,
  dataSource,
  columns,
  pagination,
  onTableChange,
  handleSearch,
  handleAdd,
  handleModalSubmit,
  handleModalCancel,
  handleEdit,
  handleDelete,
} = useVaccineManagement();
</script>

<template>
  <admin-layout>
    <div class="flex max-w-full flex-col gap-4">
      <div
        class="flex flex-wrap items-center justify-between gap-3 border border-(--divider) bg-(--bg-card) px-4 py-3 shadow-sm"
      >
        <div class="min-w-0">
          <h1 class="m-0 text-[18px]! font-bold tracking-[-0.02em] text-(--text-primary)">Vaccine Records</h1>
          <p class="mt-1.5 mr-0 mb-0 ml-0 text-[13px] text-(--text-label)">
            Manage vaccine catalog, dosage defaults, and availability status for treatment planning.
          </p>
        </div>

        <a-button
          type="primary"
          class="flex! items-center gap-1 border-(--color-primary)! bg-(--color-primary)! px-4! text-sm! font-semibold"
          @click="handleAdd"
        >
          <template #icon>
            <icon-vaccine :size="16" stroke-width="2" />
          </template>
          Add New Vaccine
        </a-button>
      </div>

      <vaccine-filter
        v-model:search-query="searchQuery"
        v-model:species-filter="speciesFilter"
        @search="handleSearch"
      />

      <vaccine-table
        :data-source="dataSource"
        :columns="columns"
        :pagination="pagination"
        :loading="loading"
        @table-change="onTableChange"
        @edit="handleEdit"
        @delete="handleDelete"
      />

      <vaccine-modal
        v-model:open="isModalOpen"
        :loading="modalLoading"
        :initial-values="editingVaccine"
        @submit="handleModalSubmit"
        @cancel="handleModalCancel"
      />
    </div>
  </admin-layout>
</template>
