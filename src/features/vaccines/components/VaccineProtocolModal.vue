<script setup lang="ts">
import { computed, watch } from 'vue';
import { useLocale } from '@/shared/composables/useLocale';
import { useVaccineStore } from '@/store/vaccineStore';
import { storeToRefs } from 'pinia';
import ModalLayout from '@/layouts/ModalLayout.vue';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import type { VaccineProtocol } from '@/shared/types/vaccine.type';

interface FormValues {
  species: 'dog' | 'cat';
  disease: string;
  ageRange: string;
  vaccineCode: string;
  isRequired: boolean;
  description?: string;
}

const props = defineProps<{
  open: boolean;
  protocolId: string | null;
  initialData?: VaccineProtocol | null;
}>();

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'success'): void;
}>();

const { t } = useLocale();
const vaccineStore = useVaccineStore();
const { loading } = storeToRefs(vaccineStore);

const schema = yup.object({
  species: yup.string().required(t('required')),
  disease: yup.string().required(t('required')),
  ageRange: yup.string().required(t('required')),
  vaccineCode: yup.string().required(t('required')),
  isRequired: yup.boolean().required(t('required')),
  description: yup.string().nullable(),
});

const { handleSubmit, isSubmitting, setValues, resetForm } = useForm<FormValues>({
  validationSchema: schema,
  initialValues: {
    species: 'dog',
    disease: '',
    ageRange: '',
    vaccineCode: '',
    isRequired: true,
    description: '',
  },
});

const { value: species, errorMessage: speciesError } = useField<'dog' | 'cat'>('species');
const { value: disease, errorMessage: diseaseError } = useField<string>('disease');
const { value: ageRange, errorMessage: ageRangeError } = useField<string>('ageRange');
const { value: vaccineCode, errorMessage: vaccineCodeError } = useField<string>('vaccineCode');
const { value: isRequired } = useField<boolean>('isRequired');
const { value: description } = useField<string>('description');

const speciesOptions = [
  { value: 'dog', label: t('vaccine.speciesOptions.dog') },
  { value: 'cat', label: t('vaccine.speciesOptions.cat') },
];

const vaccineOptions = computed(() => vaccineStore.getActiveVaccinesOptions());

watch(
  () => props.open,
  isOpen => {
    if (isOpen) {
      if (props.initialData) {
        setValues({
          species: props.initialData.species,
          disease: props.initialData.disease,
          ageRange: props.initialData.ageRange,
          vaccineCode: props.initialData.vaccineCode,
          isRequired: props.initialData.isRequired,
          description: props.initialData.description || '',
        });
      } else {
        resetForm();
        // Autofill from active store context filters
        setValues({
          species: vaccineStore.protocolFilters.species || 'dog',
          disease: vaccineStore.protocolFilters.disease || '',
          ageRange: '',
          vaccineCode: '',
          isRequired: true,
          description: '',
        });
      }
    }
  },
);

const onSubmit = handleSubmit(async values => {
  const payload: Partial<VaccineProtocol> = {
    species: values.species,
    disease: values.disease,
    ageRange: values.ageRange,
    vaccineCode: values.vaccineCode,
    isRequired: values.isRequired,
    description: values.description || undefined,
  };

  try {
    let res;
    if (props.protocolId) {
      res = await vaccineStore.updateProtocol(props.protocolId, payload);
    } else {
      res = await vaccineStore.createProtocol(payload);
    }

    if (res.success) {
      emit('success');
      emit('update:open', false);
    }
  } catch (error) {
    // Handled in store actions
  }
});
</script>

<template>
  <ModalLayout
    :open="open"
    :title="props.protocolId ? t('vaccine.editProtocol') : t('vaccine.addProtocol')"
    @update:open="emit('update:open', $event)"
    @ok="onSubmit"
    @cancel="() => emit('update:open', false)"
    :loading="loading || isSubmitting"
    :ok-text="t('save')"
    :cancel-text="t('cancel')"
    :width="480"
  >
    <div class="pt-4">
      <a-form layout="vertical" class="flex flex-col gap-4">
        <!-- Species & Disease fields -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <a-form-item name="species" class="mb-0" :validate-status="speciesError ? 'error' : ''" :help="speciesError">
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                t('vaccine.species')
              }}</span>
            </template>
            <a-select v-model:value="species" size="large" :options="speciesOptions" />
          </a-form-item>

          <a-form-item name="disease" class="mb-0" :validate-status="diseaseError ? 'error' : ''" :help="diseaseError">
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                t('vaccine.disease')
              }}</span>
            </template>
            <a-input v-model:value="disease" size="large" placeholder="e.g. Rabies, Parvo" />
          </a-form-item>
        </div>

        <!-- Vaccine selection & Age Range fields -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <a-form-item
            name="vaccineCode"
            class="mb-0"
            :validate-status="vaccineCodeError ? 'error' : ''"
            :help="vaccineCodeError"
          >
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                t('vaccine.vaccine')
              }}</span>
            </template>
            <a-select
              v-model:value="vaccineCode"
              size="large"
              :options="vaccineOptions"
              :placeholder="t('vaccine.vaccine')"
            />
          </a-form-item>

          <a-form-item
            name="ageRange"
            class="mb-0"
            :validate-status="ageRangeError ? 'error' : ''"
            :help="ageRangeError"
          >
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                t('vaccine.ageRange')
              }}</span>
            </template>
            <a-input v-model:value="ageRange" size="large" placeholder="e.g. 6-8 weeks, 1 year booster" />
          </a-form-item>
        </div>

        <!-- Requirement toggle -->
        <div class="grid grid-cols-1">
          <a-form-item name="isRequired" class="mb-0">
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                t('vaccine.requiredStatus')
              }}</span>
            </template>
            <div class="flex h-10 items-center gap-3">
              <a-switch v-model:checked="isRequired" />
              <span class="text-text text-sm font-medium">
                {{ isRequired ? t('vaccine.core') : t('vaccine.nonCore') }}
              </span>
            </div>
          </a-form-item>
        </div>

        <!-- Description description field -->
        <div class="grid grid-cols-1">
          <a-form-item name="description" class="mb-0">
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                t('vaccine.description')
              }}</span>
            </template>
            <a-textarea v-model:value="description" :rows="3" placeholder="Immunization context or guidelines..." />
          </a-form-item>
        </div>
      </a-form>
    </div>
  </ModalLayout>
</template>
