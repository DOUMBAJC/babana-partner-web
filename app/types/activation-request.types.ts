/**
 * Types pour la gestion des requêtes d'activation de SIM
 */

import type { Customer } from './customer.types';

/**
 * Statut d'une requête d'activation
 */
export type ActivationRequestStatus =
  | 'pending'       // En attente
  | 'processing'    // En cours de traitement
  | 'activated'     // Activée
  | 'rejected'      // Rejetée
  | 'cancelled';    // Annulée

/**
 * Requête d'activation de SIM
 */
export interface ActivationRequest {
  id: number;
  baId: number;
  customerId: number;
  processedBy?: number;
  simNumber: string;
  iccid: string;
  imei?: string;
  status: ActivationRequestStatus;
  baNotes?: string;
  adminNotes?: string;
  rejectionReason?: string;
  submittedAt?: string;
  processedAt?: string;
  activatedAt?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;

  // Relations (chargées via include)
  ba?: {
    id: number;
    name: string;
    email: string;
    camtelLogin?: string;
  };
  customer?: Customer;
  processor?: {
    id: number;
    name: string;
    email: string;
  };
  history?: ActivationHistory[];
  
  // Méthodes helper (côté frontend)
  canBeEditedByBa?: boolean;
  canBeCancelledByBa?: boolean;
  canBeProcessed?: boolean;
}

/**
 * Historique d'une requête d'activation
 */
export interface ActivationHistory {
  id: number;
  activationRequestId: number;
  userId: number;
  action: string;
  oldStatus?: ActivationRequestStatus;
  newStatus?: ActivationRequestStatus;
  notes?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  
  // Relations
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

/**
 * Données pour créer une requête d'activation (BA)
 */
export interface CreateActivationRequestData {
  customerId: number;
  simNumber: string;
  iccid: string;
  imei?: string;
  baNotes?: string;
  metadata?: Record<string, any>;
}

/**
 * Données pour modifier une requête d'activation (BA)
 */
export interface UpdateActivationRequestData {
  simNumber?: string;
  iccid?: string;
  imei?: string;
  baNotes?: string;
  metadata?: Record<string, any>;
}

/**
 * Données pour traiter une requête (Activateur)
 */
export interface ProcessActivationRequestData {
  status: 'processing' | 'activated' | 'rejected';
  adminNotes?: string;
  rejectionReason?: string;
}

/**
 * Filtres de recherche pour les requêtes d'activation
 */
export interface ActivationRequestFilters {
  search?: string;
  status?: ActivationRequestStatus | ActivationRequestStatus[];
  baId?: number;
  customerId?: number;
  processedBy?: number;
  simNumber?: string;
  iccid?: string;
  submittedFrom?: string;
  submittedTo?: string;
  processedFrom?: string;
  processedTo?: string;
  activatedFrom?: string;
  activatedTo?: string;
}

/**
 * Statistiques des requêtes d'activation
 */
export interface ActivationRequestStats {
  total: number;
  pending: number;
  processing: number;
  activated: number;
  rejected: number;
  cancelled: number;
  averageProcessingTime?: number; // en heures
  successRate?: number; // en pourcentage
}

