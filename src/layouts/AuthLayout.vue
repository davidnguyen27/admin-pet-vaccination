<script setup lang="ts">
import logo from '@/assets/images/logo.png';
</script>

<template>
  <div class="bg-bg text-text flex min-h-screen flex-col">
    <main class="flex grow flex-col items-center justify-center px-4 py-5">
      <div class="mb-4 flex flex-col items-center text-center">
        <img alt="Pet Vaccination" class="mb-4 h-14 w-auto" :src="logo" />
        <span class="font-ibm text-text text-xl font-bold tracking-tight">PetVax System</span>
      </div>

      <div class="bg-surface shadow-card w-full max-w-[400px] rounded p-6 sm:p-10">
        <slot />
      </div>
    </main>
  </div>
</template>
