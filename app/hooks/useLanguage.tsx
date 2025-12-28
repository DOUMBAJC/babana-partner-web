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
 * Définit un cookie avec les bons paramètres (correspondant au format serveur)
 */
const setCookie = (name: string, value: string) => {
  if (typeof document === "undefined") return;
  // Utiliser max-age au lieu de expires pour correspondre au cookie serveur
  const maxAge = 60 * 60 * 24 * 365; // 1 an
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; samesite=lax`;
};

export function LanguageProvider({
  children,
  defaultLanguage = "fr",
  storageKey = "babana-language",
}: LanguageProviderProps) {
  // TOUJOURS initialiser avec la langue du serveur pour éviter les problèmes d'hydratation
  const [language, setLanguageState] = useState<Language>(defaultLanguage);

  // Synchroniser l'attribut lang du HTML quand la langue change
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  const setLanguage = (newLanguage: Language) => {
    
    // Ne rien faire si c'est déjà la langue actuelle
    if (newLanguage === language) {
      return;
    }
    
    // Définir le cookie pour que le serveur le lise lors de la prochaine requête
    if (typeof window !== "undefined") {
      setCookie(storageKey, newLanguage);
      // Recharger la page pour que le serveur relise le cookie et renvoie la bonne langue
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

