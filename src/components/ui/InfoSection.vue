<script setup lang="ts">
defineProps<{
  title: string;
  gridCols?: string;
}>();
</script>

<template>
  <section class="border border-(--divider) bg-(--bg-card) p-4 shadow-sm">
    <h3 class="m-0 text-xs font-semibold tracking-[0.12em] text-(--text-label) uppercase">{{ title }}</h3>
    <div class="mt-4 grid gap-3" :class="gridCols || 'sm:grid-cols-2 lg:grid-cols-3'">
      <slot />
    </div>
  </section>
</template>
