import { userApi, type UserBody } from './user.api';
import type { IPaginatedResponse, IResponse } from '@/interfaces/i-response';
import { defineStore } from 'pinia';
import type { User } from './user.type';

interface UserParams {
  page: number;
  limit: number;
  search?: string;
  roleCode?: string;
  isActive?: boolean;
}

export const userStore = defineStore('users', {
  state: () => ({
    users: [] as User[],
    meta: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    },
  }),

  actions: {
    async fetchUsers(params: UserParams) {
      try {
        const response = (await userApi.getAllUsers({
          page: params.page,
          limit: params.limit,
          search: params.search || '',
          roleCode: params.roleCode === 'ALL' ? undefined : params.roleCode,
          isActive: params.isActive,
        })) as unknown as IPaginatedResponse<User>;

        if (response.success) {
          this.users = response.data || [];
          if (response.meta) {
            this.meta = response.meta;
          }
        }
        return response;
      } catch (error) {
        console.error('Failed to fetch users:', error);
        throw error;
      }
    },

    async createUser(body: UserBody) {
      try {
        const response = (await userApi.createUser(body)) as unknown as IResponse<User>;
        if (response.success) {
          await this.fetchUsers({
            page: this.meta.page,
            limit: this.meta.limit,
          });
        }
        return response;
      } catch (error) {
        console.error('Failed to create user:', error);
        throw error;
      }
    },

    async updateUser(userId: string, body: UserBody) {
      try {
        const response = (await userApi.updateUser(userId, body)) as unknown as IResponse<User>;
        if (response.success) {
          await this.fetchUsers({
            page: this.meta.page,
            limit: this.meta.limit,
          });
        }
        return response;
      } catch (error) {
        console.error('Failed to update user:', error);
        throw error;
      }
    },

    async deleteUser(userId: string) {
      try {
        const response = (await userApi.deleteUser(userId)) as unknown as IResponse<User>;
        if (response.success) {
          await this.fetchUsers({
            page: this.meta.page,
            limit: this.meta.limit,
          });
        }
        return response;
      } catch (error) {
        console.error('Failed to delete user:', error);
        throw error;
      }
    },
  },
});
