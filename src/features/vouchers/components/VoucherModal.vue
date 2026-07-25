<script setup lang="ts">
import { computed, watch } from 'vue';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import dayjs from 'dayjs';
import { useLocale } from '@/shared/composables/useLocale';
import { useVoucherStore } from '@/store/voucherStore';
import type { DiscountType, Voucher, VoucherCategory, VoucherStatus } from '@/shared/types/voucher.type';
import ModalLayout from '@/layouts/ModalLayout.vue';

const props = defineProps<{
  open: boolean;
  voucherId: string | null;
  initialData?: Voucher | null;
}>();

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'success'): void;
}>();

const { t } = useLocale();
const voucherStore = useVoucherStore();

const validationSchema = yup.object({
  code: yup.string().required(t('required')).min(3, 'Min 3 chars').max(20, 'Max 20 chars'),
  title: yup.string().required(t('required')).min(3, 'Min 3 chars'),
  discountType: yup.string().required(t('required')),
  discountValue: yup.number().required(t('required')).positive('Must be positive'),
  category: yup.string().required(t('required')),
  totalQuantity: yup.number().required(t('required')).min(1, 'Min 1'),
  startDate: yup.mixed().required(t('required')),
  endDate: yup.mixed().required(t('required')),
  description: yup.string().optional(),
  minOrderValue: yup.number().optional().nullable(),
  maxDiscountAmount: yup.number().optional().nullable(),
  status: yup.string().required(t('required')),
});

const { handleSubmit, resetForm, setValues, isSubmitting } = useForm({
  validationSchema,
  initialValues: {
    code: '',
    title: '',
    discountType: 'PERCENTAGE' as DiscountType,
    discountValue: 20,
    category: 'ALL' as VoucherCategory,
    totalQuantity: 100,
    startDate: dayjs(),
    endDate: dayjs().add(3, 'month'),
    description: '',
    minOrderValue: 0,
    maxDiscountAmount: 0,
    status: 'ACTIVE' as VoucherStatus,
  },
});

const { value: code, errorMessage: codeError } = useField<string>('code');
const { value: title, errorMessage: titleError } = useField<string>('title');
const { value: discountType } = useField<DiscountType>('discountType');
const { value: discountValue, errorMessage: discountValueError } = useField<number>('discountValue');
const { value: category } = useField<VoucherCategory>('category');
const { value: totalQuantity, errorMessage: totalQuantityError } = useField<number>('totalQuantity');
const { value: startDate } = useField<any>('startDate');
const { value: endDate } = useField<any>('endDate');
const { value: description } = useField<string>('description');
const { value: minOrderValue } = useField<number>('minOrderValue');
const { value: maxDiscountAmount } = useField<number>('maxDiscountAmount');
const { value: status } = useField<VoucherStatus>('status');

const statusOptions = computed(() => [
  { value: 'ACTIVE', label: t('voucher.status.active') },
  { value: 'SCHEDULED', label: t('voucher.status.scheduled') },
  { value: 'EXPIRED', label: t('voucher.status.expired') },
  { value: 'FULLY_REDEEMED', label: t('voucher.status.fullyRedeemed') },
]);

const discountTypeOptions = computed(() => [
  { value: 'PERCENTAGE', label: t('voucher.discountTypes.percentage') },
  { value: 'FIXED_AMOUNT', label: t('voucher.discountTypes.fixedAmount') },
]);

const categoryOptions = computed(() => [
  { value: 'ALL', label: t('voucher.categories.all') },
  { value: 'VACCINATION', label: t('voucher.categories.vaccination') },
  { value: 'GROOMING', label: t('voucher.categories.grooming') },
  { value: 'SURGERY', label: t('voucher.categories.surgery') },
  { value: 'PET_CARE', label: t('voucher.categories.petCare') },
]);

watch(
  () => props.open,
  isOpen => {
    if (isOpen) {
      if (props.initialData) {
        setValues({
          code: props.initialData.code,
          title: props.initialData.title,
          description: props.initialData.description || '',
          discountType: props.initialData.discountType,
          discountValue: props.initialData.discountValue,
          category: props.initialData.category,
          totalQuantity: props.initialData.totalQuantity,
          startDate: props.initialData.startDate ? dayjs(props.initialData.startDate) : dayjs(),
          endDate: props.initialData.endDate ? dayjs(props.initialData.endDate) : dayjs().add(3, 'month'),
          minOrderValue: props.initialData.minOrderValue || 0,
          maxDiscountAmount: props.initialData.maxDiscountAmount || 0,
          status: props.initialData.status,
        });
      } else {
        resetForm({
          values: {
            code: `PROMO${Math.floor(Math.random() * 900) + 100}`,
            title: '',
            description: '',
            discountType: 'PERCENTAGE',
            discountValue: 20,
            category: 'ALL',
            totalQuantity: 100,
            startDate: dayjs(),
            endDate: dayjs().add(3, 'month'),
            minOrderValue: 0,
            maxDiscountAmount: 0,
            status: 'ACTIVE',
          },
        });
      }
    }
  },
);

const onSubmit = handleSubmit(async values => {
  const formattedPayload: Partial<Voucher> = {
    ...values,
    startDate: dayjs(values.startDate).format('YYYY-MM-DD'),
    endDate: dayjs(values.endDate).format('YYYY-MM-DD'),
  };

  if (props.voucherId) {
    await voucherStore.updateVoucher(props.voucherId, formattedPayload);
  } else {
    await voucherStore.createVoucher(formattedPayload);
  }

  emit('success');
  emit('update:open', false);
});
</script>

<template>
  <ModalLayout
    :open="open"
    :title="props.voucherId ? t('voucher.editVoucher') : t('voucher.createVoucher')"
    @update:open="emit('update:open', $event)"
    @ok="onSubmit"
    @cancel="() => emit('update:open', false)"
    :loading="isSubmitting"
    :ok-text="t('save')"
    :cancel-text="t('cancel')"
    :width="640"
  >
    <div class="pt-4">
      <a-form layout="vertical" class="flex flex-col gap-4">
        <!-- Row 1: Code & Status -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <a-form-item name="code" class="mb-0" :validate-status="codeError ? 'error' : ''" :help="codeError">
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                t('voucher.code')
              }}</span>
            </template>
            <a-input
              v-model:value="code"
              size="large"
              class="font-mono font-bold uppercase"
              :placeholder="t('voucher.code')"
            />
          </a-form-item>

          <a-form-item name="status" class="mb-0">
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{ t('status') }}</span>
            </template>
            <a-select v-model:value="status" size="large" :options="statusOptions" />
          </a-form-item>
        </div>

        <!-- Title -->
        <a-form-item name="title" class="mb-0" :validate-status="titleError ? 'error' : ''" :help="titleError">
          <template #label>
            <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
              t('voucher.title')
            }}</span>
          </template>
          <a-input v-model:value="title" size="large" :placeholder="t('voucher.title')" />
        </a-form-item>

        <!-- Row 2: Discount Type & Discount Value -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <a-form-item name="discountType" class="mb-0">
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                t('voucher.discountType')
              }}</span>
            </template>
            <a-select v-model:value="discountType" size="large" :options="discountTypeOptions" />
          </a-form-item>

          <a-form-item
            name="discountValue"
            class="mb-0"
            :validate-status="discountValueError ? 'error' : ''"
            :help="discountValueError"
          >
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                t('voucher.discountValue')
              }}</span>
            </template>
            <a-input-number v-model:value="discountValue" size="large" class="w-full" :min="1" />
          </a-form-item>
        </div>

        <!-- Row 3: Category & Total Quantity -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <a-form-item name="category" class="mb-0">
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                t('voucher.category')
              }}</span>
            </template>
            <a-select v-model:value="category" size="large" :options="categoryOptions" />
          </a-form-item>

          <a-form-item
            name="totalQuantity"
            class="mb-0"
            :validate-status="totalQuantityError ? 'error' : ''"
            :help="totalQuantityError"
          >
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                t('voucher.totalQuantity')
              }}</span>
            </template>
            <a-input-number v-model:value="totalQuantity" size="large" class="w-full" :min="1" />
          </a-form-item>
        </div>

        <!-- Row 4: Start Date & End Date -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <a-form-item name="startDate" class="mb-0">
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                t('voucher.startDate')
              }}</span>
            </template>
            <a-date-picker v-model:value="startDate" size="large" class="w-full" format="YYYY-MM-DD" />
          </a-form-item>

          <a-form-item name="endDate" class="mb-0">
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                t('voucher.endDate')
              }}</span>
            </template>
            <a-date-picker v-model:value="endDate" size="large" class="w-full" format="YYYY-MM-DD" />
          </a-form-item>
        </div>

        <!-- Row 5: Min Order Value & Max Discount Amount -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <a-form-item name="minOrderValue" class="mb-0">
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                t('voucher.minOrderValue')
              }}</span>
            </template>
            <a-input-number v-model:value="minOrderValue" size="large" class="w-full" :min="0" :step="10000" />
          </a-form-item>

          <a-form-item name="maxDiscountAmount" class="mb-0">
            <template #label>
              <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
                t('voucher.maxDiscountAmount')
              }}</span>
            </template>
            <a-input-number v-model:value="maxDiscountAmount" size="large" class="w-full" :min="0" :step="10000" />
          </a-form-item>
        </div>

        <!-- Description -->
        <a-form-item name="description" class="mb-0">
          <template #label>
            <span class="text-text-subtle text-xs font-semibold tracking-wider uppercase">{{
              t('voucher.description')
            }}</span>
          </template>
          <a-textarea v-model:value="description" :rows="3" size="large" :placeholder="t('voucher.description')" />
        </a-form-item>
      </a-form>
    </div>
  </ModalLayout>
</template>
