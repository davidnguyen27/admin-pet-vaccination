<script setup lang="ts">
import { useLocale } from '@/shared/composables/useLocale';
import { IconX } from '@tabler/icons-vue';

const props = defineProps<{
  open: boolean;
  title: string;
  loading?: boolean;
  okText?: string;
  cancelText?: string;
  width?: number | string;
}>();

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'ok'): void;
  (e: 'cancel'): void;
}>();

const { t } = useLocale();

function handleOk() {
  emit('ok');
}

function handleCancel() {
  emit('update:open', false);
  emit('cancel');
}
</script>

<template>
  <a-modal
    :open="open"
    @update:open="emit('update:open', $event)"
    :centered="true"
    :width="width"
    destroy-on-close
    :closable="false"
    :footer="null"
  >
    <div class="flex flex-col">
      <div class="bg-secondary -mx-4 -mt-3 mb-4 flex items-center justify-between px-4 py-3">
        <span class="font-ibm mx-auto text-base font-medium text-white">{{ title }}</span>
        <div class="flex cursor-pointer items-center justify-center text-white" @click="handleCancel">
          <IconX size="20" stroke="2" />
        </div>
      </div>

      <div class="flex-1 px-1">
        <slot />
      </div>

      <div class="border-border bg-surface -mx-4 mt-6 -mb-3 flex items-center justify-end gap-3 border-t px-4 py-3">
        <slot name="footer">
          <a-button @click="handleCancel" :disabled="loading">
            {{ cancelText || t('Cancel') }}
          </a-button>
          <a-button type="primary" @click="handleOk" :loading="loading" class="shadow-sm">
            {{ okText || t('Save') }}
          </a-button>
        </slot>
      </div>
    </div>
  </a-modal>
</template>
