<script setup lang="ts">
import { computed, watch } from 'vue';
import { useLocale } from '@/shared/composables/useLocale';
import { useVaccineStore } from '@/store/vaccineStore';
import { storeToRefs } from 'pinia';
import ModalLayout from '@/layouts/ModalLayout.vue';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import dayjs from 'dayjs';
import type { VaccineLot } from '@/shared/types/vaccine.type';

interface FormValues {
  vaccineId: string;
  lotNo: string;
  manufacturer?: string;
  importDate?: dayjs.Dayjs | null;
  expiryDate?: dayjs.Dayjs | null;
  quantity: number;
  status: 'AVAILABLE' | 'LOW_STOCK' | 'EXPIRING' | 'EXPIRED';
}

const props = defineProps<{
  open: boolean;
  lotId: string | null;
  initialData?: VaccineLot | null;
}>();

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'success'): void;
}>();

const { t } = useLocale();
const vaccineStore = useVaccineStore();
const { loading, listVaccine } = storeToRefs(vaccineStore);

const vaccineOptions = computed(() => {
  return listVaccine.value.data.map(v => ({
    value: v.id,
    label: `${v.name} (${v.code})`,
  }));
});

const statusOptions = computed(() => [
  { value: 'AVAILABLE', label: t('vaccine.lotStatus.available') },
  { value: 'LOW_STOCK', label: t('vaccine.lotStatus.lowStock') },
  { value: 'EXPIRING', label: t('vaccine.lotStatus.expiring') },
  { value: 'EXPIRED', label: t('vaccine.lotStatus.expired') },
]);

const schema = yup.object({
  vaccineId: yup.string().required(t('required')),
  lotNo: yup.string().required(t('required')),
  manufacturer: yup.string().nullable(),
  importDate: yup.mixed().nullable(),
  expiryDate: yup.mixed().nullable(),
  quantity: yup.number().min(1, t('required')).required(t('required')),
  status: yup.string().required(t('required')),
});

const { handleSubmit, isSubmitting, setValues, resetForm } = useForm<FormValues>({
  validationSchema: schema,
  initialValues: {
    vaccineId: '',
    lotNo: '',
    manufacturer: '',
    importDate: dayjs(),
    expiryDate: dayjs().add(1, 'year'),
    quantity: 50,
    status: 'AVAILABLE',
  },
});

const { value: vaccineId, errorMessage: vaccineIdError } = useField<string>('vaccineId');
const { value: lotNo, errorMessage: lotNoError } = useField<string>('lotNo');
const { value: manufacturer } = useField<string>('manufacturer');
const { value: importDate } = useField<dayjs.Dayjs | null>('importDate');
const { value: expiryDate } = useField<dayjs.Dayjs | null>('expiryDate');
const { value: quantity, errorMessage: quantityError } = useField<number>('quantity');
const { value: status } = useField<'AVAILABLE' | 'LOW_STOCK' | 'EXPIRING' | 'EXPIRED'>('status');

watch(
  () => props.open,
  isOpen => {
    if (isOpen) {
      if (props.initialData) {
        setValues({
          vaccineId: props.initialData.vaccineId,
          lotNo: props.initialData.lotNo,
          manufacturer: props.initialData.manufacturer || '',
          importDate: props.initialData.importDate ? dayjs(props.initialData.importDate) : null,
          expiryDate: props.initialData.expiryDate ? dayjs(props.initialData.expiryDate) : null,
          quantity: props.initialData.quantity,
          status: props.initialData.status,
        });
      } else {
        const defaultVacId = listVaccine.value.data[0]?.id || '';
        resetForm({
          values: {
            vaccineId: defaultVacId,
            lotNo: `LOT-${Math.floor(Math.random() * 900) + 100}`,
            manufacturer: '',
            importDate: dayjs(),
            expiryDate: dayjs().add(1, 'year'),
            quantity: 50,
            status: 'AVAILABLE',
          },
        });
      }
    }
  },
);

const onSubmit = handleSubmit(async values => {
  const payload: Partial<VaccineLot> = {
    vaccineId: values.vaccineId,
    lotNo: values.lotNo,
    manufacturer: values.manufacturer || undefined,
    importDate: values.importDate ? values.importDate.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
    expiryDate: values.expiryDate ? values.expiryDate.format('YYYY-MM-DD') : dayjs().add(1, 'year').format('YYYY-MM-DD'),
    quantity: Number(values.quantity) || 1,
    status: values.status,
  };

  try {
    let res;
    if (props.lotId) {
      res = await vaccineStore.updateVaccineLot(props.lotId, payload);
    } else {
      res = await vaccineStore.createVaccineLot(payload);
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
    :title="props.lotId ? t('vaccine.editLot') : t('vaccine.importLot')"
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
        <!-- Vaccine Selection & Lot No -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <a-form-item
            name="vaccineId"
            class="mb-0"
            :validate-status="vaccineIdError ? 'error' : ''"
            :help="vaccineIdError"
          >
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                t('vaccine.vaccine')
              }}</span>
            </template>
            <a-select v-model:value="vaccineId" size="large" :options="vaccineOptions" class="w-full" />
          </a-form-item>

          <a-form-item name="lotNo" class="mb-0" :validate-status="lotNoError ? 'error' : ''" :help="lotNoError">
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                t('vaccine.lotNo')
              }}</span>
            </template>
            <a-input v-model:value="lotNo" size="large" :placeholder="t('vaccine.lotNo')" />
          </a-form-item>
        </div>

        <!-- Manufacturer & Quantity -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <a-form-item name="manufacturer" class="mb-0">
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                t('vaccine.manufacturer')
              }}</span>
            </template>
            <a-input v-model:value="manufacturer" size="large" :placeholder="t('vaccine.manufacturer')" />
          </a-form-item>

          <a-form-item
            name="quantity"
            class="mb-0"
            :validate-status="quantityError ? 'error' : ''"
            :help="quantityError"
          >
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                t('vaccine.quantity')
              }} (liều)</span>
            </template>
            <a-input-number v-model:value="quantity" size="large" class="w-full" :min="1" />
          </a-form-item>
        </div>

        <!-- Import Date & Expiry Date -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <a-form-item name="importDate" class="mb-0">
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                t('vaccine.importDate')
              }}</span>
            </template>
            <a-date-picker v-model:value="importDate" size="large" class="w-full" format="YYYY-MM-DD" />
          </a-form-item>

          <a-form-item name="expiryDate" class="mb-0">
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                t('vaccine.expiryDate')
              }}</span>
            </template>
            <a-date-picker v-model:value="expiryDate" size="large" class="w-full" format="YYYY-MM-DD" />
          </a-form-item>
        </div>

        <!-- Lot Status -->
        <a-form-item name="status" class="mb-0">
          <template #label>
            <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
              t('status')
            }}</span>
          </template>
          <a-select v-model:value="status" size="large" :options="statusOptions" class="w-full" />
        </a-form-item>
      </a-form>
    </div>
  </ModalLayout>
</template>
