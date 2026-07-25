<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import {
  IconClock,
  IconBuildingStore,
  IconStethoscope,
  IconEdit,
  IconTrash,
  IconEye,
  IconNotes,
  IconSun,
  IconSunHigh,
  IconAlertCircle,
} from '@tabler/icons-vue';
import { useLocale } from '@/shared/composables/useLocale';
import { useWorkingScheduleStore } from '@/store/workingScheduleStore';
import type { DoctorShift, ShiftType } from '@/shared/types/workingSchedule.type';

const emit = defineEmits<{
  (e: 'view-shift', shift: DoctorShift): void;
  (e: 'edit-shift', shift: DoctorShift): void;
}>();

const router = useRouter();
const { t } = useLocale();
const scheduleStore = useWorkingScheduleStore();
const { filteredShifts, loading } = storeToRefs(scheduleStore);

const handleGoToShiftDetail = (shiftId: string) => {
  router.push(`/schedules-working/shifts/${shiftId}`);
};

const shiftGroups = computed(() => {
  const groups: Array<{
    key: ShiftType;
    title: string;
    timeRange: string;
    icon: unknown;
    colorClass: string;
    items: DoctorShift[];
  }> = [
    {
      key: 'MORNING',
      title: t('schedule.shiftType.MORNING'),
      timeRange: '07:30 - 11:30',
      icon: IconSun,
      colorClass: 'border-l-amber-500 bg-amber-50/40 text-amber-800',
      items: [],
    },
    {
      key: 'AFTERNOON',
      title: t('schedule.shiftType.AFTERNOON'),
      timeRange: '13:00 - 17:00',
      icon: IconSunHigh,
      colorClass: 'border-l-orange-500 bg-orange-50/40 text-orange-800',
      items: [],
    },
  ];

  filteredShifts.value.forEach(shift => {
    const grp = groups.find(g => g.key === shift.shiftType);
    if (grp) {
      grp.items.push(shift);
    }
  });

  return groups;
});

const getDepartmentTagColor = (dept: string) => {
  switch (dept) {
    case 'VACCINATION':
      return 'blue';
    case 'GENERAL_EXAM':
      return 'cyan';
    case 'SURGERY':
      return 'purple';
    default:
      return 'default';
  }
};

const getStatusTagColor = (status: string) => {
  switch (status) {
    case 'IN_PROGRESS':
      return 'processing';
    case 'SCHEDULED':
      return 'default';
    case 'COMPLETED':
      return 'success';
    case 'CANCELLED':
      return 'error';
    case 'OFF':
      return 'warning';
    default:
      return 'default';
  }
};

const handleDelete = async (id: string) => {
  await scheduleStore.deleteShift(id);
};
</script>

<template>
  <div class="space-y-6">
    <a-spin :spinning="loading">
      <div
        v-if="filteredShifts.length === 0"
        class="bg-surface border-divider flex flex-col items-center justify-center rounded border py-12 text-center shadow-2xs"
      >
        <IconAlertCircle size="48" class="text-text-muted mb-2 stroke-1" />
        <span class="text-text text-base font-medium">Không tìm thấy ca trực nào</span>
        <span class="text-text-muted mt-1 text-xs">Vui lòng thay đổi bộ lọc hoặc thêm ca trực mới cho bác sĩ.</span>
      </div>

      <div v-else class="space-y-6">
        <div v-for="group in shiftGroups" :key="group.key" class="space-y-3">
          <!-- Group Section Header -->
          <div
            v-if="group.items.length > 0"
            :class="['flex items-center justify-between rounded-r border-l-4 px-4 py-2.5 shadow-2xs', group.colorClass]"
          >
            <div class="flex items-center gap-2 text-sm font-bold">
              <component :is="group.icon" size="20" />
              <span>{{ group.title }}</span>
              <span class="text-xs font-normal opacity-75">({{ group.timeRange }})</span>
            </div>
            <a-badge :count="group.items.length" :number-style="{ backgroundColor: '#059669' }" />
          </div>

          <!-- Cards Grid for Group -->
          <div v-if="group.items.length > 0" class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div
              v-for="shift in group.items"
              :key="shift.id"
              class="bg-surface border-divider hover:border-primary/50 flex flex-col justify-between rounded border p-4 shadow-2xs transition-all hover:shadow-xs"
            >
              <!-- Doctor Info Header -->
              <div>
                <div class="flex items-start justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <a-avatar :src="shift.doctorAvatar" :size="48" class="border-divider shrink-0 border">
                      <template #icon><IconStethoscope /></template>
                    </a-avatar>
                    <div class="flex min-w-0 flex-col">
                      <span class="text-text truncate text-sm font-bold" :title="shift.doctorName">
                        {{ shift.doctorName }}
                      </span>
                      <span class="text-text-muted truncate text-xs" :title="shift.doctorTitle">
                        {{ shift.doctorTitle }}
                      </span>
                    </div>
                  </div>

                  <a-tag :color="getStatusTagColor(shift.status)" class="mr-0!">
                    {{ t(`schedule.status.${shift.status}`) }}
                  </a-tag>
                </div>

                <!-- Room & Department badges -->
                <div class="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <div
                    class="bg-bg border-divider text-text inline-flex items-center gap-1 rounded border px-2.5 py-1 font-medium"
                  >
                    <IconBuildingStore size="14" class="text-primary" />
                    <span>{{ shift.roomName }}</span>
                  </div>

                  <a-tag :color="getDepartmentTagColor(shift.department)" class="mr-0!">
                    {{ t(`schedule.department.${shift.department}`) }}
                  </a-tag>

                  <div class="text-text-subtle ml-auto inline-flex items-center gap-1 font-mono">
                    <IconClock size="14" />
                    <span>{{ shift.startTime }} - {{ shift.endTime }}</span>
                  </div>
                </div>

                <!-- Capacity Progress Bar -->
                <div class="border-divider mt-3 border-t pt-3">
                  <div class="mb-1 flex items-center justify-between text-xs">
                    <span class="text-text-muted font-medium">Tải lịch tiêm / khám:</span>
                    <span class="text-text font-mono font-bold">
                      {{ shift.bookedCount }} / {{ shift.maxCapacity }} ca
                    </span>
                  </div>
                  <a-progress
                    :percent="Math.round((shift.bookedCount / shift.maxCapacity) * 100)"
                    :status="shift.bookedCount >= shift.maxCapacity ? 'exception' : 'active'"
                    :stroke-color="shift.bookedCount >= shift.maxCapacity ? '#ef4444' : '#10b981'"
                    :show-info="false"
                    size="small"
                  />
                </div>

                <!-- Notes if any -->
                <div
                  v-if="shift.notes"
                  class="bg-bg text-text-muted border-divider mt-3 flex items-start gap-1.5 rounded border p-2 text-xs"
                >
                  <IconNotes size="14" class="text-text-subtle mt-0.5 shrink-0" />
                  <span class="line-clamp-2">{{ shift.notes }}</span>
                </div>
              </div>

              <!-- Card Action Bar -->
              <div class="border-divider mt-4 flex items-center justify-between border-t pt-3">
                <a-button
                  type="link"
                  size="small"
                  class="flex items-center gap-1 p-0! text-xs"
                  @click="handleGoToShiftDetail(shift.id)"
                >
                  <IconEye size="15" />
                  <span>Danh sách lịch hẹn ({{ shift.appointments?.length || 0 }})</span>
                </a-button>

                <div class="flex items-center gap-1">
                  <a-button
                    type="text"
                    size="small"
                    class="text-text-muted hover:text-primary"
                    @click="emit('edit-shift', shift)"
                  >
                    <IconEdit size="16" />
                  </a-button>
                  <a-popconfirm
                    :title="t('schedule.deleteConfirm')"
                    ok-text="Xóa"
                    cancel-text="Hủy"
                    @confirm="handleDelete(shift.id)"
                  >
                    <a-button type="text" danger size="small">
                      <IconTrash size="16" />
                    </a-button>
                  </a-popconfirm>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>
