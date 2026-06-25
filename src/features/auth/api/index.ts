import type { I_Response } from '@/core/api/api.type';
import { axiosClient } from '@/core/api/axios';
import { CURRENT_USER_URL, FORGOT_PASSWORD_URL, LOGIN_URL, LOGOUT_URL, REFRESH_TOKEN_URL } from '@/core/api/endpoints';

export const authAPI = {
  async login(body: { email: string; password: string }) {
    return await axiosClient.request({
      method: 'POST',
      url: LOGIN_URL,
      data: body,
    });
  },

  async refreshToken(): Promise<I_Response<{ accessToken: string }>> {
    return await axiosClient.request({
      method: 'POST',
      url: REFRESH_TOKEN_URL,
    });
  },

  async forgotPassword(body: { email: string }) {
    return await axiosClient.request({
      method: 'POST',
      url: FORGOT_PASSWORD_URL,
      data: body,
    });
  },

  async getCurrentUser() {
    return await axiosClient.request({
      method: 'POST',
      url: CURRENT_USER_URL,
    });
  },

  async logout() {
    return await axiosClient.request({
      method: 'POST',
      url: LOGOUT_URL,
    });
  },
};
