<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import PageLayout from '@/layouts/PageLayout.vue';
import { useLocale } from '@/shared/composables/useLocale';
import { useWorkingScheduleStore } from '@/store/workingScheduleStore';
import ScheduleHeaderStats from '../components/ScheduleHeaderStats.vue';
import ScheduleFilterBar from '../components/ScheduleFilterBar.vue';
import ShiftCardGrid from '../components/ShiftCardGrid.vue';
import DoctorRosterGrid from '../components/DoctorRosterGrid.vue';
import HourlyTimelineView from '../components/HourlyTimelineView.vue';
import ShiftFormDrawer from '../components/ShiftFormDrawer.vue';
import ShiftDetailDrawer from '../components/ShiftDetailDrawer.vue';
import type { DoctorShift } from '@/shared/types/workingSchedule.type';

const { t } = useLocale();
const scheduleStore = useWorkingScheduleStore();
const { filters } = storeToRefs(scheduleStore);

const isFormDrawerOpen = ref(false);
const isDetailDrawerOpen = ref(false);
const editingShift = ref<DoctorShift | null>(null);
const initialDoctorIdForForm = ref<string | undefined>(undefined);

onMounted(() => {
  scheduleStore.fetchShifts();
});

const handleOpenCreateShift = () => {
  editingShift.value = null;
  initialDoctorIdForForm.value = undefined;
  isFormDrawerOpen.value = true;
};

const handleOpenCreateShiftForDoctor = (doctorId: string) => {
  editingShift.value = null;
  initialDoctorIdForForm.value = doctorId;
  isFormDrawerOpen.value = true;
};

const handleOpenEditShift = (shift: DoctorShift) => {
  editingShift.value = shift;
  isFormDrawerOpen.value = true;
};

const handleOpenViewShift = (shift: DoctorShift) => {
  scheduleStore.selectShift(shift);
  isDetailDrawerOpen.value = true;
};

const handleEditFromDetail = () => {
  if (scheduleStore.selectedShift) {
    editingShift.value = scheduleStore.selectedShift;
    isDetailDrawerOpen.value = false;
    isFormDrawerOpen.value = true;
  }
};
</script>

<template>
  <PageLayout>
    <div class="space-y-5">
      <!-- Page Title & Overview -->
      <div class="flex flex-col gap-1">
        <h1 class="text-text text-2xl font-extrabold tracking-tight">
          {{ t('schedule.title') }}
        </h1>
        <p class="text-text-muted text-xs sm:text-sm">
          {{ t('schedule.subtitle') }}
        </p>
      </div>

      <!-- Header Statistics Widgets -->
      <ScheduleHeaderStats />

      <!-- Controls & Filter Bar -->
      <ScheduleFilterBar @create-shift="handleOpenCreateShift" />

      <!-- Main View Content (No HTML Tables!) -->
      <div class="mt-4">
        <!-- Mode 1: Shift Cards Grid -->
        <ShiftCardGrid
          v-if="filters.viewMode === 'SHIFT_GRID'"
          @view-shift="handleOpenViewShift"
          @edit-shift="handleOpenEditShift"
        />

        <!-- Mode 2: Doctor Roster Cards Grid -->
        <DoctorRosterGrid
          v-else-if="filters.viewMode === 'DOCTOR_ROSTER'"
          @add-shift-for-doctor="handleOpenCreateShiftForDoctor"
          @view-shift="handleOpenViewShift"
        />

        <!-- Mode 3: Hourly Station Timeline -->
        <HourlyTimelineView v-else-if="filters.viewMode === 'HOURLY_TIMELINE'" @view-shift="handleOpenViewShift" />
      </div>

      <!-- Drawer components -->
      <ShiftFormDrawer
        v-model:open="isFormDrawerOpen"
        :shift="editingShift"
        :initial-doctor-id="initialDoctorIdForForm"
        @saved="scheduleStore.fetchShifts"
      />

      <ShiftDetailDrawer
        v-model:open="isDetailDrawerOpen"
        :shift="scheduleStore.selectedShift"
        @edit="handleEditFromDetail"
      />
    </div>
  </PageLayout>
</template>
