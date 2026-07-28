import type { I_Response } from '@/core/api/api.type';
import { axiosClient } from '@/core/api/axios';
import { LOGIN_URL, LOGOUT_URL, REFRESH_TOKEN_URL } from '@/core/api/endpoints';
import type { User } from '@/shared/types/user.type';

interface AuthResponse {
  access_token: string;
  access_expires_at?: string;
  user?: User;
}

export const authAPI = {
  async login(body: { email: string; password: string }): Promise<I_Response<AuthResponse>> {
    return await axiosClient.request({
      method: 'POST',
      url: LOGIN_URL,
      data: body,
    });
  },

  async refreshToken(): Promise<I_Response<AuthResponse>> {
    return await axiosClient.request({
      method: 'POST',
      url: REFRESH_TOKEN_URL,
    });
  },

  async logout(): Promise<I_Response<null>> {
    return await axiosClient.request({
      method: 'POST',
      url: LOGOUT_URL,
    });
  },
};
