<script setup lang="ts">
import { reactive, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { IconServer, IconTool, IconDatabase, IconRefresh, IconDeviceFloppy, IconAlertOctagon } from '@tabler/icons-vue';
import { useLocale } from '@/shared/composables/useLocale';
import { useSettingsStore } from '@/store/settingsStore';
import { message } from 'ant-design-vue';

const { t } = useLocale();
const settingsStore = useSettingsStore();
const { system, saving } = storeToRefs(settingsStore);

const formState = reactive({ ...system.value });

watch(
  system,
  newVal => {
    Object.assign(formState, newVal);
  },
  { deep: true },
);

const handleResetMockData = () => {
  message.success('Đã làm mới dữ liệu giả lập hệ thống (Mock Data Reset)');
};

const handleBackupNow = () => {
  formState.lastBackupDate = new Date().toISOString().replace('T', ' ').substring(0, 19);
  settingsStore.updateSystemSettings({ lastBackupDate: formState.lastBackupDate });
  message.success('Đã thực hiện sao lưu dữ liệu hệ thống thành công!');
};

const handleSubmit = async () => {
  settingsStore.updateSystemSettings(formState);
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
        <IconServer size="22" />
      </div>
      <div>
        <h2 class="text-text text-base font-bold">Hệ thống & Bảo trì Dữ liệu</h2>
        <p class="text-text-muted text-xs">Quản lý chế độ bảo trì, phiên bản ứng dụng và công cụ sao lưu dữ liệu.</p>
      </div>
    </div>

    <a-form layout="vertical" class="max-w-3xl space-y-5" @finish="handleSubmit">
      <!-- Maintenance Mode Toggle -->
      <div class="border-divider bg-error-bg/30 border-error/20 flex items-center justify-between rounded border p-4">
        <div class="flex items-center gap-3">
          <IconAlertOctagon size="22" class="text-error" />
          <div>
            <span class="text-text block text-sm font-semibold">Chế độ Bảo trì Hệ thống (Maintenance Mode)</span>
            <span class="text-text-muted text-xs">Khi bật, người dùng thông thường và khách hàng sẽ thấy màn hình thông báo bảo trì.</span>
          </div>
        </div>
        <a-switch v-model:checked="formState.maintenanceMode" />
      </div>

      <!-- System info -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <a-form-item label="Phiên bản hệ thống Admin">
          <a-input v-model:value="formState.systemVersion" disabled size="large">
            <template #prefix><IconTool size="16" class="text-text-muted" /></template>
          </a-input>
        </a-form-item>

        <a-form-item label="Thời gian sao lưu gần nhất">
          <a-input v-model:value="formState.lastBackupDate" disabled size="large">
            <template #prefix><IconDatabase size="16" class="text-text-muted" /></template>
          </a-input>
        </a-form-item>
      </div>

      <!-- Backup Actions -->
      <div class="border-divider bg-bg/50 space-y-3 rounded border p-4">
        <span class="text-text block text-sm font-semibold">Công cụ Quản trị Dữ liệu</span>

        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span class="text-text block text-sm font-medium">Sao lưu dữ liệu tức thì</span>
            <span class="text-text-muted text-xs">Tạo bản sao lưu snapshots toàn bộ hồ sơ tiêm chủng và danh mục vắc-xin.</span>
          </div>
          <a-button class="flex items-center gap-1.5" @click="handleBackupNow">
            <IconDatabase size="16" />
            <span>Sao lưu ngay</span>
          </a-button>
        </div>

        <div class="border-divider border-t pt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span class="text-text block text-sm font-medium">Khôi phục Dữ liệu Giả lập (Reset Mock Data)</span>
            <span class="text-text-muted text-xs">Đặt lại danh sách vắc-xin, microchip và lịch trực về trạng thái dữ liệu mẫu ban đầu.</span>
          </div>
          <a-button danger class="flex items-center gap-1.5" @click="handleResetMockData">
            <IconRefresh size="16" />
            <span>Reset Mock Data</span>
          </a-button>
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
