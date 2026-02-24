import { useEffect } from 'react';
import type { CustomerFormData } from '../config';

const STORAGE_KEY = 'babana_customer_create_form';

/**
 * Hook pour gérer la persistance locale du formulaire de création de client.
 * Permet de sauvegarder les données en cas de rafraîchissement ou perte de réseau.
 */
export function useFormPersistence(
  formData: CustomerFormData,
  updateField: (field: keyof CustomerFormData, value: string) => void
) {
  // 1. Charger les données au montage
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData) as Partial<CustomerFormData>;
        Object.entries(parsedData).forEach(([field, value]) => {
          if (value && typeof value === 'string') {
            updateField(field as keyof CustomerFormData, value);
          }
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des données sauvegardées:', error);
      }
    }
  }, []); // Seulement au montage

  // 2. Sauvegarder les données à chaque changement (debounce optionnel mais ici direct car données légères)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  /**
   * Nettoie les données sauvegardées (à appeler après un succès)
   */
  const clearPersistence = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  return { clearPersistence };
}
