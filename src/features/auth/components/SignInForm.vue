<script setup lang="ts">
import { computed, reactive } from 'vue';
import { useLocale } from '@/shared/composables/useLocale';
import { useRouter } from 'vue-router';
import type { Rule } from 'ant-design-vue/es/form';
import { useAuthStore } from '@/store/authStore';
import { message } from 'ant-design-vue';
import { storeToRefs } from 'pinia';

const { t } = useLocale();
const router = useRouter();
const authStore = useAuthStore();
const { isLoading } = storeToRefs(authStore);

const formState = reactive({
  email: '',
  password: '',
  remember: false,
});

const rules = computed<Record<string, Rule[]>>(() => ({
  email: [
    { required: true, message: t('auth.emailRequired'), trigger: 'blur' },
    { type: 'email', message: t('auth.invalidEmail'), trigger: 'blur' },
  ],
  password: [{ required: true, message: t('auth.passwordRequired'), trigger: 'blur' }],
}));

async function handleLogin() {
  try {
    await authStore.login({
      email: formState.email,
      password: formState.password,
    });
    message.success(t('auth.signInSuccess'));
    router.push('/dashboard');
  } catch (error) {
    message.error(error as any);
  }
}
</script>

<template>
  <div class="mb-6">
    <h2 class="text-text font-ibm mb-2 text-2xl font-semibold sm:text-xl">
      {{ t('auth.sectionTitleLogin') }}
    </h2>
    <p class="text-text-muted text-sm sm:text-xs">{{ t('auth.sectionLabel') }}</p>
  </div>

  <a-form :model="formState" name="login_form" layout="vertical" :rules="rules" @finish="handleLogin">
    <a-form-item name="email" class="mb-4">
      <template #label>
        <span class="text-text-subtle text-sm font-medium">{{ t('auth.emailLabel') }}</span>
      </template>
      <a-input
        v-model:value="formState.email"
        :placeholder="t('auth.emailPlaceholder')"
        class="border-divider bg-surface-soft hover:border-primary-hover! focus-within:border-primary! placeholder:text-text-disabled text-text h-11 w-full rounded border px-4 text-sm"
      />
    </a-form-item>

    <a-form-item name="password" class="mb-4">
      <template #label>
        <span class="text-text-subtle text-sm font-medium">{{ t('auth.passwordLabel') }}</span>
      </template>
      <a-input-password
        v-model:value="formState.password"
        :placeholder="t('auth.passwordPlaceholder')"
        class="border-divider bg-surface-soft hover:border-primary-hover! focus-within:border-primary! placeholder:text-text-disabled text-text h-11 w-full rounded border px-4 text-sm"
      />
    </a-form-item>

    <div class="mt-2 mb-6 flex items-center justify-between">
      <a-checkbox v-model:checked="formState.remember" class="text-text-subtle hover:text-text! text-[13px]">
        {{ t('auth.rememberMe') }}
      </a-checkbox>
      <RouterLink to="/forgot-password" class="text-primary! text-[13px] transition-all hover:underline!">
        {{ t('auth.forgotPassword') }}?
      </RouterLink>
    </div>

    <a-form-item :wrapper-col="{ span: 24 }" class="mb-0">
      <a-button
        type="primary"
        html-type="submit"
        :loading="isLoading"
        :disabled="isLoading"
        class="hover:bg-primary-hover! flex h-11 w-full items-center justify-center rounded border-none text-sm text-white!"
      >
        {{ t('auth.signIn') }}
      </a-button>
    </a-form-item>
  </a-form>
</template>
