<script setup lang="ts">
defineProps<{
  label: string;
  value?: string | number | null;
  fullWidth?: boolean;
  colSpan?: number;
}>();
</script>

<template>
  <div
    class="border border-(--divider) bg-(--bg-page) p-3"
    :class="[fullWidth ? 'sm:col-span-2 lg:col-span-4' : '', colSpan ? `lg:col-span-${colSpan}` : '']"
  >
    <p class="m-0 text-[11px] font-semibold tracking-[0.12em] text-(--text-label) uppercase">
      {{ label }}
    </p>
    <p class="m-0 mt-1.5 text-sm" :class="fullWidth ? 'break-all' : ''">
      <slot>
        {{ value }}
      </slot>
    </p>
  </div>
</template>
