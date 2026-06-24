---
name: vue-router
description: Use this skill when working with Vue Router, route params, query params, navigation guards, redirects, auth routes, or page navigation.
---

# Vue Router Skill

Use Vue Router 4 patterns.

## Router Files

Keep router configuration in:

```txt
src/core/router/
```

Use route guards in:

```txt
src/core/router/guards/
```

## Navigation

Use named routes when possible.

Good:

```ts
router.push({ name: 'users' });
```

Avoid hardcoding paths repeatedly.

## Route Params

When a route component depends on route params, handle param changes.

Good:

```ts
watch(
  () => route.params.id,
  () => {
    fetchDetail();
  },
);
```

## Query State

Use query params for filter/search/pagination state when the state should survive refresh, sharing, or browser back/forward.

Good:

```ts
router.replace({
  query: {
    page: page.value,
    keyword: keyword.value || undefined,
  },
});
```

## Guards

Use route guards for authentication and role checks.

Do not bypass authentication checks in components.

Keep guard logic small and readable.