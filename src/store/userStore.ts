import { defineStore } from 'pinia';
import type { User } from '@/shared/types/user.type';
import type { CreateUserPayload } from '@/features/users/api';

const MOCK_USERS: User[] = [
  {
    id: 'user-001',
    role: 'ADMIN',
    email: 'admin@petclinic.vn',
    fullName: 'Admin PetVax',
    phoneNumber: '0900000000',
    avatarUrl: '',
    dob: '1995-01-01',
    isActive: true,
    isDeleted: false,
    lastLoginAt: '2026-07-15T09:30:00.000Z',
    createdAt: '2025-01-01T08:00:00.000Z',
    updatedAt: '2026-07-15T09:30:00.000Z',
    deletedAt: null,
  },
  {
    id: 'user-002',
    role: 'STAFF',
    email: 'staff@petclinic.vn',
    fullName: 'Nguyen Minh Anh',
    phoneNumber: '0912345678',
    avatarUrl: '',
    dob: '1997-04-12',
    isActive: true,
    isDeleted: false,
    lastLoginAt: '2026-07-14T10:15:00.000Z',
    createdAt: '2025-03-18T08:00:00.000Z',
    updatedAt: '2026-06-20T08:00:00.000Z',
    deletedAt: null,
  },
  {
    id: 'user-003',
    role: 'VET',
    email: 'vet@petclinic.vn',
    fullName: 'Tran Hoang Long',
    phoneNumber: '0923456789',
    avatarUrl: '',
    dob: '1990-09-18',
    isActive: true,
    isDeleted: false,
    lastLoginAt: '2026-07-15T14:45:00.000Z',
    createdAt: '2025-05-02T08:00:00.000Z',
    updatedAt: '2026-06-21T08:00:00.000Z',
    deletedAt: null,
  },
  {
    id: 'user-004',
    role: 'OWN',
    email: 'owner01@example.com',
    fullName: 'Le Bao Chau',
    phoneNumber: '0934567890',
    avatarUrl: '',
    dob: '1998-11-22',
    isActive: true,
    isDeleted: false,
    lastLoginAt: null,
    createdAt: '2026-01-12T08:00:00.000Z',
    updatedAt: '2026-05-01T08:00:00.000Z',
    deletedAt: null,
  },
  {
    id: 'user-005',
    role: 'OWN',
    email: 'owner02@example.com',
    fullName: 'Pham Thu Ha',
    phoneNumber: '0945678901',
    avatarUrl: '',
    dob: '1993-07-09',
    isActive: false,
    isDeleted: false,
    lastLoginAt: null,
    createdAt: '2026-02-22T08:00:00.000Z',
    updatedAt: '2026-04-15T08:00:00.000Z',
    deletedAt: null,
  },
  {
    id: 'user-006',
    role: 'STAFF',
    email: 'reception@petclinic.vn',
    fullName: 'Do Gia Huy',
    phoneNumber: '0956789012',
    avatarUrl: '',
    dob: '1999-02-01',
    isActive: true,
    isDeleted: false,
    lastLoginAt: '2026-07-13T11:00:00.000Z',
    createdAt: '2025-10-07T08:00:00.000Z',
    updatedAt: '2026-06-30T08:00:00.000Z',
    deletedAt: null,
  },
];

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

function getAvatarUrl(file?: File | null) {
  if (!file) return '';
  return URL.createObjectURL(file);
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
    applyUserList(data: User[], page?: number, limit?: number) {
      const normalizedPage = Math.max(1, page ?? this.listUser.page);
      const normalizedLimit = Math.max(1, limit ?? this.listUser.limit);
      const start = (normalizedPage - 1) * normalizedLimit;

      this.listUser.data = data.slice(start, start + normalizedLimit);
      this.listUser.total = data.length;
      this.listUser.page = normalizedPage;
      this.listUser.limit = normalizedLimit;
    },
    getFilteredMockUsers() {
      const search = this.filters.search?.trim().toLowerCase();
      const roleCode = this.filters.roleCode;
      const isActive = this.filters.isActive;

      return MOCK_USERS.filter(user => {
        const matchesSearch =
          !search ||
          [user.fullName, user.email, user.phoneNumber].some(value => value?.toLowerCase().includes(search));
        const matchesRole = !roleCode || user.role === roleCode;
        const matchesStatus = isActive === undefined || user.isActive === isActive;

        return !user.isDeleted && matchesSearch && matchesRole && matchesStatus;
      });
    },
    applyUserOverview() {
      const activeUsers = MOCK_USERS.filter(user => !user.isDeleted);

      this.overView = {
        users: activeUsers.length,
        staffs: activeUsers.filter(user => user.role === 'STAFF').length,
        vets: activeUsers.filter(user => user.role === 'VET').length,
        owners: activeUsers.filter(user => user.role === 'OWN').length,
      };
    },
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
        this.applyUserList(this.getFilteredMockUsers());
      } finally {
        this.loading = false;
      }
    },
    async fetchUserOverView() {
      this.applyUserOverview();
    },
    async getUser(id: string) {
      this.loading = true;
      try {
        this.user = MOCK_USERS.find(user => user.id === id && !user.isDeleted) || null;
      } finally {
        this.loading = false;
      }
    },
    async createUser(data: CreateUserPayload) {
      this.loading = true;
      try {
        const now = new Date().toISOString();
        const user: User = {
          id: `user-${Date.now()}`,
          role: data.roleCode || 'OWN',
          email: data.email || 'new-user@example.com',
          fullName: data.fullName || 'New User',
          phoneNumber: data.phoneNumber || '',
          avatarUrl: getAvatarUrl(data.avatar),
          dob: data.dob || '',
          isActive: true,
          isDeleted: false,
          lastLoginAt: null,
          createdAt: now,
          updatedAt: now,
          deletedAt: null,
        };

        MOCK_USERS.unshift(user);
        this.applyUserOverview();
        this.applyUserList(this.getFilteredMockUsers(), 1, this.listUser.limit);

        return {
          success: true,
          statusCode: 201,
          message: 'Mock user created',
          data: user,
        };
      } finally {
        this.loading = false;
      }
    },
    async updateUser(id: string, data: { fullName?: string; phoneNumber?: string; avatar: File | null; dob?: string }) {
      this.loading = true;
      try {
        const index = MOCK_USERS.findIndex(user => user.id === id);
        if (index === -1) {
          return {
            success: false,
            statusCode: 404,
            message: 'Mock user not found',
            data: undefined,
          };
        }

        const currentUser = MOCK_USERS[index];
        if (!currentUser) {
          return {
            success: false,
            statusCode: 404,
            message: 'Mock user not found',
            data: undefined,
          };
        }

        const updatedUser: User = {
          ...currentUser,
          fullName: data.fullName || currentUser.fullName,
          phoneNumber: data.phoneNumber || currentUser.phoneNumber,
          avatarUrl: data.avatar ? getAvatarUrl(data.avatar) : currentUser.avatarUrl,
          dob: data.dob || currentUser.dob,
          updatedAt: new Date().toISOString(),
        };

        MOCK_USERS[index] = updatedUser;
        if (this.user?.id === id) {
          this.user = updatedUser;
        }
        this.applyUserOverview();
        this.applyUserList(this.getFilteredMockUsers());

        return {
          success: true,
          statusCode: 200,
          message: 'Mock user updated',
          data: updatedUser,
        };
      } finally {
        this.loading = false;
      }
    },
    async deleteUser(id: string) {
      this.loading = true;
      try {
        const index = MOCK_USERS.findIndex(user => user.id === id);
        const currentUser = index === -1 ? undefined : MOCK_USERS[index];
        let deletedUser: User | undefined;

        if (index !== -1) {
          deletedUser = currentUser
            ? {
                ...currentUser,
                isDeleted: true,
                deletedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
            : undefined;
        }

        if (index !== -1 && deletedUser) {
          MOCK_USERS[index] = {
            ...deletedUser,
            isDeleted: true,
          };
        }

        this.applyUserOverview();
        this.applyUserList(this.getFilteredMockUsers());

        return {
          success: true,
          statusCode: 200,
          message: 'Mock user deleted',
          data: deletedUser,
        };
      } finally {
        this.loading = false;
      }
    },
  },
});
