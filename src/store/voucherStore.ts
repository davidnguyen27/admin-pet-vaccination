import { defineStore } from 'pinia';
import type { Voucher, VoucherFilters, VoucherOverview } from '@/shared/types/voucher.type';

const MOCK_VOUCHERS: Voucher[] = [
  {
    id: 'vouch-001',
    code: 'PETCARE20',
    title: 'Spring Vaccination Special',
    description: 'Get 20% discount on all core dog and cat vaccination packages.',
    discountType: 'PERCENTAGE',
    discountValue: 20,
    minOrderValue: 200000,
    maxDiscountAmount: 100000,
    category: 'VACCINATION',
    startDate: '2026-03-01',
    endDate: '2026-08-31',
    totalQuantity: 200,
    redeemedQuantity: 142,
    status: 'ACTIVE',
    createdAt: '2026-02-15T08:00:00.000Z',
    updatedAt: '2026-07-20T08:00:00.000Z',
  },
  {
    id: 'vouch-002',
    code: 'WELCOME50K',
    title: 'New Customer Welcome Voucher',
    description: 'Flat 50,000 VND discount for new pet owners registering for medical checkup.',
    discountType: 'FIXED_AMOUNT',
    discountValue: 50000,
    minOrderValue: 150000,
    category: 'ALL',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    totalQuantity: 500,
    redeemedQuantity: 380,
    status: 'ACTIVE',
    createdAt: '2026-01-01T08:00:00.000Z',
    updatedAt: '2026-07-15T08:00:00.000Z',
  },
  {
    id: 'vouch-003',
    code: 'GROOMVIP15',
    title: 'Full Spa & Grooming Pass',
    description: '15% off full body grooming and spa bath treatment for dogs and cats.',
    discountType: 'PERCENTAGE',
    discountValue: 15,
    minOrderValue: 300000,
    maxDiscountAmount: 80000,
    category: 'GROOMING',
    startDate: '2026-06-01',
    endDate: '2026-09-30',
    totalQuantity: 150,
    redeemedQuantity: 98,
    status: 'ACTIVE',
    createdAt: '2026-05-20T08:00:00.000Z',
    updatedAt: '2026-07-10T08:00:00.000Z',
  },
  {
    id: 'vouch-004',
    code: 'RABIESFREE',
    title: 'Free Rabies Booster Campaign',
    description: 'Special community rabies immunization campaign voucher code.',
    discountType: 'PERCENTAGE',
    discountValue: 100,
    minOrderValue: 0,
    maxDiscountAmount: 120000,
    category: 'VACCINATION',
    startDate: '2026-04-01',
    endDate: '2026-06-30',
    totalQuantity: 100,
    redeemedQuantity: 100,
    status: 'FULLY_REDEEMED',
    createdAt: '2026-03-25T08:00:00.000Z',
    updatedAt: '2026-06-30T08:00:00.000Z',
  },
  {
    id: 'vouch-005',
    code: 'SUMMERHEALTH',
    title: 'Summer General Checkup Offer',
    description: 'Get 30,000 VND off on health certificate and general checkups.',
    discountType: 'FIXED_AMOUNT',
    discountValue: 30000,
    minOrderValue: 100000,
    category: 'PET_CARE',
    startDate: '2026-08-01',
    endDate: '2026-10-31',
    totalQuantity: 300,
    redeemedQuantity: 0,
    status: 'SCHEDULED',
    createdAt: '2026-07-01T08:00:00.000Z',
    updatedAt: '2026-07-01T08:00:00.000Z',
  },
  {
    id: 'vouch-006',
    code: 'SURGERY10',
    title: 'Neutering & Surgery Special',
    description: '10% discount on scheduled pet sterilization and minor surgical procedures.',
    discountType: 'PERCENTAGE',
    discountValue: 10,
    minOrderValue: 500000,
    maxDiscountAmount: 200000,
    category: 'SURGERY',
    startDate: '2025-11-01',
    endDate: '2026-03-31',
    totalQuantity: 80,
    redeemedQuantity: 80,
    status: 'EXPIRED',
    createdAt: '2025-10-15T08:00:00.000Z',
    updatedAt: '2026-03-31T08:00:00.000Z',
  },
];

export const useVoucherStore = defineStore('voucher', {
  state: () => ({
    listVoucher: {
      data: MOCK_VOUCHERS as Voucher[],
      total: MOCK_VOUCHERS.length,
      page: 1,
      limit: 10,
    },
    overview: {
      totalActive: 3,
      totalRedeemed: 620,
      totalDiscountIssued: 4500000,
      expiringSoon: 1,
    } as VoucherOverview,
    filters: {
      search: '',
      status: undefined,
      discountType: undefined,
      category: undefined,
    } as VoucherFilters,
    loading: false,
    detailVoucher: null as Voucher | null,
  }),

  actions: {
    async fetchVoucherList() {
      this.loading = true;
      try {
        this.applyMockFilters();
      } finally {
        this.loading = false;
      }
    },

    applyMockFilters() {
      let filtered = [...MOCK_VOUCHERS];

      if (this.filters.search) {
        const query = this.filters.search.toLowerCase();
        filtered = filtered.filter(
          v =>
            v.code.toLowerCase().includes(query) ||
            v.title.toLowerCase().includes(query) ||
            v.description?.toLowerCase().includes(query),
        );
      }

      if (this.filters.status) {
        filtered = filtered.filter(v => v.status === this.filters.status);
      }

      if (this.filters.discountType) {
        filtered = filtered.filter(v => v.discountType === this.filters.discountType);
      }

      if (this.filters.category && this.filters.category !== 'ALL') {
        filtered = filtered.filter(v => v.category === this.filters.category || v.category === 'ALL');
      }

      this.listVoucher.data = filtered;
      this.listVoucher.total = filtered.length;
    },

    async fetchVoucherOverview() {
      // Mock overview is initialized in state
    },

    setFilters(filters: Partial<VoucherFilters>) {
      this.filters = { ...this.filters, ...filters };
      this.listVoucher.page = 1;
    },

    resetFilters() {
      this.filters = {
        search: '',
        status: undefined,
        discountType: undefined,
        category: undefined,
      };
      this.listVoucher.page = 1;
    },

    setPagination(page: number, limit?: number) {
      this.listVoucher.page = page;
      if (limit) this.listVoucher.limit = limit;
    },

    async createVoucher(data: Partial<Voucher>) {
      this.loading = true;
      try {
        const newVoucher: Voucher = {
          id: `vouch-${Date.now()}`,
          code: data.code || 'VOUCHER2026',
          title: data.title || 'Special Promotion',
          description: data.description || '',
          discountType: data.discountType || 'PERCENTAGE',
          discountValue: data.discountValue || 10,
          minOrderValue: data.minOrderValue || 0,
          maxDiscountAmount: data.maxDiscountAmount || 0,
          category: data.category || 'ALL',
          startDate: data.startDate || '2026-07-01',
          endDate: data.endDate || '2026-12-31',
          totalQuantity: data.totalQuantity || 100,
          redeemedQuantity: 0,
          status: data.status || 'ACTIVE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        MOCK_VOUCHERS.unshift(newVoucher);
        this.fetchVoucherList();
        return newVoucher;
      } finally {
        this.loading = false;
      }
    },

    async updateVoucher(id: string, data: Partial<Voucher>) {
      this.loading = true;
      try {
        const idx = MOCK_VOUCHERS.findIndex(v => v.id === id);
        if (idx !== -1 && MOCK_VOUCHERS[idx]) {
          const current = MOCK_VOUCHERS[idx];
          MOCK_VOUCHERS[idx] = {
            id: current.id,
            code: data.code ?? current.code,
            title: data.title ?? current.title,
            description: data.description ?? current.description,
            discountType: data.discountType ?? current.discountType,
            discountValue: data.discountValue ?? current.discountValue,
            minOrderValue: data.minOrderValue ?? current.minOrderValue,
            maxDiscountAmount: data.maxDiscountAmount ?? current.maxDiscountAmount,
            category: data.category ?? current.category,
            startDate: data.startDate ?? current.startDate,
            endDate: data.endDate ?? current.endDate,
            totalQuantity: data.totalQuantity ?? current.totalQuantity,
            redeemedQuantity: data.redeemedQuantity ?? current.redeemedQuantity,
            status: data.status ?? current.status,
            createdAt: current.createdAt,
            updatedAt: new Date().toISOString(),
          };
        }
        this.fetchVoucherList();
      } finally {
        this.loading = false;
      }
    },

    async deleteVoucher(id: string) {
      this.loading = true;
      try {
        const idx = MOCK_VOUCHERS.findIndex(v => v.id === id);
        if (idx !== -1) {
          MOCK_VOUCHERS.splice(idx, 1);
        }
        this.fetchVoucherList();
      } finally {
        this.loading = false;
      }
    },
  },
});
