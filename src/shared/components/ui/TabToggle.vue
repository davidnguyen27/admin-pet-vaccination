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
  <div class="border-border flex items-center gap-1 border-b">
    <button
      v-for="option in props.options"
      :key="option.key"
      @click="handleSelect(option.key)"
      class="w-32 border-b-2 px-4 py-3 text-sm font-medium transition-colors"
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
