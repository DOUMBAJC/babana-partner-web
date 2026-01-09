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

