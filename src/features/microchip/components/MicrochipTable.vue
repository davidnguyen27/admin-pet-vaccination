<script setup lang="ts">
import { computed, ref } from 'vue';
import { useLocale } from '@/shared/composables/useLocale';
import { formatDate } from '@/shared/utils';
import { IconCopy, IconCheck, IconCpu } from '@tabler/icons-vue';
import { message } from 'ant-design-vue';
import type { Microchip } from '@/shared/types/microchip.type';
import StatusBadge from '@/shared/components/ui/StatusBadge.vue';
import TableActionButtons from '@/shared/components/ui/TableActionButtons.vue';
import Pagination from '@/shared/components/ui/Pagination.vue';
import EmptyState from '@/shared/components/EmptyState.vue';

const props = defineProps<{
  data: Microchip[];
  loading?: boolean;
  page: number;
  limit: number;
  total: number;
}>();

const emit = defineEmits<{
  (e: 'viewDetail', record: Microchip): void;
  (e: 'edit', record: Microchip): void;
  (e: 'delete', record: Microchip): void;
  (e: 'pageChange', page: number, pageSize: number): void;
}>();

const { t } = useLocale();

const copiedCodeMap = ref<Record<string, boolean>>({});

const copyMicrochipNo = (code: string) => {
  navigator.clipboard.writeText(code);
  copiedCodeMap.value[code] = true;
  message.success(t('microchip.microchipNo') + ' ' + t('voucher.codeCopied'));
  setTimeout(() => {
    copiedCodeMap.value[code] = false;
  }, 2000);
};

const columns = computed(() => [
  {
    title: t('microchip.microchipNo'),
    dataIndex: 'microchipNo',
    key: 'microchipNo',
    width: 180,
  },
  {
    title: t('microchip.status'),
    dataIndex: 'status',
    key: 'status',
    width: 130,
  },
  {
    title: t('microchip.petName'),
    dataIndex: 'petName',
    key: 'petName',
    width: 140,
  },
  {
    title: t('microchip.ownerName'),
    dataIndex: 'ownerName',
    key: 'ownerName',
    width: 150,
  },
  {
    title: t('microchip.manufacturer'),
    dataIndex: 'manufacturer',
    key: 'manufacturer',
    width: 130,
  },
  {
    title: t('microchip.implantDate'),
    dataIndex: 'implantDate',
    key: 'implantDate',
    width: 130,
  },
  {
    title: t('microchip.implantedBy'),
    dataIndex: 'implantedBy',
    key: 'implantedBy',
    width: 150,
  },
  {
    title: t('action'),
    key: 'action',
    align: 'center' as const,
    width: 110,
    fixed: 'right' as const,
  },
]);

const getStatusText = (status: string) => {
  switch (status) {
    case 'AVAILABLE':
      return t('microchip.available');
    case 'IMPLANTED':
      return t('microchip.implanted');
    case 'DEFECTIVE':
      return t('microchip.defective');
    default:
      return status;
  }
};

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
      v-if="props.data.length || props.loading"
      :columns="columns"
      :data-source="props.data"
      :loading="props.loading"
      row-key="id"
      :pagination="false"
      size="middle"
      :scroll="{ x: 1050 }"
    >
      <template #bodyCell="{ column, record }">
        <!-- Microchip No with 1-click Copy -->
        <template v-if="column.key === 'microchipNo'">
          <div class="text-primary flex items-center gap-1.5 font-mono font-bold">
            <span class="cursor-pointer hover:underline" :title="t('view')" @click="emit('viewDetail', record)">
              {{ record.microchipNo }}
            </span>
            <button
              type="button"
              class="text-text-muted hover:text-primary cursor-pointer transition-colors"
              :title="t('voucher.copyCode')"
              @click="copyMicrochipNo(record.microchipNo)"
            >
              <component :is="copiedCodeMap[record.microchipNo] ? IconCheck : IconCopy" size="13" />
            </button>
          </div>
        </template>

        <!-- Status -->
        <template v-else-if="column.key === 'status'">
          <StatusBadge :status="record.status" :text="getStatusText(record.status)" />
        </template>

        <!-- Pet Name -->
        <template v-else-if="column.key === 'petName'">
          <router-link v-if="record.petId" to="/pet-management" class="text-primary font-medium hover:underline">
            {{ record.petName }}
          </router-link>
          <span v-else-if="record.petName" class="text-text font-medium">{{ record.petName }}</span>
          <span v-else class="text-text-muted">-</span>
        </template>

        <!-- Owner Name -->
        <template v-else-if="column.key === 'ownerName'">
          <span class="text-text font-medium">{{ record.ownerName || '-' }}</span>
        </template>

        <!-- Manufacturer Tag -->
        <template v-else-if="column.key === 'manufacturer'">
          <span
            v-if="record.manufacturer"
            class="bg-divider text-text-subtle rounded px-2 py-0.5 font-mono text-xs font-medium"
          >
            {{ record.manufacturer }}
          </span>
          <span v-else class="text-text-muted">-</span>
        </template>

        <!-- Implant Date -->
        <template v-else-if="column.key === 'implantDate'">
          <span>{{ record.implantDate ? formatDate(record.implantDate) : '-' }}</span>
        </template>

        <!-- Implanted By -->
        <template v-else-if="column.key === 'implantedBy'">
          <span>{{ record.implantedBy || '-' }}</span>
        </template>

        <!-- Actions -->
        <template v-else-if="column.key === 'action'">
          <TableActionButtons
            @view="emit('viewDetail', record)"
            @edit="emit('edit', record)"
            @delete="emit('delete', record)"
          />
        </template>
      </template>
    </a-table>

    <!-- Empty State -->
    <EmptyState
      v-else
      title="No Microchips Found"
      description="No microchips match your search or status filter criteria. Add a new microchip or reset filters."
      :icon="IconCpu"
    />

    <!-- Pagination -->
    <div v-if="props.total > 0" class="mt-4 flex justify-end">
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
