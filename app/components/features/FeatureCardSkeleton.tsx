import { cn } from '~/lib/utils';

interface FeatureCardSkeletonProps {
  size?: 'default' | 'compact';
}

/**
 * Skeleton moderne pour le chargement des cartes de fonctionnalités
 * Effet shimmer avec animation fluide
 */
export function FeatureCardSkeleton({ size = 'default' }: FeatureCardSkeletonProps) {
  const isCompact = size === 'compact';

  return (
    <div 
      className={cn(
        "relative h-full rounded-xl border-2 border-gray-200/50 dark:border-gray-700/50 overflow-hidden",
        "bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm",
        isCompact ? "p-4" : "p-4 md:p-6"
      )}
    >
      {/* Shimmer overlay */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]">
        <div className="h-full w-full bg-linear-to-r from-transparent via-white/60 dark:via-white/10 to-transparent" />
      </div>

      {/* Animated gradient border */}
      <div className="absolute inset-0 rounded-xl opacity-30">
        <div className="absolute inset-0 rounded-xl bg-linear-to-r from-babana-cyan/30 via-purple-500/30 to-pink-500/30 animate-[borderShift_3s_ease-in-out_infinite]" />
      </div>

      <div className="relative flex flex-col h-full">
        {/* Icon skeleton */}
        <div className="mb-3 md:mb-4">
          <div className={cn(
            "rounded-2xl bg-linear-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse",
            isCompact ? "w-10 h-10" : "w-10 h-10 md:w-12 md:h-12"
          )} />
        </div>

        {/* Title skeleton */}
        <div className="space-y-1 md:space-y-2 mb-3 md:mb-4 flex-grow">
          <div className={cn(
            "rounded-lg bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse",
            isCompact ? "h-5 w-3/4" : "h-5 md:h-6 w-3/4"
          )} />
          
          {/* Description skeleton - multiple lines */}
          <div className="space-y-2 mt-2">
            <div className={cn(
              "rounded bg-gray-200 dark:bg-gray-700 animate-pulse",
              isCompact ? "h-3 w-full" : "h-3 md:h-4 w-full"
            )} />
            <div className={cn(
              "rounded bg-gray-200 dark:bg-gray-700 animate-pulse",
              isCompact ? "h-3 w-2/3" : "h-3 md:h-4 w-2/3"
            )} />
          </div>
        </div>

        {/* Action button skeleton */}
        <div className="flex items-center gap-2 mt-auto pt-2">
          <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="h-3 w-3 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

/**
 * Grille de skeletons pour le chargement des fonctionnalités
 */
export function FeaturesGridSkeleton({ 
  count = 6, 
  columns = 3,
  size = 'default' 
}: { 
  count?: number; 
  columns?: 2 | 3 | 4;
  size?: 'default' | 'compact';
}) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-3 md:gap-6`}>
      {Array.from({ length: count }).map((_, index) => (
        <FeatureCardSkeleton key={index} size={size} />
      ))}
    </div>
  );
}
