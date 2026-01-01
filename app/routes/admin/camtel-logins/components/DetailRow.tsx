import type React from "react";
import { Copy } from "lucide-react";

export function DetailRow({
  icon: Icon,
  label,
  value,
  copiable = false,
  onCopy,
  copied = false,
  valueClassName = "",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  copiable?: boolean;
  onCopy?: (value: string) => void;
  copied?: boolean;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/40 dark:bg-muted/20 dark:hover:bg-muted/30 transition-colors group">
      <div className="p-2 rounded-lg bg-background border border-border/40">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-muted-foreground uppercase tracking-wide">{label}</div>
        <div className={`text-sm font-medium text-foreground truncate mt-0.5 ${valueClassName}`}>{value}</div>
      </div>
      {copiable && onCopy && value !== "Non renseigné" && value !== "—" && (
        <button
          type="button"
          onClick={() => onCopy(value)}
          className="p-2 rounded-lg hover:bg-background border border-transparent hover:border-border/40 transition-all opacity-0 group-hover:opacity-100"
        >
          <Copy className={`h-3.5 w-3.5 ${copied ? "text-emerald-500" : "text-muted-foreground"}`} />
        </button>
      )}
    </div>
  );
}


