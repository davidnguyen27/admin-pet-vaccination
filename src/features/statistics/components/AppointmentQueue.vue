<template>
  <div class="border-divider rounded-sm border bg-white shadow-sm">
    <div class="p-4">
      <h2 class="font-ibm text-text font-semibold">Today's Appointment Queue</h2>
    </div>
    <div class="overflow-x-auto">
      <a-table :columns="columns" :data-source="appointmentsQueue" :pagination="false" row-key="id">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'time'">
            <span :class="record.status === 'Overdue' ? 'text-error font-medium' : 'text-text-muted'">
              {{ record.time }}
            </span>
          </template>

          <template v-else-if="column.key === 'status'">
            <span
              :class="[
                'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium',
                getStatusClasses(record.status),
              ]"
            >
              <span :class="['size-1.5 rounded-full', getDotClasses(record.status)]"></span>
              {{ record.status }}
            </span>
          </template>

          <template v-else-if="column.key === 'action'">
            <button class="text-primary hover:text-secondary font-medium transition-colors">
              {{ record.action }}
            </button>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TableColumnsType } from 'ant-design-vue';

const columns: TableColumnsType = [
  { title: 'Time', dataIndex: 'time', key: 'time' },
  { title: 'Code', dataIndex: 'code', key: 'code' },
  { title: 'Pet', dataIndex: 'petName', key: 'petName' },
  { title: 'Owner', dataIndex: 'owner', key: 'owner' },
  { title: 'Vaccine/Service', dataIndex: 'vaccine', key: 'vaccine' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
  { title: 'Actions', key: 'action', align: 'right' },
];

interface Appointment {
  id: string;
  time: string;
  code: string;
  petName: string;
  owner: string;
  vaccine: string;
  status: 'Checked In' | 'Pending' | 'Overdue';
  action: string;
}

const appointmentsQueue: Appointment[] = [
  {
    id: '1',
    time: '09:00 AM',
    code: 'APT-001',
    petName: 'Bella (Golden Retriever)',
    owner: 'Sarah Jenkins',
    vaccine: 'Annual Wellness Exam',
    status: 'Checked In',
    action: 'Process',
  },
  {
    id: '2',
    time: '09:30 AM',
    code: 'APT-002',
    petName: 'Max (Siamese)',
    owner: 'David Chen',
    vaccine: 'Rabies Booster',
    status: 'Pending',
    action: 'Edit',
  },
  {
    id: '3',
    time: '08:15 AM',
    code: 'APT-003',
    petName: 'Luna (Pug)',
    owner: 'Maria Garcia',
    vaccine: 'FVRCP Booster',
    status: 'Overdue',
    action: 'Follow Up',
  },
];

const getStatusClasses = (status: string) => {
  switch (status) {
    case 'Checked In':
      return 'text-success border-success/30 bg-success-bg/50';
    case 'Pending':
      return 'text-text-muted border-gray-300 bg-gray-50';
    case 'Overdue':
      return 'text-error border-error/30 bg-error-bg/50';
    default:
      return '';
  }
};

const getDotClasses = (status: string) => {
  switch (status) {
    case 'Checked In':
      return 'bg-success';
    case 'Pending':
      return 'bg-gray-400';
    case 'Overdue':
      return 'bg-error';
    default:
      return '';
  }
};
</script>
