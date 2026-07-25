<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import {
  IconPlus,
  IconVaccine,
  IconEdit,
  IconTrash,
  IconCalendarTime,
  IconSparkles,
  IconFilter,
} from '@tabler/icons-vue';

import Switcher from '@/shared/components/ui/Switcher.vue';
import { useLocale } from '@/shared/composables/useLocale';
import { useVaccineStore } from '@/store/vaccineStore';
import type { VaccineProtocol } from '@/shared/types/vaccine.type';

const emit = defineEmits<{
  (e: 'openAdd'): void;
  (e: 'openEdit', record: VaccineProtocol): void;
  (e: 'openDelete', record: VaccineProtocol): void;
}>();

const { t } = useLocale();
const vaccineStore = useVaccineStore();
const { listProtocol } = storeToRefs(vaccineStore);

const activeSpecies = ref<'dog' | 'cat'>('dog');
const activeDisease = ref<string>('ALL');

const speciesOptions = computed(() => [
  { value: 'dog' as const, label: t('vaccine.speciesOptions.dog') },
  { value: 'cat' as const, label: t('vaccine.speciesOptions.cat') },
]);

const diseasesList = computed(() => {
  return vaccineStore.getDiseasesBySpecies(activeSpecies.value);
});

const rawProtocolsData = computed(() => listProtocol.value.data);

// Filter protocols by activeSpecies and activeDisease
const filteredProtocols = computed(() => {
  return rawProtocolsData.value.filter(p => {
    if (p.species !== activeSpecies.value) return false;
    if (activeDisease.value !== 'ALL' && p.disease !== activeDisease.value) return false;
    return true;
  });
});

// Sort chronologically by age in days
const sortedProtocols = computed(() => {
  const list = [...filteredProtocols.value];
  return list.sort((a, b) => parseAgeToDays(a.ageRange) - parseAgeToDays(b.ageRange));
});

const parseAgeToDays = (ageRange: string): number => {
  const norm = ageRange.toLowerCase();
  if (norm.includes('booster') || norm.includes('year') || norm.includes('annual')) {
    return 365;
  }
  const match = norm.match(/(\d+)/);
  if (match && match[1]) {
    const val = parseInt(match[1], 10);
    if (norm.includes('week')) return val * 7;
    if (norm.includes('month')) return val * 30;
    return val;
  }
  return 999;
};

watch(activeSpecies, () => {
  activeDisease.value = 'ALL';
  updateProtocolFilters();
});

watch(activeDisease, () => {
  updateProtocolFilters();
});

const updateProtocolFilters = () => {
  vaccineStore.setProtocolFilters({
    species: activeSpecies.value,
    disease: activeDisease.value === 'ALL' ? undefined : activeDisease.value,
  });
  vaccineStore.fetchProtocolList();
};

const getMilestonesCount = (diseaseName: string) => {
  if (diseaseName === 'ALL') {
    return rawProtocolsData.value.filter(p => p.species === activeSpecies.value).length;
  }
  return vaccineStore.getMilestonesCount(activeSpecies.value, diseaseName);
};
</script>

<template>
  <div class="pt-2">
    <!-- Top Header & Filter Controls Bar -->
    <div
      class="bg-surface border-border mb-6 flex flex-col gap-4 border p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="flex items-center gap-3">
        <div class="bg-primary-soft text-primary flex h-10 w-10 items-center justify-center rounded">
          <IconCalendarTime size="22" />
        </div>
        <div>
          <h2 class="text-text font-ibm text-base font-bold uppercase tracking-wide">
            {{ t('vaccine.protocolsTab') }} -
            {{ activeSpecies === 'dog' ? t('vaccine.speciesOptions.dog') : t('vaccine.speciesOptions.cat') }}
          </h2>
          <p class="text-text-muted text-xs">
            {{ t('vaccine.timelineOverviewSubtitle') }}
          </p>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <div class="w-48">
          <Switcher v-model="activeSpecies" :options="speciesOptions" />
        </div>
        <a-button type="primary" size="middle" class="flex items-center gap-1.5 rounded" @click="emit('openAdd')">
          <template #icon><IconPlus size="16" /></template>
          <span class="text-xs font-medium">{{ t('vaccine.addMilestone') }}</span>
        </a-button>
      </div>
    </div>

    <!-- Main Content Area: Left Disease Filter & Right Horizontal Timeline Roadmap -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-4">
      <!-- Left Sidebar: Disease Filter Menu -->
      <div class="bg-surface border-border flex flex-col gap-4 border p-4 md:col-span-1">
        <div>
          <span class="text-text-subtle mb-2 block text-xs font-semibold tracking-wider uppercase">
            {{ t('vaccine.disease') }}
          </span>
          <div class="flex flex-col gap-1">
            <!-- 'ALL' Option -->
            <button
              type="button"
              class="flex w-full items-center justify-between rounded border px-3 py-2 text-left text-xs font-medium transition"
              :class="
                activeDisease === 'ALL'
                  ? 'bg-primary-soft border-primary/30 text-primary font-semibold'
                  : 'text-text hover:bg-primary-soft/50 hover:text-primary border-transparent bg-transparent'
              "
              @click="activeDisease = 'ALL'"
            >
              <div class="flex items-center gap-2">
                <IconFilter size="14" />
                <span>{{ t('vaccine.allDiseasesOverview') }}</span>
              </div>
              <span class="bg-divider/60 text-text-muted rounded px-1.5 py-0.5 font-mono text-[10px] font-bold">
                {{ getMilestonesCount('ALL') }}
              </span>
            </button>

            <!-- Specific Diseases -->
            <button
              v-for="d in diseasesList"
              :key="d"
              type="button"
              class="flex w-full items-center justify-between rounded border px-3 py-2 text-left text-xs font-medium transition"
              :class="
                activeDisease === d
                  ? 'bg-primary-soft border-primary/30 text-primary font-semibold'
                  : 'text-text hover:bg-primary-soft/50 hover:text-primary border-transparent bg-transparent'
              "
              @click="activeDisease = d"
            >
              <span>{{ d }}</span>
              <span class="bg-divider/60 text-text-muted rounded px-1.5 py-0.5 font-mono text-[10px] font-bold">
                {{ getMilestonesCount(d) }}
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Right Panel: Visual Timeline Track -->
      <div class="flex flex-col gap-6 md:col-span-3">
        <!-- Horizontal Timeline Roadmap Canvas -->
        <div v-if="sortedProtocols.length" class="bg-surface border-border overflow-x-auto border p-6">
          <div class="mb-4 flex items-center justify-between border-b pb-3">
            <div class="flex items-center gap-2">
              <span class="bg-primary/10 text-primary rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wider">
                {{ t('vaccine.timelineOverviewTitle') }} ({{
                  activeSpecies === 'dog' ? t('vaccine.speciesOptions.dog') : t('vaccine.speciesOptions.cat')
                }})
              </span>
              <span v-if="activeDisease !== 'ALL'" class="text-text-muted text-xs font-medium">
                ({{ activeDisease }})
              </span>
            </div>
            <span class="text-text-muted text-xs">{{ t('vaccine.scrollHorizontalTip') }}</span>
          </div>

          <!-- Timeline Track Container -->
          <div class="relative min-w-[720px] px-4 py-10">
            <!-- Central Horizontal Timeline Axis Line -->
            <div class="bg-primary/30 absolute top-1/2 left-0 right-0 h-1.5 -translate-y-1/2 rounded-full"></div>

            <!-- Milestones Grid / Alternating Top & Bottom -->
            <div class="relative flex justify-between gap-6">
              <div
                v-for="(item, idx) in sortedProtocols"
                :key="item.id"
                class="relative flex min-w-[150px] flex-1 flex-col items-center"
              >
                <!-- TOP CARD (for even index) -->
                <div
                  v-if="idx % 2 === 0"
                  class="bg-surface-soft border-border hover:border-primary group relative mb-8 w-full rounded border p-3 shadow-xs transition-all hover:shadow-md"
                >
                  <div class="mb-1 flex items-center justify-between gap-1">
                    <span class="text-primary font-mono text-[11px] font-bold">
                      {{ item.ageRange }}
                    </span>
                    <a-tag :color="item.isRequired ? 'red' : 'blue'" class="m-0 px-1 py-0 text-[10px] font-medium">
                      {{ item.isRequired ? t('vaccine.core') : t('vaccine.nonCore') }}
                    </a-tag>
                  </div>
                  <div class="text-text truncate text-xs font-bold" :title="item.vaccineName">
                    {{ item.vaccineName }}
                  </div>
                  <div class="text-text-muted mt-0.5 font-mono text-[11px]">
                    {{ item.disease }} ({{ item.vaccineCode }})
                  </div>
                  <!-- Actions -->
                  <div
                    class="mt-2 flex items-center justify-end gap-1 border-t pt-1.5 opacity-80 group-hover:opacity-100"
                  >
                    <button
                      class="text-primary hover:bg-primary-soft cursor-pointer rounded p-1"
                      @click="emit('openEdit', item)"
                    >
                      <IconEdit size="14" />
                    </button>
                    <button
                      class="text-error hover:bg-error-bg cursor-pointer rounded p-1"
                      @click="emit('openDelete', item)"
                    >
                      <IconTrash size="14" />
                    </button>
                  </div>
                  <!-- Downward Stem Line pointing to Pin -->
                  <div class="bg-primary/40 absolute -bottom-8 left-1/2 h-8 w-0.5 -translate-x-1/2"></div>
                </div>

                <!-- Spacer if odd index (so top stays empty) -->
                <div v-else class="h-28"></div>

                <!-- Pin Syringe Badge Node on the Axis -->
                <div
                  class="bg-surface border-primary text-primary relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 shadow-xs transition-transform hover:scale-110"
                >
                  <IconVaccine size="18" />
                </div>
                <div class="text-text-subtle mt-1 text-center font-mono text-[11px] font-bold">
                  {{ item.ageRange }}
                </div>

                <!-- BOTTOM CARD (for odd index) -->
                <div
                  v-if="idx % 2 !== 0"
                  class="bg-surface-soft border-border hover:border-primary group relative mt-8 w-full rounded border p-3 shadow-xs transition-all hover:shadow-md"
                >
                  <!-- Upward Stem Line pointing to Pin -->
                  <div class="bg-primary/40 absolute -top-8 left-1/2 h-8 w-0.5 -translate-x-1/2"></div>
                  <div class="mb-1 flex items-center justify-between gap-1">
                    <span class="text-primary font-mono text-[11px] font-bold">
                      {{ item.ageRange }}
                    </span>
                    <a-tag :color="item.isRequired ? 'red' : 'blue'" class="m-0 px-1 py-0 text-[10px] font-medium">
                      {{ item.isRequired ? t('vaccine.core') : t('vaccine.nonCore') }}
                    </a-tag>
                  </div>
                  <div class="text-text truncate text-xs font-bold" :title="item.vaccineName">
                    {{ item.vaccineName }}
                  </div>
                  <div class="text-text-muted mt-0.5 font-mono text-[11px]">
                    {{ item.disease }} ({{ item.vaccineCode }})
                  </div>
                  <!-- Actions -->
                  <div
                    class="mt-2 flex items-center justify-end gap-1 border-t pt-1.5 opacity-80 group-hover:opacity-100"
                  >
                    <button
                      class="text-primary hover:bg-primary-soft cursor-pointer rounded p-1"
                      @click="emit('openEdit', item)"
                    >
                      <IconEdit size="14" />
                    </button>
                    <button
                      class="text-error hover:bg-error-bg cursor-pointer rounded p-1"
                      @click="emit('openDelete', item)"
                    >
                      <IconTrash size="14" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Annual Booster Footer Banner (Nhắc lại hàng năm) -->
        <div
          v-if="sortedProtocols.length"
          class="bg-primary-soft border-primary/20 flex flex-col gap-2 rounded border p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="flex items-center gap-2.5">
            <div class="bg-primary flex h-8 w-8 items-center justify-center rounded-full text-white">
              <IconSparkles size="18" />
            </div>
            <div>
              <span class="text-primary block font-mono text-xs font-bold uppercase tracking-wider">
                {{ t('vaccine.annualBoosterTitle') }}
              </span>
              <p class="text-text-subtle text-xs">
                {{ t('vaccine.annualBoosterDesc') }}
              </p>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-else
          class="bg-surface border-border flex flex-col items-center justify-center gap-3 rounded border border-dashed px-4 py-12 text-center"
        >
          <div class="bg-primary-soft text-primary rounded-full p-3">
            <IconVaccine size="32" stroke="1.5" />
          </div>
          <div class="max-w-md">
            <h3 class="text-text mb-1 text-sm font-semibold">
              {{ t('vaccine.emptyProtocols') }}
            </h3>
            <p class="text-text-muted mb-4 text-xs">
              {{ t('vaccine.emptyProtocolsDesc') }}
            </p>
            <a-button type="primary" size="middle" class="rounded" @click="emit('openAdd')">
              {{ t('vaccine.addMilestone') }}
            </a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
