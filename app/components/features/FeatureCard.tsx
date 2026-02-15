import { Link } from 'react-router';
import { Card, CardContent } from '~/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { cn } from '~/lib/utils';
import type { LucideIcon } from 'lucide-react';
import type { Permission } from '~/types/auth.types';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href?: string;
  color?: string;
  permission?: Permission;
  hasAccess: boolean;
  actionLabel?: string;
  size?: 'default' | 'compact';
  showPermissionBadge?: boolean;
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  href,
  color = 'bg-babana-cyan',
  hasAccess,
  actionLabel = 'Accéder',
  size = 'default',
}: FeatureCardProps) {
  const isCompact = size === 'compact';

  // Extraction de la couleur principale pour les effets de bordure
  const getColorInfo = (bgClass: string) => {
    const colorMap: Record<string, { border: string; glow: string; gradient: string }> = {
      'pink-500': {
        border: 'border-pink-500',
        glow: 'hover:shadow-pink-500/25 dark:hover:shadow-pink-500/20',
        gradient: 'from-pink-500 via-pink-400 to-pink-600',
      },
      'blue-500': {
        border: 'border-blue-500',
        glow: 'hover:shadow-blue-500/25 dark:hover:shadow-blue-500/20',
        gradient: 'from-blue-500 via-blue-400 to-blue-600',
      },
      'emerald-500': {
        border: 'border-emerald-500',
        glow: 'hover:shadow-emerald-500/25 dark:hover:shadow-emerald-500/20',
        gradient: 'from-emerald-500 via-emerald-400 to-emerald-600',
      },
      'green-500': {
        border: 'border-green-500',
        glow: 'hover:shadow-green-500/25 dark:hover:shadow-green-500/20',
        gradient: 'from-green-500 via-green-400 to-green-600',
      },
      'amber-500': {
        border: 'border-amber-500',
        glow: 'hover:shadow-amber-500/25 dark:hover:shadow-amber-500/20',
        gradient: 'from-amber-500 via-amber-400 to-amber-600',
      },
      'orange-500': {
        border: 'border-orange-500',
        glow: 'hover:shadow-orange-500/25 dark:hover:shadow-orange-500/20',
        gradient: 'from-orange-500 via-orange-400 to-orange-600',
      },
      'purple-500': {
        border: 'border-purple-500',
        glow: 'hover:shadow-purple-500/25 dark:hover:shadow-purple-500/20',
        gradient: 'from-purple-500 via-purple-400 to-purple-600',
      },
      'purple-600': {
        border: 'border-purple-600',
        glow: 'hover:shadow-purple-600/25 dark:hover:shadow-purple-600/20',
        gradient: 'from-purple-600 via-purple-500 to-purple-700',
      },
      'indigo-500': {
        border: 'border-indigo-500',
        glow: 'hover:shadow-indigo-500/25 dark:hover:shadow-indigo-500/20',
        gradient: 'from-indigo-500 via-indigo-400 to-indigo-600',
      },
      'slate-700': {
        border: 'border-slate-700',
        glow: 'hover:shadow-slate-700/25 dark:hover:shadow-slate-500/20',
        gradient: 'from-slate-700 via-slate-600 to-slate-800',
      },
      'cyan-600': {
        border: 'border-cyan-600',
        glow: 'hover:shadow-cyan-600/25 dark:hover:shadow-cyan-500/20',
        gradient: 'from-cyan-600 via-cyan-500 to-cyan-700',
      },
      'babana-cyan': {
        border: 'border-babana-cyan',
        glow: 'hover:shadow-babana-cyan/25 dark:hover:shadow-babana-cyan/20',
        gradient: 'from-babana-cyan via-babana-cyan-light to-babana-cyan-dark',
      },
    };

    // Check for gradients first
    if (bgClass.includes('from-purple-500') && bgClass.includes('to-pink-500')) {
      return {
        border: 'border-purple-500',
        glow: 'hover:shadow-purple-500/25 dark:hover:shadow-purple-500/20',
        gradient: 'from-purple-500 via-pink-500 to-purple-500',
      };
    }
    if (bgClass.includes('from-blue-500') && bgClass.includes('to-cyan-500')) {
      return {
        border: 'border-blue-500',
        glow: 'hover:shadow-blue-500/25 dark:hover:shadow-blue-500/20',
        gradient: 'from-blue-500 via-cyan-500 to-blue-500',
      };
    }

    // Find matching color
    for (const [key, value] of Object.entries(colorMap)) {
      if (bgClass.includes(key)) {
        return value;
      }
    }

    return colorMap['babana-cyan'];
  };

  const colorInfo = getColorInfo(color);

  const cardContent = (
    <div className="relative h-full">
      {/* Bordure dynamique animée - visible en mobile, hover sur desktop */}
      <div 
        className={cn(
          "absolute -inset-[2px] rounded-2xl opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500",
          "bg-linear-to-r animate-border-shift bg-[length:200%_100%]",
          colorInfo.gradient
        )}
        style={{
          backgroundSize: '200% 100%',
        }}
      />
      
      {/* Glow effect */}
      <div 
        className={cn(
          "absolute -inset-1 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500",
          `bg-linear-to-r ${colorInfo.gradient}`
        )}
      />

      <Card 
        className={cn(
          "relative h-full border-0 overflow-hidden backdrop-blur-sm",
          "bg-white/95 dark:bg-gray-800/95",
          "shadow-md hover:shadow-2xl transition-all duration-500",
          colorInfo.glow,
          // Scale effect on hover (desktop only)
          "md:hover:scale-[1.02] md:group-hover:scale-[1.02]",
        )}
      >
        <CardContent 
          className={cn(
            "relative flex flex-col h-full",
            isCompact ? "p-4" : "p-4 md:p-6"
          )}
        >
          {/* Header avec icône */}
          <div className="mb-3 md:mb-4">
            <div 
              className={cn(
                "rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg",
                "transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl",
                "group-hover:rotate-3",
                isCompact ? "w-10 h-10" : "w-10 h-10 md:w-12 md:h-12",
                color
              )}
            >
              <Icon 
                className={cn(
                  "transition-transform duration-300",
                  isCompact ? "w-5 h-5" : "w-5 h-5 md:w-6 md:h-6"
                )} 
              />
            </div>
          </div>

          {/* Contenu */}
          <div className="space-y-1 md:space-y-2 mb-3 md:mb-4 flex-grow">
            <h3 
              className={cn(
                "font-bold text-foreground transition-colors duration-300",
                "group-hover:text-babana-cyan dark:group-hover:text-babana-cyan",
                "line-clamp-1 md:line-clamp-none",
                isCompact ? "text-lg" : "text-base md:text-xl"
              )}
            >
              {title}
            </h3>
            <p 
              className={cn(
                "text-muted-foreground leading-relaxed line-clamp-2 md:line-clamp-3",
                "transition-colors duration-300",
                isCompact ? "text-xs" : "text-xs md:text-sm"
              )}
            >
              {description}
            </p>
          </div>

          {/* Action footer */}
          {hasAccess && href && (
            <div 
              className={cn(
                "flex items-center font-semibold text-xs md:text-sm mt-auto pt-2",
                "text-babana-cyan transition-all duration-300",
                "group-hover:gap-2"
              )}
            >
              <span className="relative">
                {actionLabel}
                {/* Underline effect on hover */}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-babana-cyan transition-all duration-300 group-hover:w-full" />
              </span>
              <ArrowRight 
                className={cn(
                  "w-3 h-3 md:w-4 md:h-4 ml-1 transition-all duration-300",
                  "group-hover:ml-2 group-hover:translate-x-1"
                )} 
              />
            </div>
          )}
        </CardContent>

        {/* Progress bar animée au survol (Desktop only) */}
        {hasAccess && href && (
          <div 
            className={cn(
              "absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 transition-transform duration-500 origin-left",
              "hidden md:block group-hover:scale-x-100",
              `bg-linear-to-r ${colorInfo.gradient}`
            )}
          />
        )}

        {/* Corner accent */}
        <div 
          className={cn(
            "absolute top-0 right-0 w-16 h-16 transform translate-x-8 -translate-y-8",
            "opacity-0 group-hover:opacity-10 transition-opacity duration-500",
            `bg-linear-to-bl ${colorInfo.gradient} rounded-full blur-xl`
          )}
        />
      </Card>
    </div>
  );

  if (href && hasAccess) {
    return (
      <Link 
        to={href} 
        className={cn(
          "group relative block h-full cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-babana-cyan focus-visible:ring-offset-2 rounded-2xl"
        )}
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div className="group relative h-full">
      {cardContent}
    </div>
  );
}
