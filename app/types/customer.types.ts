/**
 * Types pour la gestion des clients (Customers)
 */

/**
 * Type de carte d'identité
 */
export interface IdCardType {
  id: string;
  name: string;
  code: string;
  description?: string;
  validation_pattern?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Client (Customer)
 */
export interface Customer {
  id: string;
  full_name: string;
  id_card_type_id: string;
  id_card_number: string;
  phone: string;
  phoneOperator: string;
  address?: string;
  email?: string;
  created_by: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  
  // Identification status
  identification_status: 'none' | 'pending' | 'verified' | 'rejected';
  identification_rejected_reason?: string | null;

  // URLs des images (backend)
  id_card_front_url?: string | null;
  id_card_back_url?: string | null;
  portrait_url?: string | null;
  location_plan_url?: string | null;
  
  // Alternative names sometimes used in the codebase
  id_card_front?: string | null;
  id_card_back?: string | null;
  portrait_photo?: string | null;
  localization_plan?: string | null;

  // Relations (chargées via include)
  id_card_type?: IdCardType;
  creator?: {
    id: string;
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
  id_card_type_id: string;
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
  idCardTypeId?: string;
  idCardNumber?: string;
  phone?: string;
  phoneOperator?: string;
  createdBy?: string;
  createdFrom?: string;
  createdTo?: string;
}

