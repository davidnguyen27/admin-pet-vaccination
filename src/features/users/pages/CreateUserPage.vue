<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useLocale } from '@/shared/composables/useLocale';
import { useUserStore } from '@/store/userStore';
import { storeToRefs } from 'pinia';
import { IconUpload, IconArrowLeft, IconDeviceFloppy } from '@tabler/icons-vue';
import dayjs from 'dayjs';
import { message } from 'ant-design-vue';
import PageLayout from '@/layouts/PageLayout.vue';
import type { CreateUserPayload } from '@/features/users/api';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';

const router = useRouter();
const { t } = useLocale();
const userStore = useUserStore();
const { loading } = storeToRefs(userStore);

interface FormValues {
  email: string;
  password?: string;
  fullName: string;
  roleCode?: string;
  phoneNumber: string;
  dob?: dayjs.Dayjs | null;
  address?: string;
  staffCode?: string;
  department?: string;
  jobTitle?: string;
  employmentType?: string;
  employmentStatus?: string;
  joinDate?: dayjs.Dayjs | null;
  citizenId?: string;
  licenseNo?: string;
  licenseIssueBy?: string;
  licenseValidFrom?: dayjs.Dayjs | null;
  licenseValidTo?: dayjs.Dayjs | null;
  bio?: string;
  locationLat?: number;
  locationLng?: number;
}

const schema = yup.object({
  email: yup.string().required(t('required')).email(t('auth.invalidEmail')),
  password: yup.string().required(t('required')),
  fullName: yup.string().required(t('required')),
  roleCode: yup.string().required(t('required')),
  phoneNumber: yup.string().required(t('required')),
  dob: yup.mixed().nullable(),
  address: yup.string().nullable(),
  staffCode: yup.string().nullable(),
  department: yup.string().nullable(),
  jobTitle: yup.string().nullable(),
  employmentType: yup.string().nullable().default('FULL_TIME'),
  employmentStatus: yup.string().nullable().default('WORKING'),
  joinDate: yup.mixed().nullable(),
  citizenId: yup.string().nullable(),
  licenseNo: yup.string().nullable(),
  licenseIssueBy: yup.string().nullable(),
  licenseValidFrom: yup.mixed().nullable(),
  licenseValidTo: yup.mixed().nullable(),
  bio: yup.string().nullable(),
  locationLat: yup.number().nullable().default(0),
  locationLng: yup.number().nullable().default(0),
});

const { handleSubmit, isSubmitting } = useForm<FormValues>({
  validationSchema: schema,
  initialValues: {
    email: '',
    password: '',
    fullName: '',
    roleCode: undefined,
    phoneNumber: '',
    dob: null,
    address: '',
    staffCode: '',
    department: '',
    jobTitle: '',
    employmentType: 'FULL_TIME',
    employmentStatus: 'WORKING',
    joinDate: null,
    citizenId: '',
    licenseNo: '',
    licenseIssueBy: '',
    licenseValidFrom: null,
    licenseValidTo: null,
    bio: '',
    locationLat: 0,
    locationLng: 0,
  },
});

const { value: email, errorMessage: emailError } = useField<string>('email');
const { value: password, errorMessage: passwordError } = useField<string>('password');
const { value: fullName, errorMessage: fullNameError } = useField<string>('fullName');
const { value: roleCode, errorMessage: roleCodeError } = useField<string | undefined>('roleCode');
const { value: phoneNumber, errorMessage: phoneNumberError } = useField<string>('phoneNumber');
const { value: dob, errorMessage: dobError } = useField<dayjs.Dayjs | null>('dob');
const { value: address } = useField<string>('address');

// Staff specific
const { value: staffCode } = useField<string>('staffCode');
const { value: department } = useField<string>('department');
const { value: jobTitle } = useField<string>('jobTitle');
const { value: employmentType } = useField<string>('employmentType');
const { value: employmentStatus } = useField<string>('employmentStatus');
const { value: joinDate } = useField<dayjs.Dayjs | null>('joinDate');
const { value: citizenId } = useField<string>('citizenId');

// Vet specific
const { value: licenseNo } = useField<string>('licenseNo');
const { value: licenseIssueBy } = useField<string>('licenseIssueBy');
const { value: licenseValidFrom } = useField<dayjs.Dayjs | null>('licenseValidFrom');
const { value: licenseValidTo } = useField<dayjs.Dayjs | null>('licenseValidTo');
const { value: bio } = useField<string>('bio');

// Owner specific
const { value: locationLat } = useField<number>('locationLat');
const { value: locationLng } = useField<number>('locationLng');

const roleOptions = [
  { value: 'STAFF', label: t('staff') },
  { value: 'VET', label: t('veterinarian') },
  { value: 'OWN', label: t('owner') },
];

const employmentStatusOptions = [
  { value: 'WORKING', label: t('user.working') },
  { value: 'ON_LEAVE', label: t('user.onLeave') },
];

const employmentTypeOptions = [
  { value: 'FULL_TIME', label: t('user.fullTime') },
  { value: 'PART_TIME', label: t('user.partTime') },
  { value: 'CONTRACT', label: t('user.contract') },
  { value: 'INTERN', label: t('user.intern') },
];

const avatarFile = ref<File | null>(null);
const avatarPreview = ref<string | null>(null);

function handleAvatarChange(info: any) {
  const file = info.file?.originFileObj || info.file || info;
  if (file && file instanceof File) {
    avatarFile.value = file;
    avatarPreview.value = URL.createObjectURL(file);
  }
}

const onSubmit = handleSubmit(async values => {
  const payload: CreateUserPayload = {
    email: values.email,
    password: values.password,
    roleCode: values.roleCode,
    fullName: values.fullName,
    phoneNumber: values.phoneNumber,
    dob: values.dob ? values.dob.format('YYYY-MM-DD') : undefined,
    address: values.address || undefined,
    avatar: avatarFile.value,
  };

  if (values.roleCode === 'STAFF') {
    payload.staffCode = values.staffCode || undefined;
    payload.jobTitle = values.jobTitle || undefined;
    payload.department = values.department || undefined;
    payload.employmentType = values.employmentType || undefined;
    payload.employmentStatus = values.employmentStatus || undefined;
    payload.joinDate = values.joinDate ? values.joinDate.format('YYYY-MM-DD') : undefined;
    payload.citizenId = values.citizenId || undefined;
  } else if (values.roleCode === 'VET') {
    payload.licenseNo = values.licenseNo || undefined;
    payload.licenseIssueBy = values.licenseIssueBy || undefined;
    payload.licenseValidFrom = values.licenseValidFrom ? values.licenseValidFrom.format('YYYY-MM-DD') : undefined;
    payload.licenseValidTo = values.licenseValidTo ? values.licenseValidTo.format('YYYY-MM-DD') : undefined;
    payload.bio = values.bio || undefined;
    payload.employmentStatus = values.employmentStatus || undefined;
    payload.joinDate = values.joinDate ? values.joinDate.format('YYYY-MM-DD') : undefined;
    payload.citizenId = values.citizenId || undefined;
  } else if (values.roleCode === 'OWN') {
    payload.locationLat = values.locationLat !== null ? Number(values.locationLat) : undefined;
    payload.locationLng = values.locationLng !== null ? Number(values.locationLng) : undefined;
  }

  try {
    const res = await userStore.createUser(payload);
    if (res && res.success) {
      message.success(t('success'));
      router.push('/user-management');
    }
  } catch (error: any) {
    message.error(error.message || t('error'));
  }
});
</script>

<template>
  <PageLayout>
    <div class="flex flex-col gap-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <a-button
            type="text"
            shape="circle"
            class="hover:bg-primary-soft/50 text-text-muted flex items-center justify-center p-2"
            @click="router.push('/user-management')"
          >
            <IconArrowLeft class="size-5" />
          </a-button>
          <div class="flex flex-col">
            <h1 class="font-ibm text-text text-xl font-bold">{{ t('user.addUser') }}</h1>
            <span class="text-text-muted mt-0.5 block text-sm">{{ t('user.createUserDesc') }}</span>
          </div>
        </div>
      </div>

      <a-form layout="vertical" @submit="onSubmit" class="flex flex-col gap-6">
        <!-- 2 Column Layout Grid -->
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <!-- Left Column (Avatar & Role selection) -->
          <div class="flex flex-col gap-6 lg:col-span-1">
            <!-- Avatar Card -->
            <div class="border-divider bg-surface shadow-card flex flex-col items-center rounded border p-6">
              <h2 class="font-ibm text-text mb-4 w-full text-left text-sm font-semibold">
                {{ t('user.avatar') }}
              </h2>
              <div class="flex flex-col items-center gap-3">
                <a-upload
                  name="avatar"
                  :show-upload-list="false"
                  :before-upload="() => false"
                  @change="handleAvatarChange"
                  accept="image/*"
                >
                  <div
                    class="group border-divider bg-surface hover:border-primary relative flex h-28 w-28 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed transition-all"
                  >
                    <img v-if="avatarPreview" :src="avatarPreview" alt="avatar" class="h-full w-full object-cover" />
                    <div
                      v-else
                      class="text-text-muted group-hover:text-primary flex flex-col items-center justify-center transition-colors"
                    >
                      <IconUpload class="size-7" stroke="1.5" />
                      <span class="mt-1 text-[10px] font-semibold tracking-wider uppercase">{{ t('upload') }}</span>
                    </div>
                    <div
                      v-if="avatarPreview"
                      class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <IconUpload class="size-6 text-white" stroke="1.5" />
                    </div>
                  </div>
                </a-upload>
                <div class="text-text-muted mt-1 text-center text-xs">
                  <p class="text-text-subtle font-medium">{{ t('user.recommendationSize') }}</p>
                  <p class="mt-0.5 text-[11px]">{{ t('user.recommendationRules') }}</p>
                </div>
              </div>
            </div>

            <!-- Role Card -->
            <div class="border-divider bg-surface shadow-card rounded border p-6">
              <h2 class="font-ibm text-text mb-4 text-sm font-semibold">
                {{ t('user.roleAndPermissions') }}
              </h2>

              <a-form-item
                name="roleCode"
                class="mb-0"
                :validate-status="roleCodeError ? 'error' : ''"
                :help="roleCodeError"
              >
                <template #label>
                  <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                    t('user.role')
                  }}</span>
                </template>
                <a-select
                  v-model:value="roleCode"
                  size="large"
                  class="w-full"
                  :placeholder="t('user.role')"
                  :options="roleOptions"
                />
              </a-form-item>

              <!-- Quick Role Helper Info -->
              <div v-if="roleCode" class="bg-primary-soft border-primary-soft mt-4 rounded border p-4">
                <p class="text-primary text-xs font-semibold">
                  {{
                    t('user.accessLevelDesc', {
                      role: roleCode === 'STAFF' ? t('staff') : roleCode === 'VET' ? t('veterinarian') : t('owner'),
                    })
                  }}
                </p>
                <p class="text-text-muted mt-1 text-[11px] leading-relaxed">
                  {{
                    roleCode === 'STAFF'
                      ? t('user.staffAccessDesc')
                      : roleCode === 'VET'
                        ? t('user.vetAccessDesc')
                        : t('user.ownerAccessDesc')
                  }}
                </p>
              </div>
            </div>
          </div>

          <!-- Right Column (Details Forms) -->
          <div class="flex flex-col gap-6 lg:col-span-2">
            <!-- Basic Info Section -->
            <div class="border-divider bg-surface shadow-card flex flex-col gap-5 rounded border p-6">
              <h2 class="font-ibm text-text border-divider border-b pb-3 text-base font-semibold">
                {{ t('user.basicInfo') }}
              </h2>

              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <a-form-item
                  name="fullName"
                  class="mb-0"
                  :validate-status="fullNameError ? 'error' : ''"
                  :help="fullNameError"
                >
                  <template #label>
                    <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                      t('user.fullName')
                    }}</span>
                  </template>
                  <a-input v-model:value="fullName" size="large" :placeholder="t('user.fullName')" />
                </a-form-item>

                <a-form-item
                  name="phoneNumber"
                  class="mb-0"
                  :validate-status="phoneNumberError ? 'error' : ''"
                  :help="phoneNumberError"
                >
                  <template #label>
                    <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                      t('user.phoneNumber')
                    }}</span>
                  </template>
                  <a-input v-model:value="phoneNumber" size="large" :placeholder="t('user.phoneNumber')" />
                </a-form-item>
              </div>

              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <a-form-item name="email" class="mb-0" :validate-status="emailError ? 'error' : ''" :help="emailError">
                  <template #label>
                    <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                      t('user.email')
                    }}</span>
                  </template>
                  <a-input v-model:value="email" size="large" :placeholder="t('user.email')" />
                </a-form-item>

                <a-form-item
                  name="password"
                  class="mb-0"
                  :validate-status="passwordError ? 'error' : ''"
                  :help="passwordError"
                >
                  <template #label>
                    <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                      t('user.password')
                    }}</span>
                  </template>
                  <a-input-password v-model:value="password" size="large" :placeholder="t('user.password')" />
                </a-form-item>
              </div>

              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <a-form-item name="dob" class="mb-0" :validate-status="dobError ? 'error' : ''" :help="dobError">
                  <template #label>
                    <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                      t('user.dob')
                    }}</span>
                  </template>
                  <a-date-picker
                    v-model:value="dob"
                    size="large"
                    class="w-full"
                    format="YYYY-MM-DD"
                    :placeholder="t('user.dob')"
                  />
                </a-form-item>
              </div>
            </div>

            <!-- Role Specific: STAFF Details -->
            <div
              v-if="roleCode === 'STAFF'"
              class="border-divider bg-surface shadow-card flex flex-col gap-5 rounded border p-6"
            >
              <h2 class="font-ibm text-text border-divider border-b pb-3 text-base font-semibold">
                {{ t('user.staffDetails') }}
              </h2>

              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <a-form-item name="staffCode" class="mb-0">
                  <template #label>
                    <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                      t('user.staffCode')
                    }}</span>
                  </template>
                  <a-input v-model:value="staffCode" size="large" :placeholder="t('user.staffCode')" />
                </a-form-item>

                <a-form-item name="department" class="mb-0">
                  <template #label>
                    <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                      t('user.department')
                    }}</span>
                  </template>
                  <a-input v-model:value="department" size="large" :placeholder="t('user.department')" />
                </a-form-item>
              </div>

              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <a-form-item name="jobTitle" class="mb-0">
                  <template #label>
                    <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                      t('user.jobTitle')
                    }}</span>
                  </template>
                  <a-input v-model:value="jobTitle" size="large" :placeholder="t('user.jobTitle')" />
                </a-form-item>

                <a-form-item name="citizenId" class="mb-0">
                  <template #label>
                    <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                      t('user.citizenId')
                    }}</span>
                  </template>
                  <a-input v-model:value="citizenId" size="large" :placeholder="t('user.citizenId')" />
                </a-form-item>
              </div>

              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <a-form-item name="joinDate" class="mb-0">
                  <template #label>
                    <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                      t('user.joinDate')
                    }}</span>
                  </template>
                  <a-date-picker v-model:value="joinDate" size="large" class="w-full" format="YYYY-MM-DD" />
                </a-form-item>

                <a-form-item name="employmentStatus" class="mb-0">
                  <template #label>
                    <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                      t('user.employmentStatus')
                    }}</span>
                  </template>
                  <a-select v-model:value="employmentStatus" size="large" :options="employmentStatusOptions" />
                </a-form-item>
              </div>

              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <a-form-item name="employmentType" class="mb-0">
                  <template #label>
                    <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                      t('user.employmentType')
                    }}</span>
                  </template>
                  <a-select v-model:value="employmentType" size="large" :options="employmentTypeOptions" />
                </a-form-item>
              </div>

              <div class="grid grid-cols-1 gap-4">
                <a-form-item name="address" class="mb-0">
                  <template #label>
                    <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                      t('user.address')
                    }}</span>
                  </template>
                  <a-input v-model:value="address" size="large" :placeholder="t('user.address')" />
                </a-form-item>
              </div>
            </div>

            <!-- Role Specific: VET Details -->
            <div
              v-if="roleCode === 'VET'"
              class="border-divider bg-surface shadow-card flex flex-col gap-5 rounded border p-6"
            >
              <h2 class="font-ibm text-text border-divider border-b pb-3 text-base font-semibold">
                {{ t('user.vetDetails') }}
              </h2>

              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <a-form-item name="licenseNo" class="mb-0">
                  <template #label>
                    <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                      t('user.licenseNo')
                    }}</span>
                  </template>
                  <a-input v-model:value="licenseNo" size="large" :placeholder="t('user.licenseNo')" />
                </a-form-item>

                <a-form-item name="licenseIssueBy" class="mb-0">
                  <template #label>
                    <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                      t('user.licenseIssueBy')
                    }}</span>
                  </template>
                  <a-input v-model:value="licenseIssueBy" size="large" :placeholder="t('user.licenseIssueBy')" />
                </a-form-item>
              </div>

              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <a-form-item name="licenseValidFrom" class="mb-0">
                  <template #label>
                    <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                      t('user.licenseValidFrom')
                    }}</span>
                  </template>
                  <a-date-picker v-model:value="licenseValidFrom" size="large" class="w-full" format="YYYY-MM-DD" />
                </a-form-item>

                <a-form-item name="licenseValidTo" class="mb-0">
                  <template #label>
                    <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                      t('user.licenseValidTo')
                    }}</span>
                  </template>
                  <a-date-picker v-model:value="licenseValidTo" size="large" class="w-full" format="YYYY-MM-DD" />
                </a-form-item>
              </div>

              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <a-form-item name="citizenId" class="mb-0">
                  <template #label>
                    <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                      t('user.citizenId')
                    }}</span>
                  </template>
                  <a-input v-model:value="citizenId" size="large" :placeholder="t('user.citizenId')" />
                </a-form-item>

                <a-form-item name="joinDate" class="mb-0">
                  <template #label>
                    <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                      t('user.joinDate')
                    }}</span>
                  </template>
                  <a-date-picker v-model:value="joinDate" size="large" class="w-full" format="YYYY-MM-DD" />
                </a-form-item>
              </div>

              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <a-form-item name="employmentStatus" class="mb-0">
                  <template #label>
                    <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                      t('user.employmentStatus')
                    }}</span>
                  </template>
                  <a-select v-model:value="employmentStatus" size="large" :options="employmentStatusOptions" />
                </a-form-item>
              </div>

              <div class="grid grid-cols-1 gap-4">
                <a-form-item name="bio" class="mb-0">
                  <template #label>
                    <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                      t('user.bio')
                    }}</span>
                  </template>
                  <a-textarea v-model:value="bio" :rows="3" :placeholder="t('user.bio')" />
                </a-form-item>
              </div>

              <div class="grid grid-cols-1 gap-4">
                <a-form-item name="address" class="mb-0">
                  <template #label>
                    <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                      t('user.address')
                    }}</span>
                  </template>
                  <a-input v-model:value="address" size="large" :placeholder="t('user.address')" />
                </a-form-item>
              </div>
            </div>

            <!-- Role Specific: OWNER Details -->
            <div
              v-if="roleCode === 'OWN'"
              class="border-divider bg-surface shadow-card flex flex-col gap-5 rounded border p-6"
            >
              <h2 class="font-ibm text-text border-divider border-b pb-3 text-base font-semibold">
                {{ t('user.ownerDetails') }}
              </h2>

              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <a-form-item name="locationLat" class="mb-0">
                  <template #label>
                    <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                      t('user.locationLat')
                    }}</span>
                  </template>
                  <a-input-number
                    v-model:value="locationLat"
                    size="large"
                    class="w-full"
                    :placeholder="t('user.locationLat')"
                  />
                </a-form-item>

                <a-form-item name="locationLng" class="mb-0">
                  <template #label>
                    <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                      t('user.locationLng')
                    }}</span>
                  </template>
                  <a-input-number
                    v-model:value="locationLng"
                    size="large"
                    class="w-full"
                    :placeholder="t('user.locationLng')"
                  />
                </a-form-item>
              </div>

              <div class="grid grid-cols-1 gap-4">
                <a-form-item name="address" class="mb-0">
                  <template #label>
                    <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                      t('user.address')
                    }}</span>
                  </template>
                  <a-input v-model:value="address" size="large" :placeholder="t('user.address')" />
                </a-form-item>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="flex items-center justify-end gap-3 pb-6">
              <a-button size="large" class="rounded" @click="router.push('/user-management')">
                {{ t('cancel') }}
              </a-button>

              <a-button
                type="primary"
                size="large"
                html-type="submit"
                :loading="loading || isSubmitting"
                class="flex items-center gap-2 rounded"
              >
                <template #icon><IconDeviceFloppy class="size-4.5" /></template>
                <span class="font-medium">{{ t('save') }}</span>
              </a-button>
            </div>
          </div>
        </div>
      </a-form>
    </div>
  </PageLayout>
</template>
