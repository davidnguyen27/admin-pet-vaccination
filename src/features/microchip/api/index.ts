import type { I_PaginatedResponse, I_Params, I_Response } from '@/core/api/api.type';
import type { Microchip } from '@/shared/types/microchip.type';

export interface MicrochipParams extends I_Params {
  status?: string;
  search?: string;
}

export const microchipApi = {
  async fetchListMicrochips(params: MicrochipParams): Promise<I_PaginatedResponse<Microchip>> {
    void params;
    return {
      success: true,
      statusCode: 200,
      message: 'Mock microchip API',
      data: [],
      meta: {
        total: 0,
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        totalPages: 0,
      },
    };
  },

  async createMicrochip(payload: Partial<Microchip>): Promise<I_Response<Microchip>> {
    void payload;
    return {
      success: true,
      statusCode: 201,
      message: 'Mock microchip API',
    };
  },

  async updateMicrochip(id: string, payload: Partial<Microchip>): Promise<I_Response<Microchip>> {
    void id;
    void payload;
    return {
      success: true,
      statusCode: 200,
      message: 'Mock microchip API',
    };
  },

  async deleteMicrochip(id: string): Promise<I_Response<null>> {
    void id;
    return {
      success: true,
      statusCode: 200,
      message: 'Mock microchip API',
    };
  },
};
