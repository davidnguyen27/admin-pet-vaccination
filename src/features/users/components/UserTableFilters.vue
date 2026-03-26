<script setup lang="ts">
import { IconSearch, IconAdjustmentsHorizontal } from '@tabler/icons-vue';

const props = defineProps<{
  searchQuery: string;
  roleFilter: string;
  statusFilter: string;
}>();

const emit = defineEmits<{
  (e: 'update:searchQuery', val: string): void;
  (e: 'update:roleFilter', val: string): void;
  (e: 'update:statusFilter', val: string): void;
  (e: 'search'): void;
}>();
</script>

<template>
  <div class="card flex flex-wrap items-center justify-between gap-3 px-4 py-3.5">
    <!-- Search -->
    <div class="max-w-95 min-w-50 flex-1">
      <a-input
        :value="props.searchQuery"
        placeholder="Search by name, email or phone..."
        class="h-9"
        allow-clear
        @update:value="(val: string) => emit('update:searchQuery', val)"
        @press-enter="emit('search')"
      >
        <template #prefix>
          <icon-search :size="16" stroke-width="1.75" class="text-(--text-disabled)" />
        </template>
      </a-input>
    </div>

    <!-- Right side: dropdowns -->
    <div class="flex flex-wrap items-center gap-2">
      <div class="flex items-center gap-1 text-(--text-label)">
        <icon-adjustments-horizontal :size="16" stroke-width="1.75" />
        <span class="text-sm font-medium whitespace-nowrap">Filter by:</span>
      </div>

      <a-select :value="props.roleFilter" class="w-32.5" @change="(val: string) => emit('update:roleFilter', val)">
        <a-select-option value="ALL">All Roles</a-select-option>
        <a-select-option value="ADMIN">Admin</a-select-option>
        <a-select-option value="STAFF">Staff</a-select-option>
        <a-select-option value="OWN">Owner</a-select-option>
      </a-select>

      <a-select :value="props.statusFilter" class="w-32.5" @change="(val: string) => emit('update:statusFilter', val)">
        <a-select-option value="ALL">All Status</a-select-option>
        <a-select-option value="ACTIVE">Active</a-select-option>
        <a-select-option value="INACTIVE">Inactive</a-select-option>
      </a-select>
    </div>
  </div>
</template>
