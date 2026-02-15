import { UserIcon, CreditCard, Search, Phone, IdCard, MapPin, FileText, CheckCircle2 } from 'lucide-react';
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
      {/* Main Card with Glassmorphism */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-green-500/10 via-emerald-500/5 to-teal-500/10 border border-green-500/20 backdrop-blur-sm shadow-lg shadow-green-500/5">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-green-400/5 via-transparent to-emerald-400/5 animate-pulse" style={{ animationDuration: '3s' }} />
        
        {/* Content */}
        <div className="relative p-6 md:p-8 space-y-6">
          {/* Header with Success Badge */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/30 rounded-full blur-md animate-pulse" />
                <div className="relative p-3 bg-linear-to-br from-green-500 to-emerald-600 rounded-full text-white shadow-lg">
                  <UserIcon className="h-6 w-6" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <h4 className="font-bold text-green-700 dark:text-green-400 text-xl">
                    {t.customerSearch.results.found}
                  </h4>
                </div>
                <p className="text-sm text-green-600/70 dark:text-green-400/70 mt-0.5">
                  Client vérifié
                </p>
              </div>
            </div>
          </div>

          {/* Customer Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="group relative overflow-hidden rounded-xl bg-background/50 backdrop-blur-sm border border-green-500/10 p-4 hover:border-green-500/30 transition-all duration-300 hover:shadow-md hover:shadow-green-500/5">
              <div className="absolute inset-0 bg-linear-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-start gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300">
                  <UserIcon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                    {t.customerSearch.customerInfo.fullName}
                  </p>
                  <p className="text-sm font-semibold text-foreground truncate">
                    {customer.full_name}
                  </p>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="group relative overflow-hidden rounded-xl bg-background/50 backdrop-blur-sm border border-green-500/10 p-4 hover:border-green-500/30 transition-all duration-300 hover:shadow-md hover:shadow-green-500/5">
              <div className="absolute inset-0 bg-linear-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-start gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300">
                  <Phone className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                    {t.customerSearch.customerInfo.phone}
                  </p>
                  <p className="text-sm font-semibold text-foreground truncate">
                    {customer.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* ID Card Type */}
            <div className="group relative overflow-hidden rounded-xl bg-background/50 backdrop-blur-sm border border-green-500/10 p-4 hover:border-green-500/30 transition-all duration-300 hover:shadow-md hover:shadow-green-500/5">
              <div className="absolute inset-0 bg-linear-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-start gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                    {t.customerSearch.customerInfo.idCardType}
                  </p>
                  <p className="text-sm font-semibold text-foreground truncate">
                    {customer.id_card_type?.name || t.customerSearch.customerInfo.notAvailable}
                  </p>
                </div>
              </div>
            </div>

            {/* ID Card Number */}
            <div className="group relative overflow-hidden rounded-xl bg-background/50 backdrop-blur-sm border border-green-500/10 p-4 hover:border-green-500/30 transition-all duration-300 hover:shadow-md hover:shadow-green-500/5">
              <div className="absolute inset-0 bg-linear-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-start gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300">
                  <IdCard className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                    {t.customerSearch.customerInfo.idCardNumber}
                  </p>
                  <p className="text-sm font-semibold text-foreground truncate">
                    {customer.id_card_number}
                  </p>
                </div>
              </div>
            </div>

            {/* Address (Full Width if present) */}
            {customer.address && (
              <div className="group relative overflow-hidden rounded-xl bg-background/50 backdrop-blur-sm border border-green-500/10 p-4 hover:border-green-500/30 transition-all duration-300 hover:shadow-md hover:shadow-green-500/5 md:col-span-2">
                <div className="absolute inset-0 bg-linear-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-start gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                      {t.customerSearch.customerInfo.address}
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {customer.address}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Statut d'activation */}
          {activationStatus && (
            <ActivationStatusCard activationStatus={activationStatus} />
          )}
        </div>
      </div>

      {/* Actions */}
      {activationStatus && (
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <Button 
            type="button"
            onClick={onActivateCustomer}
            disabled={!activationStatus.can_activate}
            className="group relative flex-1 h-16 text-lg font-semibold rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl"
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
            className="group sm:w-auto h-16 text-lg font-medium rounded-2xl border-2 border-border hover:border-primary/50 bg-background hover:bg-primary/5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
          >
            <Search className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            {t.customerSearch.results.newSearch}
          </Button>
        </div>
      )}
    </>
  );
}

