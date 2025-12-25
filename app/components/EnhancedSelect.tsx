import React from 'react';
import { CheckCircle, AlertCircle, Loader2, ChevronDown } from 'lucide-react';
import { cn } from '~/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

interface EnhancedSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  success?: boolean;
  loading?: boolean;
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  children: React.ReactNode;
}

/**
 * Composant Select amélioré avec indicateurs visuels d'état
 */
export function EnhancedSelect({
  value,
  onValueChange,
  onOpenChange,
  placeholder,
  disabled = false,
  required = false,
  error,
  success = false,
  loading = false,
  className,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  children,
  ...props
}: EnhancedSelectProps) {
  const hasError = !!error;
  const hasSuccess = success && !hasError;

  return (
    <div className="relative">
      <Select
        value={value}
        onValueChange={onValueChange}
        onOpenChange={onOpenChange}
        disabled={disabled || loading}
        {...props}
      >
        <SelectTrigger
          className={cn(
            // Styles de base améliorés
            "w-full h-11 bg-background/80 backdrop-blur-sm border-input/60 rounded-xl",
            "transition-all duration-300 pr-12",
            // États de focus et hover
            "focus:ring-2 focus:ring-primary/30 focus:border-primary/60",
            "hover:border-primary/40 hover:bg-background/90",
            // États d'erreur
            hasError && "border-red-500 focus:border-red-500 focus:ring-red-500/30",
            // États de succès
            hasSuccess && "border-green-500 focus:border-green-500 focus:ring-green-500/30",
            // États de chargement
            loading && "opacity-70 cursor-not-allowed",
            className
          )}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          aria-invalid={ariaInvalid ?? hasError}
          aria-required={required}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent className="bg-popover/95 backdrop-blur-xl border-border/80 shadow-xl ring-1 ring-black/5 dark:ring-white/10">
          {children}
        </SelectContent>
      </Select>

      {/* Indicateurs d'état en overlay */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
        {/* Indicateur de chargement */}
        {loading && (
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        )}

        {/* Indicateur de succès */}
        {hasSuccess && !loading && (
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 animate-in fade-in-0 zoom-in-95 duration-200" />
        )}

        {/* Indicateur d'erreur */}
        {hasError && !loading && (
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 animate-in fade-in-0 zoom-in-95 duration-200" />
        )}

        {/* Indicateur requis */}
        {required && !value && !hasError && !hasSuccess && !loading && (
          <span className="text-xs font-medium text-muted-foreground">*</span>
        )}

        {/* Chevron (toujours visible sauf en chargement) */}
        {!loading && (
          <ChevronDown className="h-4 w-4 opacity-60 transition-transform duration-200 data-[state=open]:rotate-180" />
        )}
      </div>
    </div>
  );
}

export { SelectItem } from '~/components/ui/select';
