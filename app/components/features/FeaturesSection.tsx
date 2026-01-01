import { FeatureCard } from './FeatureCard';
import type { LucideIcon } from 'lucide-react';
import type { Permission, RoleSlug } from '~/types/auth.types';

export interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  href?: string;
  color?: string;
  permission: Permission;
  requiredRoles?: RoleSlug[];
  hasAccess: boolean;
}

interface FeaturesSectionProps {
  title: string;
  subtitle?: string;
  features: Feature[];
  layout?: 'grid' | 'list';
  columns?: 2 | 3 | 4;
  actionLabel?: string;
}

/**
 * Section affichant une grille de fonctionnalités accessibles
 * Affiche uniquement les fonctionnalités auxquelles l'utilisateur a accès
 */
export function FeaturesSection({
  title,
  subtitle,
  features,
  layout = 'grid',
  columns = 3,
  actionLabel,
}: FeaturesSectionProps) {
  // Ne garder que les fonctionnalités accessibles
  const accessibleFeatures = features.filter(f => f.hasAccess);

  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div>
      {accessibleFeatures.length > 0 ? (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1.5 bg-babana-cyan rounded-full" />
            <div>
              <h2 className="text-2xl font-bold text-foreground">{title}</h2>
              {subtitle && (
                <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
              )}
            </div>
          </div>

          <div className={`grid grid-cols-1 ${gridCols[columns]} gap-6`}>
            {accessibleFeatures.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                href={feature.href}
                color={feature.color}
                hasAccess={feature.hasAccess}
                actionLabel={actionLabel}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucune fonctionnalité disponible</p>
        </div>
      )}
    </div>
  );
}

