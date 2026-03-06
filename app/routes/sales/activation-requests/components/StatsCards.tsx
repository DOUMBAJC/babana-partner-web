import { CheckCircle2, Clock, AlertCircle, Ban, TrendingUp, ArrowUpRight } from "lucide-react";
import { useTranslation } from "~/hooks";
import type { ActivationRequestStats } from "~/types";

interface StatsCardsProps {
  stats: ActivationRequestStats;
}

function pct(value: number, total: number): number {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

export function StatsCards({ stats }: StatsCardsProps) {
  const { t } = useTranslation();

  const secondary = [
    {
      title: t.activationRequests.stats.pending,
      value: stats.pending,
      icon: Clock,
      percent: pct(stats.pending, stats.total),
      accent: "bg-amber-500",
      iconBg: "bg-amber-50 dark:bg-amber-950/60",
      iconColor: "text-amber-600 dark:text-amber-400",
      bar: "bg-amber-400",
      badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
      description: t.activationRequests.stats.pendingDesc,
    },
    {
      title: t.activationRequests.stats.processing,
      value: stats.processing,
      icon: AlertCircle,
      percent: pct(stats.processing, stats.total),
      accent: "bg-orange-500",
      iconBg: "bg-orange-50 dark:bg-orange-950/60",
      iconColor: "text-orange-600 dark:text-orange-400",
      bar: "bg-orange-400",
      badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300",
      description: t.activationRequests.stats.processingDesc,
    },
    {
      title: t.activationRequests.stats.activated,
      value: stats.activated,
      icon: CheckCircle2,
      percent: pct(stats.activated, stats.total),
      accent: "bg-emerald-500",
      iconBg: "bg-emerald-50 dark:bg-emerald-950/60",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      bar: "bg-emerald-400",
      badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
      description: t.activationRequests.stats.activatedDesc,
    },
    {
      title: t.activationRequests.stats.rejected,
      value: stats.rejected,
      icon: Ban,
      percent: pct(stats.rejected, stats.total),
      accent: "bg-red-500",
      iconBg: "bg-red-50 dark:bg-red-950/60",
      iconColor: "text-red-600 dark:text-red-400",
      bar: "bg-red-400",
      badge: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
      description: t.activationRequests.stats.rejectedDesc,
    },
  ];

  const activatedPct = pct(stats.activated, stats.total);

  return (
    <div className="mb-8 space-y-3">

      {/* ── Hero card : Total ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-5 shadow-lg">
        {/* Cercles décoratifs */}
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-10 -right-4 h-56 w-56 rounded-full bg-white/5" />

        <div className="relative flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="rounded-lg bg-white/15 p-1.5">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-200">
                {t.activationRequests.stats.total}
              </span>
            </div>
            <p className="text-5xl font-black text-white leading-none mt-3">
              {stats.total.toLocaleString()}
            </p>
            <p className="mt-2 text-sm text-blue-200">
              {t.activationRequests.stats.totalDesc}
            </p>
          </div>

          {/* Taux de succès */}
          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-bold text-emerald-300 ring-1 ring-emerald-400/30">
              <ArrowUpRight className="h-3 w-3" />
              {activatedPct}%
            </span>
            <span className="text-[10px] text-blue-300">activées</span>
          </div>
        </div>

        {/* Barre de progression segmentée */}
        <div className="relative mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-emerald-400 transition-all duration-700"
            style={{ width: `${pct(stats.activated, stats.total)}%` }}
          />
          <div
            className="absolute top-0 h-full rounded-full bg-amber-400 transition-all duration-700"
            style={{
              left: `${pct(stats.activated, stats.total)}%`,
              width: `${pct(stats.pending, stats.total)}%`,
            }}
          />
          <div
            className="absolute top-0 h-full rounded-full bg-orange-400 transition-all duration-700"
            style={{
              left: `${pct(stats.activated + stats.pending, stats.total)}%`,
              width: `${pct(stats.processing, stats.total)}%`,
            }}
          />
          <div
            className="absolute top-0 h-full rounded-full bg-red-400 transition-all duration-700"
            style={{
              left: `${pct(stats.activated + stats.pending + stats.processing, stats.total)}%`,
              width: `${pct(stats.rejected, stats.total)}%`,
            }}
          />
        </div>

        {/* Légende mini */}
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
          {[
            { color: "bg-emerald-400", label: "Activées" },
            { color: "bg-amber-400", label: "En attente" },
            { color: "bg-orange-400", label: "En traitement" },
            { color: "bg-red-400", label: "Rejetées" },
          ].map(({ color, label }) => (
            <span key={label} className="flex items-center gap-1 text-[10px] text-blue-200">
              <span className={`h-1.5 w-1.5 rounded-full ${color}`} />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Grille 2×2 secondaire ── */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {secondary.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="group relative overflow-hidden rounded-xl border border-border/60 bg-card p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]"
            >
              {/* Barre d'accent colorée gauche */}
              <div className={`absolute left-0 top-0 h-full w-1 ${card.accent} rounded-l-xl`} />

              <div className="pl-1">
                {/* Icône + badge % */}
                <div className="flex items-start justify-between mb-3">
                  <div className={`rounded-lg ${card.iconBg} p-2`}>
                    <Icon className={`h-4 w-4 ${card.iconColor}`} />
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${card.badge}`}>
                    {card.percent}%
                  </span>
                </div>

                {/* Nombre */}
                <p className="text-2xl font-black text-foreground leading-none">
                  {card.value.toLocaleString()}
                </p>

                {/* Titre */}
                <p className="mt-1 text-xs font-medium text-muted-foreground truncate">
                  {card.title}
                </p>

                {/* Mini barre de progression */}
                <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${card.bar} transition-all duration-700`}
                    style={{ width: `${card.percent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

