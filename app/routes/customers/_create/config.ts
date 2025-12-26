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
  // Orange: 640-649, 655-659, 685-689, 690-699
  // MTN: 650-654, 670-689
  // Camtel Blue: 233, 242, 243, 620-629
  phone: /^(\+237|00237|237)?[ ]?[2-6][0-9]{8}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  name: /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/,
  // Validation plus stricte des noms (pas seulement espaces)
  nameStrict: /^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ\s'-]*[a-zA-ZÀ-ÿ]$/
};

// Fonction helper pour normaliser un numéro de téléphone camerounais
export const normalizePhoneNumber = (phone: string): string => {
  // Supprimer tous les espaces et caractères spéciaux
  let normalized = phone.replace(/[\s\-\(\)]/g, '');
  
  // Supprimer les préfixes internationaux
  if (normalized.startsWith('+237')) {
    normalized = normalized.substring(4);
  } else if (normalized.startsWith('00237')) {
    normalized = normalized.substring(5);
  } else if (normalized.startsWith('237')) {
    normalized = normalized.substring(3);
  }
  
  return normalized;
};

// Validation avancée du numéro de téléphone camerounais
export const validateCameroonPhone = (phone: string): { isValid: boolean; message?: string } => {
  const normalized = normalizePhoneNumber(phone);
  
  if (normalized.length !== 9) {
    return { isValid: false, message: 'Le numéro doit contenir 9 chiffres' };
  }
  
  const firstDigit = normalized[0];
  const prefix = normalized.substring(0, 3);
  
  // Vérifier les opérateurs
  if (firstDigit === '6') {
    const prefixNum = parseInt(prefix);
    
    // Orange: 640-649, 655-659, 685-689, 690-699
    if ((prefixNum >= 640 && prefixNum <= 649) || 
        (prefixNum >= 655 && prefixNum <= 659) || 
        (prefixNum >= 685 && prefixNum <= 689) ||
        (prefixNum >= 690 && prefixNum <= 699)) {
      return { isValid: true };
    }
    
    // MTN: 650-654, 670-684 (ajusté pour ne pas chevaucher Orange 685-689)
    if ((prefixNum >= 650 && prefixNum <= 654) || (prefixNum >= 670 && prefixNum <= 684)) {
      return { isValid: true };
    }
    
    // Camtel Blue: 620-629
    if (prefixNum >= 620 && prefixNum <= 629) {
      return { isValid: true };
    }
    
    return { isValid: false, message: 'Préfixe mobile invalide pour le Cameroun' };
  } else if (firstDigit === '2') {
    // Camtel Blue: 233, 242, 243
    if (prefix === '233' || prefix === '242' || prefix === '243') {
      return { isValid: true };
    }
    return { isValid: false, message: 'Préfixe fixe invalide pour le Cameroun' };
  }
  
  return { isValid: false, message: 'Numéro de téléphone invalide pour le Cameroun' };
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

