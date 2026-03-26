import { onMounted, ref } from 'vue';
import { petStore } from '../pet.store';
import { usePetTable } from './usePetTables';
import { usePetActions } from './usePetActions';
import { usePetFilter } from './usePetFilter';

export function usePetManagement() {
  const store = petStore();
  const loading = ref(false);

  const fetchPets = async () => {
    loading.value = true;
    try {
      await store.fetchPets({
        page: store.meta.page,
        limit: store.meta.limit,
        search: searchQuery.value,
      });
    } finally {
      loading.value = false;
    }
  };

  const { searchQuery, speciesFilter, handleSearch } = usePetFilter({
    store,
    fetchPets,
  });

  const { dataSource, columns, pagination, onTableChange } = usePetTable({
    store,
    fetchPets,
  });

  const {
    modalLoading,
    isModalOpen,
    editingPet,
    handleAdd,
    handleModalSubmit,
    handleModalCancel,
    handleEdit,
    handleDelete,
  } = usePetActions({ store, fetchPets });

  onMounted(() => {
    void fetchPets();
  });

  return {
    loading,
    modalLoading,
    isModalOpen,
    editingPet,
    searchQuery,
    speciesFilter,
    dataSource,
    columns,
    pagination,
    onTableChange,
    handleSearch,
    handleAdd,
    handleModalSubmit,
    handleModalCancel,
    handleEdit,
    handleDelete,
  };
}
