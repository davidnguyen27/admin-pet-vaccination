<script setup lang="ts">
import { IconSearch } from '@tabler/icons-vue';

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    placeholder?: string;
    size?: 'small' | 'middle' | 'large';
    inputClass?: string;
  }>(),
  {
    modelValue: '',
    placeholder: 'Search...',
    size: 'middle',
    inputClass: 'w-full sm:w-64',
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'search'): void;
  (e: 'pressEnter'): void;
}>();

const handleInput = (val: string) => {
  emit('update:modelValue', val || '');
};

const handlePressEnter = () => {
  emit('pressEnter');
  emit('search');
};
</script>

<template>
  <a-input
    :value="props.modelValue"
    :size="props.size"
    :class="props.inputClass"
    :placeholder="props.placeholder"
    allow-clear
    @update:value="handleInput"
    @press-enter="handlePressEnter"
  >
    <template #prefix>
      <IconSearch size="16" class="text-text-muted" />
    </template>
  </a-input>
</template>
