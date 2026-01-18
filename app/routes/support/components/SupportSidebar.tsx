import { ContactInfo } from "./ContactInfo";
import { ResponseTime } from "./ResponseTime";
import { Card, CardContent, CardHeader, CardTitle, Button } from "~/components";
import { useTranslation } from "~/hooks";
import { HelpCircle, Shield } from "lucide-react";

export function SupportSidebar() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <ContactInfo />
      <ResponseTime />
      
      {/* Carte FAQ rapide */}
      <Card className="border-2 border-babana-cyan/20 dark:border-babana-cyan/10 shadow-xl backdrop-blur-sm bg-card/80 dark:bg-card/90">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <HelpCircle className="w-5 h-5 text-babana-cyan" />
            {t.pages.support.faq.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {t.pages.support.faq.description}
          </p>
          <Button
            variant="outline"
            className="w-full border-babana-cyan/30 hover:bg-babana-cyan/10 hover:border-babana-cyan transition-colors"
          >
            {t.pages.support.faq.button}
          </Button>
        </CardContent>
      </Card>

      {/* Carte sécurité */}
      <Card className="border-2 border-green-500/20 dark:border-green-500/10 shadow-xl backdrop-blur-sm bg-green-500/5 dark:bg-green-500/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="w-5 h-5 text-green-500" />
            {t.pages.support.security.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {t.pages.support.security.description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

