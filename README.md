# Admin Pet Vaccination Management System

This is an admin dashboard project for a Pet Vaccination Management System, built with **Vue 3**, **TypeScript**, and **Vite**.

## Tech Stack

- **Framework:** [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **State Management:** [Pinia](https://pinia.vuejs.org/)
- **Routing:** [Vue Router 4](https://router.vuejs.org/)
- **UI Library:** [Ant Design Vue](https://antdv.com/)
- **Styling:** Tailwind CSS
- **Icons:** [Tabler Icons](https://tabler.io/icons)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Internationalization:** [vue-i18n](https://vue-i18n.intlify.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)

## Project Setup

### Prerequisites

- Node.js
- [pnpm](https://pnpm.io/) (Package manager)

### Installation

Install all project dependencies:

```bash
pnpm install
```

### Development

Run the local development server:

```bash
pnpm dev
```

### Build and Checks

Type-check and build the application for production:

```bash
pnpm build
```

Run TypeScript validation:

```bash
pnpm type-check
```

Run linter:

```bash
pnpm lint
```

## Architecture Flow

The project follows a strict data flow architecture for API-related data:

```
Component → Pinia Store → API Service → axiosClient
```

**Key Rules:**

1.  Components must call Pinia store actions.
2.  Stores must call API services.
3.  API services must call `axiosClient`.
4.  Components must **not** call API services or `axiosClient` directly.
5.  Keep API data, loading state, pagination, and API filters inside the store.
6.  Components may keep temporary UI state such as modal state, selected row, and form draft values.

## Core Guidelines

- **Composition API:** Use Vue 3 Composition API exclusively. Always use `<script setup lang="ts">`. Do not use Options API.
- **TypeScript:** Use typed props, emits, API params, API responses, and store state. Avoid `any`.
- **Reactivity:** Use `computed` for derived state. Use `watch` only for side effects. Keep template logic simple.
- **Naming Conventions:** Use PascalCase for Vue component files.
- **Stores:** Use `storeToRefs` when extracting Pinia state or getters.

## UI Direction

- **Library:** Use Ant Design Vue consistently.
- **Style:** Keep UI clean, flat, and readable. Prefer a traditional admin UI style. Avoid trendy visual effects.
- **Border Radius:** Avoid large border radiuses. If border radius is necessary, use max `4px`.
- **Shadows:** Avoid shadows unless needed for hierarchy such as dropdowns, modals, or popovers.
- **Inline Styles:** Do not use inline `style` attributes in templates.