import { onMounted, ref } from 'vue';
import type { User } from '../user.type';
import { userStore } from '../user.store';
import { useUserFilter } from './useUserFilter';
import { useUserTable } from './useUserTable';
import { useUserActions } from './useUserActions';

export type UserRecord = User;

export function useUserManagement() {
  const store = userStore();
  const loading = ref(false);

  const fetchUsers = async () => {
    loading.value = true;
    try {
      await store.fetchUsers({
        page: store.meta.page,
        limit: store.meta.limit,
        search: searchQuery.value,
        roleCode: roleFilter.value,
        isActive: statusFilter.value === 'ALL' ? undefined : statusFilter.value === 'ACTIVE',
      });
    } finally {
      loading.value = false;
    }
  };

  const { searchQuery, roleFilter, statusFilter, handleSearch } = useUserFilter({
    store,
    fetchUsers,
  });

  const { dataSource, columns, pagination, onTableChange } = useUserTable({
    store,
    fetchUsers,
  });

  const {
    modalLoading,
    isModalOpen,
    editingUser,
    handleAdd,
    handleModalSubmit,
    handleModalCancel,
    handleEdit,
    handleDelete,
  } = useUserActions({ store, fetchUsers });

  onMounted(() => {
    void fetchUsers();
  });

  return {
    loading,
    modalLoading,
    isModalOpen,
    editingUser,
    searchQuery,
    roleFilter,
    statusFilter,
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
