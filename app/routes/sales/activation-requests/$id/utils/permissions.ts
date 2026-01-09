import type { ActivationRequest, RoleSlug } from "~/types";
import { ACTIVATOR_ROLES, ADMIN_ROLES } from "../constants";

export interface User {
  id: number;
  roles?: RoleSlug[];
}

export function canEditRequest(
  request: ActivationRequest | null,
  user: User | null
): boolean {
  if (!request || !user) return false;
  
  const userRole = user.roles?.[0];
  const isOwner = request.baId === user.id;
  
  // BA, DSM, POS peuvent éditer leurs propres requêtes si elles sont pending ou rejected
  if (['ba', 'dsm', 'pos'].includes(userRole || '')) {
    return (request.status === 'pending' || request.status === 'rejected') && isOwner;
  }
  
  // Admin et super_admin peuvent toujours éditer
  return ADMIN_ROLES.includes(userRole as RoleSlug);
}

export function canCancelRequest(
  request: ActivationRequest | null,
  user: User | null
): boolean {
  if (!request || !user) return false;
  
  const isOwner = request.baId === user.id;
  
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
  return request.baId === user.id;
}

export function isActivator(user: User | null): boolean {
  if (!user) return false;
  const userRole = user.roles?.[0];
  return ACTIVATOR_ROLES.includes(userRole as RoleSlug);
}

