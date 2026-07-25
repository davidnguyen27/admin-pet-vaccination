<script setup lang="ts">
import { computed } from 'vue';
import { useLocale } from '@/shared/composables/useLocale';
import { IconCpu, IconCheck, IconAlertTriangle, IconUserCheck } from '@tabler/icons-vue';
import StatCard from '@/shared/components/ui/StatCard.vue';

const props = defineProps<{
  overview: {
    total: number;
    available: number;
    implanted: number;
    defective: number;
  };
}>();

const { t } = useLocale();

const cards = computed(() => [
  {
    key: 'total',
    label: t('microchip.totalCount'),
    value: props.overview.total,
    icon: IconCpu,
    iconBg: 'bg-emerald-500 text-white',
  },
  {
    key: 'available',
    label: t('microchip.availableCount'),
    value: props.overview.available,
    icon: IconCheck,
    iconBg: 'bg-green-500 text-white',
  },
  {
    key: 'implanted',
    label: t('microchip.implantedCount'),
    value: props.overview.implanted,
    icon: IconUserCheck,
    iconBg: 'bg-sky-600 text-white',
  },
  {
    key: 'defective',
    label: t('microchip.defectiveCount'),
    value: props.overview.defective,
    icon: IconAlertTriangle,
    iconBg: 'bg-red-500 text-white',
  },
]);
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <StatCard
      v-for="card in cards"
      :key="card.key"
      :label="card.label"
      :value="card.value"
      :icon="card.icon"
      :icon-bg="card.iconBg"
    />
  </div>
</template>
