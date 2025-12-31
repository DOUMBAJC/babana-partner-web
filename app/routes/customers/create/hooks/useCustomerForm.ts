import { useState } from 'react';
import type { CustomerFormData, CustomerFormErrors } from '../config';
import { VALIDATION_PATTERNS, validateCameroonPhone } from '../config';
import type { IdCardType } from '~/types/customer.types';

interface ValidationMessages {
  required: string;
  invalidPhone: string;
  invalidEmail: string;
  invalidName: string;
  minLength: string;
  maxLength: string;
}

/**
 * Hook personnalisé pour gérer le formulaire de création de client
 * Validation adaptée pour le Cameroun (Orange, MTN, Blue)
 */
export function useCustomerForm(
  initialData: CustomerFormData,
  validationMessages: ValidationMessages,
  idCardTypes?: IdCardType[]
) {
  const [formData, setFormData] = useState<CustomerFormData>(initialData);
  const [errors, setErrors] = useState<CustomerFormErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<keyof CustomerFormData>>(new Set());

  /**
   * Valide un champ spécifique
   */
  const validateField = (field: keyof CustomerFormData, value: string): string | undefined => {
    // Champs requis (selon la migration DB) - firstName est optionnel
    if (['lastName', 'idCardTypeId', 'idCardNumber', 'phone', 'address'].includes(field)) {
      if (!value || value.trim() === '') {
        return validationMessages.required;
      }
    }

    // Validation spécifique par champ
    switch (field) {
      case 'firstName':
      case 'lastName':
        if (value && value.trim().length < 2) {
          return validationMessages.minLength.replace('{min}', '2');
        }
        if (value && !VALIDATION_PATTERNS.name.test(value)) {
          return validationMessages.invalidName;
        }
        // Vérifier que ce n'est pas seulement des espaces
        if (value && value.trim().length === 0) {
          return validationMessages.required;
        }
        break;

      case 'phone':
        if (value) {
          const phoneValidation = validateCameroonPhone(value);
          if (!phoneValidation.isValid) {
            return phoneValidation.message || validationMessages.invalidPhone;
          }
        }
        break;

      case 'email':
        // Email optionnel mais si fourni, doit être valide
        if (value && value.trim() !== '' && !VALIDATION_PATTERNS.email.test(value)) {
          return validationMessages.invalidEmail;
        }
        break;

      case 'idCardNumber':
        if (value && value.length < 5) {
          return validationMessages.minLength.replace('{min}', '5');
        }
        // Note: La validation du pattern est gérée séparément via useIdCardValidation
        break;

      case 'address':
        // Adresse obligatoire selon migration
        if (value && value.length < 3) {
          return validationMessages.minLength.replace('{min}', '3');
        }
        break;
    }

    return undefined;
  };

  /**
   * Valide tous les champs du formulaire
   */
  const validateForm = (): boolean => {
    const newErrors: CustomerFormErrors = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof CustomerFormData>).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  /**
   * Met à jour la valeur d'un champ
   */
  const updateField = (field: keyof CustomerFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Marquer le champ comme touché automatiquement
    setTouchedFields(prev => new Set(prev).add(field));
    
    // Valider le champ immédiatement (onChange)
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  /**
   * Marque un champ comme touché (pour la validation)
   */
  const touchField = (field: keyof CustomerFormData) => {
    setTouchedFields(prev => new Set(prev).add(field));
    const error = validateField(field, formData[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  /**
   * Réinitialise le formulaire
   */
  const resetForm = () => {
    setFormData(initialData);
    setErrors({});
    setTouchedFields(new Set());
  };

  /**
   * Vérifie si le formulaire est valide
   * Selon la migration DB: full_name, id_card_type_id, id_card_number, phone, address sont requis
   * firstName est optionnel
   */
  const isFormValid = (): boolean => {
    return Object.values(errors).every(error => !error) && 
           formData.lastName.trim() !== '' &&
           formData.idCardTypeId !== '' &&
           formData.idCardNumber.trim() !== '' &&
           formData.phone.trim() !== '' &&
           formData.address.trim() !== '';
  };

  return {
    formData,
    errors,
    touchedFields,
    updateField,
    touchField,
    validateForm,
    resetForm,
    isFormValid: isFormValid()
  };
}

