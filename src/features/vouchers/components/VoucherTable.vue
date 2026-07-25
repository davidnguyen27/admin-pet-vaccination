<script setup lang="ts">
import { computed, ref } from 'vue';
import { IconCopy, IconCheck } from '@tabler/icons-vue';
import { message } from 'ant-design-vue';
import { useLocale } from '@/shared/composables/useLocale';
import type { Voucher } from '@/shared/types/voucher.type';
import Pagination from '@/shared/components/ui/Pagination.vue';
import StatusBadge from '@/shared/components/ui/StatusBadge.vue';
import TableActionButtons from '@/shared/components/ui/TableActionButtons.vue';

const props = defineProps<{
  vouchers: Voucher[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: 'view', voucher: Voucher): void;
  (e: 'edit', voucher: Voucher): void;
  (e: 'delete', voucher: Voucher): void;
  (e: 'pageChange', page: number, pageSize: number): void;
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
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
};

const columns = computed(() => [
  { title: t('voucher.code'), dataIndex: 'code', key: 'code', width: 140 },
  { title: t('voucher.title'), dataIndex: 'title', key: 'title' },
  { title: t('voucher.discountType'), dataIndex: 'discountType', key: 'discountType', width: 130 },
  { title: t('voucher.discountValue'), dataIndex: 'discountValue', key: 'discountValue', width: 130 },
  { title: t('voucher.category'), dataIndex: 'category', key: 'category', width: 130 },
  { title: t('voucher.usageProgress'), dataIndex: 'redeemedQuantity', key: 'usage', width: 150 },
  { title: t('status'), dataIndex: 'status', key: 'status', width: 140 },
  { title: t('action'), key: 'action', width: 110, align: 'center' as const, fixed: 'right' as const },
]);



const handlePageChange = (page: number) => {
  emit('pageChange', page, props.limit);
};

const handlePageSizeChange = (pageSize: number) => {
  emit('pageChange', 1, pageSize);
};
</script>

<template>
  <div class="bg-surface border-border border p-4">
    <a-table
      :columns="columns"
      :data-source="vouchers"
      :loading="loading"
      row-key="id"
      :pagination="false"
      size="middle"
    >
      <!-- Voucher Code Slot -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'code'">
          <div class="text-primary flex items-center gap-1.5 font-mono font-bold">
            <span>{{ record.code }}</span>
            <button
              type="button"
              class="text-text-muted hover:text-primary cursor-pointer transition-colors"
              @click="copyCode(record.code)"
            >
              <component :is="copiedCodeMap[record.code] ? IconCheck : IconCopy" size="13" />
            </button>
          </div>
        </template>

        <template v-else-if="column.key === 'title'">
          <div class="flex flex-col gap-0.5">
            <span class="font-ibm text-text font-semibold">{{ record.title }}</span>
            <span class="text-text-muted line-clamp-1 text-xs">{{ record.description || '-' }}</span>
          </div>
        </template>

        <template v-else-if="column.key === 'discountType'">
          <a-tag :color="record.discountType === 'PERCENTAGE' ? 'purple' : 'cyan'" class="m-0 text-xs font-semibold">
            {{ record.discountType === 'PERCENTAGE' ? 'Percentage' : 'Fixed VND' }}
          </a-tag>
        </template>

        <template v-else-if="column.key === 'discountValue'">
          <span class="text-text font-mono font-bold">
            {{
              record.discountType === 'PERCENTAGE' ? `${record.discountValue}%` : formatCurrency(record.discountValue)
            }}
          </span>
        </template>

        <template v-else-if="column.key === 'category'">
          <span class="bg-divider text-text-subtle rounded px-2 py-0.5 font-mono text-xs font-medium uppercase">
            {{ record.category }}
          </span>
        </template>

        <template v-else-if="column.key === 'usage'">
          <div class="flex w-28 flex-col gap-1">
            <div class="text-text-subtle flex justify-between font-mono text-[10px] font-bold">
              <span>{{ record.redeemedQuantity }}</span>
              <span>{{ record.totalQuantity }}</span>
            </div>
            <div class="bg-divider h-1.5 w-full overflow-hidden rounded-full">
              <div
                class="bg-primary h-full rounded-full transition-all duration-300"
                :style="{
                  width: `${Math.min(100, Math.round((record.redeemedQuantity / record.totalQuantity) * 100))}%`,
                }"
              ></div>
            </div>
          </div>
        </template>

        <template v-else-if="column.key === 'status'">
          <StatusBadge :status="record.status" />
        </template>

        <template v-else-if="column.key === 'action'">
          <TableActionButtons
            @view="emit('view', record)"
            @edit="emit('edit', record)"
            @delete="emit('delete', record)"
          />
        </template>
      </template>
    </a-table>

    <!-- Pagination -->
    <div class="mt-4 flex justify-end">
      <Pagination
        :current="props.page"
        :page-size="props.limit"
        :total="props.total"
        @update:current="handlePageChange"
        @update:page-size="handlePageSizeChange"
      />
    </div>
  </div>
</template>
