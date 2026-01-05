import { Link } from 'react-router';
import { Coins, Plus } from 'lucide-react';
import { useAuth, useTranslation } from '~/hooks';
import { cn } from '~/lib/utils';

export function CreditDisplay({ className }: { className?: string }) {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  if (!user || user.wallet === undefined) return null;

  const balance = user.wallet.balance;

  // Configuration basée sur le niveau de crédit
  const getStatusConfig = (val: number) => {
    if (val < 10) {
      return {
        container: "bg-rose-50/80 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/50 hover:border-rose-300 dark:hover:border-rose-700 hover:bg-rose-100/80 dark:hover:bg-rose-900/40",
        icon: "text-rose-600 dark:text-rose-400",
        glow: "bg-rose-400/30",
        text: "text-rose-900 dark:text-rose-100",
        subtext: "text-rose-700/80 dark:text-rose-400/80",
        divider: "bg-rose-200 dark:bg-rose-800",
        badge: "bg-rose-200 dark:bg-rose-800 group-hover:bg-rose-300 dark:group-hover:bg-rose-700",
        badgeIcon: "text-rose-800 dark:text-rose-200",
        animate: "animate-pulse"
      };
    }
    if (val < 20) {
      return {
        container: "bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50 hover:border-amber-300 dark:hover:border-amber-700 hover:bg-amber-100/80 dark:hover:bg-amber-900/40",
        icon: "text-amber-600 dark:text-amber-400",
        glow: "bg-amber-400/30",
        text: "text-amber-900 dark:text-amber-100",
        subtext: "text-amber-700/80 dark:text-amber-400/80",
        divider: "bg-amber-200 dark:bg-amber-800",
        badge: "bg-amber-200 dark:bg-amber-800 group-hover:bg-amber-300 dark:group-hover:bg-amber-700",
        badgeIcon: "text-amber-800 dark:text-amber-200",
        animate: ""
      };
    }
    return {
      container: "bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/40",
      icon: "text-emerald-600 dark:text-emerald-400",
      glow: "bg-emerald-400/30",
      text: "text-emerald-900 dark:text-emerald-100",
      subtext: "text-emerald-700/80 dark:text-emerald-400/80",
      divider: "bg-emerald-200 dark:bg-emerald-800",
      badge: "bg-emerald-200 dark:bg-emerald-800 group-hover:bg-emerald-300 dark:group-hover:bg-emerald-700",
      badgeIcon: "text-emerald-800 dark:text-emerald-200",
      animate: ""
    };
  };

  const config = getStatusConfig(balance);

  return (
    <div className={cn("flex items-center", className)}>
      <Link to="/credits">
        <div className={cn(
          "relative group flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border backdrop-blur-md transition-all duration-300 overflow-hidden",
          "shadow-sm hover:shadow-lg hover:scale-[1.02] active:scale-95",
          config.container,
          config.animate
        )}>
          {/* Shine Effect Overlay - Periodic and on Hover */}
          <div className="absolute inset-0 -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out_infinite] bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]" />
          <div className="absolute inset-0 -translate-x-full animate-[shine_3s_ease-in-out_infinite] delay-1000 bg-linear-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] pointer-events-none" />

          {/* Icone avec effet glow */}
          <div className="relative">
             <div className={cn("absolute inset-0 blur-sm rounded-full", config.glow, balance < 10 && "animate-pulse")} />
             <Coins className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4 relative z-10 transition-transform duration-500 group-hover:rotate-12", config.icon)} />
          </div>
          
          <div className="flex flex-col leading-none">
            <span className={cn("text-[10px] sm:text-xs font-black tracking-tight", config.text)}>
              {balance.toLocaleString()}
            </span>
            <span className={cn("hidden sm:block text-[9px] font-bold uppercase tracking-tighter opacity-80", config.subtext)}>
              {t.credits.recharge.creditsLabel}
            </span>
          </div>

          <div className={cn("w-px h-5 sm:h-6 mx-0.5 sm:mx-1 transition-opacity group-hover:opacity-50", config.divider)} />

          {/* Bouton d'ajout */}
          <div className={cn("rounded-full p-0.5 sm:p-1 transition-all duration-300 group-hover:rotate-90", config.badge)}>
            <Plus className={cn("w-2 h-2 sm:w-2.5 sm:h-2.5", config.badgeIcon)} />
          </div>
        </div>
      </Link>
    </div>
  );
}
