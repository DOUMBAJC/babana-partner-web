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
    <div className="bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
        <div className="relative">
          <div className="absolute inset-0 bg-babana-cyan/25 blur-lg rounded-xl" />
          <div className="relative bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm p-2.5 rounded-xl border border-white/40 dark:border-slate-700 shadow-sm">
            <Icon className="h-4 w-4 text-babana-cyan" />
          </div>
        </div>
        <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">
          {title}
        </h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}


