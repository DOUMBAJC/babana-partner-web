import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";

export function formatDate(date: string, language: 'fr' | 'en' = 'fr'): string {
  try {
    const dateLocale = language === 'fr' ? fr : enUS;
    return format(new Date(date), "dd MMMM yyyy à HH:mm", { locale: dateLocale });
  } catch {
    return date;
  }
}

/**
 * Formate un UUID pour l'affichage en utilisant les 8 premiers caractères
 * Exemple: "550e8400-e29b-41d4-a716-446655440000" -> "550e8400"
 * 
 * @param uuid - L'UUID à formater
 * @returns Les 8 premiers caractères de l'UUID en majuscules
 */
export function formatRequestId(uuid: string): string {
  if (!uuid) return '';
  // Prendre les 8 premiers caractères et les mettre en majuscules pour plus de lisibilité
  return uuid.substring(0, 8).toUpperCase();
}

