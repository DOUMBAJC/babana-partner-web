/**
 * Types pour la gestion des clients (Customers)
 */

/**
 * Type de carte d'identité
 */
export interface IdCardType {
  id: number;
  name: string;
  code: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Client (Customer)
 */
export interface Customer {
  id: number;
  fullName: string;
  idCardTypeId: number;
  idCardNumber: string;
  phone: string;
  phoneOperator: string;
  address?: string;
  email?: string;
  createdBy: number;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;

  // Relations (chargées via include)
  idCardType?: IdCardType;
  creator?: {
    id: number;
    name: string;
    email: string;
  };
  activationRequestsCount?: number;
}

/**
 * Données pour créer un client
 */
export interface CreateCustomerData {
  full_name: string;
  id_card_type_id: number;
  id_card_number: string;
  phone: string;
  address?: string;
  email?: string;
  metadata?: Record<string, any>;
}

/**
 * Données pour modifier un client
 */
export interface UpdateCustomerData extends Partial<CreateCustomerData> {}

/**
 * Filtres de recherche pour les clients
 */
export interface CustomerFilters {
  search?: string;
  idCardTypeId?: number;
  idCardNumber?: string;
  phone?: string;
  phoneOperator?: string;
  createdBy?: number;
  createdFrom?: string;
  createdTo?: string;
}

