import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { useTranslation } from "~/hooks";

interface AccessDeniedProps {
  onBack: () => void;
}

export function AccessDenied({ onBack }: AccessDeniedProps) {
  const { t } = useTranslation();
  
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <Card className="p-12 text-center">
        <div className="flex flex-col items-center gap-6">
          <div className="p-4 bg-red-100 dark:bg-red-900 rounded-full">
            <ShieldAlert className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              {t.activationRequests.accessDenied.title}
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              {t.activationRequests.accessDenied.message}
            </p>
          </div>

          <Button onClick={onBack} size="lg" className="mt-4">
            {t.activationRequests.accessDenied.backHome}
          </Button>
        </div>
      </Card>
    </div>
  );
}

