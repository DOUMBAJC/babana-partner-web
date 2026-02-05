import { Link } from 'react-router';
import { Card, CardContent } from '~/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { cn } from '~/lib/utils';
import type { LucideIcon } from 'lucide-react';
import type { Permission, RoleSlug } from '~/types/auth.types';

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

/**
 * Carte de fonctionnalité simple et claire
 * Affiche uniquement les fonctionnalités accessibles à l'utilisateur
 */
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

  // Fonction pour obtenir la classe de bordure (Tailwind a besoin de chaînes complètes pour le JIT)
  const getBorderColor = (bgClass: string) => {
    // Si la couleur est vide ou indéfinie
    if (!bgClass) return 'border-babana-cyan';

    if (bgClass.includes('pink-500')) return 'border-pink-500';
    if (bgClass.includes('blue-500')) return 'border-blue-500';
    if (bgClass.includes('emerald-500')) return 'border-emerald-500';
    if (bgClass.includes('green-500')) return 'border-green-500';
    if (bgClass.includes('amber-500')) return 'border-amber-500';
    if (bgClass.includes('orange-500')) return 'border-orange-500';
    if (bgClass.includes('purple-500')) return 'border-purple-500';
    if (bgClass.includes('purple-600')) return 'border-purple-600';
    if (bgClass.includes('indigo-500')) return 'border-indigo-500';
    if (bgClass.includes('slate-700')) return 'border-slate-700';
    if (bgClass.includes('cyan-600')) return 'border-cyan-600';
    
    // Gradients
    if (bgClass.includes('from-purple-500')) return 'border-purple-500';
    if (bgClass.includes('from-blue-500')) return 'border-blue-500';
    if (bgClass.includes('from-babana-cyan')) return 'border-babana-cyan';
    
    return 'border-babana-cyan';
  };

  const borderColorClass = getBorderColor(color);

  const cardContent = (
    <Card className={cn(
        "h-full border-2 transition-all duration-300 overflow-hidden relative backdrop-blur-sm",
        // Mobile styles: Force colored border with !important to override defaults
        `!${borderColorClass}`,
        "bg-white/90 dark:bg-gray-800/90 shadow-sm",
        
        // Desktop styles (md+): Transparent border with hover effect
        "md:!border-transparent", 
        `md:hover:!${borderColorClass}`, // Remove opacity for cleaner hover or use plain color
        "md:hover:shadow-2xl md:hover:shadow-babana-cyan/10 dark:md:hover:shadow-babana-cyan/20",
        "md:bg-white/80 dark:md:bg-gray-800/80"
      )}>
        <CardContent className={cn(
          "flex flex-col h-full",
          isCompact ? "p-4" : "p-4 md:p-6" // Responsive padding
        )}>
          {/* Header avec icône */}
          <div className="mb-3 md:mb-4">
            <div className={cn(
              "rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg transition-transform duration-300 group-hover:scale-110",
              isCompact ? "w-10 h-10" : "w-10 h-10 md:w-12 md:h-12", // Responsive icon size
              color
            )}>
              <Icon className={cn(
                isCompact ? "w-5 h-5" : "w-5 h-5 md:w-6 md:h-6"
              )} />
            </div>
          </div>

          {/* Contenu */}
          <div className="space-y-1 md:space-y-2 mb-3 md:mb-4 flex-grow">
            <h3 className={cn(
              "font-bold text-foreground transition-colors group-hover:text-babana-cyan line-clamp-1 md:line-clamp-none",
              isCompact ? "text-lg" : "text-base md:text-xl"
            )}>
              {title}
            </h3>
            <p className={cn(
              "text-muted-foreground leading-relaxed line-clamp-2 md:line-clamp-3",
              isCompact ? "text-xs" : "text-xs md:text-sm"
            )}>
              {description}
            </p>
          </div>


          {/* Action footer */}
          {hasAccess && href && (
            <div className="flex items-center text-babana-cyan font-semibold text-xs md:text-sm group-hover:gap-2 transition-all mt-auto pt-2">
              <span>{actionLabel}</span>
              <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-1 group-hover:ml-2 transition-all" />
            </div>
          )}
        </CardContent>

        {/* Barre de progression au survol (Desktop only to avoid clutter on mobile) */}
        {hasAccess && href && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-babana-cyan transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left hidden md:block" />
        )}
      </Card>
  );

  if (href && hasAccess) {
    return (
      <Link to={href} className={cn("group relative block h-full", "cursor-pointer")}>
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

