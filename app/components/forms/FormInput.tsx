import { forwardRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { Input, Label } from '~/components';
import { cn } from '~/lib/utils';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  endIcon?: ReactNode;
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

/**
 * Composant de champ de formulaire réutilisable avec label, icône et gestion d'erreurs
 */
export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ 
    label, 
    icon, 
    endIcon, 
    error, 
    helperText, 
    containerClassName,
    id,
    className,
    ...props 
  }, ref) => {
    const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className={cn('space-y-2 form-element', containerClassName)}>
        <Label htmlFor={inputId} className="text-sm font-medium">
          {label}
        </Label>
        <div className="relative group">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-babana-cyan transition-colors pointer-events-none">
              {icon}
            </div>
          )}
          <Input
            ref={ref}
            id={inputId}
            className={cn(
              'h-12 bg-background border-2 focus:border-babana-cyan focus:ring-2 focus:ring-babana-cyan/20 transition-all',
              icon && 'pl-10',
              endIcon && 'pr-10',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
              className
            )}
            {...props}
          />
          {endIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {endIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

