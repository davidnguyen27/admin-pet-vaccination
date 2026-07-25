<script setup lang="ts">
import { IconEye, IconEdit, IconTrash } from '@tabler/icons-vue';
import { useLocale } from '@/shared/composables/useLocale';

interface TableActionButtonsProps {
  showView?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  viewTitle?: string;
  editTitle?: string;
  deleteTitle?: string;
}

const props = withDefaults(defineProps<TableActionButtonsProps>(), {
  showView: true,
  showEdit: true,
  showDelete: true,
  viewTitle: undefined,
  editTitle: undefined,
  deleteTitle: undefined,
});

const emit = defineEmits<{
  (e: 'view'): void;
  (e: 'edit'): void;
  (e: 'delete'): void;
}>();

const { t } = useLocale();
</script>

<template>
  <div class="flex items-center justify-center gap-1">
    <button
      v-if="props.showView"
      type="button"
      class="text-text-muted hover:bg-primary-soft hover:text-primary cursor-pointer rounded p-1 transition-colors"
      :title="props.viewTitle || t('view')"
      @click="emit('view')"
    >
      <IconEye size="15" />
    </button>
    <button
      v-if="props.showEdit"
      type="button"
      class="text-text-muted hover:bg-primary-soft hover:text-primary cursor-pointer rounded p-1 transition-colors"
      :title="props.editTitle || t('edit')"
      @click="emit('edit')"
    >
      <IconEdit size="15" />
    </button>
    <button
      v-if="props.showDelete"
      type="button"
      class="text-text-muted cursor-pointer rounded p-1 transition-colors hover:bg-red-50 hover:text-red-600"
      :title="props.deleteTitle || t('delete')"
      @click="emit('delete')"
    >
      <IconTrash size="15" />
    </button>
  </div>
</template>
