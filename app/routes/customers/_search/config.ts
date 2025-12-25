import type { RoleSlug } from '~/types/auth.types';

/**
 * Configuration pour la recherche de clients
 */

// Rôles autorisés à accéder à la recherche de clients
export const AUTHORIZED_ROLES: RoleSlug[] = [
  'super_admin',
  'admin', 
  'activateur',
  'ba',
  'dsm'
];

// Limite maximale d'activations par client (définie au niveau business)
export const MAX_ACTIVATIONS_PER_CUSTOMER = 3;

// Type pour le statut de recherche
export type SearchStatus = 'idle' | 'searching' | 'found' | 'not_found';

// Type pour les données d'activation
export interface ActivationStatus {
  activations_count: number;
  remaining_activations: number;
  max_activations: number; // Normalement 3
  can_activate: boolean;
}

// Type pour la requête de recherche
export interface SearchQuery {
  id_card_type_id: string;
  id_card_number: string;
}

