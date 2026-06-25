<script setup lang="ts">
import PageLayout from '@/layouts/PageLayout.vue';
import { IconChevronLeft, IconPencilMinus } from '@tabler/icons-vue';
</script>

<template>
  <PageLayout>
    <div class="flex items-center justify-between">
      <div class="flex flex-col gap-1">
        <span class="font-ibm text-text text-xl font-bold">Information</span>
        <span class="text-text-subtle text-sm">Edit and review information details</span>
      </div>
      <div class="flex items-center gap-2">
        <button class="border-divider flex items-center gap-1 rounded-sm border bg-white px-3 py-2 hover:opacity-80">
          <IconChevronLeft size="18" />
          Back to Dashboard
        </button>
        <button
          class="border-primary bg-primary flex items-center gap-1 rounded-sm border px-3 py-2 text-white! hover:opacity-80"
        >
          <IconPencilMinus size="16" />
          Edit
        </button>
      </div>
    </div>

    <div class="mt-4 flex flex-col gap-2">
      <div class="border-divider border bg-white p-3">
        <div class="flex justify-center">
          <img src="https://picsum.photos/100" alt="" />
        </div>
        <span>Administrator</span>
        <span>admin@petclinic.vn</span>
        <div class="flex items-center">
          <span class="px-4 py-1 text-white">Admin</span>
          <span class="bg-success text-clinic-500 px-4 py-1">Active</span>
        </div>
      </div>
    </div>
  </PageLayout>
</template>
