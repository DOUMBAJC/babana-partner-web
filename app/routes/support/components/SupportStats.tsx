import { Card } from "~/components";
import { useTranslation } from "~/hooks";

export function SupportStats() {
  const { t } = useTranslation();

  return (
    <div className="mt-16 grid md:grid-cols-3 gap-6">
      <Card className="border-2 border-babana-cyan/20 dark:border-babana-cyan/10 shadow-lg backdrop-blur-sm bg-card/80 dark:bg-card/90 text-center p-6">
        <div className="text-3xl font-bold text-babana-cyan mb-2">24/7</div>
        <p className="text-sm text-muted-foreground">{t.pages.support.stats.availability}</p>
      </Card>
      <Card className="border-2 border-babana-cyan/20 dark:border-babana-cyan/10 shadow-lg backdrop-blur-sm bg-card/80 dark:bg-card/90 text-center p-6">
        <div className="text-3xl font-bold text-babana-blue mb-2">&lt; 2h</div>
        <p className="text-sm text-muted-foreground">{t.pages.support.stats.averageResponse}</p>
      </Card>
      <Card className="border-2 border-babana-cyan/20 dark:border-babana-cyan/10 shadow-lg backdrop-blur-sm bg-card/80 dark:bg-card/90 text-center p-6">
        <div className="text-3xl font-bold text-green-500 mb-2">98%</div>
        <p className="text-sm text-muted-foreground">{t.pages.support.stats.satisfaction}</p>
      </Card>
    </div>
  );
}

