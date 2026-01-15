import { useState, useEffect, useCallback } from 'react';
import { activationRequestService, type ApiError } from '~/lib';
import type {
  ActivationRequest,
  CreateActivationRequestData,
  UpdateActivationRequestData,
  ProcessActivationRequestData,
  ActivationRequestFilters,
  ActivationRequestStats,
  ActivationHistory,
  QueryParams,
} from '~/types';

/**
 * Hook pour gérer les requêtes d'activation
 */
export function useActivationRequests(
  initialFilters?: ActivationRequestFilters,
  initialParams?: QueryParams
) {
  const [requests, setRequests] = useState<ActivationRequest[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ActivationRequestFilters | undefined>(
    initialFilters
  );
  const [params, setParams] = useState<QueryParams | undefined>(initialParams);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await activationRequestService.getActivationRequests(
        filters,
        params
      );
      setRequests(response.data);
      setPagination(response.meta);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }, [filters, params]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const refresh = () => {
    fetchRequests();
  };

  return {
    requests,
    pagination,
    loading,
    error,
    filters,
    setFilters,
    params,
    setParams,
    refresh,
  };
}

/**
 * Hook pour gérer une requête d'activation spécifique
 */
export function useActivationRequest(id?: string, include?: string[]) {
  const [request, setRequest] = useState<ActivationRequest | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);

  const fetchRequest = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await activationRequestService.getActivationRequestById(
        id,
        include
      );
      setRequest(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }, [id, include]);

  useEffect(() => {
    if (id) {
      fetchRequest();
    }
  }, [fetchRequest, id]);

  const refresh = () => {
    fetchRequest();
  };

  return {
    request,
    loading,
    error,
    refresh,
  };
}

/**
 * Hook pour créer une requête d'activation (BA)
 */
export function useCreateActivationRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRequest = async (
    data: CreateActivationRequestData
  ): Promise<ActivationRequest | null> => {
    try {
      setLoading(true);
      setError(null);
      const request = await activationRequestService.createActivationRequest(
        data
      );
      return request;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createRequest,
    loading,
    error,
  };
}

/**
 * Hook pour modifier une requête d'activation (BA)
 */
export function useUpdateActivationRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateRequest = async (
    id: string,
    data: UpdateActivationRequestData
  ): Promise<ActivationRequest | null> => {
    try {
      setLoading(true);
      setError(null);
      const request = await activationRequestService.updateActivationRequest(
        id,
        data
      );
      return request;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateRequest,
    loading,
    error,
  };
}

/**
 * Hook pour annuler une requête d'activation (BA)
 */
export function useCancelActivationRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancelRequest = async (
    id: string
  ): Promise<ActivationRequest | null> => {
    try {
      setLoading(true);
      setError(null);
      const request = await activationRequestService.cancelActivationRequest(id);
      return request;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    cancelRequest,
    loading,
    error,
  };
}

/**
 * Hook pour traiter une requête d'activation (Activateur)
 */
export function useProcessActivationRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processRequest = async (
    id: string,
    data: ProcessActivationRequestData
  ): Promise<ActivationRequest | null> => {
    try {
      setLoading(true);
      setError(null);
      const request = await activationRequestService.processActivationRequest(
        id,
        data
      );
      return request;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const acceptRequest = async (
    id: string,
    adminNotes?: string
  ): Promise<ActivationRequest | null> => {
    try {
      setLoading(true);
      setError(null);
      const request = await activationRequestService.acceptActivationRequest(
        id,
        adminNotes
      );
      return request;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const rejectRequest = async (
    id: string,
    rejectionReason: string,
    adminNotes?: string
  ): Promise<ActivationRequest | null> => {
    try {
      setLoading(true);
      setError(null);
      const request = await activationRequestService.rejectActivationRequest(
        id,
        rejectionReason,
        adminNotes
      );
      return request;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    processRequest,
    acceptRequest,
    rejectRequest,
    loading,
    error,
  };
}

/**
 * Hook pour récupérer l'historique d'une requête
 */
export function useActivationRequestHistory(requestId?: string) {
  const [history, setHistory] = useState<ActivationHistory[]>([]);
  const [loading, setLoading] = useState(!!requestId);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!requestId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await activationRequestService.getActivationRequestHistory(
        requestId
      );
      setHistory(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }, [requestId]);

  useEffect(() => {
    if (requestId) {
      fetchHistory();
    }
  }, [fetchHistory, requestId]);

  const refresh = () => {
    fetchHistory();
  };

  return {
    history,
    loading,
    error,
    refresh,
  };
}

/**
 * Hook pour récupérer les statistiques des requêtes
 */
export function useActivationRequestStats(
  filters?: Partial<ActivationRequestFilters>
) {
  const [stats, setStats] = useState<ActivationRequestStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await activationRequestService.getActivationRequestStats(
        filters
      );
      setStats(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const refresh = () => {
    fetchStats();
  };

  return {
    stats,
    loading,
    error,
    refresh,
  };
}

/**
 * Exemple d'utilisation :
 *
 * ```tsx
 * import {
 *   useActivationRequests,
 *   useCreateActivationRequest,
 *   useProcessActivationRequest,
 *   useActivationRequestStats
 * } from '~/hooks';
 *
 * // Liste des requêtes en attente
 * function PendingRequests() {
 *   const { requests, pagination, loading, error, refresh } = useActivationRequests(
 *     { status: 'pending' },
 *     { page: 1, perPage: 10, sortBy: 'submittedAt', sortOrder: 'desc' }
 *   );
 *
 *   if (loading) return <div>Chargement...</div>;
 *   if (error) return <div>Erreur: {error}</div>;
 *
 *   return (
 *     <div>
 *       {requests.map(request => (
 *         <div key={request.id}>
 *           {request.customer?.fullName} - {request.simNumber}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 *
 * // Créer une requête (BA)
 * function CreateRequestForm() {
 *   const { createRequest, loading, error } = useCreateActivationRequest();
 *
 *   const handleSubmit = async (data) => {
 *     const request = await createRequest({
 *       customerId: data.customerId,
 *       simNumber: data.simNumber,
 *       iccid: data.iccid,
 *       imei: data.imei,
 *       baNotes: data.notes,
 *     });
 *
 *     if (request) {
 *       console.log('Requête créée:', request);
 *     }
 *   };
 *
 *   return <form onSubmit={handleSubmit}>...</form>;
 * }
 *
 * // Traiter une requête (Activateur)
 * function ProcessRequest({ requestId }) {
 *   const { acceptRequest, rejectRequest, loading } = useProcessActivationRequest();
 *
 *   const handleAccept = async () => {
 *     const request = await acceptRequest(requestId, 'Vérification OK');
 *     if (request) {
 *       console.log('Requête acceptée');
 *     }
 *   };
 *
 *   const handleReject = async (reason: string) => {
 *     const request = await rejectRequest(requestId, reason);
 *     if (request) {
 *       console.log('Requête rejetée');
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={handleAccept} disabled={loading}>Accepter</button>
 *       <button onClick={() => handleReject('CNI invalide')} disabled={loading}>
 *         Rejeter
 *       </button>
 *     </div>
 *   );
 * }
 *
 * // Statistiques
 * function Dashboard() {
 *   const { stats, loading, error } = useActivationRequestStats();
 *
 *   if (loading) return <div>Chargement...</div>;
 *   if (error) return <div>Erreur: {error}</div>;
 *
 *   return (
 *     <div>
 *       <div>Total: {stats?.total}</div>
 *       <div>En attente: {stats?.pending}</div>
 *       <div>Activées: {stats?.activated}</div>
 *       <div>Taux de succès: {stats?.successRate}%</div>
 *     </div>
 *   );
 * }
 * ```
 */

