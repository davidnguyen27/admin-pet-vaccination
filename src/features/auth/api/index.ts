import { axiosInstance } from '@/configs/axios.config';

export interface LoginReq {
  email: string;
  password: string;
}

export const authApi = {
  async login(body: LoginReq) {
    const response = await axiosInstance.post('/auth/login', body);
    return response.data;
  },

  async refreshToken() {
    const response = await axiosInstance('/auth/refresh-token');
    return response.data;
  },

  async logout() {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  },
};
