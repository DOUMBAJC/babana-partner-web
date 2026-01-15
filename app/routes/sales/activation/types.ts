export interface CustomerData {
  id: string;
  full_name: string;
  lastName?: string;
  firstName?: string;
  phone?: string;
  id_card_number: string;
  id_card_type_id: string;
}

export interface ActivationFormData {
  simNumber: string;
  iccid: string;
  imei: string;
  ba_notes: string;
}

export interface FormErrors {
  simNumber?: string;
  iccid?: string;
  imei?: string;
  ba_notes?: string;
}

export interface ActivationConfig {
  validation: {
    simNumberRegex: RegExp;
    iccidRegex: RegExp;
    imeiRegex: RegExp;
  };
  defaults: {
    iccidPrefix: string;
  };
}

export type ActivationScreen =
  | 'loading'
  | 'no_customer'
  | 'success'
  | 'api_error'
  | 'access_denied'
  | 'form';
