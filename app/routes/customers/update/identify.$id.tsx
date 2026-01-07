import { useState, useEffect } from 'react';
import { useNavigate, data, useLoaderData, useActionData, Form, redirect } from 'react-router';
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
import { FileText } from 'lucide-react';
import { FormSection } from '~/routes/customers/create/components/FormSection';
import { ImageUpload } from '~/components/forms/ImageUpload';
import type { CustomerIdentifyFormData } from '../identify/config';

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
    
    // Charger le client
    const customerResponse = await api.get(`/customers/${customerId}`);
    const customer: Customer = customerResponse.data?.data || customerResponse.data;
    
    // Vérifier que l'utilisateur est le créateur du client
    if (customer.created_by !== user.id) {
      return data({
        error: 'Vous n\'avez pas la permission de modifier ce client',
        hasAccess: false,
        customer: null,
        idCardTypes: []
      }, { status: 403 });
    }

    // Charger les types de cartes d'identité
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
    console.error('Erreur lors du chargement:', error?.message);
    
    // Si c'est une redirection, la propager
    if (error instanceof Response) {
      throw error;
    }
    
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
  if (!customerId) {
    return data({
      success: false,
      error: 'ID client manquant',
      customer: null
    }, { status: 400 });
  }

  const user = await getCurrentUser(request);
  if (!user) {
    return data({
      success: false,
      error: 'Vous devez être authentifié',
      customer: null
    }, { status: 401 });
  }

  try {
    const api = await createAuthenticatedApi(request);
    
    // Vérifier que le client existe et appartient à l'utilisateur
    const customerResponse = await api.get(`/customers/${customerId}`);
    const customer: Customer = customerResponse.data?.data || customerResponse.data;
    
    if (customer.created_by !== user.id) {
      return data({
        success: false,
        error: 'Vous n\'avez pas la permission de modifier ce client',
        customer: null
      }, { status: 403 });
    }

    const formData = await request.formData();
    
    const firstName = formData.get('first_name') as string;
    const lastName = formData.get('last_name') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const address = formData.get('address') as string;
    
    // Fichiers (optionnels pour la mise à jour)
    // Les noms des champs correspondent aux noms dans le formulaire HTML
    const idCardFront = formData.get('id_card_front_url');
    const idCardBack = formData.get('id_card_back_url');
    const portraitPhoto = formData.get('portrait_url');
    const locationPlan = formData.get('location_plan_url');

    // Validation basique
    if (!lastName || !phone || !address) {
      return data({
        success: false,
        error: 'Veuillez remplir tous les champs requis',
        customer: null
      }, { status: 400 });
    }

    // Construire le nom complet
    const fullName = firstName && firstName.trim() 
      ? `${firstName.trim()} ${lastName.trim()}` 
      : lastName.trim();
    
    // Préparer FormData pour l'envoi API
    const apiFormData = new FormData();
    apiFormData.append('full_name', fullName);
    apiFormData.append('phone', phone.trim());
    if (email && email.trim()) apiFormData.append('email', email.trim());
    apiFormData.append('address', address.trim());
    
    // Ajouter les fichiers seulement s'ils sont fournis
    // Utiliser les noms attendus par le serveur
    if (idCardFront instanceof File) apiFormData.append('id_card_front', idCardFront);
    if (idCardBack instanceof File) apiFormData.append('id_card_back', idCardBack);
    if (portraitPhoto instanceof File) apiFormData.append('portrait_photo', portraitPhoto);
    if (locationPlan instanceof File) apiFormData.append('location_plan', locationPlan);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    const response = await api.put(`/customers/${customerId}`, apiFormData, config);
    const updatedCustomer = response.data?.data || response.data;

    return data({
      success: true,
      customer: updatedCustomer,
      error: null
    });
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour du client:', error);
    
    const status = error?.response?.status;
    const errorData = error?.response?.data;
    
    if (status === 401) {
      return data({
        success: false,
        error: 'Vous devez être authentifié',
        customer: null,
        errorType: 'authentication'
      }, { status: 401 });
    }
    
    if (status === 403) {
      return data({
        success: false,
        error: 'Vous n\'avez pas la permission de modifier ce client',
        customer: null,
        errorType: 'permission'
      }, { status: 403 });
    }
    
    if (status === 404) {
      return data({
        success: false,
        error: 'Client introuvable',
        customer: null,
        errorType: 'not_found'
      }, { status: 404 });
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
      error: error?.message || errorData?.message || 'Une erreur est survenue lors de la mise à jour',
      customer: null,
      errorType: 'general'
    }, { status: 500 });
  }
}

// Composant DocumentsSection pour la mise à jour (fichiers optionnels)
function DocumentsSectionUpdate({
  formData,
  onFileChange,
  customer,
  t
}: {
  formData: CustomerIdentifyFormData;
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
    <FormSection
      title={docs.title || 'Documents'}
      icon={FileText}
    >
      <div className="mb-6 text-sm text-muted-foreground">
        {docs.description || 'Téléchargez les documents du client (optionnel pour la mise à jour)'}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImageUpload
          name="id_card_front_url"
          label={docs.idCardFront || 'CNI Recto'}
          required={false}
          defaultImage={customer.id_card_front_url || null}
          onChange={(file) => onFileChange('id_card_front_url', file)}
          helperText={docs.idCardFrontHelper || 'Recto de la carte d\'identité'}
          texts={imageUploadTexts}
        />

        <ImageUpload
          name="id_card_back_url"
          label={docs.idCardBack || 'CNI Verso'}
          required={false}
          defaultImage={customer.id_card_back_url || null}
          onChange={(file) => onFileChange('id_card_back_url', file)}
          helperText={docs.idCardBackHelper || 'Verso de la carte d\'identité'}
          texts={imageUploadTexts}
        />

        <ImageUpload
          name="portrait_url"
          label={docs.portraitPhoto || 'Photo Portrait'}
          required={false}
          defaultImage={customer.portrait_url || null}
          onChange={(file) => onFileChange('portrait_url', file)}
          helperText={docs.portraitPhotoHelper || 'Photo portrait du client'}
          texts={imageUploadTexts}
        />

        <ImageUpload
          name="location_plan_url"
          label={docs.locationPlan || 'Plan de localisation'}
          required={false}
          defaultImage={customer.location_plan_url || null}
          onChange={(file) => onFileChange('location_plan_url', file)}
          helperText={docs.locationPlanHelper || 'Plan de localisation de l\'adresse'}
          texts={imageUploadTexts}
        />
      </div>
    </FormSection>
  );
}

export default function CustomerUpdateIdentifyPage() {
  const { t } = useTranslation();
  usePageTitle('Mise à jour du client');
  const navigate = useNavigate();
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Vérifier l'accès
  if (!loaderData.hasAccess || !loaderData.customer) {
    return (
      <Layout>
        <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="border-red-500/20 bg-red-500/10">
              <div className="p-8 text-center">
                <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-2">
                  Accès refusé
                </h2>
                <p className="text-red-600 dark:text-red-400 mb-6">
                  {loaderData.error || 'Vous n\'avez pas la permission de modifier ce client'}
                </p>
                <Button onClick={() => navigate('/customers/search')}>
                  Retour à la recherche
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  const { customer, idCardTypes } = loaderData;

  // Préparer les données initiales du formulaire depuis le client
  const getInitialFormData = () => ({
    firstName: customer.full_name?.split(' ').slice(0, -1).join(' ') || '',
    lastName: customer.full_name?.split(' ').slice(-1)[0] || customer.full_name || '',
    idCardTypeId: customer.id_card_type_id?.toString() || '',
    idCardNumber: customer.id_card_number || '',
    phone: customer.phone || '',
    email: customer.email || '',
    address: customer.address || '',
    id_card_front_url: null,
    id_card_back_url: null,
    portrait_url: null,
    location_plan_url: null
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
  } = useCustomerForm(getInitialFormData(), t.customerCreate.validation, idCardTypes);

  // Note: Le formulaire est initialisé avec les données du client depuis le loader
  // Pas besoin de useEffect car les données sont disponibles dès le premier rendu

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
        const successMsg = 'Client mis à jour avec succès';
        toast.success(successMsg);
        setSuccessMessage(successMsg);
        setErrorMessage('');
        
        setTimeout(() => {
          navigate('/');
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
  }, [actionData, navigate, t]);

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

  const handleSubmit = (e: React.FormEvent) => {
    // Validation personnalisée pour la mise à jour (fichiers optionnels)
    const textFieldsValid = 
      formData.lastName.trim() !== '' &&
      formData.idCardTypeId !== '' &&
      formData.idCardNumber.trim() !== '' &&
      formData.phone.trim() !== '' &&
      formData.address.trim() !== '' &&
      Object.values(errors).filter((error, index) => {
        const field = Object.keys(errors)[index] as keyof typeof errors;
        return !['idCardFront', 'idCardBack', 'portraitPhoto', 'locationPlan'].includes(field);
      }).every(error => !error);

    if (!textFieldsValid || idCardValidationError) {
      e.preventDefault();
      setErrorMessage("Veuillez corriger les erreurs avant de soumettre.");
      return;
    }
    
    setLoading(true);
    setErrorMessage('');
  };

  // Pour la mise à jour, les fichiers sont optionnels
  // On valide seulement les champs texte requis
  const isFormReallyValid = 
    formData.lastName.trim() !== '' &&
    formData.idCardTypeId !== '' &&
    formData.idCardNumber.trim() !== '' &&
    formData.phone.trim() !== '' &&
    formData.address.trim() !== '' &&
    !idCardValidationError &&
    formData.idCardNumber.length >= 5 &&
    Object.entries(errors).every(([field, error]) => {
      // Ignorer les erreurs de fichiers pour la mise à jour
      if (['idCardFront', 'idCardBack', 'portraitPhoto', 'locationPlan'].includes(field)) {
        return true;
      }
      return !error;
    });

  return (
    <Layout>
      <Toaster />
      <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Elements */}
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
              Mise à jour du client
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Modifiez les informations du client
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
              {/* Hidden inputs pour le FormData */}
              <input type="hidden" name="first_name" value={formData.firstName} />
              <input type="hidden" name="last_name" value={formData.lastName} />
              <input type="hidden" name="phone" value={formData.phone} />
              <input type="hidden" name="email" value={formData.email} />
              <input type="hidden" name="address" value={formData.address} />

              <div className="p-8 md:p-10 space-y-8">
                {/* Section: Informations Personnelles */}
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

                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <p className="font-medium text-blue-700 dark:text-blue-400 mb-1">
                      Note: Les documents sont optionnels pour la mise à jour
                    </p>
                    <p className="text-sm">
                      Vous pouvez laisser les documents inchangés si vous ne souhaitez que modifier les informations textuelles.
                    </p>
                  </div>
                  <DocumentsSectionUpdate
                    formData={formData}
                    onFileChange={updateFileField}
                    customer={customer}
                    t={t}
                  />
                </div>

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
                            Mise à jour...
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                            Mettre à jour
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

