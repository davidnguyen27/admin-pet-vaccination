# GEMINI.md

## Project Overview

This is a Vue 3 + TypeScript admin dashboard for a pet vaccination management system.

The project is for admin users only.

Tech stack:

- Vue 3
- TypeScript
- Pinia
- Vue Router
- Ant Design Vue
- Tabler Icons
- Axios
- vue-i18n

The goal is to build a clean, maintainable, and scalable admin management system.

## Commands

Use these commands when working in this project:

```bash
pnpm install
pnpm dev
pnpm build
pnpm type-check
pnpm lint
```

Do not add a testing step unless the user explicitly asks for it.

Before finishing a coding task, run the relevant checks when possible:

```bash
pnpm type-check
pnpm lint
```

## Architecture Flow

Use this flow for API-related data:

```txt
Component → Pinia Store → API Service → axiosClient
```

Rules:

- Components must call Pinia store actions.
- Stores must call API services.
- API services must call `axiosClient`.
- Components must not call API services or `axiosClient` directly.
- Keep API data, loading state, pagination, and API filters inside the store.
- Component may keep temporary UI state such as modal state, selected row, and form draft values.

## Main Rules

- Use Vue 3 Composition API only.
- Always use `<script setup lang="ts">`.
- Do not use Options API.
- Use typed props, emits, API params, API responses, and store state.
- Avoid `any`.
- Use `computed` for derived state.
- Use `watch` only for side effects.
- Keep template logic simple.
- Keep business logic out of templates.
- Use PascalCase for Vue component files.
- Use `storeToRefs` when extracting Pinia state or getters.
- Do not add new libraries unless explicitly approved.
- Do not perform broad refactors unless explicitly requested.

## UI Direction

- Use Ant Design Vue consistently.
- Keep UI clean, flat, and readable.
- Prefer a traditional admin UI style.
- Avoid trendy visual effects.
- Avoid large border radius.
- If border radius is necessary, use max `4px`.
- Avoid shadows unless needed for hierarchy such as dropdowns, modals, or popovers.
- Do not use inline `style` attributes in templates.

## Agent Rules

Follow these rules:

- Read `.agents/rules/00-core.md` first.
- For Vue component work, follow `.agents/rules/10-vue-project.md`.
- For API, Axios, Pinia, and server state, follow `.agents/rules/20-api-store.md`.
- For UI, Ant Design Vue, and i18n, follow `.agents/rules/30-ui-i18n.md`.
- Use skills only when the task matches the skill scope.

## Final Response Format

Before finishing a coding task, always include:

1. Summary of what was changed.
2. List of changed files.
3. Important decisions.
4. Anything the user should manually review or test.