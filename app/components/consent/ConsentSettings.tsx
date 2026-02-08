import { useState } from 'react';
import { Settings, Cookie } from 'lucide-react';
import { useConsentSafe } from '~/hooks/useConsent';
import { useLanguage } from '~/hooks';
import { ConsentModal } from './ConsentModal';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

interface ConsentSettingsProps {
  variant?: 'button' | 'link';
  className?: string;
  onOpen?: () => void;
}

/**
 * Composant pour rouvrir les paramètres de consentement
 * À placer dans les paramètres utilisateur ou le footer
 */
export function ConsentSettings({ variant = 'button', className = '', onOpen }: ConsentSettingsProps) {
  const { language } = useLanguage();
  const { consent, openModal } = useConsentSafe();

  const handleOpen = () => {
    openModal();
    if (onOpen) onOpen();
  };
    
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
      <button
        onClick={handleOpen}
        className={cn(
          "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all duration-200",
          "hover:bg-muted/50 px-3 py-1.5 rounded-full",
          className
        )}
      >
        <Cookie className="h-4 w-4" />
        <span>{content.link}</span>
      </button>
    );
  }

  return (
    <Button
      onClick={handleOpen}
      variant="outline"
      className={`gap-2 ${className}`}
    >
      <Settings className="h-4 w-4" />
      <span className="hidden sm:inline">{content.button}</span>
      <span className="text-xs text-muted-foreground ml-1">
        ({content.stats(activeCount, totalCount)})
      </span>
    </Button>
  );
}

