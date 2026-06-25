<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useLocale } from '@/shared/composables/useLocale';
import { useUserStore } from '@/store/userStore';
import { storeToRefs } from 'pinia';
import { IconUpload, IconArrowLeft, IconDeviceFloppy } from '@tabler/icons-vue';
import dayjs from 'dayjs';
import type { FormInstance } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import PageLayout from '@/layouts/PageLayout.vue';
import type { CreateUserPayload } from '@/features/users/api';

const router = useRouter();
const { t } = useLocale();
const userStore = useUserStore();
const { loading } = storeToRefs(userStore);

const formRef = ref<FormInstance>();

const formData = ref({
  email: '',
  password: '',
  roleCode: undefined as string | undefined,
  fullName: '',
  phoneNumber: '',
  dob: null as dayjs.Dayjs | null,
  address: '',
  staffCode: '',
  jobTitle: '',
  department: '',
  employmentType: 'FULL_TIME',
  employmentStatus: 'WORKING',
  joinDate: null as dayjs.Dayjs | null,
  citizenId: '',
  licenseNo: '',
  licenseIssueBy: '',
  licenseValidFrom: null as dayjs.Dayjs | null,
  licenseValidTo: null as dayjs.Dayjs | null,
  bio: '',
  locationLat: 0,
  locationLng: 0,
});

const roleOptions = [
  { value: 'STAFF', label: t('staff') },
  { value: 'VET', label: t('veterinarian') },
  { value: 'OWN', label: t('owner') },
];

const employmentStatusOptions = [
  { value: 'WORKING', label: t('working') || 'Working' },
  { value: 'ON_LEAVE', label: t('onLeave') || 'On Leave' },
];

const avatarFile = ref<File | null>(null);
const avatarPreview = ref<string | null>(null);

const rules = {
  email: [
    { required: true, message: t('required'), trigger: 'blur' },
    { type: 'email', message: t('invalidEmail'), trigger: 'blur' },
  ],
  password: [{ required: true, message: t('required'), trigger: 'blur' }],
  roleCode: [{ required: true, message: t('required'), trigger: 'change' }],
  fullName: [{ required: true, message: t('required'), trigger: 'blur' }],
  phoneNumber: [{ required: true, message: t('required'), trigger: 'blur' }],
};

function handleAvatarChange(info: any) {
  const file = info.file?.originFileObj || info.file || info;
  if (file && file instanceof File) {
    avatarFile.value = file;
    avatarPreview.value = URL.createObjectURL(file);
  }
}

async function handleSubmit() {
  if (formRef.value) {
    try {
      await formRef.value.validate();
    } catch (error) {
      return;
    }
  }

  const payload: CreateUserPayload = {
    email: formData.value.email,
    password: formData.value.password,
    roleCode: formData.value.roleCode,
    fullName: formData.value.fullName,
    phoneNumber: formData.value.phoneNumber,
    dob: formData.value.dob ? formData.value.dob.format('YYYY-MM-DD') : undefined,
    address: formData.value.address,
    avatar: avatarFile.value,
  };

  if (formData.value.roleCode === 'STAFF') {
    payload.staffCode = formData.value.staffCode;
    payload.jobTitle = formData.value.jobTitle;
    payload.department = formData.value.department;
    payload.employmentType = formData.value.employmentType;
    payload.employmentStatus = formData.value.employmentStatus;
    payload.joinDate = formData.value.joinDate ? formData.value.joinDate.format('YYYY-MM-DD') : undefined;
    payload.citizenId = formData.value.citizenId;
  } else if (formData.value.roleCode === 'VET') {
    payload.licenseNo = formData.value.licenseNo;
    payload.licenseIssueBy = formData.value.licenseIssueBy;
    payload.licenseValidFrom = formData.value.licenseValidFrom
      ? formData.value.licenseValidFrom.format('YYYY-MM-DD')
      : undefined;
    payload.licenseValidTo = formData.value.licenseValidTo
      ? formData.value.licenseValidTo.format('YYYY-MM-DD')
      : undefined;
    payload.bio = formData.value.bio;
    payload.employmentStatus = formData.value.employmentStatus;
    payload.joinDate = formData.value.joinDate ? formData.value.joinDate.format('YYYY-MM-DD') : undefined;
    payload.citizenId = formData.value.citizenId;
  } else if (formData.value.roleCode === 'OWN') {
    payload.locationLat = formData.value.locationLat;
    payload.locationLng = formData.value.locationLng;
  }

  try {
    const res = await userStore.createUser(payload);
    if (res && res.success) {
      message.success(t('success'));
      router.push('/user-management');
    }
  } catch (error: any) {
    message.error(error.message);
  }
}
</script>

<template>
  <PageLayout>
    <div class="flex flex-col gap-6">
      <div class="flex items-center gap-4">
        <a-button type="text" class="flex items-center justify-center p-2" @click="router.push('/user-management')">
          <IconArrowLeft size="20" class="text-text-muted" />
        </a-button>
        <div class="flex flex-col">
          <span class="font-ibm text-text text-xl font-bold">{{ t('add') }}</span>
          <span class="text-text-muted text-sm">{{ t('user.manageUserAccounts') }}</span>
        </div>
      </div>

      <div class="bg-surface border-border flex flex-col gap-6 border p-6">
        <div class="flex justify-center">
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

              <div
                v-if="avatarPreview"
                class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <IconUpload size="24" class="text-white" stroke="1.5" />
              </div>
            </div>
          </a-upload>
        </div>

        <a-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          layout="vertical"
          class="flex flex-col gap-4"
          hide-required-mark
        >
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <a-form-item :label="t('user.email')" name="email" class="mb-0">
              <a-input v-model:value="formData.email" size="large" :placeholder="t('user.email')" />
            </a-form-item>

            <a-form-item :label="t('user.password')" name="password" class="mb-0">
              <a-input-password v-model:value="formData.password" size="large" :placeholder="t('user.password')" />
            </a-form-item>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <a-form-item :label="t('user.fullName')" name="fullName" class="mb-0">
              <a-input v-model:value="formData.fullName" size="large" :placeholder="t('user.fullName')" />
            </a-form-item>

            <a-form-item :label="t('user.role')" name="roleCode" class="mb-0">
              <a-select
                v-model:value="formData.roleCode"
                size="large"
                :placeholder="t('user.role')"
                :options="roleOptions"
              />
            </a-form-item>
          </div>

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

          <!-- Role Specific Fields: STAFF -->
          <template v-if="formData.roleCode === 'STAFF'">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <a-form-item label="Staff Code" name="staffCode" class="mb-0">
                <a-input v-model:value="formData.staffCode" size="large" placeholder="Staff Code" />
              </a-form-item>
              <a-form-item label="Department" name="department" class="mb-0">
                <a-input v-model:value="formData.department" size="large" placeholder="Department" />
              </a-form-item>
            </div>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <a-form-item label="Job Title" name="jobTitle" class="mb-0">
                <a-input v-model:value="formData.jobTitle" size="large" placeholder="Job Title" />
              </a-form-item>
              <a-form-item label="Citizen ID" name="citizenId" class="mb-0">
                <a-input v-model:value="formData.citizenId" size="large" placeholder="Citizen ID" />
              </a-form-item>
            </div>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <a-form-item label="Join Date" name="joinDate" class="mb-0">
                <a-date-picker v-model:value="formData.joinDate" size="large" class="w-full" format="YYYY-MM-DD" />
              </a-form-item>
              <a-form-item label="Employment Status" name="employmentStatus" class="mb-0">
                <a-select
                  v-model:value="formData.employmentStatus"
                  size="large"
                  :options="employmentStatusOptions"
                />
              </a-form-item>
            </div>
            <div class="grid grid-cols-1 gap-4">
              <a-form-item label="Address" name="address" class="mb-0">
                <a-input v-model:value="formData.address" size="large" placeholder="Address" />
              </a-form-item>
            </div>
          </template>

          <!-- Role Specific Fields: VET -->
          <template v-if="formData.roleCode === 'VET'">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <a-form-item label="License No" name="licenseNo" class="mb-0">
                <a-input v-model:value="formData.licenseNo" size="large" placeholder="License No" />
              </a-form-item>
              <a-form-item label="Citizen ID" name="citizenId" class="mb-0">
                <a-input v-model:value="formData.citizenId" size="large" placeholder="Citizen ID" />
              </a-form-item>
            </div>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <a-form-item label="License Valid From" name="licenseValidFrom" class="mb-0">
                <a-date-picker
                  v-model:value="formData.licenseValidFrom"
                  size="large"
                  class="w-full"
                  format="YYYY-MM-DD"
                />
              </a-form-item>
              <a-form-item label="License Valid To" name="licenseValidTo" class="mb-0">
                <a-date-picker
                  v-model:value="formData.licenseValidTo"
                  size="large"
                  class="w-full"
                  format="YYYY-MM-DD"
                />
              </a-form-item>
            </div>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <a-form-item label="Join Date" name="joinDate" class="mb-0">
                <a-date-picker v-model:value="formData.joinDate" size="large" class="w-full" format="YYYY-MM-DD" />
              </a-form-item>
              <a-form-item label="Bio" name="bio" class="mb-0">
                <a-input v-model:value="formData.bio" size="large" placeholder="Bio" />
              </a-form-item>
            </div>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <a-form-item label="Employment Status" name="employmentStatus" class="mb-0">
                <a-select
                  v-model:value="formData.employmentStatus"
                  size="large"
                  :options="employmentStatusOptions"
                />
              </a-form-item>
            </div>
            <div class="grid grid-cols-1 gap-4">
              <a-form-item label="Address" name="address" class="mb-0">
                <a-input v-model:value="formData.address" size="large" placeholder="Address" />
              </a-form-item>
            </div>
          </template>

          <div class="mt-4 flex justify-end gap-3">
            <a-button size="large" @click="router.push('/user-management')">{{ t('cancel') }}</a-button>
            <a-button
              type="primary"
              size="large"
              :loading="loading"
              class="flex items-center gap-2"
              @click="handleSubmit"
            >
              <template #icon><IconDeviceFloppy size="18" /></template>
              <span>{{ t('save') }}</span>
            </a-button>
          </div>
        </a-form>
      </div>
    </div>
  </PageLayout>
</template>
