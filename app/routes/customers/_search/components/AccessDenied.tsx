import { ShieldCheck } from 'lucide-react';
import { Button } from '~/components';
import { useTranslation } from '~/hooks';

interface AccessDeniedProps {
  onBackHome: () => void;
}

/**
 * Composant affiché lorsque l'utilisateur n'a pas accès à la recherche de clients
 */
export function AccessDenied({ onBackHome }: AccessDeniedProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="bg-destructive/10 p-6 rounded-full w-24 h-24 mx-auto flex items-center justify-center ring-4 ring-destructive/5">
          <ShieldCheck className="h-12 w-12 text-destructive" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {t.customerSearch.accessDenied.title}
        </h1>
        <p className="text-muted-foreground text-lg">
          {t.customerSearch.accessDenied.message}
        </p>
        <Button 
          className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-primary/25"
          onClick={onBackHome}
        >
          {t.customerSearch.accessDenied.backHome}
        </Button>
      </div>
    </div>
  );
}

