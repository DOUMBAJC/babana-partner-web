import { Sparkles, Smartphone, User } from 'lucide-react';
import { Card, Button } from '~/components';

interface ErrorScreenProps {
  errorMessage: string;
  onRetry: () => void;
  onGoToSearch: () => void;
  onGoHome: () => void;
}

export function ErrorScreen({ errorMessage, onRetry, onGoToSearch, onGoHome }: ErrorScreenProps) {
  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-lg border-red-200 bg-red-50/50 p-8 text-center backdrop-blur-xl dark:border-red-900/50 dark:bg-red-900/10">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/30">
            <Sparkles className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Erreur d'activation
        </h2>
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          {errorMessage}
        </p>

        <div className="space-y-3">
          <Button
            onClick={onRetry}
            className="w-full bg-linear-to-r from-red-600 to-red-600 hover:from-red-700 hover:to-red-700"
          >
            <Smartphone className="w-4 h-4 mr-2" />
            Réessayer l'activation
          </Button>

          <Button
            onClick={onGoToSearch}
            variant="outline"
            className="w-full border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <User className="w-4 h-4 mr-2" />
            Retour à la recherche
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
