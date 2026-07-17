# GEMINI.md

# Project Overview

This project is an Admin system for a Pet Vaccination Management System.

The frontend is built with Vue 3 and TypeScript using a feature-based architecture.

This file contains only project-wide instructions.

Detailed implementation rules are located under `.agents/rules/`.

---

# Tech Stack

- Vue 3
- TypeScript
- Pinia
- Vue Router
- Ant Design Vue
- vee-validate
- Axios
- vue-i18n
- Tabler Icons

---

# Commands

Use the following commands when working in this project.

```bash
pnpm install
pnpm dev
pnpm build
pnpm type-check
pnpm lint
```

Do not introduce new libraries unless explicitly approved.

Before finishing a coding task, run when possible:

```bash
pnpm type-check
pnpm lint
```

---

# Rule Loading

Always read:

```
.agents/rules/00-core.md
```

Load additional rule files only when they are relevant to the current task.

### Vue Components

```
.agents/rules/10-vue-project.md
```

### API, Axios and Pinia

```
.agents/rules/20-api-store.md
```

### UI and i18n

```
.agents/rules/30-ui-i18n.md
```

### Admin Domain

```
.agents/rules/40-domain.md
```

### Form Validation

```
.agents/rules/50-form-validation.md
```

---

# Wireframe

The Admin wireframe documentation is located at:

```
docs/wireframe_guide.md
```

Read only the module related to the current task.

The wireframe describes screen layout, navigation and responsibilities.

It is **not** the backend source of truth.

---

# Source of Truth

When implementing a feature, use the following priority.

1. Backend API contract
2. Existing domain models and shared types
3. Relevant rule files
4. Wireframe guide
5. Existing frontend implementation

Never invent:

- API fields
- response shapes
- enum values
- business state transitions
- permissions
- financial calculations
- inventory mutations

If the backend contract conflicts with the wireframe:

- preserve the backend contract;
- report the mismatch clearly;
- do not implement frontend-only workarounds.

---

# Scope Control

Before implementing a feature:

- inspect the existing project first;
- reuse existing components whenever possible;
- reuse existing stores and API services;
- implement only the requested scope;
- avoid unrelated refactoring;
- report missing backend APIs instead of inventing behavior.

---

# Skills

Use project skills only when the requested task matches the skill purpose.

Do not load unrelated skills.

---

# Final Response

Before finishing a coding task, always include:

1. Summary of changes.
2. Files changed.
3. Important implementation decisions.
4. Anything that should be manually reviewed.

If applicable, also report:

- missing APIs;
- backend/frontend contract mismatches;
- checks that could not be executed.
