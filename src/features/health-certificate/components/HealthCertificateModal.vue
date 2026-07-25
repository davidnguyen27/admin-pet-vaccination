<script setup lang="ts">
import { computed, watch } from 'vue';
import { useLocale } from '@/shared/composables/useLocale';
import { useHealthCertificateStore } from '@/store/healthCertificateStore';
import { storeToRefs } from 'pinia';
import ModalLayout from '@/layouts/ModalLayout.vue';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import dayjs from 'dayjs';
import type {
  HealthCertificate,
  HealthCertificateStatus,
  HealthCertificatePurpose,
} from '@/shared/types/healthCertificate.type';

interface FormValues {
  certificateNo: string;
  petName: string;
  species: string;
  breed?: string;
  ownerName: string;
  ownerPhone?: string;
  microchipNo?: string;
  status: HealthCertificateStatus;
  purpose: HealthCertificatePurpose;
  issueDate?: dayjs.Dayjs | null;
  expiryDate?: dayjs.Dayjs | null;
  issuedBy?: string;
  rabiesVaccinated: boolean;
  clinicalNotes?: string;
}

const props = defineProps<{
  open: boolean;
  certificateId: string | null;
  initialData?: HealthCertificate | null;
}>();

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'success'): void;
}>();

const { t } = useLocale();
const certStore = useHealthCertificateStore();
const { loading } = storeToRefs(certStore);

const schema = yup.object({
  certificateNo: yup.string().required(t('required')),
  petName: yup.string().required(t('required')),
  species: yup.string().required(t('required')),
  breed: yup.string().nullable(),
  ownerName: yup.string().required(t('required')),
  ownerPhone: yup.string().nullable(),
  microchipNo: yup.string().nullable(),
  status: yup.string().required(t('required')),
  purpose: yup.string().required(t('required')),
  issueDate: yup.mixed().nullable(),
  expiryDate: yup.mixed().nullable(),
  issuedBy: yup.string().nullable(),
  rabiesVaccinated: yup.boolean().required(),
  clinicalNotes: yup.string().nullable(),
});

const { handleSubmit, isSubmitting, setValues, resetForm } = useForm<FormValues>({
  validationSchema: schema,
  initialValues: {
    certificateNo: '',
    petName: '',
    species: 'Dog',
    breed: '',
    ownerName: '',
    ownerPhone: '',
    microchipNo: '',
    status: 'VALID',
    purpose: 'GENERAL_HEALTH',
    issueDate: dayjs(),
    expiryDate: dayjs().add(6, 'month'),
    issuedBy: 'Dr. John Smith',
    rabiesVaccinated: true,
    clinicalNotes: '',
  },
});

const { value: certificateNo, errorMessage: certificateNoError } = useField<string>('certificateNo');
const { value: petName, errorMessage: petNameError } = useField<string>('petName');
const { value: species } = useField<string>('species');
const { value: breed } = useField<string>('breed');
const { value: ownerName, errorMessage: ownerNameError } = useField<string>('ownerName');
const { value: ownerPhone } = useField<string>('ownerPhone');
const { value: microchipNo } = useField<string>('microchipNo');
const { value: status } = useField<HealthCertificateStatus>('status');
const { value: purpose } = useField<HealthCertificatePurpose>('purpose');
const { value: issueDate } = useField<dayjs.Dayjs | null>('issueDate');
const { value: expiryDate } = useField<dayjs.Dayjs | null>('expiryDate');
const { value: issuedBy } = useField<string>('issuedBy');
const { value: rabiesVaccinated } = useField<boolean>('rabiesVaccinated');
const { value: clinicalNotes } = useField<string>('clinicalNotes');

const statusOptions = computed(() => [
  { value: 'VALID', label: t('healthCertificate.statusVal.valid') },
  { value: 'EXPIRED', label: t('healthCertificate.statusVal.expired') },
  { value: 'REVOKED', label: t('healthCertificate.statusVal.revoked') },
]);

const purposeOptions = computed(() => [
  { value: 'DOMESTIC_TRAVEL', label: t('healthCertificate.purposeVal.domesticTravel') },
  { value: 'INTERNATIONAL_EXPORT', label: t('healthCertificate.purposeVal.internationalExport') },
  { value: 'GENERAL_HEALTH', label: t('healthCertificate.purposeVal.generalHealth') },
  { value: 'SHOW_COMPETITION', label: t('healthCertificate.purposeVal.showCompetition') },
]);

const speciesOptions = [
  { value: 'Dog', label: t('pet.speciesOptions.dog') },
  { value: 'Cat', label: t('pet.speciesOptions.cat') },
  { value: 'Bird', label: t('pet.speciesOptions.bird') },
  { value: 'Other', label: t('pet.speciesOptions.other') },
];

watch(
  () => props.open,
  isOpen => {
    if (isOpen) {
      if (props.initialData) {
        setValues({
          certificateNo: props.initialData.certificateNo,
          petName: props.initialData.petName,
          species: props.initialData.species || 'Dog',
          breed: props.initialData.breed || '',
          ownerName: props.initialData.ownerName,
          ownerPhone: props.initialData.ownerPhone || '',
          microchipNo: props.initialData.microchipNo || '',
          status: props.initialData.status,
          purpose: props.initialData.purpose,
          issueDate: props.initialData.issueDate ? dayjs(props.initialData.issueDate) : null,
          expiryDate: props.initialData.expiryDate ? dayjs(props.initialData.expiryDate) : null,
          issuedBy: props.initialData.issuedBy || '',
          rabiesVaccinated: props.initialData.rabiesVaccinated ?? true,
          clinicalNotes: props.initialData.clinicalNotes || '',
        });
      } else {
        resetForm({
          values: {
            certificateNo: `HC-2026-${String(Math.floor(Math.random() * 900) + 100)}`,
            petName: '',
            species: 'Dog',
            breed: '',
            ownerName: '',
            ownerPhone: '',
            microchipNo: '',
            status: 'VALID',
            purpose: 'GENERAL_HEALTH',
            issueDate: dayjs(),
            expiryDate: dayjs().add(6, 'month'),
            issuedBy: 'Dr. John Smith',
            rabiesVaccinated: true,
            clinicalNotes: '',
          },
        });
      }
    }
  },
);

const onSubmit = handleSubmit(async values => {
  const payload: Partial<HealthCertificate> = {
    certificateNo: values.certificateNo,
    petName: values.petName,
    species: values.species,
    breed: values.breed || undefined,
    ownerName: values.ownerName,
    ownerPhone: values.ownerPhone || undefined,
    microchipNo: values.microchipNo || undefined,
    status: values.status,
    purpose: values.purpose,
    issueDate: values.issueDate ? values.issueDate.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
    expiryDate: values.expiryDate
      ? values.expiryDate.format('YYYY-MM-DD')
      : dayjs().add(6, 'month').format('YYYY-MM-DD'),
    issuedBy: values.issuedBy || 'Dr. John Smith',
    rabiesVaccinated: values.rabiesVaccinated,
    clinicalNotes: values.clinicalNotes || undefined,
  };

  try {
    let res;
    if (props.certificateId) {
      res = await certStore.updateCertificate(props.certificateId, payload);
    } else {
      res = await certStore.createCertificate(payload);
    }

    if (res.success) {
      emit('success');
      emit('update:open', false);
    }
  } catch (error) {
    // handled by store/toast
  }
});
</script>

<template>
  <ModalLayout
    :open="open"
    :title="props.certificateId ? t('healthCertificate.editCertificate') : t('healthCertificate.issueCertificate')"
    @update:open="emit('update:open', $event)"
    @ok="onSubmit"
    @cancel="() => emit('update:open', false)"
    :loading="loading || isSubmitting"
    :ok-text="t('save')"
    :cancel-text="t('cancel')"
    :width="640"
  >
    <div class="pt-4">
      <a-form layout="vertical" class="flex flex-col gap-4">
        <!-- Row 1: Certificate No & Status -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <a-form-item
            name="certificateNo"
            class="mb-0"
            :validate-status="certificateNoError ? 'error' : ''"
            :help="certificateNoError"
          >
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                t('healthCertificate.certificateNo')
              }}</span>
            </template>
            <a-input v-model:value="certificateNo" size="large" :placeholder="t('healthCertificate.certificateNo')" />
          </a-form-item>

          <a-form-item name="status" class="mb-0">
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                t('healthCertificate.status')
              }}</span>
            </template>
            <a-select v-model:value="status" size="large" :options="statusOptions" />
          </a-form-item>
        </div>

        <!-- Row 2: Pet Name & Species & Breed -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <a-form-item name="petName" class="mb-0" :validate-status="petNameError ? 'error' : ''" :help="petNameError">
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                t('healthCertificate.petName')
              }}</span>
            </template>
            <a-input v-model:value="petName" size="large" :placeholder="t('healthCertificate.petName')" />
          </a-form-item>

          <a-form-item name="species" class="mb-0">
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                t('healthCertificate.species')
              }}</span>
            </template>
            <a-select v-model:value="species" size="large" :options="speciesOptions" />
          </a-form-item>

          <a-form-item name="breed" class="mb-0">
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                t('healthCertificate.breed')
              }}</span>
            </template>
            <a-input v-model:value="breed" size="large" :placeholder="t('healthCertificate.breed')" />
          </a-form-item>
        </div>

        <!-- Row 3: Owner Name & Owner Phone -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <a-form-item
            name="ownerName"
            class="mb-0"
            :validate-status="ownerNameError ? 'error' : ''"
            :help="ownerNameError"
          >
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                t('healthCertificate.ownerName')
              }}</span>
            </template>
            <a-input v-model:value="ownerName" size="large" :placeholder="t('healthCertificate.ownerName')" />
          </a-form-item>

          <a-form-item name="ownerPhone" class="mb-0">
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                t('healthCertificate.ownerPhone')
              }}</span>
            </template>
            <a-input v-model:value="ownerPhone" size="large" :placeholder="t('healthCertificate.ownerPhone')" />
          </a-form-item>
        </div>

        <!-- Row 4: Microchip No & Purpose -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <a-form-item name="microchipNo" class="mb-0">
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                t('healthCertificate.microchipNo')
              }}</span>
            </template>
            <a-input v-model:value="microchipNo" size="large" :placeholder="t('healthCertificate.microchipNo')" />
          </a-form-item>

          <a-form-item name="purpose" class="mb-0">
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                t('healthCertificate.purpose')
              }}</span>
            </template>
            <a-select v-model:value="purpose" size="large" :options="purposeOptions" />
          </a-form-item>
        </div>

        <!-- Row 5: Issue Date & Expiry Date -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <a-form-item name="issueDate" class="mb-0">
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                t('healthCertificate.issueDate')
              }}</span>
            </template>
            <a-date-picker v-model:value="issueDate" size="large" class="w-full" format="YYYY-MM-DD" />
          </a-form-item>

          <a-form-item name="expiryDate" class="mb-0">
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                t('healthCertificate.expiryDate')
              }}</span>
            </template>
            <a-date-picker v-model:value="expiryDate" size="large" class="w-full" format="YYYY-MM-DD" />
          </a-form-item>
        </div>

        <!-- Row 6: Issued By & Rabies Status -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-center">
          <a-form-item name="issuedBy" class="mb-0">
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                t('healthCertificate.issuedBy')
              }}</span>
            </template>
            <a-input v-model:value="issuedBy" size="large" :placeholder="t('healthCertificate.issuedBy')" />
          </a-form-item>

          <a-form-item name="rabiesVaccinated" class="mb-0 pt-2 sm:pt-6">
            <div class="flex items-center gap-3">
              <a-switch v-model:checked="rabiesVaccinated" />
              <span class="text-text text-sm font-medium">{{ t('healthCertificate.rabiesVaccinated') }}</span>
            </div>
          </a-form-item>
        </div>

        <!-- Row 7: Clinical Notes -->
        <a-form-item name="clinicalNotes" class="mb-0">
          <template #label>
            <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
              t('healthCertificate.clinicalNotes')
            }}</span>
          </template>
          <a-textarea
            v-model:value="clinicalNotes"
            :rows="3"
            size="large"
            :placeholder="t('healthCertificate.clinicalNotes')"
          />
        </a-form-item>
      </a-form>
    </div>
  </ModalLayout>
</template>
