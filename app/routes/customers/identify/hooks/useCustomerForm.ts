import { useState } from 'react';
import type { CustomerIdentifyFormData, CustomerIdentifyFormErrors } from '../config';
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

export interface CustomerFormOptions {
  requiredFiles?: boolean;
}

export function useCustomerForm(
  initialData: CustomerIdentifyFormData,
  validationMessages: ValidationMessages,
  idCardTypes?: IdCardType[],
  options: CustomerFormOptions = { requiredFiles: true }
) {
  const [formData, setFormData] = useState<CustomerIdentifyFormData>(initialData);
  const [errors, setErrors] = useState<CustomerIdentifyFormErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<keyof CustomerIdentifyFormData>>(new Set());

  const validateField = (field: keyof CustomerIdentifyFormData, value: any): string | undefined => {
    // Champs de fichier requis si l'option est activée
    if (['id_card_front', 'id_card_back', 'portrait_photo', 'location_plan'].includes(field)) {
       if (options.requiredFiles && !value) return validationMessages.required;
       return undefined;
    }

    // Champs texte requis
    if (['lastName', 'idCardTypeId', 'idCardNumber', 'phone', 'address'].includes(field)) {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return validationMessages.required;
      }
    }

    // Validation spécifique par champ
    switch (field) {
      case 'firstName':
      case 'lastName':
        if (typeof value === 'string' && value && value.trim().length < 2) {
          return validationMessages.minLength.replace('{min}', '2');
        }
        if (typeof value === 'string' && value && !VALIDATION_PATTERNS.name.test(value)) {
          return validationMessages.invalidName;
        }
        break;

      case 'phone':
        if (typeof value === 'string' && value) {
          const phoneValidation = validateCameroonPhone(value);
          if (!phoneValidation.isValid) {
            return phoneValidation.message || validationMessages.invalidPhone;
          }
        }
        break;

      case 'email':
        if (typeof value === 'string' && value && value.trim() !== '' && !VALIDATION_PATTERNS.email.test(value)) {
          return validationMessages.invalidEmail;
        }
        break;

      case 'idCardNumber':
        if (typeof value === 'string' && value && value.length < 5) {
          return validationMessages.minLength.replace('{min}', '5');
        }
        break;

      case 'address':
        if (typeof value === 'string' && value && value.length < 3) {
          return validationMessages.minLength.replace('{min}', '3');
        }
        break;
    }

    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: CustomerIdentifyFormErrors = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof CustomerIdentifyFormData>).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const updateField = (field: keyof CustomerIdentifyFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouchedFields(prev => new Set(prev).add(field));
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };
  
  const updateFileField = (field: keyof CustomerIdentifyFormData, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
    setTouchedFields(prev => new Set(prev).add(field));
    const error = validateField(field, file);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const touchField = (field: keyof CustomerIdentifyFormData) => {
    setTouchedFields(prev => new Set(prev).add(field));
    const error = validateField(field, formData[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const resetForm = () => {
    setFormData(initialData);
    setErrors({});
    setTouchedFields(new Set());
  };

  const isFormValidInternal = (): boolean => {
    const baseValid = Object.values(errors).every(error => !error) && 
           formData.lastName.trim() !== '' &&
           formData.idCardTypeId !== '' &&
           formData.idCardNumber.trim() !== '' &&
           formData.phone.trim() !== '' &&
           formData.address.trim() !== '';

    if (options.requiredFiles) {
      return baseValid &&
             formData.id_card_front !== null &&
             formData.id_card_back !== null &&
             formData.portrait_photo !== null &&
             formData.location_plan !== null;
    }

    return baseValid;
  };

  return {
    formData,
    errors,
    touchedFields,
    updateField,
    updateFileField,
    touchField,
    validateForm,
    resetForm,
    isFormValid: isFormValidInternal()
  };
}
