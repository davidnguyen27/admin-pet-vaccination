<script setup lang="ts">
import dayjs, { type Dayjs } from 'dayjs';
import { reactive, watch } from 'vue';
import type { Rule } from 'ant-design-vue/es/form';
import type { UserBody } from '../user.api';
import ModalAction from '@/components/ui/ModalAction.vue';

const props = defineProps<{
  open: boolean;
  loading: boolean;
  initialValues?: any | null;
}>();

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'submit', values: UserBody): void;
  (e: 'cancel'): void;
}>();

const formState = reactive<{
  email: string;
  password: string;
  fullName: string;
  roleCode: string;
  phoneNumber: string;
  avatarUrl: string;
  dob: Dayjs | null;
}>({
  email: '',
  password: '',
  fullName: '',
  roleCode: 'OWN',
  phoneNumber: '',
  avatarUrl: '',
  dob: null,
});

const normalizeDob = (value: unknown): Dayjs | null => {
  if (!value) {
    return null;
  }

  if (dayjs.isDayjs(value)) {
    return value;
  }

  const parsed = dayjs(value as string | number | Date);
  return parsed.isValid() ? parsed : null;
};

const rules: Record<string, Rule[]> = {
  email: [
    { required: true, message: 'Please enter email', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email', trigger: 'blur' },
  ],
  password: [
    { required: !props.initialValues, message: 'Please enter password', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' },
  ],
  fullName: [{ required: true, message: 'Please enter full name', trigger: 'blur' }],
  roleCode: [{ required: true, message: 'Please select role', trigger: 'change' }],
};

const handleCancel = () => {
  emit('update:open', false);
  emit('cancel');
};

const onFinish = () => {
  const submitData = {
    ...formState,
    dob: formState.dob ? formState.dob.toISOString() : null,
  };
  emit('submit', submitData);
};

// Reset form when modal opens/closes
watch(
  () => props.open,
  val => {
    if (val && props.initialValues) {
      Object.assign(formState, {
        email: props.initialValues.email || '',
        password: props.initialValues.password || '',
        fullName: props.initialValues.fullName || '',
        roleCode: props.initialValues.roleCode || 'OWN',
        phoneNumber: props.initialValues.phoneNumber || '',
        avatarUrl: props.initialValues.avatarUrl || '',
        dob: normalizeDob(props.initialValues.dob),
      });
    } else if (!val) {
      Object.assign(formState, {
        email: '',
        password: '',
        fullName: '',
        roleCode: 'OWN',
        phoneNumber: '',
        avatarUrl: '',
        dob: null,
      });
    }
  },
  { immediate: true },
);
</script>

<template>
  <a-modal
    :open="open"
    :title="initialValues ? 'Edit User' : 'Add New User'"
    :confirm-loading="loading"
    @cancel="handleCancel"
    @ok="onFinish"
    centered
    destroy-on-close
    :width="600"
    class="premium-modal"
  >
    <a-form layout="vertical" :model="formState" :rules="rules" @finish="onFinish" class="mt-4">
      <div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
        <a-form-item label="Full Name" name="fullName">
          <a-input v-model:value="formState.fullName" placeholder="Enter full name" />
        </a-form-item>

        <a-form-item label="Email" name="email">
          <a-input v-model:value="formState.email" placeholder="example@email.com" />
        </a-form-item>

        <a-form-item label="Password" name="password">
          <a-input-password v-model:value="formState.password" placeholder="Enter password" />
        </a-form-item>

        <a-form-item label="Role" name="roleCode">
          <a-select v-model:value="formState.roleCode" placeholder="Select role">
            <a-select-option value="STAFF">Staff</a-select-option>
            <a-select-option value="VET">Veterinarian</a-select-option>
            <a-select-option value="OWN">Owner</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="Phone Number" name="phoneNumber">
          <a-input v-model:value="formState.phoneNumber" placeholder="Enter phone number" />
        </a-form-item>

        <a-form-item label="Date of Birth" name="dob">
          <a-date-picker v-model:value="formState.dob" class="w-full" format="YYYY-MM-DD" />
        </a-form-item>

        <a-form-item label="Avatar URL" name="avatarUrl" class="sm:col-span-2">
          <a-input v-model:value="formState.avatarUrl" placeholder="https://example.com/avatar.jpg" />
        </a-form-item>
      </div>
    </a-form>

    <template #footer>
      <modal-action
        :loading="loading"
        :submit-text="initialValues ? 'Update User' : 'Create User'"
        @cancel="handleCancel"
        @submit="onFinish"
      />
    </template>
  </a-modal>
</template>
