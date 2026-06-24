---
name: vue-feature
description: Use this skill when creating or updating a Vue feature, page, component, route, or feature folder.
---

---

# Vue Feature Skill

Use this skill when implementing or updating a Vue feature in this repository.

## 1. Inspect First

Before editing, check:

- Existing feature folder
- Existing page and component style
- Existing route convention in `src/core/router`
- Existing Pinia store convention in `src/store`
- Existing API convention in `features/*/api`
- Existing shared types in `src/shared/types`
- Existing i18n keys in `src/core/locales`

## 2. Feature Structure

Use this structure for feature code:

```txt
src/features/<feature>/
  api/
  components/
  pages/
```

Use shared folders only when code is reused by multiple features:

```txt
src/shared/components/
src/shared/composables/
src/shared/types/
src/shared/utils/
```

Use root store folder for Pinia stores:

```txt
src/store/
```

## 3. Implementation Rules

- Keep pages in `features/*/pages`.
- Keep feature components in `features/*/components`.
- Keep feature API services in `features/*/api`.
- Keep Pinia stores in `src/store`.
- Keep shared TypeScript types in `src/shared/types`.
- Update routes in `src/core/router` when needed.
- Use Pinia for API data, loading state, pagination, filters, and shared state.
- Use component state only for temporary UI state.
- Use `<script setup lang="ts">`.
- Use `computed` for derived state.
- Use `watch` only for side effects.
- Keep template logic simple.
- Keep business logic out of templates.
- Use vue-i18n for user-facing text.
- Do not add new libraries unless explicitly approved.

## 4. API Flow

Always follow this flow for API data:

```txt
Component → Pinia Store → API Service → axiosClient
```

Rules:

- Components call store actions.
- Stores call API services.
- Components must not call API services directly.
- Components must not call `axiosClient` directly.

## 5. Reuse Rule

Create reusable code only when the same UI or logic appears in more than one place.

Use:

- `shared/components/ui` for reusable UI components.
- `shared/composables` for reusable Vue logic.
- `shared/utils` for pure helper functions.
- `shared/types` for shared TypeScript types.

Do not create abstractions for one-time logic.

## 6. Finish Checklist

Before finishing, explain:

1. What changed
2. Changed files
3. Important decisions
4. Manual review or testing needed
