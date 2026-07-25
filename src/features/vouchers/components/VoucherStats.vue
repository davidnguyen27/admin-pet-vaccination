<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { IconTicket, IconGift, IconCash, IconAlertTriangle } from '@tabler/icons-vue';
import { useLocale } from '@/shared/composables/useLocale';
import { useVoucherStore } from '@/store/voucherStore';
import StatCard from '@/shared/components/ui/StatCard.vue';

const { t } = useLocale();
const voucherStore = useVoucherStore();
const { overview } = storeToRefs(voucherStore);

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
};

const cards = computed(() => [
  {
    key: 'active',
    label: t('voucher.totalActive'),
    value: overview.value.totalActive,
    icon: IconTicket,
    iconBg: 'bg-green-500 text-white',
  },
  {
    key: 'redeemed',
    label: t('voucher.totalRedeemed'),
    value: overview.value.totalRedeemed.toLocaleString(),
    icon: IconGift,
    iconBg: 'bg-blue-500 text-white',
  },
  {
    key: 'discount',
    label: t('voucher.totalDiscountIssued'),
    value: formatCurrency(overview.value.totalDiscountIssued),
    icon: IconCash,
    iconBg: 'bg-amber-500 text-white',
  },
  {
    key: 'expiring',
    label: t('voucher.expiringSoon'),
    value: overview.value.expiringSoon,
    icon: IconAlertTriangle,
    iconBg: 'bg-red-500 text-white',
  },
]);
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <StatCard
      v-for="card in cards"
      :key="card.key"
      :label="card.label"
      :value="card.value"
      :icon="card.icon"
      :icon-bg="card.iconBg"
    />
  </div>
</template>
