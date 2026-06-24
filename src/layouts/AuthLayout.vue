<script setup lang="ts">
import logo from '@/assets/images/logo.png';
import { useLocale } from '@/shared/composables/useLocale';

const { t } = useLocale();
</script>

<template>
  <div class="bg-surface text-text flex min-h-screen flex-col">
    <main class="flex grow flex-col items-center justify-center px-4 py-3">
      <!-- Brand Area -->
      <div class="mb-6 flex flex-col items-center text-center sm:mb-4">
        <img alt="Pet Vaccination MS Logo" class="mb-4 w-auto sm:h-15 lg:h-20" :src="logo" />
        <h1 class="font-ibm text-text mb-1 font-semibold sm:text-lg lg:text-xl">Pet Vaccination Management System</h1>
        <p class="text-text-subtle text-sm">Clinic management portal</p>
      </div>

      <!-- Children component -->
      <div class="bg-bg border-divider shadow-card w-full rounded-lg border p-6 sm:max-w-[480px] lg:max-w-[420px]">
        <slot></slot>
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-divider border-t py-6 text-center">
      <p class="text-text-subtle text-xs">
        {{ t('auth.footerDescription') }}
      </p>
    </footer>
  </div>
</template>
