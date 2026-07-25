<script setup lang="ts">
import { IconCopy, IconCheck, IconTicket } from '@tabler/icons-vue';
import { message } from 'ant-design-vue';
import { useLocale } from '@/shared/composables/useLocale';
import type { Voucher } from '@/shared/types/voucher.type';
import ModalLayout from '@/layouts/ModalLayout.vue';
import { ref } from 'vue';

const props = defineProps<{
  open: boolean;
  data: Voucher | null;
}>();

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
}>();

const { t } = useLocale();

const copied = ref(false);

const copyCode = () => {
  if (!props.data) return;
  navigator.clipboard.writeText(props.data.code);
  copied.value = true;
  message.success(t('voucher.codeCopied'));
  setTimeout(() => {
    copied.value = false;
  }, 2000);
};

const formatCurrency = (val?: number) => {
  if (!val) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
};
</script>

<template>
  <ModalLayout
    :open="open"
    :title="t('voucher.voucherDetails')"
    @update:open="emit('update:open', $event)"
    @cancel="() => emit('update:open', false)"
    :width="540"
  >
    <div v-if="data" class="flex flex-col gap-4 py-3">
      <!-- High-End Ticket Graphic Preview Card -->
      <div
        class="border-primary/30 via-primary relative overflow-hidden rounded-xl border bg-linear-to-br from-emerald-800 to-teal-900 p-6 text-white shadow-md"
      >
        <!-- Background Pattern Watermark -->
        <div class="pointer-events-none absolute -right-6 -bottom-6 opacity-10">
          <IconTicket size="180" />
        </div>

        <div class="relative z-10 flex flex-col gap-4">
          <!-- Header: Category Tag & Discount Amount -->
          <div class="flex items-start justify-between">
            <span class="rounded bg-white/20 px-2.5 py-1 font-mono text-xs font-bold tracking-wider uppercase">
              {{ data.category }}
            </span>
            <span
              class="rounded-full border border-emerald-400/30 bg-emerald-400/20 px-3 py-1 font-mono text-xs font-extrabold text-emerald-200 uppercase"
            >
              {{ data.status }}
            </span>
          </div>

          <!-- Main Discount Banner -->
          <div class="flex flex-col">
            <span class="text-xs tracking-widest text-emerald-200 uppercase">Discount Offer</span>
            <div class="font-mono text-4xl font-extrabold tracking-tight">
              {{
                data.discountType === 'PERCENTAGE'
                  ? `${data.discountValue}% OFF`
                  : `${formatCurrency(data.discountValue)} OFF`
              }}
            </div>
            <h3 class="mt-1 text-lg font-bold text-white">{{ data.title }}</h3>
          </div>

          <!-- Perforated Line inside Ticket -->
          <div class="my-1 border-t border-dashed border-white/30"></div>

          <!-- Coupon Code Box & Barcode Simulation -->
          <div class="flex flex-col gap-3 rounded-lg bg-black/25 p-4 backdrop-blur-xs">
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold tracking-wider text-emerald-200 uppercase">Voucher Code</span>
              <button
                type="button"
                class="flex cursor-pointer items-center gap-1 text-xs font-bold text-white transition-colors hover:text-emerald-300"
                @click="copyCode"
              >
                <component :is="copied ? IconCheck : IconCopy" size="14" />
                <span>{{ copied ? 'Copied' : t('voucher.copyCode') }}</span>
              </button>
            </div>
            <div class="text-center font-mono text-2xl font-black tracking-widest text-yellow-300">
              {{ data.code }}
            </div>

            <!-- Simulated Barcode -->
            <div class="flex flex-col items-center gap-1 pt-1 opacity-80">
              <div class="flex h-7 items-center justify-center gap-0.5">
                <div
                  v-for="i in 28"
                  :key="i"
                  class="h-full bg-white"
                  :style="{ width: `${i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1}px` }"
                ></div>
              </div>
              <span class="font-mono text-[10px] tracking-widest">{{ data.code }}-2026</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Details List -->
      <div class="bg-surface border-border flex flex-col gap-3 rounded border p-4 text-xs">
        <div class="flex items-center justify-between border-b pb-2">
          <span class="text-text-muted font-medium">{{ t('voucher.minOrderValue') }}:</span>
          <span class="text-text font-mono font-bold">{{ formatCurrency(data.minOrderValue) }}</span>
        </div>

        <div class="flex items-center justify-between border-b pb-2">
          <span class="text-text-muted font-medium">{{ t('voucher.maxDiscountAmount') }}:</span>
          <span class="text-text font-mono font-bold">{{
            data.maxDiscountAmount ? formatCurrency(data.maxDiscountAmount) : 'No Limit'
          }}</span>
        </div>

        <div class="flex items-center justify-between border-b pb-2">
          <span class="text-text-muted font-medium">{{ t('voucher.startDate') }} ~ {{ t('voucher.endDate') }}:</span>
          <span class="text-text font-mono font-bold">{{ data.startDate }} to {{ data.endDate }}</span>
        </div>

        <div class="flex items-center justify-between">
          <span class="text-text-muted font-medium">{{ t('voucher.usageProgress') }}:</span>
          <span class="text-primary font-mono font-bold"
            >{{ data.redeemedQuantity }} / {{ data.totalQuantity }} Redeemed</span
          >
        </div>
      </div>
    </div>
  </ModalLayout>
</template>
