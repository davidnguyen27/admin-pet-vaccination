<script setup lang="ts">
import { useLocale } from '@/shared/composables/useLocale';
import { IconCertificate, IconCheck, IconAlertTriangle, IconX } from '@tabler/icons-vue';
import StatCard from '@/shared/components/ui/StatCard.vue';

defineProps<{
  overview: {
    total: number;
    valid: number;
    expired: number;
    revoked: number;
  };
}>();

const { t } = useLocale();
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <StatCard
      :label="t('healthCertificate.totalCount')"
      :value="overview.total"
      :icon="IconCertificate"
      icon-bg="bg-primary-soft text-primary"
    />
    <StatCard
      :label="t('healthCertificate.validCount')"
      :value="overview.valid"
      :icon="IconCheck"
      icon-bg="bg-success-bg text-success"
    />
    <StatCard
      :label="t('healthCertificate.expiredCount')"
      :value="overview.expired"
      :icon="IconAlertTriangle"
      icon-bg="bg-warning-bg text-warning"
    />
    <StatCard
      :label="t('healthCertificate.revokedCount')"
      :value="overview.revoked"
      :icon="IconX"
      icon-bg="bg-error-bg text-error"
    />
  </div>
</template>
