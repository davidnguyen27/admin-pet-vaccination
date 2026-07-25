import { defineStore } from 'pinia';
import type { Pet } from '@/shared/types/pet.type';

const MOCK_PETS: Pet[] = [
  {
    id: 'pet-001',
    ownerId: 'owner-001',
    ownerName: 'Nguyen Minh Anh',
    speciesId: 'dog',
    name: 'Milo',
    sex: 'MALE',
    dob: '2022-04-12',
    weight: 12.4,
    color: 'Golden',
    breed: 'Corgi',
    note: 'Rabies booster due next month.',
    isSterilized: true,
    createdAt: '2025-01-12T08:00:00.000Z',
    updatedAt: '2026-01-10T08:00:00.000Z',
  },
  {
    id: 'pet-002',
    ownerId: 'owner-002',
    ownerName: 'Tran Hoang Long',
    speciesId: 'cat',
    name: 'Luna',
    sex: 'FEMALE',
    dob: '2021-09-18',
    weight: 4.2,
    color: 'Gray',
    breed: 'British Shorthair',
    note: 'Sensitive to cold rooms.',
    isSterilized: true,
    createdAt: '2025-02-02T08:00:00.000Z',
    updatedAt: '2026-02-14T08:00:00.000Z',
  },
  {
    id: 'pet-003',
    ownerId: 'owner-003',
    ownerName: 'Le Bao Chau',
    speciesId: 'dog',
    name: 'Bento',
    sex: 'MALE',
    dob: '2023-01-05',
    weight: 8.8,
    color: 'Black',
    breed: 'Poodle',
    note: '',
    isSterilized: false,
    createdAt: '2025-03-10T08:00:00.000Z',
    updatedAt: '2026-03-11T08:00:00.000Z',
  },
  {
    id: 'pet-004',
    ownerId: 'owner-004',
    ownerName: 'Pham Thu Ha',
    speciesId: 'cat',
    name: 'Mochi',
    sex: 'FEMALE',
    dob: '2020-11-22',
    weight: 5.1,
    color: 'White',
    breed: 'Domestic Longhair',
    note: 'Needs carrier cover during visits.',
    isSterilized: true,
    createdAt: '2025-04-16T08:00:00.000Z',
    updatedAt: '2026-04-18T08:00:00.000Z',
  },
  {
    id: 'pet-005',
    ownerId: 'owner-005',
    ownerName: 'Do Gia Huy',
    speciesId: 'bird',
    name: 'Kiwi',
    sex: 'UNKNOWN',
    dob: '2024-02-01',
    weight: 0.2,
    color: 'Green',
    breed: 'Parakeet',
    note: 'Annual wellness check only.',
    isSterilized: false,
    createdAt: '2025-05-03T08:00:00.000Z',
    updatedAt: '2026-05-03T08:00:00.000Z',
  },
  {
    id: 'pet-006',
    ownerId: 'owner-006',
    ownerName: 'Vu Ngoc Linh',
    speciesId: 'other',
    name: 'Nori',
    sex: 'UNKNOWN',
    dob: '2023-07-09',
    weight: 1.1,
    color: 'Brown',
    breed: 'Rabbit',
    note: 'Handle gently during examination.',
    isSterilized: false,
    createdAt: '2025-06-20T08:00:00.000Z',
    updatedAt: '2026-06-21T08:00:00.000Z',
  },
];

interface PetState {
  loading: boolean;
  pet: Pet | null;
  listPet: {
    data: Pet[];
    total: number;
    page: number;
    limit: number;
  };
  filters: {
    search?: string;
    species?: string;
  };
  overView: {
    total: number;
    dogs: number;
    cats: number;
    others: number;
  };
}

export const usePetStore = defineStore('pet', {
  state: (): PetState => ({
    loading: false,
    pet: null,
    listPet: {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
    },
    filters: {
      search: '',
      species: undefined,
    },
    overView: {
      total: 0,
      dogs: 0,
      cats: 0,
      others: 0,
    },
  }),

  actions: {
    applyPetList(data: Pet[], page?: number, limit?: number) {
      const normalizedPage = Math.max(1, page ?? this.listPet.page);
      const normalizedLimit = Math.max(1, limit ?? this.listPet.limit);
      const start = (normalizedPage - 1) * normalizedLimit;

      this.listPet.data = data.slice(start, start + normalizedLimit);
      this.listPet.total = data.length;
      this.listPet.page = normalizedPage;
      this.listPet.limit = normalizedLimit;
    },
    getFilteredMockPets() {
      const search = this.filters.search?.trim().toLowerCase();
      const species = this.filters.species;

      return MOCK_PETS.filter(pet => {
        const matchesSearch =
          !search ||
          [pet.name, pet.breed, pet.ownerName, pet.color].some(value => value?.toLowerCase().includes(search));
        const matchesSpecies = !species || pet.speciesId === species;

        return matchesSearch && matchesSpecies;
      });
    },
    applyPetOverview(data: Pet[] = MOCK_PETS) {
      const dogs = data.filter(pet => pet.speciesId === 'dog').length;
      const cats = data.filter(pet => pet.speciesId === 'cat').length;
      const others = data.length - dogs - cats;

      this.overView = {
        total: data.length,
        dogs,
        cats,
        others,
      };
    },
    setFilters(filters: Partial<PetState['filters']>) {
      this.filters = { ...this.filters, ...filters };
      this.listPet.page = 1;
    },
    setPagination(page: number, limit: number) {
      this.listPet.page = page;
      this.listPet.limit = limit;
    },
    resetFilters() {
      this.filters = {
        search: '',
        species: undefined,
      };
      this.listPet.page = 1;
    },
    async fetchPetList() {
      this.loading = true;
      try {
        this.applyPetList(this.getFilteredMockPets());
      } finally {
        this.loading = false;
      }
    },

    async fetchPetOverView() {
      this.applyPetOverview(MOCK_PETS);
    },
  },
});
