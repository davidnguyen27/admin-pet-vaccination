import { computed } from 'vue';
import type { TablePaginationConfig } from 'ant-design-vue';
import type { vaccineStore } from '../vaccine.store';

interface UseVaccineTableOptions {
  store: ReturnType<typeof vaccineStore>;
  fetchVaccines: () => Promise<void>;
}

export function useVaccineTable({ store, fetchVaccines }: UseVaccineTableOptions) {
  const dataSource = computed(() => store.vaccines);

  const columns = [
    {
      title: 'Code',
      key: 'code',
      dataIndex: 'code',
    },
    {
      title: 'Vaccine Name',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: 'Species',
      dataIndex: 'species',
      key: 'species',
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      key: 'brand',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
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
    showTotal: (total: number, range: [number, number]) => `${range[0]}–${range[1]} of ${total} vaccines`,
  }));

  const onTableChange = (pag: TablePaginationConfig) => {
    store.meta.page = pag.current ?? 1;
    store.meta.limit = pag.pageSize ?? 10;
    void fetchVaccines();
  };

  return {
    dataSource,
    columns,
    pagination,
    onTableChange,
  };
}
