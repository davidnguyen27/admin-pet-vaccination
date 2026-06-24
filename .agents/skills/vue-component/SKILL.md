---
name: vue-component
description: Use this skill when creating or refactoring Vue 3 Single File Components with Composition API and TypeScript.
---

# Vue Component Skill

Use Vue 3 `<script setup lang="ts">`.

## Component Structure

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
interface Props {
  roleCode?: string;
}

const props = defineProps<Props>();
```

## Emits

Use typed emits.

```ts
const emit = defineEmits<{
  (e: 'change'): void;
}>();
```

## Function Style

Use function declarations for main handlers.

```ts
function handleSubmit() {}

function handleReset() {}

function fetchUsers() {}
```

Use arrow functions for short callbacks.

```ts
const usersData = computed(() => users.value.items);

const activeUsers = computed(() => users.value.items.filter(user => user.isActive));
```

## Reactivity

Use `ref` for primitive state.

Use `reactive` for grouped form or filter state.

Use `computed` for derived state.

Use `watch` only for side effects.

## Template

Keep templates readable.

Move complex logic to computed values or functions.
