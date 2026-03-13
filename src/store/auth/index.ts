import { defineStore } from 'pinia';
import type { User } from '@/types/user';
import { authApi } from '@/features/auth/api';

interface AuthState {
  user: User | null;
  token: string | null;
}

export const authStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
  }),

  getters: {
    isAuthenticated: state => !!state.user || !!state.token,
    userRole: state => state.user?.roleCode ?? null,
  },

  actions: {
    async login(payload: { email: string; password: string }) {
      const response = await authApi.login(payload);
      const token = response.data?.accessToken || response.data?.token;
      const user = response.data?.user;

      if (token) {
        this.token = token;
        document.cookie = `accessToken=${token}; path=/; max-age=86400`;
      }

      if (user) {
        this.user = user;
      }

      return response;
    },
    async refreshToken() {
      const response = await authApi.refreshToken();
      const token = response.data?.accessToken || response.data?.token;
      const user = response.data?.user;

      if (token) {
        this.token = token;
        document.cookie = `accessToken=${token}; path=/; max-age=86400`;
      }

      if (user) {
        this.user = user;
      }

      return response;
    },
    async logout() {
      await authApi.logout();
      this.user = null;
      this.token = null;
      document.cookie = 'accessToken=; path=/; max-age=0';
    },
  },
});
