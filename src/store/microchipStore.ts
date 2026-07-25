import { defineStore } from 'pinia';
import type { Microchip } from '@/shared/types/microchip.type';

const MOCK_MICROCHIPS: Microchip[] = [
  {
    id: 'mc-001',
    microchipNo: '900215000123456',
    implantDate: '2026-01-10',
    implantLocation: 'Between shoulder blades',
    status: 'IMPLANTED',
    petId: 'pet-001',
    petName: 'Fluffy',
    ownerName: 'John Doe',
    manufacturer: 'HomeAgain',
    implantedBy: 'Dr. John Smith',
    createdAt: '2026-01-10T08:00:00.000Z',
    updatedAt: '2026-01-10T08:30:00.000Z',
  },
  {
    id: 'mc-002',
    microchipNo: '900215000123457',
    implantDate: '2026-03-15',
    implantLocation: 'Left shoulder',
    status: 'IMPLANTED',
    petId: 'pet-002',
    petName: 'Bella',
    ownerName: 'Jane Watson',
    manufacturer: 'Avid ID',
    implantedBy: 'Dr. Sarah Johnson',
    createdAt: '2026-03-15T09:00:00.000Z',
    updatedAt: '2026-03-15T09:45:00.000Z',
  },
  {
    id: 'mc-003',
    microchipNo: '900215000246810',
    status: 'AVAILABLE',
    manufacturer: 'HomeAgain',
    createdAt: '2026-04-01T10:00:00.000Z',
    updatedAt: '2026-04-01T10:00:00.000Z',
  },
  {
    id: 'mc-004',
    microchipNo: '900215000357911',
    status: 'AVAILABLE',
    manufacturer: 'Avid ID',
    createdAt: '2026-04-01T10:05:00.000Z',
    updatedAt: '2026-04-01T10:05:00.000Z',
  },
  {
    id: 'mc-005',
    microchipNo: '900215000468020',
    status: 'DEFECTIVE',
    manufacturer: 'Datamars',
    createdAt: '2026-05-10T14:00:00.000Z',
    updatedAt: '2026-05-12T16:20:00.000Z',
  },
  {
    id: 'mc-006',
    microchipNo: '900215000579131',
    implantDate: '2026-05-20',
    implantLocation: 'Right shoulder',
    status: 'IMPLANTED',
    petId: 'pet-003',
    petName: 'Rocky',
    ownerName: 'Robert Downey',
    manufacturer: 'HomeAgain',
    implantedBy: 'Dr. John Smith',
    createdAt: '2026-05-20T11:00:00.000Z',
    updatedAt: '2026-05-20T11:20:00.000Z',
  },
];

interface MicrochipState {
  loading: boolean;
  microchip: Microchip | null;
  listMicrochip: {
    data: Microchip[];
    total: number;
    page: number;
    limit: number;
  };
  filters: {
    search?: string;
    status?: string;
  };
  overView: {
    total: number;
    available: number;
    implanted: number;
    defective: number;
  };
}

export const useMicrochipStore = defineStore('microchip', {
  state: (): MicrochipState => ({
    loading: false,
    microchip: null,
    listMicrochip: {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
    },
    filters: {
      search: '',
      status: undefined,
    },
    overView: {
      total: 0,
      available: 0,
      implanted: 0,
      defective: 0,
    },
  }),

  actions: {
    applyMicrochipList(data: Microchip[], page?: number, limit?: number) {
      const normalizedPage = Math.max(1, page ?? this.listMicrochip.page);
      const normalizedLimit = Math.max(1, limit ?? this.listMicrochip.limit);
      const start = (normalizedPage - 1) * normalizedLimit;

      this.listMicrochip.data = data.slice(start, start + normalizedLimit);
      this.listMicrochip.total = data.length;
      this.listMicrochip.page = normalizedPage;
      this.listMicrochip.limit = normalizedLimit;
    },

    getFilteredMockMicrochips() {
      const search = this.filters.search?.trim().toLowerCase();
      const status = this.filters.status;

      return MOCK_MICROCHIPS.filter(chip => {
        const matchesSearch =
          !search ||
          [chip.microchipNo, chip.petName, chip.ownerName, chip.manufacturer, chip.implantedBy].some(
            value => value && value.toLowerCase().includes(search),
          );
        const matchesStatus = !status || chip.status === status;

        return matchesSearch && matchesStatus;
      });
    },

    applyMicrochipOverview() {
      this.overView = {
        total: MOCK_MICROCHIPS.length,
        available: MOCK_MICROCHIPS.filter(chip => chip.status === 'AVAILABLE').length,
        implanted: MOCK_MICROCHIPS.filter(chip => chip.status === 'IMPLANTED').length,
        defective: MOCK_MICROCHIPS.filter(chip => chip.status === 'DEFECTIVE').length,
      };
    },

    setFilters(filters: Partial<MicrochipState['filters']>) {
      this.filters = { ...this.filters, ...filters };
      this.listMicrochip.page = 1;
    },

    setPagination(page: number, limit: number) {
      this.listMicrochip.page = page;
      this.listMicrochip.limit = limit;
    },

    resetFilters() {
      this.filters = {
        search: '',
        status: undefined,
      };
      this.listMicrochip.page = 1;
    },

    async fetchMicrochipList() {
      this.loading = true;
      try {
        this.applyMicrochipList(this.getFilteredMockMicrochips());
      } finally {
        this.loading = false;
      }
    },

    async fetchMicrochipOverView() {
      this.applyMicrochipOverview();
    },

    async createMicrochip(payload: Partial<Microchip>) {
      this.loading = true;
      try {
        const newChip: Microchip = {
          id: `mc-${Date.now()}`,
          microchipNo: payload.microchipNo || '',
          status: payload.status || 'AVAILABLE',
          manufacturer: payload.manufacturer,
          implantDate: payload.implantDate,
          implantLocation: payload.implantLocation,
          petName: payload.petName,
          ownerName: payload.ownerName,
          implantedBy: payload.implantedBy,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        MOCK_MICROCHIPS.unshift(newChip);
        this.applyMicrochipOverview();
        await this.fetchMicrochipList();
        return { success: true };
      } finally {
        this.loading = false;
      }
    },

    async updateMicrochip(id: string, payload: Partial<Microchip>) {
      this.loading = true;
      try {
        const index = MOCK_MICROCHIPS.findIndex(chip => chip.id === id);
        if (index !== -1) {
          const original = MOCK_MICROCHIPS[index];
          MOCK_MICROCHIPS[index] = {
            ...original,
            ...payload,
            updatedAt: new Date().toISOString(),
          } as Microchip;
          this.applyMicrochipOverview();
          await this.fetchMicrochipList();
          return { success: true };
        }
        throw new Error('Microchip not found');
      } finally {
        this.loading = false;
      }
    },

    async deleteMicrochip(id: string) {
      this.loading = true;
      try {
        const index = MOCK_MICROCHIPS.findIndex(chip => chip.id === id);
        if (index !== -1) {
          MOCK_MICROCHIPS.splice(index, 1);
          this.applyMicrochipOverview();
          await this.fetchMicrochipList();
          return { success: true };
        }
        throw new Error('Microchip not found');
      } finally {
        this.loading = false;
      }
    },
  },
});
