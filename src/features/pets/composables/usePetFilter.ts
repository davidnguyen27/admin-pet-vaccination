import { ref, watch } from 'vue';
import { useSearch } from '@/composables/useSearch';
import type { petStore } from '../pet.store';

interface UsePetFilterOptions {
  store: ReturnType<typeof petStore>;
  fetchPets: () => Promise<void>;
}

const SEARCH_DEBOUNCE_MS = 500;

export function usePetFilter({ store, fetchPets }: UsePetFilterOptions) {
  const speciesFilter = ref<string>('ALL');
  const { keyword: searchQuery } = useSearch(async () => {
    store.meta.page = 1;
    await fetchPets();
    return null;
  }, SEARCH_DEBOUNCE_MS);

  const handleSearch = () => {
    store.meta.page = 1;
    void fetchPets();
  };

  watch(searchQuery, value => {
    if (!value) {
      store.meta.page = 1;
      void fetchPets();
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
