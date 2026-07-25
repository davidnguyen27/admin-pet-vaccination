import type { I_PaginatedResponse, I_Params, I_Response } from '@/core/api/api.type';
import type { User } from '@/shared/types/user.type';

export interface UserParams extends I_Params {
  roleCode?: string;
  isActive?: boolean;
}

export interface CreateUserPayload {
  email?: string; // required
  password?: string; // required
  roleCode?: string; // required
  fullName?: string;
  phoneNumber?: string;
  avatar?: File | null;
  dob?: string;
  address?: string;
  locationLat?: number; // owner
  locationLng?: number; // owner
  staffCode?: string; // staff
  jobTitle?: string; // staff
  department?: string; // staff
  employmentType?: string; // staff
  employmentStatus?: string; // staff and vet
  joinDate?: string; // staff and vet
  endDate?: string;
  citizenId?: string; // staff and vet
  notes?: string;
  bio?: string; // vet
  licenseNo?: string; // vet
  licenseIssueBy?: string; // vet
  licenseValidFrom?: string; // vet
  licenseValidTo?: string; // vet
}

export const userAPI = {
  async fetchListUser(params: UserParams): Promise<I_PaginatedResponse<User>> {
    return {
      success: true,
      statusCode: 200,
      message: 'Mock user API disabled',
      data: [],
      meta: {
        total: 0,
        page: params.page,
        limit: params.limit,
        totalPages: 0,
      },
    };
  },

  async getUser(id: string): Promise<I_Response<User>> {
    void id;
    return {
      success: true,
      statusCode: 200,
      message: 'Mock user API disabled',
      data: undefined,
    };
  },

  async createUser(data: FormData): Promise<I_Response<User>> {
    void data;
    return {
      success: true,
      statusCode: 201,
      message: 'Mock user API disabled',
      data: undefined,
    };
  },

  async updateUser(id: string, data: FormData): Promise<I_Response<User>> {
    void id;
    void data;
    return {
      success: true,
      statusCode: 200,
      message: 'Mock user API disabled',
      data: undefined,
    };
  },

  async deleteUser(id: string): Promise<I_Response<User>> {
    void id;
    return {
      success: true,
      statusCode: 200,
      message: 'Mock user API disabled',
      data: undefined,
    };
  },
};
