<script setup lang="ts">
import { ref, watch } from 'vue';
import { useLocale } from '@/shared/composables/useLocale';
import { useUserStore } from '@/store/userStore';
import { IconUpload } from '@tabler/icons-vue';
import dayjs from 'dayjs';
import { storeToRefs } from 'pinia';
import ModalLayout from '@/layouts/ModalLayout.vue';

import { message } from 'ant-design-vue';
import type { FormInstance } from 'ant-design-vue';

const props = defineProps<{
  open: boolean;
  userId: string | null;
  initialData?: {
    fullName?: string;
    phoneNumber?: string;
    dob?: string;
    avatarUrl?: string;
  } | null;
}>();

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'success'): void;
}>();

const { t } = useLocale();
const userStore = useUserStore();
const { loading } = storeToRefs(userStore);

const formRef = ref<FormInstance>();

const formData = ref<{
  fullName: string;
  phoneNumber: string;
  dob: dayjs.Dayjs | null;
}>({
  fullName: '',
  phoneNumber: '',
  dob: null,
});

const avatarFile = ref<File | null>(null);
const avatarPreview = ref<string | null>(null);

const rules = {
  fullName: [{ required: true, message: t('required'), trigger: 'blur' }],
  phoneNumber: [{ required: true, message: t('required'), trigger: 'blur' }],
};

watch(
  () => props.open,
  isOpen => {
    if (isOpen) {
      formData.value = {
        fullName: props.initialData?.fullName || '',
        phoneNumber: props.initialData?.phoneNumber || '',
        dob: props.initialData?.dob ? dayjs(props.initialData.dob) : null,
      };
      avatarFile.value = null;
      avatarPreview.value = props.initialData?.avatarUrl || null;

      // Reset form validation when opening
      if (formRef.value) {
        formRef.value.clearValidate();
      }
    }
  },
);

function handleAvatarChange(info: any) {
  const file = info.file?.originFileObj || info.file || info;
  if (file && file instanceof File) {
    avatarFile.value = file;
    avatarPreview.value = URL.createObjectURL(file);
  }
}

async function handleSubmit() {
  if (!props.userId) return;

  if (formRef.value) {
    try {
      await formRef.value.validate();
    } catch (error) {
      return;
    }
  }

  const payload = {
    fullName: formData.value.fullName,
    phoneNumber: formData.value.phoneNumber,
    dob: formData.value.dob ? formData.value.dob.format('YYYY-MM-DD') : undefined,
    avatar: avatarFile.value,
  };

  try {
    const res = await userStore.updateUser(props.userId, payload);
    if (res.success) {
      message.success(t('success'));
      emit('success');
      emit('update:open', false);
    }
  } catch (error: any) {
    message.error(error.response?.data?.message);
  }
}
</script>

<template>
  <ModalLayout
    :open="open"
    :title="t('user.editProfile')"
    @update:open="emit('update:open', $event)"
    @ok="handleSubmit"
    @cancel="() => emit('update:open', false)"
    :loading="loading"
    :ok-text="t('save')"
    :cancel-text="t('cancel')"
    :width="480"
  >
    <div class="pt-4">
      <!-- Avatar Upload -->
      <div class="mb-6 flex justify-center">
        <a-upload
          name="avatar"
          :show-upload-list="false"
          :before-upload="() => false"
          @change="handleAvatarChange"
          accept="image/*"
        >
          <div
            class="group border-border bg-surface hover:border-primary relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed transition-all"
          >
            <img v-if="avatarPreview" :src="avatarPreview" alt="avatar" class="h-full w-full object-cover" />
            <div
              v-else
              class="text-text-muted group-hover:text-primary flex flex-col items-center justify-center transition-colors"
            >
              <IconUpload size="22" stroke="1.5" />
              <span class="mt-1 text-[10px] font-semibold tracking-wider uppercase">{{ t('upload') }}</span>
            </div>

            <!-- Hover overlay for existing image -->
            <div
              v-if="avatarPreview"
              class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <IconUpload size="24" class="text-white" stroke="1.5" />
            </div>
          </div>
        </a-upload>
      </div>

      <!-- Form -->
      <a-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        layout="vertical"
        class="flex flex-col gap-4"
        hide-required-mark
      >
        <a-form-item :label="t('user.fullName')" name="fullName" class="mb-0">
          <a-input v-model:value="formData.fullName" size="large" :placeholder="t('user.fullName')" />
        </a-form-item>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <a-form-item :label="t('user.phoneNumber')" name="phoneNumber" class="mb-0">
            <a-input v-model:value="formData.phoneNumber" size="large" :placeholder="t('user.phoneNumber')" />
          </a-form-item>

          <a-form-item :label="t('user.dob')" name="dob" class="mb-0">
            <a-date-picker
              v-model:value="formData.dob"
              size="large"
              class="w-full"
              format="YYYY-MM-DD"
              :placeholder="t('user.dob')"
            />
          </a-form-item>
        </div>
      </a-form>
    </div>
  </ModalLayout>
</template>
