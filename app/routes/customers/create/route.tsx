import { useState, useEffect } from 'react';
import { useNavigate, data, useLoaderData, useActionData, Form, useLocation } from 'react-router';
import { 
  Loader2,
  Save,
  ArrowLeft,
  CheckCircle,
  MapPin,
  User,
  UserCheck,
  AlertTriangle
} from 'lucide-react';
import {
  Card,
  Button,
  Layout
} from '~/components';
import { useTranslation, usePageTitle } from '~/hooks';
import type { IdCardType } from '~/types/customer.types';
import type { Route } from "./+types/route";
import { createAuthenticatedApi } from '~/services/api.server';
import { getLanguage } from '~/services/session.server';
import { getTranslations, type Language } from '~/lib/translations';
import { toast } from "sonner";
import { Toaster } from '~/components/ui/toaster';
import { customerService } from '~/lib/services/customer.service';

// Import des composants et configurations modulaires
import { INITIAL_FORM_DATA } from './config';
import { useCustomerForm } from './hooks/useCustomerForm';
import { useFormPersistence } from './hooks/useFormPersistence';
import { useIdCardValidation } from '../search/hooks/useIdCardValidation';
import {
  PersonalInfoSection,
  ContactInfoSection
} from './components';

import { 
  useStepNavigation, 
  StepIndicator, 
  FormFooter, 
  type StepDefinition 
} from '~/components/forms/wizard';

// --- LOADER ---
export async function loader({ request }: Route.LoaderArgs) {
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
export async function action({ request }: Route.ActionArgs) {
  const language = (await getLanguage(request)) as Language;
  const t = getTranslations(language);
  
  const formData = await request.formData();
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const idCardTypeId = formData.get('idCardTypeId') as string;
  const idCardNumber = formData.get('idCardNumber') as string;
  const phone = formData.get('phone') as string;
  const email = formData.get('email') as string;
  const address = formData.get('address') as string;

  // firstName est optionnel, les autres champs sont requis
  if (!lastName || !idCardTypeId || !idCardNumber || !phone || !address) {
    return data({
      success: false,
      error: t.customerCreate.errors.createFailed || 'Veuillez remplir tous les champs requis',
      customer: null
    }, { status: 400 });
  }

  try {
    const api = await createAuthenticatedApi(request);
    
    // Construire le nom complet - firstName est optionnel
    const fullName = firstName && firstName.trim() 
      ? `${firstName.trim()} ${lastName.trim()}` 
      : lastName.trim();
    
    const customer = await customerService.createCustomer({
      full_name: fullName,
      id_card_type_id: idCardTypeId,
      id_card_number: idCardNumber.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      address: address.trim()
    }, api);

    return data({
      success: true,
      customer,
      error: null
    });
  } catch (error: any) {
    console.error('Erreur lors de la création du client:', error);
    
    // Gérer les erreurs spécifiques
    const status = error?.response?.status;
    const errorData = error?.response?.data;
    
    // 401 - Non authentifié
    if (status === 401) {
      return data({
        success: false,
        error: 'Vous devez être authentifié',
        customer: null,
        errorType: 'authentication'
      }, { status: 401 });
    }
    
    // 409 - Client existe déjà
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
    
    // 422 - Erreurs de validation
    if (status === 422) {
      return data({
        success: false,
        error: t.common.validationError || 'Erreurs de validation',
        customer: null,
        validationErrors: errorData?.errors || null,
        errorType: 'validation'
      }, { status: 422 });
    }
    
    // Erreur générique par défaut
    return data({
      success: false,
      error: error?.message || errorData?.message || t.customerCreate.errors.createFailed || 'Erreur Serveur Interne',
      customer: null,
      errorType: 'general'
    }, { status: 500 });
  }
}

export default function CustomerCreatePage() {
  const { t } = useTranslation();
  usePageTitle(t.pages.customers.create.title);
  const navigate = useNavigate();
  const { idCardTypes } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const location = useLocation();

  // Initialise le formulaire avec les données pré-remplies depuis la page de recherche
  const searchState = location.state as { idCardTypeId?: string | number; idCardNumber?: string } | null;
  const initialData = (searchState?.idCardTypeId || searchState?.idCardNumber)
    ? {
        ...INITIAL_FORM_DATA,
        idCardTypeId: searchState.idCardTypeId?.toString() ?? INITIAL_FORM_DATA.idCardTypeId,
        idCardNumber: searchState.idCardNumber ?? INITIAL_FORM_DATA.idCardNumber,
      }
    : INITIAL_FORM_DATA;

  const {
    formData,
    errors,
    touchedFields,
    updateField,
    touchField,
    validateForm,
    resetForm,
    setExternalErrors,
    isFormValid
  } = useCustomerForm(initialData, t.customerCreate.validation, idCardTypes);

  const { clearPersistence } = useFormPersistence(formData, updateField);

  type StepId = 'personal' | 'contact';
  const stepsList: StepId[] = ['personal', 'contact'];
  const { activeStep, setActiveStep, nextStep, prevStep, isFirstStep, isLastStep } = useStepNavigation(stepsList);

  const selectedCardType = idCardTypes.find(
    (type: IdCardType) => type.id.toString() === formData.idCardTypeId
  );

  const { validationError: idCardValidationError, validateIdCardNumber, setValidationError: setIdCardValidationError } =
    useIdCardValidation(selectedCardType, 'Format de carte d\'identité invalide');

  // Gestion des résultats de l'action (Succès/Erreur)
  useEffect(() => {
    if (actionData) {
      setLoading(false);
      
      if (actionData.success && actionData.customer) {
        toast.success(t.customerCreate.success);
        setSuccessMessage(t.customerCreate.success);
        setErrorMessage('');
        clearPersistence(); // Nettoie le storage après succès
        
        const timeoutId = setTimeout(() => {
          navigate(`/sales/activation?customerId=${actionData.customer.id}`, {
            state: { customer: actionData.customer }
          });
        }, 1500);
        return () => clearTimeout(timeoutId);
      } 
      
      if (actionData.error) {
        const errorType = (actionData as any).errorType;
        const validationErrors = (actionData as any).validationErrors;
        
        // Gestion des doublons (409)
        if (errorType === 'duplicate' && (actionData as any).existingCustomer) {
          const existingCustomer = (actionData as any).existingCustomer;
          setErrorMessage(`${actionData.error} - Client: ${existingCustomer.full_name}. ${t.customerCreate.validation.duplicate}`);
        } 
        // Synchronisation des erreurs de validation serveur
        else if (errorType === 'validation' && validationErrors) {
          const mappedErrors: Record<string, string> = {};
          Object.entries(validationErrors).forEach(([field, msgs]) => {
            if (Array.isArray(msgs) && msgs.length > 0) mappedErrors[field] = msgs[0];
            else if (typeof msgs === 'string') mappedErrors[field] = msgs;
          });
          
          setExternalErrors(mappedErrors);
          
          const errorMessages = Object.values(mappedErrors);
          setErrorMessage(errorMessages.length > 0 
            ? `${actionData.error}: ${errorMessages.join('. ')}` 
            : actionData.error
          );
        } else {
          setErrorMessage(actionData.error);
        }
        
        toast.error(actionData.error);
        setSuccessMessage('');
      }
    }
  }, [actionData, navigate, t.customerCreate.success]);

  // Valide le numéro de carte quand le type de carte change et qu'un numéro est déjà renseigné.
  // Cet effet s'exécute après le re-render, donc selectedCardType est à jour.
  useEffect(() => {
    if (formData.idCardNumber && formData.idCardTypeId) {
      if (selectedCardType?.validation_pattern) {
        validateIdCardNumber(formData.idCardNumber);
      } else {
        setIdCardValidationError('');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.idCardTypeId]);

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
      setErrorMessage(t.customerCreate.errors.createFailed);
      return;
    }
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const isPersonalValid = !!(formData.lastName && formData.idCardTypeId && formData.idCardNumber && !idCardValidationError && formData.idCardNumber.length >= 5 && !errors.lastName && !errors.idCardNumber);
  const isContactValid = !!(formData.phone && formData.address && formData.address.length >= 3 && !errors.phone && !errors.address);
  const isFormReallyValid = !!(isFormValid && !idCardValidationError && formData.idCardNumber.length >= 5);

  const stepDefinitions: StepDefinition<StepId>[] = [
    {
      id: 'personal',
      label: t.customerCreate.steps.personal.label,
      title: t.customerCreate.steps.personal.title,
      icon: User,
      isValid: isPersonalValid,
      validationErrorMsg: t.customerCreate.validation.personalRequired,
      touchFields: () => {
        touchField('lastName');
        touchField('idCardTypeId');
        touchField('idCardNumber');
      }
    },
    {
      id: 'contact',
      label: t.customerCreate.steps.contact.label,
      title: t.customerCreate.steps.contact.title,
      icon: MapPin,
      isValid: isContactValid,
      validationErrorMsg: t.customerCreate.validation.contactRequired,
      touchFields: () => {
        touchField('phone');
        touchField('address');
      }
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
            <Button variant="ghost" onClick={() => navigate('/')} className="group pl-0 hover:bg-primary/5 rounded-lg px-3 py-2 -ml-3 transition-all duration-300 hover:shadow-sm" disabled={loading}>
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-semibold">{t.customerCreate.cancel}</span>
            </Button>
          </div>

          <div className="text-center mb-10 sm:mb-12 space-y-5 animate-in fade-in slide-in-from-top-6 duration-700">
            <h1 className="relative text-4xl sm:text-5xl md:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-linear-to-r from-primary via-purple-500 to-primary animate-gradient bg-size-[200%_auto]">
              {t.customerCreate.title}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground/90 max-w-2xl mx-auto leading-relaxed font-medium px-4">
              {t.customerCreate.subtitle}
            </p>
          </div>

          {successMessage && (
            <div className="mb-6 sm:mb-8 relative overflow-hidden rounded-2xl bg-linear-to-br from-green-500/10 via-emerald-500/5 to-teal-500/10 border-2 border-green-500/30 backdrop-blur-xl shadow-2xl shadow-green-500/10 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="relative p-6 flex items-start gap-4">
                <CheckCircle className="h-7 w-7 text-green-500" />
                <div className="flex-1 pt-1">
                  <p className="font-bold text-green-700 dark:text-green-300 text-lg mb-1.5">{t.common.success} !</p>
                  <p className="text-green-600 dark:text-green-400/90 text-sm leading-relaxed font-medium">{successMessage}</p>
                </div>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 sm:mb-8 relative overflow-hidden rounded-2xl bg-linear-to-br from-red-500/10 via-red-600/5 to-rose-500/10 border-2 border-red-500/30 backdrop-blur-xl shadow-2xl shadow-red-500/10 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="relative p-6 flex items-start gap-4">
                <AlertTriangle className="h-7 w-7 text-red-500" />
                <div className="flex-1 pt-1">
                  <h4 className="font-bold text-red-700 dark:text-red-300 mb-2 text-lg">{t.common.error}</h4>
                  <p className="text-red-600 dark:text-red-400/90 text-sm leading-relaxed font-medium">{errorMessage}</p>
                  {(actionData as any)?.errorType === 'duplicate' && (actionData as any)?.existingCustomer && (
                    <div className="mt-5 flex flex-wrap gap-3">
                      <Button type="button" variant="outline" className="h-11 px-5 rounded-xl border-2 border-red-500/40 bg-red-500/5 text-red-700" onClick={() => navigate(`/sales/activation?customerId=${(actionData as any).existingCustomer.id}`)}>
                        <UserCheck className="w-4 h-4 mr-2" />
                        {t.customerCreate.validation.activateThisCustomer}
                      </Button>
                      <Button type="button" variant="ghost" className="h-11 px-5 rounded-xl text-red-600" onClick={() => { setErrorMessage(''); resetForm(); }}>{t.connection.retry}</Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <Card className="border-0 shadow-2xl bg-card/70 backdrop-blur-2xl ring-1 ring-white/10 dark:ring-white/5 overflow-hidden relative animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-primary via-purple-500 to-pink-500" />

            <Form method="post" onSubmit={handleSubmit} className="relative">
              <input type="hidden" name="firstName" value={formData.firstName} />
              <input type="hidden" name="lastName" value={formData.lastName} />
              <input type="hidden" name="idCardTypeId" value={formData.idCardTypeId} />
              <input type="hidden" name="idCardNumber" value={formData.idCardNumber} />
              <input type="hidden" name="phone" value={formData.phone} />
              <input type="hidden" name="email" value={formData.email} />
              <input type="hidden" name="address" value={formData.address} />
              
              <div className="p-6 sm:p-8 md:p-10 space-y-8">
                <StepIndicator steps={stepDefinitions} activeStep={activeStep} onStepClick={setActiveStep} />

                <div className="relative min-h-[400px]">
                  <div className={`transition-all duration-500 ease-in-out transform ${activeStep === 'personal' ? 'opacity-100 translate-x-0 relative z-10' : 'opacity-0 -translate-x-8 absolute top-0 left-0 w-full pointer-events-none'}`}>
                    <PersonalInfoSection formData={formData} errors={errors} touchedFields={touchedFields} onFieldChange={updateField} onFieldBlur={touchField} onIdCardTypeChange={handleIdCardTypeChange} onIdCardNumberChange={handleIdCardNumberChange} idCardTypes={idCardTypes} idCardValidationError={idCardValidationError} selectedCardType={selectedCardType} t={t} />
                  </div>
                  <div className={`transition-all duration-500 ease-in-out transform ${activeStep === 'contact' ? 'opacity-100 translate-x-0 relative z-10' : 'opacity-0 translate-x-8 absolute top-0 left-0 w-full pointer-events-none'}`}>
                    <ContactInfoSection formData={formData} errors={errors} touchedFields={touchedFields} onFieldChange={updateField} onFieldBlur={touchField} t={t} />
                  </div>
                </div>

                <FormFooter
                  isFirstStep={isFirstStep}
                  isLastStep={isLastStep}
                  prevStep={prevStep}
                  nextStep={nextStep}
                  onCancel={() => navigate('/')}
                  isStepValid={activeStep === 'personal' ? isPersonalValid : isContactValid}
                  isFormValid={isFormReallyValid}
                  loading={loading}
                  loadingText={t.customerCreate.saving}
                  submitText={t.customerCreate.save}
                  cancelText={t.customerCreate.cancel}
                  onNextValidationFailed={() => {
                    const currentStep = stepDefinitions.find(s => s.id === activeStep);
                    if (currentStep?.touchFields) currentStep.touchFields();
                  }}
                  nextValidationErrorMsg={activeStep === 'personal' ? t.customerCreate.validation.personalRequired : t.customerCreate.validation.contactRequired}
                />
              </div>
            </Form>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
