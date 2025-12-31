import { useState, useEffect, useCallback } from 'react';
import { customerService, idCardTypeService, type ApiError } from '~/lib';
import type {
  Customer,
  CreateCustomerData,
  UpdateCustomerData,
  CustomerFilters,
  IdCardType,
  PaginatedResponse,
  QueryParams,
} from '~/types';

/**
 * Hook pour gérer les clients
 */
export function useCustomers(
  initialFilters?: CustomerFilters,
  initialParams?: QueryParams
) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CustomerFilters | undefined>(
    initialFilters
  );
  const [params, setParams] = useState<QueryParams | undefined>(initialParams);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await customerService.getCustomers(filters, params);
      setCustomers(response.data);
      setPagination(response.meta);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }, [filters, params]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const refresh = () => {
    fetchCustomers();
  };

  return {
    customers,
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
 * Hook pour gérer un client spécifique par son numéro de carte d'identité
 */
export function useCustomer(idCardNumber?: string, include?: string[]) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(!!idCardNumber);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomer = useCallback(async () => {
    if (!idCardNumber) return;

    try {
      setLoading(true);
      setError(null);
      const data = await customerService.getCustomerByIdCard(idCardNumber, include);
      setCustomer(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }, [idCardNumber, include]);

  useEffect(() => {
    if (idCardNumber) {
      fetchCustomer();
    }
  }, [fetchCustomer, idCardNumber]);

  const refresh = () => {
    fetchCustomer();
  };

  return {
    customer,
    loading,
    error,
    refresh,
  };
}

/**
 * Hook pour créer un client
 */
export function useCreateCustomer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCustomer = async (
    data: CreateCustomerData
  ): Promise<Customer | null> => {
    try {
      setLoading(true);
      setError(null);
      const customer = await customerService.createCustomer(data);
      return customer;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createCustomer,
    loading,
    error,
  };
}

/**
 * Hook pour modifier un client
 */
export function useUpdateCustomer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCustomer = async (
    id: number,
    data: UpdateCustomerData
  ): Promise<Customer | null> => {
    try {
      setLoading(true);
      setError(null);
      const customer = await customerService.updateCustomer(id, data);
      return customer;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateCustomer,
    loading,
    error,
  };
}

/**
 * Hook pour supprimer un client
 */
export function useDeleteCustomer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteCustomer = async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await customerService.deleteCustomer(id);
      return true;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteCustomer,
    loading,
    error,
  };
}

/**
 * Hook pour récupérer les types de carte d'identité
 */
export function useIdCardTypes() {
  const [idCardTypes, setIdCardTypes] = useState<IdCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIdCardTypes = async () => {
      try {
        setLoading(true);
        setError(null);
        const types = await idCardTypeService.getIdCardTypes();
        setIdCardTypes(types);
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIdCardTypes();
  }, []);

  return {
    idCardTypes,
    loading,
    error,
  };
}

/**
 * Exemple d'utilisation :
 *
 * ```tsx
 * import { useCustomers, useCreateCustomer, useIdCardTypes } from '~/hooks';
 *
 * function CustomerList() {
 *   const { customers, pagination, loading, error, setFilters, setParams } = useCustomers(
 *     { phoneOperator: 'CAMTEL' },
 *     { page: 1, perPage: 10, sortBy: 'createdAt', sortOrder: 'desc' }
 *   );
 *
 *   if (loading) return <div>Chargement...</div>;
 *   if (error) return <div>Erreur: {error}</div>;
 *
 *   return (
 *     <div>
 *       {customers.map(customer => (
 *         <div key={customer.id}>{customer.fullName}</div>
 *       ))}
 *     </div>
 *   );
 * }
 *
 * function CreateCustomerForm() {
 *   const { createCustomer, loading, error } = useCreateCustomer();
 *   const { idCardTypes } = useIdCardTypes();
 *
 *   const handleSubmit = async (data) => {
 *     const customer = await createCustomer(data);
 *     if (customer) {
 *       console.log('Client créé:', customer);
 *     }
 *   };
 *
 *   return <form onSubmit={handleSubmit}>...</form>;
 * }
 * ```
 */

