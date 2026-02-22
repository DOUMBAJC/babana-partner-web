import { useState, useEffect } from 'react';
import { useNavigate, data, useLoaderData, useActionData, Form, redirect } from 'react-router';
import { 
  Loader2,
  Save,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  User,
  MapPin,
  FileText
} from 'lucide-react';
import {
  Card,
  Button,
  Layout
} from '~/components';
import { useTranslation, usePageTitle } from '~/hooks';
import type { IdCardType, Customer } from '~/types/customer.types';
import type { LoaderFunctionArgs, ActionFunctionArgs } from 'react-router';
import { createAuthenticatedApi, getCurrentUser } from '~/services/api.server';
import { getLanguage } from '~/services/session.server';
import { getTranslations, type Language } from '~/lib/translations';
import { toast } from "sonner";
import { Toaster } from '~/components/ui/toaster';
import { customerService } from '~/lib/services/customer.service';

import { useCustomerForm } from '../identify/hooks/useCustomerForm';
import { useIdCardValidation } from '~/routes/customers/search/hooks/useIdCardValidation';
import {
  PersonalInfoSection,
  ContactInfoSection
} from '../identify/components';
import { FormSection } from '~/routes/customers/create/components/FormSection';
import { ImageUpload } from '~/components/forms/ImageUpload';
import type { CustomerIdentifyFormData } from '../identify/config';

import { 
  useStepNavigation, 
  StepIndicator, 
  FormFooter, 
  type StepDefinition 
} from '~/components/forms/wizard';

// --- LOADER ---
export async function loader({ request, params }: LoaderFunctionArgs) {
  try {
    const user = await getCurrentUser(request);
    
    if (!user) {
      throw redirect('/login');
    }

    const customerId = params.id;
    if (!customerId) {
      throw redirect('/customers/search');
    }

    const api = await createAuthenticatedApi(request);
    
    const customerResponse = await api.get(`/customers/${customerId}`);
    const customer: Customer = customerResponse.data?.data || customerResponse.data;
    
    if (customer.created_by !== user.id) {
      return data({
        error: 'Vous n\'avez pas la permission de modifier ce client',
        hasAccess: false,
        customer: null,
        idCardTypes: []
      }, { status: 403 });
    }

    const idCardTypesResponse = await api.get('/idCardTypes');
    const idCardTypes = Array.isArray(idCardTypesResponse.data) 
      ? idCardTypesResponse.data 
      : (idCardTypesResponse.data?.data || []);

    return data({ 
      customer, 
      idCardTypes,
      hasAccess: true,
      error: null
    });
  } catch (error: any) {
    if (error instanceof Response) throw error;
    return data({ 
      customer: null, 
      idCardTypes: [],
      hasAccess: false,
      error: error?.message || 'Erreur lors du chargement des données'
    }, { status: 500 });
  }
}

// --- ACTION ---
export async function action({ request, params }: ActionFunctionArgs) {
  const language = (await getLanguage(request)) as Language;
  const t = getTranslations(language);
  
  const customerId = params.id;
  if (!customerId) return data({ success: false, error: 'ID client manquant', customer: null }, { status: 400 });

  const user = await getCurrentUser(request);
  if (!user) return data({ success: false, error: t.common.unauthorized, customer: null }, { status: 401 });

  try {
    const api = await createAuthenticatedApi(request);
    const customerResponse = await api.get(`/customers/${customerId}`);
    const customer: Customer = customerResponse.data?.data || customerResponse.data;
    
    if (customer.created_by !== user.id) {
      return data({ success: false, error: 'Vous n\'avez pas la permission de modifier ce client', customer: null }, { status: 403 });
    }

    const formData = await request.formData();
    const firstName = formData.get('first_name') as string;
    const lastName = formData.get('last_name') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const address = formData.get('address') as string;
    const idCardTypeId = formData.get('id_card_type_id') as string;
    const idCardNumber = formData.get('id_card_number') as string;
    
    const idCardFront = formData.get('id_card_front_url');
    const idCardBack = formData.get('id_card_back_url');
    const portraitPhoto = formData.get('portrait_url');
    const locationPlan = formData.get('location_plan_url');

    if (!lastName || !phone || !address) {
      return data({ success: false, error: 'Veuillez remplir tous les champs requis', customer: null }, { status: 400 });
    }

    const fullName = firstName && firstName.trim() ? `${firstName.trim()} ${lastName.trim()}` : lastName.trim();
    
    const apiFormData = new FormData();
    apiFormData.append('full_name', fullName);
    apiFormData.append('phone', phone.trim());
    if (email && email.trim()) apiFormData.append('email', email.trim());
    apiFormData.append('address', address.trim());
    if (idCardTypeId) apiFormData.append('id_card_type_id', idCardTypeId);
    if (idCardNumber) apiFormData.append('id_card_number', idCardNumber.trim());
    
    if (idCardFront instanceof File) apiFormData.append('id_card_front', idCardFront);
    if (idCardBack instanceof File) apiFormData.append('id_card_back', idCardBack);
    if (portraitPhoto instanceof File) apiFormData.append('portrait_photo', portraitPhoto);
    if (locationPlan instanceof File) apiFormData.append('location_plan', locationPlan);

    apiFormData.append('_method', 'PUT');
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    const response = await api.post(`/customers/${customerId}`, apiFormData, config);
    const updatedCustomer = response.data?.data || response.data;

    return data({ success: true, customer: updatedCustomer, error: null });
  } catch (error: any) {
    const status = error?.response?.status;
    const errorData = error?.response?.data;
    if (status === 422) return data({ success: false, error: 'Erreurs de validation', customer: null, validationErrors: errorData?.errors || null }, { status: 422 });
    return data({ success: false, error: error?.message || t.common.serverError, customer: null }, { status: 500 });
  }
}

function DocumentsSectionUpdate({
  onFileChange,
  customer,
  t
}: {
  onFileChange: (field: keyof CustomerIdentifyFormData, file: File | null) => void;
  customer: Customer;
  t: any;
}) {
  const docs = t.customerIdentify?.documents || {};
  const imageUploadTexts = {
    change: docs.change || 'Changer',
    dragDrop: docs.dragDrop || 'Glisser-déposer',
    fileType: docs.fileType || 'Type de fichier'
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-center gap-3">
        <FileText className="h-5 w-5 text-blue-600 shrink-0" />
        <p className="text-blue-700 dark:text-blue-400 text-sm font-medium">{t.customerIdentify.documents.optional}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImageUpload name="id_card_front_url" label={docs.idCardFront || 'CNI Recto'} required={false} defaultImage={customer.id_card_front_url || null} onChange={(file) => onFileChange('id_card_front', file)} helperText={docs.idCardFrontHelper || 'Recto de la carte d\'identité'} texts={imageUploadTexts} />
        <ImageUpload name="id_card_back_url" label={docs.idCardBack || 'CNI Verso'} required={false} defaultImage={customer.id_card_back_url || null} onChange={(file) => onFileChange('id_card_back', file)} helperText={docs.idCardBackHelper || 'Verso de la carte d\'identité'} texts={imageUploadTexts} />
        <ImageUpload name="portrait_url" label={docs.portraitPhoto || 'Photo Portrait'} required={false} defaultImage={customer.portrait_url || null} onChange={(file) => onFileChange('portrait_photo', file)} helperText={docs.portraitPhotoHelper || 'Photo portrait du client'} texts={imageUploadTexts} />
        <ImageUpload name="location_plan_url" label={docs.locationPlan || 'Plan de localisation'} required={false} defaultImage={customer.location_plan_url || null} onChange={(file) => onFileChange('location_plan', file)} helperText={docs.locationPlanHelper || 'Plan de localisation de l\'adresse'} texts={imageUploadTexts} />
      </div>
    </div>
  );
}

export default function CustomerUpdateIdentifyPage() {
  const { t } = useTranslation();
  usePageTitle(t.customerUpdate.title);
  const navigate = useNavigate();
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!loaderData.hasAccess || !loaderData.customer) {
    return (
      <Layout>
        <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="border-red-500/20 bg-red-500/10 p-8 text-center ring-1 ring-red-500/20 backdrop-blur-xl">
              <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-2">{t.common.accessDenied}</h2>
              <p className="text-red-600 dark:text-red-400 mb-6">{loaderData.error || t.common.accessDenied}</p>
              <Button onClick={() => navigate('/customers/search')}>{t.customerSearch.accessDenied.backHome}</Button>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  const { customer, idCardTypes } = loaderData;

  const getInitialFormData = () => ({
    firstName: customer.full_name?.split(' ').slice(0, -1).join(' ') || '',
    lastName: customer.full_name?.split(' ').slice(-1)[0] || customer.full_name || '',
    idCardTypeId: customer.id_card_type_id?.toString() || '',
    idCardNumber: customer.id_card_number || '',
    phone: customer.phone || '',
    email: customer.email || '',
    address: customer.address || '',
    id_card_front: null,
    id_card_back: null,
    portrait_photo: null,
    location_plan: null
  });

  const {
    formData,
    errors,
    touchedFields,
    updateField,
    updateFileField,
    touchField,
    validateForm,
    isFormValid
  } = useCustomerForm(getInitialFormData(), t.customerCreate.validation, idCardTypes, { requiredFiles: false });

  type StepId = 'personal' | 'contact' | 'documents';
  const stepsList: StepId[] = ['personal', 'contact', 'documents'];
  const { activeStep, setActiveStep, nextStep, prevStep, isFirstStep, isLastStep } = useStepNavigation(stepsList);

  const selectedCardType = idCardTypes.find((type: IdCardType) => type.id.toString() === formData.idCardTypeId);
  const { validationError: idCardValidationError, validateIdCardNumber, setValidationError: setIdCardValidationError } = 
    useIdCardValidation(selectedCardType, t.customerSearch.errors.invalidFormat);

  useEffect(() => {
    if (actionData) {
      setLoading(false);
      if (actionData.success) {
        toast.success(t.customerUpdate.success);
        setSuccessMessage(t.customerUpdate.success);
        setErrorMessage('');
        setTimeout(() => navigate('/'), 2000);
      } else if (actionData.error) {
        setErrorMessage(actionData.error);
        toast.error(actionData.error);
      }
    }
  }, [actionData, navigate]);

  const handleIdCardTypeChange = (value: string) => {
    updateField('idCardTypeId', value);
    if (formData.idCardNumber) {
      setTimeout(() => {
        const newCardType = idCardTypes.find((type: IdCardType) => type.id.toString() === value);
        if (newCardType?.validation_pattern) validateIdCardNumber(formData.idCardNumber);
        else setIdCardValidationError('');
      }, 100);
    }
  };

  const handleIdCardNumberChange = (value: string) => {
    updateField('idCardNumber', value);
    if (value.length > 0) validateIdCardNumber(value);
    else setIdCardValidationError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (!validateForm() || idCardValidationError) {
      e.preventDefault();
      setErrorMessage(t.customerIdentify.validation.formError);
      return;
    }
    setLoading(true);
    setErrorMessage('');
  };

  const isPersonalValid = !!(formData.lastName && formData.idCardTypeId && formData.idCardNumber && !idCardValidationError && formData.idCardNumber.length >= 5 && !errors.lastName && !errors.idCardNumber);
  const isContactValid = !!(formData.phone && formData.address && formData.address.length >= 3 && !errors.phone && !errors.address);
  const isFormReallyValid = !!(isPersonalValid && isContactValid);

  const stepDefinitions: StepDefinition<StepId>[] = [
    {
      id: 'personal',
      label: t.customerIdentify.steps.personal.label,
      title: t.customerIdentify.steps.personal.title,
      icon: User,
      isValid: isPersonalValid,
      validationErrorMsg: t.customerIdentify.validation.personalRequired,
      touchFields: () => { touchField('lastName'); touchField('idCardTypeId'); touchField('idCardNumber'); }
    },
    {
      id: 'contact',
      label: t.customerIdentify.steps.contact.label,
      title: t.customerIdentify.steps.contact.title,
      icon: MapPin,
      isValid: isContactValid,
      validationErrorMsg: t.customerIdentify.validation.contactRequired,
      touchFields: () => { touchField('phone'); touchField('address'); }
    },
    {
      id: 'documents',
      label: t.customerIdentify.steps.documents.label,
      title: t.customerIdentify.steps.documents.title,
      icon: FileText,
      isValid: true, // Optional for update
    }
  ];

  return (
    <Layout>
      <Toaster />
      <div className="min-h-screen bg-linear-to-br from-background via-background/95 to-primary/5 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[25%] -right-[15%] w-[60%] h-[60%] bg-linear-to-br from-primary/25 via-purple-500/20 to-pink-500/15 blur-[140px] rounded-full opacity-60 animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute top-[35%] -left-[15%] w-[50%] h-[50%] bg-linear-to-br from-secondary/25 via-blue-500/20 to-cyan-500/15 blur-[120px] rounded-full opacity-50 animate-pulse" style={{ animationDuration: '10s' }} />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size[4rem_4rem] mask[radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="mb-8 animate-in fade-in slide-in-from-left-4 duration-500">
            <Button variant="ghost" onClick={() => navigate('/customers/search')} className="group pl-0 hover:bg-primary/5 rounded-lg px-3 py-2 -ml-3 transition-all">
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold">{t.actions.back}</span>
            </Button>
          </div>

          <div className="text-center mb-10 sm:mb-12 space-y-5 animate-in fade-in slide-in-from-top-6 duration-700">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-linear-to-r from-primary via-purple-500 to-primary animate-gradient bg-size-[200%_auto]">
              {t.customerUpdate.title}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground/90 max-w-2xl mx-auto font-medium px-4">{t.customerUpdate.subtitle}</p>
          </div>

          {successMessage && (
            <div className="mb-6 bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <CheckCircle className="h-6 w-6 text-green-600 shrink-0" />
              <p className="text-green-700 dark:text-green-400 font-medium">{successMessage}</p>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-5 animate-in fade-in slide-in-from-top-2 duration-300 flex items-start gap-4">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div><h4 className="font-semibold text-red-700 dark:text-red-400 mb-1">{t.common.error}</h4><p className="text-red-600 dark:text-red-400 text-sm">{errorMessage}</p></div>
            </div>
          )}

          <Card className="border-0 shadow-2xl bg-card/70 backdrop-blur-2xl ring-1 ring-white/10 dark:ring-white/5 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-primary via-purple-500 to-pink-500" />

            <Form method="post" encType="multipart/form-data" onSubmit={handleSubmit} className="relative p-6 sm:p-8 md:p-10 space-y-8">
              <input type="hidden" name="first_name" value={formData.firstName} />
              <input type="hidden" name="last_name" value={formData.lastName} />
              <input type="hidden" name="phone" value={formData.phone} />
              <input type="hidden" name="email" value={formData.email} />
              <input type="hidden" name="address" value={formData.address} />
              <input type="hidden" name="id_card_type_id" value={formData.idCardTypeId} />
              <input type="hidden" name="id_card_number" value={formData.idCardNumber} />

              <StepIndicator steps={stepDefinitions} activeStep={activeStep} onStepClick={setActiveStep} />

              <div className="relative min-h-[400px]">
                <div className={`transition-all duration-500 transform ${activeStep === 'personal' ? 'opacity-100 translate-x-0 relative z-10' : 'opacity-0 -translate-x-8 absolute top-0 left-0 w-full pointer-events-none'}`}>
                  <PersonalInfoSection formData={formData as any} errors={errors as any} touchedFields={touchedFields as any} onFieldChange={updateField} onFieldBlur={touchField} onIdCardTypeChange={handleIdCardTypeChange} onIdCardNumberChange={handleIdCardNumberChange} idCardTypes={idCardTypes} idCardValidationError={idCardValidationError} selectedCardType={selectedCardType} t={t} />
                </div>
                <div className={`transition-all duration-500 transform ${activeStep === 'contact' ? 'opacity-100 translate-x-0 relative z-10' : 'opacity-0 translate-x-8 absolute top-0 left-0 w-full pointer-events-none'}`}>
                  <ContactInfoSection formData={formData as any} errors={errors as any} touchedFields={touchedFields as any} onFieldChange={updateField} onFieldBlur={touchField} t={t} />
                </div>
                <div className={`transition-all duration-500 transform ${activeStep === 'documents' ? 'opacity-100 translate-x-0 relative z-10' : 'opacity-0 translate-x-8 absolute top-0 left-0 w-full pointer-events-none'}`}>
                  <DocumentsSectionUpdate onFileChange={updateFileField} customer={customer} t={t} />
                </div>
              </div>

              <FormFooter
                isFirstStep={isFirstStep}
                isLastStep={isLastStep}
                prevStep={prevStep}
                nextStep={nextStep}
                onCancel={() => navigate('/customers/search')}
                isStepValid={activeStep === 'personal' ? isPersonalValid : activeStep === 'contact' ? isContactValid : true}
                isFormValid={isFormReallyValid}
                loading={loading}
                loadingText={t.customerUpdate.updating}
                submitText={t.customerUpdate.submit}
                cancelText={t.actions.cancel}
                onNextValidationFailed={() => {
                  const currentStep = stepDefinitions.find(s => s.id === activeStep);
                  if (currentStep?.touchFields) currentStep.touchFields();
                }}
                nextValidationErrorMsg={activeStep === 'personal' ? t.customerIdentify.validation.personalRequired : t.customerIdentify.validation.contactRequired}
              />
            </Form>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

