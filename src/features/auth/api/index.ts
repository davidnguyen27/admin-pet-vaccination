import { axiosInstance } from '@/configs/axios.config';
import type { IResponse } from '@/interfaces/i-response';

export interface LoginReq {
  email: string;
  password: string;
}

export const authApi = {
  async login(body: LoginReq) {
    const response = await axiosInstance.post('/auth/login', body);
    return response as unknown as IResponse;
  },

  async refreshToken() {
    const response = await axiosInstance.post('/auth/refresh');
    return response as unknown as IResponse;
  },

  async logout() {
    const response = await axiosInstance.post('/auth/logout');
    return response as unknown as IResponse;
  },
};
