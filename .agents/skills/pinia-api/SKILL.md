---
name: pinia-api
description: Use this skill when working with Pinia stores, API modules, Axios calls, pagination, filters, loading state, or server state.
---

# Pinia API Skill

Use this flow:

```txt
Component → Pinia Store → API Service → axiosClient
```

## API Layer

Keep HTTP calls in API files.

```ts
export const userAPI = {
  fetchListUser(params: UserParams) {
    return axiosClient.get<I_PaginatedResponse<User>>(USER_PATH, { params });
  },
};
```

## Store State

Store owns API state.

```ts
interface UserState {
  loading: boolean;
  user: User | null;
  users: {
    items: User[];
    total: number;
    page: number;
    limit: number;
  };
}
```

## Store Actions

Actions should call API services and update state.

```ts
async fetchUserList(params: UserParams) {
  this.loading = true;

  try {
    const response = await userAPI.fetchListUser(params);

    if (response.success) {
      this.users.items = response.data ?? [];
      this.users.total = response.meta?.total ?? 0;
      this.users.page = response.meta?.page ?? 1;
      this.users.limit = response.meta?.limit ?? 10;
    }
  } finally {
    this.loading = false;
  }
}
```

## Component Usage

Use `storeToRefs` for state and getters.

```ts
const userStore = useUserStore();
const { loading, users } = storeToRefs(userStore);
const { fetchUserList } = userStore;
```

Do not destructure state directly from store.

## Filters

Use store filters when filters are part of API query state.

Use component local state only for temporary form draft values.