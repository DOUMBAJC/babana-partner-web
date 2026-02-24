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
 * Hook: useCustomerForm
 * Gère l'état, la validation et la synchronisation des erreurs serveur du formulaire client.
 */
export function useCustomerForm(
  initialData: CustomerFormData,
  validationMessages: ValidationMessages,
  idCardTypes?: IdCardType[]
) {
  const [formData, setFormData] = useState<CustomerFormData>(initialData);
  const [errors, setErrors] = useState<CustomerFormErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<keyof CustomerFormData>>(new Set());

  // Validation d'un champ selon les règles métier (Cameroun)
  const validateField = (field: keyof CustomerFormData, value: string): string | undefined => {
    if (['lastName', 'idCardTypeId', 'idCardNumber', 'phone', 'address'].includes(field)) {
      if (!value || value.trim() === '') return validationMessages.required;
    }

    switch (field) {
      case 'firstName':
      case 'lastName':
        if (value && value.trim().length < 2) return validationMessages.minLength.replace('{min}', '2');
        if (value && !VALIDATION_PATTERNS.name.test(value)) return validationMessages.invalidName;
        break;
      case 'phone':
        if (value) {
          const phoneValidation = validateCameroonPhone(value);
          if (!phoneValidation.isValid) return phoneValidation.message || validationMessages.invalidPhone;
        }
        break;
      case 'email':
        if (value && value.trim() !== '' && !VALIDATION_PATTERNS.email.test(value)) return validationMessages.invalidEmail;
        break;
      case 'idCardNumber':
        if (value && value.length < 5) return validationMessages.minLength.replace('{min}', '5');
        break;
      case 'address':
        if (value && value.length < 3) return validationMessages.minLength.replace('{min}', '3');
        break;
    }
    return undefined;
  };

  // Valide l'intégralité du formulaire
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

  // Met à jour un champ et déclenche sa validation
  const updateField = (field: keyof CustomerFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouchedFields(prev => new Set(prev).add(field));
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  /**
   * setExternalErrors : Synchronise les erreurs de validation venant du serveur (Laravel snake_case).
   */
  const setExternalErrors = (externalErrors: Record<string, string>) => {
    const fieldMapping: Record<string, keyof CustomerFormData> = {
      'first_name': 'firstName',
      'last_name': 'lastName',
      'full_name': 'lastName',
      'id_card_type_id': 'idCardTypeId',
      'id_card_number': 'idCardNumber',
      'phone': 'phone',
      'email': 'email',
      'address': 'address'
    };

    setErrors(prev => {
      const newErrors = { ...prev };
      Object.entries(externalErrors).forEach(([key, message]) => {
        const formKey = fieldMapping[key] || (key as keyof CustomerFormData);
        
        if (formKey in initialData) {
          newErrors[formKey as keyof CustomerFormData] = message;
        }
      });
      return newErrors;
    });

    setTouchedFields(prev => {
      const newTouched = new Set(prev);
      Object.keys(externalErrors).forEach(key => {
        const formKey = fieldMapping[key] || (key as keyof CustomerFormData);
        if (formKey in initialData) {
          newTouched.add(formKey as keyof CustomerFormData);
        }
      });
      return newTouched;
    });
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
    setExternalErrors,
    isFormValid: isFormValid()
  };
}

