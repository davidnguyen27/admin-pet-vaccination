<script setup lang="ts">
import { computed } from 'vue';
import { IconVaccine, IconArrowRight, IconClockHour4 } from '@tabler/icons-vue';
import { useLocale } from '@/shared/composables/useLocale';
import { useStatisticsStore } from '../stores/statistics.store';
import type { UpcomingVaccination } from '../stores/statistics.store';

const { t } = useLocale();
const store = useStatisticsStore();

const upcomingVaccinations = computed(() => store.upcomingVaccinations);

const URGENCY_CONFIG: Record<UpcomingVaccination['urgency'], { tagColor: string; labelClass: string }> = {
  today: { tagColor: 'error', labelClass: 'text-error font-semibold' },
  tomorrow: { tagColor: 'warning', labelClass: 'text-warning font-medium' },
  later: { tagColor: 'default', labelClass: 'text-text-muted' },
};
</script>

<template>
  <div class="shadow-card border-divider bg-surface overflow-hidden rounded-md border">
    <div class="border-divider flex items-center justify-between border-b px-4 py-3">
      <div class="flex items-center gap-2">
        <IconVaccine class="text-primary size-4" />
        <span class="font-ibm text-text font-semibold">
          {{ t('statistics.upcomingVaccinations') }}
        </span>
        <span
          class="bg-primary/10 text-primary inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold"
        >
          {{ upcomingVaccinations.length }}
        </span>
      </div>
      <a-button type="link" size="small" class="p-0 text-xs!">
        {{ t('statistics.viewPlans') }}
        <IconArrowRight class="ml-0.5 inline size-3" />
      </a-button>
    </div>

    <!-- List -->
    <div class="divide-divider divide-y" v-if="upcomingVaccinations.length > 0">
      <div
        v-for="item in upcomingVaccinations"
        :key="item.id"
        class="hover:bg-primary-xsoft flex items-center justify-between gap-3 px-4 py-3 transition-colors"
      >
        <div class="flex min-w-0 items-center gap-3">
          <div class="bg-primary/10 flex size-8 shrink-0 items-center justify-center rounded">
            <IconVaccine class="text-primary size-4" />
          </div>
          <div class="min-w-0">
            <p class="text-text truncate text-sm font-medium">{{ item.pet }}</p>
            <p class="text-text-muted truncate text-xs">{{ item.vaccine }}</p>
          </div>
        </div>
        <div class="shrink-0 text-right">
          <div class="flex items-center gap-1">
            <IconClockHour4 class="size-3 shrink-0" :class="URGENCY_CONFIG[item.urgency].labelClass" />
            <span :class="['text-xs', URGENCY_CONFIG[item.urgency].labelClass]">
              {{ item.datetime }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="py-10 text-center">
      <IconVaccine class="text-text-disabled mx-auto mb-2 size-8" />
      <p class="text-text-muted text-sm">{{ t('statistics.noUpcomingVaccinations') }}</p>
    </div>
  </div>
</template>
