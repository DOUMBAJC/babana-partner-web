import type { ActivationConfig } from './types';
import type { User } from '~/types/auth.types';
import { hasAnyRole } from '~/lib/auth/permissions';

export const ACTIVATION_CONFIG: ActivationConfig = {
  validation: {
    simNumberRegex: /^62\d{7}$/,
    iccidRegex: /^62405010000\d{9}$/,
    imeiRegex: /^\d{15}$/,
  },
  defaults: {
    iccidPrefix: '62405010000',
  },
} as const;

export const REQUIRED_FORM_FIELDS = ['sim_number', 'iccid', 'imei'] as const;

export const AUTHORIZED_ROLES = [
  'super_admin',
  'admin',
  'ba',
  'activateur',
  'dsm',
  'pos'
] as const;

/**
 * Rôles qui peuvent accéder à tous les clients (pas seulement ceux qu'ils ont créés)
 */
const ROLES_WITH_FULL_CUSTOMER_ACCESS: string[] = [
  'super_admin',
  'admin',
  'activateur',
  'dsm',
  'ba',
  'pos'
];

/**
 * Vérifie si un utilisateur peut accéder à un client spécifique pour l'activation
 * 
 * Règles métier :
 * - super_admin, admin, activateur, dsm, ba, pos : accès à tous les clients
 * 
 * @param user L'utilisateur actuel
 * @param customer Le client à vérifier (doit avoir un champ created_by)
 * @returns true si l'utilisateur peut accéder au client, false sinon
 */
export function canAccessCustomerForActivation(
  user: User | null,
  customer: { created_by?: string | null } | null
): boolean {
  if (!user || !customer) {
    return false;
  }

  // Vérifier si l'utilisateur a un rôle autorisé
  if (!hasAnyRole(user, AUTHORIZED_ROLES as any)) {
    return false;
  }

  // Les rôles avec accès complet peuvent accéder à tous les clients
  if (hasAnyRole(user, ROLES_WITH_FULL_CUSTOMER_ACCESS as any)) {
    return true;
  }

  // Pour les autres rôles, vérifier qu'ils ont créé le client
  return customer.created_by === user.id;
}
