import { useState } from 'react';
import { Cookie, MapPin, Settings, ShieldCheck, X, Info } from 'lucide-react';
import { useConsent } from '~/hooks/useConsent';
import { useLanguage } from '~/hooks';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Switch } from './ui/switch';

interface ConsentModalProps {
  onClose: () => void;
}

export function ConsentModal({ onClose }: ConsentModalProps) {
  const { consent, updateConsent, acceptAll, rejectNonEssential, hideBanner } = useConsent();
  const { language } = useLanguage();
  
  const [localConsent, setLocalConsent] = useState(consent);

  const t = {
    fr: {
      title: 'Gestion des autorisations',
      description: 'Gérez vos préférences de confidentialité et d\'autorisations. Vous pouvez modifier ces paramètres à tout moment.',
      essential: {
        title: 'Cookies essentiels',
        description: 'Ces cookies sont nécessaires au fonctionnement de l\'application. Ils gèrent votre session, votre authentification et la sécurité. Ils ne peuvent pas être désactivés.',
        required: 'Toujours actifs',
      },
      functional: {
        title: 'Cookies fonctionnels',
        description: 'Ces cookies mémorisent vos préférences comme la langue d\'affichage et le thème (clair/sombre) pour améliorer votre expérience utilisateur.',
        examples: 'Exemples : langue, thème, préférences d\'affichage',
      },
      geolocation: {
        title: 'Géolocalisation',
        description: 'Nous pouvons demander votre position géographique pour améliorer certaines fonctionnalités (recherche locale, optimisation des services). Cette autorisation est entièrement optionnelle.',
        examples: 'Utilisé pour : enrichir les métadonnées des requêtes API',
        note: 'Note : Vous pourrez refuser l\'accès à tout moment via votre navigateur.',
      },
      security: {
        title: 'Votre vie privée est protégée',
        points: [
          'Aucun cookie publicitaire ou de tracking',
          'Aucune donnée vendue à des tiers',
          'Données stockées de manière sécurisée',
          'Conformité RGPD',
        ],
      },
      actions: {
        save: 'Enregistrer mes préférences',
        acceptAll: 'Tout accepter',
        rejectNonEssential: 'Nécessaires uniquement',
        cancel: 'Annuler',
      },
    },
    en: {
      title: 'Permissions Management',
      description: 'Manage your privacy and permissions preferences. You can change these settings at any time.',
      essential: {
        title: 'Essential Cookies',
        description: 'These cookies are necessary for the application to function. They manage your session, authentication, and security. They cannot be disabled.',
        required: 'Always active',
      },
      functional: {
        title: 'Functional Cookies',
        description: 'These cookies remember your preferences such as display language and theme (light/dark) to improve your user experience.',
        examples: 'Examples: language, theme, display preferences',
      },
      geolocation: {
        title: 'Geolocation',
        description: 'We may request your geographic location to improve certain features (local search, service optimization). This permission is entirely optional.',
        examples: 'Used for: enriching API request metadata',
        note: 'Note: You can refuse access at any time through your browser.',
      },
      security: {
        title: 'Your privacy is protected',
        points: [
          'No advertising or tracking cookies',
          'No data sold to third parties',
          'Data stored securely',
          'GDPR compliant',
        ],
      },
      actions: {
        save: 'Save my preferences',
        acceptAll: 'Accept all',
        rejectNonEssential: 'Essential only',
        cancel: 'Cancel',
      },
    },
  };

  const content = language === 'fr' ? t.fr : t.en;

  const handleSave = () => {
    updateConsent('functional', localConsent.functional);
    updateConsent('geolocation', localConsent.geolocation);
    hideBanner();
    onClose();
  };

  const handleAcceptAll = () => {
    acceptAll();
    onClose();
  };

  const handleRejectNonEssential = () => {
    rejectNonEssential();
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-babana-cyan" />
            {content.title}
          </DialogTitle>
          <DialogDescription className="text-base">
            {content.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Cookies essentiels */}
          <div className="rounded-lg border border-border p-5 bg-muted/30">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Cookie className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <h3 className="font-semibold text-base">{content.essential.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {content.essential.description}
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-xs font-medium text-green-700 dark:text-green-400 whitespace-nowrap">
                {content.essential.required}
              </div>
            </div>
          </div>

          {/* Cookies fonctionnels */}
          <div className="rounded-lg border border-border p-5 bg-card">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-semibold text-base">{content.functional.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {content.functional.description}
                </p>
                <div className="flex items-start gap-2 mt-3 p-3 rounded-md bg-muted/50">
                  <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    {content.functional.examples}
                  </p>
                </div>
              </div>
              <Switch
                checked={localConsent.functional}
                onCheckedChange={(checked) =>
                  setLocalConsent({ ...localConsent, functional: checked })
                }
              />
            </div>
          </div>

          {/* Géolocalisation */}
          <div className="rounded-lg border border-border p-5 bg-card">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  <h3 className="font-semibold text-base">{content.geolocation.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {content.geolocation.description}
                </p>
                <div className="space-y-2 mt-3">
                  <div className="flex items-start gap-2 p-3 rounded-md bg-muted/50">
                    <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">
                      {content.geolocation.examples}
                    </p>
                  </div>
                  <div className="flex items-start gap-2 p-3 rounded-md bg-amber-500/10 border border-amber-500/20">
                    <Info className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                      {content.geolocation.note}
                    </p>
                  </div>
                </div>
              </div>
              <Switch
                checked={localConsent.geolocation}
                onCheckedChange={(checked) =>
                  setLocalConsent({ ...localConsent, geolocation: checked })
                }
              />
            </div>
          </div>

          {/* Sécurité et confidentialité */}
          <div className="rounded-lg border border-babana-cyan/20 p-5 bg-gradient-to-br from-babana-cyan/5 to-babana-navy/5">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="h-5 w-5 text-babana-cyan" />
              <h3 className="font-semibold text-base">{content.security.title}</h3>
            </div>
            <ul className="space-y-2">
              {content.security.points.map((point, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-babana-cyan mt-0.5">✓</span>
                  <span className="text-muted-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
          <Button
            onClick={handleSave}
            className="flex-1 h-11 bg-gradient-to-r from-babana-cyan to-babana-cyan/80 hover:from-babana-cyan/90 hover:to-babana-cyan/70 text-white font-semibold"
          >
            {content.actions.save}
          </Button>
          
          <Button
            onClick={handleAcceptAll}
            variant="outline"
            className="flex-1 h-11"
          >
            {content.actions.acceptAll}
          </Button>
          
          <Button
            onClick={handleRejectNonEssential}
            variant="outline"
            className="flex-1 h-11"
          >
            {content.actions.rejectNonEssential}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

