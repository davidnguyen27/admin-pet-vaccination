import { defineStore } from 'pinia';
import { authAPI } from '@/features/auth/api';
import type { User } from '@/shared/types/user.type';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    accessToken: null,
    isLoading: false,
  }),

  getters: {
    isAuthenticated: state => !!state.accessToken,
    userRole: state => state.user?.role ?? null,
  },

  actions: {
    setAccessToken(value: string | null) {
      if (!value) this.user = null;
      this.accessToken = value;
    },

    async login(payload: { email: string; password: string }) {
      this.isLoading = true;
      try {
        const response = await authAPI.login(payload);
        const token = response.data?.accessToken;
        const user = response.data?.user;

        if (token) this.setAccessToken(token);
        if (user) this.user = user;
      } catch (error: any) {
        throw error?.message;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchCurrentUser() {
      this.isLoading = true;
      try {
        const response = await authAPI.getCurrentUser();
        const user = response.data?.user || response.data;
        if (user) {
          this.user = user;
        }
        return response;
      } catch (error) {
        console.error('Error fetching current user:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async logout() {
      this.isLoading = true;
      try {
        await authAPI.logout();
      } finally {
        this.user = null;
        this.accessToken = null;
        this.isLoading = false;
      }
    },
  },
});
