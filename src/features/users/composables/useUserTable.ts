import { computed } from 'vue';
import type { TablePaginationConfig } from 'ant-design-vue';
import { userStore } from '../user.store';

interface UseUserTableOptions {
  store: ReturnType<typeof userStore>;
  fetchUsers: () => Promise<void>;
}

export function useUserTable({ store, fetchUsers }: UseUserTableOptions) {
  const dataSource = computed(() => store.users);

  const columns = [
    {
      title: 'User',
      key: 'user',
      dataIndex: 'fullName',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Role',
      dataIndex: 'roleCode',
      key: 'roleCode',
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
    },
    {
      title: 'Actions',
      key: 'action',
      align: 'center' as const,
    },
  ];

  const pagination = computed<TablePaginationConfig>(() => ({
    current: store.meta.page,
    pageSize: store.meta.limit,
    total: store.meta.total,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50'],
    showTotal: (total: number, range: [number, number]) => `${range[0]}–${range[1]} of ${total} users`,
  }));

  const onTableChange = (pag: TablePaginationConfig) => {
    store.meta.page = pag.current ?? 1;
    store.meta.limit = pag.pageSize ?? 10;
    void fetchUsers();
  };

  return {
    dataSource,
    columns,
    pagination,
    onTableChange,
  };
}
