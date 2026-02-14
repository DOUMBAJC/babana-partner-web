import type { LucideIcon } from 'lucide-react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Input, Label } from '~/components';

interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  icon?: LucideIcon;
  type?: 'text' | 'email' | 'tel';
  required?: boolean;
  placeholder?: string;
  showSuccess?: boolean;
}

/**
 * Composant de champ de formulaire avec validation visuelle
 */
export function FormField({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  icon: Icon,
  type = 'text',
  required = false,
  placeholder,
  showSuccess = false
}: FormFieldProps) {
  const hasValue = value && value.trim() !== '';
  const showSuccessIcon = showSuccess && hasValue && !error;

  return (
    <div className="space-y-2.5 group">
      <Label 
        htmlFor={id} 
        className="text-sm font-bold text-muted-foreground/90 group-focus-within:text-primary transition-colors duration-300 flex items-center gap-1.5"
      >
        {label}
        {required && <span className="text-destructive text-base">*</span>}
      </Label>
      
      <div className="relative">

        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
              <Icon className="relative h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-all duration-300 group-focus-within:scale-110 group-focus-within:drop-shadow-lg" strokeWidth={2.5} />
            </div>
          </div>
        )}
        
        <Input 
          id={id}
          type={type}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`
            ${Icon ? 'pl-11' : 'pl-4'} 
            ${showSuccessIcon ? 'pr-11' : 'pr-4'}
            bg-background/70 backdrop-blur-sm border-2 border-input/60
            focus:ring-4 focus:ring-primary/15 h-12 rounded-xl
            transition-all duration-300
            hover:border-primary/40 hover:shadow-md hover:shadow-primary/5
            focus:border-primary/60 focus:bg-background/90
            ${error ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/15 bg-red-500/5 hover:border-red-500/70' : ''}
            ${showSuccessIcon ? 'border-green-500/60 focus:border-green-500 focus:ring-green-500/15 bg-green-500/5 hover:border-green-500/70' : ''}
            font-semibold text-base placeholder:text-muted-foreground/50 placeholder:font-medium
          `}
        />
        
        {showSuccessIcon && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <div className="relative">
              {/* Multi-layer Glow */}
              <div className="absolute inset-0 bg-green-500/40 rounded-full blur-lg animate-pulse" style={{ animationDuration: '2s' }} />
              <div className="absolute inset-0 bg-green-400/30 rounded-full blur-md" />
              
              {/* Icon */}
              <CheckCircle className="relative h-5 w-5 text-green-600 dark:text-green-400 animate-in fade-in zoom-in duration-300 drop-shadow-lg" strokeWidth={2.5} />
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="flex items-start gap-2.5 text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-2 duration-300 bg-red-500/5 border border-red-500/20 rounded-lg p-3">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" strokeWidth={2.5} />
          <p className="text-sm font-semibold leading-relaxed">{error}</p>
        </div>
      )}
    </div>
  );
}

