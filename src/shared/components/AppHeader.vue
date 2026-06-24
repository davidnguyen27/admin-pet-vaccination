<script setup lang="ts">
import { IconSearch, IconBell, IconHistory, IconMenu2 } from '@tabler/icons-vue';
import { useRouter } from 'vue-router';

defineEmits(['toggle-sidebar']);

const router = useRouter();
</script>

<template>
  <header
    class="border-divider bg-primary sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b px-4"
  >
    <div class="">
      <IconMenu2 @click="$emit('toggle-sidebar')" class="cursor-pointer text-white hover:text-white/80" />
    </div>

    <div class="relative hidden lg:block">
      <IconSearch class="text-text-subtle absolute top-1/2 left-3 size-4 -translate-y-1/2" />
      <input
        class="focus-visible:outline-border border-border w-64 rounded-sm border bg-white py-1.5 pr-3 pl-9 text-xs"
        type="text"
        name="search"
        placeholder="Search"
      />
    </div>

    <div class="flex items-center gap-3">
      <span class="cursor-pointer p-1.5 text-white hover:text-white/80">
        <IconBell class="h-5 w-5" />
      </span>
      <span class="cursor-pointer p-1.5 text-white hover:text-white/80">
        <IconHistory class="h-5 w-5" />
      </span>
      <div class="border-divider border-l-2 pl-3">
        <span
          class="text-primary flex size-7 cursor-pointer items-center justify-center rounded-full bg-white text-xs font-bold"
          @click="() => router.push('/profile')"
        >
          A
        </span>
      </div>
    </div>
  </header>
</template>
