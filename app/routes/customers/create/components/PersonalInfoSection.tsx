import { User as UserIcon, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { FormSection } from './FormSection';
import { FormField } from './FormField';
import { Label } from '~/components';
import { EnhancedSelect, SelectItem } from '~/components/EnhancedSelect';
import type { IdCardType } from '~/types/customer.types';
import type { CustomerFormData, CustomerFormErrors } from '../config';

interface PersonalInfoSectionProps {
  formData: CustomerFormData;
  errors: CustomerFormErrors;
  touchedFields: Set<keyof CustomerFormData>;
  onFieldChange: (field: keyof CustomerFormData, value: string) => void;
  onFieldBlur: (field: keyof CustomerFormData) => void;
  onIdCardTypeChange: (value: string) => void;
  onIdCardNumberChange: (value: string) => void;
  idCardTypes: IdCardType[];
  idCardValidationError: string;
  selectedCardType?: IdCardType;
  t: any;
}

/**
 * Section des informations personnelles du formulaire de création client
 */
export function PersonalInfoSection({
  formData,
  errors,
  touchedFields,
  onFieldChange,
  onFieldBlur,
  onIdCardTypeChange,
  onIdCardNumberChange,
  idCardTypes,
  idCardValidationError,
  selectedCardType,
  t
}: PersonalInfoSectionProps) {
  return (
    <FormSection icon={UserIcon} title={t.customerCreate.personalInfo}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          id="firstName"
          label={t.customerCreate.fields.firstName}
          value={formData.firstName}
          onChange={(value) => onFieldChange('firstName', value)}
          onBlur={() => onFieldBlur('firstName')}
          error={touchedFields.has('firstName') ? errors.firstName : undefined}
          showSuccess={touchedFields.has('firstName') && !errors.firstName}
        />

        <FormField
          id="lastName"
          label={t.customerCreate.fields.lastName}
          value={formData.lastName}
          onChange={(value) => onFieldChange('lastName', value)}
          onBlur={() => onFieldBlur('lastName')}
          error={touchedFields.has('lastName') ? errors.lastName : undefined}
          required
          showSuccess={touchedFields.has('lastName') && !errors.lastName}
        />

        {/* Enhanced ID Card Type Select */}
        <div className="space-y-2 group">
          <Label
            htmlFor="idCardTypeId"
            className="text-sm font-semibold text-muted-foreground group-focus-within:text-primary transition-colors duration-300"
          >
            {t.customerCreate.fields.idCardType}
            <span className="text-destructive ml-1">*</span>
          </Label>
          <div className="relative">
            <div className="absolute left-3 top-3 z-10">
              <CreditCard className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-all duration-300 group-focus-within:scale-110 pointer-events-none" />
            </div>
            <div className="pl-10">
              <EnhancedSelect
                value={formData.idCardTypeId}
                onValueChange={onIdCardTypeChange}
                placeholder={t.customerCreate.fields.selectIdCardType}
                required={true}
                error={touchedFields.has('idCardTypeId') ? errors.idCardTypeId : undefined}
                success={touchedFields.has('idCardTypeId') && !errors.idCardTypeId && formData.idCardTypeId !== ''}
                className="h-12 rounded-xl border-2 bg-background/60 backdrop-blur-sm hover:border-primary/30 transition-all duration-300"
                aria-label={t.customerCreate.fields.idCardType}
                aria-describedby={touchedFields.has('idCardTypeId') && errors.idCardTypeId ? "idCardTypeId-error" : undefined}
              >
                {idCardTypes.map((type: IdCardType) => (
                  <SelectItem
                    key={type.id}
                    value={type.id.toString()}
                  >
                    {type.name} ({type.code})
                  </SelectItem>
                ))}
              </EnhancedSelect>
            </div>
          </div>
          {touchedFields.has('idCardTypeId') && errors.idCardTypeId && (
            <div
              id="idCardTypeId-error"
              className="flex items-start gap-2 text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-1 duration-200"
              role="alert"
              aria-live="polite"
            >
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <p className="text-sm font-medium">{errors.idCardTypeId}</p>
            </div>
          )}
        </div>

        {/* ID Card Number with Enhanced Validation */}
        <div className="space-y-2">
          <FormField
            id="idCardNumber"
            label={t.customerCreate.fields.idCard}
            value={formData.idCardNumber}
            onChange={(value) => onIdCardNumberChange(value)}
            onBlur={() => onFieldBlur('idCardNumber')}
            error={touchedFields.has('idCardNumber') ? errors.idCardNumber : undefined}
            icon={CreditCard}
            required
            showSuccess={false}
          />
          
          {/* Enhanced Validation Error */}
          {idCardValidationError && touchedFields.has('idCardNumber') && (
            <div className="flex items-start gap-2.5 text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-2 duration-300 bg-red-500/5 border border-red-500/20 rounded-lg p-3">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" strokeWidth={2.5} />
              <p className="text-sm font-semibold leading-relaxed">{idCardValidationError}</p>
            </div>
          )}
          
          {/* Premium Success Message */}
          {selectedCardType?.validation_pattern && !idCardValidationError && formData.idCardNumber && touchedFields.has('idCardNumber') && !errors.idCardNumber && (
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 p-3.5 animate-in fade-in slide-in-from-top-2 duration-300 shadow-md shadow-green-500/10">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(34,197,94,0.1),transparent)]" />
              
              <div className="relative flex items-start gap-3">
                <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-green-500/40 rounded-full blur-md animate-pulse" style={{ animationDuration: '2s' }} />
                  <div className="absolute inset-0 bg-green-400/30 rounded-full blur-sm" />
                  <CheckCircle className="relative h-5 w-5 text-green-600 dark:text-green-400 drop-shadow-lg" strokeWidth={2.5} />
                </div>
                <p className="text-sm font-bold text-green-700 dark:text-green-300 pt-0.5">
                  Format valide pour {selectedCardType.name}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </FormSection>
  );
}

