<script setup lang="ts">
import { IconPaw } from '@tabler/icons-vue';
import AdminLayout from '@/layouts/AdminLayout.vue';
import PetFilter from '../components/PetFilter.vue';
import PetTable from '../components/PetTable.vue';
import PetModal from '../components/PetModal.vue';
import { usePetManagement } from '../composables/usePetManagement';

const {
  loading,
  modalLoading,
  isModalOpen,
  editingPet,
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
} = usePetManagement();
</script>

<template>
  <admin-layout>
    <div class="flex max-w-full flex-col gap-4">
      <div
        class="flex flex-wrap items-center justify-between gap-3 border border-(--divider) bg-(--bg-card) px-4 py-3 shadow-sm"
      >
        <div class="min-w-0">
          <h1 class="m-0 text-[18px]! font-bold tracking-[-0.02em] text-(--text-primary)">Pet Records</h1>
          <p class="mt-1.5 mr-0 mb-0 ml-0 text-[13px] text-(--text-label)">
            Track profiles, species details, and lifecycle status for each pet in the system.
          </p>
        </div>

        <a-button
          type="primary"
          class="flex! items-center gap-1 border-(--color-primary)! bg-(--color-primary)! px-4! text-sm! font-semibold"
          @click="handleAdd"
        >
          <template #icon>
            <icon-paw :size="16" stroke-width="2" />
          </template>
          Add New Pet
        </a-button>
      </div>

      <pet-filter v-model:search-query="searchQuery" v-model:species-filter="speciesFilter" @search="handleSearch" />

      <pet-table
        :data-source="dataSource"
        :columns="columns"
        :pagination="pagination"
        :loading="loading"
        @table-change="onTableChange"
        @edit="handleEdit"
        @delete="handleDelete"
      />

      <pet-modal
        v-model:open="isModalOpen"
        :loading="modalLoading"
        :initial-values="editingPet"
        @submit="handleModalSubmit"
        @cancel="handleModalCancel"
      />
    </div>
  </admin-layout>
</template>
