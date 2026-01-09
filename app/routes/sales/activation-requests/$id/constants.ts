import type { RoleSlug } from "~/types";

export const AUTHORIZED_ROLES: RoleSlug[] = [
  'super_admin',
  'admin',
  'activateur',
  'ba',
  'dsm',
  'pos'
];

export const ACTIVATOR_ROLES: RoleSlug[] = [
  'activateur',
  'admin',
  'super_admin'
];

export const ADMIN_ROLES: RoleSlug[] = [
  'admin',
  'super_admin'
];

