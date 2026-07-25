<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { IconSun, IconSunHigh, IconStethoscope, IconUsers } from '@tabler/icons-vue';
import { useLocale } from '@/shared/composables/useLocale';
import { useWorkingScheduleStore } from '@/store/workingScheduleStore';
import StatCard from '@/shared/components/ui/StatCard.vue';

const { t } = useLocale();
const scheduleStore = useWorkingScheduleStore();
const { overviewStats } = storeToRefs(scheduleStore);

const capacityPercentage = computed(() => {
  if (overviewStats.value.totalCapacity === 0) return 0;
  return Math.round((overviewStats.value.bookedCapacity / overviewStats.value.totalCapacity) * 100);
});

const cards = computed(() => [
  {
    key: 'totalShifts',
    label: t('schedule.totalScheduled'),
    value: overviewStats.value.totalScheduledToday,
    subText: `${overviewStats.value.activeVetsCount} bác sĩ trực`,
    icon: IconStethoscope,
    iconBg: 'bg-emerald-600 text-white',
  },
  {
    key: 'morning',
    label: t('schedule.morningShifts'),
    value: overviewStats.value.morningCount,
    subText: '07:30 - 11:30',
    icon: IconSun,
    iconBg: 'bg-amber-500 text-white',
  },
  {
    key: 'afternoon',
    label: t('schedule.afternoonShifts'),
    value: overviewStats.value.afternoonCount,
    subText: '13:00 - 17:00',
    icon: IconSunHigh,
    iconBg: 'bg-orange-500 text-white',
  },
  {
    key: 'capacity',
    label: t('schedule.capacityUtilization'),
    value: `${capacityPercentage.value}%`,
    subText: `${overviewStats.value.bookedCapacity}/${overviewStats.value.totalCapacity} ca hẹn`,
    icon: IconUsers,
    iconBg: 'bg-sky-600 text-white',
  },
]);
</script>

<template>
  <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    <StatCard
      v-for="card in cards"
      :key="card.key"
      :label="card.label"
      :value="card.value"
      :sub-text="card.subText"
      :icon="card.icon"
      :icon-bg="card.iconBg"
    />
  </div>
</template>
