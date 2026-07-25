<script setup lang="ts">
import { reactive, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useLocale } from '@/shared/composables/useLocale';
import { useWorkingScheduleStore } from '@/store/workingScheduleStore';
import type { DoctorShift, ShiftType, DepartmentCategory, ShiftStatus } from '@/shared/types/workingSchedule.type';

const props = defineProps<{
  open: boolean;
  shift?: DoctorShift | null;
  initialDoctorId?: string;
}>();

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'saved'): void;
}>();

const { t } = useLocale();
const scheduleStore = useWorkingScheduleStore();
const { doctors, loading } = storeToRefs(scheduleStore);

const formState = reactive({
  doctorId: '',
  date: '2026-07-24',
  shiftType: 'MORNING' as ShiftType,
  startTime: '07:30',
  endTime: '11:30',
  roomCode: 'RM-VAC-01',
  roomName: 'Phòng Tiêm chủng #01',
  department: 'VACCINATION' as DepartmentCategory,
  maxCapacity: 12,
  status: 'SCHEDULED' as ShiftStatus,
  notes: '',
});

const roomOptions = [
  { code: 'RM-VAC-01', name: 'Phòng Tiêm chủng #01', dept: 'VACCINATION' },
  { code: 'RM-VAC-02', name: 'Phòng Tiêm chủng #02', dept: 'VACCINATION' },
  { code: 'RM-EXAM-02', name: 'Phòng Khám Lâm sàng #02', dept: 'GENERAL_EXAM' },
  { code: 'RM-SURG-A', name: 'Phòng Phẫu thuật Vô trùng A', dept: 'SURGERY' },
];

watch(
  () => props.open,
  isOpen => {
    if (isOpen) {
      if (props.shift) {
        formState.doctorId = props.shift.doctorId;
        formState.date = props.shift.date;
        formState.shiftType = props.shift.shiftType;
        formState.startTime = props.shift.startTime;
        formState.endTime = props.shift.endTime;
        formState.roomCode = props.shift.roomCode;
        formState.roomName = props.shift.roomName;
        formState.department = props.shift.department;
        formState.maxCapacity = props.shift.maxCapacity;
        formState.status = props.shift.status;
        formState.notes = props.shift.notes || '';
      } else {
        formState.doctorId = props.initialDoctorId || (doctors.value[0]?.id ?? '');
        formState.date = scheduleStore.filters.date || '2026-07-24';
        formState.shiftType = 'MORNING';
        formState.startTime = '07:30';
        formState.endTime = '11:30';
        formState.roomCode = 'RM-VAC-01';
        formState.roomName = 'Phòng Tiêm chủng #01';
        formState.department = 'VACCINATION';
        formState.maxCapacity = 12;
        formState.status = 'SCHEDULED';
        formState.notes = '';
      }
    }
  },
);

const handleShiftTypeSelect = (val: ShiftType) => {
  formState.shiftType = val;
  if (val === 'MORNING') {
    formState.startTime = '07:30';
    formState.endTime = '11:30';
  } else if (val === 'AFTERNOON') {
    formState.startTime = '13:00';
    formState.endTime = '17:00';
  }
};

const handleRoomSelect = (code: string) => {
  const room = roomOptions.find(r => r.code === code);
  if (room) {
    formState.roomCode = room.code;
    formState.roomName = room.name;
    formState.department = room.dept as DepartmentCategory;
  }
};

const handleClose = () => {
  emit('update:open', false);
};

const handleSubmit = async () => {
  if (props.shift) {
    await scheduleStore.updateShift(props.shift.id, formState);
  } else {
    await scheduleStore.createShift(formState);
  }
  emit('saved');
  handleClose();
};
</script>

<template>
  <a-drawer
    :open="open"
    :title="props.shift ? t('schedule.editShift') : t('schedule.addShift')"
    width="480"
    placement="right"
    @close="handleClose"
  >
    <a-form layout="vertical" class="space-y-4" @finish="handleSubmit">
      <!-- Doctor -->
      <a-form-item :label="t('schedule.fields.doctor')" required>
        <a-select v-model:value="formState.doctorId" class="w-full">
          <a-select-option v-for="d in doctors" :key="d.id" :value="d.id">
            {{ d.name }} ({{ d.title }})
          </a-select-option>
        </a-select>
      </a-form-item>

      <!-- Date -->
      <a-form-item :label="t('schedule.fields.date')" required>
        <a-date-picker v-model:value="formState.date" value-format="YYYY-MM-DD" format="DD/MM/YYYY" class="w-full" />
      </a-form-item>

      <!-- Shift Period -->
      <a-form-item :label="t('schedule.fields.shiftType')" required>
        <a-select :value="formState.shiftType" class="w-full" @change="handleShiftTypeSelect">
          <a-select-option value="MORNING">{{ t('schedule.shiftType.MORNING') }} (07:30 - 11:30)</a-select-option>
          <a-select-option value="AFTERNOON">{{ t('schedule.shiftType.AFTERNOON') }} (13:00 - 17:00)</a-select-option>
        </a-select>
      </a-form-item>

      <!-- Time slot -->
      <div class="grid grid-cols-2 gap-3">
        <a-form-item label="Giờ bắt đầu" required>
          <a-input v-model:value="formState.startTime" placeholder="07:30" />
        </a-form-item>
        <a-form-item label="Giờ kết thúc" required>
          <a-input v-model:value="formState.endTime" placeholder="11:30" />
        </a-form-item>
      </div>

      <!-- Room / Station -->
      <a-form-item :label="t('schedule.fields.room')" required>
        <a-select :value="formState.roomCode" class="w-full" @change="handleRoomSelect">
          <a-select-option v-for="r in roomOptions" :key="r.code" :value="r.code">
            {{ r.name }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <!-- Department -->
      <a-form-item :label="t('schedule.fields.department')" required>
        <a-select v-model:value="formState.department" class="w-full">
          <a-select-option value="VACCINATION">{{ t('schedule.department.VACCINATION') }}</a-select-option>
          <a-select-option value="GENERAL_EXAM">{{ t('schedule.department.GENERAL_EXAM') }}</a-select-option>
          <a-select-option value="SURGERY">{{ t('schedule.department.SURGERY') }}</a-select-option>
        </a-select>
      </a-form-item>

      <!-- Max capacity -->
      <a-form-item :label="t('schedule.fields.maxCapacity')" required>
        <a-input-number v-model:value="formState.maxCapacity" :min="1" :max="50" class="w-full" />
      </a-form-item>

      <!-- Status -->
      <a-form-item :label="t('schedule.fields.status')" required>
        <a-select v-model:value="formState.status" class="w-full">
          <a-select-option value="SCHEDULED">{{ t('schedule.status.SCHEDULED') }}</a-select-option>
          <a-select-option value="IN_PROGRESS">{{ t('schedule.status.IN_PROGRESS') }}</a-select-option>
          <a-select-option value="COMPLETED">{{ t('schedule.status.COMPLETED') }}</a-select-option>
          <a-select-option value="OFF">{{ t('schedule.status.OFF') }}</a-select-option>
        </a-select>
      </a-form-item>

      <!-- Notes -->
      <a-form-item :label="t('schedule.fields.notes')">
        <a-textarea v-model:value="formState.notes" :rows="3" placeholder="Ghi chú dặn dò hoặc lưu ý ca trực..." />
      </a-form-item>

      <!-- Submit Footer -->
      <div class="border-divider mt-6 flex items-center justify-end gap-2 border-t pt-4">
        <a-button @click="handleClose">{{ t('cancel') }}</a-button>
        <a-button type="primary" html-type="submit" :loading="loading">
          {{ t('save') }}
        </a-button>
      </div>
    </a-form>
  </a-drawer>
</template>
