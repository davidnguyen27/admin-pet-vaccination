<script setup lang="ts">
const props = defineProps<{
  label: string;
  name: string;
  modelValue: string;
  options: { value: string; label: string }[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const onInput = (value: string) => {
  emit('update:modelValue', value);
};
</script>

<template>
  <a-form-item :label="label" :name="name" class="sm:col-span-2">
    <a-select :value="modelValue" @change="onInput">
      <a-select-option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </a-select-option>
    </a-select>
  </a-form-item>
</template>
