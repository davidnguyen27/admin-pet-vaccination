<script setup lang="ts">
import { computed } from 'vue';
import { useLocale } from '@/shared/composables/useLocale';
import ModalLayout from '@/layouts/ModalLayout.vue';
import { formatDate } from '@/shared/utils';
import { IconPrinter, IconCheck, IconX, IconAlertTriangle } from '@tabler/icons-vue';
import { message } from 'ant-design-vue';
import type { HealthCertificate } from '@/shared/types/healthCertificate.type';

const props = defineProps<{
  open: boolean;
  data: HealthCertificate | null;
}>();

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
}>();

const { t } = useLocale();

const purposeLabel = computed(() => {
  if (!props.data) return '';
  switch (props.data.purpose) {
    case 'DOMESTIC_TRAVEL':
      return t('healthCertificate.purposeVal.domesticTravel');
    case 'INTERNATIONAL_EXPORT':
      return t('healthCertificate.purposeVal.internationalExport');
    case 'GENERAL_HEALTH':
      return t('healthCertificate.purposeVal.generalHealth');
    case 'SHOW_COMPETITION':
      return t('healthCertificate.purposeVal.showCompetition');
    default:
      return props.data.purpose;
  }
});

const handlePrint = () => {
  message.info(t('healthCertificate.print') + '...');
  setTimeout(() => {
    window.print();
  }, 100);
};
</script>

<template>
  <ModalLayout
    :open="open"
    :title="t('healthCertificate.detailTitle')"
    @update:open="emit('update:open', $event)"
    @cancel="() => emit('update:open', false)"
    :width="900"
  >
    <div v-if="data" class="flex flex-col gap-4 py-2 pr-1">
      <!-- Main Printable Certificate Sheet -->
      <div id="certificate-print-area" class="bg-surface relative overflow-hidden rounded-sm p-4 text-[#154884] sm:p-8">
        <!-- Guilloche / Decorative Double Security Border -->
        <div class="relative rounded-sm border-4 border-double border-[#154884] p-6 sm:p-8">
          <div class="absolute inset-1.5 rounded-xs border border-[#1e5aa8]/40"></div>

          <!-- Background Watermark Emblem -->
          <div
            class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center opacity-[0.06] select-none"
          >
            <svg viewBox="0 0 200 200" class="h-80 w-80 fill-current text-[#154884]">
              <path
                d="M100 15C50 15 10 55 10 105c0 50 40 80 90 80s90-30 90-80c0-50-40-90-90-90zm0 150c-38 0-68-24-68-60 0-36 30-66 68-66s68 30 68 66c0 36-30 60-68 60z"
              />
              <path
                d="M100 45c-20 0-35 15-35 35 0 25 35 55 35 55s35-30 35-55c0-20-15-35-35-35zm0 48c-7 0-13-6-13-13s6-13 13-13 13 6 13 13-6 13-13 13z"
              />
            </svg>
            <span class="font-serif text-lg font-bold tracking-widest uppercase">Pet Health Centre</span>
            <span class="font-serif text-xs italic">"Vì một tình yêu thú cưng"</span>
          </div>

          <!-- Certificate Header -->
          <div class="relative z-10 flex flex-col items-center text-center">
            <!-- Hospital Title -->
            <h1 class="text-lg font-extrabold tracking-wider text-[#154884] uppercase sm:text-xl">
              HỆ THỐNG BỆNH VIỆN THÚ Y PET HEALTH CENTRE
            </h1>
            <h2 class="text-sm font-bold tracking-widest text-[#1e5aa8] uppercase sm:text-base">
              PET HEALTH CENTRE HOSPITALS
            </h2>

            <!-- 5 Gold Stars -->
            <div class="my-2 flex items-center justify-center gap-1.5 text-[#f59e0b]">
              <span v-for="i in 5" :key="i" class="text-lg">★</span>
            </div>

            <!-- Main Certificate Title -->
            <h3 class="mt-1 text-xl font-black tracking-wide text-[#154884] uppercase sm:text-2xl">
              GIẤY CHỨNG NHẬN SỨC KHOẺ THÚ CƯNG
            </h3>
            <h4 class="text-sm font-bold tracking-widest text-[#1e5aa8] uppercase sm:text-base">
              CERTIFICATE OF VETERINARY INSPECTION
            </h4>

            <!-- Certificate No & Purpose Badge -->
            <div class="mt-3 flex flex-wrap items-center justify-center gap-3">
              <span class="rounded-sm bg-[#154884]/10 px-3 py-1 font-mono text-xs font-bold text-[#154884]">
                NO: {{ data.certificateNo }}
              </span>
              <span class="rounded-sm border border-[#1e5aa8]/30 px-3 py-1 text-xs font-bold text-[#1e5aa8]">
                {{ purposeLabel }}
              </span>
              <span
                v-if="data.status === 'VALID'"
                class="bg-success-bg text-success border-success/30 flex items-center gap-1 rounded-sm border px-2.5 py-0.5 text-xs font-bold"
              >
                <IconCheck size="14" /> {{ t('healthCertificate.statusVal.valid') }}
              </span>
              <span
                v-else-if="data.status === 'EXPIRED'"
                class="bg-warning-bg text-warning border-warning/30 flex items-center gap-1 rounded-sm border px-2.5 py-0.5 text-xs font-bold"
              >
                <IconAlertTriangle size="14" /> {{ t('healthCertificate.statusVal.expired') }}
              </span>
              <span
                v-else-if="data.status === 'REVOKED'"
                class="bg-error-bg text-error border-error/30 flex items-center gap-1 rounded-sm border px-2.5 py-0.5 text-xs font-bold"
              >
                <IconX size="14" /> {{ t('healthCertificate.statusVal.revoked') }}
              </span>
            </div>
          </div>

          <!-- Divider -->
          <div class="my-6 border-b border-dashed border-[#154884]/30"></div>

          <!-- 3-Column Info Grid -->
          <div class="relative z-10 grid grid-cols-1 gap-6 text-xs sm:grid-cols-3">
            <!-- Column 1: Owner Info -->
            <div class="flex flex-col gap-2">
              <h5 class="font-bold tracking-wider text-[#154884] uppercase underline underline-offset-4">
                Owner or Guardian of the pet animal
              </h5>
              <div class="flex flex-col gap-1.5 pt-1">
                <div>
                  <span class="font-bold">Name:</span>
                  <span class="ml-1.5 font-semibold text-black">{{ data.ownerName }}</span>
                </div>
                <div>
                  <span class="font-bold">Address:</span>
                  <span class="ml-1.5 text-gray-700">TP. Hồ Chí Minh, Việt Nam</span>
                </div>
                <div>
                  <span class="font-bold">Phone number/ facsimile:</span>
                  <span class="ml-1.5 font-medium text-black">{{ data.ownerPhone || '-' }}</span>
                </div>
              </div>
            </div>

            <!-- Column 2: Pet Info -->
            <div class="flex flex-col gap-2">
              <h5 class="font-bold tracking-wider text-[#154884] uppercase underline underline-offset-4">
                Pet animal information
              </h5>
              <div class="flex flex-col gap-1.5 pt-1">
                <div>
                  <span class="font-bold">Name:</span>
                  <span class="ml-1.5 font-semibold text-black">{{ data.petName }}</span>
                </div>
                <div>
                  <span class="font-bold">Species:</span>
                  <span class="ml-1.5 font-semibold text-black">{{ data.species }}</span>
                </div>
                <div>
                  <span class="font-bold">Sex:</span>
                  <span class="ml-1.5 font-medium text-gray-800">Male / Desexed</span>
                </div>
                <div>
                  <span class="font-bold">Date of birth / Age:</span>
                  <span class="ml-1.5 font-medium text-gray-800">Approx. 2 Years</span>
                </div>
              </div>
            </div>

            <!-- Column 3: Breed & Microchip -->
            <div class="flex flex-col gap-2">
              <h5 class="font-bold tracking-wider text-[#154884] uppercase underline underline-offset-4">
                Pet Specification
              </h5>
              <div class="flex flex-col gap-1.5 pt-1">
                <div>
                  <span class="font-bold">Breed:</span>
                  <span class="ml-1.5 font-semibold text-black">{{ data.breed || '-' }}</span>
                </div>
                <div>
                  <span class="font-bold">Color:</span>
                  <span class="ml-1.5 font-medium text-gray-800">Standard</span>
                </div>
                <div>
                  <span class="font-bold">Microchip ID:</span>
                  <span class="ml-1.5 font-mono font-bold text-[#154884]">{{ data.microchipNo || '-' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Divider -->
          <div class="my-6 border-b border-dashed border-[#154884]/30"></div>

          <!-- Certificate Declarations & Signatures Section -->
          <div class="relative z-10 grid grid-cols-1 gap-6 pt-2 text-xs sm:grid-cols-2">
            <!-- Left Side: Declarations -->
            <div class="flex flex-col gap-2.5">
              <h5 class="font-bold tracking-wide text-[#154884]">By my signature below I certify that:</h5>
              <ul class="flex flex-col gap-1.5 text-gray-800">
                <li class="flex items-start gap-1.5">
                  <span class="font-bold text-[#154884]">•</span>
                  <span>The animal is healthy enough to travel.</span>
                </li>
                <li class="flex items-start gap-1.5">
                  <span class="font-bold text-[#154884]">•</span>
                  <span>The animal is free of Fleas - Ticks - Parasites.</span>
                </li>
                <li class="flex items-start gap-1.5">
                  <span class="font-bold text-[#154884]">•</span>
                  <span>The animal shows no evidence of diseases communicable to humans.</span>
                </li>
                <li class="flex items-start gap-1.5">
                  <span class="font-bold text-[#154884]">•</span>
                  <span>
                    Rabies Vaccination Status:
                    <strong :class="data.rabiesVaccinated ? 'text-green-700' : 'text-red-600'">
                      {{ data.rabiesVaccinated ? 'Vaccinated & Verified' : 'Not Record' }}
                    </strong>
                  </span>
                </li>
              </ul>

              <!-- Clinical Notes -->
              <div v-if="data.clinicalNotes" class="mt-2 rounded border border-[#154884]/20 bg-[#154884]/5 p-2.5">
                <span class="font-bold text-[#154884]">Clinical Observations:</span>
                <p class="mt-0.5 leading-relaxed text-gray-700">{{ data.clinicalNotes }}</p>
              </div>
            </div>

            <!-- Right Side: Veterinarian Signature & Stamp -->
            <div class="flex flex-col items-end justify-between gap-4 text-right">
              <div class="flex flex-col gap-1">
                <h5 class="font-bold tracking-wider text-[#154884] uppercase">Licensed Veterinarian Signature</h5>
                <div class="text-gray-700"><span class="font-bold">Date:</span> {{ formatDate(data.issueDate) }}</div>
                <div class="text-gray-700">
                  <span class="font-bold">Valid Until:</span> {{ formatDate(data.expiryDate) }}
                </div>
                <div class="text-gray-700"><span class="font-bold">Place:</span> PET HEALTH CENTRE Hospital</div>
              </div>

              <!-- Official Stamp & Doctor Signature Space -->
              <div class="flex flex-col items-center justify-center pt-4">
                <div
                  class="relative flex h-24 w-44 items-center justify-center rounded border border-dashed border-[#154884]/40 bg-white/50"
                >
                  <!-- Stamp Emblem Simulation -->
                  <div
                    class="border-error/60 text-error flex size-20 -rotate-12 flex-col items-center justify-center rounded-full border-2 border-dashed p-1 opacity-85"
                  >
                    <span class="text-[9px] font-black uppercase">PET HEALTH</span>
                    <span class="text-[8px] font-bold">★ VERIFIED ★</span>
                    <span class="text-[8px] font-semibold">VETERINARY</span>
                  </div>
                </div>
                <span class="mt-2 font-bold text-[#154884]">{{ data.issuedBy }}</span>
                <span class="text-[10px] text-gray-500">Chief Veterinary Officer</span>
              </div>
            </div>
          </div>

          <!-- Bottom Footer Banner -->
          <div class="mt-8 border-t border-[#154884]/20 pt-4 text-center">
            <p class="font-serif text-sm font-bold tracking-widest text-[#154884]">PET HEALTH CENTRE</p>
            <p class="font-serif text-xs text-[#1e5aa8] italic">"Vì một tình yêu thú cưng"</p>
          </div>
        </div>
      </div>

      <!-- Modal Actions (Hidden in Print) -->
      <div class="flex items-center justify-end gap-3 pt-2 print:hidden">
        <a-button size="large" class="rounded" @click="emit('update:open', false)">
          {{ t('close') }}
        </a-button>
        <a-button type="primary" size="large" class="flex items-center gap-2 rounded" @click="handlePrint">
          <template #icon><IconPrinter class="size-4.5" /></template>
          <span>{{ t('healthCertificate.print') }}</span>
        </a-button>
      </div>
    </div>
  </ModalLayout>
</template>

<style scoped>
@page {
  size: A4 landscape;
  margin: 6mm;
}

@media print {
  body * {
    visibility: hidden !important;
  }

  #certificate-print-area,
  #certificate-print-area * {
    visibility: visible !important;
  }

  #certificate-print-area {
    position: fixed !important;
    left: 0 !important;
    top: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    margin: 0 !important;
    padding: 12px !important;
    background: #ffffff !important;
    box-shadow: none !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* Force print background colors and borders */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
</style>
