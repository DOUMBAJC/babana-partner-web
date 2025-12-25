import { UserIcon, CreditCard, Search } from 'lucide-react';
import { Button } from '~/components';
import { useTranslation } from '~/hooks';
import type { Customer } from '~/types/customer.types';
import type { ActivationStatus } from '../config';
import { ActivationStatusCard } from './ActivationStatusCard';

interface CustomerFoundCardProps {
  customer: Customer;
  activationStatus: ActivationStatus | null;
  onActivateCustomer: () => void;
  onReset: () => void;
}

/**
 * Composant affiché lorsqu'un client est trouvé
 */
export function CustomerFoundCard({
  customer,
  activationStatus,
  onActivateCustomer,
  onReset
}: CustomerFoundCardProps) {
  const { t } = useTranslation();

  return (
    <>
      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 space-y-4">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-green-500/20 rounded-full text-green-600 mt-1">
            <UserIcon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-green-700 dark:text-green-400 text-lg">
              {t.customerSearch.results.found}
            </h4>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-foreground">
                <span className="font-medium">{t.customerSearch.customerInfo.fullName}:</span> {customer.full_name}
              </p>
              <p className="text-sm text-foreground">
                <span className="font-medium">{t.customerSearch.customerInfo.phone}:</span> {customer.phone}
              </p>
              <p className="text-sm text-foreground">
                <span className="font-medium">{t.customerSearch.customerInfo.idCardType}:</span> {customer.id_card_type?.name || 'N/A'}
              </p>
              <p className="text-sm text-foreground">
                <span className="font-medium">{t.customerSearch.customerInfo.idCardNumber}:</span> {customer.id_card_number}
              </p>
              {customer.address && (
                <p className="text-sm text-foreground">
                  <span className="font-medium">{t.customerSearch.customerInfo.address}:</span> {customer.address}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Statut d'activation */}
        {activationStatus && (
          <ActivationStatusCard activationStatus={activationStatus} />
        )}
      </div>

      {/* Actions */}
      {activationStatus && (
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <Button 
            type="button"
            onClick={onActivateCustomer}
            disabled={!activationStatus.can_activate}
            className="group relative flex-1 h-16 text-lg font-semibold rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{
              background: activationStatus.can_activate 
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
            }}
          >
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" style={{ clipPath: 'polygon(0 80%, 100% 60%, 100% 100%, 0% 100%)' }} />
            <CreditCard className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
            <span className="relative z-10 text-white">
              {activationStatus.can_activate ? t.customerSearch.results.sellSim : t.customerSearch.results.limitReached}
            </span>
          </Button>
          <Button 
            type="button"
            onClick={onReset}
            variant="outline"
            className="group sm:w-auto h-16 text-lg font-medium rounded-2xl border-2 border-border hover:border-primary/50 bg-background hover:bg-primary/5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Search className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            {t.customerSearch.results.newSearch}
          </Button>
        </div>
      )}
    </>
  );
}

