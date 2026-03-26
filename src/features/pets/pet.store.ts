import { defineStore } from 'pinia';
import type { Pet } from './pet.type';
import { petApi, type PetBody } from './pet.api';
import type { IPaginatedResponse } from '@/interfaces/i-response';
import type { IParams } from '@/interfaces/i-params';

export const petStore = defineStore('pets', {
  state: () => ({
    pets: [] as Pet[],
    meta: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    },
  }),

  actions: {
    async fetchPets(params: IParams) {
      try {
        const response = (await petApi.getAll({
          page: params.page,
          limit: params.limit,
          search: params.search || '',
        })) as unknown as IPaginatedResponse<Pet>;

        if (response.success) {
          this.pets = response.data || [];
          if (response.meta) this.meta = response.meta;
          return response;
        }
      } catch (error) {
        throw error;
      }
    },

    async createPet(body: PetBody) {
      try {
        const response = (await petApi.create(body)) as unknown as IPaginatedResponse<Pet>;
        if (response.success) {
          await this.fetchPets({
            page: this.meta.page,
            limit: this.meta.limit,
          });
          return response;
        }
      } catch (error) {
        throw error;
      }
    },

    async updatePet(id: string, body: PetBody) {
      try {
        const response = (await petApi.update(id, body)) as unknown as IPaginatedResponse<Pet>;
        if (response.success) {
          await this.fetchPets({
            page: this.meta.page,
            limit: this.meta.limit,
          });
          return response;
        }
      } catch (error) {
        throw error;
      }
    },

    async deletePet(id: string) {
      try {
        const response = (await petApi.delete(id)) as unknown as IPaginatedResponse<Pet>;
        if (response.success) {
          await this.fetchPets({
            page: this.meta.page,
            limit: this.meta.limit,
          });
          return response;
        }
      } catch (error) {
        throw error;
      }
    },
  },
});
