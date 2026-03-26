import { axiosInstance } from '@/configs/axios.config';
import type { IResponse, IPaginatedResponse } from '@/interfaces/i-response';
import type { User } from './user.type';

interface Params {
  page: number;
  limit: number;
  search?: string;
  roleCode?: string;
  isActive?: boolean;
}

export interface UserBody {
  email: string;
  password: string;
  roleCode: string;
  fullName: string | null;
  phoneNumber: string | null;
  avatarUrl: string | null;
  dob: string | null;
}

export const userApi = {
  async getAllUsers(params: Params) {
    const response = await axiosInstance.get<IPaginatedResponse<User>>('/users', { params });
    return response;
  },

  async getUserById(id: string) {
    const response = await axiosInstance.get<IResponse<User>>(`/users/${id}`);
    return response;
  },

  async createUser(body: UserBody) {
    const response = await axiosInstance.post<IResponse<User>>('/users', body);
    return response;
  },

  async updateUser(id: string, body: UserBody) {
    const response = await axiosInstance.patch<IResponse<User>>(`/users/${id}`, body);
    return response;
  },

  async deleteUser(id: string) {
    const response = await axiosInstance.delete<IResponse<User>>(`/users/${id}`);
    return response;
  },
};
