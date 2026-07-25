<script setup lang="ts">
import { computed } from 'vue';

interface StatusBadgeProps {
  status: string;
  text?: string;
  colorClass?: string;
}

const props = defineProps<StatusBadgeProps>();

const badgeClass = computed(() => {
  if (props.colorClass) return props.colorClass;

  const normalized = props.status?.toUpperCase() || '';
  switch (normalized) {
    case 'ACTIVE':
    case 'VALID':
    case 'AVAILABLE':
    case 'COMPLETED':
    case 'SUCCESS':
      return 'bg-green-100 text-green-700 border-green-300';

    case 'SCHEDULED':
    case 'IN_PROGRESS':
    case 'CHECKED_IN':
    case 'IMPLANTED':
      return 'bg-blue-100 text-blue-700 border-blue-300';

    case 'FULLY_REDEEMED':
    case 'WAITING':
    case 'PENDING':
      return 'bg-amber-100 text-amber-700 border-amber-300';

    case 'EXPIRED':
    case 'REVOKED':
    case 'CANCELLED':
    case 'INACTIVE':
    case 'DEFECTIVE':
      return 'bg-red-100 text-red-700 border-red-300';

    default:
      return 'bg-gray-100 text-gray-600 border-gray-300';
  }
});
</script>

<template>
  <span
    :class="[
      'inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase',
      badgeClass,
    ]"
  >
    {{ props.text || props.status }}
  </span>
</template>
