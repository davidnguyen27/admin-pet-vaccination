import type { I_PaginatedResponse, I_Params, I_Response } from '@/core/api/api.type';
import type { Pet } from '@/shared/types/pet.type';

export interface PetParams extends I_Params {
  species?: string;
}

export const petApi = {
  async fetchListPets(params: PetParams): Promise<I_PaginatedResponse<Pet>> {
    return {
      success: true,
      statusCode: 200,
      message: 'Mock pet API disabled',
      data: [],
      meta: {
        total: 0,
        page: params.page,
        limit: params.limit,
        totalPages: 0,
      },
    };
  },

  async getPet(id: string): Promise<I_Response<Pet>> {
    void id;
    return {
      success: true,
      statusCode: 200,
      message: 'Mock pet API disabled',
      data: undefined,
    };
  },

  async createPet(): Promise<I_Response<Pet>> {
    return {
      success: true,
      statusCode: 201,
      message: 'Mock pet API disabled',
      data: undefined,
    };
  },

  async updatePet(id: string): Promise<I_Response<Pet>> {
    void id;
    return {
      success: true,
      statusCode: 200,
      message: 'Mock pet API disabled',
      data: undefined,
    };
  },

  async deletePet(id: string): Promise<I_Response<Pet>> {
    void id;
    return {
      success: true,
      statusCode: 200,
      message: 'Mock pet API disabled',
      data: undefined,
    };
  },
};
