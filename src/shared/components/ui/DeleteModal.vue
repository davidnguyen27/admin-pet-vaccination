<script setup lang="ts">
const props = defineProps<{
  open: boolean;
  title?: string;
  content?: string;
  loading?: boolean;
  okText?: string;
  cancelText?: string;
}>();

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();

function handleConfirm() {
  emit('confirm');
}

function handleCancel() {
  emit('update:open', false);
  emit('cancel');
}
</script>

<template>
  <a-modal
    :open="open"
    :title="title || 'Confirm Delete'"
    @update:open="emit('update:open', $event)"
    :centered="true"
    :width="420"
    destroy-on-close
    @cancel="handleCancel"
  >
    <div class="py-2">
      <p class="text-text m-0 text-sm">
        {{ content || 'Are you sure you want to delete this item? This action cannot be undone.' }}
      </p>
    </div>

    <template #footer>
      <a-button @click="handleCancel" :disabled="loading" class="border-border hover:border-border/80! border">
        {{ cancelText || 'Cancel' }}
      </a-button>
      <a-button type="primary" danger @click="handleConfirm" :loading="loading" class="bg-error hover:opacity-80">
        {{ okText || 'Delete' }}
      </a-button>
    </template>
  </a-modal>
</template>
