<script setup lang="ts">
import type { Rule } from 'ant-design-vue/es/form';
import { ArrowLeftOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { computed, reactive } from 'vue';
import { useLocale } from '@/shared/composables/useLocale';

const { t } = useLocale();

const formState = reactive({
  email: '',
});

const rules = computed<Record<string, Rule[]>>(() => ({
  email: [
    { required: true, message: t('auth.emailRequired'), trigger: 'blur' },
    { type: 'email', message: t('auth.invalidEmail'), trigger: 'blur' },
  ],
}));

async function handleForgotPass() {
  message.success(t('auth.mockResetLinkSent'));
}
</script>

<template>
  <div class="font-ibm mb-4 flex flex-col gap-2">
    <h2 class="text-text font-ibm mb-2 text-2xl font-semibold sm:text-xl">{{ t('auth.passwordReset') }}</h2>
    <p class="text-text-subtle text-sm sm:text-xs">{{ t('auth.subtitleForgotPassword') }}</p>
  </div>

  <a-form :model="formState" name="login_form" layout="vertical" :rules="rules" @finish="handleForgotPass">
    <a-form-item name="email" class="mb-4">
      <template #label>
        <span class="text-text-subtle text-sm font-medium">{{ t('auth.emailLabel') }}</span>
      </template>
      <a-input
        v-model:value="formState.email"
        :placeholder="t('auth.emailPlaceholder')"
        class="border-divider bg-elevated hover:border-primary focus-within:border-primary placeholder:text-text-disabled text-text h-11 w-full rounded border px-4 text-sm focus-within:shadow-none"
      />
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 24 }" class="mb-4!">
      <a-button
        type="primary"
        html-type="submit"
        class="bg-primary flex h-12 w-full items-center justify-center rounded border-none text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.98]"
      >
        {{ t('auth.sendResetLink') }}
      </a-button>
    </a-form-item>
  </a-form>

  <div class="border-divider font-ibm flex justify-center border-t">
    <RouterLink class="text-primary mt-4 flex items-center transition-colors hover:underline" to="/sign-in">
      <ArrowLeftOutlined class="mr-2 text-xs" />
      <span class="text-sm">{{ t('auth.backToSignIn') }}</span>
    </RouterLink>
  </div>
</template>
