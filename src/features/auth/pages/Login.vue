<script setup lang="ts">
import { ref } from 'vue';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons-vue';

const showPassword = ref(false);
</script>

<template>
  <div class="bg-(--bg-page) min-h-screen flex items-center justify-center font-display">
    <div class="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden items-center justify-center p-4">
      <div class="w-full max-w-[500px] card p-8 rounded-none">
        <div class="flex flex-col items-center mb-8">
          <div class="mb-6 flex items-center justify-center bg-(--color-primary-bg) w-16 h-16 rounded-full">
            <span class="material-symbols-outlined text-(--color-primary) text-4xl">P</span>
          </div>
          <h1 class="text-primary text-2xl font-bold leading-tight tracking-tight mb-1">Pet Clinic</h1>
          <p class="text-secondary text-sm">Pet Vaccination Management System</p>
        </div>
        <h2 class="text-primary text-xl font-sans mb-6">Sign In</h2>

        <!-- Login Form -->
        <form class="space-y-5" @submit.prevent>
          <div class="flex flex-col gap-2">
            <label class="text-label text-sm font-medium">Email</label>
            <div class="relative">
              <input
                class="form-input flex w-full border bg-(--bg-card) h-10 text-primary px-3 text-sm font-normal placeholder:text-(--text-disabled) outline-none focus:border-(--color-primary) transition-colors"
                placeholder="Enter your email"
                type="email"
              />
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <div class="flex justify-between items-center">
              <label class="text-label text-sm font-medium">Password</label>
              <a class="text-(--color-primary) text-sm hover:text-(--color-primary-hover) transition-colors" href="#"
                >Forgot Password?</a
              >
            </div>
            <div class="relative flex w-full items-center">
              <input
                class="form-input flex w-full border bg-(--bg-card) h-10 text-primary px-3 pr-10 text-sm font-normal placeholder:text-(--text-disabled) outline-none focus:border-(--color-primary) transition-colors"
                placeholder="Enter your password"
                :type="showPassword ? 'text' : 'password'"
              />
              <div
                class="absolute right-3 flex items-center justify-center cursor-pointer text-secondary hover:text-(--color-primary-hover) transition-colors"
                @click="showPassword = !showPassword"
              >
                <eye-outlined v-if="showPassword" />
                <eye-invisible-outlined v-else />
              </div>
            </div>
          </div>

          <!-- Remember Me -->
          <div class="flex items-center gap-2 py-1">
            <input class="w-4 h-4" style="accent-color: var(--color-primary)" id="remember" type="checkbox" />
            <label class="text-secondary text-sm cursor-pointer" for="remember">Remember me</label>
          </div>

          <button class="w-full btn-primary font-medium h-10 flex items-center justify-center gap-2 mt-2">Login</button>
        </form>

        <!-- Footer Section -->
        <div class="mt-8 pt-6 divider text-center">
          <p class="text-secondary text-xs">©2026 Pet Clinic. All rights reserved.</p>
          <div class="flex justify-center gap-4 mt-2">
            <a class="text-label text-xs hover:text-(--color-primary) transition-colors" href="#">Privacy Policy</a>
            <a class="text-label text-xs hover:text-(--color-primary) transition-colors" href="#">Terms of Service</a>
          </div>
        </div>
      </div>

      <!-- Decorative Illustration Element (Subtle) -->
      <div
        class="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-(--color-primary-bg) via-(--color-primary) to-(--color-primary-bg)"
      ></div>
    </div>
  </div>
</template>
