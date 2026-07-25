<script setup lang="ts">
import { useLocale } from '@/shared/composables/useLocale';
import ModalLayout from '@/layouts/ModalLayout.vue';
import { formatDate } from '@/shared/utils';
import type { Microchip } from '@/shared/types/microchip.type';
import StatusBadge from '@/shared/components/ui/StatusBadge.vue';

defineProps<{
  open: boolean;
  data: Microchip | null;
}>();

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
}>();

const { t } = useLocale();

const getStatusText = (status: string) => {
  switch (status) {
    case 'AVAILABLE':
      return t('microchip.available');
    case 'IMPLANTED':
      return t('microchip.implanted');
    case 'DEFECTIVE':
      return t('microchip.defective');
    default:
      return status;
  }
};
</script>

<template>
  <ModalLayout
    :open="open"
    :title="t('microchip.microchipDetail')"
    @update:open="emit('update:open', $event)"
    @cancel="() => emit('update:open', false)"
    :cancel-text="t('cancel')"
    :width="540"
  >
    <div v-if="data" class="flex flex-col gap-6 pt-4">
      <!-- General Info Grid -->
      <div class="grid grid-cols-1 gap-y-4 sm:grid-cols-2">
        <div>
          <span class="text-text-muted block text-[11px] font-semibold tracking-wider uppercase">
            {{ t('microchip.microchipNo') }}
          </span>
          <span class="text-text font-ibm mt-1 block text-sm font-semibold tracking-wide">
            {{ data.microchipNo }}
          </span>
        </div>

        <div>
          <span class="text-text-muted block text-[11px] font-semibold tracking-wider uppercase">
            {{ t('microchip.status') }}
          </span>
          <div class="mt-1">
            <StatusBadge :status="data.status" :text="getStatusText(data.status)" />
          </div>
        </div>

        <div>
          <span class="text-text-muted block text-[11px] font-semibold tracking-wider uppercase">
            {{ t('microchip.manufacturer') }}
          </span>
          <span class="text-text mt-1 block text-sm font-medium">
            {{ data.manufacturer || '-' }}
          </span>
        </div>
      </div>

      <!-- Implantation Info Section -->
      <div
        v-if="data.status === 'IMPLANTED'"
        class="bg-primary-soft/30 border-divider flex flex-col gap-4 rounded border p-4"
      >
        <h3 class="font-ibm text-primary text-xs font-bold tracking-wider uppercase">
          {{ t('microchip.implantInfo') }}
        </h3>

        <div class="grid grid-cols-1 gap-y-4 sm:grid-cols-2">
          <div>
            <span class="text-text-muted block text-[11px] font-semibold tracking-wider uppercase">
              {{ t('microchip.petName') }}
            </span>
            <span class="text-text mt-1 block text-sm font-medium">
              {{ data.petName || '-' }}
            </span>
          </div>

          <div>
            <span class="text-text-muted block text-[11px] font-semibold tracking-wider uppercase">
              {{ t('microchip.ownerName') }}
            </span>
            <span class="text-text mt-1 block text-sm font-medium">
              {{ data.ownerName || '-' }}
            </span>
          </div>

          <div>
            <span class="text-text-muted block text-[11px] font-semibold tracking-wider uppercase">
              {{ t('microchip.implantDate') }}
            </span>
            <span class="text-text mt-1 block text-sm font-medium">
              {{ data.implantDate ? formatDate(data.implantDate) : '-' }}
            </span>
          </div>

          <div>
            <span class="text-text-muted block text-[11px] font-semibold tracking-wider uppercase">
              {{ t('microchip.implantedBy') }}
            </span>
            <span class="text-text mt-1 block text-sm font-medium">
              {{ data.implantedBy || '-' }}
            </span>
          </div>

          <div class="sm:col-span-2">
            <span class="text-text-muted block text-[11px] font-semibold tracking-wider uppercase">
              {{ t('microchip.implantLocation') }}
            </span>
            <span class="text-text mt-1 block text-sm font-medium">
              {{ data.implantLocation || '-' }}
            </span>
          </div>
        </div>
      </div>

      <div class="bg-divider h-px w-full"></div>

      <!-- Timestamps -->
      <div class="text-text-muted grid grid-cols-1 gap-y-2 text-[11px] sm:grid-cols-2">
        <div>
          <span>{{ t('microchip.createdDate') }}: </span>
          <span class="text-text-subtle font-medium">
            {{ data.createdAt ? formatDate(data.createdAt, 'YYYY-MM-DD HH:mm:ss') : '-' }}
          </span>
        </div>
        <div>
          <span>{{ t('microchip.lastUpdated') }}: </span>
          <span class="text-text-subtle font-medium">
            {{ data.updatedAt ? formatDate(data.updatedAt, 'YYYY-MM-DD HH:mm:ss') : '-' }}
          </span>
        </div>
      </div>
    </div>
  </ModalLayout>
</template>
