import { Sparkles } from 'lucide-react';
import { Card, Button } from '~/components';
import { useTranslation } from '~/hooks';

interface AccessDeniedProps {
  onBack: () => void;
}

export function AccessDenied({ onBack }: AccessDeniedProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-red-200 bg-red-50/50 p-8 text-center backdrop-blur-xl dark:border-red-900/50 dark:bg-red-900/10">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/30">
            <Sparkles className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
          {t.common.accessDenied}
        </h2>
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          {t.common.forbidden}
        </p>
        <Button
          onClick={onBack}
          className="w-full bg-linear-to-r from-red-600 to-red-600 hover:from-red-700 hover:to-red-700"
        >
          {t.actions.back}
        </Button>
      </Card>
    </div>
  );
}
