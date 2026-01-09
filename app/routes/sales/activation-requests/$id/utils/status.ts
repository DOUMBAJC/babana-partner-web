import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Zap 
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Translations } from "~/lib/i18n/translations";

export interface StatusConfig {
  label: string;
  className: string;
  icon: LucideIcon;
  iconColor: string;
}

export function getStatusConfig(
  status: string,
  translations: Translations['activationRequests']['status']
): StatusConfig {
  const configs: Record<string, StatusConfig> = {
    pending: {
      label: translations.pending,
      className: "bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0",
      icon: Clock,
      iconColor: "text-white animate-pulse"
    },
    processing: {
      label: translations.processing,
      className: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0",
      icon: Zap,
      iconColor: "text-white animate-bounce"
    },
    approved: {
      label: translations.activated,
      className: "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0",
      icon: CheckCircle,
      iconColor: "text-white"
    },
    activated: {
      label: translations.activated,
      className: "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0",
      icon: CheckCircle,
      iconColor: "text-white"
    },
    rejected: {
      label: translations.rejected,
      className: "bg-gradient-to-r from-red-500 to-pink-600 text-white border-0",
      icon: XCircle,
      iconColor: "text-white"
    },
    cancelled: {
      label: translations.cancelled,
      className: "bg-gradient-to-r from-gray-500 to-slate-600 text-white border-0",
      icon: AlertCircle,
      iconColor: "text-white"
    },
  };

  return configs[status] || configs.pending;
}

