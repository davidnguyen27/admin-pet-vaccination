<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import {
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconSearch,
  IconLayoutGrid,
  IconUserCheck,
  IconClock,
  IconPlus,
  IconRotate,
} from '@tabler/icons-vue';
import { useLocale } from '@/shared/composables/useLocale';
import { useWorkingScheduleStore } from '@/store/workingScheduleStore';
import type { ScheduleViewMode, ShiftType, DepartmentCategory, ShiftStatus } from '@/shared/types/workingSchedule.type';

dayjs.locale('vi');

const emit = defineEmits<{
  (e: 'create-shift'): void;
}>();

const { t } = useLocale();
const scheduleStore = useWorkingScheduleStore();
const { filters } = storeToRefs(scheduleStore);

const formattedDateDisplay = computed(() => {
  if (!filters.value.date) return '';
  const d = dayjs(filters.value.date);
  return d.format('dddd, [Ngày] DD/MM/YYYY');
});

const handleDateChange = (val: unknown) => {
  if (val) {
    scheduleStore.setDate(dayjs(val as string).format('YYYY-MM-DD'));
  }
};

const handleToday = () => {
  scheduleStore.setDate('2026-07-24');
};

const handlePrevDay = () => {
  const prev = dayjs(filters.value.date).subtract(1, 'day').format('YYYY-MM-DD');
  scheduleStore.setDate(prev);
};

const handleNextDay = () => {
  const next = dayjs(filters.value.date).add(1, 'day').format('YYYY-MM-DD');
  scheduleStore.setDate(next);
};

const setViewMode = (mode: ScheduleViewMode) => {
  scheduleStore.setViewMode(mode);
};

const handleSearch = (e: Event) => {
  const target = e.target as HTMLInputElement;
  scheduleStore.setFilters({ search: target.value });
};

const handleShiftTypeChange = (val?: ShiftType) => {
  scheduleStore.setFilters({ shiftType: val });
};

const handleDepartmentChange = (val?: DepartmentCategory) => {
  scheduleStore.setFilters({ department: val });
};

const handleStatusChange = (val?: ShiftStatus) => {
  scheduleStore.setFilters({ status: val });
};

const handleReset = () => {
  scheduleStore.resetFilters();
};

const shiftTypeOptions = computed(() => [
  { label: t('all'), value: undefined },
  { label: t('schedule.shiftType.MORNING'), value: 'MORNING' },
  { label: t('schedule.shiftType.AFTERNOON'), value: 'AFTERNOON' },
]);

const departmentOptions = computed(() => [
  { label: t('all'), value: undefined },
  { label: t('schedule.department.VACCINATION'), value: 'VACCINATION' },
  { label: t('schedule.department.GENERAL_EXAM'), value: 'GENERAL_EXAM' },
  { label: t('schedule.department.SURGERY'), value: 'SURGERY' },
]);

const statusOptions = computed(() => [
  { label: t('all'), value: undefined },
  { label: t('schedule.status.IN_PROGRESS'), value: 'IN_PROGRESS' },
  { label: t('schedule.status.SCHEDULED'), value: 'SCHEDULED' },
  { label: t('schedule.status.COMPLETED'), value: 'COMPLETED' },
  { label: t('schedule.status.OFF'), value: 'OFF' },
]);
</script>

<template>
  <div class="bg-surface border-divider flex flex-col gap-4 rounded border p-4 shadow-2xs">
    <!-- Top Row: Date Selection & View Mode Switches & Create Button -->
    <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <!-- Date Selector controls -->
      <div class="flex flex-wrap items-center gap-2">
        <div class="border-divider bg-bg inline-flex rounded border p-0.5">
          <a-button type="text" size="small" class="px-2" @click="handlePrevDay">
            <IconChevronLeft size="16" />
          </a-button>
          <a-button type="text" size="small" class="px-3 text-xs font-medium" @click="handleToday">
            {{ t('statistics.byDay') ? 'Hôm nay' : 'Today' }}
          </a-button>
          <a-button type="text" size="small" class="px-2" @click="handleNextDay">
            <IconChevronRight size="16" />
          </a-button>
        </div>

        <a-date-picker
          :value="filters.date"
          value-format="YYYY-MM-DD"
          format="DD/MM/YYYY"
          :allow-clear="false"
          class="w-36!"
          @change="handleDateChange"
        />

        <div class="text-primary bg-primary/10 flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-semibold">
          <IconCalendar size="16" />
          <span class="capitalize">{{ formattedDateDisplay }}</span>
        </div>
      </div>

      <!-- View Mode Buttons (No Tables!) -->
      <div class="flex flex-wrap items-center gap-2">
        <div class="border-divider bg-bg inline-flex rounded border p-1 text-xs">
          <button
            :class="[
              'flex items-center gap-1.5 rounded px-3 py-1.5 font-medium transition-all',
              filters.viewMode === 'SHIFT_GRID'
                ? 'bg-primary text-white shadow-2xs'
                : 'text-text-muted hover:text-text hover:bg-surface',
            ]"
            @click="setViewMode('SHIFT_GRID')"
          >
            <IconLayoutGrid size="16" />
            <span>{{ t('schedule.viewMode.shiftGrid') }}</span>
          </button>
          <button
            :class="[
              'flex items-center gap-1.5 rounded px-3 py-1.5 font-medium transition-all',
              filters.viewMode === 'DOCTOR_ROSTER'
                ? 'bg-primary text-white shadow-2xs'
                : 'text-text-muted hover:text-text hover:bg-surface',
            ]"
            @click="setViewMode('DOCTOR_ROSTER')"
          >
            <IconUserCheck size="16" />
            <span>{{ t('schedule.viewMode.doctorRoster') }}</span>
          </button>
          <button
            :class="[
              'flex items-center gap-1.5 rounded px-3 py-1.5 font-medium transition-all',
              filters.viewMode === 'HOURLY_TIMELINE'
                ? 'bg-primary text-white shadow-2xs'
                : 'text-text-muted hover:text-text hover:bg-surface',
            ]"
            @click="setViewMode('HOURLY_TIMELINE')"
          >
            <IconClock size="16" />
            <span>{{ t('schedule.viewMode.hourlyTimeline') }}</span>
          </button>
        </div>

        <a-button type="primary" class="flex items-center gap-1.5" @click="emit('create-shift')">
          <IconPlus size="16" />
          <span>{{ t('schedule.addShift') }}</span>
        </a-button>
      </div>
    </div>

    <!-- Bottom Row: Filters -->
    <div class="border-divider grid grid-cols-1 gap-2.5 border-t pt-3 sm:grid-cols-2 lg:grid-cols-5">
      <!-- Search -->
      <a-input
        :value="filters.search"
        :placeholder="t('user.searchPlaceholder')"
        allow-clear
        class="w-full"
        @input="handleSearch"
      >
        <template #prefix>
          <IconSearch size="16" class="text-text-muted" />
        </template>
      </a-input>

      <!-- Shift period filter -->
      <a-select
        :value="filters.shiftType"
        :options="shiftTypeOptions"
        class="w-full"
        :placeholder="t('schedule.fields.shiftType')"
        @change="handleShiftTypeChange"
      />

      <!-- Department filter -->
      <a-select
        :value="filters.department"
        :options="departmentOptions"
        class="w-full"
        :placeholder="t('schedule.fields.department')"
        @change="handleDepartmentChange"
      />

      <!-- Status filter -->
      <a-select
        :value="filters.status"
        :options="statusOptions"
        class="w-full"
        :placeholder="t('schedule.fields.status')"
        @change="handleStatusChange"
      />

      <!-- Reset -->
      <a-button class="flex items-center justify-center gap-1.5" @click="handleReset">
        <IconRotate size="16" />
        <span>{{ t('reset') }}</span>
      </a-button>
    </div>
  </div>
</template>
