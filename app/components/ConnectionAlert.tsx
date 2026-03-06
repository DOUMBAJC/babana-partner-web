import { useEffect, useState, useRef } from 'react';
import { WifiOff, RefreshCw, X, CheckCircle2, CloudOff } from 'lucide-react';
import { useConnectionStatus } from '~/hooks/useConnectionStatus';
import { useTranslation } from '~/hooks';
import { cn } from '~/lib/utils';

/**
 * Composant d'alerte de connexion — design toast minimaliste
 */
export function ConnectionAlert() {
  const { isOnline, hasNetworkError, errorMessage, checkConnection } = useConnectionStatus();
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const previousErrorState = useRef(hasNetworkError);
  const successDismissedRef = useRef(false);
  const autoHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAutoHideTimer = () => {
    if (autoHideTimerRef.current) {
      clearTimeout(autoHideTimerRef.current);
      autoHideTimerRef.current = null;
    }
  };

  useEffect(() => {
    if (previousErrorState.current && !hasNetworkError && isOnline && !successDismissedRef.current) {
      setIsSuccess(true);
      setIsVisible(true);
      setIsAnimating(true);
      clearAutoHideTimer();
      autoHideTimerRef.current = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(() => {
          setIsVisible(false);
          setIsSuccess(false);
          successDismissedRef.current = false;
        }, 400);
      }, 3500);
    }

    if (hasNetworkError) {
      setIsSuccess(false);
      setIsVisible(true);
      setIsAnimating(true);
      successDismissedRef.current = false;
      clearAutoHideTimer();
    } else if (!hasNetworkError && !isSuccess && !successDismissedRef.current) {
      clearAutoHideTimer();
      const t = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(() => setIsVisible(false), 400);
      }, 300);
      return () => clearTimeout(t);
    }

    previousErrorState.current = hasNetworkError;
    return () => clearAutoHideTimer();
  }, [hasNetworkError, isOnline, isSuccess]);

  if ((!hasNetworkError && !isSuccess) || !isVisible) return null;

  const handleRetry = () => {
    setIsRetrying(true);
    checkConnection();
    setTimeout(() => setIsRetrying(false), 2000);
  };

  const handleDismiss = () => {
    clearAutoHideTimer();
    if (isSuccess) successDismissedRef.current = true;
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      setIsSuccess(false);
    }, 400);
  };

  const label = isSuccess
    ? (t.connection?.restored || 'Connexion rétablie')
    : !isOnline
    ? (t.connection?.offline || 'Hors ligne')
    : errorMessage === 'timeout'
    ? (t.connection?.timeout || 'Temps d\'attente dépassé')
    : (t.connection?.networkError || 'Connexion interrompue');

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]',
        'transition-all duration-400 ease-out',
        isAnimating
          ? 'translate-y-0 opacity-100 scale-100'
          : 'translate-y-4 opacity-0 scale-95'
      )}
      style={{ transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.35s ease, scale 0.35s ease' }}
    >
      <div
        className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl',
          'backdrop-blur-2xl border',
          'min-w-[260px] max-w-[420px] w-max',
          isSuccess
            ? [
                'bg-emerald-950/80 border-emerald-500/25',
                'shadow-emerald-900/40',
              ]
            : [
                'bg-gray-950/85 border-white/10',
                'shadow-black/50',
              ]
        )}
      >
        {/* Icône */}
        <div
          className={cn(
            'flex items-center justify-center w-8 h-8 rounded-xl shrink-0',
            isSuccess
              ? 'bg-emerald-500/15 text-emerald-400'
              : 'bg-white/5 text-red-400'
          )}
        >
          {isSuccess ? (
            <CheckCircle2 className="w-4 h-4" strokeWidth={2.5} />
          ) : isOnline ? (
            <WifiOff className="w-4 h-4" strokeWidth={2.5} />
          ) : (
            <CloudOff className="w-4 h-4" strokeWidth={2.5} />
          )}
        </div>

        {/* Texte */}
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              'text-sm font-semibold leading-tight tracking-tight truncate',
              isSuccess ? 'text-emerald-300' : 'text-white'
            )}
          >
            {label}
          </p>
          {!isSuccess && (
            <p className="text-xs text-white/40 mt-0.5 leading-tight">
              {t.connection?.retrySub || 'Vérifiez votre connexion'}
            </p>
          )}
        </div>

        {/* Séparateur vertical */}
        <div className="w-px h-6 bg-white/10 shrink-0" />

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {!isSuccess && (
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold',
                'transition-all duration-200 active:scale-95',
                'bg-white/10 hover:bg-white/15 text-white/80 hover:text-white',
                isRetrying && 'opacity-60 cursor-not-allowed'
              )}
              aria-label={t.connection?.retry || 'Réessayer'}
            >
              <RefreshCw
                className={cn('w-3 h-3', isRetrying && 'animate-spin')}
                strokeWidth={2.5}
              />
              <span>{t.connection?.retry || 'Réessayer'}</span>
            </button>
          )}

          <button
            onClick={handleDismiss}
            className={cn(
              'flex items-center justify-center w-7 h-7 rounded-lg',
              'transition-all duration-200 active:scale-90',
              'text-white/30 hover:text-white/70 hover:bg-white/8'
            )}
            aria-label="Fermer"
          >
            <X className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>
        </div>

        {/* Barre de progression auto-dismiss (succès uniquement) */}
        {isSuccess && (
          <div
            className="absolute bottom-0 left-0 h-[2px] rounded-full bg-emerald-400/60 animate-shrink-x"
            style={{
              width: '100%',
              animation: 'shrinkX 3.5s linear forwards',
            }}
          />
        )}
      </div>

      {/* Keyframe inline */}
      <style>{`
        @keyframes shrinkX {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  );
}
