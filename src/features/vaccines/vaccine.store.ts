import { defineStore } from 'pinia';
import type { Vaccine } from './vaccine.type';
import type { IParams } from '@/interfaces/i-params';
import { vaccineApi, type VaccineBody } from './vaccine.api';
import type { IPaginatedResponse } from '@/interfaces/i-response';

export const vaccineStore = defineStore('vaccine', {
  state: () => ({
    vaccines: [] as Vaccine[],
    meta: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    },
  }),
  actions: {
    async fetchVaccinesList(params: IParams) {
      try {
        const response = (await vaccineApi.getAllVaccines({
          page: params.page,
          limit: params.limit,
          search: params.search || '',
        })) as unknown as IPaginatedResponse<Vaccine>;

        if (response.success) {
          this.vaccines = response.data || [];
          if (response.meta) this.meta = response.meta;
          return response;
        }
      } catch (error) {
        throw error;
      }
    },

    async createVaccine(vaccine: VaccineBody) {
      try {
        const response = (await vaccineApi.createVaccine(vaccine)) as unknown as IPaginatedResponse<Vaccine>;
        if (response.success) {
          await this.fetchVaccinesList({
            page: this.meta.page,
            limit: this.meta.limit,
          });
          return response;
        }
      } catch (error) {
        throw error;
      }
    },

    async updateVaccine(id: string, vaccine: VaccineBody) {
      try {
        const response = (await vaccineApi.updateVaccine(id, vaccine)) as unknown as IPaginatedResponse<Vaccine>;
        if (response.success) {
          await this.fetchVaccinesList({
            page: this.meta.page,
            limit: this.meta.limit,
          });
          return response;
        }
      } catch (error) {
        throw error;
      }
    },

    async deleteVaccine(id: string) {
      try {
        const response = (await vaccineApi.deleteVaccine(id)) as unknown as IPaginatedResponse<Vaccine>;
        if (response.success) {
          await this.fetchVaccinesList({
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
