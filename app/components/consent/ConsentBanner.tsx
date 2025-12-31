import { useState } from 'react';
import { Cookie, MapPin, Settings, X } from 'lucide-react';
import { useConsent } from '~/hooks/useConsent';
import { useLanguage } from '~/hooks';
import { ConsentModal } from './ConsentModal';
import { Button } from '~/components/ui/button';

export function ConsentBanner() {
  const { showBanner, acceptAll, rejectNonEssential, hideBanner } = useConsent();
  const { language } = useLanguage();
  const [showModal, setShowModal] = useState(false);

  const t = {
    fr: {
      title: 'Nous respectons votre vie privée',
      description: 'Nous utilisons des cookies essentiels pour le fonctionnement de l\'application et des cookies fonctionnels pour améliorer votre expérience (préférences de langue et thème). Nous pouvons également demander votre localisation pour des fonctionnalités optionnelles.',
      acceptAll: 'Tout accepter',
      rejectNonEssential: 'Nécessaires uniquement',
      customize: 'Personnaliser',
      learnMore: 'En savoir plus',
    },
    en: {
      title: 'We respect your privacy',
      description: 'We use essential cookies for the application to function and functional cookies to enhance your experience (language and theme preferences). We may also request your location for optional features.',
      acceptAll: 'Accept all',
      rejectNonEssential: 'Essential only',
      customize: 'Customize',
      learnMore: 'Learn more',
    },
  };

  const content = language === 'fr' ? t.fr : t.en;

  if (!showBanner) return null;

  return (
    <>
      {/* Overlay subtle */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 animate-in fade-in duration-300"
        onClick={() => hideBanner()}
      />

      {/* Banner principal */}
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-500">
        <div className="mx-auto max-w-7xl p-4 sm:p-6">
          <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl shadow-babana-cyan/10">
            {/* Gradient décoratif */}
            <div className="absolute inset-0 bg-linear-to-r from-babana-cyan/5 via-transparent to-babana-navy/5 pointer-events-none" />
            
            {/* Bouton fermer */}
            <button
              onClick={() => hideBanner()}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative p-6 sm:p-8">
              <div className="flex flex-col gap-6">
                {/* En-tête avec icône */}
                <div className="flex items-start gap-4">
                  <div className="shrink-0 rounded-xl bg-linear-to-br from-babana-cyan/20 to-babana-navy/20 p-3">
                    <Cookie className="h-6 w-6 text-babana-cyan" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                      {content.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {content.description}
                    </p>
                  </div>
                </div>

                {/* Badges informatifs */}
                <div className="flex flex-wrap gap-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 text-xs font-medium">
                    <Cookie className="h-3 w-3" />
                    <span>{language === 'fr' ? 'Cookies essentiels' : 'Essential cookies'}</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-medium">
                    <Settings className="h-3 w-3" />
                    <span>{language === 'fr' ? 'Préférences' : 'Preferences'}</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-700 dark:text-orange-400 text-xs font-medium">
                    <MapPin className="h-3 w-3" />
                    <span>{language === 'fr' ? 'Localisation (optionnelle)' : 'Location (optional)'}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={acceptAll}
                    className="flex-1 h-11 bg-linear-to-r from-babana-cyan to-babana-cyan/80 hover:from-babana-cyan/90 hover:to-babana-cyan/70 text-white font-semibold shadow-lg shadow-babana-cyan/25"
                  >
                    {content.acceptAll}
                  </Button>
                  
                  <Button
                    onClick={rejectNonEssential}
                    variant="outline"
                    className="flex-1 h-11 border-border/50 hover:bg-muted font-medium"
                  >
                    {content.rejectNonEssential}
                  </Button>
                  
                  <Button
                    onClick={() => setShowModal(true)}
                    variant="ghost"
                    className="h-11 text-muted-foreground hover:text-foreground font-medium"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    {content.customize}
                  </Button>
                </div>

                {/* Lien politique de confidentialité */}
                <button
                  onClick={() => setShowModal(true)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 text-center"
                >
                  {content.learnMore}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de personnalisation */}
      {showModal && <ConsentModal onClose={() => setShowModal(false)} />}
    </>
  );
}

