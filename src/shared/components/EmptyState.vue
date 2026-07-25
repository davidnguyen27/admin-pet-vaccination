<script setup lang="ts">
import type { Component } from 'vue';
import { IconInbox } from '@tabler/icons-vue';

const props = withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    icon?: Component;
  }>(),
  {
    title: 'No Data Available',
    description: 'There are no items to display at the moment.',
    icon: undefined,
  },
);
</script>

<template>
  <div class="border-divider bg-surface flex flex-col items-center justify-center rounded border p-8 text-center">
    <div class="bg-primary-soft text-primary mb-3 flex size-14 items-center justify-center rounded-full">
      <component :is="props.icon || IconInbox" size="28" />
    </div>
    <h3 class="font-ibm text-text text-base font-semibold">{{ props.title }}</h3>
    <p v-if="props.description" class="text-text-muted mt-1 max-w-sm text-xs">{{ props.description }}</p>
    <div v-if="$slots.actions || $slots.default" class="mt-4 flex items-center justify-center gap-2">
      <slot name="actions">
        <slot />
      </slot>
    </div>
  </div>
</template>
