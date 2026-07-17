# Form Validation Rules

These rules apply when building forms and validating user input.

## Core Library
This project uses `vee-validate` (Composition API) and `yup` for schema validation.
Do **not** use the default built-in validation of Ant Design Vue (i.e. do not use the `:rules` prop).

## Integration with Ant Design Vue

Wrap your forms with `useForm` and use `useField` to manage individual fields.
Pass the error messages directly to the `a-form-item` using `:validate-status` and `:help`.

### Pattern Example:

```vue
<script setup lang="ts">
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// 1. Define schema
const schema = yup.object({
  email: yup.string().required(t('validation.required')).email(t('validation.email')),
});

// 2. Initialize form
const { handleSubmit, isSubmitting } = useForm({
  validationSchema: schema,
});

// 3. Define fields
const { value: email, errorMessage: emailError } = useField<string>('email');

// 4. Handle Submit
const onSubmit = handleSubmit(async (values) => {
  // values are fully typed and validated here
  await apiCall(values);
});
</script>

<template>
  <a-form layout="vertical" @finish="onSubmit">
    <a-form-item 
      :label="t('auth.email')"
      :validate-status="emailError ? 'error' : ''"
      :help="emailError"
    >
      <a-input v-model:value="email" />
    </a-form-item>

    <a-button type="primary" html-type="submit" :loading="isSubmitting">
      {{ t('common.submit') }}
    </a-button>
  </a-form>
</template>
```

## Translation
Always use `t()` inside `yup` schemas or form logic to ensure error messages are properly translated.

## Complex Forms
For deeply nested objects or dynamic arrays, use `useFieldArray`. Keep validation schemas co-located with the component or in a shared `schemas/` folder if used across multiple features.
