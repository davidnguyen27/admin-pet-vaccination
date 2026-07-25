<script setup lang="ts">
import { reactive, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { IconBell, IconAlertTriangle, IconCalendar, IconVolume, IconMail, IconDeviceFloppy } from '@tabler/icons-vue';
import { useLocale } from '@/shared/composables/useLocale';
import { useSettingsStore } from '@/store/settingsStore';
import { message } from 'ant-design-vue';

const { t } = useLocale();
const settingsStore = useSettingsStore();
const { notifications, saving } = storeToRefs(settingsStore);

const formState = reactive({ ...notifications.value });

watch(
  notifications,
  newVal => {
    Object.assign(formState, newVal);
  },
  { deep: true },
);

const handleSubmit = async () => {
  settingsStore.updateNotificationSettings(formState);
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
        <IconBell size="22" />
      </div>
      <div>
        <h2 class="text-text text-base font-bold">Cảnh báo Tồn kho & Thông báo Hệ thống</h2>
        <p class="text-text-muted text-xs">Cấu hình các ngưỡng cảnh báo vắc-xin sắp hết, hết hạn và âm thanh thông báo.</p>
      </div>
    </div>

    <a-form layout="vertical" class="max-w-3xl space-y-5" @finish="handleSubmit">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <!-- Low stock threshold -->
        <a-form-item label="Ngưỡng cảnh báo lô vắc-xin sắp hết (liều)" required>
          <a-input-number v-model:value="formState.lowStockThresholdDoses" :min="1" :max="500" class="w-full" size="large">
            <template #prefix><IconAlertTriangle size="16" class="text-amber-500" /></template>
          </a-input-number>
        </a-form-item>

        <!-- Expiring threshold -->
        <a-form-item label="Cảnh báo trước lô vắc-xin sắp hết hạn (ngày)" required>
          <a-input-number v-model:value="formState.expiringVaccineAlertDays" :min="1" :max="180" class="w-full" size="large">
            <template #prefix><IconCalendar size="16" class="text-error" /></template>
          </a-input-number>
        </a-form-item>
      </div>

      <!-- System alert email recipients -->
      <a-form-item label="Email nhận báo cáo & cảnh báo tồn kho tự động">
        <a-input v-model:value="formState.emailAlertRecipients" placeholder="email1@domain.com, email2@domain.com" size="large">
          <template #prefix><IconMail size="16" class="text-text-muted" /></template>
        </a-input>
      </a-form-item>

      <!-- Audio sound alert toggle -->
      <div class="border-divider bg-bg/50 flex items-center justify-between rounded border p-4">
        <div class="flex items-center gap-3">
          <IconVolume size="20" class="text-primary" />
          <div>
            <span class="text-text block text-sm font-medium">Bật âm thanh cảnh báo hệ thống</span>
            <span class="text-text-muted text-xs">Phát âm thanh chuông báo khi có ca hẹn mới hoặc có cảnh báo kho khẩn cấp.</span>
          </div>
        </div>
        <a-switch v-model:checked="formState.enableSoundAlerts" />
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
