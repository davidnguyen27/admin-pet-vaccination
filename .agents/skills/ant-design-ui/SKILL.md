---
name: ant-design-ui
description: Use this skill when creating or refactoring UI with Ant Design Vue, admin tables, forms, filters, modals, pagination, tags, or i18n labels.
---

# Ant Design UI Skill

Use Ant Design Vue as the main UI library.

## UI Direction

The UI should look like a traditional admin dashboard.

Use:

- compact spacing
- clear table layout
- simple filters
- readable forms
- consistent buttons
- predictable modals

Avoid:

- glass effects
- heavy shadows
- big rounded cards
- excessive animations
- trendy gradients

## Border Radius

Avoid border radius by default.

If needed, use max `4px`.

Avoid:

```vue
<a-card class="rounded-2xl shadow-xl" />
```

## Forms & Validation

Use Ant Design Vue form components integrated with `vee-validate` (via Composition API: `useForm`, `useField`).

Do not use the default `:rules` prop of Ant Design `a-form` if `vee-validate` is the standard for the project.

```vue
<script setup lang="ts">
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';

const { handleSubmit } = useForm({
  validationSchema: yup.object({
    email: yup.string().required().email(),
  }),
});

const { value: email, errorMessage: emailError } = useField<string>('email');

const onSubmit = handleSubmit((values) => {
  // submit logic
});
</script>

<template>
  <a-form layout="vertical" @finish="onSubmit">
    <a-form-item 
      :validate-status="emailError ? 'error' : ''" 
      :help="emailError"
    >
      <a-input v-model:value="email" />
    </a-form-item>
  </a-form>
</template>
```

## Tables

Use `a-table` for admin list screens.

Keep columns in script.

```ts
const columns = computed(() => [
  {
    title: t('user.name'),
    dataIndex: 'name',
    key: 'name',
  },
]);
```

## Pagination

Use Ant Design Vue pagination or table pagination consistently.

Pagination state should come from the store when data comes from API.

## i18n

All user-facing text should use `t()`.

Good:

```vue
<a-button>{{ t('common.search') }}</a-button>
```

Bad:

```vue
<a-button>Search</a-button>
```

## Reuse

Move repeated UI patterns into `shared/components/ui`.

Do not create reusable UI components for one-time layout.
