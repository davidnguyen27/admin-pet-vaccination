<template>
  <div class="border-divider rounded border bg-white p-4 shadow-sm">
    <h2 class="font-ibm text-text mb-4 font-semibold">Upcoming Vaccinations</h2>
    <div class="overflow-x-auto">
      <a-table :columns="columns" :data-source="upcomingVaccinations" :pagination="false" row-key="id" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TableColumnsType } from 'ant-design-vue';

interface UpcomingVaccination {
  id: string;
  pet: string;
  vaccine: string;
  datetime: string;
}

const columns: TableColumnsType = [
  { title: 'Pet', dataIndex: 'pet', key: 'pet' },
  { title: 'Vaccine', dataIndex: 'vaccine', key: 'vaccine' },
  { title: 'Date/Time', dataIndex: 'datetime', key: 'datetime', align: 'right' },
];

const upcomingVaccinations: UpcomingVaccination[] = [
  { id: '1', pet: 'Luna', vaccine: 'FVRCP Booster', datetime: 'Today, 11:00 AM' },
  { id: '2', pet: 'Charlie', vaccine: 'Lyme Disease', datetime: 'Today, 2:15 PM' },
  { id: '3', pet: 'Daisy', vaccine: 'Bordetella', datetime: 'Tomorrow' },
];
</script>
