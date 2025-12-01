import { useLanguage } from "./useLanguage";
import { translations, interpolate, type Translations } from "~/lib/translations";

/**
 * Hook pour accéder aux traductions en fonction de la langue courante
 * 
 * @example
 * ```tsx
 * const { t, language } = useTranslation();
 * 
 * // Utilisation simple
 * <h1>{t.nav.home}</h1>
 * 
 * // Avec interpolation
 * const message = interpolate(t.footer.copyright, { year: "2025" });
 * ```
 */
export function useTranslation() {
  const { language } = useLanguage();

  return {
    t: translations[language] as Translations,
    language,
    interpolate,
  };
}

