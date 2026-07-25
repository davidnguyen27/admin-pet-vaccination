<script setup lang="ts">
interface SwitcherOption {
  value: string | number;
  label: string;
}

defineProps<{
  options: SwitcherOption[];
}>();

const model = defineModel<string | number>();
</script>

<template>
  <div class="bg-primary-soft border-primary/10 flex rounded border p-0.5">
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      class="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded px-3 py-1.5 text-xs font-semibold transition-all"
      :class="model === opt.value ? 'bg-surface text-primary shadow-xs' : 'text-text-muted hover:text-text'"
      @click="model = opt.value"
    >
      {{ opt.label }}
    </button>
  </div>
</template>
