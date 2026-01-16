import { useEffect, useState, useRef } from 'react';
import { Wifi, WifiOff, RefreshCw, AlertCircle, X, CheckCircle2 } from 'lucide-react';
import { useConnectionStatus } from '~/hooks/useConnectionStatus';
import { useTranslation } from '~/hooks';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

/**
 * Composant d'alerte de connexion moderne et fun
 * S'affiche lorsqu'il y a un problème de connexion réseau ou quand la connexion revient
 */
export function ConnectionAlert() {
  const { isOnline, hasNetworkError, errorMessage, checkConnection } = useConnectionStatus();
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const previousErrorState = useRef(hasNetworkError);

  // Détecter le retour de connexion (passage de hasNetworkError: true à false)
  useEffect(() => {
    // Si on passe d'une erreur à pas d'erreur, c'est un succès
    if (previousErrorState.current && !hasNetworkError && isOnline) {
      setIsSuccess(true);
      setIsVisible(true);
      setIsAnimating(true);
      
      // Masquer automatiquement après 4 secondes
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsAnimating(false);
        setIsSuccess(false);
      }, 4000);
      
      return () => clearTimeout(timer);
    }
    
    // Si on a une erreur, c'est une alerte d'erreur
    if (hasNetworkError) {
      setIsSuccess(false);
      setIsVisible(true);
      setIsAnimating(true);
    } else if (!hasNetworkError && !isSuccess) {
      // Si pas d'erreur et pas de succès en cours, masquer
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsAnimating(false);
      }, 500);
      return () => clearTimeout(timer);
    }
    
    previousErrorState.current = hasNetworkError;
  }, [hasNetworkError, isOnline, isSuccess]);

  // Ne rien afficher si pas d'erreur et pas de succès
  if ((!hasNetworkError && !isSuccess) || !isVisible) {
    return null;
  }

  const handleRetry = () => {
    setIsAnimating(true);
    checkConnection();
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsSuccess(false);
  };

  // Messages selon le type d'erreur ou succès
  const getMessage = () => {
    if (isSuccess) {
      return t.connection?.restored || 'Connexion rétablie';
    }
    
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
    if (isSuccess) {
      return t.connection?.restoredSub || 'Votre connexion internet est de retour';
    }
    
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
        {/* Effet de glow animé - vert pour succès, cyan pour erreur */}
        <div className={cn(
          'absolute inset-0 rounded-2xl blur-xl animate-pulse',
          isSuccess 
            ? 'bg-green-500/20 dark:bg-green-500/10'
            : 'bg-babana-cyan/20 dark:bg-babana-cyan/10'
        )} />
        
        {/* Carte principale avec glassmorphism */}
        <div className={cn(
          'relative backdrop-blur-xl border-2 rounded-2xl shadow-2xl overflow-hidden',
          isSuccess
            ? 'bg-white/95 dark:bg-gray-900/95 border-green-500/30 dark:border-green-500/20'
            : 'bg-white/95 dark:bg-gray-900/95 border-babana-cyan/30 dark:border-babana-cyan/20'
        )}>
          {/* Barre de progression animée en haut */}
          <div className={cn(
            'absolute top-0 left-0 right-0 h-1 animate-gradient bg-size-\[200\%_auto\]',
            isSuccess
              ? 'bg-linear-to-r from-green-500 via-emerald-500 to-green-500'
              : 'bg-linear-to-r from-babana-cyan via-babana-blue to-babana-cyan'
          )} />
          
          <div className="p-4 sm:p-6">
            <div className="flex items-start gap-4">
              {/* Icône animée */}
              <div className="relative shrink-0">
                {/* Glow effect */}
                <div className={cn(
                  'absolute inset-0 rounded-full blur-lg animate-pulse',
                  isSuccess
                    ? 'bg-green-500/30 dark:bg-green-500/20'
                    : 'bg-babana-cyan/30 dark:bg-babana-cyan/20'
                )} />
                
                {/* Icône principale */}
                <div className={cn(
                  'relative p-3 rounded-xl border',
                  isSuccess
                    ? 'bg-linear-to-br from-green-500/20 to-emerald-500/20 dark:from-green-500/10 dark:to-emerald-500/10 border-green-500/30'
                    : 'bg-linear-to-br from-babana-cyan/20 to-babana-blue/20 dark:from-babana-cyan/10 dark:to-babana-blue/10 border-babana-cyan/30'
                )}>
                  {isSuccess ? (
                    <Wifi className="w-6 h-6 sm:w-7 sm:h-7 text-green-500 animate-pulse" />
                  ) : isOnline ? (
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
                    <h3 className={cn(
                      'text-base sm:text-lg font-bold mb-1 flex items-center gap-2',
                      isSuccess ? 'text-green-600 dark:text-green-400' : 'text-foreground'
                    )}>
                      {isSuccess ? (
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-babana-cyan" />
                      )}
                      {isSuccess 
                        ? (t.connection?.restored || 'Connexion rétablie')
                        : (t.connection?.title || 'Problème de connexion')
                      }
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
                    className={cn(
                      'h-8 w-8 shrink-0 rounded-lg',
                      isSuccess 
                        ? 'hover:bg-green-500/10 dark:hover:bg-green-500/20'
                        : 'hover:bg-babana-cyan/10 dark:hover:bg-babana-cyan/20'
                    )}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Actions - seulement pour les erreurs */}
                {!isSuccess && (
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
                )}
              </div>
            </div>
          </div>

          {/* Indicateur de statut animé en bas */}
          <div className={cn(
            'h-1 bg-linear-to-r from-transparent to-transparent animate-shimmer',
            isSuccess
              ? 'via-green-500/50'
              : 'via-babana-cyan/50'
          )} />
        </div>
      </div>
    </div>
  );
}
