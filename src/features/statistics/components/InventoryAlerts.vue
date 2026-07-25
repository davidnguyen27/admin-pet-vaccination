<script setup lang="ts">
import { computed, type Component } from 'vue';
import { IconAlertCircle, IconAlertTriangle, IconPackage, IconArrowRight, IconCircleCheck } from '@tabler/icons-vue';
import { useLocale } from '@/shared/composables/useLocale';
import { useStatisticsStore, type InventoryAlert } from '../stores/statistics.store';

const { t } = useLocale();
const store = useStatisticsStore();

const inventoryAlertsData = computed(() => store.inventoryAlerts);

const ALERT_CONFIG: Record<
  InventoryAlert['type'],
  { icon: Component; iconBg: string; iconColor: string; badgeClass: string }
> = {
  'Low Stock': {
    icon: IconAlertCircle,
    iconBg: 'bg-error-bg',
    iconColor: 'text-error',
    badgeClass: 'bg-error-bg text-error',
  },
  Expiring: {
    icon: IconAlertTriangle,
    iconBg: 'bg-warning-bg',
    iconColor: 'text-warning',
    badgeClass: 'bg-warning-bg text-warning',
  },
};
</script>

<template>
  <div class="shadow-card border-divider bg-surface overflow-hidden rounded-md border">
    <div class="border-divider flex items-center justify-between border-b px-4 py-3">
      <div class="flex items-center gap-2">
        <IconPackage class="text-primary size-4" />
        <span class="font-ibm text-text font-semibold">{{ t('statistics.inventoryAlerts') }}</span>
        <span
          v-if="inventoryAlertsData.length > 0"
          class="bg-error-bg text-error inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold"
        >
          {{ inventoryAlertsData.length }}
        </span>
      </div>
      <a-button type="link" size="small" class="p-0! text-xs!">
        {{ t('statistics.viewInventory') }}
        <IconArrowRight class="ml-0.5 inline size-3" />
      </a-button>
    </div>

    <!-- Alert List -->
    <div v-if="inventoryAlertsData.length > 0" class="divide-divider divide-y">
      <div
        v-for="alert in inventoryAlertsData"
        :key="alert.id"
        class="hover:bg-primary-xsoft flex items-center gap-3 px-4 py-3 transition-colors"
      >
        <!-- Icon -->
        <div :class="['flex size-9 shrink-0 items-center justify-center rounded', ALERT_CONFIG[alert.type].iconBg]">
          <component :is="ALERT_CONFIG[alert.type].icon" :class="['size-4', ALERT_CONFIG[alert.type].iconColor]" />
        </div>

        <!-- Info -->
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-1.5">
            <span class="text-text text-sm font-medium">{{ alert.name }}</span>
            <span
              :class="[
                'rounded px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase',
                ALERT_CONFIG[alert.type].badgeClass,
              ]"
            >
              {{ alert.type }}
            </span>
          </div>
          <p class="text-text-muted mt-0.5 truncate text-xs">{{ alert.desc }}</p>
        </div>

        <!-- Action -->
        <a-button type="link" size="small" class="shrink-0! p-0! text-xs!">
          {{ alert.action }}
        </a-button>
      </div>
    </div>

    <!-- Empty State — All Good -->
    <div v-else class="py-10 text-center">
      <div class="bg-success-bg mx-auto mb-3 flex size-12 items-center justify-center rounded-full">
        <IconCircleCheck class="text-success size-6" />
      </div>
      <p class="text-text-subtle text-sm font-medium">
        {{ t('statistics.allInventoryGood') }}
      </p>
      <p class="text-text-muted mt-0.5 text-xs">
        {{ t('statistics.noLowStockOrExpiring') }}
      </p>
    </div>
  </div>
</template>
