import { ref, watch } from 'vue';
import { useSearch } from '@/composables/useSearch';
import type { vaccineStore } from '../vaccine.store';

interface UseVaccineFilterOptions {
  store: ReturnType<typeof vaccineStore>;
  fetchVaccines: () => Promise<void>;
}

const SEARCH_DEBOUNCE_MS = 500;

export function useVaccineFilter({ store, fetchVaccines }: UseVaccineFilterOptions) {
  const speciesFilter = ref<string>('ALL');
  const { keyword: searchQuery } = useSearch(async () => {
    store.meta.page = 1;
    await fetchVaccines();
    return null;
  }, SEARCH_DEBOUNCE_MS);

  const handleSearch = () => {
    store.meta.page = 1;
    void fetchVaccines();
  };

  watch(searchQuery, value => {
    if (!value) {
      store.meta.page = 1;
      void fetchVaccines();
    }
  });

  watch([speciesFilter], () => {
    handleSearch();
  });

  return {
    searchQuery,
    speciesFilter,
    handleSearch,
  };
}
