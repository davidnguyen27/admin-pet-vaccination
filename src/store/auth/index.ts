import { defineStore } from 'pinia';
import type { User } from '@/types/user';
import { authApi } from '@/features/auth/api';

interface AuthState {
  user: User | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
  }),

  getters: {
    isAuthenticated: state => !!state.user,
    userRole: state => state.user?.roleCode ?? null,
  },

  actions: {
    async login() {},
    async register() {},
    async logout() {
      await authApi.logout();
      this.user = null;
    },
  },
});
