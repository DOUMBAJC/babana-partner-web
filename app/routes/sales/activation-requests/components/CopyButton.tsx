import { useState } from 'react';
import { Copy, Check, Sparkles } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';
import { toast } from 'sonner';

interface CopyButtonProps {
  value: string;
  label?: string;
  successMessage?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'ghost' | 'outline' | 'default';
}

export function CopyButton({
  value,
  label,
  successMessage = 'Copié !',
  className,
  size = 'sm',
  variant = 'default',
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(successMessage);
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      toast.error('Erreur lors de la copie');
    }
  };

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-9 w-9',
    lg: 'h-10 w-10',
  };

  const iconSizeClasses = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <Button
      type="button"
      variant={variant}
      size="icon"
      onClick={handleCopy}
      className={cn(
        sizeClasses[size],
        'transition-all duration-300 transform hover:scale-110',
        'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700',
        'text-white shadow-lg hover:shadow-xl',
        'border-0',
        copied && 'from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 scale-110',
        className
      )}
      title={label || 'Copier'}
    >
      {copied ? (
        <Check className={cn(iconSizeClasses[size], 'animate-bounce')} />
      ) : (
        <Copy className={iconSizeClasses[size]} />
      )}
    </Button>
  );
}

interface CopyableValueProps {
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
  className?: string;
  copyLabel?: string;
  icon?: React.ReactNode;
}

export function CopyableValue({
  label,
  value,
  mono = false,
  highlight = false,
  className,
  copyLabel,
  icon,
}: CopyableValueProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center gap-2">
        {icon && <span className="text-primary">{icon}</span>}
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
          {label}
          <Sparkles className="h-3 w-3 text-amber-500" />
        </p>
      </div>
      <div className="flex items-center justify-between gap-3 group">
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              'break-all transition-all duration-200',
              mono && 'font-mono text-sm',
              highlight && 'text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent',
              !highlight && 'text-base font-semibold text-foreground',
              'group-hover:text-primary'
            )}
          >
            {value || '-'}
          </p>
        </div>
        {value && (
          <div className="shrink-0">
            <CopyButton
              value={value}
              label={copyLabel || `Copier ${label}`}
              className="shadow-md"
            />
          </div>
        )}
      </div>
    </div>
  );
}

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
  gradient?: string;
}

export function InfoCard({ icon, title, children, className, gradient = "from-blue-500 to-purple-600" }: InfoCardProps) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl",
      "bg-card border-2 border-border/50",
      "shadow-xl hover:shadow-2xl transition-all duration-300",
      "hover:scale-[1.02] hover:-translate-y-1",
      className
    )}>
      {/* Gradient decoratif */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1.5",
        `bg-gradient-to-r ${gradient}`
      )} />
      
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-4">
          <div className={cn(
            "h-14 w-14 rounded-xl flex items-center justify-center",
            "bg-gradient-to-br shadow-lg transform hover:rotate-6 transition-transform",
            gradient
          )}>
            <span className="text-white text-2xl">{icon}</span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground">{title}</h3>
            <div className={cn("h-1 w-12 rounded-full mt-1.5 bg-gradient-to-r", gradient)} />
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="px-6 pb-6 space-y-4">
        {children}
      </div>
    </div>
  );
}
