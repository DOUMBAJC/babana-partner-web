import { useState } from 'react';
import type { IdCardType } from '~/types/customer.types';

/**
 * Hook personnalisé pour gérer la validation des numéros de carte d'identité
 */
export function useIdCardValidation(
  selectedCardType: IdCardType | undefined,
  errorMessage: string
) {
  const [validationError, setValidationError] = useState<string>('');

  /**
   * Valide un numéro de carte d'identité selon le pattern du type sélectionné
   */
  const validateIdCardNumber = (value: string): boolean => {
    if (!selectedCardType?.validation_pattern || !value) {
      setValidationError('');
      return true;
    }

    try {
      const regex = new RegExp(selectedCardType.validation_pattern);
      const isValid = regex.test(value);
      
      if (!isValid) {
        setValidationError(
          errorMessage || `Format invalide pour ${selectedCardType.name}`
        );
        return false;
      }
      
      setValidationError('');
      return true;
    } catch (error) {
      console.error('Erreur de validation du pattern:', error);
      setValidationError('');
      return true; // En cas d'erreur de regex, on laisse passer
    }
  };

  /**
   * Réinitialise l'erreur de validation
   */
  const resetValidationError = () => {
    setValidationError('');
  };

  return {
    validationError,
    validateIdCardNumber,
    resetValidationError,
    setValidationError
  };
}

