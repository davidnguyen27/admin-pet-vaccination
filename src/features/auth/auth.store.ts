import { defineStore } from 'pinia';
import type { User } from '../users';
import { authApi } from './auth.api';

interface AuthState {
  user: User | null;
  accessToken: string | null;
}

export const authStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    accessToken: null,
  }),

  getters: {
    isAuthenticated: state => !!state.accessToken,
    userRole: state => state.user?.roleCode ?? null,
  },

  actions: {
    setAccessToken(token: string | null) {
      if (!token) this.user = null;
      this.accessToken = token;
    },
    async login(payload: { email: string; password: string }) {
      const response = await authApi.login(payload);
      const token = response.data?.accessToken || response.data?.token;
      const user = response.data?.user;

      if (token) this.setAccessToken(token);
      if (user) this.user = user;

      return response;
    },
    async logout() {
      try {
        await authApi.logout();
      } finally {
        this.user = null;
        this.accessToken = null;
      }
    },
  },
});
