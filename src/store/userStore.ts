import { defineStore } from 'pinia';
import { userAPI, type UserParams, type CreateUserPayload } from '../features/users/api';
import type { User } from '@/shared/types/user.type';

interface UserState {
  loading: boolean;
  user: User | null;
  listUser: {
    data: User[];
    total: number;
    page: number;
    limit: number;
  };
  filters: {
    search?: string;
    roleCode?: string;
    isActive?: boolean;
  };
  overView: {
    users: number;
    staffs: number;
    vets: number;
    owners: number;
  };
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    loading: false,
    user: null,
    listUser: {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
    },
    filters: {
      search: '',
      roleCode: undefined,
      isActive: undefined,
    },
    overView: {
      users: 0,
      staffs: 0,
      vets: 0,
      owners: 0,
    },
  }),

  actions: {
    setFilters(filters: Partial<UserState['filters']>) {
      this.filters = { ...this.filters, ...filters };
      this.listUser.page = 1;
    },
    setPagination(page: number, limit: number) {
      this.listUser.page = page;
      this.listUser.limit = limit;
    },
    resetFilters() {
      this.filters = {
        search: '',
        roleCode: undefined,
        isActive: undefined,
      };
      this.listUser.page = 1;
    },
    async fetchUserList() {
      this.loading = true;
      try {
        const params: UserParams = {
          page: this.listUser.page,
          limit: this.listUser.limit,
        };
        if (this.filters.search) params.search = this.filters.search;
        if (this.filters.roleCode) params.roleCode = this.filters.roleCode;
        if (this.filters.isActive !== undefined) params.isActive = this.filters.isActive;

        const response = await userAPI.fetchListUser(params);
        if (response.success) {
          this.listUser.data = response.data || [];
          this.listUser.page = response.meta?.page || 1;
          this.listUser.limit = response.meta?.limit || 10;
          this.listUser.total = response.meta?.total || 0;
        }
      } catch (error) {
        console.error('Failed to fetch user list:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchUserOverView() {
      const getTotal = async (roleCode?: string) => {
        const response = await userAPI.fetchListUser({
          page: 1,
          limit: 1,
          roleCode,
        });
        return response.meta?.total || 0;
      };
      const [users, staffs, vets, owners] = await Promise.all([
        getTotal(),
        getTotal('STAFF'),
        getTotal('VET'),
        getTotal('OWN'),
      ]);

      this.overView = {
        users,
        staffs,
        vets,
        owners,
      };
    },

    async getUser(id: string) {
      this.loading = true;
      try {
        const response = await userAPI.getUser(id);
        if (response.success) {
          this.user = response.data || null;
        }
      } catch (error) {
        console.error('Failed to get user: ', error);
      } finally {
        this.loading = false;
      }
    },

    async createUser(data: CreateUserPayload) {
      this.loading = true;
      try {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            formData.append(key, value as Blob | string);
          }
        });

        const response = await userAPI.createUser(formData);
        if (response.success) {
          if (this.user) {
            this.user = { ...this.user, ...response.data };
          }
        }
        return response;
      } catch (error) {
        console.error('Failed to create user: ', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateUser(id: string, data: { fullName?: string; phoneNumber?: string; avatar: File | null; dob?: string }) {
      this.loading = true;
      try {
        const formData = new FormData();
        if (data.fullName) formData.append('fullName', data.fullName);
        if (data.phoneNumber) formData.append('phoneNumber', data.phoneNumber);
        if (data.avatar) formData.append('avatar', data.avatar);
        if (data.dob) formData.append('dob', data.dob);

        const response = await userAPI.updateUser(id, formData);
        if (response.success) {
          if (this.user && this.user.id === id) {
            this.user = { ...this.user, ...response.data };
          }
        }
        return response;
      } catch (error) {
        console.error('Failed to update user:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteUser(id: string) {
      this.loading = true;
      try {
        const response = await userAPI.deleteUser(id);
        if (response.success) {
          this.listUser.data = this.listUser.data.filter(user => user.id !== id);
          this.listUser.total--;
        }
        return response;
      } catch (error) {
        console.error('Failed to delete a user: ', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
