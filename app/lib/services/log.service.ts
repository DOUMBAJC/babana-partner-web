import { api, type ApiError } from './axios';
import type {
  PaginatedResponse,
  ApiResponse,
  QueryParams,
} from '~/types';

/**
 * Types pour les logs
 */
export type LogLevel = 'debug' | 'info' | 'warning' | 'error' | 'critical';
export type LogType = 'api' | 'auth' | 'database' | 'system' | 'security';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  type: LogType;
  message: string;
  userId?: string;
  userName?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  stackTrace?: string;
}

export interface LogFilters {
  level?: LogLevel | 'all';
  type?: LogType | 'all';
  userId?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface LogStats {
  total: number;
  error: number;
  warning: number;
  info: number;
  debug: number;
  critical: number;
}

/**
 * Service de gestion des logs système
 * Permet de consulter et analyser les logs de la plateforme
 * Utilise les routes React Router (SSR) pour assurer l'authentification correcte
 */
export const logService = {
  /**
   * Récupérer la liste des logs (paginée)
   */
  getLogs: async (
    filters?: LogFilters,
    params?: QueryParams
  ): Promise<PaginatedResponse<LogEntry>> => {
    try {
      return await api.get<PaginatedResponse<LogEntry>>('/api/logs', {
        // On vise la route React Router (same-origin) plutôt que le backend direct (API_CONFIG.baseURL)
        baseURL: '',
        params: {
          ...filters,
          ...params,
        },
      });
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Récupérer un log par son ID
   */
  getLogById: async (id: string): Promise<LogEntry> => {
    try {
      const response = await api.get<ApiResponse<LogEntry>>(`/api/logs/${id}`, {
        // On vise la route React Router (same-origin) plutôt que le backend direct
        baseURL: '',
      });
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Récupérer les statistiques des logs
   */
  getLogStats: async (filters?: LogFilters): Promise<LogStats> => {
    try {
      const response = await api.get<ApiResponse<LogStats>>('/api/logs/stats', {
        // On vise la route React Router (same-origin) plutôt que le backend direct
        baseURL: '',
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Exporter les logs au format CSV
   */
  exportLogs: async (filters?: LogFilters): Promise<Blob> => {
    try {
      // Pour les blobs, on doit utiliser axios directement avec responseType
      // car api.get retourne res.data qui ne fonctionne pas pour les blobs
      const axiosInstance = (await import('~/lib/http/axios')).default;
      const response = await axiosInstance.get('/api/logs/export', {
        baseURL: '',
        params: filters,
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },
};

