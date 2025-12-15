import { useLanguage } from "./useLanguage";
import { translations, interpolate, type Translations } from "~/lib/translations";

export function useTranslation() {
  const { language } = useLanguage();

  return {
    t: translations[language] as Translations,
    language,
    interpolate,
  };
}

