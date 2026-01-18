import { Badge } from "~/components";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { useTranslation } from "~/hooks";

interface PriorityBadgeProps {
  priority: string;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const { t } = useTranslation();
  
  const variants = {
    urgent: { variant: "destructive" as const, icon: AlertTriangle, emoji: "🔥" },
    high: { variant: "destructive" as const, icon: AlertCircle, emoji: "⚡" },
    normal: { variant: "default" as const, icon: Info, emoji: "📋" },
    low: { variant: "secondary" as const, icon: Info, emoji: "📌" },
  };
  
  const config = variants[priority as keyof typeof variants] || variants.normal;
  const Icon = config.icon;
  
  return (
    <Badge variant={config.variant} className="gap-1">
      <Icon className="h-3 w-3" />
      <span>{config.emoji}</span>
      {t.pages?.support?.form?.priorities?.[priority as keyof typeof t.pages.support.form.priorities] || priority}
    </Badge>
  );
}

