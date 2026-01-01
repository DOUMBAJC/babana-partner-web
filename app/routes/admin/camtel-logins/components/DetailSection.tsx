import type React from "react";

export function DetailSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/40 bg-card overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border/40 bg-muted/30">
        <div className="p-2 rounded-lg bg-babana-cyan/10 dark:bg-babana-cyan/15">
          <Icon className="h-4 w-4 text-babana-cyan" />
        </div>
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}


