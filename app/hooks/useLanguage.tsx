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
      const stored = localStorage.getItem(storageKey) as Language;
      if (stored && (stored === "fr" || stored === "en")) {
        return stored;
      }
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

