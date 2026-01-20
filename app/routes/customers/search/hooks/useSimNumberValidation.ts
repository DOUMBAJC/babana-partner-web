import { useState } from 'react';
import { SIM_NUMBER_PATTERN } from '../config';

/**
 * Hook personnalisé pour gérer la validation des numéros SIM
 */
export function useSimNumberValidation(errorMessage: string) {
  const [validationError, setValidationError] = useState<string>('');

  /**
   * Valide un numéro SIM selon le pattern défini
   */
  const validateSimNumber = (value: string): boolean => {
    if (!value || value.trim() === '') {
      setValidationError('');
      return true; // Vide est valide car c'est optionnel
    }

    const isValid = SIM_NUMBER_PATTERN.test(value);
    
    if (!isValid) {
      setValidationError(errorMessage);
      return false;
    }
    
    setValidationError('');
    return true;
  };

  /**
   * Réinitialise l'erreur de validation
   */
  const resetValidationError = () => {
    setValidationError('');
  };

  return {
    validationError,
    validateSimNumber,
    resetValidationError,
    setValidationError
  };
}

