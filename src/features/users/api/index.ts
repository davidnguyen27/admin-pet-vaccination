import type { I_PaginatedResponse, I_Params, I_Response } from '@/core/api/api.type';
import { axiosClient } from '@/core/api/axios';
import { USER_PATH } from '@/core/api/endpoints';
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
    return await axiosClient.request({
      method: 'GET',
      url: USER_PATH,
      params,
    });
  },

  async getUser(id: string): Promise<I_Response<User>> {
    return await axiosClient.request({
      method: 'GET',
      url: `${USER_PATH}/${id}`,
    });
  },

  async createUser(data: FormData): Promise<I_Response<User>> {
    return await axiosClient.request({
      method: 'POST',
      url: USER_PATH,
      data,
    });
  },

  async updateUser(id: string, data: FormData): Promise<I_Response<User>> {
    return await axiosClient.request({
      method: 'PATCH',
      url: `${USER_PATH}/${id}`,
      data,
    });
  },

  async deleteUser(id: string): Promise<I_Response<User>> {
    return await axiosClient.request({
      method: 'DELETE',
      url: `${USER_PATH}/${id}`,
    });
  },
};
