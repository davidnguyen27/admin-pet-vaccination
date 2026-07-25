<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { IconArrowRight, IconCalendarEvent } from '@tabler/icons-vue';
import { useLocale } from '@/shared/composables/useLocale';
import { useStatisticsStore } from '../stores/statistics.store';
import type { Appointment } from '../stores/statistics.store';

const router = useRouter();
const { t } = useLocale();
const store = useStatisticsStore();

const appointmentsQueue = computed(() => store.appointmentsQueue);
const totalCount = computed(() => appointmentsQueue.value.length);

const STATUS_CONFIG: Record<Appointment['status'], { color: 'success' | 'warning' | 'error'; labelKey: string }> = {
  'Checked In': { color: 'success', labelKey: 'Checked In' },
  Pending: { color: 'warning', labelKey: 'Pending' },
  Overdue: { color: 'error', labelKey: 'Overdue' },
};

const columns = computed(() => [
  { title: t('statistics.colTime'), dataIndex: 'time', key: 'time', width: 100 },
  { title: t('statistics.colCode'), dataIndex: 'code', key: 'code', width: 110 },
  { title: t('statistics.colPet'), dataIndex: 'petName', key: 'petName' },
  { title: t('statistics.colOwner'), dataIndex: 'owner', key: 'owner' },
  { title: t('statistics.colService'), dataIndex: 'vaccine', key: 'vaccine' },
  { title: t('statistics.colStatus'), dataIndex: 'status', key: 'status', width: 130 },
  { title: '', key: 'action', align: 'right', width: 100 },
]);

const getActionLabel = (status: Appointment['status']) => {
  if (status === 'Checked In') return 'Process';
  if (status === 'Overdue') return 'Follow Up';
  return 'Edit';
};
</script>

<template>
  <div class="shadow-card border-divider bg-surface overflow-hidden rounded-md border">
    <div class="border-divider flex items-center justify-between border-b px-4 py-3">
      <div class="flex items-center gap-2">
        <IconCalendarEvent class="text-primary size-4" />
        <span class="font-ibm text-text font-semibold">{{ t('statistics.appointmentsQueue') }}</span>
        <span
          class="bg-primary/10 text-primary inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold"
        >
          {{ totalCount }}
        </span>
      </div>
      <button size="small" class="p-0! text-xs!" @click="router.push('/user-management')">
        {{ t('statistics.viewAll') }}
        <IconArrowRight class="ml-0.5 inline size-3" />
      </button>
    </div>

    <div class="overflow-x-auto">
      <a-table :columns="columns" :data-source="appointmentsQueue" :pagination="false" row-key="id" size="small">
        <template #emptyText>
          <div class="py-8 text-center">
            <IconCalendarEvent class="text-text-disabled mx-auto mb-2 size-8" />
            <p class="text-text-muted text-sm">
              {{ t('statistics.noAppointmentsToday') }}
            </p>
          </div>
        </template>

        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'time'">
            <span
              :class="record.status === 'Overdue' ? 'text-error font-semibold' : 'text-text-muted'"
              class="text-xs tabular-nums"
            >
              {{ record.time }}
            </span>
          </template>

          <template v-else-if="column.key === 'code'">
            <span class="text-text-subtle font-mono text-xs">{{ record.code }}</span>
          </template>

          <template v-else-if="column.key === 'status'">
            <a-tag :color="STATUS_CONFIG[record.status as Appointment['status']].color" class="text-xs! font-medium!">
              {{ STATUS_CONFIG[record.status as Appointment['status']].labelKey }}
            </a-tag>
          </template>

          <template v-else-if="column.key === 'action'">
            <a-button type="link" size="small" class="p-0! text-xs!" :danger="record.status === 'Overdue'">
              {{ getActionLabel(record.status) }}
            </a-button>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>
