<script setup lang="ts">
import { useLocale } from '@/shared/composables/useLocale';
import { formatDate } from '@/shared/utils';
import { IconCertificate, IconEye, IconEdit, IconTrash, IconCalendar } from '@tabler/icons-vue';
import type { HealthCertificate } from '@/shared/types/healthCertificate.type';

interface HealthCertificateCardGridProps {
  data: HealthCertificate[];
  loading?: boolean;
}

defineProps<HealthCertificateCardGridProps>();

const emit = defineEmits<{
  (e: 'viewDetail', record: HealthCertificate): void;
  (e: 'edit', record: HealthCertificate): void;
  (e: 'delete', record: HealthCertificate): void;
}>();

const { t } = useLocale();

const getPurposeText = (purposeKey: string) => {
  switch (purposeKey) {
    case 'DOMESTIC_TRAVEL':
      return t('healthCertificate.purposeVal.domesticTravel');
    case 'INTERNATIONAL_EXPORT':
      return t('healthCertificate.purposeVal.internationalExport');
    case 'GENERAL_HEALTH':
      return t('healthCertificate.purposeVal.generalHealth');
    case 'SHOW_COMPETITION':
      return t('healthCertificate.purposeVal.showCompetition');
    default:
      return purposeKey;
  }
};
</script>

<template>
  <a-spin :spinning="loading">
    <div v-if="data.length > 0" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="item in data"
        :key="item.id"
        class="border-divider bg-surface shadow-card hover:border-primary/50 flex flex-col justify-between rounded border p-4 transition-all duration-200"
      >
        <!-- Card Header -->
        <div class="border-divider/60 flex items-start justify-between gap-2 border-b pb-3">
          <div class="flex items-center gap-2.5">
            <div class="bg-primary-soft text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
              <IconCertificate class="size-5" />
            </div>
            <div class="flex flex-col">
              <span
                class="font-ibm text-primary cursor-pointer text-base font-bold tracking-tight hover:underline"
                @click="emit('viewDetail', item)"
              >
                {{ item.certificateNo }}
              </span>
              <span class="text-text-muted text-xs font-medium">
                {{ getPurposeText(item.purpose) }}
              </span>
            </div>
          </div>

          <span
            v-if="item.status === 'VALID'"
            class="bg-success-bg text-success border-success/30 shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold"
          >
            {{ t('healthCertificate.statusVal.valid') }}
          </span>
          <span
            v-else-if="item.status === 'EXPIRED'"
            class="bg-warning-bg text-warning border-warning/30 shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold"
          >
            {{ t('healthCertificate.statusVal.expired') }}
          </span>
          <span
            v-else-if="item.status === 'REVOKED'"
            class="bg-error-bg text-error border-error/30 shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold"
          >
            {{ t('healthCertificate.statusVal.revoked') }}
          </span>
        </div>

        <!-- Card Body -->
        <div class="my-3 flex flex-col gap-2.5 text-xs">
          <div class="bg-surface-soft border-divider/50 flex items-center justify-between rounded border p-2.5">
            <div class="flex flex-col">
              <span class="text-text-muted text-[11px] font-semibold tracking-wider uppercase">{{
                t('healthCertificate.petName')
              }}</span>
              <span class="text-text text-sm font-bold">{{ item.petName }}</span>
              <span class="text-text-muted text-[11px]"
                >{{ item.species }} {{ item.breed ? `• ${item.breed}` : '' }}</span
              >
            </div>
            <div v-if="item.microchipNo" class="text-right">
              <span class="text-text-muted text-[10px] font-medium uppercase">Microchip</span>
              <p class="text-text-subtle font-mono text-[11px] font-medium">{{ item.microchipNo }}</p>
            </div>
          </div>

          <div class="flex items-center justify-between px-1">
            <span class="text-text-muted font-medium">{{ t('healthCertificate.ownerName') }}:</span>
            <span class="text-text font-semibold"
              >{{ item.ownerName }}
              <span v-if="item.ownerPhone" class="text-text-muted text-[11px]">({{ item.ownerPhone }})</span></span
            >
          </div>

          <div class="flex items-center justify-between px-1">
            <span class="text-text-muted font-medium">{{ t('healthCertificate.issuedBy') }}:</span>
            <span class="text-text font-medium">{{ item.issuedBy }}</span>
          </div>

          <div class="border-divider/40 flex items-center justify-between border-t px-1 pt-2">
            <div class="text-text-muted flex items-center gap-1">
              <IconCalendar class="size-3.5" />
              <span>{{ formatDate(item.issueDate) }} → {{ formatDate(item.expiryDate) }}</span>
            </div>
            <span
              :class="[
                'rounded px-2 py-0.5 text-[11px] font-semibold',
                item.rabiesVaccinated ? 'bg-success-bg text-success' : 'bg-error-bg text-error',
              ]"
            >
              Rabies {{ item.rabiesVaccinated ? '✓' : '✗' }}
            </span>
          </div>
        </div>

        <!-- Card Footer -->
        <div class="border-divider/60 flex items-center justify-between border-t pt-2.5">
          <div class="flex items-center gap-1">
            <a-button
              type="text"
              size="small"
              class="hover:bg-primary-soft hover:text-primary flex items-center gap-1 rounded px-2 text-xs"
              @click="emit('viewDetail', item)"
            >
              <IconEye class="size-4" />
              <span>{{ t('view') }}</span>
            </a-button>
            <a-button
              type="text"
              size="small"
              class="hover:bg-primary-soft hover:text-primary flex items-center gap-1 rounded px-2 text-xs"
              @click="emit('edit', item)"
            >
              <IconEdit class="size-4" />
              <span>{{ t('edit') }}</span>
            </a-button>
            <a-button
              type="text"
              size="small"
              danger
              class="flex items-center gap-1 rounded px-2 text-xs"
              @click="emit('delete', item)"
            >
              <IconTrash class="size-4" />
              <span>{{ t('delete') }}</span>
            </a-button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="border-divider bg-surface flex flex-col items-center justify-center rounded border py-12">
      <a-empty description="No health certificates found" />
    </div>
  </a-spin>
</template>
