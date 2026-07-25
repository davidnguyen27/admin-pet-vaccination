<script setup lang="ts">
import {
  IconStethoscope,
  IconClock,
  IconBuildingStore,
  IconCalendar,
  IconNotes,
  IconPaw,
  IconUser,
} from '@tabler/icons-vue';
import { useLocale } from '@/shared/composables/useLocale';
import type { DoctorShift } from '@/shared/types/workingSchedule.type';

const props = defineProps<{
  open: boolean;
  shift?: DoctorShift | null;
}>();

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'edit'): void;
}>();

const { t } = useLocale();

const handleClose = () => {
  emit('update:open', false);
};
</script>

<template>
  <a-drawer :open="open" :title="t('schedule.shiftDetails')" width="540" placement="right" @close="handleClose">
    <div v-if="shift" class="space-y-5">
      <!-- Doctor Profile Card -->
      <div class="bg-bg border-divider flex items-center justify-between rounded border p-4">
        <div class="flex items-center gap-3">
          <a-avatar :src="shift.doctorAvatar" :size="52" class="border-divider shrink-0 border">
            <template #icon><IconStethoscope /></template>
          </a-avatar>
          <div class="flex flex-col">
            <span class="text-text text-base font-bold">{{ shift.doctorName }}</span>
            <span class="text-text-muted text-xs">{{ shift.doctorTitle }}</span>
            <span class="text-primary mt-0.5 text-xs font-medium">{{ shift.doctorSpecialization }}</span>
          </div>
        </div>

        <a-tag color="processing" class="mr-0! font-semibold">
          {{ t(`schedule.status.${shift.status}`) }}
        </a-tag>
      </div>

      <!-- Shift Info Grid -->
      <div class="bg-surface border-divider grid grid-cols-2 gap-3 rounded border p-3 text-xs">
        <div class="flex items-center gap-2">
          <IconCalendar size="16" class="text-primary" />
          <div class="flex flex-col">
            <span class="text-text-subtle text-2xs uppercase">Ngày trực</span>
            <span class="text-text font-bold">{{ shift.date }}</span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <IconClock size="16" class="text-primary" />
          <div class="flex flex-col">
            <span class="text-text-subtle text-2xs uppercase">Khung giờ</span>
            <span class="text-text font-mono font-bold">{{ shift.startTime }} - {{ shift.endTime }}</span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <IconBuildingStore size="16" class="text-primary" />
          <div class="flex flex-col">
            <span class="text-text-subtle text-2xs uppercase">Trạm / Phòng</span>
            <span class="text-text font-bold">{{ shift.roomName }}</span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <IconStethoscope size="16" class="text-primary" />
          <div class="flex flex-col">
            <span class="text-text-subtle text-2xs uppercase">Chuyên khoa</span>
            <span class="text-text font-bold">{{ t(`schedule.department.${shift.department}`) }}</span>
          </div>
        </div>
      </div>

      <!-- Capacity status -->
      <div class="bg-surface border-divider rounded border p-3">
        <div class="mb-1 flex items-center justify-between text-xs font-semibold">
          <span>Công suất tiêm chủng / khám:</span>
          <span class="text-primary font-mono font-bold">
            {{ shift.bookedCount }} / {{ shift.maxCapacity }} ca hẹn
          </span>
        </div>
        <a-progress
          :percent="Math.round((shift.bookedCount / shift.maxCapacity) * 100)"
          :stroke-color="shift.bookedCount >= shift.maxCapacity ? '#ef4444' : '#10b981'"
          size="small"
        />
      </div>

      <!-- Notes if any -->
      <div v-if="shift.notes" class="rounded border border-amber-200 bg-amber-50/60 p-3 text-xs text-amber-900">
        <div class="mb-1 flex items-center gap-1.5 font-bold">
          <IconNotes size="16" />
          <span>Ghi chú bàn giao & dặn dò:</span>
        </div>
        <p class="leading-relaxed">{{ shift.notes }}</p>
      </div>

      <!-- Appointments List Queue -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <h4 class="text-text flex items-center gap-1.5 text-sm font-bold">
            <IconPaw size="18" class="text-primary" />
            <span>Danh sách ca tiêm / khám phân công ({{ shift.appointments?.length || 0 }})</span>
          </h4>
        </div>

        <div
          v-if="!shift.appointments || shift.appointments.length === 0"
          class="bg-bg border-divider text-text-subtle rounded border p-6 text-center text-xs"
        >
          Chưa có ca hẹn nào được tiếp nhận trong khung giờ này.
        </div>

        <div v-else class="space-y-2.5">
          <div
            v-for="app in shift.appointments"
            :key="app.id"
            class="bg-bg border-divider hover:border-primary/40 flex flex-col gap-2 rounded border p-3 text-xs transition-colors"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-primary bg-primary/10 text-2xs rounded px-2 py-0.5 font-mono font-bold">
                  {{ app.timeSlot }}
                </span>
                <span class="text-text text-sm font-bold">{{ app.petName }}</span>
                <span class="text-text-muted text-2xs">({{ app.species }})</span>
              </div>

              <a-tag :color="app.status === 'CHECKED_IN' ? 'processing' : 'default'">
                {{ app.status === 'CHECKED_IN' ? 'Đã Check-in' : 'Chờ khám' }}
              </a-tag>
            </div>

            <div class="text-text-muted border-divider/60 flex items-center justify-between border-t pt-2">
              <div class="flex items-center gap-1.5">
                <IconUser size="14" class="text-text-subtle" />
                <span>{{ app.ownerName }}</span>
                <span class="font-mono">({{ app.ownerPhone }})</span>
              </div>
              <span class="text-text font-medium">{{ app.serviceName }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-between">
        <a-button @click="handleClose">{{ t('cancel') }}</a-button>
        <a-button type="primary" @click="emit('edit')">
          {{ t('schedule.editShift') }}
        </a-button>
      </div>
    </template>
  </a-drawer>
</template>
