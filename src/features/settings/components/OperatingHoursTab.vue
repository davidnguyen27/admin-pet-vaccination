<script setup lang="ts">
import { reactive, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { IconClock, IconSun, IconSunHigh, IconUsers, IconDeviceFloppy } from '@tabler/icons-vue';
import { useLocale } from '@/shared/composables/useLocale';
import { useSettingsStore } from '@/store/settingsStore';
import { message } from 'ant-design-vue';

const { t } = useLocale();
const settingsStore = useSettingsStore();
const { operatingHours, saving } = storeToRefs(settingsStore);

const formState = reactive({ ...operatingHours.value });

watch(
  operatingHours,
  newVal => {
    Object.assign(formState, newVal);
  },
  { deep: true },
);

const dayOptions = [
  { label: 'Thứ 2', value: 'MONDAY' },
  { label: 'Thứ 3', value: 'TUESDAY' },
  { label: 'Thứ 4', value: 'WEDNESDAY' },
  { label: 'Thứ 5', value: 'THURSDAY' },
  { label: 'Thứ 6', value: 'FRIDAY' },
  { label: 'Thứ 7', value: 'SATURDAY' },
  { label: 'Chủ Nhật', value: 'SUNDAY' },
];

const handleSubmit = async () => {
  settingsStore.updateOperatingHours(formState);
  const res = await settingsStore.saveAllSettings();
  if (res.success) {
    message.success(t('success'));
  }
};
</script>

<template>
  <div class="bg-surface border-divider rounded border p-5 shadow-2xs">
    <div class="mb-6 flex items-center gap-3">
      <div class="bg-primary/10 text-primary flex size-10 items-center justify-center rounded">
        <IconClock size="22" />
      </div>
      <div>
        <h2 class="text-text text-base font-bold">Giờ Mở cửa & Cấu hình Ca làm việc</h2>
        <p class="text-text-muted text-xs">Cấu hình khung giờ nhận lịch tiêm, các ca trực mặc định và ngày nghỉ cố định.</p>
      </div>
    </div>

    <a-form layout="vertical" class="max-w-3xl space-y-5" @finish="handleSubmit">
      <!-- Standard Working Hours -->
      <div class="border-divider bg-bg/50 rounded border p-4">
        <div class="mb-3 flex items-center gap-2 text-sm font-semibold">
          <IconClock size="18" class="text-primary" />
          <span>Thời gian mở cửa đón khách tổng thể</span>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <a-form-item label="Giờ mở cửa" required>
            <a-input v-model:value="formState.openingTime" placeholder="07:30" size="large" />
          </a-form-item>
          <a-form-item label="Giờ đóng cửa" required>
            <a-input v-model:value="formState.closingTime" placeholder="17:30" size="large" />
          </a-form-item>
        </div>
      </div>

      <!-- Shift Intervals -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <!-- Morning Shift -->
        <div class="border-divider bg-bg/50 rounded border p-4">
          <div class="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-700">
            <IconSun size="18" />
            <span>Ca Sáng (Morning Shift)</span>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <a-form-item label="Bắt đầu">
              <a-input v-model:value="formState.morningShiftStart" placeholder="07:30" />
            </a-form-item>
            <a-form-item label="Kết thúc">
              <a-input v-model:value="formState.morningShiftEnd" placeholder="11:30" />
            </a-form-item>
          </div>
        </div>

        <!-- Afternoon Shift -->
        <div class="border-divider bg-bg/50 rounded border p-4">
          <div class="mb-3 flex items-center gap-2 text-sm font-semibold text-orange-700">
            <IconSunHigh size="18" />
            <span>Ca Chiều (Afternoon Shift)</span>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <a-form-item label="Bắt đầu">
              <a-input v-model:value="formState.afternoonShiftStart" placeholder="13:00" />
            </a-form-item>
            <a-form-item label="Kết thúc">
              <a-input v-model:value="formState.afternoonShiftEnd" placeholder="17:00" />
            </a-form-item>
          </div>
        </div>
      </div>

      <!-- Capacity & Off days -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <a-form-item label="Công suất tiếp nhận tối đa mỗi ca (khách/ca/bác sĩ)" required>
          <a-input-number v-model:value="formState.maxCapacityPerSlot" :min="1" :max="50" class="w-full" size="large">
            <template #prefix><IconUsers size="16" class="text-text-muted" /></template>
          </a-input-number>
        </a-form-item>

        <a-form-item label="Ngày nghỉ cố định hàng tuần">
          <a-checkbox-group v-model:value="formState.closedDays" :options="dayOptions" class="mt-2" />
        </a-form-item>
      </div>

      <!-- Submit Footer -->
      <div class="border-divider mt-6 flex justify-end border-t pt-4">
        <a-button type="primary" html-type="submit" size="large" class="flex items-center gap-2" :loading="saving">
          <IconDeviceFloppy size="18" />
          <span>{{ t('save') }}</span>
        </a-button>
      </div>
    </a-form>
  </div>
</template>
