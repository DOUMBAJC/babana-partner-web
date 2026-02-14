import { Info, CheckCircle, XCircle, TrendingUp, Target, AlertTriangle } from 'lucide-react';
import { useTranslation } from '~/hooks';
import type { ActivationStatus } from '../config';
import { MAX_ACTIVATIONS_PER_CUSTOMER } from '../config';

interface ActivationStatusCardProps {
  activationStatus: ActivationStatus;
}

/**
 * Composant affichant le statut d'activation d'un client
 * Limite maximale : 3 activations par client
 */
export function ActivationStatusCard({ activationStatus }: ActivationStatusCardProps) {
  const { t } = useTranslation();

  const maxActivations = activationStatus.max_activations || MAX_ACTIVATIONS_PER_CUSTOMER;
  const remainingActivations = activationStatus.remaining_activations || maxActivations - activationStatus.activations_count;
  const progressPercentage = (activationStatus.activations_count / maxActivations) * 100;

  return (
    <div className="mt-6 pt-6 border-t border-green-500/20">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg">
          <Info className="h-5 w-5 text-green-600 dark:text-green-400" />
        </div>
        <h5 className="font-bold text-green-700 dark:text-green-400 text-base">
          {t.customerSearch.activationStatus.title}
        </h5>
      </div>

      {/* Progress Bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Progression
          </span>
          <span className="text-xs font-bold text-foreground">
            {activationStatus.activations_count} / {maxActivations}
          </span>
        </div>
        <div className="relative h-3 bg-background/50 rounded-full overflow-hidden border border-green-500/10">
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-500 ease-out shadow-lg shadow-green-500/30"
            style={{ width: `${progressPercentage}%` }}
          />
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-white/30 to-transparent rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Activations Count */}
        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 p-4 hover:border-blue-500/40 transition-all duration-300 hover:shadow-md hover:shadow-blue-500/10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-blue-500/20 rounded-md">
                <TrendingUp className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-xs font-medium text-blue-600/80 dark:text-blue-400/80 uppercase tracking-wide">
                {t.customerSearch.activationStatus.activations}
              </p>
            </div>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {activationStatus.activations_count}
            </p>
          </div>
        </div>

        {/* Remaining */}
        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 p-4 hover:border-amber-500/40 transition-all duration-300 hover:shadow-md hover:shadow-amber-500/10">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-amber-500/20 rounded-md">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              </div>
              <p className="text-xs font-medium text-amber-600/80 dark:text-amber-400/80 uppercase tracking-wide">
                {t.customerSearch.activationStatus.remaining}
              </p>
            </div>
            <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
              {remainingActivations}
            </p>
          </div>
        </div>

        {/* Maximum */}
        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 p-4 hover:border-purple-500/40 transition-all duration-300 hover:shadow-md hover:shadow-purple-500/10">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-purple-500/20 rounded-md">
                <Target className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-xs font-medium text-purple-600/80 dark:text-purple-400/80 uppercase tracking-wide">
                {t.customerSearch.activationStatus.maximum}
              </p>
            </div>
            <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              {maxActivations}
            </p>
          </div>
        </div>

        {/* Can Activate Status */}
        <div className={`group relative overflow-hidden rounded-xl p-4 transition-all duration-300 hover:shadow-md ${
          activationStatus.can_activate 
            ? 'bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 hover:border-green-500/40 hover:shadow-green-500/10' 
            : 'bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 hover:border-red-500/40 hover:shadow-red-500/10'
        }`}>
          <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
            activationStatus.can_activate ? 'from-green-500/5' : 'from-red-500/5'
          } to-transparent`} />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <p className={`text-xs font-medium uppercase tracking-wide ${
                activationStatus.can_activate 
                  ? 'text-green-600/80 dark:text-green-400/80' 
                  : 'text-red-600/80 dark:text-red-400/80'
              }`}>
                {t.customerSearch.activationStatus.canActivate}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {activationStatus.can_activate ? (
                <>
                  <CheckCircle className="h-7 w-7 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-semibold text-green-700 dark:text-green-300">Oui</span>
                </>
              ) : (
                <>
                  <XCircle className="h-7 w-7 text-red-600 dark:text-red-400" />
                  <span className="text-sm font-semibold text-red-700 dark:text-red-300">Non</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Warning Message */}
      {!activationStatus.can_activate && (
        <div className="mt-4 relative overflow-hidden rounded-xl bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 p-4 shadow-md shadow-red-500/5">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent" />
          <div className="relative flex items-start gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-red-700 dark:text-red-300 mb-1">
                Limite atteinte
              </p>
              <p className="text-sm text-red-600 dark:text-red-400">
                {t.customerSearch.activationStatus.limitReachedWarning} ({maxActivations})
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

