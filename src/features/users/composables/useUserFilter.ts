import { ref, watch } from 'vue';
import { useSearch } from '@/composables/useSearch';
import { userStore } from '../user.store';

interface UseUserFilterOptions {
  store: ReturnType<typeof userStore>;
  fetchUsers: () => Promise<void>;
}

const SEARCH_DEBOUNCE_MS = 500;

export function useUserFilter({ store, fetchUsers }: UseUserFilterOptions) {
  const roleFilter = ref<string>('ALL');
  const statusFilter = ref<string>('ALL');
  const { keyword: searchQuery } = useSearch(async () => {
    store.meta.page = 1;
    await fetchUsers();
    return null;
  }, SEARCH_DEBOUNCE_MS);

  const handleSearch = () => {
    store.meta.page = 1;
    void fetchUsers();
  };

  watch(searchQuery, value => {
    if (!value) {
      store.meta.page = 1;
      void fetchUsers();
    }
  });

  watch([roleFilter, statusFilter], () => {
    handleSearch();
  });

  return {
    searchQuery,
    roleFilter,
    statusFilter,
    handleSearch,
  };
}
