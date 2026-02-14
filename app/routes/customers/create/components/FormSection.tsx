import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface FormSectionProps {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
}

/**
 * Composant pour une section du formulaire avec en-tête stylisé
 */
export function FormSection({ 
  icon: Icon, 
  title, 
  children,
  variant = 'primary' 
}: FormSectionProps) {
  const isPrimary = variant === 'primary';
  
  const gradientClasses = isPrimary 
    ? 'from-primary/20 to-purple-500/20'
    : 'from-secondary/20 to-blue-500/20';
    
  const iconBgClasses = isPrimary
    ? 'from-primary to-purple-600'
    : 'from-secondary to-blue-600';
    
  const textClasses = isPrimary
    ? 'from-primary to-purple-600'
    : 'from-secondary to-blue-600';

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* Premium Section Header */}
      <div className="relative group">
        {/* Multi-layer Background Glow */}
        <div className={`absolute -inset-3 bg-gradient-to-r ${gradientClasses} rounded-2xl blur-2xl opacity-0 group-hover:opacity-40 transition-all duration-700`} />
        <div className={`absolute -inset-2 bg-gradient-to-r ${gradientClasses} rounded-xl blur-lg opacity-0 group-hover:opacity-20 transition-all duration-500`} />
        
        {/* Header Content */}
        <div className="relative flex items-center gap-4 pb-5 border-b-2 border-gradient-to-r from-border/30 via-primary/30 to-border/30">
          {/* Icon Container with Enhanced Effects */}
          <div className="relative shrink-0">
            {/* Outer Glow Layers */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradientClasses} rounded-xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500`} />
            <div className={`absolute inset-0 bg-gradient-to-br ${gradientClasses} rounded-lg blur-md opacity-40`} />
            
            {/* Icon Background */}
            <div className={`relative p-3.5 bg-gradient-to-br ${iconBgClasses} rounded-xl shadow-xl shadow-primary/30 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
              <Icon className="w-6 h-6 text-white drop-shadow-lg" strokeWidth={2.5} />
            </div>
            
            {/* Decorative Ring */}
            <div className={`absolute inset-0 rounded-xl border-2 border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse`} style={{ animationDuration: '3s' }} />
          </div>
          
          {/* Title with Enhanced Gradient */}
          <div className="flex-1">
            <h3 className={`text-xl sm:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r ${textClasses} drop-shadow-sm`}>
              {title}
            </h3>
            {/* Decorative Underline */}
            <div className={`mt-2 h-1 w-16 bg-gradient-to-r ${iconBgClasses} rounded-full opacity-60 group-hover:w-24 transition-all duration-500`} />
          </div>
        </div>
      </div>
      
      {/* Section Content */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {children}
      </div>
    </div>
  );
}

