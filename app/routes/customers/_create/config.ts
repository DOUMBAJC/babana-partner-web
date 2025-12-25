/**
 * Configuration pour la création de clients
 * Pays: Cameroun
 * Opérateurs: Orange, MTN, Camtel Blue
 */

// Type pour les données du formulaire de création de client
export interface CustomerFormData {
  firstName: string;
  lastName: string;
  idCardTypeId: string;
  idCardNumber: string;
  phone: string;
  email: string;
  address: string;
}

// Type pour les erreurs de validation
export interface CustomerFormErrors {
  firstName?: string;
  lastName?: string;
  idCardTypeId?: string;
  idCardNumber?: string;
  phone?: string;
  email?: string;
  address?: string;
}

// État initial du formulaire
export const INITIAL_FORM_DATA: CustomerFormData = {
  firstName: '',
  lastName: '',
  idCardTypeId: '',
  idCardNumber: '',
  phone: '',
  email: '',
  address: ''
};

// Patterns de validation pour le Cameroun
export const VALIDATION_PATTERNS = {
  // Format téléphone Cameroun: +237 6XX XXX XXX ou 6XX XXX XXX
  // Orange: 655-659
  // MTN: 670-689
  // Camtel Blue: 233, 242, 243
  phone: /^(\+237|00237|237)?[1-9][0-9]{8}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  name: /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/
};

// Clés de traduction pour les messages d'erreur
export const ERROR_TRANSLATION_KEYS = {
  required: 'customerCreate.validation.required',
  invalidPhone: 'customerCreate.validation.invalidPhone',
  invalidEmail: 'customerCreate.validation.invalidEmail',
  invalidName: 'customerCreate.validation.invalidName',
  minLength: 'customerCreate.validation.minLength',
  maxLength: 'customerCreate.validation.maxLength'
};

