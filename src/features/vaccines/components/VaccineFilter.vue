<script setup lang="ts">
import { IconSearch, IconAdjustmentsHorizontal } from '@tabler/icons-vue';

const props = defineProps<{
  searchQuery: string;
  speciesFilter: string;
}>();

const emit = defineEmits<{
  (e: 'update:searchQuery', value: string): void;
  (e: 'update:speciesFilter', value: string): void;
  (e: 'search'): void;
}>();
</script>

<template>
  <div class="card flex flex-wrap items-center justify-between gap-3 px-4 py-3.5">
    <div class="max-w-95 min-w-50 flex-1">
      <a-input
        :value="props.searchQuery"
        placeholder="Search by code, vaccine name, brand..."
        class="h-9"
        allow-clear
        @update:value="(value: string) => emit('update:searchQuery', value)"
        @press-enter="emit('search')"
      >
        <template #prefix>
          <icon-search :size="16" stroke-width="1.75" class="text-(--text-disabled)" />
        </template>
      </a-input>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <div class="flex items-center gap-1 text-(--text-label)">
        <icon-adjustments-horizontal :size="16" stroke-width="1.75" />
        <span class="text-sm font-medium whitespace-nowrap">Filter by:</span>
      </div>

      <a-select
        :value="props.speciesFilter"
        class="w-40"
        @change="(value: string) => emit('update:speciesFilter', value)"
      >
        <a-select-option value="ALL">All</a-select-option>
        <a-select-option value="DOG">Dog</a-select-option>
        <a-select-option value="CAT">Cat</a-select-option>
      </a-select>
    </div>
  </div>
</template>
