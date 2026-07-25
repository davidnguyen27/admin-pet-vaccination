<script setup lang="ts">
import { useLocale } from '@/shared/composables/useLocale';
import { IconX } from '@tabler/icons-vue';
import type { CSSProperties } from 'vue';

const props = defineProps<{
  open: boolean;
  title: string;
  loading?: boolean;
  okText?: string;
  cancelText?: string;
  width?: number | string;
  bodyStyle?: CSSProperties;
  maxBodyHeight?: string;
}>();

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'ok'): void;
  (e: 'cancel'): void;
}>();

const { t } = useLocale();

const handleOk = () => {
  emit('ok');
};

const handleCancel = () => {
  emit('update:open', false);
  emit('cancel');
};
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
    :body-style="bodyStyle"
  >
    <div class="flex max-h-[82vh] flex-col">
      <div class="bg-primary relative -mx-4 -mt-3 mb-3 flex shrink-0 items-center justify-center px-8 py-2.5">
        <span class="font-ibm text-center text-sm font-semibold text-white">{{ title }}</span>
        <div
          class="absolute top-1/2 right-4 flex -translate-y-1/2 cursor-pointer items-center justify-center text-white/80 transition-colors hover:text-white"
          @click="handleCancel"
        >
          <IconX size="18" stroke="2" />
        </div>
      </div>

      <div class="flex-1 overflow-y-auto px-1" :style="{ maxHeight: maxBodyHeight || 'calc(80vh - 120px)' }">
        <slot />
      </div>

      <div
        class="border-border bg-surface -mx-4 mt-4 -mb-3 flex shrink-0 items-center justify-end gap-3 border-t px-4 py-3"
      >
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
