<script setup lang="ts">
import { reactive, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { IconVaccine, IconBell, IconMessage, IconMail, IconDeviceMobile, IconDeviceFloppy } from '@tabler/icons-vue';
import { useLocale } from '@/shared/composables/useLocale';
import { useSettingsStore } from '@/store/settingsStore';
import { message } from 'ant-design-vue';

const { t } = useLocale();
const settingsStore = useSettingsStore();
const { vaccination, saving } = storeToRefs(settingsStore);

const formState = reactive({ ...vaccination.value });

watch(
  vaccination,
  newVal => {
    Object.assign(formState, newVal);
  },
  { deep: true },
);

const handleSubmit = async () => {
  settingsStore.updateVaccinationSettings(formState);
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
        <IconVaccine size="22" />
      </div>
      <div>
        <h2 class="text-text text-base font-bold">Cấu hình Tiêm chủng & Nhắc lịch tự động</h2>
        <p class="text-text-muted text-xs">Cấu hình các khoảng thời gian nhắc mũi tiêm tiếp theo và các kênh gửi thông báo đến chủ nuôi.</p>
      </div>
    </div>

    <a-form layout="vertical" class="max-w-3xl space-y-5" @finish="handleSubmit">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <!-- Reminder lead days -->
        <a-form-item label="Gửi thông báo nhắc tiêm trước (ngày)" required>
          <a-input-number v-model:value="formState.defaultBoosterReminderDays" :min="1" :max="30" class="w-full" size="large">
            <template #prefix><IconBell size="16" class="text-text-muted" /></template>
          </a-input-number>
        </a-form-item>

        <!-- Rabies Certificate Expiry default -->
        <a-form-item label="Thời hạn mặc định Giấy chứng nhận Dại (tháng)" required>
          <a-input-number v-model:value="formState.rabiesCertificateValidityMonths" :min="1" :max="36" class="w-full" size="large">
            <template #prefix><IconVaccine size="16" class="text-text-muted" /></template>
          </a-input-number>
        </a-form-item>
      </div>

      <!-- Auto reminder notification channels -->
      <div class="border-divider bg-bg/50 rounded border p-4 space-y-3">
        <span class="text-text block text-sm font-semibold">Kênh gửi thông báo tự động cho khách hàng</span>

        <div class="flex items-center justify-between py-2 border-b border-divider/60">
          <div class="flex items-center gap-3">
            <IconMessage size="20" class="text-blue-600" />
            <div>
              <span class="text-text block text-sm font-medium">Tự động gửi tin nhắn Zalo ZNS</span>
              <span class="text-text-muted text-xs">Gửi nhắc lịch tiêm chủng trực tiếp qua Zalo OA của phòng khám.</span>
            </div>
          </div>
          <a-switch v-model:checked="formState.autoSendZaloReminder" />
        </div>

        <div class="flex items-center justify-between py-2 border-b border-divider/60">
          <div class="flex items-center gap-3">
            <IconDeviceMobile size="20" class="text-emerald-600" />
            <div>
              <span class="text-text block text-sm font-medium">Tự động gửi tin nhắn SMS Brandname</span>
              <span class="text-text-muted text-xs">Gửi SMS nhắc tiêm khi tới hạn cho các số điện thoại đã đăng ký.</span>
            </div>
          </div>
          <a-switch v-model:checked="formState.autoSendSmsReminder" />
        </div>

        <div class="flex items-center justify-between py-2">
          <div class="flex items-center gap-3">
            <IconMail size="20" class="text-purple-600" />
            <div>
              <span class="text-text block text-sm font-medium">Tự động gửi Email nhắc lịch</span>
              <span class="text-text-muted text-xs">Gửi thư điện tử chi tiết kèm lịch trình vắc-xin định kỳ.</span>
            </div>
          </div>
          <a-switch v-model:checked="formState.autoSendEmailReminder" />
        </div>
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
