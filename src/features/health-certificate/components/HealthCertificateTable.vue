<script setup lang="ts">
import { computed } from 'vue';
import { useLocale } from '@/shared/composables/useLocale';
import { formatDate } from '@/shared/utils';
import type { TableColumnsType } from 'ant-design-vue';
import type { HealthCertificate } from '@/shared/types/healthCertificate.type';
import StatusBadge from '@/shared/components/ui/StatusBadge.vue';
import TableActionButtons from '@/shared/components/ui/TableActionButtons.vue';

defineProps<{
  data: HealthCertificate[];
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'viewDetail', record: HealthCertificate): void;
  (e: 'edit', record: HealthCertificate): void;
  (e: 'delete', record: HealthCertificate): void;
}>();

const { t } = useLocale();

const columns = computed<TableColumnsType>(() => [
  {
    title: t('healthCertificate.certificateNo'),
    dataIndex: 'certificateNo',
    key: 'certificateNo',
    width: 150,
  },
  {
    title: t('healthCertificate.petName'),
    dataIndex: 'petName',
    key: 'petName',
    width: 140,
  },
  {
    title: t('healthCertificate.ownerName'),
    dataIndex: 'ownerName',
    key: 'ownerName',
    width: 150,
  },
  {
    title: t('healthCertificate.purpose'),
    dataIndex: 'purpose',
    key: 'purpose',
    width: 170,
  },
  {
    title: t('healthCertificate.issueDate'),
    dataIndex: 'issueDate',
    key: 'issueDate',
    width: 125,
  },
  {
    title: t('healthCertificate.expiryDate'),
    dataIndex: 'expiryDate',
    key: 'expiryDate',
    width: 125,
  },
  {
    title: t('healthCertificate.issuedBy'),
    dataIndex: 'issuedBy',
    key: 'issuedBy',
    width: 150,
  },
  {
    title: t('healthCertificate.status'),
    dataIndex: 'status',
    key: 'status',
    width: 130,
  },
  {
    title: t('action'),
    key: 'action',
    align: 'center',
    width: 110,
    fixed: 'right',
  },
]);

const getPurposeText = (purposeKey: string) => {
  switch (purposeKey) {
    case 'DOMESTIC_TRAVEL':
      return t('healthCertificate.purposeVal.domesticTravel');
    case 'INTERNATIONAL_EXPORT':
      return t('healthCertificate.purposeVal.internationalExport');
    case 'GENERAL_HEALTH':
      return t('healthCertificate.purposeVal.generalHealth');
    case 'SHOW_COMPETITION':
      return t('healthCertificate.purposeVal.showCompetition');
    default:
      return purposeKey;
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'VALID':
      return t('healthCertificate.statusVal.valid');
    case 'EXPIRED':
      return t('healthCertificate.statusVal.expired');
    case 'REVOKED':
      return t('healthCertificate.statusVal.revoked');
    default:
      return status;
  }
};
</script>

<template>
  <div class="border-divider bg-surface shadow-card rounded border">
    <a-table :columns="columns" :data-source="data" :loading="loading" :pagination="false" :scroll="{ x: 1100 }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'certificateNo'">
          <span
            class="font-ibm text-primary cursor-pointer font-bold hover:underline"
            @click="emit('viewDetail', record)"
          >
            {{ record.certificateNo }}
          </span>
        </template>

        <template v-else-if="column.key === 'petName'">
          <div class="flex flex-col">
            <span class="text-text font-semibold">{{ record.petName }}</span>
            <span class="text-text-muted text-xs"
              >{{ record.species }} {{ record.breed ? `(${record.breed})` : '' }}</span
            >
          </div>
        </template>

        <template v-else-if="column.key === 'ownerName'">
          <div class="flex flex-col">
            <span class="text-text font-medium">{{ record.ownerName }}</span>
            <span v-if="record.ownerPhone" class="text-text-muted text-xs">{{ record.ownerPhone }}</span>
          </div>
        </template>

        <template v-else-if="column.key === 'purpose'">
          <span class="bg-surface-soft border-divider text-text-subtle rounded border px-2 py-1 text-xs font-medium">
            {{ getPurposeText(record.purpose) }}
          </span>
        </template>

        <template v-else-if="column.key === 'issueDate'">
          <span>{{ formatDate(record.issueDate) }}</span>
        </template>
        <template v-else-if="column.key === 'expiryDate'">
          <span>{{ formatDate(record.expiryDate) }}</span>
        </template>

        <template v-else-if="column.key === 'status'">
          <StatusBadge :status="record.status" :text="getStatusText(record.status)" />
        </template>

        <template v-else-if="column.key === 'action'">
          <TableActionButtons
            @view="emit('viewDetail', record)"
            @edit="emit('edit', record)"
            @delete="emit('delete', record)"
          />
        </template>
      </template>
    </a-table>
  </div>
</template>
