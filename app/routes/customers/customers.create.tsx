import { useState, useEffect } from 'react';
import { useNavigate, data, useLoaderData, useActionData, Form } from 'react-router';
import { 
  Loader2,
  Save,
  ArrowLeft,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import {
  Card,
  Button,
  Layout
} from '~/components';
import { useTranslation, usePageTitle } from '~/hooks';
import type { IdCardType } from '~/types/customer.types';
import type { Route } from "./+types/customers.create";
import { createAuthenticatedApi } from '~/services/api.server';
import { getLanguage } from '~/services/session.server';
import { getTranslations, type Language } from '~/lib/translations';

// Import des composants et configurations modulaires
import { INITIAL_FORM_DATA } from './_create/config';
import { useCustomerForm } from './_create/hooks/useCustomerForm';
import {
  PersonalInfoSection,
  ContactInfoSection
} from './_create/components';

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

  if (!firstName || !lastName || !idCardTypeId || !idCardNumber || !phone || !address) {
    return data({
      success: false,
      error: t.customerCreate.errors.createFailed || 'Veuillez remplir tous les champs requis',
      customer: null
    }, { status: 400 });
  }

  try {
    const api = await createAuthenticatedApi(request);
    
    const response = await api.post('/customers', {
      full_name: `${firstName.trim()} ${lastName.trim()}`,
      id_card_type_id: parseInt(idCardTypeId),
      id_card_number: idCardNumber.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      address: address.trim()
    });

    const customer = response.data?.data || response.data;

    return data({
      success: true,
      customer,
      error: null
    });
  } catch (error: any) {
    console.error('Erreur lors de la création du client:', error);
    return data({
      success: false,
      error: error?.message || t.customerCreate.errors.createFailed || 'Une erreur est survenue',
      customer: null
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
  } = useCustomerForm(INITIAL_FORM_DATA, t.customerCreate.validation);

  // Gérer la réponse de l'action
  useEffect(() => {
    if (actionData) {
      setLoading(false);
      
      if (actionData.success && actionData.customer) {
        setSuccessMessage(t.customerCreate.success);
        setErrorMessage('');
        
        // Rediriger vers la page d'activation après 1.5 secondes
        const timeoutId = setTimeout(() => {
          navigate('/sales/activation', { 
            state: { 
              customer: actionData.customer 
            } 
          });
        }, 1500);
        
        return () => clearTimeout(timeoutId);
      } else if (actionData.error) {
        setErrorMessage(actionData.error);
        setSuccessMessage('');
      }
    }
  }, [actionData, navigate, t.customerCreate.success]);

  const handleSubmit = (e: React.FormEvent) => {
    // La validation côté client avant soumission
    if (!validateForm()) {
      e.preventDefault();
      setErrorMessage(t.customerCreate.errors.createFailed);
      return;
    }
    
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full mix-blend-screen opacity-50 animate-pulse-slow" />
          <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] bg-secondary/20 blur-[100px] rounded-full mix-blend-screen opacity-40 animate-pulse-slow delay-1000" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Bouton retour */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/customers/search')}
              className="group pl-0 hover:bg-transparent hover:text-primary transition-colors"
              disabled={loading}
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              {t.customerSearch.results.cancel}
            </Button>
          </div>

          {/* Header */}
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/60 drop-shadow-sm">
              {t.customerCreate.title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t.customerCreate.subtitle}
            </p>
          </div>

          {/* Message de succès */}
          {successMessage && (
            <div className="mb-6 bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <CheckCircle className="h-6 w-6 text-green-600 shrink-0" />
              <p className="text-green-700 dark:text-green-400 font-medium">{successMessage}</p>
            </div>
          )}

          {/* Message d'erreur */}
          {errorMessage && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <Sparkles className="h-6 w-6 text-red-600 shrink-0" />
              <p className="text-red-700 dark:text-red-400 font-medium">{errorMessage}</p>
            </div>
          )}

          {/* Carte du formulaire */}
          <Card className="border-0 shadow-2xl bg-card/50 backdrop-blur-xl ring-1 ring-white/10 dark:ring-white/5 overflow-hidden">
            {/* Card Top Decoration */}
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary via-purple-500 to-primary" />

            <Form method="post" onSubmit={handleSubmit}>
              {/* Hidden inputs pour le FormData */}
              <input type="hidden" name="firstName" value={formData.firstName} />
              <input type="hidden" name="lastName" value={formData.lastName} />
              <input type="hidden" name="idCardTypeId" value={formData.idCardTypeId} />
              <input type="hidden" name="idCardNumber" value={formData.idCardNumber} />
              <input type="hidden" name="phone" value={formData.phone} />
              <input type="hidden" name="email" value={formData.email} />
              <input type="hidden" name="address" value={formData.address} />
              
              <div className="p-8 md:p-10 space-y-8">
                {/* Section: Informations Personnelles */}
                <PersonalInfoSection
                  formData={formData}
                  errors={errors}
                  touchedFields={touchedFields}
                  onFieldChange={updateField}
                  onFieldBlur={touchField}
                  idCardTypes={idCardTypes}
                  t={t}
                />

                {/* Section: Coordonnées */}
                <ContactInfoSection
                  formData={formData}
                  errors={errors}
                  touchedFields={touchedFields}
                  onFieldChange={updateField}
                  onFieldBlur={touchField}
                  t={t}
                />

                {/* Actions */}
                <div className="pt-6 border-t border-border/40 flex flex-col sm:flex-row justify-end gap-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => navigate('/customers/search')}
                    className="group h-12 rounded-xl px-6 border-2 hover:border-primary/50 transition-all"
                    disabled={loading}
                  >
                    {t.customerSearch.results.cancel}
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loading || !isFormValid}
                    className="group relative h-12 rounded-xl px-8 font-semibold overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    style={{
                      background: 'linear-gradient(135deg, #5FC8E9 0%, #3BA5C7 100%)',
                    }}
                  >
                    {/* Effet de brillance */}
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                    
                    {/* Contenu */}
                    <div className="relative z-10 flex items-center justify-center text-white">
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                          {t.customerCreate.saving}
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                          {t.customerCreate.save}
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
