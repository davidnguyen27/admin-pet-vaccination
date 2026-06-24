<script setup lang="ts">
defineProps<{
  current: number;
  pageSize: number;
  total: number;
}>();

const emit = defineEmits<{
  (e: 'update:current', value: number): void;
  (e: 'update:pageSize', value: number): void;
  (e: 'change'): void;
}>();

function handleChange(page: number, pageSize: number) {
  emit('update:current', page);
  emit('update:pageSize', pageSize);
  emit('change');
}
</script>

<template>
  <div class="flex justify-end p-2">
    <a-pagination :current="current" :pageSize="pageSize" :total="total" show-size-changer @change="handleChange" />
  </div>
</template>
