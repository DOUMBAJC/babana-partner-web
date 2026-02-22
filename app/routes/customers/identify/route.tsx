import { useState, useEffect } from 'react';
import { useNavigate, data, useLoaderData, useActionData, Form, useSubmit } from 'react-router';
import {
  Loader2,
  Save,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  User,
  MapPin,
  FileCheck
} from 'lucide-react';
import {
  Card,
  Button,
  Layout
} from '~/components';
import { useTranslation, usePageTitle } from '~/hooks';
import type { IdCardType } from '~/types/customer.types';
import type { LoaderFunctionArgs, ActionFunctionArgs } from 'react-router';
import { createAuthenticatedApi } from '~/services/api.server';
import { getLanguage } from '~/services/session.server';
import { getTranslations, type Language } from '~/lib/translations';
import { toast } from "sonner";
import { Toaster } from '~/components/ui/toaster';
import { customerService } from '~/lib/services/customer.service';

import { INITIAL_FORM_DATA } from './config';
import { useCustomerForm } from './hooks/useCustomerForm';
import { useIdCardValidation } from '../search/hooks/useIdCardValidation';
import {
  PersonalInfoSection,
  ContactInfoSection,
  DocumentsSection
} from './components';

import {
  useStepNavigation,
  StepIndicator,
  FormFooter,
  type StepDefinition
} from '~/components/forms/wizard';

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const api = await createAuthenticatedApi(request);
    const response = await api.get('/idCardTypes');

    const idCardTypes = Array.isArray(response.data)
      ? response.data
      : (response.data?.data || []);

    return data({ idCardTypes });
  } catch (error: any) {
    console.error('Erreur lors du chargement des types de cartes:', error?.message);
    return data({ idCardTypes: [] });
  }
}

// --- ACTION ---
export async function action({ request }: ActionFunctionArgs) {
  const language = (await getLanguage(request)) as Language;
  const t = getTranslations(language);

  const formData = await request.formData();

  const firstName = formData.get('first_name') as string;
  const lastName = formData.get('last_name') as string;
  const idCardTypeId = formData.get('id_card_type_id') as string;
  const idCardNumber = formData.get('id_card_number') as string;
  const phone = formData.get('phone') as string;
  const email = formData.get('email') as string;
  const address = formData.get('address') as string;

  // Fichiers
  const idCardFront = formData.get('id_card_front');
  const idCardBack = formData.get('id_card_back');
  const portraitPhoto = formData.get('portrait_photo');
  const locationPlan = formData.get('location_plan');

  // Validation basique
  if (!lastName || !idCardTypeId || !idCardNumber || !phone || !address ||
    !idCardFront || !idCardBack || !portraitPhoto || !locationPlan) {
    return data({
      success: false,
      error: t.customerIdentify.validation.documentsRequired,
      customer: null
    }, { status: 400 });
  }

  try {
    const api = await createAuthenticatedApi(request);

    const fullName = firstName && firstName.trim()
      ? `${firstName.trim()} ${lastName.trim()}`
      : lastName.trim();

    // Préparer FormData pour l'envoi API
    const apiFormData = new FormData();
    apiFormData.append('full_name', fullName);
    apiFormData.append('id_card_type_id', idCardTypeId);
    apiFormData.append('id_card_number', idCardNumber.trim());
    apiFormData.append('phone', phone.trim());
    if (email && email.trim()) apiFormData.append('email', email.trim());
    apiFormData.append('address', address.trim());

    // Ajouter les fichiers
    if (idCardFront instanceof File) apiFormData.append('id_card_front', idCardFront);
    if (idCardBack instanceof File) apiFormData.append('id_card_back', idCardBack);
    if (portraitPhoto instanceof File) apiFormData.append('portrait_photo', portraitPhoto);
    if (locationPlan instanceof File) apiFormData.append('location_plan', locationPlan);

    // Endpoint d'identification via customerService
    const customer = await customerService.identifyCustomer(apiFormData, api);

    return data({
      success: true,
      customer,
      error: null
    });
  } catch (error: any) {
    console.error('Erreur lors de l\'identification du client:', error);

    const status = error?.response?.status;
    const errorData = error?.response?.data;

    if (status === 401) {
      return data({
        success: false,
        error: t.common.unauthorized,
        customer: null,
        errorType: 'authentication'
      }, { status: 401 });
    }

    if (status === 409) {
      const existingCustomer = errorData?.data;
      const errorMessage = errorData?.message || 'Ce client existe déjà';

      return data({
        success: false,
        error: errorMessage,
        customer: null,
        existingCustomer: existingCustomer,
        errorType: 'duplicate',
        validationErrors: errorData?.errors || null
      }, { status: 409 });
    }

    if (status === 422) {
      return data({
        success: false,
        error: 'Erreurs de validation',
        customer: null,
        validationErrors: errorData?.errors || null,
        errorType: 'validation'
      }, { status: 422 });
    }

    return data({
      success: false,
      error: error?.message || errorData?.message || t.common.serverError,
      customer: null,
      errorType: 'general'
    }, { status: 500 });
  }
}

export default function CustomerIdentifyPage() {
  const { t } = useTranslation();
  usePageTitle(t.customerIdentify.title);
  const navigate = useNavigate();
  const { idCardTypes } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const {
    formData,
    errors,
    touchedFields,
    updateField,
    updateFileField,
    touchField,
    validateForm,
    isFormValid
  } = useCustomerForm(INITIAL_FORM_DATA, t.customerCreate.validation, idCardTypes);

  type StepId = 'personal' | 'contact' | 'documents';
  const stepsList: StepId[] = ['personal', 'contact', 'documents'];
  const { activeStep, setActiveStep, nextStep, prevStep, isFirstStep, isLastStep } = useStepNavigation(stepsList);

  const selectedCardType = idCardTypes.find(
    (type: IdCardType) => type.id.toString() === formData.idCardTypeId
  );

  const { validationError: idCardValidationError, validateIdCardNumber, setValidationError: setIdCardValidationError } =
    useIdCardValidation(selectedCardType, t.customerSearch.errors.invalidFormat);

  useEffect(() => {
    if (actionData) {
      setLoading(false);
      if (actionData.success && actionData.customer) {
        toast.success(t.customerIdentify.success);
        setSuccessMessage(t.customerIdentify.success);
        setErrorMessage('');
        setTimeout(() => {
          navigate(`/sales/activation?customerId=${actionData.customer.id}`, {
            state: { customer: actionData.customer }
          });
        }, 2000);
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
    e.preventDefault();
    if (!validateForm() || idCardValidationError) {
      setErrorMessage(t.customerIdentify.validation.formError);
      return;
    }
    setLoading(true);
    setErrorMessage('');
    const submitFormData = new FormData();
    submitFormData.append('first_name', formData.firstName || '');
    submitFormData.append('last_name', formData.lastName);
    submitFormData.append('id_card_type_id', formData.idCardTypeId);
    submitFormData.append('id_card_number', formData.idCardNumber);
    submitFormData.append('phone', formData.phone);
    if (formData.email) submitFormData.append('email', formData.email);
    submitFormData.append('address', formData.address);
    if (formData.id_card_front) submitFormData.append('id_card_front', formData.id_card_front);
    if (formData.id_card_back) submitFormData.append('id_card_back', formData.id_card_back);
    if (formData.portrait_photo) submitFormData.append('portrait_photo', formData.portrait_photo);
    if (formData.location_plan) submitFormData.append('location_plan', formData.location_plan);
    submit(submitFormData, { method: 'post', encType: 'multipart/form-data' });
  };

  const isPersonalValid = !!(formData.lastName && formData.idCardTypeId && formData.idCardNumber && !idCardValidationError && formData.idCardNumber.length >= 5 && !errors.lastName && !errors.idCardNumber);
  const isContactValid = !!(formData.phone && formData.address && formData.address.length >= 3 && !errors.phone && !errors.address);
  const isDocumentsValid = !!(formData.id_card_front && formData.id_card_back && formData.portrait_photo && formData.location_plan);
  const isFormReallyValid = !!(isFormValid && !idCardValidationError && formData.idCardNumber.length >= 5);

  const stepDefinitions: StepDefinition<StepId>[] = [
    {
      id: 'personal',
      label: t.customerIdentify.steps.personal.label,
      title: t.customerIdentify.steps.personal.title,
      icon: User,
      isValid: isPersonalValid,
      validationErrorMsg: t.customerIdentify.validation.personalRequired,
      touchFields: () => {
        touchField('lastName');
        touchField('idCardTypeId');
        touchField('idCardNumber');
      }
    },
    {
      id: 'contact',
      label: t.customerIdentify.steps.contact.label,
      title: t.customerIdentify.steps.contact.title,
      icon: MapPin,
      isValid: isContactValid,
      validationErrorMsg: t.customerIdentify.validation.contactRequired,
      touchFields: () => {
        touchField('phone');
        touchField('address');
      }
    },
    {
      id: 'documents',
      label: t.customerIdentify.steps.documents.label,
      title: t.customerIdentify.steps.documents.title,
      icon: FileCheck,
      isValid: isDocumentsValid,
      validationErrorMsg: t.customerIdentify.validation.documentsRequired
    }
  ];

  return (
    <Layout>
      <Toaster />
      <div className="min-h-screen bg-linear-to-br from-background via-background/95 to-primary/5 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[25%] -right-[15%] w-[60%] h-[60%] bg-linear-to-br from-primary/25 via-purple-500/20 to-pink-500/15 blur-[140px] rounded-full mix-blend-screen opacity-60 animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute top-[35%] -left-[15%] w-[50%] h-[50%] bg-linear-to-br from-secondary/25 via-blue-500/20 to-cyan-500/15 blur-[120px] rounded-full mix-blend-screen opacity-50 animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
          <div className="absolute bottom-[5%] right-[15%] w-[40%] h-[40%] bg-linear-to-br from-emerald-500/20 via-teal-500/15 to-green-500/10 blur-[100px] rounded-full mix-blend-screen opacity-40 animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size[4rem_4rem] mask[radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="mb-6 sm:mb-8 animate-in fade-in slide-in-from-left-4 duration-500">
            <Button variant="ghost" onClick={() => navigate('/customers/search')} className="group pl-0 hover:bg-primary/5 rounded-lg px-3 py-2 -ml-3 transition-all duration-300 hover:shadow-sm" disabled={loading}>
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-semibold">{t.actions.back}</span>
            </Button>
          </div>

          <div className="text-center mb-10 sm:mb-12 space-y-5 animate-in fade-in slide-in-from-top-6 duration-700">
            <h1 className="relative text-4xl sm:text-5xl md:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-linear-to-r from-primary via-purple-500 to-primary animate-gradient bg-size-[200%_auto]">
              {t.customerIdentify.title}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground/90 max-w-2xl mx-auto font-medium px-4">
              {t.customerIdentify.subtitle}
            </p>
          </div>

          {successMessage && (
            <div className="mb-6 bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 shrink-0" />
              <p className="text-green-700 dark:text-green-400 font-medium">{successMessage}</p>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-5">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div><h4 className="font-semibold text-red-700 dark:text-red-400 mb-1">Erreur</h4><p className="text-red-600 dark:text-red-400 text-sm">{errorMessage}</p></div>
              </div>
            </div>
          )}

          <Card className="border-0 shadow-2xl bg-card/70 backdrop-blur-2xl ring-1 ring-white/10 dark:ring-white/5 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-primary via-purple-500 to-pink-500" />

            <Form method="post" encType="multipart/form-data" onSubmit={handleSubmit} className="relative">
              <div className="p-6 sm:p-8 md:p-10 space-y-8">
                <StepIndicator
                  steps={stepDefinitions}
                  activeStep={activeStep}
                  onStepClick={setActiveStep}
                />

                <div className="relative min-h-[400px]">
                  <div className={`transition-all duration-500 ease-in-out transform ${activeStep === 'personal' ? 'opacity-100 translate-x-0 relative z-10' : 'opacity-0 -translate-x-8 absolute top-0 left-0 w-full pointer-events-none'}`}>
                    <PersonalInfoSection formData={formData as any} errors={errors as any} touchedFields={touchedFields as any} onFieldChange={updateField} onFieldBlur={touchField} onIdCardTypeChange={handleIdCardTypeChange} onIdCardNumberChange={handleIdCardNumberChange} idCardTypes={idCardTypes} idCardValidationError={idCardValidationError} selectedCardType={selectedCardType} t={t} />
                  </div>
                  <div className={`transition-all duration-500 ease-in-out transform ${activeStep === 'contact' ? 'opacity-100 translate-x-0 relative z-10' : 'opacity-0 translate-x-8 absolute top-0 left-0 w-full pointer-events-none'}`}>
                    <ContactInfoSection formData={formData as any} errors={errors as any} touchedFields={touchedFields as any} onFieldChange={updateField} onFieldBlur={touchField} t={t} />
                  </div>
                  <div className={`transition-all duration-500 ease-in-out transform ${activeStep === 'documents' ? 'opacity-100 translate-x-0 relative z-10' : 'opacity-0 translate-x-8 absolute top-0 left-0 w-full pointer-events-none'}`}>
                    <DocumentsSection formData={formData} errors={errors} onFileChange={updateFileField} t={t} />
                  </div>
                </div>

                <FormFooter
                  isFirstStep={isFirstStep}
                  isLastStep={isLastStep}
                  prevStep={prevStep}
                  nextStep={nextStep}
                  onCancel={() => navigate('/customers/search')}
                  isStepValid={activeStep === 'personal' ? isPersonalValid : isContactValid}
                  isFormValid={isFormReallyValid}
                  loading={loading}
                  loadingText={t.customerIdentify.submitting}
                  submitText={t.customerIdentify.submit}
                  cancelText={t.actions.cancel}
                  onNextValidationFailed={() => {
                    const currentStep = stepDefinitions.find(s => s.id === activeStep);
                    if (currentStep?.touchFields) currentStep.touchFields();
                  }}
                  nextValidationErrorMsg={activeStep === 'personal' ? t.customerIdentify.validation.personalRequired : t.customerIdentify.validation.contactRequired}
                />
              </div>
            </Form>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
