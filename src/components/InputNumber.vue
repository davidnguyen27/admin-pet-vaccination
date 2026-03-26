<script setup lang="ts">
const props = defineProps<{
  label: string;
  name: string;
  modelValue: number;
  min?: number;
  max?: number;
  step?: number;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
}>();

const onInput = (value: number) => {
  emit('update:modelValue', value);
};
</script>

<template>
  <a-form-item :label="label" :name="name">
    <a-input-number :value="modelValue" @update:value="onInput" :min="min" :max="max" :step="step" class="w-full" />
  </a-form-item>
</template>
