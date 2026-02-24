import { useEffect } from 'react';
import type { CustomerFormData } from '../config';

const STORAGE_KEY = 'babana_customer_create_form';

/**
 * Hook: useFormPersistence
 * Persiste les données du formulaire dans le localStorage pour éviter les pertes (refresh/réseau)
 */
export function useFormPersistence(
  formData: CustomerFormData,
  updateField: (field: keyof CustomerFormData, value: string) => void
) {
  // Restauration initiale au montage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as Partial<CustomerFormData>;
      Object.entries(parsed).forEach(([field, value]) => {
        if (value && typeof value === 'string') {
          updateField(field as keyof CustomerFormData, value);
        }
      });
    } catch (e) {
      console.warn('Persistence: Erreur de lecture', e);
    }
  }, []);

  // Sauvegarde automatique
  useEffect(() => {
    const hasData = Object.values(formData).some(val => val && val.trim() !== '');
    if (hasData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData]);

  const clearPersistence = () => localStorage.removeItem(STORAGE_KEY);

  return { clearPersistence };
}
