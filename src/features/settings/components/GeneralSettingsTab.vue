<script setup lang="ts">
import { reactive, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { IconBuilding, IconPhone, IconMail, IconFileText, IconDeviceFloppy } from '@tabler/icons-vue';
import { useLocale } from '@/shared/composables/useLocale';
import { useSettingsStore } from '@/store/settingsStore';
import { message } from 'ant-design-vue';

const { t } = useLocale();
const settingsStore = useSettingsStore();
const { general, saving } = storeToRefs(settingsStore);

const formState = reactive({ ...general.value });

watch(
  general,
  newVal => {
    Object.assign(formState, newVal);
  },
  { deep: true },
);

const handleSubmit = async () => {
  settingsStore.updateGeneralSettings(formState);
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
        <IconBuilding size="22" />
      </div>
      <div>
        <h2 class="text-text text-base font-bold">Thông tin Phòng khám & Thương hiệu</h2>
        <p class="text-text-muted text-xs">Cấu hình tên phòng khám, địa chỉ, tổng đài hỗ trợ và thông tin pháp lý.</p>
      </div>
    </div>

    <a-form layout="vertical" class="max-w-3xl space-y-4" @finish="handleSubmit">
      <!-- Clinic Name -->
      <a-form-item label="Tên phòng khám / Trung tâm" required>
        <a-input v-model:value="formState.clinicName" placeholder="Nhập tên phòng khám" size="large">
          <template #prefix><IconBuilding size="16" class="text-text-muted" /></template>
        </a-input>
      </a-form-item>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <!-- Hotline -->
        <a-form-item label="Tổng đài chăm sóc khách hàng" required>
          <a-input v-model:value="formState.hotline" placeholder="1900 xxxx" size="large">
            <template #prefix><IconPhone size="16" class="text-text-muted" /></template>
          </a-input>
        </a-form-item>

        <!-- Emergency Phone -->
        <a-form-item label="Hotline trực cấp cứu khẩn cấp" required>
          <a-input v-model:value="formState.emergencyPhone" placeholder="090x xxx xxx" size="large">
            <template #prefix><IconPhone size="16" class="text-error" /></template>
          </a-input>
        </a-form-item>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <!-- Email -->
        <a-form-item label="Email liên hệ chính thức" required>
          <a-input v-model:value="formState.email" placeholder="contact@domain.com" size="large">
            <template #prefix><IconMail size="16" class="text-text-muted" /></template>
          </a-input>
        </a-form-item>

        <!-- Tax Code -->
        <a-form-item label="Mã số thuế doanh nghiệp">
          <a-input v-model:value="formState.taxCode" placeholder="Mã số thuế" size="large">
            <template #prefix><IconFileText size="16" class="text-text-muted" /></template>
          </a-input>
        </a-form-item>
      </div>

      <!-- Address -->
      <a-form-item label="Địa chỉ phòng khám trụ sở chính" required>
        <a-textarea
          v-model:value="formState.address"
          :rows="2"
          placeholder="Nhập địa chỉ đầy đủ phòng khám"
        />
      </a-form-item>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <!-- Currency -->
        <a-form-item label="Đơn vị tiền tệ hiển thị">
          <a-select v-model:value="formState.currency" size="large" class="w-full">
            <a-select-option value="VND">VNĐ (Việt Nam Đồng)</a-select-option>
            <a-select-option value="USD">USD (Đô la Mỹ)</a-select-option>
          </a-select>
        </a-form-item>

        <!-- Timezone -->
        <a-form-item label="Múi giờ hệ thống">
          <a-select v-model:value="formState.timezone" size="large" class="w-full">
            <a-select-option value="Asia/Ho_Chi_Minh">(GMT+07:00) Hà Nội, TP. Hồ Chí Minh</a-select-option>
          </a-select>
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
