---
trigger: always_on
---

---
trigger: always_on
---

# Vue Project Rules

These rules apply to Vue components and composables.

## Vue Style

- Use Vue 3 Composition API only.
- Always use `<script setup lang="ts">`.
- Do not use Options API.
- Use PascalCase for Vue component files.

Good:

```txt
AuthLayout.vue
UserTable.vue
AppointmentForm.vue
```

## SFC Order

Use this order:

```vue
<script setup lang="ts">
// imports
// types / interfaces
// props / emits
// composables
// stores
// refs / reactive / computed
// lifecycle
// functions
</script>

<template>...</template>
```

## Props

Use typed props.

```ts
interface UserListProps {
  roleCode?: string;
}

const props = defineProps<UserListProps>();
```

If props are used in script, assign `defineProps` to `props`.

## Emits

Always declare emits.

```ts
const emit = defineEmits<{
  (e: 'change'): void;
  (e: 'update:current', value: number): void;
}>();
```

## Reactivity

Use `ref` for primitive local state.

```ts
const keyword = ref('');
const page = ref(1);
const loading = ref(false);
```

Use `reactive` for grouped form or filter state.

```ts
const formState = reactive({
  email: '',
  password: '',
});
```

Do not use `shallowRef` for primitives by default.

Use `shallowRef` only for:

- component refs
- chart/editor instances
- third-party class instances
- large objects that should not be deeply reactive

## Computed

Use `computed` for derived state.

```ts
const usersData = computed(() => users.value.items);
const totalUsers = computed(() => users.value.total);
```

Do not mutate state inside computed.

## Watch

Use `watch` only for side effects.

Good:

```ts
watch(
  () => props.roleCode,
  () => {
    fetchUsers();
  },
);
```

Do not use `watch` when `computed` is enough.

## Function Convention

In `<script setup>`, prefer function declarations for main handlers and helper functions.

Good:

```ts
function handleSearch() {
  fetchUsers();
}

function resetFilters() {
  userStore.resetFilters();
}
```

Use arrow functions for short callbacks.

Good:

```ts
const usersData = computed(() => users.value.items);

const activeUsers = computed(() => users.value.items.filter(user => user.isActive));
```

## Template

Keep template logic simple.

Good:

```vue
<a-table :columns="columns" :data-source="usersData" />
```

Avoid complex expressions inside templates.