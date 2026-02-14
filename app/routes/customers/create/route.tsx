import { useState, useEffect } from 'react';
import { useNavigate, data, useLoaderData, useActionData, Form } from 'react-router';
import { 
  Loader2,
  Save,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  UserCheck
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
import { useIdCardValidation } from '../search/hooks/useIdCardValidation';
import {
  PersonalInfoSection,
  ContactInfoSection
} from './components';

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
        error: 'Erreurs de validation',
        customer: null,
        validationErrors: errorData?.errors || null,
        errorType: 'validation'
      }, { status: 422 });
    }
    
    // Autres erreurs
    return data({
      success: false,
      error: error?.message || errorData?.message || t.customerCreate.errors.createFailed || 'Une erreur est survenue',
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

  const {
    formData,
    errors,
    touchedFields,
    updateField,
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
        toast.success(t.customerCreate.success);
        setSuccessMessage(t.customerCreate.success);
        setErrorMessage('');
        
        const timeoutId = setTimeout(() => {
          navigate(`/sales/activation?customerId=${actionData.customer.id}`, {
            state: {
              customer: actionData.customer
            }
          });
        }, 1500);
        
        return () => clearTimeout(timeoutId);
      } else if (actionData.error) {
        const errorType = (actionData as any).errorType;
        
        if (errorType === 'duplicate' && (actionData as any).existingCustomer) {
          const existingCustomer = (actionData as any).existingCustomer;
          const errorMsg = `${actionData.error} - Client: ${existingCustomer.full_name}. Souhaitez-vous l'activer ?`;
          toast.error(errorMsg);
          setErrorMessage(errorMsg);
        } 
        else if (errorType === 'validation' && (actionData as any).validationErrors) {
          const validationErrors = (actionData as any).validationErrors;
          const errorMessages = Object.entries(validationErrors)
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
            .join(' | ');
          const errorMsg = `${actionData.error}: ${errorMessages}`;
          toast.error(errorMsg);
          setErrorMessage(errorMsg);
        }
        else if (errorType === 'authentication') {
          toast.error(actionData.error);
          setErrorMessage(actionData.error);
          navigate('/login');
        }
        else {
          toast.error(actionData.error);
          setErrorMessage(actionData.error);
        }
        
        setSuccessMessage('');
      }
    }
  }, [actionData, navigate, t.customerCreate.success]);

  // Gérer le changement du type de carte
  const handleIdCardTypeChange = (value: string) => {
    updateField('idCardTypeId', value);
    
    // Revalider le numéro de carte si déjà rempli
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

  // Gérer le changement du numéro de carte
  const handleIdCardNumberChange = (value: string) => {
    updateField('idCardNumber', value);
    
    if (value.length > 0) {
      validateIdCardNumber(value);
    } else {
      setIdCardValidationError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    // La validation côté client avant soumission
    if (!validateForm() || idCardValidationError) {
      e.preventDefault();
      setErrorMessage(t.customerCreate.errors.createFailed);
      return;
    }
    
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
  };

  // Vérifier si le formulaire est vraiment valide (tous les champs + pas d'erreur de validation carte)
  const isFormReallyValid = isFormValid && !idCardValidationError && formData.idCardNumber.length >= 5;

  return (
    <Layout>
      <Toaster />
      <div className="min-h-screen bg-linear-to-br from-background via-background/95 to-primary/5 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[25%] -right-[15%] w-[60%] h-[60%] bg-linear-to-br from-primary/25 via-purple-500/20 to-pink-500/15 blur-[140px] rounded-full mix-blend-screen opacity-60 animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute top-[35%] -left-[15%] w-[50%] h-[50%] bg-linear-to-br from-secondary/25 via-blue-500/20 to-cyan-500/15 blur-[120px] rounded-full mix-blend-screen opacity-50 animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
          <div className="absolute bottom-[5%] right-[15%] w-[40%] h-[40%] bg-linear-to-br from-emerald-500/20 via-teal-500/15 to-green-500/10 blur-[100px] rounded-full mix-blend-screen opacity-40 animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
          <div className="absolute top-[60%] right-[40%] w-[25%] h-[25%] bg-linear-to-br from-violet-500/15 to-fuchsia-500/10 blur-[80px] rounded-full mix-blend-screen opacity-30 animate-pulse" style={{ animationDuration: '7s', animationDelay: '1s' }} />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size[4rem_4rem] mask[radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="mb-6 sm:mb-8 animate-in fade-in slide-in-from-left-4 duration-500">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="group pl-0 hover:bg-primary/5 rounded-lg px-3 py-2 -ml-3 transition-all duration-300 hover:shadow-sm"
              disabled={loading}
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-semibold">{t.customerCreate.cancel}</span>
            </Button>
          </div>

          <div className="text-center mb-10 sm:mb-12 space-y-5 animate-in fade-in slide-in-from-top-6 duration-700">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-linear-to-r from-primary/40 via-purple-500/40 to-pink-500/30 blur-3xl opacity-60 animate-pulse" style={{ animationDuration: '4s' }} />
              <div className="absolute inset-0 bg-linear-to-r from-primary/30 to-purple-500/30 blur-2xl opacity-50" />
              
              <h1 className="relative text-4xl sm:text-5xl md:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-linear-to-r from-primary via-purple-500 to-primary animate-gradient bg-size-[200%_auto]">
                {t.customerCreate.title}
              </h1>
            </div>
            
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground/90 max-w-2xl mx-auto leading-relaxed font-medium px-4">
              {t.customerCreate.subtitle}
            </p>
            
            <div className="flex items-center justify-center gap-3 pt-2">
              <div className="h-1 w-12 bg-linear-to-r from-transparent via-primary/50 to-transparent rounded-full" />
              <div className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-pulse" />
              <div className="h-1 w-12 bg-linear-to-r from-transparent via-purple-500/50 to-transparent rounded-full" />
            </div>
          </div>

          {successMessage && (
            <div className="mb-6 sm:mb-8 relative overflow-hidden rounded-2xl bg-linear-to-br from-green-500/10 via-emerald-500/5 to-teal-500/10 border-2 border-green-500/30 backdrop-blur-xl shadow-2xl shadow-green-500/10 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="absolute inset-0 bg-linear-to-br from-green-400/10 via-emerald-400/5 to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(34,197,94,0.1),transparent)]" />
              
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
              
              <div className="relative p-6 flex items-start gap-4">
                <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-green-500/40 rounded-full blur-xl animate-pulse" style={{ animationDuration: '2s' }} />
                  <div className="absolute inset-0 bg-green-400/30 rounded-full blur-md" />
                  
                  <div className="relative p-3 bg-linear-to-br from-green-500 via-emerald-500 to-green-600 rounded-xl shadow-lg shadow-green-500/50">
                    <CheckCircle className="h-7 w-7 text-white" strokeWidth={2.5} />
                  </div>
                </div>
                
                <div className="flex-1 pt-1">
                  <p className="font-bold text-green-700 dark:text-green-300 text-lg mb-1.5">Succès !</p>
                  <p className="text-green-600 dark:text-green-400/90 text-sm leading-relaxed font-medium">{successMessage}</p>
                </div>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 sm:mb-8 relative overflow-hidden rounded-2xl bg-linear-to-br from-red-500/10 via-red-600/5 to-rose-500/10 border-2 border-red-500/30 backdrop-blur-xl shadow-2xl shadow-red-500/10 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="absolute inset-0 bg-linear-to-br from-red-400/10 via-rose-400/5 to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(239,68,68,0.1),transparent)]" />
              
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
              
              <div className="relative p-6">
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 bg-red-500/40 rounded-full blur-xl" />
                    <div className="absolute inset-0 bg-red-400/30 rounded-full blur-md" />
                    
                    <div className="relative p-3 bg-linear-to-br from-red-500 via-rose-500 to-red-600 rounded-xl shadow-lg shadow-red-500/50">
                      <AlertTriangle className="h-7 w-7 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                  
                  <div className="flex-1 pt-1">
                    <h4 className="font-bold text-red-700 dark:text-red-300 mb-2 text-lg">
                      Erreur
                    </h4>
                    <p className="text-red-600 dark:text-red-400/90 text-sm leading-relaxed font-medium">{errorMessage}</p>
                    
                    {(actionData as any)?.errorType === 'duplicate' && (actionData as any)?.existingCustomer && (
                      <div className="mt-5 flex flex-wrap gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          className="h-11 px-5 rounded-xl border-2 border-red-500/40 bg-red-500/5 hover:bg-red-500/15 hover:border-red-500/60 text-red-700 dark:text-red-300 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20"
                          onClick={() => {
                            const customer = (actionData as any).existingCustomer;
                            navigate(`/sales/activation?customerId=${customer.id}`, {
                              state: { customer }
                            });
                          }}
                        >
                          <UserCheck className="w-4 h-4 mr-2" />
                          Activer ce client
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className="h-11 px-5 rounded-xl hover:bg-red-500/10 text-red-600 dark:text-red-400 font-semibold transition-all duration-300"
                          onClick={() => {
                            setErrorMessage('');
                            resetForm();
                          }}
                        >
                          Réessayer
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <Card className="border-0 shadow-2xl bg-card/70 backdrop-blur-2xl ring-1 ring-white/10 dark:ring-white/5 overflow-hidden relative animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-primary via-purple-500 to-pink-500">
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
            </div>

            <Form method="post" onSubmit={handleSubmit}>
              <input type="hidden" name="firstName" value={formData.firstName} />
              <input type="hidden" name="lastName" value={formData.lastName} />
              <input type="hidden" name="idCardTypeId" value={formData.idCardTypeId} />
              <input type="hidden" name="idCardNumber" value={formData.idCardNumber} />
              <input type="hidden" name="phone" value={formData.phone} />
              <input type="hidden" name="email" value={formData.email} />
              <input type="hidden" name="address" value={formData.address} />
              
              <div className="p-6 sm:p-8 md:p-10 space-y-10">
                <PersonalInfoSection
                  formData={formData}
                  errors={errors}
                  touchedFields={touchedFields}
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
                  formData={formData}
                  errors={errors}
                  touchedFields={touchedFields}
                  onFieldChange={updateField}
                  onFieldBlur={touchField}
                  t={t}
                />

                <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => navigate('/customers/search')}
                    className="group h-12 sm:h-13 rounded-xl px-6 sm:px-8 border-2 hover:border-primary/50 bg-background/80 hover:bg-primary/5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 font-semibold text-base backdrop-blur-sm"
                    disabled={loading}
                  >
                    <span className="group-hover:scale-105 transition-transform duration-300">{t.customerCreate.cancel}</span>
                  </Button>
                  
                  <Button 
                    type="submit" 
                    disabled={loading || !isFormReallyValid}
                    className="group relative h-12 sm:h-13 rounded-xl px-8 sm:px-10 font-bold text-base overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-xl hover:shadow-2xl disabled:shadow-lg"
                    style={{
                      background: isFormReallyValid 
                        ? 'linear-gradient(135deg, #5FC8E9 0%, #3BA5C7 50%, #2A8FB5 100%)' 
                        : 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
                    }}
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.2),transparent)]" />
                    
                    <div className="relative z-10 flex items-center justify-center text-white">
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin mr-2.5" />
                          <span className="font-bold">{t.customerCreate.saving}</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5 mr-2.5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300" />
                          <span className="font-bold">{t.customerCreate.save}</span>
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
