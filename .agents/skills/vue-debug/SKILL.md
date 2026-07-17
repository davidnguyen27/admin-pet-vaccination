---
name: vue-debug
description: Use this skill when diagnosing Vue runtime errors, reactivity bugs, watcher issues, template issues, Pinia update bugs, router bugs, or TypeScript template errors.
---

# Vue Debug Skill

Debug in this order:

1. Read the exact error message.
2. Identify the failing file and line.
3. Classify the issue: Vue, TypeScript, Pinia, Router, Axios, UI, or i18n.
4. Explain why it fails.
5. Provide the smallest safe fix.
6. Mention any manual test needed.

## Debugging Tools

- Use **Vue DevTools** to inspect Component state, track Pinia mutations (Timeline), and debug routing.

## Common Vue Checks

### Memory Leaks & Cleanup

Check if the component or its composables are registering event listeners or intervals without cleaning them up in `onUnmounted`.

### Reactivity Loss

Check if props or reactive objects are destructured without `toRefs`, which destroys reactivity.

Bad:

```ts
const { roleCode } = props; // Reactivity lost!
```

### Race Conditions

Check if API calls are triggering state updates inconsistently, especially when the URL and Pinia are both trying to act as the source of truth for the same filter state.

### Props

If props are used in script, assign `defineProps` to `props`.

Bad:

```ts
defineProps<{
  roleCode?: string;
}>();

console.log(roleCode);
```

Good:

```ts
const props = defineProps<{
  roleCode?: string;
}>();

console.log(props.roleCode);
```

### Pinia

Check whether state was destructured without `storeToRefs`.

Bad:

```ts
const { users } = useUserStore();
```

Good:

```ts
const userStore = useUserStore();
const { users } = storeToRefs(userStore);
```

### Computed

Computed should not mutate state.

### Watch

Watch should be used for side effects only.

### Template

Avoid complex logic in templates.

Guard nullable data before reading nested fields.

Good:

```vue
<div v-if="user">
  {{ user.name }}
</div>
```

## Output

Explain:

- root cause
- fixed code
- why the fix works
- what to manually test
