import { Card, CardContent, CardHeader, CardTitle } from "~/components";
import { useTranslation } from "~/hooks";
import { Zap } from "lucide-react";

export function ResponseTime() {
  const { t } = useTranslation();

  return (
    <Card className="border-2 border-babana-cyan/20 dark:border-babana-cyan/10 shadow-xl backdrop-blur-sm bg-linear-to-br from-babana-cyan/5 to-babana-blue/5 dark:from-babana-cyan/10 dark:to-babana-blue/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="w-5 h-5 text-babana-cyan" />
          {t.pages.support.response.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between p-2">
          <span className="text-sm text-muted-foreground">{t.pages.support.response.urgent}</span>
          <span className="font-semibold text-babana-cyan">&lt; 1h</span>
        </div>
        <div className="flex items-center justify-between p-2">
          <span className="text-sm text-muted-foreground">{t.pages.support.response.high}</span>
          <span className="font-semibold text-babana-blue">&lt; 4h</span>
        </div>
        <div className="flex items-center justify-between p-2">
          <span className="text-sm text-muted-foreground">{t.pages.support.response.normal}</span>
          <span className="font-semibold">&lt; 24h</span>
        </div>
        <div className="flex items-center justify-between p-2">
          <span className="text-sm text-muted-foreground">{t.pages.support.response.low}</span>
          <span className="font-semibold">&lt; 48h</span>
        </div>
      </CardContent>
    </Card>
  );
}

