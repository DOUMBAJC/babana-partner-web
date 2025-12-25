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
  const colorClasses = variant === 'primary' 
    ? 'bg-primary/10 text-primary'
    : 'bg-secondary/10 text-secondary-foreground';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-border/50 pb-2">
        <div className={`p-2 ${colorClasses} rounded-lg transition-colors`}>
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  );
}

