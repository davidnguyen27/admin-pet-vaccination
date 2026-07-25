import { defineStore } from 'pinia';
import type { User } from '@/shared/types/user.type';

const MOCK_AUTH_USER: User = {
  id: 'mock-admin',
  role: 'ADMIN',
  email: 'admin@petclinic.vn',
  fullName: 'Admin PetVax',
  phoneNumber: '0900000000',
  avatarUrl: '',
  dob: '1995-01-01',
  isActive: true,
  isDeleted: false,
  lastLoginAt: new Date().toISOString(),
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: new Date().toISOString(),
  deletedAt: null,
};

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
        this.setAccessToken(`mock-token-${Date.now()}`);
        this.user = {
          ...MOCK_AUTH_USER,
          email: payload.email || MOCK_AUTH_USER.email,
          lastLoginAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      } finally {
        this.isLoading = false;
      }
    },

    async fetchCurrentUser() {
      this.isLoading = true;
      try {
        if (!this.user) {
          this.user = MOCK_AUTH_USER;
        }
        return {
          success: true,
          statusCode: 200,
          message: 'Mock current user loaded',
          data: this.user,
        };
      } finally {
        this.isLoading = false;
      }
    },

    async logout() {
      this.isLoading = true;
      this.user = null;
      this.accessToken = null;
      this.isLoading = false;
    },
  },
});
