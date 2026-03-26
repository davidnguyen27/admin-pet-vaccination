import { onMounted, ref } from 'vue';
import { vaccineStore } from '../vaccine.store';
import { useVaccineFilter } from './useVaccineFilter';
import { useVaccineTable } from './useVaccineTables';
import { useVaccineActions } from './useVaccineActions';

export function useVaccineManagement() {
  const store = vaccineStore();
  const loading = ref(false);

  const fetchVaccines = async () => {
    loading.value = true;
    try {
      await store.fetchVaccinesList({
        page: store.meta.page,
        limit: store.meta.limit,
        search: searchQuery.value,
      });
    } finally {
      loading.value = false;
    }
  };

  const { searchQuery, speciesFilter, handleSearch } = useVaccineFilter({
    store,
    fetchVaccines,
  });

  const { dataSource, columns, pagination, onTableChange } = useVaccineTable({
    store,
    fetchVaccines,
  });

  const {
    modalLoading,
    isModalOpen,
    editingVaccine,
    handleAdd,
    handleModalSubmit,
    handleModalCancel,
    handleEdit,
    handleDelete,
  } = useVaccineActions({ store, fetchVaccines });

  onMounted(() => {
    void fetchVaccines();
  });

  return {
    loading,
    modalLoading,
    isModalOpen,
    editingVaccine,
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
