import { useState, useEffect } from 'react';
import { useNavigate, data, useLoaderData, useActionData, Form, useSubmit } from 'react-router';
import { 
  Loader2,
  Save,
  ArrowLeft,
  CheckCircle,
  AlertTriangle
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

// --- LOADER ---
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
      error: 'Veuillez remplir tous les champs et ajouter tous les documents requis',
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
    
    // 409 - Client existe déjà (si applicable à l'identification)
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
        error: 'Erreurs de validation',
        customer: null,
        validationErrors: errorData?.errors || null,
        errorType: 'validation'
      }, { status: 422 });
    }
    
    // Autres erreurs
    return data({
      success: false,
      error: error?.message || errorData?.message || 'Une erreur est survenue lors de l\'identification',
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
    resetForm,
    isFormValid
  } = useCustomerForm(INITIAL_FORM_DATA, t.customerCreate.validation, idCardTypes);

  const selectedCardType = idCardTypes.find(
    (type: IdCardType) => type.id.toString() === formData.idCardTypeId
  );

  const { 
    validationError: idCardValidationError, 
    validateIdCardNumber, 
    setValidationError: setIdCardValidationError 
  } = useIdCardValidation(selectedCardType, 'Format de carte d\'identité invalide');

  useEffect(() => {
    if (actionData) {
      setLoading(false);
      
      if (actionData.success && actionData.customer) {
        toast.success(t.customerIdentify.success);
        setSuccessMessage(t.customerIdentify.success);
        setErrorMessage('');
        
        setTimeout(() => {

          navigate(`/sales/activation?customerId=${actionData.customer.id}`, {
            state: {
              customer: actionData.customer
            }
          });
        }, 2000);
      } else if (actionData.error) {
        const errorType = (actionData as any).errorType;
        
        if (errorType === 'validation' && (actionData as any).validationErrors) {
           const validationErrors = (actionData as any).validationErrors;
           const errorMessages = Object.entries(validationErrors)
             .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
             .join(' | ');
           setErrorMessage(`${actionData.error}: ${errorMessages}`);
           toast.error(actionData.error);
        } else {
           setErrorMessage(actionData.error);
           toast.error(actionData.error);
        }
      }
    }
  }, [actionData, navigate]);

  const handleIdCardTypeChange = (value: string) => {
    updateField('idCardTypeId', value);
    if (formData.idCardNumber) {
      setTimeout(() => {
        const newCardType = idCardTypes.find(
          (type: IdCardType) => type.id.toString() === value
        );
        if (newCardType?.validation_pattern) {
          validateIdCardNumber(formData.idCardNumber);
        } else {
          setIdCardValidationError('');
        }
      }, 100);
    }
  };

  const handleIdCardNumberChange = (value: string) => {
    updateField('idCardNumber', value);
    if (value.length > 0) {
      validateIdCardNumber(value);
    } else {
      setIdCardValidationError('');
    }
  };

  const submit = useSubmit();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || idCardValidationError) {
      setErrorMessage("Veuillez corriger les erreurs avant de soumettre.");
      return;
    }
    
    // Vérifier que tous les fichiers sont présents
    if (!formData.id_card_front || !formData.id_card_back || 
        !formData.portrait_photo || !formData.location_plan) {
      setErrorMessage("Veuillez ajouter tous les documents requis.");
      return;
    }
    
    setLoading(true);
    setErrorMessage('');
    
    // Construire le FormData manuellement avec tous les champs et fichiers
    const submitFormData = new FormData();
    
    // Champs texte
    submitFormData.append('first_name', formData.firstName || '');
    submitFormData.append('last_name', formData.lastName);
    submitFormData.append('id_card_type_id', formData.idCardTypeId);
    submitFormData.append('id_card_number', formData.idCardNumber);
    submitFormData.append('phone', formData.phone);
    if (formData.email) submitFormData.append('email', formData.email);
    submitFormData.append('address', formData.address);
    
    // Fichiers
    if (formData.id_card_front) submitFormData.append('id_card_front', formData.id_card_front);
    if (formData.id_card_back) submitFormData.append('id_card_back', formData.id_card_back);
    if (formData.portrait_photo) submitFormData.append('portrait_photo', formData.portrait_photo);
    if (formData.location_plan) submitFormData.append('location_plan', formData.location_plan);
    
    // Soumettre avec useSubmit
    submit(submitFormData, {
      method: 'post',
      encType: 'multipart/form-data'
    });
  };

  // Vérification de validité globale
  const isFormReallyValid = isFormValid && !idCardValidationError && formData.idCardNumber.length >= 5;

  return (
    <Layout>
      <Toaster />
      <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Elements - copied from create route */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full mix-blend-screen opacity-50 animate-pulse-slow" />
          <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] bg-secondary/20 blur-[100px] rounded-full mix-blend-screen opacity-40 animate-pulse-slow delay-1000" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/customers/search')}
              className="group pl-0 hover:bg-transparent hover:text-primary transition-colors"
              disabled={loading}
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              {t.actions.back}
            </Button>
          </div>

          <div className="text-center mb-12 space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/60 drop-shadow-sm">
              {t.customerIdentify.title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t.customerIdentify.subtitle}
            </p>
          </div>

          {successMessage && (
            <div className="mb-6 bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <CheckCircle className="h-6 w-6 text-green-600 shrink-0" />
              <p className="text-green-700 dark:text-green-400 font-medium">{successMessage}</p>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-5 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-start gap-4">
                 <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                 <div>
                   <h4 className="font-semibold text-red-700 dark:text-red-400 mb-1">Erreur</h4>
                   <p className="text-red-600 dark:text-red-400 text-sm">{errorMessage}</p>
                 </div>
              </div>
            </div>
          )}

          <Card className="border-0 shadow-2xl bg-card/50 backdrop-blur-xl ring-1 ring-white/10 dark:ring-white/5 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary via-purple-500 to-primary" />

            <Form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
              <div className="p-8 md:p-10 space-y-8">
                {/* Section: Informations Personnelles */}
                {/* Note: Nous avons besoin d'adapter les props car nous avons réutilisé des composants conçus pour le 'create' */}
                <PersonalInfoSection
                  formData={formData as any}
                  errors={errors as any}
                  touchedFields={touchedFields as any}
                  onFieldChange={updateField}
                  onFieldBlur={touchField}
                  onIdCardTypeChange={handleIdCardTypeChange}
                  onIdCardNumberChange={handleIdCardNumberChange}
                  idCardTypes={idCardTypes}
                  idCardValidationError={idCardValidationError}
                  selectedCardType={selectedCardType}
                  t={t}
                />

                <ContactInfoSection
                  formData={formData as any}
                  errors={errors as any}
                  touchedFields={touchedFields as any}
                  onFieldChange={updateField}
                  onFieldBlur={touchField}
                  t={t}
                />

                <DocumentsSection
                  formData={formData}
                  errors={errors}
                  onFileChange={updateFileField}
                  t={t}
                />

                <div className="pt-6 border-t border-border/40 flex flex-col sm:flex-row justify-end gap-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => navigate('/customers/search')}
                    className="group h-12 rounded-xl px-6 border-2 hover:border-primary/50 transition-all"
                    disabled={loading}
                  >
                    {t.actions.cancel}
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loading || !isFormReallyValid}
                    className="group relative h-12 rounded-xl px-8 font-semibold overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    style={{
                      background: 'linear-gradient(135deg, #5FC8E9 0%, #3BA5C7 100%)',
                    }}
                  >
                     <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                     <div className="relative z-10 flex items-center justify-center text-white">
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            {t.customerIdentify.submitting}
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                            {t.customerIdentify.submit}
                          </>
                        )}
                     </div>
                  </Button>
                </div>
              </div>
            </Form>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
