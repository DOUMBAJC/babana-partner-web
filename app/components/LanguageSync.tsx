import { useEffect } from "react";
import { useLanguage } from "~/hooks";
import { setApiLanguage } from "~/lib/axios";

/**
 * Composant pour synchroniser la langue de l'utilisateur avec la configuration axios
 * Doit être monté à l'intérieur du LanguageProvider
 */
export function LanguageSync() {
  const { language } = useLanguage();

  useEffect(() => {
    // Synchroniser la langue avec axios
    setApiLanguage(language);
  }, [language]);

  return null;
}

