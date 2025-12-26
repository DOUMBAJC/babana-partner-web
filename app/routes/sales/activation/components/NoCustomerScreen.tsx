import { User } from 'lucide-react';
import { Card, Button } from '~/components';

interface NoCustomerScreenProps {
  onGoToSearch: () => void;
  onGoHome: () => void;
}

export function NoCustomerScreen({ onGoToSearch, onGoHome }: NoCustomerScreenProps) {
  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-lg border-orange-200 bg-orange-50/50 p-8 text-center backdrop-blur-xl dark:border-orange-900/50 dark:bg-orange-900/10">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-orange-100 p-4 dark:bg-orange-900/30">
            <User className="h-12 w-12 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Client manquant
        </h2>
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          Aucun client n'a été sélectionné pour l'activation. Veuillez d'abord rechercher et sélectionner un client.
        </p>

        <div className="space-y-3">
          <Button
            onClick={onGoToSearch}
            className="w-full bg-linear-to-r from-orange-600 to-orange-600 hover:from-orange-700 hover:to-orange-700"
          >
            <User className="w-4 h-4 mr-2" />
            Aller à la recherche client
          </Button>

          <Button
            onClick={onGoHome}
            variant="ghost"
            className="w-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            Retour à l'accueil
          </Button>
        </div>
      </Card>
    </div>
  );
}
