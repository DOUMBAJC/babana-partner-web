import { useState } from 'react';
import type { ActivationFormData, FormErrors, CustomerData } from '~/routes/sales/activation/types';
import { ACTIVATION_CONFIG, REQUIRED_FORM_FIELDS } from '~/routes/sales/activation/config';
import type { Translations } from '~/lib/translations';

export function useActivationForm(t: Translations) {
  const [formData, setFormData] = useState<ActivationFormData>({
    simNumber: '',
    iccid: ACTIVATION_CONFIG.defaults.iccidPrefix,
    imei: '',
    ba_notes: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showApiError, setShowApiError] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // SIM Number validation
    if (!ACTIVATION_CONFIG.validation.simNumberRegex.test(formData.simNumber)) {
      newErrors.simNumber = t.simActivation.errors.simNumber;
      isValid = false;
    }

    // ICCID validation
    if (!ACTIVATION_CONFIG.validation.iccidRegex.test(formData.iccid)) {
      newErrors.iccid = t.simActivation.errors.iccid;
      isValid = false;
    }

    // IMEI validation
    if (!ACTIVATION_CONFIG.validation.imeiRegex.test(formData.imei)) {
      newErrors.imei = t.simActivation.errors.imei;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Allow only numbers for specific fields
    if (REQUIRED_FORM_FIELDS.includes(name as any) && name !== 'ba_notes') {
      if (value && !/^\d+$/.test(value)) return;
    }

    setFormData((prev) => {
      // Map snake_case form field names to camelCase state keys
      const stateKey = name === 'sim_number' ? 'simNumber' : name;
      const newFormData = { ...prev, [stateKey]: value };

      // Auto-complete ICCID when sim_number is entered and valid
      if (name === 'sim_number' && value && ACTIVATION_CONFIG.validation.simNumberRegex.test(value)) {
        const currentIccidPrefix = prev.iccid.slice(0, Math.max(0, 20 - value.length));
        const completedIccid = (currentIccidPrefix + value).slice(0, 20);
        newFormData.iccid = completedIccid;
      }

      return newFormData;
    });

    // Clear error when user types
    const errorKey = name === 'sim_number' ? 'simNumber' : name;
    if (errors[errorKey as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [errorKey]: undefined }));
    }
  };

  const handleSubmitStart = () => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSubmitSuccess = () => {
    setLoading(false);
    setShowSuccess(true);
    setErrorMessage('');
    setShowApiError(false);
  };

  const handleSubmitError = (error: string, apiErrors?: Record<string, string[]>) => {
    setLoading(false);
    setErrorMessage(error);
    setShowApiError(true);
    
    // Mapper les erreurs de l'API vers les erreurs du formulaire
    if (apiErrors) {
      const newErrors: FormErrors = {};
      
      // Mapper les champs de l'API (snake_case) vers les champs du formulaire (camelCase)
      Object.keys(apiErrors).forEach((field) => {
        const fieldErrors = apiErrors[field];
        if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
          // Mapper les noms de champs
          let formField: keyof FormErrors;
          if (field === 'sim_number' || field === 'customer_id') {
            formField = 'simNumber';
          } else if (field === 'iccid') {
            formField = 'iccid';
          } else if (field === 'imei') {
            formField = 'imei';
          } else if (field === 'ba_notes') {
            formField = 'ba_notes';
          } else {
            return; // Ignorer les champs non reconnus
          }
          
          // Prendre le premier message d'erreur pour ce champ
          newErrors[formField] = fieldErrors[0];
        }
      });
      
      // Fusionner avec les erreurs existantes
      setErrors((prev) => ({ ...prev, ...newErrors }));
    }
  };

  const resetForm = () => {
    setFormData({
      simNumber: '',
      iccid: ACTIVATION_CONFIG.defaults.iccidPrefix,
      imei: '',
      ba_notes: '',
    });
    setErrors({});
  };

  const resetForRetry = () => {
    setShowApiError(false);
    setErrorMessage('');
    setLoading(false);
    setSuccessMessage('');
    setShowSuccess(false);
    // Ne pas réinitialiser les erreurs pour permettre à l'utilisateur de voir les erreurs
    // Garder les données du formulaire pour permettre à l'utilisateur de les modifier avant de réessayer
  };

  const clearApiErrors = () => {
    setErrorMessage('');
    setShowApiError(false);
  };

  const resetForNewActivation = () => {
    setShowSuccess(false);
    resetForm();
  };

  return {
    formData,
    errors,
    loading,
    successMessage,
    errorMessage,
    showSuccess,
    showApiError,
    validateForm,
    handleInputChange,
    handleSubmitStart,
    handleSubmitSuccess,
    handleSubmitError,
    resetForm,
    resetForRetry,
    resetForNewActivation,
    clearApiErrors,
  };
}
