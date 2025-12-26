import { CheckCircle, Smartphone, User } from 'lucide-react';
import { Card, Button } from '~/components';
import { useTranslation } from '~/hooks';

interface SuccessScreenProps {
  onGoToSearch: () => void;
  onNewActivation: () => void;
  onGoHome: () => void;
}

export function SuccessScreen({ onGoToSearch, onNewActivation, onGoHome }: SuccessScreenProps) {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-lg border-green-200 bg-green-50/50 p-8 text-center backdrop-blur-xl dark:border-green-900/50 dark:bg-green-900/10">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/30">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
          {t.common.success}
        </h2>
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          {t.simActivation.success}
        </p>

        <div className="space-y-3">
          <Button
            onClick={onGoToSearch}
            className="w-full bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            <User className="w-4 h-4 mr-2" />
            {t.simActivation.backToSearch}
          </Button>

          <Button
            onClick={onNewActivation}
            variant="outline"
            className="w-full border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/20"
          >
            <Smartphone className="w-4 h-4 mr-2" />
            Nouvelle activation
          </Button>

          <Button
            onClick={onGoHome}
            variant="ghost"
            className="w-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            {t.actions.back}
          </Button>
        </div>
      </Card>
    </div>
  );
}
