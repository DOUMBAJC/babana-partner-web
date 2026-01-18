import { Sparkles } from "lucide-react";
import { useTranslation } from "~/hooks";

export function SupportHeader() {
  const { t } = useTranslation();

  return (
    <div className="text-center mb-12 md:mb-16 space-y-4">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-babana-cyan/10 dark:bg-babana-cyan/5 border border-babana-cyan/20 dark:border-babana-cyan/10 mb-4">
        <Sparkles className="w-4 h-4 text-babana-cyan animate-pulse" />
        <span className="text-sm font-medium text-babana-cyan dark:text-babana-cyan-light">
          {t.pages.support.badge}
        </span>
      </div>
      
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-linear-to-r from-babana-cyan via-babana-blue to-babana-navy dark:from-babana-cyan-light dark:via-babana-blue-light dark:to-babana-navy-light bg-clip-text text-transparent animate-gradient bg-size-[200%_auto]">
        {t.pages.support.title}
      </h1>
      
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
        {t.pages.support.description}
      </p>
    </div>
  );
}

