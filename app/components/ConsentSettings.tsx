import { useState } from 'react';
import { Settings, Cookie } from 'lucide-react';
import { useConsent } from '~/hooks/useConsent';
import { useLanguage } from '~/hooks';
import { ConsentModal } from './ConsentModal';
import { Button } from './ui/button';

interface ConsentSettingsProps {
  variant?: 'button' | 'link';
  className?: string;
}

/**
 * Composant pour rouvrir les paramètres de consentement
 * À placer dans les paramètres utilisateur ou le footer
 */
export function ConsentSettings({ variant = 'button', className = '' }: ConsentSettingsProps) {
  const [showModal, setShowModal] = useState(false);
  const { language } = useLanguage();
  const { consent } = useConsent();

  const t = {
    fr: {
      button: 'Gérer les autorisations',
      link: 'Paramètres des cookies et autorisations',
      stats: (essentials: number, total: number) => 
        `${essentials}/${total} autorisations activées`,
    },
    en: {
      button: 'Manage permissions',
      link: 'Cookie and permission settings',
      stats: (essentials: number, total: number) => 
        `${essentials}/${total} permissions enabled`,
    },
  };

  const content = language === 'fr' ? t.fr : t.en;

  // Compter les autorisations actives
  const activeCount = Object.values(consent).filter(
    (value) => value === true
  ).length - 1; // -1 pour ne pas compter hasResponded
  const totalCount = 3; // essential, functional, geolocation

  if (variant === 'link') {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className={`inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 ${className}`}
        >
          <Cookie className="h-4 w-4" />
          {content.link}
        </button>
        {showModal && <ConsentModal onClose={() => setShowModal(false)} />}
      </>
    );
  }

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        variant="outline"
        className={`gap-2 ${className}`}
      >
        <Settings className="h-4 w-4" />
        <span className="hidden sm:inline">{content.button}</span>
        <span className="text-xs text-muted-foreground ml-1">
          ({content.stats(activeCount, totalCount)})
        </span>
      </Button>
      {showModal && <ConsentModal onClose={() => setShowModal(false)} />}
    </>
  );
}

