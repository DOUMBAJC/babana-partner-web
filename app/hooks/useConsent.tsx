import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';

export type ConsentType = 'essential' | 'functional' | 'geolocation';

export interface ConsentState {
  essential: boolean; // Toujours true (cookies de session)
  functional: boolean; // Cookies de préférence (langue, thème)
  geolocation: boolean; // Autorisation de géolocalisation
  hasResponded: boolean; // L'utilisateur a-t-il répondu ?
}

interface ConsentContextType {
  consent: ConsentState;
  updateConsent: (type: ConsentType, value: boolean) => void;
  acceptAll: () => void;
  rejectNonEssential: () => void;
  resetConsent: () => void;
  showBanner: boolean;
  hideBanner: () => void;
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

const CONSENT_STORAGE_KEY = 'babana-consent-preferences';

const DEFAULT_CONSENT: ConsentState = {
  essential: true,
  functional: true,
  geolocation: false,
  hasResponded: false,
};

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentState>(DEFAULT_CONSENT);
  const [showBanner, setShowBanner] = useState(false);

  // Charger les préférences au montage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (stored) {
        const parsedConsent = JSON.parse(stored) as ConsentState;
        setConsent(parsedConsent);
        setShowBanner(!parsedConsent.hasResponded);
      } else {
        // Première visite, afficher le banner
        setShowBanner(true);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des préférences de consentement:', error);
      setShowBanner(true);
    }
  }, []);

  // Sauvegarder les préférences
  const saveConsent = (newConsent: ConsentState) => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(newConsent));
      setConsent(newConsent);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des préférences de consentement:', error);
    }
  };

  const updateConsent = (type: ConsentType, value: boolean) => {
    const newConsent = {
      ...consent,
      [type]: type === 'essential' ? true : value, // Essential est toujours true
      hasResponded: true,
    };
    saveConsent(newConsent);
  };

  const acceptAll = () => {
    const newConsent: ConsentState = {
      essential: true,
      functional: true,
      geolocation: true,
      hasResponded: true,
    };
    saveConsent(newConsent);
    setShowBanner(false);
  };

  const rejectNonEssential = () => {
    const newConsent: ConsentState = {
      essential: true,
      functional: false,
      geolocation: false,
      hasResponded: true,
    };
    saveConsent(newConsent);
    setShowBanner(false);
  };

  const resetConsent = () => {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(CONSENT_STORAGE_KEY);
    setConsent(DEFAULT_CONSENT);
    setShowBanner(true);
  };

  const hideBanner = () => {
    setShowBanner(false);
  };

  return (
    <ConsentContext.Provider
      value={{
        consent,
        updateConsent,
        acceptAll,
        rejectNonEssential,
        resetConsent,
        showBanner,
        hideBanner,
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const context = useContext(ConsentContext);
  if (context === undefined) {
    throw new Error('useConsent must be used within a ConsentProvider');
  }
  return context;
}

