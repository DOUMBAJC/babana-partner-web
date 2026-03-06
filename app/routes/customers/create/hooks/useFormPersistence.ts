import type { CustomerFormData } from '../config';

/**
 * Hook: useFormPersistence
 */
export function useFormPersistence(
  _formData: CustomerFormData,
  _updateField: (field: keyof CustomerFormData, value: string) => void
) {
  const clearPersistence = () => {};
  return { clearPersistence };
}
