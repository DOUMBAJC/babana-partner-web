import { api, type ApiError } from './axios';
import type {
  ActivationRequest,
  CreateActivationRequestData,
  UpdateActivationRequestData,
  ProcessActivationRequestData,
  ActivationRequestFilters,
  ActivationRequestStats,
  ActivationHistory,
  PaginatedResponse,
  ApiResponse,
  QueryParams,
} from '~/types';

/**
 * Service de gestion des requêtes d'activation de SIM
 * Gère les demandes d'activation entre BA et Activateurs
 */
export const activationRequestService = {
  /**
   * Récupérer la liste des requêtes d'activation (paginée)
   */
  getActivationRequests: async (
    filters?: ActivationRequestFilters,
    params?: QueryParams
  ): Promise<PaginatedResponse<ActivationRequest>> => {
    try {
      return await api.get<PaginatedResponse<ActivationRequest>>(
        '/activation-requests',
        {
          params: {
            ...filters,
            ...params,
          },
        }
      );
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Récupérer une requête d'activation par son ID
   */
  getActivationRequestById: async (
    id: number,
    include?: string[]
  ): Promise<ActivationRequest> => {
    try {
      const response = await api.get<ApiResponse<ActivationRequest>>(
        `/activation-requests/${id}`,
        {
          params: {
            include: include?.join(','),
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Créer une nouvelle requête d'activation (BA)
   */
  createActivationRequest: async (
    data: CreateActivationRequestData
  ): Promise<ActivationRequest> => {
    try {
      const response = await api.post<ApiResponse<ActivationRequest>>(
        '/activation-requests',
        data
      );
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Modifier une requête d'activation (BA)
   * Seulement pour les requêtes en attente ou rejetées
   */
  updateActivationRequest: async (
    id: number,
    data: UpdateActivationRequestData
  ): Promise<ActivationRequest> => {
    try {
      const response = await api.put<ApiResponse<ActivationRequest>>(
        `/activation-requests/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Annuler une requête d'activation (BA)
   * Seulement pour les requêtes en attente
   */
  cancelActivationRequest: async (id: number): Promise<ActivationRequest> => {
    try {
      const response = await api.post<ApiResponse<ActivationRequest>>(
        `/activation-requests/${id}/cancel`
      );
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Traiter une requête d'activation (Activateur)
   */
  processActivationRequest: async (
    id: number,
    data: ProcessActivationRequestData
  ): Promise<ActivationRequest> => {
    try {
      const response = await api.post<ApiResponse<ActivationRequest>>(
        `/activation-requests/${id}/process`,
        data
      );
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Accepter une requête d'activation (Activateur)
   */
  acceptActivationRequest: async (
    id: number,
    adminNotes?: string
  ): Promise<ActivationRequest> => {
    try {
      const response = await api.post<ApiResponse<ActivationRequest>>(
        `/activation-requests/${id}/accept`,
        { adminNotes }
      );
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Rejeter une requête d'activation (Activateur)
   */
  rejectActivationRequest: async (
    id: number,
    rejectionReason: string,
    adminNotes?: string
  ): Promise<ActivationRequest> => {
    try {
      const response = await api.post<ApiResponse<ActivationRequest>>(
        `/activation-requests/${id}/reject`,
        {
          rejectionReason,
          adminNotes,
        }
      );
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Récupérer les requêtes d'un BA spécifique
   */
  getActivationRequestsByBa: async (
    baId: number,
    filters?: ActivationRequestFilters,
    params?: QueryParams
  ): Promise<PaginatedResponse<ActivationRequest>> => {
    try {
      return await api.get<PaginatedResponse<ActivationRequest>>(
        `/users/${baId}/activation-requests`,
        {
          params: {
            ...filters,
            ...params,
          },
        }
      );
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Récupérer les requêtes traitées par un activateur spécifique
   */
  getActivationRequestsByProcessor: async (
    processorId: number,
    filters?: ActivationRequestFilters,
    params?: QueryParams
  ): Promise<PaginatedResponse<ActivationRequest>> => {
    try {
      return await api.get<PaginatedResponse<ActivationRequest>>(
        `/users/${processorId}/processed-requests`,
        {
          params: {
            ...filters,
            ...params,
          },
        }
      );
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Récupérer les requêtes d'un client spécifique
   */
  getActivationRequestsByCustomer: async (
    customerId: number,
    params?: QueryParams
  ): Promise<PaginatedResponse<ActivationRequest>> => {
    try {
      return await api.get<PaginatedResponse<ActivationRequest>>(
        `/customers/${customerId}/activation-requests`,
        {
          params,
        }
      );
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Récupérer l'historique d'une requête
   */
  getActivationRequestHistory: async (
    id: number
  ): Promise<ActivationHistory[]> => {
    try {
      const response = await api.get<ApiResponse<ActivationHistory[]>>(
        `/activation-requests/${id}/history`
      );
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Récupérer les statistiques des requêtes d'activation
   */
  getActivationRequestStats: async (
    filters?: Partial<ActivationRequestFilters>
  ): Promise<ActivationRequestStats> => {
    try {
      const response = await api.get<ApiResponse<ActivationRequestStats>>(
        '/activation-requests/stats',
        {
          params: filters,
        }
      );
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Rechercher par numéro de SIM
   */
  searchBySimNumber: async (simNumber: string): Promise<ActivationRequest[]> => {
    try {
      const response = await api.get<ApiResponse<ActivationRequest[]>>(
        '/activation-requests/search/sim',
        {
          params: { simNumber },
        }
      );
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Rechercher par ICCID
   */
  searchByIccid: async (iccid: string): Promise<ActivationRequest[]> => {
    try {
      const response = await api.get<ApiResponse<ActivationRequest[]>>(
        '/activation-requests/search/iccid',
        {
          params: { iccid },
        }
      );
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Exporter les requêtes d'activation
   */
  exportActivationRequests: async (
    filters?: ActivationRequestFilters,
    format: 'csv' | 'excel' | 'pdf' = 'csv'
  ): Promise<Blob> => {
    try {
      const response = await api.get('/activation-requests/export', {
        params: {
          ...filters,
          format,
        },
        responseType: 'blob',
      });
      return response as unknown as Blob;
    } catch (error) {
      throw error as ApiError;
    }
  },
};

/**
 * Exemple d'utilisation dans un composant :
 *
 * ```tsx
 * import { activationRequestService } from '~/lib/activation-request.service';
 * import { useState, useEffect } from 'react';
 *
 * // Récupérer les requêtes en attente
 * function PendingRequests() {
 *   const [requests, setRequests] = useState([]);
 *
 *   useEffect(() => {
 *     const fetchRequests = async () => {
 *       try {
 *         const response = await activationRequestService.getActivationRequests(
 *           { status: 'pending' },
 *           { page: 1, perPage: 10, sortBy: 'submittedAt', sortOrder: 'desc' }
 *         );
 *         setRequests(response.data);
 *       } catch (error) {
 *         console.error('Erreur:', error.message);
 *       }
 *     };
 *
 *     fetchRequests();
 *   }, []);
 *
 *   return <div>...</div>;
 * }
 *
 * // Créer une requête (BA)
 * const newRequest = await activationRequestService.createActivationRequest({
 *   customerId: 1,
 *   simNumber: '237612345678',
 *   iccid: '89237010000000000001',
 *   imei: '123456789012345',
 *   baNotes: 'Nouveau client',
 * });
 *
 * // Accepter une requête (Activateur)
 * await activationRequestService.acceptActivationRequest(
 *   requestId,
 *   'Vérification effectuée avec succès'
 * );
 *
 * // Rejeter une requête (Activateur)
 * await activationRequestService.rejectActivationRequest(
 *   requestId,
 *   'CNI non valide',
 *   'Document expiré'
 * );
 * ```
 */

