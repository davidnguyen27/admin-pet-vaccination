<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useLocale } from '@/shared/composables/useLocale';
import { IconRotate, IconPlus } from '@tabler/icons-vue';
import SearchInput from '@/shared/components/ui/SearchInput.vue';

const props = defineProps<{
  search?: string;
  status?: string;
}>();

const emit = defineEmits<{
  (e: 'search'): void;
  (e: 'reset'): void;
  (e: 'create'): void;
  (e: 'update:search', value: string): void;
  (e: 'update:status', value: string | undefined): void;
}>();

const { t } = useLocale();

const localSearch = ref(props.search || '');
const localStatus = ref<string | undefined>(props.status);

watch(
  () => props.search,
  newVal => {
    localSearch.value = newVal || '';
  },
);

watch(
  () => props.status,
  newVal => {
    localStatus.value = newVal;
  },
);

const statusOptions = computed(() => [
  { value: 'AVAILABLE', label: t('microchip.available') },
  { value: 'IMPLANTED', label: t('microchip.implanted') },
  { value: 'DEFECTIVE', label: t('microchip.defective') },
]);

const handleSearchInput = (val: string) => {
  localSearch.value = val;
  emit('update:search', val);
};

const handleStatusChange = (val: string | undefined) => {
  localStatus.value = val;
  emit('update:status', val);
  emit('search');
};

const handleSearch = () => {
  emit('search');
};

const handleReset = () => {
  localSearch.value = '';
  localStatus.value = undefined;
  emit('update:search', '');
  emit('update:status', undefined);
  emit('reset');
};
</script>

<template>
  <div class="bg-surface border-border flex flex-col gap-4 border p-4">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <!-- Filters -->
      <div class="flex flex-1 flex-wrap items-center gap-3">
        <SearchInput
          v-model="localSearch"
          size="middle"
          input-class="w-full sm:w-64"
          :placeholder="t('microchip.searchPlaceholder')"
          @update:model-value="handleSearchInput"
          @search="handleSearch"
        />

        <a-select
          :value="localStatus"
          size="middle"
          class="w-44"
          :placeholder="t('microchip.statusPlaceholder')"
          allow-clear
          :options="statusOptions"
          @change="handleStatusChange"
        />

        <a-button size="middle" @click="handleReset">
          <template #icon><IconRotate size="16" /></template>
          <span>{{ t('reset') }}</span>
        </a-button>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-3">
        <a-button type="primary" size="middle" class="flex items-center gap-1.5 rounded" @click="emit('create')">
          <template #icon><IconPlus size="16" /></template>
          <span class="text-xs font-medium">{{ t('microchip.addMicrochip') }}</span>
        </a-button>
      </div>
    </div>
  </div>
</template>
