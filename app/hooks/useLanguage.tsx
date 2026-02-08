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

const LanguageProviderContext = createContext<LanguageProviderState | undefined>(undefined);

const setCookie = (name: string, value: string) => {
  if (typeof document === "undefined") return;
  const maxAge = 60 * 60 * 24 * 365; // 1 an
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; samesite=lax`;
};

export function LanguageProvider({children, defaultLanguage = "fr", storageKey = "babana-language",}: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);

  // Synchroniser l'attribut lang du HTML quand la langue change
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  const setLanguage = (newLanguage: Language) => {

    if (newLanguage === language) {
      return;
    }
    
    if (typeof window !== "undefined") {
      setCookie(storageKey, newLanguage);
      window.location.reload();
    }
  };

  const value = {
    language,
    setLanguage,
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

