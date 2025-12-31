import { Info, CheckCircle, XCircle } from 'lucide-react';
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

  return (
    <div className="mt-4 pt-4 border-t border-green-500/20">
      <div className="flex items-center gap-2 mb-3">
        <Info className="h-4 w-4 text-green-600" />
        <h5 className="font-semibold text-green-700 dark:text-green-400 text-sm">
          {t.customerSearch.activationStatus.title}
        </h5>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-background/50 p-3 rounded-lg">
          <p className="text-xs text-muted-foreground">
            {t.customerSearch.activationStatus.activations}
          </p>
          <p className="text-lg font-bold text-foreground">
            {activationStatus.activations_count}
          </p>
        </div>
        <div className="bg-background/50 p-3 rounded-lg">
          <p className="text-xs text-muted-foreground">
            {t.customerSearch.activationStatus.remaining}
          </p>
          <p className="text-lg font-bold text-foreground">
            {activationStatus.remaining_activations || MAX_ACTIVATIONS_PER_CUSTOMER - activationStatus.activations_count}
          </p>
        </div>
        <div className="bg-background/50 p-3 rounded-lg">
          <p className="text-xs text-muted-foreground">
            {t.customerSearch.activationStatus.maximum}
          </p>
          <p className="text-lg font-bold text-foreground">
            {activationStatus.max_activations || MAX_ACTIVATIONS_PER_CUSTOMER}
          </p>
        </div>
        <div className="bg-background/50 p-3 rounded-lg">
          <p className="text-xs text-muted-foreground">
            {t.customerSearch.activationStatus.canActivate}
          </p>
          {activationStatus.can_activate ? (
            <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
          ) : (
            <XCircle className="h-6 w-6 text-red-600 mt-1" />
          )}
        </div>
      </div>
      {!activationStatus.can_activate && (
        <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">
            ⚠️ {t.customerSearch.activationStatus.limitReachedWarning} ({activationStatus.max_activations || MAX_ACTIVATIONS_PER_CUSTOMER})
          </p>
        </div>
      )}
    </div>
  );
}

