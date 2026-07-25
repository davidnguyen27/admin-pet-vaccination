import { defineStore } from 'pinia';
import type { Vaccine, VaccineLot, VaccineProtocol } from '@/shared/types/vaccine.type';

const MOCK_VACCINES: Vaccine[] = [
  {
    id: 'vac-001',
    code: 'RAB-1Y',
    name: 'Rabies Vaccine 1Y',
    disease: 'Rabies',
    manufacturer: 'Zoetis',
    type: 'Core vaccine',
    species: 'dog',
    dose: '1 ml',
    intervalDays: 365,
    boosterRequired: true,
    status: 'ACTIVE',
    lotCount: 3,
    totalStock: 84,
    lowStockLots: 1,
    expiringLots: 1,
    description: 'Annual rabies immunization for dogs.',
    createdAt: '2025-01-12T08:00:00.000Z',
    updatedAt: '2026-06-10T08:00:00.000Z',
  },
  {
    id: 'vac-002',
    code: 'FVRCP',
    name: 'FVRCP Combination',
    disease: 'FVRCP Combo',
    manufacturer: 'Merck Animal Health',
    type: 'Core vaccine',
    species: 'cat',
    dose: '1 ml',
    intervalDays: 365,
    boosterRequired: true,
    status: 'ACTIVE',
    lotCount: 2,
    totalStock: 48,
    lowStockLots: 0,
    expiringLots: 1,
    description: 'Core combination vaccine for cats.',
    createdAt: '2025-02-09T08:00:00.000Z',
    updatedAt: '2026-06-01T08:00:00.000Z',
  },
  {
    id: 'vac-003',
    code: 'DHPP',
    name: 'DHPP',
    disease: 'DHPP Combo',
    manufacturer: 'Nobivac',
    type: 'Core vaccine',
    species: 'dog',
    dose: '1 ml',
    intervalDays: 365,
    boosterRequired: true,
    status: 'ACTIVE',
    lotCount: 2,
    totalStock: 16,
    lowStockLots: 1,
    expiringLots: 0,
    description: 'Core canine combination vaccine.',
    createdAt: '2025-04-03T08:00:00.000Z',
    updatedAt: '2026-05-19T08:00:00.000Z',
  },
  {
    id: 'vac-004',
    code: 'BOR',
    name: 'Bordetella',
    disease: 'Bordetella',
    manufacturer: 'Elanco',
    type: 'Non-core vaccine',
    species: 'dog',
    dose: '0.5 ml',
    intervalDays: 365,
    boosterRequired: true,
    status: 'ACTIVE',
    lotCount: 1,
    totalStock: 32,
    lowStockLots: 0,
    expiringLots: 0,
    description: 'Respiratory vaccine for dogs with boarding exposure.',
    createdAt: '2025-06-21T08:00:00.000Z',
    updatedAt: '2026-06-02T08:00:00.000Z',
  },
  {
    id: 'vac-005',
    code: 'FELV',
    name: 'Feline Leukemia',
    disease: 'Feline Leukemia',
    manufacturer: 'Boehringer Ingelheim',
    type: 'Risk-based vaccine',
    species: 'cat',
    dose: '1 ml',
    intervalDays: 365,
    boosterRequired: true,
    status: 'INACTIVE',
    lotCount: 1,
    totalStock: 0,
    lowStockLots: 0,
    expiringLots: 0,
    description: 'Inactive until new stock is confirmed.',
    createdAt: '2025-08-11T08:00:00.000Z',
    updatedAt: '2026-04-22T08:00:00.000Z',
  },
];

const MOCK_LOTS: VaccineLot[] = [
  {
    id: 'lot-001',
    vaccineId: 'vac-001',
    lotNo: 'RV-294',
    manufacturer: 'Zoetis',
    importDate: '2026-03-12',
    expiryDate: '2026-08-15',
    quantity: 5,
    reservedQuantity: 1,
    status: 'LOW_STOCK',
  },
  {
    id: 'lot-002',
    vaccineId: 'vac-001',
    lotNo: 'RV-301',
    manufacturer: 'Zoetis',
    importDate: '2026-05-01',
    expiryDate: '2027-04-30',
    quantity: 42,
    reservedQuantity: 4,
    status: 'AVAILABLE',
  },
  {
    id: 'lot-003',
    vaccineId: 'vac-001',
    lotNo: 'RV-288',
    manufacturer: 'Zoetis',
    importDate: '2026-01-18',
    expiryDate: '2026-08-02',
    quantity: 37,
    reservedQuantity: 2,
    status: 'EXPIRING',
  },
  {
    id: 'lot-004',
    vaccineId: 'vac-002',
    lotNo: 'FC-102',
    manufacturer: 'Merck Animal Health',
    importDate: '2026-02-20',
    expiryDate: '2026-08-10',
    quantity: 18,
    reservedQuantity: 3,
    status: 'EXPIRING',
  },
  {
    id: 'lot-005',
    vaccineId: 'vac-002',
    lotNo: 'FC-118',
    manufacturer: 'Merck Animal Health',
    importDate: '2026-05-22',
    expiryDate: '2027-05-21',
    quantity: 30,
    reservedQuantity: 5,
    status: 'AVAILABLE',
  },
  {
    id: 'lot-006',
    vaccineId: 'vac-003',
    lotNo: 'DP-102',
    manufacturer: 'Nobivac',
    importDate: '2026-04-14',
    expiryDate: '2027-01-14',
    quantity: 9,
    reservedQuantity: 1,
    status: 'LOW_STOCK',
  },
  {
    id: 'lot-007',
    vaccineId: 'vac-003',
    lotNo: 'DP-095',
    manufacturer: 'Nobivac',
    importDate: '2025-11-12',
    expiryDate: '2026-02-01',
    quantity: 7,
    reservedQuantity: 0,
    status: 'EXPIRED',
  },
  {
    id: 'lot-008',
    vaccineId: 'vac-004',
    lotNo: 'BR-220',
    manufacturer: 'Elanco',
    importDate: '2026-05-05',
    expiryDate: '2027-05-04',
    quantity: 32,
    reservedQuantity: 2,
    status: 'AVAILABLE',
  },
];

const MOCK_PROTOCOLS: VaccineProtocol[] = [
  // DOG - RABIES
  {
    id: 'pr-001',
    species: 'dog',
    disease: 'Rabies',
    ageRange: '12-16 weeks',
    vaccineCode: 'RAB-1Y',
    vaccineName: 'Rabies Vaccine 1Y',
    isRequired: true,
    description: 'First rabies vaccination milestone. Legally mandated core immunization.',
    createdAt: '2026-01-10T08:00:00.000Z',
    updatedAt: '2026-01-10T08:00:00.000Z',
  },
  {
    id: 'pr-002',
    species: 'dog',
    disease: 'Rabies',
    ageRange: '1 year (Booster)',
    vaccineCode: 'RAB-1Y',
    vaccineName: 'Rabies Vaccine 1Y',
    isRequired: true,
    description: 'Annual booster rabies vaccination.',
    createdAt: '2026-01-10T08:00:00.000Z',
    updatedAt: '2026-01-10T08:00:00.000Z',
  },
  // DOG - DHPP
  {
    id: 'pr-003',
    species: 'dog',
    disease: 'DHPP Combo',
    ageRange: '6-8 weeks',
    vaccineCode: 'DHPP',
    vaccineName: 'DHPP Combo',
    isRequired: true,
    description: 'Core vaccination first immunization. Protects against Distemper, Hepatitis, Parvovirus, Parainfluenza.',
    createdAt: '2026-01-10T08:00:00.000Z',
    updatedAt: '2026-01-10T08:00:00.000Z',
  },
  {
    id: 'pr-004',
    species: 'dog',
    disease: 'DHPP Combo',
    ageRange: '10-12 weeks',
    vaccineCode: 'DHPP',
    vaccineName: 'DHPP Combo',
    isRequired: true,
    description: 'Second core combo booster shot.',
    createdAt: '2026-01-10T08:00:00.000Z',
    updatedAt: '2026-01-10T08:00:00.000Z',
  },
  {
    id: 'pr-005',
    species: 'dog',
    disease: 'DHPP Combo',
    ageRange: '14-16 weeks',
    vaccineCode: 'DHPP',
    vaccineName: 'DHPP Combo',
    isRequired: true,
    description: 'Third and final puppy core combo booster.',
    createdAt: '2026-01-10T08:00:00.000Z',
    updatedAt: '2026-01-10T08:00:00.000Z',
  },
  {
    id: 'pr-006',
    species: 'dog',
    disease: 'DHPP Combo',
    ageRange: '1 year (Booster)',
    vaccineCode: 'DHPP',
    vaccineName: 'DHPP Combo',
    isRequired: true,
    description: 'Annual booster combo vaccination.',
    createdAt: '2026-01-10T08:00:00.000Z',
    updatedAt: '2026-01-10T08:00:00.000Z',
  },
  // DOG - BORDETELLA
  {
    id: 'pr-007',
    species: 'dog',
    disease: 'Bordetella',
    ageRange: '10-12 weeks',
    vaccineCode: 'BOR',
    vaccineName: 'Bordetella',
    isRequired: false,
    description: 'Kennel cough prevention. Recommended for dogs attending daycare, boarding, or grooming.',
    createdAt: '2026-01-10T08:00:00.000Z',
    updatedAt: '2026-01-10T08:00:00.000Z',
  },
  {
    id: 'pr-008',
    species: 'dog',
    disease: 'Bordetella',
    ageRange: '1 year (Booster)',
    vaccineCode: 'BOR',
    vaccineName: 'Bordetella',
    isRequired: false,
    description: 'Annual kennel cough booster vaccination.',
    createdAt: '2026-01-10T08:00:00.000Z',
    updatedAt: '2026-01-10T08:00:00.000Z',
  },

  // CAT - FVRCP
  {
    id: 'pr-009',
    species: 'cat',
    disease: 'FVRCP Combo',
    ageRange: '6-8 weeks',
    vaccineCode: 'FVRCP',
    vaccineName: 'FVRCP Combo',
    isRequired: true,
    description: 'FVRCP combo first immunization. Protects against Rhinotracheitis, Calicivirus, Panleukopenia.',
    createdAt: '2026-01-10T08:00:00.000Z',
    updatedAt: '2026-01-10T08:00:00.000Z',
  },
  {
    id: 'pr-010',
    species: 'cat',
    disease: 'FVRCP Combo',
    ageRange: '10-12 weeks',
    vaccineCode: 'FVRCP',
    vaccineName: 'FVRCP Combo',
    isRequired: true,
    description: 'Second feline core combo booster.',
    createdAt: '2026-01-10T08:00:00.000Z',
    updatedAt: '2026-01-10T08:00:00.000Z',
  },
  {
    id: 'pr-011',
    species: 'cat',
    disease: 'FVRCP Combo',
    ageRange: '14-16 weeks',
    vaccineCode: 'FVRCP',
    vaccineName: 'FVRCP Combo',
    isRequired: true,
    description: 'Third and final kitten core combo booster.',
    createdAt: '2026-01-10T08:00:00.000Z',
    updatedAt: '2026-01-10T08:00:00.000Z',
  },
  {
    id: 'pr-012',
    species: 'cat',
    disease: 'FVRCP Combo',
    ageRange: '1 year (Booster)',
    vaccineCode: 'FVRCP',
    vaccineName: 'FVRCP Combo',
    isRequired: true,
    description: 'Annual booster combo vaccination.',
    createdAt: '2026-01-10T08:00:00.000Z',
    updatedAt: '2026-01-10T08:00:00.000Z',
  },
  // CAT - FELINE LEUKEMIA
  {
    id: 'pr-013',
    species: 'cat',
    disease: 'Feline Leukemia',
    ageRange: '10-12 weeks',
    vaccineCode: 'FELV',
    vaccineName: 'Feline Leukemia',
    isRequired: false,
    description: 'Leukemia first immunization shot. Recommended for outdoor cats.',
    createdAt: '2026-01-10T08:00:00.000Z',
    updatedAt: '2026-01-10T08:00:00.000Z',
  },
  {
    id: 'pr-014',
    species: 'cat',
    disease: 'Feline Leukemia',
    ageRange: '14-16 weeks',
    vaccineCode: 'FELV',
    vaccineName: 'Feline Leukemia',
    isRequired: false,
    description: 'Second and final kitten leukemia booster.',
    createdAt: '2026-01-10T08:00:00.000Z',
    updatedAt: '2026-01-10T08:00:00.000Z',
  },
  // CAT - RABIES
  {
    id: 'pr-015',
    species: 'cat',
    disease: 'Rabies',
    ageRange: '12-16 weeks',
    vaccineCode: 'RAB-1Y',
    vaccineName: 'Rabies Vaccine 1Y',
    isRequired: true,
    description: 'First feline rabies shot.',
    createdAt: '2026-01-10T08:00:00.000Z',
    updatedAt: '2026-01-10T08:00:00.000Z',
  },
  {
    id: 'pr-016',
    species: 'cat',
    disease: 'Rabies',
    ageRange: '1 year (Booster)',
    vaccineCode: 'RAB-1Y',
    vaccineName: 'Rabies Vaccine 1Y',
    isRequired: true,
    description: 'Annual booster rabies vaccination.',
    createdAt: '2026-01-10T08:00:00.000Z',
    updatedAt: '2026-01-10T08:00:00.000Z',
  },
];

interface VaccineState {
  loading: boolean;
  vaccine: Vaccine | null;
  listVaccine: {
    data: Vaccine[];
    total: number;
    page: number;
    limit: number;
  };
  filters: {
    search?: string;
    status?: string;
    species?: string;
  };
  overView: {
    total: number;
    active: number;
    totalStock: number;
    lowStockLots: number;
    expiringLots: number;
  };
  listProtocol: {
    data: VaccineProtocol[];
    total: number;
    page: number;
    limit: number;
  };
  protocolFilters: {
    species?: 'dog' | 'cat';
    disease?: string;
    search?: string;
  };
  listLot: {
    data: (VaccineLot & { vaccineName?: string; vaccineCode?: string })[];
    total: number;
    page: number;
    limit: number;
  };
  lotFilters: {
    search?: string;
    status?: string;
    vaccineId?: string;
  };
  lotOverview: {
    total: number;
    available: number;
    lowStock: number;
    expiring: number;
    expired: number;
  };
}

export const useVaccineStore = defineStore('vaccine', {
  state: (): VaccineState => ({
    loading: false,
    vaccine: null,
    listVaccine: {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
    },
    filters: {
      search: '',
      status: undefined,
      species: undefined,
    },
    overView: {
      total: 0,
      active: 0,
      totalStock: 0,
      lowStockLots: 0,
      expiringLots: 0,
    },
    listProtocol: {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
    },
    protocolFilters: {
      species: 'dog',
      disease: 'Rabies',
      search: '',
    },
    listLot: {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
    },
    lotFilters: {
      search: '',
      status: undefined,
      vaccineId: undefined,
    },
    lotOverview: {
      total: 0,
      available: 0,
      lowStock: 0,
      expiring: 0,
      expired: 0,
    },
  }),

  actions: {
    applyVaccineList(data: Vaccine[], page?: number, limit?: number) {
      const normalizedPage = Math.max(1, page ?? this.listVaccine.page);
      const normalizedLimit = Math.max(1, limit ?? this.listVaccine.limit);
      const start = (normalizedPage - 1) * normalizedLimit;

      this.listVaccine.data = data.slice(start, start + normalizedLimit);
      this.listVaccine.total = data.length;
      this.listVaccine.page = normalizedPage;
      this.listVaccine.limit = normalizedLimit;
    },

    getFilteredMockVaccines() {
      const search = this.filters.search?.trim().toLowerCase();
      const status = this.filters.status;
      const species = this.filters.species;

      return MOCK_VACCINES.filter(vaccine => {
        const matchesSearch =
          !search ||
          [vaccine.name, vaccine.code, vaccine.disease, vaccine.manufacturer].some(
            value => value && value.toLowerCase().includes(search)
          );
        const matchesStatus = !status || vaccine.status === status;
        const matchesSpecies = !species || vaccine.species === species;

        return matchesSearch && matchesStatus && matchesSpecies;
      });
    },

    applyVaccineOverview(data: Vaccine[] = MOCK_VACCINES) {
      this.overView = {
        total: data.length,
        active: data.filter(vaccine => vaccine.status === 'ACTIVE').length,
        totalStock: data.reduce((sum, vaccine) => sum + vaccine.totalStock, 0),
        lowStockLots: data.reduce((sum, vaccine) => sum + vaccine.lowStockLots, 0),
        expiringLots: data.reduce((sum, vaccine) => sum + vaccine.expiringLots, 0),
      };
    },

    setFilters(filters: Partial<VaccineState['filters']>) {
      this.filters = { ...this.filters, ...filters };
      this.listVaccine.page = 1;
    },

    setPagination(page: number, limit: number) {
      this.listVaccine.page = page;
      this.listVaccine.limit = limit;
    },

    resetFilters() {
      this.filters = {
        search: '',
        status: undefined,
        species: undefined,
      };
      this.listVaccine.page = 1;
    },

    async fetchVaccineList() {
      this.loading = true;
      try {
        this.applyVaccineList(this.getFilteredMockVaccines());
      } finally {
        this.loading = false;
      }
    },

    async fetchVaccineOverView() {
      this.applyVaccineOverview(MOCK_VACCINES);
    },

    async getVaccine(id: string) {
      this.loading = true;
      try {
        this.vaccine = MOCK_VACCINES.find(vaccine => vaccine.id === id) || null;
      } finally {
        this.loading = false;
      }
    },

    getVaccineLots(vaccineId: string) {
      return MOCK_LOTS.filter(lot => lot.vaccineId === vaccineId);
    },

    getActiveVaccinesOptions() {
      return MOCK_VACCINES.filter(v => v.status === 'ACTIVE').map(v => ({
        value: v.code,
        label: `${v.name} (${v.code})`,
        name: v.name,
      }));
    },

    // Protocol Actions
    applyProtocolList(data: VaccineProtocol[], page?: number, limit?: number) {
      const normalizedPage = Math.max(1, page ?? this.listProtocol.page);
      const normalizedLimit = Math.max(1, limit ?? this.listProtocol.limit);
      const start = (normalizedPage - 1) * normalizedLimit;

      this.listProtocol.data = data.slice(start, start + normalizedLimit);
      this.listProtocol.total = data.length;
      this.listProtocol.page = normalizedPage;
      this.listProtocol.limit = normalizedLimit;
    },

    getFilteredMockProtocols() {
      const search = this.protocolFilters.search?.trim().toLowerCase();
      const species = this.protocolFilters.species;
      const disease = this.protocolFilters.disease;

      return MOCK_PROTOCOLS.filter(p => {
        const matchesSearch =
          !search ||
          [p.vaccineCode, p.vaccineName, p.ageRange, p.description].some(
            val => val && val.toLowerCase().includes(search)
          );
        const matchesSpecies = !species || p.species === species;
        const matchesDisease = !disease || p.disease === disease;
        return matchesSearch && matchesSpecies && matchesDisease;
      });
    },

    async fetchProtocolList() {
      this.loading = true;
      try {
        this.applyProtocolList(this.getFilteredMockProtocols());
      } finally {
        this.loading = false;
      }
    },

    getDiseasesBySpecies(species: 'dog' | 'cat') {
      const protocolsForSpecies = MOCK_PROTOCOLS.filter(p => p.species === species);
      return Array.from(new Set(protocolsForSpecies.map(p => p.disease)));
    },

    getMilestonesCount(species: 'dog' | 'cat', disease: string) {
      return MOCK_PROTOCOLS.filter(p => p.species === species && p.disease === disease).length;
    },

    setProtocolFilters(filters: Partial<VaccineState['protocolFilters']>) {
      this.protocolFilters = { ...this.protocolFilters, ...filters };
      this.listProtocol.page = 1;
    },

    setProtocolPagination(page: number, limit: number) {
      this.listProtocol.page = page;
      this.listProtocol.limit = limit;
    },

    resetProtocolFilters() {
      this.protocolFilters = {
        species: 'dog',
        disease: 'Rabies',
        search: '',
      };
      this.listProtocol.page = 1;
    },

    async createProtocol(payload: Partial<VaccineProtocol>) {
      this.loading = true;
      try {
        const v = MOCK_VACCINES.find(vac => vac.code === payload.vaccineCode);
        const newProtocol: VaccineProtocol = {
          id: `pr-${Date.now()}`,
          species: payload.species || 'dog',
          disease: payload.disease || 'Rabies',
          ageRange: payload.ageRange || '',
          vaccineCode: payload.vaccineCode || '',
          vaccineName: v ? v.name : payload.vaccineName || payload.vaccineCode || '',
          isRequired: payload.isRequired ?? true,
          description: payload.description,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        MOCK_PROTOCOLS.push(newProtocol);
        await this.fetchProtocolList();
        return { success: true };
      } finally {
        this.loading = false;
      }
    },

    async updateProtocol(id: string, payload: Partial<VaccineProtocol>) {
      this.loading = true;
      try {
        const index = MOCK_PROTOCOLS.findIndex(p => p.id === id);
        if (index !== -1) {
          const original = MOCK_PROTOCOLS[index];
          if (original) {
            const v = MOCK_VACCINES.find(vac => vac.code === payload.vaccineCode);
            MOCK_PROTOCOLS[index] = {
              ...original,
              ...payload,
              vaccineName: v ? v.name : payload.vaccineName || original.vaccineName,
              updatedAt: new Date().toISOString(),
            } as VaccineProtocol;
            await this.fetchProtocolList();
            return { success: true };
          }
        }
        throw new Error('Protocol not found');
      } finally {
        this.loading = false;
      }
    },

    async deleteProtocol(id: string) {
      this.loading = true;
      try {
        const index = MOCK_PROTOCOLS.findIndex(p => p.id === id);
        if (index !== -1) {
          MOCK_PROTOCOLS.splice(index, 1);
          await this.fetchProtocolList();
          return { success: true };
        }
        throw new Error('Protocol not found');
      } finally {
        this.loading = false;
      }
    },

    async createVaccine(payload: Partial<Vaccine>) {
      this.loading = true;
      try {
        const newVaccine: Vaccine = {
          id: `vac-${Date.now()}`,
          code: payload.code || `VAC-${Math.floor(Math.random() * 900) + 100}`,
          name: payload.name || '',
          disease: payload.disease || '',
          manufacturer: payload.manufacturer || '',
          type: payload.type || 'Core vaccine',
          species: payload.species || 'dog',
          dose: payload.dose || '1 ml',
          intervalDays: payload.intervalDays || 365,
          boosterRequired: payload.boosterRequired ?? true,
          status: payload.status || 'ACTIVE',
          lotCount: 0,
          totalStock: 0,
          lowStockLots: 0,
          expiringLots: 0,
          description: payload.description || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        MOCK_VACCINES.unshift(newVaccine);
        this.applyVaccineOverview();
        await this.fetchVaccineList();
        return { success: true };
      } finally {
        this.loading = false;
      }
    },

    async updateVaccine(id: string, payload: Partial<Vaccine>) {
      this.loading = true;
      try {
        const index = MOCK_VACCINES.findIndex(v => v.id === id);
        if (index !== -1) {
          const original = MOCK_VACCINES[index];
          if (original) {
            MOCK_VACCINES[index] = {
              ...original,
              ...payload,
              updatedAt: new Date().toISOString(),
            } as Vaccine;
            this.applyVaccineOverview();
            await this.fetchVaccineList();
            return { success: true };
          }
        }
        throw new Error('Vaccine not found');
      } finally {
        this.loading = false;
      }
    },

    async deleteVaccine(id: string) {
      this.loading = true;
      try {
        const index = MOCK_VACCINES.findIndex(v => v.id === id);
        if (index !== -1) {
          MOCK_VACCINES.splice(index, 1);
          this.applyVaccineOverview();
          await this.fetchVaccineList();
          return { success: true };
        }
        throw new Error('Vaccine not found');
      } finally {
        this.loading = false;
      }
    },

    // Lot Management Actions
    applyLotList(data: (VaccineLot & { vaccineName?: string; vaccineCode?: string })[], page?: number, limit?: number) {
      const normalizedPage = Math.max(1, page ?? this.listLot.page);
      const normalizedLimit = Math.max(1, limit ?? this.listLot.limit);
      const start = (normalizedPage - 1) * normalizedLimit;

      this.listLot.data = data.slice(start, start + normalizedLimit);
      this.listLot.total = data.length;
      this.listLot.page = normalizedPage;
      this.listLot.limit = normalizedLimit;
    },

    getFilteredMockLots() {
      const search = this.lotFilters.search?.trim().toLowerCase();
      const status = this.lotFilters.status;
      const vaccineId = this.lotFilters.vaccineId;

      const lotsWithInfo = MOCK_LOTS.map(lot => {
        const v = MOCK_VACCINES.find(vac => vac.id === lot.vaccineId);
        return {
          ...lot,
          vaccineName: v ? v.name : 'Unknown Vaccine',
          vaccineCode: v ? v.code : '-',
        };
      });

      return lotsWithInfo.filter(lot => {
        const matchesSearch =
          !search ||
          [lot.lotNo, lot.manufacturer, lot.vaccineName, lot.vaccineCode].some(
            val => val && val.toLowerCase().includes(search),
          );
        const matchesStatus = !status || lot.status === status;
        const matchesVaccine = !vaccineId || lot.vaccineId === vaccineId;

        return matchesSearch && matchesStatus && matchesVaccine;
      });
    },

    applyLotOverview() {
      this.lotOverview = {
        total: MOCK_LOTS.length,
        available: MOCK_LOTS.filter(l => l.status === 'AVAILABLE').length,
        lowStock: MOCK_LOTS.filter(l => l.status === 'LOW_STOCK').length,
        expiring: MOCK_LOTS.filter(l => l.status === 'EXPIRING').length,
        expired: MOCK_LOTS.filter(l => l.status === 'EXPIRED').length,
      };
    },

    setLotFilters(filters: Partial<VaccineState['lotFilters']>) {
      this.lotFilters = { ...this.lotFilters, ...filters };
      this.listLot.page = 1;
    },

    setLotPagination(page: number, limit: number) {
      this.listLot.page = page;
      this.listLot.limit = limit;
    },

    resetLotFilters() {
      this.lotFilters = {
        search: '',
        status: undefined,
        vaccineId: undefined,
      };
      this.listLot.page = 1;
    },

    async fetchLotList() {
      this.loading = true;
      try {
        this.applyLotList(this.getFilteredMockLots());
      } finally {
        this.loading = false;
      }
    },

    async fetchLotOverview() {
      this.applyLotOverview();
    },

    async createVaccineLot(payload: Partial<VaccineLot>) {
      this.loading = true;
      try {
        const vaccineId = payload.vaccineId || MOCK_VACCINES[0]?.id || 'vac-001';
        const v = MOCK_VACCINES.find(vac => vac.id === vaccineId);

        const newLot: VaccineLot = {
          id: `lot-${Date.now()}`,
          vaccineId,
          lotNo: payload.lotNo || `LOT-${Math.floor(Math.random() * 900) + 100}`,
          manufacturer: payload.manufacturer || (v ? v.manufacturer : 'Generic'),
          importDate: payload.importDate || new Date().toISOString().slice(0, 10),
          expiryDate:
            payload.expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
          quantity: payload.quantity || 50,
          reservedQuantity: 0,
          status: payload.status || 'AVAILABLE',
        };

        MOCK_LOTS.unshift(newLot);

        // Recalculate vaccine counts
        if (v) {
          v.lotCount += 1;
          v.totalStock += newLot.quantity;
        }

        this.applyLotOverview();
        await this.fetchLotList();
        await this.fetchVaccineList();
        return { success: true };
      } finally {
        this.loading = false;
      }
    },

    async updateVaccineLot(id: string, payload: Partial<VaccineLot>) {
      this.loading = true;
      try {
        const index = MOCK_LOTS.findIndex(l => l.id === id);
        if (index !== -1) {
          const original = MOCK_LOTS[index];
          if (original) {
            MOCK_LOTS[index] = {
              ...original,
              ...payload,
            } as VaccineLot;

            this.applyLotOverview();
            await this.fetchLotList();
            await this.fetchVaccineList();
            return { success: true };
          }
        }
        throw new Error('Lot not found');
      } finally {
        this.loading = false;
      }
    },

    async deleteVaccineLot(id: string) {
      this.loading = true;
      try {
        const index = MOCK_LOTS.findIndex(l => l.id === id);
        if (index !== -1) {
          MOCK_LOTS.splice(index, 1);
          this.applyLotOverview();
          await this.fetchLotList();
          await this.fetchVaccineList();
          return { success: true };
        }
        throw new Error('Lot not found');
      } finally {
        this.loading = false;
      }
    },
  },
});
