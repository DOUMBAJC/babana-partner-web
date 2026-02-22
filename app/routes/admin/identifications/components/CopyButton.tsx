import { useState } from 'react';
import { Copy, Check, Sparkles } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';
import { toast } from 'sonner';
import { useTranslation } from '~/hooks';

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
  successMessage,
  className,
  size = 'sm',
  variant = 'default',
}: CopyButtonProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // Vérifier que la valeur est valide et non vide
      if (!value || value.trim() === '' || value === '-') {
        toast.error(t.activationRequests.toast.copyEmpty);
        return;
      }

      // Vérifier que l'API Clipboard est disponible
      if (!navigator.clipboard || !navigator.clipboard.writeText) {
        // Fallback pour les navigateurs qui ne supportent pas l'API Clipboard
        const textArea = document.createElement('textarea');
        textArea.value = value;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          const successful = document.execCommand('copy');
          if (successful) {
            setCopied(true);
            toast.success(successMessage);
            setTimeout(() => {
              setCopied(false);
            }, 2000);
          } else {
            toast.error(t.activationRequests.toast.copyError);
          }
        } catch (err) {
          toast.error(t.activationRequests.toast.copyError);
        } finally {
          document.body.removeChild(textArea);
        }
        return;
      }

      // Utiliser l'API Clipboard moderne
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(successMessage || t.activationRequests.toast.copySuccess);
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
      toast.error(t.activationRequests.toast.copyError);
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
        'bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700',
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
    <div className={cn('space-y-1.5 sm:space-y-2', className)}>
      <div className="flex items-center gap-1.5 sm:gap-2">
        {icon && <span className="text-primary shrink-0">{icon}</span>}
        <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1 wrap-break-word">
          {label}
          <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-amber-500 shrink-0" />
        </p>
      </div>
      <div className="flex items-start sm:items-center justify-between gap-2 sm:gap-3 group">
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              'break-words sm:break-all transition-all duration-200',
              mono && 'font-mono text-xs sm:text-sm',
              highlight && 'text-base sm:text-lg md:text-xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent',
              !highlight && 'text-sm sm:text-base font-semibold text-foreground',
              'group-hover:text-primary'
            )}
          >
            {value || '-'}
          </p>
        </div>
        {value && value !== '-' && value.trim() !== '' && (
          <div className="shrink-0">
            <CopyButton
              value={value}
              label={copyLabel || `Copier ${label}`}
              className="shadow-md"
              size="sm"
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
      "relative overflow-hidden rounded-xl sm:rounded-2xl",
      "bg-card border-2 border-border/50",
      "shadow-xl hover:shadow-2xl transition-all duration-300",
      "hover:scale-[1.01] sm:hover:scale-[1.02] hover:-translate-y-0.5 sm:hover:-translate-y-1",
      className
    )}>
      {/* Gradient decoratif */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1 sm:h-1.5",
        `bg-linear-to-r ${gradient}`
      )} />
      
      {/* Header */}
      <div className="p-4 sm:p-6 pb-3 sm:pb-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className={cn(
            "h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0",
            "bg-linear-to-br shadow-lg transform hover:rotate-6 transition-transform",
            gradient
          )}>
            <span className="text-white text-lg sm:text-xl md:text-2xl">{icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground break-words">{title}</h3>
            <div className={cn("h-0.5 sm:h-1 w-8 sm:w-12 rounded-full mt-1 sm:mt-1.5 bg-linear-to-r", gradient)} />
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3 sm:space-y-4">
        {children}
      </div>
    </div>
  );
}
