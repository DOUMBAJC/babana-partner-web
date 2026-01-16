import type { ActivationRequest, RoleSlug } from "~/types";
import { ACTIVATOR_ROLES, ADMIN_ROLES } from "../constants";

export interface User {
  id: string | number;
  roles?: RoleSlug[];
  [key: string]: any; // Permet d'accepter d'autres propriétés
}

export function canEditRequest(
  request: ActivationRequest | null,
  user: User | null
): boolean {
  if (!request || !user) return false;
  
  const userRole = user.roles?.[0];
  // Récupérer baId depuis différentes sources possibles (baId, ba_id, ba?.id)
  const baId = request.baId || (request as any).ba_id || request.ba?.id;
  if (!baId) return false;
  
  // Comparaison robuste des IDs (gère les cas string/number)
  const isOwner = String(baId) === String(user.id);
  
  // Le propriétaire peut éditer sa requête si elle est pending ou rejected
  if (isOwner && (request.status === 'pending' || request.status === 'rejected')) {
    return true;
  }
  
  // Admin et super_admin peuvent toujours éditer
  return ADMIN_ROLES.includes(userRole as RoleSlug);
}

export function canCancelRequest(
  request: ActivationRequest | null,
  user: User | null
): boolean {
  if (!request || !user) return false;
  
  // Récupérer baId depuis différentes sources possibles (baId, ba_id, ba?.id)
  const baId = request.baId || (request as any).ba_id || request.ba?.id;
  if (!baId) return false;
  
  // Comparaison robuste des IDs (gère les cas string/number)
  const isOwner = String(baId) === String(user.id);
  
  // Seul le owner peut annuler et seulement si la requête est en statut pending
  return isOwner && request.status === 'pending';
}

export function canProcessRequest(
  request: ActivationRequest | null,
  user: User | null
): boolean {
  if (!request || !user) return false;
  
  const userRole = user.roles?.[0];
  const isActivator = ACTIVATOR_ROLES.includes(userRole as RoleSlug);
  
  // Peut traiter si la requête est pending ou processing
  return isActivator && (request.status === 'pending' || request.status === 'processing');
}

export function isOwner(request: ActivationRequest | null, user: User | null): boolean {
  if (!request || !user) return false;
  // Récupérer baId depuis différentes sources possibles (baId, ba_id, ba?.id)
  const baId = request.baId || (request as any).ba_id || request.ba?.id;
  if (!baId) return false;
  // Comparaison robuste des IDs (gère les cas string/number)
  return String(baId) === String(user.id);
}

export function isActivator(user: User | null): boolean {
  if (!user) return false;
  const userRole = user.roles?.[0];
  return ACTIVATOR_ROLES.includes(userRole as RoleSlug);
}

