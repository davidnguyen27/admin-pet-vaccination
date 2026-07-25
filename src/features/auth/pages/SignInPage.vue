<script setup lang="ts">
import AuthLayout from '@/layouts/AuthLayout.vue';
import { useLocale } from '@/shared/composables/useLocale';
import { useAuthStore } from '@/store/authStore';
import { message } from 'ant-design-vue';
import { storeToRefs } from 'pinia';
import { useField, useForm } from 'vee-validate';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import * as yup from 'yup';

const { t } = useLocale();
const router = useRouter();
const authStore = useAuthStore();
const { isLoading } = storeToRefs(authStore);

const schema = yup.object({
  email: yup.string().required(t('auth.emailRequired')).email(t('auth.invalidEmail')),
  password: yup.string().required(t('auth.passwordRequired')),
});

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: schema,
});

const { value: email, errorMessage: emailError } = useField<string>('email');
const { value: password, errorMessage: passwordError } = useField<string>('password');
const remember = ref(false);

const onSubmit = handleSubmit(() => {
  // values contains { email, password }
  // try {
  //   await authStore.login({
  //     email: values.email,
  //     password: values.password,
  //   });
  //   message.success(t('auth.signInSuccess'));
  //   router.push('/statistic');
  // } catch (error) {
  //   message.error(error as any);
  // }
  message.success(t('auth.signInSuccess'));
  router.push('/statistic');
});
</script>

<template>
  <AuthLayout>
    <div class="mb-8 text-center">
      <h2 class="font-ibm text-text mb-2 text-xl font-semibold tracking-tight">
        {{ t('auth.sectionTitleLogin') }}
      </h2>
      <p class="text-text-muted text-sm">{{ t('auth.sectionLabel') }}</p>
    </div>

    <a-form name="login_form" layout="vertical" @submit="onSubmit">
      <a-form-item name="email" class="mb-4" :validate-status="emailError ? 'error' : ''" :help="emailError">
        <template #label>
          <span class="text-text-subtle text-sm font-medium">{{ t('auth.emailLabel') }}</span>
        </template>
        <a-input
          v-model:value="email"
          :placeholder="t('auth.emailPlaceholder')"
          class="border-divider bg-surface-soft hover:border-primary-hover! focus-within:border-primary! placeholder:text-text-disabled text-text h-11 w-full rounded border px-4 text-sm"
        />
      </a-form-item>

      <a-form-item name="password" class="mb-4" :validate-status="passwordError ? 'error' : ''" :help="passwordError">
        <template #label>
          <span class="text-text-subtle text-sm font-medium">{{ t('auth.passwordLabel') }}</span>
        </template>
        <a-input-password
          v-model:value="password"
          :placeholder="t('auth.passwordPlaceholder')"
          class="border-divider bg-surface-soft hover:border-primary-hover! focus-within:border-primary! placeholder:text-text-disabled text-text h-11 w-full rounded border px-4 text-sm"
        />
      </a-form-item>

      <div class="mt-2 mb-6 flex items-center justify-between">
        <a-checkbox v-model:checked="remember" class="text-text-subtle hover:text-text! text-sm">
          {{ t('auth.rememberMe') }}
        </a-checkbox>
        <RouterLink to="/forgot-password" class="text-primary! text-sm transition-all hover:underline!">
          {{ t('auth.forgotPassword') }}?
        </RouterLink>
      </div>

      <a-form-item :wrapper-col="{ span: 24 }" class="mb-0">
        <a-button
          type="primary"
          html-type="submit"
          :loading="isLoading || isSubmitting"
          :disabled="isLoading || isSubmitting"
          class="hover:bg-primary-hover! flex h-11 w-full items-center justify-center rounded border-none text-sm text-white!"
        >
          {{ t('auth.signIn') }}
        </a-button>
      </a-form-item>
    </a-form>
  </AuthLayout>
</template>
