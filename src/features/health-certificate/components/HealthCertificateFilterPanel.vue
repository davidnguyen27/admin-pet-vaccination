<script setup lang="ts">
import { ref, watch } from 'vue';
import { useLocale } from '@/shared/composables/useLocale';
import { IconRefresh } from '@tabler/icons-vue';
import SearchInput from '@/shared/components/ui/SearchInput.vue';

const props = defineProps<{
  search?: string;
  status?: string;
  purpose?: string;
}>();

const emit = defineEmits<{
  (e: 'search'): void;
  (e: 'reset'): void;
  (e: 'update:search', value: string): void;
  (e: 'update:status', value: string | undefined): void;
  (e: 'update:purpose', value: string | undefined): void;
}>();

const { t } = useLocale();

const localSearch = ref(props.search || '');
const localStatus = ref<string | undefined>(props.status);
const localPurpose = ref<string | undefined>(props.purpose);

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

watch(
  () => props.purpose,
  newVal => {
    localPurpose.value = newVal;
  },
);

const onSearchInput = (e: Event) => {
  const val = (e.target as HTMLInputElement).value;
  localSearch.value = val;
  emit('update:search', val);
};

const onStatusChange = (val: string | undefined) => {
  localStatus.value = val;
  emit('update:status', val);
};

const onPurposeChange = (val: string | undefined) => {
  localPurpose.value = val;
  emit('update:purpose', val);
};

const handleSearch = () => {
  emit('search');
};

const handleReset = () => {
  localSearch.value = '';
  localStatus.value = undefined;
  localPurpose.value = undefined;
  emit('update:search', '');
  emit('update:status', undefined);
  emit('update:purpose', undefined);
  emit('reset');
};
</script>

<template>
  <div
    class="border-divider bg-surface shadow-card flex flex-col gap-4 rounded border p-4 lg:flex-row lg:items-center lg:justify-between"
  >
    <div class="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
      <!-- Search input -->
      <div class="w-full sm:max-w-xs">
        <SearchInput
          v-model="localSearch"
          size="large"
          input-class="w-full"
          :placeholder="t('healthCertificate.searchPlaceholder')"
          @update:model-value="onSearchInput({ target: { value: $event } } as any)"
          @search="handleSearch"
        />
      </div>

      <!-- Status filter -->
      <div class="w-full sm:w-44">
        <a-select
          :value="localStatus"
          size="large"
          class="w-full"
          :placeholder="t('healthCertificate.statusPlaceholder')"
          :allow-clear="true"
          @change="onStatusChange"
        >
          <a-select-option value="VALID">{{ t('healthCertificate.statusVal.valid') }}</a-select-option>
          <a-select-option value="EXPIRED">{{ t('healthCertificate.statusVal.expired') }}</a-select-option>
          <a-select-option value="REVOKED">{{ t('healthCertificate.statusVal.revoked') }}</a-select-option>
        </a-select>
      </div>

      <!-- Purpose filter -->
      <div class="w-full sm:w-52">
        <a-select
          :value="localPurpose"
          size="large"
          class="w-full"
          :placeholder="t('healthCertificate.purposePlaceholder')"
          :allow-clear="true"
          @change="onPurposeChange"
        >
          <a-select-option value="DOMESTIC_TRAVEL">{{
            t('healthCertificate.purposeVal.domesticTravel')
          }}</a-select-option>
          <a-select-option value="INTERNATIONAL_EXPORT">{{
            t('healthCertificate.purposeVal.internationalExport')
          }}</a-select-option>
          <a-select-option value="GENERAL_HEALTH">{{
            t('healthCertificate.purposeVal.generalHealth')
          }}</a-select-option>
          <a-select-option value="SHOW_COMPETITION">{{
            t('healthCertificate.purposeVal.showCompetition')
          }}</a-select-option>
        </a-select>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <a-button size="large" class="flex items-center gap-2 rounded" @click="handleReset">
        <template #icon><IconRefresh class="size-4" /></template>
        <span>{{ t('reset') }}</span>
      </a-button>
      <a-button type="primary" size="large" class="rounded" @click="handleSearch">
        <span>{{ t('search') }}</span>
      </a-button>
    </div>
  </div>
</template>
