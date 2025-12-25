import { createContext, useContext, useEffect, useState } from "react";

type Language = "fr" | "en";

type LanguageProviderProps = {
  children: React.ReactNode;
  defaultLanguage?: Language;
  storageKey?: string;
};

type LanguageProviderState = {
  language: Language;
  setLanguage: (language: Language) => void;
};

const LanguageProviderContext = createContext<LanguageProviderState | undefined>(
  undefined
);

/**
 * Lit un cookie par son nom
 */
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
};

/**
 * Définit un cookie
 */
const setCookie = (name: string, value: string, days: number = 365) => {
  if (typeof document === "undefined") return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

export function LanguageProvider({
  children,
  defaultLanguage = "fr",
  storageKey = "babana-language",
}: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === "undefined") {
      return defaultLanguage;
    }
    try {
      // D'abord essayer de lire le cookie
      const cookieValue = getCookie(storageKey) as Language;
      if (cookieValue && (cookieValue === "fr" || cookieValue === "en")) {
        return cookieValue;
      }
      
      // Rétrocompatibilité: lire localStorage
      const stored = localStorage.getItem(storageKey) as Language;
      if (stored && (stored === "fr" || stored === "en")) {
        // Migrer vers le cookie
        setCookie(storageKey, stored);
        return stored;
      }
      
      // Sinon, utiliser la langue du navigateur
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith("fr")) {
        return "fr";
      }
      return defaultLanguage;
    } catch {
      return defaultLanguage;
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Sauvegarder dans le cookie (accessible par le serveur)
        setCookie(storageKey, language);
        // Garder aussi dans localStorage pour compatibilité
        localStorage.setItem(storageKey, language);
        document.documentElement.lang = language;
      } catch (error) {
        console.warn("Impossible de sauvegarder la langue:", error);
      }
    }
  }, [language, storageKey]);

  const value = {
    language,
    setLanguage: (newLanguage: Language) => {
      setLanguage(newLanguage);
    },
  };

  return (
    <LanguageProviderContext.Provider value={value}>
      {children}
    </LanguageProviderContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageProviderContext);

  if (context === undefined)
    throw new Error("useLanguage must be used within a LanguageProvider");

  return context;
};

