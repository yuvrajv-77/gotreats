export type VoucherScope = 'all'  | 'specific';
export type VoucherDiscountType = 'percentage' | 'fixed';
export type VoucherStatus = 'active' | 'inactive' | 'expired';

export interface Voucher {
  id?: string;
  name: string;
  status: VoucherStatus;
  code: string;
  discountType: VoucherDiscountType;
  discountValue: number;
  minOrderValue?: number;
  maxUses: number;
  currentUses?: number;
  scope: VoucherScope;
  singleUsePerCustomer?: boolean; // If true, each user can use the voucher only once
  allowedUsers?: string[]; // Phone numbers, e.g., ['+919999999999']
  userUsage?: {
    [userId: string]: number; // userId -> usage count
  };
  startDate?: Date;
  expiryDate?: Date;
  createdAt: Date;
  
}