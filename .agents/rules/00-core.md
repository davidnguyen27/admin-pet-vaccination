---
trigger: always_on
---

---
trigger: always_on
---

# Core Rules

These rules always apply.

## General

- Prefer simple, readable, maintainable code.
- Do not over-engineer.
- Do not add new libraries unless explicitly approved.
- Do not perform broad refactors unless explicitly requested.
- Do not touch unrelated modules.
- Keep changes small and focused.
- Prefer readable code over clever code.

## TypeScript

- Avoid `any`.
- Use typed props.
- Use typed emits.
- Use typed API params.
- Use typed API responses.
- Use typed store state.
- Use short but meaningful names.

## Naming

Good names:

```ts
user;
users;
filters;
params;
loading;
roleOptions;
statusOptions;
fetchUsers;
resetFilters;
handleSearch;
```

Avoid vague names:

```ts
dataObject;
resultData;
processHandler;
managementState;
```

Boolean variables should start with:

```txt
is
has
can
should
```

Constants should use uppercase snake case:

```ts
const DEFAULT_PAGE_SIZE = 10;
const ACCESS_TOKEN_KEY = 'access_token';
```

## Security

- Never expose secrets.
- Do not commit `.env` files.
- Do not log sensitive user data.
- Do not log access tokens.
- Do not expose refresh tokens.
- Do not bypass authentication checks.