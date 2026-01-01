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

  const cardContent = (
    <Card className={cn(
        "h-full border-2 transition-all duration-300 overflow-hidden relative backdrop-blur-sm",
        "border-transparent hover:border-babana-cyan/50 hover:shadow-2xl hover:shadow-babana-cyan/10 dark:hover:shadow-babana-cyan/20 bg-white/80 dark:bg-gray-800/80"
      )}>
        <CardContent className={cn(
          isCompact ? "p-4" : "p-6"
        )}>
          {/* Header avec icône */}
          <div className="mb-4">
            <div className={cn(
              "rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg transition-transform duration-300 group-hover:scale-110",
              isCompact ? "w-10 h-10" : "w-12 h-12",
              color
            )}>
              <Icon className={cn(
                isCompact ? "w-5 h-5" : "w-6 h-6"
              )} />
            </div>
          </div>

          {/* Contenu */}
          <div className="space-y-2 mb-4">
            <h3 className={cn(
              "font-bold text-foreground transition-colors group-hover:text-babana-cyan",
              isCompact ? "text-lg" : "text-xl"
            )}>
              {title}
            </h3>
            <p className={cn(
              "text-muted-foreground leading-relaxed",
              isCompact ? "text-xs" : "text-sm"
            )}>
              {description}
            </p>
          </div>


          {/* Action footer */}
          {hasAccess && href && (
            <div className="flex items-center text-babana-cyan font-semibold text-sm group-hover:gap-2 transition-all mt-2">
              <span>{actionLabel}</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" />
            </div>
          )}
        </CardContent>

        {/* Barre de progression au survol */}
        {hasAccess && href && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-babana-cyan transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        )}
      </Card>
  );

  if (href && hasAccess) {
    return (
      <Link to={href} className={cn("group relative", "cursor-pointer")}>
        {cardContent}
      </Link>
    );
  }

  return (
    <div className="group relative">
      {cardContent}
    </div>
  );
}

