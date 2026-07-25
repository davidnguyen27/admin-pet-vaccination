<script setup lang="ts">
import type { Component } from 'vue';

interface StatCardProps {
  label: string;
  value: string | number;
  subText?: string;
  icon?: Component;
  iconBg?: string;
}

const props = withDefaults(defineProps<StatCardProps>(), {
  subText: undefined,
  icon: undefined,
  iconBg: 'bg-primary-soft text-primary',
});
</script>

<template>
  <div
    class="bg-surface border-divider hover:border-primary/40 flex flex-col justify-between rounded border p-4 shadow-xs transition-all"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="flex flex-col gap-1">
        <span class="text-text-muted text-xs font-semibold tracking-wider uppercase">{{ props.label }}</span>
        <span class="text-text font-mono text-2xl font-bold">{{ props.value }}</span>
      </div>
      <div
        v-if="props.icon"
        :class="['flex h-11 w-11 shrink-0 items-center justify-center rounded-lg shadow-xs', props.iconBg]"
      >
        <component :is="props.icon" size="22" />
      </div>
    </div>
    <div v-if="props.subText" class="border-divider mt-3 flex items-center justify-between border-t pt-2">
      <span class="text-text-subtle text-xs">{{ props.subText }}</span>
    </div>
  </div>
</template>
