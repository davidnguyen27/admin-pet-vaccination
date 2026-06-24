import { axiosClient } from '@/core/api/axios';
import {
  CURRENT_USER_URL,
  FORGOT_PASSWORD_URL,
  LOGIN_URL,
  LOGOUT_URL,
  REFRESH_TOKEN_URL,
  RESEND_EMAIL_URL,
  RESET_PASSWORD_URL,
  VERIFY_EMAIL_URL,
} from '@/core/api/endpoints';

export const authAPI = {
  async login(body: { email: string; password: string }) {
    return await axiosClient.request({
      method: 'POST',
      url: LOGIN_URL,
      data: body,
    });
  },

  async refreshToken() {
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

  async resetPassword(body: { token: string; newPassword: string; confirmPassword: string }) {
    return await axiosClient.request({
      method: 'POST',
      url: RESET_PASSWORD_URL,
      data: body,
    });
  },

  async verifyEmail(token: string) {
    return await axiosClient.request({
      method: 'GET',
      url: VERIFY_EMAIL_URL,
      params: { token },
    });
  },

  async resendEmail(body: { email: string }) {
    return await axiosClient.request({
      method: 'POST',
      url: RESEND_EMAIL_URL,
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
