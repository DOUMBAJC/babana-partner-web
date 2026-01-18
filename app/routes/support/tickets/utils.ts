import type { SupportTicket } from "~/lib/services/support.service";

/**
 * Extrait les métadonnées de pagination d'une réponse API
 */
export function extractPaginationMeta(payload: any): {
  currentPage: number;
  perPage: number;
  total: number;
  totalPages: number;
} {
  const meta = payload?.meta ?? payload?.data?.meta ?? payload?.pagination ?? payload?.data?.pagination ?? {};
  
  const currentPage = Number(meta?.current_page ?? meta?.currentPage ?? meta?.page ?? 1);
  const perPage = Number(meta?.per_page ?? meta?.perPage ?? meta?.limit ?? meta?.pageSize ?? 15);
  const total = Number(meta?.total ?? meta?.totalItems ?? meta?.count ?? 0);
  const totalPages = Number(meta?.last_page ?? meta?.lastPage ?? meta?.totalPages ?? Math.ceil(total / perPage));
  
  return {
    currentPage: Number.isFinite(currentPage) && currentPage > 0 ? currentPage : 1,
    perPage: Number.isFinite(perPage) && perPage > 0 ? perPage : 15,
    total: Number.isFinite(total) && total >= 0 ? total : 0,
    totalPages: Number.isFinite(totalPages) && totalPages >= 0 ? totalPages : 0,
  };
}

/**
 * Extrait les tickets d'une réponse API
 */
export function unwrapTickets(payload: any): SupportTicket[] {
  if (!payload) return [];
  const root = payload.data ?? payload;
  if (Array.isArray(root)) return root as SupportTicket[];
  if (Array.isArray(root?.data)) return root.data as SupportTicket[];
  return [];
}

