import type { ActivationConfig } from './types';

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
