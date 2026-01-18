import { type AxiosInstance } from 'axios';
import { api, type ApiError } from './axios';
import type { ApiResponse, PaginatedResponse, QueryParams } from '~/types';

export type SupportPriority = 'low' | 'normal' | 'high' | 'urgent';
export type SupportStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface SupportTicketData {
  full_name: string;
  email: string;
  subject: string;
  message: string;
  priority: SupportPriority;
}

export interface SupportTicketMessage {
  id: string;
  ticket_id: string;
  user_id?: string;
  message: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface SupportTicket {
  id: string;
  user_id?: string;
  full_name: string;
  email: string;
  subject: string;
  message: string;
  priority: SupportPriority;
  status: SupportStatus;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  assigned_agent?: {
    id: string;
    name: string;
    email: string;
  };
  messages?: SupportTicketMessage[];
}

export interface SupportTicketFilters {
  status?: SupportStatus;
  priority?: SupportPriority;
  assigned_to?: string;
  search?: string;
  per_page?: number;
}

export interface SupportTicketStatistics {
  total: number;
  open: number;
  in_progress: number;
  resolved: number;
  closed: number;
  by_priority: {
    low: number;
    normal: number;
    high: number;
    urgent: number;
  };
}

export interface UpdateSupportTicketData {
  status?: SupportStatus;
  priority?: SupportPriority;
  assigned_to?: string;
}

export interface ReplySupportTicketData {
  message: string;
  is_public?: boolean;
  is_internal?: boolean;
}

/**
 * Service de gestion du support
 * Permet de créer et gérer les tickets de support
 */
export const supportService = {
  /**
   * Créer un nouveau ticket de support (accessible à tous, même non authentifiés)
   * Accepte SupportTicketData (JSON) ou FormData (avec fichiers)
   */
  createTicket: async (
    data: SupportTicketData | FormData,
    axiosInstance?: AxiosInstance
  ): Promise<SupportTicket> => {
    try {
      const client = axiosInstance || api;
      
      const response = await (client as any).post('/support/tickets', data, {
        timeout: 60000, // Timeout de 60 secondes pour les uploads de fichiers
      });
      const responseData = response.data as ApiResponse<SupportTicket> | SupportTicket;
      return (responseData as ApiResponse<SupportTicket>).data || (responseData as SupportTicket);
    } catch (error) {
      console.error('[Support Service] Error creating ticket:', error);
      throw error as ApiError;
    }
  },

  /**
   * Récupérer la liste des tickets de support (paginée)
   * - Utilisateur authentifié : voit uniquement ses tickets
   * - Admin : voit tous les tickets
   */
  getTickets: async (
    filters?: SupportTicketFilters,
    params?: QueryParams,
    axiosInstance?: AxiosInstance
  ): Promise<PaginatedResponse<SupportTicket> | { data: SupportTicket[]; filters?: any }> => {
    try {
      const client = axiosInstance || api;
      const response = await (client as any).get('/support/tickets', {
        params: {
          ...filters,
          ...params,
        },
      });
      return response.data as PaginatedResponse<SupportTicket> | { data: SupportTicket[]; filters?: any };
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Récupérer un ticket par son ID
   */
  getTicket: async (
    id: string,
    axiosInstance?: AxiosInstance
  ): Promise<SupportTicket> => {
    try {
      const client = axiosInstance || api;
      const response = await (client as any).get(`/support/tickets/${id}`);
      const responseData = response.data as ApiResponse<SupportTicket> | SupportTicket;
      return (responseData as ApiResponse<SupportTicket>).data || (responseData as SupportTicket);
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Mettre à jour un ticket (statut, priorité, assignation) - Admin uniquement
   */
  updateTicket: async (
    id: string,
    data: UpdateSupportTicketData,
    axiosInstance?: AxiosInstance
  ): Promise<SupportTicket> => {
    try {
      const client = axiosInstance || api;
      const response = await (client as any).put(`/support/tickets/${id}`, data);
      const responseData = response.data as ApiResponse<SupportTicket> | SupportTicket;
      return (responseData as ApiResponse<SupportTicket>).data || (responseData as SupportTicket);
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Répondre à un ticket - Admin uniquement
   * Accepte ReplySupportTicketData (JSON) ou FormData (avec fichiers)
   */
  replyToTicket: async (
    id: string,
    data: ReplySupportTicketData | FormData,
    axiosInstance?: AxiosInstance
  ): Promise<{ ticket: SupportTicket; message: SupportTicketMessage }> => {
    try {
      const client = axiosInstance || api;
      // Ne pas définir Content-Type manuellement pour FormData - axios le fait automatiquement
      const response = await (client as any).post(`/support/tickets/${id}/reply`, data, {
        timeout: 60000, // Timeout de 60 secondes pour les uploads de fichiers
      });
      const responseData = response.data as ApiResponse<{ ticket: SupportTicket; message: SupportTicketMessage }> | { ticket: SupportTicket; message: SupportTicketMessage };
      return (responseData as ApiResponse<{ ticket: SupportTicket; message: SupportTicketMessage }>).data || (responseData as { ticket: SupportTicket; message: SupportTicketMessage });
    } catch (error) {
      console.error('[Support Service] Error replying to ticket:', error);
      throw error as ApiError;
    }
  },

  /**
   * Obtenir les statistiques des tickets
   */
  getStatistics: async (
    axiosInstance?: AxiosInstance
  ): Promise<SupportTicketStatistics> => {
    try {
      const client = axiosInstance || api;
      const response = await (client as any).get('/support/tickets/statistics');
      const responseData = response.data as ApiResponse<SupportTicketStatistics> | SupportTicketStatistics;
      return (responseData as ApiResponse<SupportTicketStatistics>).data || (responseData as SupportTicketStatistics);
    } catch (error) {
      throw error as ApiError;
    }
  },
};

