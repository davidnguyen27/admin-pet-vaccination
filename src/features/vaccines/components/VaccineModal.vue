<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import type { FormInstance } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
import type { VaccineBody } from '../vaccine.api';
import type { Vaccine } from '../vaccine.type';
import InputText from '@/components/InputText.vue';
import InputNumber from '@/components/InputNumber.vue';
import InputArea from '@/components/InputArea.vue';
import SelectItem from '@/components/SelectItem.vue';
import ModalAction from '@/components/ui/ModalAction.vue';
import { petApi } from '@/features/pets';

const props = defineProps<{
  open: boolean;
  loading: boolean;
  initialValues?: Vaccine | null;
}>();

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'submit', values: VaccineBody): void;
  (e: 'cancel'): void;
}>();

const speciesOptions = ref<{ value: string; label: string }[]>([]);
const loadingSpecies = ref(false);
const formRef = ref<FormInstance>();

const formState = reactive<VaccineBody>({
  speciesId: '',
  code: '',
  name: '',
  brand: '',
  description: '',
  doseValue: 1,
  doseUnit: 'mL',
  status: 'ACTIVE',
  defaultTotalDoses: 1,
  defaultNextDueDays: 30,
});

const fetchSpecies = async () => {
  loadingSpecies.value = true;
  try {
    const response = await petApi.getAllSpecies();
    const species = response?.data as any;
    if (species?.length) {
      speciesOptions.value = species.map((item: any) => ({
        value: item.id,
        label: item.name,
      }));
    } else {
      speciesOptions.value = [];
    }
  } catch (error) {
    console.error('Failed to fetch species:', error);
  } finally {
    loadingSpecies.value = false;
  }
};

const rules: Record<string, Rule[]> = {
  speciesId: [{ required: true, message: 'Please enter species ID', trigger: 'blur' }],
  code: [{ required: true, message: 'Please enter vaccine code', trigger: 'blur' }],
  name: [{ required: true, message: 'Please enter vaccine name', trigger: 'blur' }],
  doseValue: [{ required: true, message: 'Please enter dose value', trigger: 'change' }],
  doseUnit: [{ required: true, message: 'Please select dose unit', trigger: 'change' }],
  status: [{ required: true, message: 'Please select status', trigger: 'change' }],
};

const doseUnitOptions = [
  { label: 'mL', value: 'mL' },
  { label: 'mG', value: 'mG' },
];

const statusOptions = [
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' },
];

const resetForm = () => {
  Object.assign(formState, {
    speciesId: '',
    code: '',
    name: '',
    brand: '',
    description: '',
    doseValue: 1,
    doseUnit: 'mL',
    status: 'ACTIVE',
    defaultTotalDoses: 1,
    defaultNextDueDays: 30,
  });
};

const handleCancel = () => {
  emit('update:open', false);
  emit('cancel');
};

const onFinish = async () => {
  await formRef.value?.validate();

  const payload: VaccineBody = {
    speciesId: formState.speciesId.trim(),
    code: formState.code.trim(),
    name: formState.name.trim(),
    brand: formState.brand.trim(),
    description: String(formState.description ?? '').trim(),
    doseValue: Number(formState.doseValue || 0),
    doseUnit: formState.doseUnit,
    status: formState.status,
    defaultTotalDoses: Number(formState.defaultTotalDoses || 0),
    defaultNextDueDays: Number(formState.defaultNextDueDays || 0),
  };

  emit('submit', payload);
};

watch(
  () => props.open,
  value => {
    if (value) {
      void fetchSpecies();

      if (props.initialValues) {
        Object.assign(formState, {
          speciesId: props.initialValues.speciesId || '',
          code: props.initialValues.code || '',
          name: props.initialValues.name || '',
          brand: props.initialValues.brand || '',
          description: props.initialValues.description || '',
          doseValue: props.initialValues.doseValue ?? 1,
          doseUnit: props.initialValues.doseUnit || 'mL',
          status: props.initialValues.status || 'ACTIVE',
          defaultTotalDoses: props.initialValues.defaultTotalDoses ?? 1,
          defaultNextDueDays: props.initialValues.defaultNextDueDays ?? 30,
        });
        return;
      }
    }

    if (!value) {
      resetForm();
      formRef.value?.clearValidate();
    }
  },
  { immediate: true },
);
</script>

<template>
  <a-modal
    :open="open"
    :title="initialValues ? 'Update Vaccine' : 'Create New Vaccine'"
    :confirm-loading="loading"
    centered
    destroy-on-close
    :width="760"
    class="premium-modal"
    @cancel="handleCancel"
    @ok="onFinish"
  >
    <a-form ref="formRef" layout="vertical" :model="formState" :rules="rules" @finish="onFinish" class="mt-4">
      <div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
        <input-text label="Code" name="code" v-model="formState.code" placeholder="e.g. RAB-CORE-01" />
        <input-text label="Vaccine's Name" name="name" v-model="formState.name" placeholder="Rabies" />
        <select-item
          label="Species"
          name="speciesId"
          v-model="formState.speciesId"
          :options="speciesOptions"
          :loading="loadingSpecies"
        />
        <input-number label="Dose Value" name="doseValue" v-model="formState.doseValue" :min="0" :step="0.1" />
        <input-number
          label="Default Total Doses"
          name="defaultTotalDoses"
          v-model="formState.defaultTotalDoses"
          :min="0"
          :step="0.1"
        />
        <input-number
          label="Default Next Due Days"
          name="defaultNextDueDays"
          v-model="formState.defaultNextDueDays"
          :min="0"
          :step="1"
        />
        <input-text label="Brand" name="brand" v-model="formState.brand" placeholder="Enter brand" />
        <select-item label="Dose Unit" name="doseUnit" v-model="formState.doseUnit" :options="doseUnitOptions" />
        <select-item label="Status" name="status" v-model="formState.status" :options="statusOptions" />
        <input-area label="Description" name="description" v-model="formState.description" :rows="3" />
      </div>
    </a-form>

    <template #footer>
      <modal-action
        :loading="loading"
        :submit-text="initialValues ? 'Update Vaccine' : 'Create Vaccine'"
        @cancel="handleCancel"
        @submit="onFinish"
      />
    </template>
  </a-modal>
</template>
