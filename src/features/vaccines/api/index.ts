import type { I_PaginatedResponse, I_Params, I_Response } from '@/core/api/api.type';
import type { Vaccine, VaccineLot } from '@/shared/types/vaccine.type';

export interface VaccineParams extends I_Params {
  status?: string;
  species?: string;
}

export const vaccineApi = {
  async fetchListVaccines(params: VaccineParams): Promise<I_PaginatedResponse<Vaccine>> {
    return {
      success: true,
      statusCode: 200,
      message: 'Mock vaccine API disabled',
      data: [],
      meta: {
        total: 0,
        page: params.page,
        limit: params.limit,
        totalPages: 0,
      },
    };
  },

  async getVaccine(id: string): Promise<I_Response<Vaccine>> {
    void id;
    return {
      success: true,
      statusCode: 200,
      message: 'Mock vaccine API disabled',
      data: undefined,
    };
  },

  async fetchVaccineLots(id: string): Promise<I_Response<VaccineLot[]>> {
    void id;
    return {
      success: true,
      statusCode: 200,
      message: 'Mock vaccine API disabled',
      data: [],
    };
  },
};
