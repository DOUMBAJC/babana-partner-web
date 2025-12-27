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
  // On initialise avec defaultLanguage (qui vient du serveur via le loader)
  // pour éviter tout mismatch d'hydratation.
  const [language, setLanguage] = useState<Language>(defaultLanguage);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Au montage, on vérifie s'il y a une préférence stockée
        const stored = getCookie(storageKey) || localStorage.getItem(storageKey);
        if (stored && (stored === "fr" || stored === "en") && stored !== language) {
          setLanguage(stored as Language);
        }
        
        document.documentElement.lang = language;
        localStorage.setItem(storageKey, language);
        setCookie(storageKey, language);
      } catch (error) {
        console.warn("Impossible de synchroniser la langue:", error);
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

