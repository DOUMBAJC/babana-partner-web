import { Badge } from "~/components/ui/badge";
import { getStatusConfig } from "../utils/status";
import type { Translations } from "~/lib/i18n/translations";

interface StatusBadgeProps {
  status: string;
  translations: Translations['activationRequests']['status'];
}

export function StatusBadge({ status, translations }: StatusBadgeProps) {
  const config = getStatusConfig(status, translations);
  const Icon = config.icon;
  
  return (
    <Badge className={`${config.className} px-4 py-2 flex items-center gap-2 text-base font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105`}>
      <Icon className={`h-5 w-5 ${config.iconColor}`} />
      {config.label}
    </Badge>
  );
}

