<script setup lang="ts">
import { watch } from 'vue';
import { useLocale } from '@/shared/composables/useLocale';
import { useMicrochipStore } from '@/store/microchipStore';
import { storeToRefs } from 'pinia';
import ModalLayout from '@/layouts/ModalLayout.vue';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import dayjs from 'dayjs';
import type { Microchip } from '@/shared/types/microchip.type';

interface FormValues {
  microchipNo: string;
  status: 'AVAILABLE' | 'IMPLANTED' | 'DEFECTIVE';
  manufacturer?: string;
  petName?: string;
  ownerName?: string;
  implantDate?: dayjs.Dayjs | null;
  implantLocation?: string;
  implantedBy?: string;
}

const props = defineProps<{
  open: boolean;
  microchipId: string | null;
  initialData?: Microchip | null;
}>();

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'success'): void;
}>();

const { t } = useLocale();
const microchipStore = useMicrochipStore();
const { loading } = storeToRefs(microchipStore);

const schema = yup.object({
  microchipNo: yup.string().required(t('required')),
  status: yup.string().required(t('required')),
  manufacturer: yup.string().nullable(),
  petName: yup.string().nullable(),
  ownerName: yup.string().nullable(),
  implantDate: yup.mixed().nullable(),
  implantLocation: yup.string().nullable(),
  implantedBy: yup.string().nullable(),
});

const { handleSubmit, isSubmitting, setValues, resetForm } = useForm<FormValues>({
  validationSchema: schema,
  initialValues: {
    microchipNo: '',
    status: 'AVAILABLE',
    manufacturer: '',
    petName: '',
    ownerName: '',
    implantDate: null,
    implantLocation: '',
    implantedBy: '',
  },
});

const { value: microchipNo, errorMessage: microchipNoError } = useField<string>('microchipNo');
const { value: status, errorMessage: statusError } = useField<'AVAILABLE' | 'IMPLANTED' | 'DEFECTIVE'>('status');
const { value: manufacturer } = useField<string>('manufacturer');
const { value: petName } = useField<string>('petName');
const { value: ownerName } = useField<string>('ownerName');
const { value: implantDate } = useField<dayjs.Dayjs | null>('implantDate');
const { value: implantLocation } = useField<string>('implantLocation');
const { value: implantedBy } = useField<string>('implantedBy');

const statusOptions = [
  { value: 'AVAILABLE', label: t('microchip.available') },
  { value: 'IMPLANTED', label: t('microchip.implanted') },
  { value: 'DEFECTIVE', label: t('microchip.defective') },
];

watch(
  () => props.open,
  isOpen => {
    if (isOpen) {
      if (props.initialData) {
        setValues({
          microchipNo: props.initialData.microchipNo,
          status: props.initialData.status,
          manufacturer: props.initialData.manufacturer || '',
          petName: props.initialData.petName || '',
          ownerName: props.initialData.ownerName || '',
          implantDate: props.initialData.implantDate ? dayjs(props.initialData.implantDate) : null,
          implantLocation: props.initialData.implantLocation || '',
          implantedBy: props.initialData.implantedBy || '',
        });
      } else {
        resetForm();
      }
    }
  },
);

const onSubmit = handleSubmit(async values => {
  const payload: Partial<Microchip> = {
    microchipNo: values.microchipNo,
    status: values.status,
    manufacturer: values.manufacturer || undefined,
  };

  if (values.status === 'IMPLANTED') {
    payload.petName = values.petName || undefined;
    payload.ownerName = values.ownerName || undefined;
    payload.implantDate = values.implantDate ? values.implantDate.format('YYYY-MM-DD') : undefined;
    payload.implantLocation = values.implantLocation || undefined;
    payload.implantedBy = values.implantedBy || undefined;
  }

  try {
    let res;
    if (props.microchipId) {
      res = await microchipStore.updateMicrochip(props.microchipId, payload);
    } else {
      res = await microchipStore.createMicrochip(payload);
    }

    if (res.success) {
      emit('success');
      emit('update:open', false);
    }
  } catch (error: any) {
    // API logic handles display / error reporting
  }
});
</script>

<template>
  <ModalLayout
    :open="open"
    :title="props.microchipId ? t('microchip.editMicrochip') : t('microchip.addMicrochip')"
    @update:open="emit('update:open', $event)"
    @ok="onSubmit"
    @cancel="() => emit('update:open', false)"
    :loading="loading || isSubmitting"
    :ok-text="t('save')"
    :cancel-text="t('cancel')"
    :width="540"
  >
    <div class="pt-4">
      <a-form layout="vertical" class="flex flex-col gap-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <a-form-item
            name="microchipNo"
            class="mb-0"
            :validate-status="microchipNoError ? 'error' : ''"
            :help="microchipNoError"
          >
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                t('microchip.microchipNo')
              }}</span>
            </template>
            <a-input v-model:value="microchipNo" size="large" :placeholder="t('microchip.microchipNo')" />
          </a-form-item>

          <a-form-item name="status" class="mb-0" :validate-status="statusError ? 'error' : ''" :help="statusError">
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                t('microchip.status')
              }}</span>
            </template>
            <a-select v-model:value="status" size="large" :options="statusOptions" />
          </a-form-item>
        </div>

        <div class="grid grid-cols-1 gap-4">
          <a-form-item name="manufacturer" class="mb-0">
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                t('microchip.manufacturer')
              }}</span>
            </template>
            <a-input v-model:value="manufacturer" size="large" :placeholder="t('microchip.manufacturer')" />
          </a-form-item>
        </div>

        <!-- Conditional fields when status is IMPLANTED -->
        <transition name="fade">
          <div
            v-if="status === 'IMPLANTED'"
            class="bg-primary-soft/30 border-divider mt-2 flex flex-col gap-4 rounded border p-4"
          >
            <h3 class="font-ibm text-primary text-xs font-bold tracking-wider uppercase">Implantation Details</h3>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <a-form-item name="petName" class="mb-0">
                <template #label>
                  <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                    t('microchip.petName')
                  }}</span>
                </template>
                <a-input v-model:value="petName" size="large" :placeholder="t('microchip.petName')" />
              </a-form-item>

              <a-form-item name="ownerName" class="mb-0">
                <template #label>
                  <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                    t('microchip.ownerName')
                  }}</span>
                </template>
                <a-input v-model:value="ownerName" size="large" :placeholder="t('microchip.ownerName')" />
              </a-form-item>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <a-form-item name="implantDate" class="mb-0">
                <template #label>
                  <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                    t('microchip.implantDate')
                  }}</span>
                </template>
                <a-date-picker v-model:value="implantDate" size="large" class="w-full" format="YYYY-MM-DD" />
              </a-form-item>

              <a-form-item name="implantedBy" class="mb-0">
                <template #label>
                  <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                    t('microchip.implantedBy')
                  }}</span>
                </template>
                <a-input v-model:value="implantedBy" size="large" :placeholder="t('microchip.implantedBy')" />
              </a-form-item>
            </div>

            <div class="grid grid-cols-1 gap-4">
              <a-form-item name="implantLocation" class="mb-0">
                <template #label>
                  <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                    t('microchip.implantLocation')
                  }}</span>
                </template>
                <a-input v-model:value="implantLocation" size="large" :placeholder="t('microchip.implantLocation')" />
              </a-form-item>
            </div>
          </div>
        </transition>
      </a-form>
    </div>
  </ModalLayout>
</template>
