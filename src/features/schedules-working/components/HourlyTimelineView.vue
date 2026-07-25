<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { IconBuildingStore, IconStethoscope } from '@tabler/icons-vue';
import { useWorkingScheduleStore } from '@/store/workingScheduleStore';
import type { DoctorShift } from '@/shared/types/workingSchedule.type';

const emit = defineEmits<{
  (e: 'view-shift', shift: DoctorShift): void;
}>();

const router = useRouter();
const scheduleStore = useWorkingScheduleStore();
const { filteredShifts, loading } = storeToRefs(scheduleStore);

const handleGoToShiftDetail = (shiftId: string) => {
  router.push(`/schedules-working/shifts/${shiftId}`);
};

const hours = [
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
];

const stationRows = computed(() => {
  const stationsMap = new Map<string, { code: string; name: string; shifts: DoctorShift[] }>();

  // Pre-populate standard clinic rooms
  const defaultStations = [
    { code: 'RM-VAC-01', name: 'Phòng Tiêm chủng #01' },
    { code: 'RM-VAC-02', name: 'Phòng Tiêm chủng #02' },
    { code: 'RM-EXAM-02', name: 'Phòng Khám Lâm sàng #02' },
    { code: 'RM-SURG-A', name: 'Phòng Phẫu thuật Vô trùng A' },
  ];

  defaultStations.forEach(st => {
    stationsMap.set(st.code, { ...st, shifts: [] });
  });

  filteredShifts.value.forEach(shift => {
    if (!stationsMap.has(shift.roomCode)) {
      stationsMap.set(shift.roomCode, {
        code: shift.roomCode,
        name: shift.roomName,
        shifts: [],
      });
    }
    stationsMap.get(shift.roomCode)?.shifts.push(shift);
  });

  return Array.from(stationsMap.values());
});

const calculateShiftPosition = (shift: DoctorShift) => {
  const startParts = shift.startTime.split(':').map(Number);
  const startHour = startParts[0] ?? 7;
  const startMin = startParts[1] ?? 0;

  const endParts = shift.endTime.split(':').map(Number);
  const endHour = endParts[0] ?? 11;
  const endMin = endParts[1] ?? 30;

  const dayStartMinute = 7 * 60; // 07:00
  const dayTotalMinutes = 15 * 60; // 07:00 to 22:00 = 900 minutes

  const shiftStartMinute = Math.max(0, startHour * 60 + startMin - dayStartMinute);

  let shiftEndMinute = endHour * 60 + endMin - dayStartMinute;
  if (shiftEndMinute <= shiftStartMinute) {
    shiftEndMinute = dayTotalMinutes;
  }

  const leftPercent = Math.max(0, Math.min(100, (shiftStartMinute / dayTotalMinutes) * 100));
  const widthPercent = Math.max(
    8,
    Math.min(100 - leftPercent, ((shiftEndMinute - shiftStartMinute) / dayTotalMinutes) * 100),
  );

  return {
    left: `${leftPercent}%`,
    width: `${widthPercent}%`,
  };
};

const getShiftColorClass = (shiftType: string) => {
  switch (shiftType) {
    case 'MORNING':
      return 'bg-amber-500/90 hover:bg-amber-600 text-white border-amber-600';
    case 'AFTERNOON':
      return 'bg-orange-500/90 hover:bg-orange-600 text-white border-orange-600';
    default:
      return 'bg-emerald-600 text-white';
  }
};
</script>

<template>
  <a-spin :spinning="loading">
    <div class="bg-surface border-divider overflow-x-auto rounded border p-4 shadow-2xs">
      <div class="min-w-[900px]">
        <!-- Timeline Header Hour Labels -->
        <div class="border-divider mb-3 flex border-b pb-2">
          <div
            class="text-text-muted flex w-64 shrink-0 items-center gap-1.5 text-xs font-bold tracking-wider uppercase"
          >
            <IconBuildingStore size="16" class="text-primary" />
            <span>Trạm / Phòng khám</span>
          </div>

          <div class="text-text-subtle grid flex-1 grid-cols-15 text-center font-mono text-xs font-semibold">
            <span v-for="h in hours" :key="h">{{ h }}</span>
          </div>
        </div>

        <!-- Station Rows -->
        <div class="space-y-4">
          <div
            v-for="station in stationRows"
            :key="station.code"
            class="border-divider/60 flex items-center gap-3 border-b pb-3 last:border-b-0"
          >
            <!-- Station Label Block -->
            <div class="bg-bg border-divider flex w-64 shrink-0 flex-col rounded border p-2.5">
              <span class="text-text truncate text-xs font-bold" :title="station.name">
                {{ station.name }}
              </span>
              <span class="text-text-subtle text-2xs font-mono">{{ station.code }}</span>
            </div>

            <!-- Timeline Bar Area -->
            <div class="bg-bg/70 border-divider/70 relative h-12 flex-1 overflow-hidden rounded border">
              <!-- Grid line markers -->
              <div class="pointer-events-none absolute inset-0 grid grid-cols-15">
                <div v-for="h in hours" :key="h" class="border-divider/30 h-full border-r"></div>
              </div>

              <!-- Shift Blocks -->
              <div
                v-for="shift in station.shifts"
                :key="shift.id"
                :style="calculateShiftPosition(shift)"
                :class="[
                  'absolute top-1 bottom-1 flex cursor-pointer items-center justify-between overflow-hidden rounded border px-2.5 py-1 text-xs shadow-xs transition-all',
                  getShiftColorClass(shift.shiftType),
                ]"
                @click="handleGoToShiftDetail(shift.id)"
              >
                <div class="flex min-w-0 items-center gap-1.5">
                  <IconStethoscope size="14" class="shrink-0" />
                  <span class="truncate text-xs font-semibold">{{ shift.doctorName }}</span>
                </div>

                <div class="ml-1 flex shrink-0 items-center gap-1">
                  <span class="text-2xs font-mono opacity-90">{{ shift.startTime }}-{{ shift.endTime }}</span>
                  <span class="text-2xs rounded bg-black/20 px-1.5 py-0.5 font-mono font-bold">
                    {{ shift.bookedCount }}/{{ shift.maxCapacity }}
                  </span>
                </div>
              </div>

              <!-- Empty indicator if no shifts -->
              <div
                v-if="station.shifts.length === 0"
                class="text-text-subtle absolute inset-0 flex items-center justify-center text-xs italic"
              >
                Trống ca trực
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-spin>
</template>
