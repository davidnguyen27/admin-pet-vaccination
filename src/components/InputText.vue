<script setup lang="ts">
const props = defineProps<{
  label: string;
  name: string;
  modelValue: string;
  placeholder?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const onInput = (value: string) => {
  emit('update:modelValue', value);
};
</script>

<template>
  <a-form-item :label="label" :name="name">
    <a-input :value="modelValue" @update:value="onInput" :placeholder="placeholder" />
  </a-form-item>
</template>
