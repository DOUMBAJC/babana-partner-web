import { FileText } from 'lucide-react';
import { FormSection } from '~/routes/customers/create/components/FormSection';
import { ImageUpload } from '~/components/forms/ImageUpload';
import type { CustomerIdentifyFormData, CustomerIdentifyFormErrors } from '../config';

interface DocumentsSectionProps {
  formData: CustomerIdentifyFormData;
  errors: CustomerIdentifyFormErrors;
  onFileChange: (field: keyof CustomerIdentifyFormData, file: File | null) => void;
  t: any;
}

export function DocumentsSection({
  formData,
  errors,
  onFileChange,
  t
}: DocumentsSectionProps) {
  const docs = t.customerIdentify.documents;
  const imageUploadTexts = {
    change: docs.change,
    dragDrop: docs.dragDrop,
    fileType: docs.fileType
  };

  return (
    <FormSection
      title={docs.title}
      icon={FileText}
    >
      <div className="mb-6 text-sm text-muted-foreground">
        {docs.description}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CNI Recto */}
        <ImageUpload
          name="id_card_front"
          label={docs.idCardFront}
          required
          error={errors.id_card_front}
          onChange={(file) => onFileChange('id_card_front', file)}
          helperText={docs.idCardFrontHelper}
          texts={imageUploadTexts}
        />

        {/* CNI Verso */}
        <ImageUpload
          name="id_card_back"
          label={docs.idCardBack}
          required
          error={errors.id_card_back}
          onChange={(file) => onFileChange('id_card_back', file)}
          helperText={docs.idCardBackHelper}
          texts={imageUploadTexts}
        />

        {/* Photo Portrait */}
        <ImageUpload
          name="portrait_photo"
          label={docs.portraitPhoto}
          required
          error={errors.portrait_photo}
          onChange={(file) => onFileChange('portrait_photo', file)}
          helperText={docs.portraitPhotoHelper}
          texts={imageUploadTexts}
        />

        {/* Plan de localisation */}
        <ImageUpload
          name="location_plan"
          label={docs.locationPlan}
          required
          error={errors.location_plan}
          onChange={(file) => onFileChange('location_plan', file)}
          helperText={docs.locationPlanHelper}
          texts={imageUploadTexts}
        />
      </div>
    </FormSection>
  );
}
