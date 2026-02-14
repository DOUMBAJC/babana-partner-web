import { Phone, Mail, MapPin } from 'lucide-react';
import { FormSection } from './FormSection';
import { FormField } from './FormField';
import type { CustomerFormData, CustomerFormErrors } from '../config';

interface ContactInfoSectionProps {
  formData: CustomerFormData;
  errors: CustomerFormErrors;
  touchedFields: Set<keyof CustomerFormData>;
  onFieldChange: (field: keyof CustomerFormData, value: string) => void;
  onFieldBlur: (field: keyof CustomerFormData) => void;
  t: any;
}

/**
 * Section des informations de contact du formulaire de création client
 */
export function ContactInfoSection({
  formData,
  errors,
  touchedFields,
  onFieldChange,
  onFieldBlur,
  t
}: ContactInfoSectionProps) {
  return (
    <FormSection icon={Phone} title={t.customerCreate.contactInfo} variant="secondary">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Phone Field */}
        <FormField
          id="phone"
          label={t.customerCreate.fields.phone}
          value={formData.phone}
          onChange={(value) => onFieldChange('phone', value)}
          onBlur={() => onFieldBlur('phone')}
          error={touchedFields.has('phone') ? errors.phone : undefined}
          icon={Phone}
          type="tel"
          required
          placeholder="692129212"
          showSuccess={touchedFields.has('phone') && !errors.phone}
        />

        {/* Email Field */}
        <FormField
          id="email"
          label={t.customerCreate.fields.email}
          value={formData.email}
          onChange={(value) => onFieldChange('email', value)}
          onBlur={() => onFieldBlur('email')}
          error={touchedFields.has('email') ? errors.email : undefined}
          icon={Mail}
          type="email"
          placeholder="exemple@email.com"
          showSuccess={touchedFields.has('email') && !errors.email && formData.email.trim() !== ''}
        />

        {/* Address Field - Full Width */}
        <div className="md:col-span-2">
          <FormField
            id="address"
            label={t.customerCreate.fields.address}
            value={formData.address}
            onChange={(value) => onFieldChange('address', value)}
            onBlur={() => onFieldBlur('address')}
            error={touchedFields.has('address') ? errors.address : undefined}
            icon={MapPin}
            required
            placeholder={t.customerCreate.fields.addressPlaceholder || "Quartier, Rue, Ville"}
            showSuccess={touchedFields.has('address') && !errors.address}
          />
        </div>
      </div>
    </FormSection>
  );
}

