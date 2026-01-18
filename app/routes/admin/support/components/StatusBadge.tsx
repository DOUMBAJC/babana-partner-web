import { Badge } from "~/components";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variants = {
    open: { variant: "default" as const, label: "Ouvert" },
    in_progress: { variant: "secondary" as const, label: "En cours" },
    resolved: { variant: "outline" as const, label: "Résolu" },
    closed: { variant: "secondary" as const, label: "Fermé" },
  };
  
  const config = variants[status as keyof typeof variants] || variants.open;
  
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

