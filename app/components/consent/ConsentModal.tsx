import { useState, useEffect } from 'react';
import { Cookie, MapPin, Settings, ShieldCheck, X, Info } from 'lucide-react';
import { useConsent } from '~/hooks/useConsent';
import { useLanguage } from '~/hooks';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '~/components/ui/dialog';
import { Switch } from '~/components/ui/switch';

interface ConsentModalProps {
  onClose: () => void;
}

export function ConsentModal({ onClose }: ConsentModalProps) {
  const { consent, updateConsents, acceptAll, rejectNonEssential, hideBanner } = useConsent();
  const { language } = useLanguage();
  
  const [localConsent, setLocalConsent] = useState(consent);

  // Synchroniser localConsent avec consent quand le modal s'ouvre
  useEffect(() => {
    setLocalConsent(consent);
  }, [consent]);

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
    // Sauvegarder les deux consentements en une seule fois
    updateConsents({
      functional: localConsent.functional,
      geolocation: localConsent.geolocation,
    });
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
      <DialogContent className="w-[95vw] sm:w-full sm:max-w-4xl max-h-[90vh] overflow-y-auto overflow-x-hidden bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-0 shadow-2xl rounded-2xl sm:rounded-3xl p-0 gap-0 z-[200]">
        {/* Header spectaculaire avec gradient animé */}
        <div className="relative bg-linear-to-br from-babana-cyan via-babana-cyan/90 to-babana-navy px-5 py-6 sm:p-8 sm:pb-12 overflow-hidden">
          {/* Pattern SVG overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMTUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
          
          {/* Effets de lumière animés */}
          <div className="absolute top-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-56 h-56 sm:w-80 sm:h-80 bg-babana-navy/30 rounded-full blur-3xl"></div>
          
          <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="shrink-0">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-white/30 blur-xl rounded-2xl"></div>
                <div className="relative bg-white/20 backdrop-blur-sm p-3 sm:p-4 rounded-2xl border-2 border-white/30 shadow-xl">
                  <ShieldCheck className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
              </div>
            </div>
            
            <div className="flex-1 pt-1 sm:pt-2">
              <DialogTitle className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight">
                {content.title}
              </DialogTitle>
              <DialogDescription className="text-cyan-100 text-base sm:text-lg font-medium">
                {content.description}
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Contenu principal avec fond solide */}
        <div className="space-y-4 p-4 sm:p-6 bg-white dark:bg-slate-900">
          {/* Cookies essentiels */}
          <div className="group relative rounded-xl border-2 border-green-500/30 bg-linear-to-br from-green-50/50 to-green-50/30 dark:from-green-950/20 dark:to-green-950/10 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-green-500/50">
            <div className="absolute inset-0 bg-linear-to-br from-green-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="flex-1 w-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-lg bg-green-500/10 border border-green-500/20">
                    <Cookie className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground">{content.essential.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {content.essential.description}
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-green-500/20 to-green-600/20 border border-green-500/30 text-xs font-semibold text-green-700 dark:text-green-400 whitespace-nowrap shadow-sm">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                {content.essential.required}
              </div>
            </div>
          </div>

          {/* Cookies fonctionnels */}
          <div className="group relative rounded-xl border border-border/50 bg-card p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-blue-500/30 hover:bg-linear-to-br hover:from-blue-50/30 hover:to-transparent dark:hover:from-blue-950/10">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                    <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground">{content.functional.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                  {content.functional.description}
                </p>
                <div className="flex items-start gap-2.5 mt-4 p-3.5 rounded-lg bg-muted/60 border border-border/50 backdrop-blur-sm">
                  <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {content.functional.examples}
                  </p>
                </div>
              </div>
              <div className="pt-1">
                <Switch
                  checked={localConsent.functional}
                  onCheckedChange={(checked: boolean) =>
                    setLocalConsent({ ...localConsent, functional: checked })
                  }
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Géolocalisation */}
          <div className="group relative rounded-xl border border-border/50 bg-card p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-orange-500/30 hover:bg-linear-to-br hover:from-orange-50/30 hover:to-transparent dark:hover:from-orange-950/10">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-lg bg-orange-500/10 border border-orange-500/20 group-hover:bg-orange-500/20 transition-colors">
                    <MapPin className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground">{content.geolocation.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                  {content.geolocation.description}
                </p>
                <div className="space-y-2.5 mt-4">
                  <div className="flex items-start gap-2.5 p-3.5 rounded-lg bg-muted/60 border border-border/50 backdrop-blur-sm">
                    <Info className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {content.geolocation.examples}
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5 p-3.5 rounded-lg bg-linear-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 shadow-sm">
                    <Info className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-700 dark:text-amber-400 font-medium leading-relaxed">
                      {content.geolocation.note}
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-1">
                <Switch
                  checked={localConsent.geolocation}
                  onCheckedChange={(checked: boolean) =>
                    setLocalConsent({ ...localConsent, geolocation: checked })
                  }
                  className="data-[state=checked]:bg-orange-600"
                />
              </div>
            </div>
          </div>

          {/* Sécurité et confidentialité */}
          <div className="relative rounded-xl border-2 border-babana-cyan/30 bg-linear-to-br from-babana-cyan/10 via-babana-cyan/5 to-babana-navy/10 p-4 sm:p-6 shadow-lg shadow-babana-cyan/10 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(95,200,233,0.1),transparent_70%)]" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-babana-cyan/5 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-babana-cyan/20 border border-babana-cyan/30 shadow-sm">
                  <ShieldCheck className="h-5 w-5 text-babana-cyan" />
                </div>
                <h3 className="font-semibold text-lg text-foreground">{content.security.title}</h3>
              </div>
              <ul className="space-y-3">
                {content.security.points.map((point, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm group/item">
                    <div className="mt-0.5 p-1 rounded-full bg-babana-cyan/20 border border-babana-cyan/30 shrink-0">
                      <span className="text-babana-cyan text-xs font-bold">✓</span>
                    </div>
                    <span className="text-muted-foreground leading-relaxed group-hover/item:text-foreground transition-colors">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Actions avec séparateur et fond solide */}
        <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-6 sticky bottom-0 z-10">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleSave}
              className="flex-1 h-12 bg-linear-to-r from-babana-cyan to-babana-cyan/80 hover:from-babana-cyan/90 hover:to-babana-cyan/70 text-white font-semibold shadow-lg shadow-babana-cyan/25 hover:shadow-xl hover:shadow-babana-cyan/30 transition-all duration-300 hover:scale-[1.02]"
            >
              {content.actions.save}
            </Button>
            
            <Button
              onClick={handleAcceptAll}
              variant="outline"
              className="flex-1 h-12 border-2 hover:bg-accent hover:border-accent-foreground/20 transition-all duration-300 hover:scale-[1.02] font-medium"
            >
              {content.actions.acceptAll}
            </Button>
            
            <Button
              onClick={handleRejectNonEssential}
              variant="outline"
              className="flex-1 h-12 border-2 hover:bg-accent hover:border-accent-foreground/20 transition-all duration-300 hover:scale-[1.02] font-medium"
            >
              {content.actions.rejectNonEssential}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

