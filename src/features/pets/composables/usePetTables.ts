import { computed } from 'vue';
import type { TablePaginationConfig } from 'ant-design-vue';
import type { petStore } from '../pet.store';

interface UsePetTableOptions {
  store: ReturnType<typeof petStore>;
  fetchPets: () => Promise<void>;
}

export function usePetTable({ store, fetchPets }: UsePetTableOptions) {
  const dataSource = computed(() => store.pets);

  const columns = [
    {
      title: 'Pet Name',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: 'Owner Name',
      key: 'fullName',
      dataIndex: 'fullName',
    },
    {
      title: 'Species',
      dataIndex: 'species',
      key: 'species',
    },
    {
      title: 'Sex',
      dataIndex: 'sex',
      key: 'sex',
    },
    {
      title: 'Date of Birth',
      dataIndex: 'dob',
      key: 'dob',
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
    showTotal: (total: number, range: [number, number]) => `${range[0]}–${range[1]} of ${total} pets`,
  }));

  const onTableChange = (pag: TablePaginationConfig) => {
    store.meta.page = pag.current ?? 1;
    store.meta.limit = pag.pageSize ?? 10;
    void fetchPets();
  };

  return {
    dataSource,
    columns,
    pagination,
    onTableChange,
  };
}
