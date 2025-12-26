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
      const newFormData = { ...prev, [name]: value };

      // Auto-complete ICCID when simNumber is entered and valid
      if (name === 'simNumber' && value && ACTIVATION_CONFIG.validation.simNumberRegex.test(value)) {
        const currentIccidPrefix = prev.iccid.slice(0, Math.max(0, 19 - value.length));
        const completedIccid = (currentIccidPrefix + value).slice(0, 19);
        newFormData.iccid = completedIccid;
      }

      return newFormData;
    });

    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
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

  const handleSubmitError = (error: string) => {
    setLoading(false);
    setErrorMessage(error);
    setShowApiError(true);
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
  };
}
