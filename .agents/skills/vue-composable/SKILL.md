---
name: vue-composable
description: Use this skill when creating reusable Vue composables or extracting repeated Composition API logic.
---

# Vue Composable Skill

Use this skill only when logic is reused or clearly reusable.

Do not create composables for one-time logic.

## Naming

Composable names must start with `use`.

Good:

```txt
useLocale
usePagination
useUserFilters
useDebounce
```

## Return Pattern

Return refs and functions clearly.

```ts
export function usePagination() {
  const page = ref(1);
  const pageSize = ref(10);

  function resetPage() {
    page.value = 1;
  }

  return {
    page,
    pageSize,
    resetPage,
  };
}
```

## Input Pattern

Use `MaybeRefOrGetter` only when the input should accept:

- plain value
- ref
- computed
- getter function

Good:

```ts
import { toValue, watchEffect, type MaybeRefOrGetter } from 'vue';

export function useDocumentTitle(title: MaybeRefOrGetter<string>) {
  watchEffect(() => {
    document.title = toValue(title);
  });
}
```

Do not use `MaybeRefOrGetter` for callback functions.

## Rules

- Keep composables framework-focused.
- Do not mix API service logic into generic composables.
- Do not hide important store mutations inside unclear composables.
- Return explicit state and methods.
- **Cleanup (Memory Leaks):** Any composable that creates side effects (e.g., `addEventListener`, `setTimeout`, `setInterval`) MUST clean them up using `onUnmounted`. Failing to do so causes memory leaks.
