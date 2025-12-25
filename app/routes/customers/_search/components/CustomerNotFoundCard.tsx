import { UserIcon, Search } from 'lucide-react';
import { Button } from '~/components';
import { useTranslation } from '~/hooks';

interface CustomerNotFoundCardProps {
  onCreateCustomer: () => void;
  onReset: () => void;
}

/**
 * Composant affiché lorsqu'aucun client n'est trouvé
 */
export function CustomerNotFoundCard({ onCreateCustomer, onReset }: CustomerNotFoundCardProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row gap-4 pt-6">
      <Button 
        type="button"
        onClick={onCreateCustomer}
        className="group relative flex-1 h-16 text-lg font-semibold rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        style={{
          background: 'linear-gradient(135deg, #5FC8E9 0%, #4BA8C8 100%)',
        }}
      >
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12" />
        <UserIcon className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300 relative z-10" />
        <span className="relative z-10 text-white">
          {t.customerSearch.results.createCustomer}
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
  );
}

