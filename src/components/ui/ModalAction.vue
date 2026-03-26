<script setup lang="ts">
withDefaults(
  defineProps<{
    loading?: boolean;
    cancelText?: string;
    submitText: string;
  }>(),
  {
    loading: false,
    cancelText: 'Cancel',
  },
);

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'submit'): void;
}>();
</script>

<template>
  <div class="flex justify-end gap-2 border-t pt-4">
    <a-button @click="emit('cancel')">{{ cancelText }}</a-button>
    <a-button type="primary" :loading="loading" class="bg-(--color-primary)!" @click="emit('submit')">
      {{ submitText }}
    </a-button>
  </div>
</template>
