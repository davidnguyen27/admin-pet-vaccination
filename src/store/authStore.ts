import { defineStore } from 'pinia';
import type { User } from '@/shared/types/user.type';
import { authAPI } from '@/features/auth/api';

const ADMIN_INFO = 'admin';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: JSON.parse(localStorage.getItem(ADMIN_INFO)!),
    accessToken: null,
    isLoading: false,
  }),

  getters: {
    isAuthenticated: state => !!state.accessToken,
    userRole: state => state.user?.role ?? null,
  },

  actions: {
    setAccessToken(value: string | null) {
      this.accessToken = value;
    },

    setUser(user: User) {
      this.user = user;
      localStorage.setItem(ADMIN_INFO, JSON.stringify(user));
    },

    clearUser() {
      this.user = null;
      this.accessToken = null;
      localStorage.removeItem(ADMIN_INFO);
    },

    async login(payload: { email: string; password: string }) {
      this.isLoading = true;
      try {
        const response = await authAPI.login(payload);
        const { access_token, user } = response?.data || {};

        if (response.success && access_token && user) {
          this.setUser(user);
          this.setAccessToken(access_token);
        }
      } catch (error) {
        console.error('Login failed', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async restoreSession() {
      if (!this.user) {
        return false;
      }

      this.isLoading = true;
      try {
        const response = await authAPI.refreshToken();
        const { access_token } = response.data || {};

        if (response.success && access_token) {
          this.setAccessToken(access_token);
          return true;
        }
        this.clearUser();
        return false;
      } catch (error) {
        this.clearUser();
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    async logout() {
      this.isLoading = true;
      try {
        await authAPI.logout();
      } catch (error) {
        console.error('Logout failed', error);
      } finally {
        this.clearUser();
        this.isLoading = false;
      }
    },
  },
});
