<script setup lang="ts">
const props = defineProps<{
  label: string;
  name: string;
  modelValue: string;
  rows?: number;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const onInput = (value: string | undefined) => {
  emit('update:modelValue', value ?? '');
};
</script>

<template>
  <a-form-item :label="label" :name="name" class="sm:col-span-2">
    <a-textarea :value="modelValue" :rows="rows" @update:value="onInput" />
  </a-form-item>
</template>
