<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="border border-(--divider) bg-(--bg-card) px-4 py-3 shadow-sm">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div>
        <p class="m-0 text-[12px] font-semibold tracking-[0.08em] text-(--text-label) uppercase">PetClinic PMS</p>
        <p class="m-0 mt-1 text-[13px] text-(--text-secondary)">
          Keep records clean, secure, and consistent across modules.
        </p>
      </div>

      <div class="text-right">
        <p class="m-0 text-[12px] text-(--text-label)">Version 1.0.0</p>
        <p class="m-0 mt-1 text-[12px] text-(--text-label)">© {{ currentYear }} PetClinic. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>
