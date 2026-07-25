<script setup lang="ts">
import { computed, ref } from 'vue';
import { IconRotate, IconPlus } from '@tabler/icons-vue';
import { useLocale } from '@/shared/composables/useLocale';
import type { DiscountType, VoucherCategory, VoucherStatus } from '@/shared/types/voucher.type';
import SearchInput from '@/shared/components/ui/SearchInput.vue';

const emit = defineEmits<{
  (
    e: 'search',
    filters: { search?: string; status?: VoucherStatus; discountType?: DiscountType; category?: VoucherCategory },
  ): void;
  (e: 'reset'): void;
  (e: 'create'): void;
}>();

const { t } = useLocale();

const search = ref('');
const status = ref<VoucherStatus | undefined>(undefined);
const discountType = ref<DiscountType | undefined>(undefined);
const category = ref<VoucherCategory | undefined>(undefined);

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

const handleSearch = () => {
  emit('search', {
    search: search.value || undefined,
    status: status.value,
    discountType: discountType.value,
    category: category.value,
  });
};

const handleReset = () => {
  search.value = '';
  status.value = undefined;
  discountType.value = undefined;
  category.value = undefined;
  emit('reset');
};
</script>

<template>
  <div class="bg-surface border-border flex flex-col gap-4 border p-4">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <!-- Left Filters -->
      <div class="flex flex-1 flex-wrap items-center gap-3">
        <SearchInput
          v-model="search"
          size="middle"
          input-class="w-full sm:w-64"
          :placeholder="t('voucher.code') + ' / ' + t('voucher.title') + '...'"
          @search="handleSearch"
        />

        <a-select
          v-model:value="status"
          size="middle"
          class="w-36"
          :placeholder="t('status')"
          allow-clear
          :options="statusOptions"
          @change="handleSearch"
        />

        <a-select
          v-model:value="discountType"
          size="middle"
          class="w-40"
          :placeholder="t('voucher.discountType')"
          allow-clear
          :options="discountTypeOptions"
          @change="handleSearch"
        />

        <a-select
          v-model:value="category"
          size="middle"
          class="w-40"
          :placeholder="t('voucher.category')"
          allow-clear
          :options="categoryOptions"
          @change="handleSearch"
        />

        <a-button size="middle" @click="handleReset">
          <template #icon><IconRotate size="16" /></template>
          <span>{{ t('reset') }}</span>
        </a-button>
      </div>

      <!-- Right Controls: Create Button -->
      <div class="flex items-center gap-3">
        <a-button type="primary" size="middle" class="flex items-center gap-1.5 rounded" @click="emit('create')">
          <template #icon><IconPlus size="16" /></template>
          <span class="text-xs font-medium">{{ t('voucher.createVoucher') }}</span>
        </a-button>
      </div>
    </div>
  </div>
</template>
