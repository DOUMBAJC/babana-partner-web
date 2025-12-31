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
    <div className="space-y-2 group">
      <Label 
        htmlFor={id} 
        className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors"
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
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
            ${Icon ? 'pl-10' : ''} 
            ${showSuccessIcon ? 'pr-10' : ''}
            bg-background/50 border-input focus:ring-primary/20 h-11 rounded-xl
            transition-all duration-200
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${showSuccessIcon ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20' : ''}
          `}
        />
        {showSuccessIcon && (
          <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-green-600 animate-in fade-in zoom-in duration-200" />
        )}
      </div>
      {error && (
        <div className="flex items-start gap-2 text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-1 duration-200">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}

