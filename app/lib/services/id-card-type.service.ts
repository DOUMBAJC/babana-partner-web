import { api, type ApiError } from './axios';
import type { IdCardType, ApiResponse } from '~/types';

/**
 * Service de gestion des types de cartes d'identité
 */
export const idCardTypeService = {
  /**
   * Récupérer tous les types de cartes d'identité
   */
  getIdCardTypes: async (): Promise<IdCardType[]> => {
    try {
      const response = await api.get<ApiResponse<IdCardType[]>>('/idCardTypes');
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Récupérer un type de carte d'identité par son ID
   */
  getIdCardType: async (id: string): Promise<IdCardType> => {
    try {
      const response = await api.get<ApiResponse<IdCardType>>(`/idCardTypes/${id}`);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },
};

