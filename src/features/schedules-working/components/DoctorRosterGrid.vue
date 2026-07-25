<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import {
  IconStethoscope,
  IconPhone,
  IconMail,
  IconBuildingStore,
  IconClock,
  IconCalendarPlus,
  IconChevronRight,
  IconSun,
  IconSunHigh,
} from '@tabler/icons-vue';
import { useLocale } from '@/shared/composables/useLocale';
import { useWorkingScheduleStore } from '@/store/workingScheduleStore';
import type { DoctorShift } from '@/shared/types/workingSchedule.type';

const emit = defineEmits<{
  (e: 'add-shift-for-doctor', doctorId: string): void;
  (e: 'view-shift', shift: DoctorShift): void;
}>();

const router = useRouter();
const { t } = useLocale();
const scheduleStore = useWorkingScheduleStore();
const { doctors, filteredShifts, loading } = storeToRefs(scheduleStore);

const handleGoToDoctorDetail = (docId: string) => {
  router.push(`/schedules-working/doctors/${docId}`);
};

const handleGoToShiftDetail = (shiftId: string) => {
  router.push(`/schedules-working/shifts/${shiftId}`);
};

const doctorRosters = computed(() => {
  return doctors.value.map(doctor => {
    const docShifts = filteredShifts.value.filter(s => s.doctorId === doctor.id);
    const totalBooked = docShifts.reduce((acc, curr) => acc + curr.bookedCount, 0);
    const totalCapacity = docShifts.reduce((acc, curr) => acc + curr.maxCapacity, 0);

    return {
      doctor,
      shifts: docShifts,
      totalBooked,
      totalCapacity,
    };
  });
});

const getShiftIcon = (type: string) => {
  switch (type) {
    case 'MORNING':
      return IconSun;
    case 'AFTERNOON':
      return IconSunHigh;
    default:
      return IconClock;
  }
};
</script>

<template>
  <a-spin :spinning="loading">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="item in doctorRosters"
        :key="item.doctor.id"
        class="bg-surface border-divider hover:border-primary/50 flex flex-col justify-between rounded border p-4 shadow-2xs transition-all"
      >
        <div>
          <!-- Doctor Header -->
          <div class="group flex cursor-pointer items-start gap-3" @click="handleGoToDoctorDetail(item.doctor.id)">
            <a-avatar
              :src="item.doctor.avatar"
              :size="54"
              class="border-divider group-hover:border-primary shrink-0 border"
            >
              <template #icon><IconStethoscope /></template>
            </a-avatar>

            <div class="flex min-w-0 flex-1 flex-col">
              <div class="flex items-center justify-between">
                <span
                  class="text-text group-hover:text-primary truncate text-sm font-bold transition-colors"
                  :title="item.doctor.name"
                >
                  {{ item.doctor.name }}
                </span>
                <a-tag color="success" class="text-2xs mr-0!">
                  {{ item.doctor.status === 'ACTIVE' ? 'Đang làm việc' : 'Nghỉ phép' }}
                </a-tag>
              </div>

              <span class="text-text-muted mt-0.5 truncate text-xs" :title="item.doctor.title">
                {{ item.doctor.title }}
              </span>

              <span class="text-primary mt-0.5 truncate text-xs font-medium" :title="item.doctor.specialization">
                {{ item.doctor.specialization }}
              </span>
            </div>
          </div>

          <!-- Contact details -->
          <div class="border-divider text-text-muted mt-3 grid grid-cols-1 gap-1 border-t pt-2.5 text-xs">
            <div class="flex items-center gap-1.5">
              <IconPhone size="14" class="text-text-subtle" />
              <span>{{ item.doctor.phone }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <IconMail size="14" class="text-text-subtle" />
              <span class="truncate">{{ item.doctor.email }}</span>
            </div>
            <div v-if="item.doctor.assignedRoom" class="text-text mt-0.5 flex items-center gap-1.5 font-medium">
              <IconBuildingStore size="14" class="text-primary" />
              <span>Trạm chính: {{ item.doctor.assignedRoom }}</span>
            </div>
          </div>

          <!-- Shifts Assigned Today -->
          <div class="border-divider mt-4 border-t pt-3">
            <div class="text-text mb-2 flex items-center justify-between text-xs font-semibold">
              <span>Ca trực trong ngày ({{ item.shifts.length }})</span>
              <span v-if="item.totalCapacity > 0" class="text-text-muted text-2xs font-mono">
                Tổng ca: {{ item.totalBooked }}/{{ item.totalCapacity }}
              </span>
            </div>

            <div
              v-if="item.shifts.length === 0"
              class="bg-bg text-text-subtle border-divider rounded border p-2.5 text-center text-xs"
            >
              Chưa phân ca trực cho ngày này
            </div>

            <div v-else class="space-y-2">
              <div
                v-for="s in item.shifts"
                :key="s.id"
                class="bg-bg hover:bg-surface border-divider flex cursor-pointer items-center justify-between rounded border p-2 text-xs transition-colors"
                @click="handleGoToShiftDetail(s.id)"
              >
                <div class="flex items-center gap-2">
                  <component :is="getShiftIcon(s.shiftType)" size="16" class="text-primary" />
                  <div class="flex flex-col">
                    <span class="text-text font-medium">{{ t(`schedule.shiftType.${s.shiftType}`) }}</span>
                    <span class="text-2xs text-text-muted font-mono"
                      >{{ s.startTime }} - {{ s.endTime }} | {{ s.roomName }}</span
                    >
                  </div>
                </div>

                <div class="flex items-center gap-1">
                  <a-badge
                    :count="`${s.bookedCount}/${s.maxCapacity}`"
                    :number-style="{
                      backgroundColor: s.bookedCount >= s.maxCapacity ? '#ef4444' : '#059669',
                      fontSize: '10px',
                    }"
                  />
                  <IconChevronRight size="14" class="text-text-subtle" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action footer -->
        <div class="border-divider mt-4 flex items-center justify-end border-t pt-3">
          <a-button
            type="dashed"
            size="small"
            class="flex items-center gap-1 text-xs"
            @click="emit('add-shift-for-doctor', item.doctor.id)"
          >
            <IconCalendarPlus size="14" />
            <span>Phân ca mới</span>
          </a-button>
        </div>
      </div>
    </div>
  </a-spin>
</template>
