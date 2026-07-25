<script setup lang="ts">
import { message } from 'ant-design-vue';
import { IconCopy, IconCheck, IconCalendar, IconTicket } from '@tabler/icons-vue';
import { useLocale } from '@/shared/composables/useLocale';
import type { Voucher } from '@/shared/types/voucher.type';
import StatusBadge from '@/shared/components/ui/StatusBadge.vue';
import TableActionButtons from '@/shared/components/ui/TableActionButtons.vue';
import EmptyState from '@/shared/components/EmptyState.vue';
import { ref } from 'vue';

const props = defineProps<{
  vouchers: Voucher[];
}>();

const emit = defineEmits<{
  (e: 'view', voucher: Voucher): void;
  (e: 'edit', voucher: Voucher): void;
  (e: 'delete', voucher: Voucher): void;
}>();

const { t } = useLocale();

const copiedCodeMap = ref<Record<string, boolean>>({});

const copyCode = (code: string) => {
  navigator.clipboard.writeText(code);
  copiedCodeMap.value[code] = true;
  message.success(t('voucher.codeCopied'));
  setTimeout(() => {
    copiedCodeMap.value[code] = false;
  }, 2000);
};

const formatCurrency = (val: number) => {
  if (val >= 1000) {
    return `${(val / 1000).toLocaleString()}K`;
  }
  return val.toLocaleString();
};


</script>

<template>
  <div v-if="vouchers.length" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
    <div
      v-for="item in vouchers"
      :key="item.id"
      class="group border-border bg-surface hover:border-primary/50 relative flex flex-col overflow-hidden rounded-lg border shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
    >
      <!-- Perforated Ticket Divider & Side Cutouts -->
      <div class="relative flex flex-1 flex-col sm:flex-row">
        <!-- Left Banner: Discount Display Badge -->
        <div
          class="from-primary flex flex-col items-center justify-center bg-linear-to-br to-emerald-700 p-5 text-white sm:w-28 sm:shrink-0"
        >
          <div class="flex items-baseline font-mono font-black tracking-tight">
            <span class="text-3xl font-extrabold sm:text-2xl">
              {{ item.discountType === 'PERCENTAGE' ? `${item.discountValue}%` : formatCurrency(item.discountValue) }}
            </span>
          </div>
          <span class="text-[10px] font-bold tracking-widest uppercase opacity-90">OFF</span>
          <div class="mt-2 rounded bg-white/20 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase">
            {{ item.category }}
          </div>
        </div>

        <!-- Vertical Perforated Tear Line (Dashed) -->
        <div class="border-border bg-surface relative hidden w-0.5 border-r-2 border-dashed sm:block">
          <!-- Top & Bottom Semi-Circle Cutouts -->
          <div class="border-border bg-bg absolute -top-3 -left-1.5 h-3 w-3 rounded-full border"></div>
          <div class="border-border bg-bg absolute -bottom-3 -left-1.5 h-3 w-3 rounded-full border"></div>
        </div>

        <!-- Right Body: Title, Code, Progress & Rules -->
        <div class="flex flex-1 flex-col justify-between p-4">
          <div class="flex flex-col gap-2">
            <!-- Header: Title & Status Tag -->
            <div class="flex items-start justify-between gap-2">
              <h3 class="font-ibm text-text group-hover:text-primary line-clamp-1 text-sm font-bold transition-colors">
                {{ item.title }}
              </h3>
              <StatusBadge :status="item.status" />
            </div>

            <!-- Description -->
            <p v-if="item.description" class="text-text-muted line-clamp-2 text-xs leading-relaxed">
              {{ item.description }}
            </p>

            <!-- Copy Code Bar -->
            <div
              class="border-divider bg-primary-soft/40 hover:bg-primary-soft flex items-center justify-between rounded border px-3 py-1.5 transition-colors"
            >
              <div class="text-primary flex items-center gap-1.5 font-mono text-xs font-bold">
                <IconTicket size="15" />
                <span>{{ item.code }}</span>
              </div>
              <button
                type="button"
                class="text-primary flex cursor-pointer items-center gap-1 text-[11px] font-semibold hover:underline"
                @click="copyCode(item.code)"
              >
                <component :is="copiedCodeMap[item.code] ? IconCheck : IconCopy" size="13" />
                <span>{{ copiedCodeMap[item.code] ? 'Copied' : t('voucher.copyCode') }}</span>
              </button>
            </div>
          </div>

          <!-- Bottom Metrics: Redemption Progress Bar & Date Range -->
          <div class="border-divider mt-4 flex flex-col gap-2 border-t pt-3">
            <!-- Progress Bar -->
            <div class="flex flex-col gap-1">
              <div class="flex items-center justify-between text-[11px]">
                <span class="text-text-muted font-medium">{{ t('voucher.usageProgress') }}</span>
                <span class="text-text-subtle font-mono font-bold">
                  {{ item.redeemedQuantity }} / {{ item.totalQuantity }}
                </span>
              </div>
              <div class="bg-divider h-1.5 w-full overflow-hidden rounded-full">
                <div
                  class="bg-primary h-full rounded-full transition-all duration-500"
                  :style="{
                    width: `${Math.min(100, Math.round((item.redeemedQuantity / item.totalQuantity) * 100))}%`,
                  }"
                ></div>
              </div>
            </div>

            <!-- Date Range & Action Buttons -->
            <div class="flex items-center justify-between pt-1">
              <div class="text-text-muted flex items-center gap-1 text-[11px]">
                <IconCalendar size="13" />
                <span>{{ item.startDate }} ~ {{ item.endDate }}</span>
              </div>

              <!-- Actions -->
              <TableActionButtons
                @view="emit('view', item)"
                @edit="emit('edit', item)"
                @delete="emit('delete', item)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Empty State -->
  <EmptyState
    v-else
    title="No Vouchers Found"
    description="No voucher promotions match your search or filter criteria. Create a new voucher or reset filters."
    :icon="IconTicket"
  />
</template>
