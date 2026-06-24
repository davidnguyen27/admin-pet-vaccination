<template>
  <div class="border-divider rounded-sm border bg-white p-4 shadow-sm">
    <h2 class="font-ibm text-text mb-4 font-semibold">Inventory Alerts</h2>
    <div class="overflow-x-auto">
      <a-table :columns="columns" :data-source="inventoryAlertsData" :pagination="false" row-key="id">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'item'">
            <div
              :class="[
                'flex items-center gap-1.5 text-sm whitespace-nowrap',
                record.type === 'Low Stock' ? 'text-error' : 'text-warning',
              ]"
            >
              <IconAlertCircle v-if="record.type === 'Low Stock'" class="size-4" />
              <IconAlertTriangle v-else class="size-4" />
              {{ record.type }}
            </div>
          </template>

          <template v-else-if="column.key === 'details'">
            <div class="text-text font-medium">{{ record.name }}</div>
            <div class="text-text-muted text-xs">{{ record.desc }}</div>
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
import { IconAlertCircle, IconAlertTriangle } from '@tabler/icons-vue';
import type { TableColumnsType } from 'ant-design-vue';

interface InventoryAlert {
  id: string;
  type: 'Low Stock' | 'Expiring';
  name: string;
  desc: string;
  action: string;
}

const columns: TableColumnsType = [
  { title: 'Item', dataIndex: 'item', key: 'item' },
  { title: 'Details', dataIndex: 'details', key: 'details' },
  { title: 'Action', key: 'action', align: 'right' },
];

const inventoryAlertsData: InventoryAlert[] = [
  {
    id: '1',
    type: 'Low Stock',
    name: 'Rabies Vaccine (1yr)',
    desc: 'Only 5 doses remaining (Lot #RV-294)',
    action: 'Reorder',
  },
  { id: '2', type: 'Expiring', name: 'DHPP', desc: 'Expires in 14 days (Lot #DP-102)', action: 'View' },
];
</script>
