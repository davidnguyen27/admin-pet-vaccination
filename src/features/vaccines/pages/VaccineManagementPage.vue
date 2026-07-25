<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { message } from 'ant-design-vue';
import { IconPlus, IconReload } from '@tabler/icons-vue';

import PageLayout from '@/layouts/PageLayout.vue';
import VaccineCatalogTab from '../components/VaccineCatalogTab.vue';
import VaccineLotsTab from '../components/VaccineLotsTab.vue';
import VaccineProtocolsTab from '../components/VaccineProtocolsTab.vue';

import VaccineModal from '../components/VaccineModal.vue';
import VaccineLotModal from '../components/VaccineLotModal.vue';
import VaccineProtocolModal from '../components/VaccineProtocolModal.vue';
import DeleteModal from '@/shared/components/DeleteModal.vue';

import { useLocale } from '@/shared/composables/useLocale';
import { useVaccineStore } from '@/store/vaccineStore';
import type { Vaccine, VaccineLot, VaccineProtocol } from '@/shared/types/vaccine.type';

const { t } = useLocale();
const vaccineStore = useVaccineStore();

const activeTab = ref('catalog');

// Vaccine Modal State
const isVaccineModalOpen = ref(false);
const selectedVaccineId = ref<string | null>(null);
const selectedVaccineData = ref<Vaccine | null>(null);

// Lot Modal State
const isLotModalOpen = ref(false);
const selectedLotId = ref<string | null>(null);
const selectedLotData = ref<VaccineLot | null>(null);

// Protocol Modal State
const isProtocolModalOpen = ref(false);
const selectedProtocolId = ref<string | null>(null);
const selectedProtocolData = ref<VaccineProtocol | null>(null);

// Delete Modal State
const isDeleteModalOpen = ref(false);
const deleteTargetType = ref<'vaccine' | 'lot' | 'protocol'>('vaccine');
const deleteTargetId = ref<string | null>(null);
const isDeleting = ref(false);

const refreshData = () => {
  vaccineStore.fetchVaccineOverView();
  vaccineStore.fetchVaccineList();
  vaccineStore.fetchLotOverview();
  vaccineStore.fetchLotList();
};

// --- Vaccine Catalog Handlers ---
const openAddVaccineModal = () => {
  selectedVaccineId.value = null;
  selectedVaccineData.value = null;
  isVaccineModalOpen.value = true;
};

const openEditVaccineModal = (vaccine: Vaccine) => {
  selectedVaccineId.value = vaccine.id;
  selectedVaccineData.value = vaccine;
  isVaccineModalOpen.value = true;
};

const openDeleteVaccineModal = (vaccine: Vaccine) => {
  deleteTargetType.value = 'vaccine';
  deleteTargetId.value = vaccine.id;
  isDeleteModalOpen.value = true;
};

const handleVaccineSuccess = () => {
  message.success(t('success'));
  refreshData();
};

// --- Vaccine Lots Handlers ---
const openAddLotModal = () => {
  selectedLotId.value = null;
  selectedLotData.value = null;
  isLotModalOpen.value = true;
};

const openEditLotModal = (lot: VaccineLot) => {
  selectedLotId.value = lot.id;
  selectedLotData.value = lot;
  isLotModalOpen.value = true;
};

const openDeleteLotModal = (lot: VaccineLot) => {
  deleteTargetType.value = 'lot';
  deleteTargetId.value = lot.id;
  isDeleteModalOpen.value = true;
};

const handleLotSuccess = () => {
  message.success(t('success'));
  refreshData();
};

// --- Vaccine Protocol Handlers ---
const openAddProtocolModal = () => {
  selectedProtocolId.value = null;
  selectedProtocolData.value = {
    id: '',
    species: vaccineStore.protocolFilters.species || 'dog',
    disease: vaccineStore.protocolFilters.disease || 'Rabies',
    ageRange: '',
    vaccineCode: '',
    vaccineName: '',
    isRequired: true,
  };
  isProtocolModalOpen.value = true;
};

const openEditProtocolModal = (record: VaccineProtocol) => {
  selectedProtocolId.value = record.id;
  selectedProtocolData.value = record;
  isProtocolModalOpen.value = true;
};

const openDeleteProtocolModal = (record: VaccineProtocol) => {
  deleteTargetType.value = 'protocol';
  deleteTargetId.value = record.id;
  isDeleteModalOpen.value = true;
};

const handleProtocolSuccess = () => {
  message.success(t('success'));
  vaccineStore.fetchProtocolList();
};

const handleDeleteConfirm = async () => {
  if (!deleteTargetId.value) return;
  isDeleting.value = true;
  try {
    if (deleteTargetType.value === 'vaccine') {
      const res = await vaccineStore.deleteVaccine(deleteTargetId.value);
      if (res.success) {
        message.success(t('success'));
        isDeleteModalOpen.value = false;
      }
    } else if (deleteTargetType.value === 'lot') {
      const res = await vaccineStore.deleteVaccineLot(deleteTargetId.value);
      if (res.success) {
        message.success(t('success'));
        isDeleteModalOpen.value = false;
      }
    } else if (deleteTargetType.value === 'protocol') {
      const res = await vaccineStore.deleteProtocol(deleteTargetId.value);
      if (res.success) {
        message.success(t('success'));
        isDeleteModalOpen.value = false;
      }
    }
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : t('error');
    message.error(errMessage);
  } finally {
    isDeleting.value = false;
  }
};

onMounted(() => {
  refreshData();
  vaccineStore.fetchProtocolList();
});
</script>

<template>
  <PageLayout>
    <div class="flex flex-col gap-6">
      <!-- Header -->
      <div
        class="border-border bg-surface flex flex-col gap-4 border p-4 lg:flex-row lg:items-center lg:justify-between"
      >
        <div class="flex flex-col gap-1">
          <h1 class="font-ibm text-text text-xl font-bold">{{ t('vaccine.management') }}</h1>
          <p class="text-text-muted text-sm">{{ t('vaccine.manageRecords') }}</p>
        </div>

        <div class="flex items-center gap-3">
          <a-tooltip :title="t('refresh')">
            <a-button type="default" size="large" class="flex items-center justify-center" @click="refreshData">
              <template #icon><IconReload size="18" class="text-text-muted" /></template>
            </a-button>
          </a-tooltip>

          <!-- Contextual Primary Action Button -->
          <a-button
            v-if="activeTab === 'catalog'"
            type="primary"
            size="large"
            class="flex items-center justify-center gap-2 rounded-sm"
            @click="openAddVaccineModal"
          >
            <template #icon><IconPlus size="18" /></template>
            <span class="font-medium">{{ t('vaccine.addVaccine') }}</span>
          </a-button>

          <a-button
            v-else-if="activeTab === 'lots'"
            type="primary"
            size="large"
            class="flex items-center justify-center gap-2 rounded-sm"
            @click="openAddLotModal"
          >
            <template #icon><IconPlus size="18" /></template>
            <span class="font-medium">{{ t('vaccine.importLot') }}</span>
          </a-button>

          <a-button
            v-else-if="activeTab === 'protocols'"
            type="primary"
            size="large"
            class="flex items-center justify-center gap-2 rounded-sm"
            @click="openAddProtocolModal"
          >
            <template #icon><IconPlus size="18" /></template>
            <span class="font-medium">{{ t('vaccine.addMilestone') }}</span>
          </a-button>
        </div>
      </div>

      <!-- Main Tabs Workspace -->
      <a-tabs v-model:activeKey="activeTab" class="bg-surface border-border border p-4">
        <!-- TAB 1: VACCINES CATALOG -->
        <a-tab-pane key="catalog" :tab="t('vaccine.list')">
          <VaccineCatalogTab
            @openAdd="openAddVaccineModal"
            @openEdit="openEditVaccineModal"
            @openDelete="openDeleteVaccineModal"
          />
        </a-tab-pane>

        <!-- TAB 2: VACCINE LOTS MANAGEMENT -->
        <a-tab-pane key="lots" :tab="t('vaccine.lotsTab')">
          <VaccineLotsTab @openAdd="openAddLotModal" @openEdit="openEditLotModal" @openDelete="openDeleteLotModal" />
        </a-tab-pane>

        <!-- TAB 3: SPECIES PROTOCOLS -->
        <a-tab-pane key="protocols" :tab="t('vaccine.protocolsTab')">
          <VaccineProtocolsTab
            @openAdd="openAddProtocolModal"
            @openEdit="openEditProtocolModal"
            @openDelete="openDeleteProtocolModal"
          />
        </a-tab-pane>
      </a-tabs>

      <!-- Modals -->
      <VaccineModal
        v-model:open="isVaccineModalOpen"
        :vaccine-id="selectedVaccineId"
        :initial-data="selectedVaccineData"
        @success="handleVaccineSuccess"
      />

      <VaccineLotModal
        v-model:open="isLotModalOpen"
        :lot-id="selectedLotId"
        :initial-data="selectedLotData"
        @success="handleLotSuccess"
      />

      <VaccineProtocolModal
        v-model:open="isProtocolModalOpen"
        :protocol-id="selectedProtocolId"
        :initial-data="selectedProtocolData"
        @success="handleProtocolSuccess"
      />

      <DeleteModal v-model:open="isDeleteModalOpen" :loading="isDeleting" @confirm="handleDeleteConfirm" />
    </div>
  </PageLayout>
</template>
