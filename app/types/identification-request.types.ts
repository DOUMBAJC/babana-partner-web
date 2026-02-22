import type { User, Customer } from './index';

export type IdentificationRequestStatus = 'pending' | 'approved' | 'rejected';

export interface IdentificationRequest {
  id: string;
  customer_id: string;
  ba_id: string;
  processor_id: string | null;
  status: IdentificationRequestStatus;
  submitted_at: string;
  processed_at: string | null;
  rejection_reason: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  // Relationships
  customer?: Customer;
  ba?: User;
  processor?: User;
}

export interface IdentificationRequestFilters {
  status?: IdentificationRequestStatus;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface IdentificationRequestStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}
