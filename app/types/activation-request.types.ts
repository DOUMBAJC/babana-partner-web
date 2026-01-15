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
  | 'approved'      // Approuvée (compat backend)
  | 'activated'     // Activée
  | 'rejected'      // Rejetée
  | 'cancelled';    // Annulée

/**
 * Requête d'activation de SIM
 */
export interface ActivationRequest {
  id: string;
  baId: string;
  customerId: string;
  processedBy?: string;
  sim_number: string;
  iccid: string;
  imei?: string;
  status: ActivationRequestStatus;
  ba_notes?: string;
  admin_notes?: string;
  rejection_reason?: string;
  submitted_at?: string;
  processed_at?: string;
  activated_at?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;

  // Relations (chargées via include)
  ba?: {
    id: string;
    name: string;
    email: string;
    camtelLogin?: string;
  };
  customer?: Customer;
  processor?: {
    id: string;
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
  id: string;
  activationRequestId: string;
  userId: string;
  action: string;
  oldStatus?: ActivationRequestStatus;
  newStatus?: ActivationRequestStatus;
  notes?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  
  // Relations
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

/**
 * Données pour créer une requête d'activation (BA)
 */
export interface CreateActivationRequestData {
  customerId: string;
  sim_number: string;
  iccid: string;
  imei?: string;
  baNotes?: string;
  metadata?: Record<string, any>;
}

/**
 * Données pour modifier une requête d'activation (BA)
 */
export interface UpdateActivationRequestData {
  sim_number?: string;
  iccid?: string;
  imei?: string;
  baNotes?: string;
  metadata?: Record<string, any>;
}

/**
 * Données pour traiter une requête (Activateur)
 */
export interface ProcessActivationRequestData {
  status: 'processing' | 'approved' | 'activated' | 'rejected';
  adminNotes?: string;
  rejectionReason?: string;
}

/**
 * Filtres de recherche pour les requêtes d'activation
 */
export interface ActivationRequestFilters {
  search?: string;
  status?: ActivationRequestStatus | ActivationRequestStatus[];
  baId?: string;
  customerId?: string;
  processedBy?: string;
  sim_number?: string;
  iccid?: string;
  submittedFrom?: string;
  submittedTo?: string;
  processedFrom?: string;
  processedTo?: string;
  activatedFrom?: string;
  activatedTo?: string;
}

/**
 * Statistiques des requêtes d'activation (format serveur)
 */
export interface ActivationRequestStatsResponse {
  overview: {
    total: number;
    pending: number;
    processing: number;
    approved?: number;
    activated: number;
    rejected: number;
    cancelled: number;
  };
  temporal: {
    today: { total: number; activated: number; rejected: number };
    this_week: { total: number; activated: number; rejected: number };
    this_month: { total: number; activated: number; rejected: number };
  };
  performance: {
    success_rate: number;
    avg_processing_time_minutes: number | null;
    total_processed: number;
  };
  by_ba: Array<{
    ba_id: string;
    ba_name: string;
    total: number;
    activated: number;
    rejected: number;
    pending: number;
  }>;
  generated_at: string;
}

/**
 * Statistiques des requêtes d'activation (format frontend)
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

