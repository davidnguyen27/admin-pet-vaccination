<script setup lang="ts">
import dayjs, { type Dayjs } from 'dayjs';
import { reactive, ref, watch } from 'vue';
import { message, type FormInstance } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
import type { PetBody, Species } from '../pet.api';
import { petApi } from '../pet.api';
import type { Pet } from '../pet.type';
import type { Owner } from '../../users';
import ModalAction from '@/components/ui/ModalAction.vue';

const props = defineProps<{
  open: boolean;
  loading: boolean;
  initialValues?: Pet | null;
}>();

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'submit', values: PetBody): void;
  (e: 'cancel'): void;
}>();

const formRef = ref<FormInstance>();
const loadingOwners = ref(false);
const loadingSpecies = ref(false);
const owners = ref<Owner[]>([]);
const species = ref<Species[]>([]);

const formState = reactive<{
  ownerId: string;
  speciesId: string;
  name: string;
  sex: string;
  dob: Dayjs | null;
  weight: number | null;
  color: string;
  breed: string;
  note: string;
  isSterilized: boolean;
}>({
  ownerId: '',
  speciesId: '',
  name: '',
  sex: '',
  dob: null,
  weight: null,
  color: '',
  breed: '',
  note: '',
  isSterilized: false,
});

const resetForm = () => {
  Object.assign(formState, {
    ownerId: '',
    speciesId: '',
    name: '',
    sex: '',
    dob: null,
    weight: null,
    color: '',
    breed: '',
    note: '',
    isSterilized: false,
  });
};

const normalizeDob = (value?: string | null): Dayjs | null => {
  if (!value) {
    return null;
  }

  const parsed = dayjs(value);
  return parsed.isValid() ? parsed : null;
};

const fetchOwners = async () => {
  loadingOwners.value = true;
  try {
    const response = await petApi.getAllOwners();
    if (response?.data) {
      owners.value = response.data as any;
    }
  } catch (error: any) {
    console.error('Failed to fetch owners:', error);
    message.error(error);
  } finally {
    loadingOwners.value = false;
  }
};

const fetchSpecies = async () => {
  loadingSpecies.value = true;
  try {
    const response = await petApi.getAllSpecies();
    if (response?.data) {
      species.value = response.data as any;
    }
  } catch (error) {
    console.error('Failed to fetch species:', error);
  } finally {
    loadingSpecies.value = false;
  }
};

const rules: Record<string, Rule[]> = {
  ownerId: [{ required: true, message: 'Please select owner', trigger: 'change' }],
  speciesId: [{ required: true, message: 'Please select species', trigger: 'change' }],
  name: [{ required: true, message: 'Please enter pet name', trigger: 'blur' }],
  sex: [{ required: true, message: 'Please select sex', trigger: 'change' }],
  dob: [{ required: true, message: 'Please select date of birth', trigger: 'change' }],
  weight: [{ required: true, message: 'Please enter weight', trigger: 'change' }],
};

const handleCancel = () => {
  emit('update:open', false);
  emit('cancel');
};

const onFinish = async () => {
  await formRef.value?.validate();

  const payload: PetBody = {
    ownerId: formState.ownerId.trim(),
    speciesId: formState.speciesId.trim(),
    name: formState.name.trim(),
    sex: formState.sex,
    dob: formState.dob ? formState.dob.format('YYYY-MM-DD') : '',
    weight: Number(formState.weight ?? 0),
    color: formState.color.trim(),
    breed: formState.breed.trim(),
    note: formState.note.trim(),
    isSterilized: formState.isSterilized,
  };

  emit('submit', payload);
};

watch(
  () => props.open,
  value => {
    if (value) {
      void fetchOwners();
      void fetchSpecies();

      if (props.initialValues) {
        Object.assign(formState, {
          ownerId: props.initialValues.owner?.id || '',
          speciesId: props.initialValues.species?.id || '',
          name: props.initialValues.name || '',
          sex: props.initialValues.sex || '',
          dob: normalizeDob(props.initialValues.dob),
          weight: props.initialValues.weight ?? null,
          color: props.initialValues.color || '',
          breed: props.initialValues.breed || '',
          note: props.initialValues.note || '',
          isSterilized: Boolean(props.initialValues.isSterilized),
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
    :title="initialValues ? 'Update Pet' : 'Create New Pet'"
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
        <a-form-item label="Pet Name" name="name">
          <a-input v-model:value="formState.name" placeholder="Enter pet name" />
        </a-form-item>

        <a-form-item label="Sex" name="sex">
          <a-select v-model:value="formState.sex" placeholder="Select sex">
            <a-select-option value="MALE">Male</a-select-option>
            <a-select-option value="FEMALE">Female</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="Owner" name="ownerId">
          <a-select
            v-model:value="formState.ownerId"
            placeholder="Select owner"
            :loading="loadingOwners"
            :options="
              owners.map(owner => ({
                label: `${owner.user?.fullName || 'Unknown'} (${owner.user?.email})`,
                value: owner.id,
              }))
            "
          />
        </a-form-item>

        <a-form-item label="Species" name="speciesId">
          <a-select
            v-model:value="formState.speciesId"
            placeholder="Select species"
            :loading="loadingSpecies"
            :options="
              species.map(s => ({
                label: s.name,
                value: s.id,
              }))
            "
          />
        </a-form-item>

        <a-form-item label="Date of Birth" name="dob">
          <a-date-picker v-model:value="formState.dob" class="w-full" format="YYYY-MM-DD" />
        </a-form-item>

        <a-form-item label="Weight (kg)" name="weight">
          <a-input-number v-model:value="formState.weight" :min="0" :step="0.1" class="w-full" placeholder="0.0" />
        </a-form-item>

        <a-form-item label="Breed" name="breed">
          <a-input v-model:value="formState.breed" placeholder="Enter breed" />
        </a-form-item>

        <a-form-item label="Color" name="color">
          <a-input v-model:value="formState.color" placeholder="Enter color" />
        </a-form-item>

        <a-form-item label="Sterilized" name="isSterilized" class="sm:col-span-2">
          <a-switch v-model:checked="formState.isSterilized" checked-children="Yes" un-checked-children="No" />
        </a-form-item>

        <a-form-item label="Notes" name="note" class="sm:col-span-2">
          <a-textarea v-model:value="formState.note" :rows="3" placeholder="Additional notes about the pet" />
        </a-form-item>
      </div>
    </a-form>

    <template #footer>
      <modal-action
        :loading="loading"
        :submit-text="initialValues ? 'Update Pet' : 'Create Pet'"
        @cancel="handleCancel"
        @submit="onFinish"
      />
    </template>
  </a-modal>
</template>
