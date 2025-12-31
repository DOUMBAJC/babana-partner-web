import { api, type ApiError } from './axios';
import type {
  Customer,
  CreateCustomerData,
  UpdateCustomerData,
  CustomerFilters,
  IdCardType,
  PaginatedResponse,
  ApiResponse,
  QueryParams,
} from '~/types';

/**
 * Service de gestion des clients (Customers)
 * Permet de gérer les clients créés par les BA
 */
export const customerService = {
  /**
   * Récupérer la liste des clients (paginée)
   */
  getCustomers: async (
    filters?: CustomerFilters,
    params?: QueryParams
  ): Promise<PaginatedResponse<Customer>> => {
    try {
      return await api.get<PaginatedResponse<Customer>>('/customers', {
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
   * Récupérer un client par son numéro de carte d'identité
   */
  getCustomerByIdCard: async (idCardNumber: string, include?: string[]): Promise<Customer> => {
    try {
      const response = await api.get<ApiResponse<Customer>>(`/customers/searchByIdCard/${idCardNumber}`, {
        params: {
          include: include?.join(','),
        },
      });
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Créer un nouveau client
   */
  createCustomer: async (data: CreateCustomerData): Promise<Customer> => {
    try {
      const response = await api.post<ApiResponse<Customer>>('/customers', data);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Modifier un client
   */
  updateCustomer: async (
    id: number,
    data: UpdateCustomerData
  ): Promise<Customer> => {
    try {
      const response = await api.put<ApiResponse<Customer>>(
        `/customers/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Supprimer un client
   */
  deleteCustomer: async (id: number): Promise<void> => {
    try {
      await api.delete(`/customers/${id}`);
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Rechercher un client par CNI
   */
  searchByIdCard: async (
    idCardTypeId: number,
    idCardNumber: string
  ): Promise<{
    success: boolean;
    found: boolean;
    message: string;
    data: Customer | null;
    activation_status?: {
      can_activate: boolean;
      activations_count: number;
      remaining_activations: number;
      max_activations: number;
    };
  }> => {
    try {
      const response = await api.post<{
        success: boolean;
        found: boolean;
        message: string;
        data: Customer | null;
        activation_status?: {
          can_activate: boolean;
          activations_count: number;
          remaining_activations: number;
          max_activations: number;
        };
      }>(
        '/customers/searchByIdCard',
        {
          id_card_type_id: idCardTypeId,
          id_card_number: idCardNumber,
        }
      );
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Rechercher un client par téléphone
   */
  searchByPhone: async (phone: string): Promise<Customer | null> => {
    try {
      const response = await api.get<ApiResponse<Customer | null>>(
        '/customers',
        {
          params: { phone },
        }
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.status === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Récupérer les clients créés par un BA spécifique
   */
  getCustomersByBa: async (
    baId: number,
    params?: QueryParams
  ): Promise<PaginatedResponse<Customer>> => {
    try {
      return await api.get<PaginatedResponse<Customer>>(`/users/${baId}/customers`, {
        params,
      });
    } catch (error) {
      throw error as ApiError;
    }
  },
};

/**
 * Exemple d'utilisation dans un composant :
 *
 * ```tsx
 * import { customerService } from '~/lib/customer.service';
 * import { useState, useEffect } from 'react';
 *
 * function CustomerList() {
 *   const [customers, setCustomers] = useState([]);
 *   const [loading, setLoading] = useState(true);
 *
 *   useEffect(() => {
 *     const fetchCustomers = async () => {
 *       try {
 *         const response = await customerService.getCustomers(
 *           { phoneOperator: 'CAMTEL' },
 *           { page: 1, perPage: 10, sortBy: 'createdAt', sortOrder: 'desc' }
 *         );
 *         setCustomers(response.data);
 *       } catch (error) {
 *         console.error('Erreur:', error.message);
 *       } finally {
 *         setLoading(false);
 *       }
 *     };
 *
 *     fetchCustomers();
 *   }, []);
 *
 *   return <div>...</div>;
 * }
 *
 * // Créer un client
 * const newCustomer = await customerService.createCustomer({
 *   fullName: 'Jean Dupont',
 *   idCardTypeId: 1,
 *   idCardNumber: '123456789',
 *   phone: '237612345678',
 *   phoneOperator: 'CAMTEL',
 *   address: 'Yaoundé, Cameroun',
 *   email: 'jean@example.com',
 * });
 * ```
 */

