import type { I_Response } from '@/core/api/api.type';

export const authAPI = {
  async login(body: { email: string; password: string }) {
    void body;
    return {
      success: true,
      statusCode: 200,
      message: 'Mock auth API disabled',
      data: {
        accessToken: 'mock-token',
        user: undefined,
      },
    };
  },

  async refreshToken(): Promise<I_Response<{ accessToken: string }>> {
    return {
      success: true,
      statusCode: 200,
      message: 'Mock refresh API disabled',
      data: { accessToken: 'mock-token' },
    };
  },

  async forgotPassword(body: { email: string }) {
    void body;
    return {
      success: true,
      statusCode: 200,
      message: 'Mock forgot password API disabled',
    };
  },

  async getCurrentUser() {
    return {
      success: true,
      statusCode: 200,
      message: 'Mock current user API disabled',
      data: undefined,
    };
  },

  async logout() {
    return {
      success: true,
      statusCode: 200,
      message: 'Mock logout API disabled',
    };
  },
};
