<script setup lang="ts">
import { reactive } from 'vue';
import { message } from 'ant-design-vue';
import { useRouter, useRoute } from 'vue-router';
import { authStore } from '../auth.store';
import { appStore } from '@/store/app.store';
import type { Rule } from 'ant-design-vue/es/form';

const router = useRouter();
const route = useRoute();
const auth = authStore();
const loading = appStore();

const formState = reactive({
  email: '',
  password: '',
  remember: false,
});

const rules: Record<string, Rule[]> = {
  email: [
    { required: true, message: 'Please enter your email', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email address', trigger: 'blur' },
  ],
  password: [{ required: true, message: 'Please enter your password', trigger: 'blur' }],
};

const handleLogin = async () => {
  try {
    await auth.login({
      email: formState.email,
      password: formState.password,
    });
    message.success('Login successful');
    const redirect = (route.query.redirect as string) || '/user-management';
    router.push(redirect);
  } catch (error: any) {
    message.error(error.message);
  }
};
</script>

<template>
  <div class="font-display flex min-h-screen items-center justify-center bg-(--bg-page)">
    <div class="relative flex h-full min-h-screen w-full flex-col items-center justify-center overflow-x-hidden p-4">
      <div class="card w-full max-w-125 rounded-none p-8">
        <!-- Logo & Header -->
        <div class="mb-8 flex flex-col items-center text-center">
          <div class="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-(--color-primary-bg)">
            <span class="material-symbols-outlined text-4xl text-(--color-primary)">P</span>
          </div>
          <h1 class="text-primary mb-1 text-2xl leading-tight font-bold tracking-tight">Pet Clinic</h1>
          <p class="text-secondary text-sm">Pet Vaccination Management System</p>
        </div>

        <h2 class="text-primary mb-6 font-sans text-xl">Sign In</h2>

        <!-- Login Form -->
        <a-form :model="formState" name="login_form" layout="vertical" :rules="rules" @finish="handleLogin">
          <a-form-item label="Email" name="email" class="mb-5">
            <a-input
              v-model:value="formState.email"
              placeholder="Enter your email"
              class="h-10 border-(--border-default)! bg-(--bg-card)! text-sm! hover:border-(--color-primary)! focus:border-(--color-primary)! focus:shadow-none!"
            />
          </a-form-item>

          <a-form-item label="Password" name="password" class="mb-1">
            <a-input-password
              v-model:value="formState.password"
              placeholder="Enter your password"
              class="h-10 border-(--border-default)! bg-(--bg-card)! text-sm! hover:border-(--color-primary)! focus:border-(--color-primary)! focus:shadow-none!"
            />
          </a-form-item>

          <!-- Remember Me -->
          <a-form-item name="remember" no-style>
            <a-checkbox v-model:checked="formState.remember" class="text-secondary text-sm">Remember me</a-checkbox>
          </a-form-item>

          <a-form-item :wrapper-col="{ span: 24 }" class="mt-6! mb-0!">
            <a-button
              type="primary"
              html-type="submit"
              :loading="loading.isLoading"
              class="w-full text-sm font-semibold"
            >
              Login
            </a-button>
          </a-form-item>
        </a-form>

        <!-- Footer Section -->
        <div class="divider mt-8 pt-6 text-center">
          <p class="text-secondary text-xs">©2026 Pet Clinic. All rights reserved.</p>
          <div class="mt-2 flex justify-center gap-4 text-xs">
            <a class="text-label transition-colors hover:text-(--color-primary)" href="#">Privacy Policy</a>
            <a class="text-label transition-colors hover:text-(--color-primary)" href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.ant-form-item-label > label) {
  color: var(--text-label) !important;
  font-size: 13.5px !important;
  font-weight: 500 !important;
  padding-bottom: 2px !important;
}

:deep(.ant-input),
:deep(.ant-input-password) {
  border-radius: 0 !important;
}

:deep(.ant-checkbox-checked .ant-checkbox-inner) {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

:deep(.ant-form-item-explain-error) {
  font-size: 12px;
  margin-top: 4px;
}
</style>
