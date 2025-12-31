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

        {/* Type de carte d'identité */}
        <div className="space-y-2 group">
          <Label
            htmlFor="idCardTypeId"
            className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors"
          >
            {t.customerCreate.fields.idCardType}
            <span className="text-destructive ml-1">*</span>
          </Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none z-10" />
            <div className="pl-10">
              <EnhancedSelect
                value={formData.idCardTypeId}
                onValueChange={onIdCardTypeChange}
                placeholder={t.customerCreate.fields.selectIdCardType}
                required={true}
                error={touchedFields.has('idCardTypeId') ? errors.idCardTypeId : undefined}
                success={touchedFields.has('idCardTypeId') && !errors.idCardTypeId && formData.idCardTypeId !== ''}
                className="pl-10"
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
              <p className="text-sm">{errors.idCardTypeId}</p>
            </div>
          )}
        </div>

        {/* Numéro de carte d'identité - avec validation pattern comme customers.search.tsx */}
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
          {/* Message d'erreur de validation du pattern */}
          {idCardValidationError && touchedFields.has('idCardNumber') && (
            <div className="flex items-start gap-2 text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-1 duration-200">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <p className="text-sm">{idCardValidationError}</p>
            </div>
          )}
          {/* Message de succès si pattern valide */}
          {selectedCardType?.validation_pattern && !idCardValidationError && formData.idCardNumber && touchedFields.has('idCardNumber') && !errors.idCardNumber && (
            <div className="flex items-start gap-2 text-green-600 dark:text-green-400 animate-in fade-in slide-in-from-top-1 duration-200">
              <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <p className="text-sm">Format valide pour {selectedCardType.name}</p>
            </div>
          )}
        </div>
      </div>
    </FormSection>
  );
}

