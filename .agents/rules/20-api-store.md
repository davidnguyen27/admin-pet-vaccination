---
trigger: always_on
---

---
trigger: always_on
---

# API and Store Rules

These rules apply to API services, Axios, Pinia stores, pagination, filters, and server state.

## Architecture Flow

Use this flow:

```txt
Component → Pinia Store → API Service → axiosClient
```

Rules:

- Components must call Pinia store actions.
- Stores must call API services.
- API services must call `axiosClient`.
- Components must not call API services directly.
- Components must not call `axiosClient` directly.

## API Layer

All HTTP requests should live in API files.

Good:

```ts
export const userAPI = {
  fetchListUser(params: UserParams) {
    return axiosClient.get<I_PaginatedResponse<User>>(USER_PATH, { params });
  },

  getUser(id: string) {
    return axiosClient.get<I_Response<User>>(`${USER_PATH}/${id}`);
  },
};
```

## Store Owns

Pinia store owns:

- API data
- detail data
- loading state
- pagination state
- filters used for API requests
- shared state between screens

## Component Owns

Component owns:

- modal open or close state
- selected row
- temporary form state
- temporary filter form values before submit
- small UI-only state

Do not duplicate store state into component `reactive()` unless it is temporary UI state.

## Pinia Usage

Use `storeToRefs` when extracting state or getters.

Good:

```ts
const userStore = useUserStore();
const { loading, users, filters } = storeToRefs(userStore);
const { fetchUserList } = userStore;
```

Bad:

```ts
const { loading, users } = useUserStore();
```

Actions can be destructured directly from the store.

## Store Actions

Actions should:

- set loading
- call API layer
- update state
- handle fallback values
- clear loading in `finally`

Good:

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

## Axios

The Axios client should:

- define `baseURL`
- define timeout
- attach access token in request interceptor
- return `response.data` in response interceptor
- handle 401 refresh-token flow centrally
- avoid duplicate refresh-token requests
- avoid infinite retries

## Pagination

Keep API pagination state in the store when table data comes from API.

Component should only trigger changes.

Good:

```ts
function handlePageChange(page: number, pageSize: number) {
  userStore.setPagination(page, pageSize);
  userStore.fetchUserList();
}
```