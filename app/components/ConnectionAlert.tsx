import { useEffect, useState } from 'react';
import { Wifi, WifiOff, RefreshCw, AlertCircle, X } from 'lucide-react';
import { useConnectionStatus } from '~/hooks/useConnectionStatus';
import { useTranslation } from '~/hooks';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

/**
 * Composant d'alerte de connexion moderne et fun
 * S'affiche lorsqu'il y a un problème de connexion réseau
 */
export function ConnectionAlert() {
  const { isOnline, hasNetworkError, errorMessage, checkConnection } = useConnectionStatus();
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Afficher l'alerte seulement s'il y a une erreur réseau
  useEffect(() => {
    if (hasNetworkError) {
      setIsVisible(true);
      setIsAnimating(true);
    } else {
      // Délai avant de masquer pour une transition fluide
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsAnimating(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [hasNetworkError]);

  // Ne rien afficher si pas d'erreur
  if (!hasNetworkError || !isVisible) {
    return null;
  }

  const handleRetry = () => {
    setIsAnimating(true);
    checkConnection();
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  // Messages selon le type d'erreur
  const getMessage = () => {
    if (!isOnline) {
      return t.connection?.offline || 'Vous êtes hors ligne';
    }
    
    switch (errorMessage) {
      case 'timeout':
        return t.connection?.timeout || 'La connexion prend trop de temps';
      case 'server_error':
        return t.connection?.serverError || 'Le serveur ne répond pas correctement';
      case 'network_error':
      default:
        return t.connection?.networkError || 'Problème de connexion réseau détecté';
    }
  };

  const getSubMessage = () => {
    if (!isOnline) {
      return t.connection?.offlineSub || 'Vérifiez votre connexion internet';
    }
    return t.connection?.retrySub || 'Veuillez réessayer dans quelques instants';
  };

  return (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-in-out',
        isVisible && isAnimating
          ? 'translate-y-0 opacity-100'
          : '-translate-y-full opacity-0'
      )}
    >
      {/* Alerte avec design moderne */}
      <div className="relative mx-4 mt-4 sm:mx-auto sm:max-w-2xl">
        {/* Effet de glow animé */}
        <div className="absolute inset-0 bg-babana-cyan/20 dark:bg-babana-cyan/10 rounded-2xl blur-xl animate-pulse" />
        
        {/* Carte principale avec glassmorphism */}
        <div className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-2 border-babana-cyan/30 dark:border-babana-cyan/20 rounded-2xl shadow-2xl overflow-hidden">
          {/* Barre de progression animée en haut */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-babana-cyan via-babana-blue to-babana-cyan animate-gradient bg-size-\[200\%_auto\]" />
          
          <div className="p-4 sm:p-6">
            <div className="flex items-start gap-4">
              {/* Icône animée */}
              <div className="relative shrink-0">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-babana-cyan/30 dark:bg-babana-cyan/20 rounded-full blur-lg animate-pulse" />
                
                {/* Icône principale */}
                <div className="relative bg-linear-to-br from-babana-cyan/20 to-babana-blue/20 dark:from-babana-cyan/10 dark:to-babana-blue/10 p-3 rounded-xl border border-babana-cyan/30">
                  {isOnline ? (
                    <WifiOff className="w-6 h-6 sm:w-7 sm:h-7 text-babana-cyan animate-pulse" />
                  ) : (
                    <WifiOff className="w-6 h-6 sm:w-7 sm:h-7 text-orange-500 animate-bounce" />
                  )}
                </div>
              </div>

              {/* Contenu */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-foreground mb-1 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-babana-cyan" />
                      {t.connection?.title || 'Problème de connexion'}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground font-medium">
                      {getMessage()}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      {getSubMessage()}
                    </p>
                  </div>
                  
                  {/* Bouton fermer */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDismiss}
                    className="h-8 w-8 shrink-0 rounded-lg hover:bg-babana-cyan/10 dark:hover:bg-babana-cyan/20"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-4">
                  <Button
                    onClick={handleRetry}
                    size="sm"
                    className="bg-linear-to-r from-babana-cyan to-babana-blue hover:from-babana-cyan-dark hover:to-babana-blue-dark text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <RefreshCw className={cn(
                      'w-4 h-4 mr-2',
                      isAnimating && 'animate-spin'
                    )} />
                    {t.connection?.retry || 'Réessayer'}
                  </Button>
                  
                  {!isOnline && (
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                      <span>{t.connection?.checking || 'Vérification en cours...'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Indicateur de statut animé en bas */}
          <div className="h-1 bg-linear-to-r from-transparent via-babana-cyan/50 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

