<script setup lang="ts">
interface TabOption {
  label: string;
  key: string | number;
}

const props = defineProps<{
  modelValue: string | number;
  options: TabOption[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
}>();

function handleSelect(key: string | number) {
  if (props.modelValue !== key) {
    emit('update:modelValue', key);
  }
}
</script>

<template>
  <div class="border-border flex items-center gap-1 overflow-x-auto border-b">
    <button
      v-for="option in props.options"
      :key="option.key"
      @click="handleSelect(option.key)"
      class="min-w-28 shrink-0 border-b-2 px-3 py-3 text-sm font-medium whitespace-nowrap transition-colors sm:min-w-32 sm:px-4"
      :class="[
        props.modelValue === option.key
          ? 'border-primary text-primary'
          : 'text-text-muted hover:border-border hover:text-text border-transparent',
      ]"
    >
      {{ option.label }}
    </button>
  </div>
</template>
