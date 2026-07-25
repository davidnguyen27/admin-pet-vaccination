export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT';

export type VoucherStatus = 'ACTIVE' | 'SCHEDULED' | 'EXPIRED' | 'FULLY_REDEEMED';

export type VoucherCategory = 'ALL' | 'VACCINATION' | 'GROOMING' | 'SURGERY' | 'PET_CARE';

export interface Voucher {
  id: string;
  code: string;
  title: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number; // e.g. 20 for 20% or 50000 for 50,000 VND
  minOrderValue?: number;
  maxDiscountAmount?: number;
  category: VoucherCategory;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  totalQuantity: number;
  redeemedQuantity: number;
  status: VoucherStatus;
  createdAt: string;
  updatedAt: string;
}

export interface VoucherFilters {
  search?: string;
  status?: VoucherStatus;
  discountType?: DiscountType;
  category?: VoucherCategory;
}

export interface VoucherOverview {
  totalActive: number;
  totalRedeemed: number;
  totalDiscountIssued: number;
  expiringSoon: number;
}
