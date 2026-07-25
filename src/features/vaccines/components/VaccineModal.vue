<script setup lang="ts">
import { computed, watch } from 'vue';
import { useLocale } from '@/shared/composables/useLocale';
import { useVaccineStore } from '@/store/vaccineStore';
import { storeToRefs } from 'pinia';
import ModalLayout from '@/layouts/ModalLayout.vue';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import type { Vaccine } from '@/shared/types/vaccine.type';

interface FormValues {
  code: string;
  name: string;
  disease: string;
  manufacturer?: string;
  species: string;
  type: string;
  dose: string;
  intervalDays: number;
  boosterRequired: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  description?: string;
}

const props = defineProps<{
  open: boolean;
  vaccineId: string | null;
  initialData?: Vaccine | null;
}>();

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'success'): void;
}>();

const { t } = useLocale();
const vaccineStore = useVaccineStore();
const { loading } = storeToRefs(vaccineStore);

const schema = yup.object({
  code: yup.string().required(t('required')),
  name: yup.string().required(t('required')),
  disease: yup.string().required(t('required')),
  manufacturer: yup.string().nullable(),
  species: yup.string().required(t('required')),
  type: yup.string().required(t('required')),
  dose: yup.string().required(t('required')),
  intervalDays: yup.number().min(1).required(t('required')),
  boosterRequired: yup.boolean().required(),
  status: yup.string().required(t('required')),
  description: yup.string().nullable(),
});

const { handleSubmit, isSubmitting, setValues, resetForm } = useForm<FormValues>({
  validationSchema: schema,
  initialValues: {
    code: '',
    name: '',
    disease: '',
    manufacturer: '',
    species: 'dog',
    type: 'Core vaccine',
    dose: '1 ml',
    intervalDays: 365,
    boosterRequired: true,
    status: 'ACTIVE',
    description: '',
  },
});

const { value: code, errorMessage: codeError } = useField<string>('code');
const { value: name, errorMessage: nameError } = useField<string>('name');
const { value: disease, errorMessage: diseaseError } = useField<string>('disease');
const { value: manufacturer } = useField<string>('manufacturer');
const { value: species } = useField<string>('species');
const { value: type } = useField<string>('type');
const { value: dose } = useField<string>('dose');
const { value: intervalDays } = useField<number>('intervalDays');
const { value: boosterRequired } = useField<boolean>('boosterRequired');
const { value: status } = useField<'ACTIVE' | 'INACTIVE'>('status');
const { value: description } = useField<string>('description');

const speciesOptions = computed(() => [
  { value: 'dog', label: t('vaccine.speciesOptions.dog') },
  { value: 'cat', label: t('vaccine.speciesOptions.cat') },
]);

const typeOptions = [
  { value: 'Core vaccine', label: 'Core vaccine (Bắt buộc)' },
  { value: 'Non-core vaccine', label: 'Non-core vaccine (Khuyến khích)' },
  { value: 'Risk-based vaccine', label: 'Risk-based vaccine (Theo nguy cơ)' },
];

const statusOptions = computed(() => [
  { value: 'ACTIVE', label: t('vaccine.status.active') },
  { value: 'INACTIVE', label: t('vaccine.status.inactive') },
]);

watch(
  () => props.open,
  isOpen => {
    if (isOpen) {
      if (props.initialData) {
        setValues({
          code: props.initialData.code,
          name: props.initialData.name,
          disease: props.initialData.disease,
          manufacturer: props.initialData.manufacturer || '',
          species: props.initialData.species || 'dog',
          type: props.initialData.type || 'Core vaccine',
          dose: props.initialData.dose || '1 ml',
          intervalDays: props.initialData.intervalDays || 365,
          boosterRequired: props.initialData.boosterRequired ?? true,
          status: props.initialData.status,
          description: props.initialData.description || '',
        });
      } else {
        resetForm({
          values: {
            code: `VAC-${Math.floor(Math.random() * 900) + 100}`,
            name: '',
            disease: '',
            manufacturer: '',
            species: 'dog',
            type: 'Core vaccine',
            dose: '1 ml',
            intervalDays: 365,
            boosterRequired: true,
            status: 'ACTIVE',
            description: '',
          },
        });
      }
    }
  },
);

const onSubmit = handleSubmit(async values => {
  const payload: Partial<Vaccine> = {
    code: values.code,
    name: values.name,
    disease: values.disease,
    manufacturer: values.manufacturer || undefined,
    species: values.species,
    type: values.type,
    dose: values.dose,
    intervalDays: Number(values.intervalDays) || 365,
    boosterRequired: values.boosterRequired,
    status: values.status,
    description: values.description || undefined,
  };

  try {
    let res;
    if (props.vaccineId) {
      res = await vaccineStore.updateVaccine(props.vaccineId, payload);
    } else {
      res = await vaccineStore.createVaccine(payload);
    }

    if (res.success) {
      emit('success');
      emit('update:open', false);
    }
  } catch (error) {
    // handled by store
  }
});
</script>

<template>
  <ModalLayout
    :open="open"
    :title="props.vaccineId ? t('vaccine.editVaccine') : t('vaccine.addVaccine')"
    @update:open="emit('update:open', $event)"
    @ok="onSubmit"
    @cancel="() => emit('update:open', false)"
    :loading="loading || isSubmitting"
    :ok-text="t('save')"
    :cancel-text="t('cancel')"
    :width="600"
  >
    <div class="pt-4">
      <a-form layout="vertical" class="flex flex-col gap-4">
        <!-- Code & Name -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <a-form-item name="code" class="mb-0" :validate-status="codeError ? 'error' : ''" :help="codeError">
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                t('vaccine.code')
              }}</span>
            </template>
            <a-input v-model:value="code" size="large" :placeholder="t('vaccine.code')" />
          </a-form-item>

          <a-form-item name="name" class="mb-0" :validate-status="nameError ? 'error' : ''" :help="nameError">
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                t('vaccine.vaccine')
              }}</span>
            </template>
            <a-input v-model:value="name" size="large" :placeholder="t('vaccine.vaccine')" />
          </a-form-item>
        </div>

        <!-- Disease & Manufacturer -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <a-form-item name="disease" class="mb-0" :validate-status="diseaseError ? 'error' : ''" :help="diseaseError">
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                t('vaccine.disease')
              }}</span>
            </template>
            <a-input v-model:value="disease" size="large" :placeholder="t('vaccine.disease')" />
          </a-form-item>

          <a-form-item name="manufacturer" class="mb-0">
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                t('vaccine.manufacturer')
              }}</span>
            </template>
            <a-input v-model:value="manufacturer" size="large" :placeholder="t('vaccine.manufacturer')" />
          </a-form-item>
        </div>

        <!-- Species & Type & Status -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <a-form-item name="species" class="mb-0">
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                t('vaccine.species')
              }}</span>
            </template>
            <a-select v-model:value="species" size="large" :options="speciesOptions" />
          </a-form-item>

          <a-form-item name="type" class="mb-0">
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                t('vaccine.type')
              }}</span>
            </template>
            <a-select v-model:value="type" size="large" :options="typeOptions" />
          </a-form-item>

          <a-form-item name="status" class="mb-0">
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                t('status')
              }}</span>
            </template>
            <a-select v-model:value="status" size="large" :options="statusOptions" />
          </a-form-item>
        </div>

        <!-- Dose & Interval & Booster -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:items-center">
          <a-form-item name="dose" class="mb-0">
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                t('vaccine.dose')
              }}</span>
            </template>
            <a-input v-model:value="dose" size="large" placeholder="1 ml" />
          </a-form-item>

          <a-form-item name="intervalDays" class="mb-0">
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                t('vaccine.interval')
              }} (ngày)</span>
            </template>
            <a-input-number v-model:value="intervalDays" size="large" class="w-full" :min="1" />
          </a-form-item>

          <a-form-item name="boosterRequired" class="mb-0 pt-2 sm:pt-6">
            <div class="flex items-center gap-3">
              <a-switch v-model:checked="boosterRequired" />
              <span class="text-text text-xs font-semibold uppercase">{{ t('vaccine.booster') }}</span>
            </div>
          </a-form-item>
        </div>

        <!-- Description -->
        <a-form-item name="description" class="mb-0">
          <template #label>
            <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
              t('vaccine.description')
            }}</span>
          </template>
          <a-textarea v-model:value="description" :rows="3" size="large" :placeholder="t('vaccine.description')" />
        </a-form-item>
      </a-form>
    </div>
  </ModalLayout>
</template>
