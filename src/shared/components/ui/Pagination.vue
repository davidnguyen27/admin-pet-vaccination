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

const handleChange = (page: number, pageSize: number) => {
  emit('update:current', page);
  emit('update:pageSize', pageSize);
  emit('change');
};
</script>

<template>
  <div class="flex justify-start overflow-x-auto p-2 sm:justify-end">
    <a-pagination
      :current="current"
      :pageSize="pageSize"
      :total="total"
      show-size-changer
      :show-less-items="true"
      @change="handleChange"
    />
  </div>
</template>
