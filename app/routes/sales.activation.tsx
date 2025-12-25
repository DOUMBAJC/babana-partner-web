import { useState, useEffect } from "react";
import { useNavigate, useLocation, data, useActionData, Form } from "react-router";
import { useTranslation, usePageTitle } from '~/hooks';
import {
  Card,
  Input,
  Button,
  Label,
  Layout,
  Badge
} from '~/components';
import { Loader2, ArrowLeft, CheckCircle, Smartphone, CreditCard, Barcode, FileText, User, Sparkles } from "lucide-react";
import type { Route } from "./+types/sales.activation";
import { createAuthenticatedApi, getCurrentUser } from '~/services/api.server';
import { getLanguage } from '~/services/session.server';
import { getTranslations, type Language } from '~/lib/translations';

// --- LOADER ---
export async function loader({ request }: Route.LoaderArgs) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return data({
        user: null,
        hasAccess: false,
        error: null
      });
    }

    // Vérifier si l'utilisateur a les permissions pour activer des SIM
    // Pour l'instant, on autorise tous les rôles authentifiés
    const hasAccess = true;

    if (!hasAccess) {
      return data({
        user,
        hasAccess: false,
        error: null
      });
    }

    return data({
      user,
      hasAccess: true,
      error: null
    });
  } catch (error: any) {
    console.error('Erreur dans le loader:', error?.message);

    return data({
      user: null,
      hasAccess: false,
      error: error?.message || 'Erreur lors du chargement des données'
    });
  }
}

// --- ACTION ---
export async function action({ request }: Route.ActionArgs) {
  const language = (await getLanguage(request)) as Language;
  const t = getTranslations(language);

  const formData = await request.formData();
  const simNumber = formData.get('simNumber') as string;
  const iccid = formData.get('iccid') as string;
  const imei = formData.get('imei') as string;
  const notes = formData.get('notes') as string;
  const customerId = formData.get('customerId') as string;

  if (!simNumber || !iccid || !imei || !customerId) {
    return data({
      success: false,
      error: 'Tous les champs requis doivent être remplis',
      activation: null
    }, { status: 400 });
  }

  try {
    const api = await createAuthenticatedApi(request);

    console.log('Envoi de la requête d\'activation:', {
      customer_id: parseInt(customerId),
      sim_number: simNumber,
      iccid: iccid,
      imei: imei,
      notes: notes || undefined
    });

    const response = await api.post('/activation-requests', {
      customer_id: parseInt(customerId),
      sim_number: simNumber,
      iccid: iccid,
      imei: imei,
      notes: notes || undefined
    });

    console.log('Réponse du serveur:', response);
    console.log('Response.data:', response.data);

    const activation = response.data?.data || response.data;

    console.log('Activation extraite:', activation);

    return data({
      success: true,
      activation,
      error: null
    });
  } catch (error: any) {
    console.error('Erreur lors de l\'activation SIM:', error);
    console.error('Détails de l\'erreur:', error.response?.data);
    return data({
      success: false,
      error: error?.response?.data?.message || error?.message || 'Une erreur est survenue lors de l\'activation',
      activation: null
    }, { status: 500 });
  }
}

interface CustomerData {
  id: string;
  full_name: string;
  lastName?: string;
  firstName?: string;
  phone?: string;
  id_card_number: string;
  id_card_type_id: number;
}

interface ActivationFormData {
  simNumber: string;
  iccid: string;
  imei: string;
  ba_notes: string;
}

interface FormErrors {
  simNumber?: string;
  iccid?: string;
  imei?: string;
  ba_notes?: string;
}

// --- COMPOSANT PRINCIPAL ---
export default function SimActivationPage({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const actionData = useActionData<typeof action>();

  usePageTitle(t.pages.sales.activation.title);

  const { user, hasAccess, error: loaderError } = loaderData;
  const isAuthenticated = !!user;

  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [formData, setFormData] = useState<ActivationFormData>({
    simNumber: "",
    iccid: "62405010000",
    imei: "",
    ba_notes: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showNoCustomerError, setShowNoCustomerError] = useState(false);
  const [showApiError, setShowApiError] = useState(false);

  // Gérer la réponse de l'action
  useEffect(() => {
    if (actionData) {
      console.log('Action data reçue:', actionData);
      console.log('Success:', actionData.success);
      console.log('Activation:', actionData.activation);
      console.log('Error:', actionData.error);

      setLoading(false);

      if (actionData.success) {
        // En cas de succès, on affiche toujours l'écran de succès
        // même si activation est null/undefined
        setShowSuccess(true);
        setErrorMessage('');
        setShowApiError(false);
      } else if (actionData.error) {
        setErrorMessage(actionData.error);
        setSuccessMessage('');
        setShowApiError(true);
      }
    }
  }, [actionData]);

  // Load customer data from location state
  useEffect(() => {
    if (location.state && location.state.customer) {
      setCustomer(location.state.customer);
      setShowNoCustomerError(false);
    } else {
      // If no customer data, show error instead of auto-redirecting
      setShowNoCustomerError(true);
    }
  }, [location.state]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // SIM Number: 9 digits starting with 62
    if (!/^62\d{7}$/.test(formData.simNumber)) {
      newErrors.simNumber = t.simActivation.errors.simNumber;
      isValid = false;
    }

    // ICCID: 19 digits starting with 6240501000
    if (!/^6240501000\d{9}$/.test(formData.iccid)) {
      newErrors.iccid = t.simActivation.errors.iccid;
      isValid = false;
    }

    // IMEI: Exactly 15 digits
    if (!/^\d{15}$/.test(formData.imei)) {
      newErrors.imei = t.simActivation.errors.imei;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Allow only numbers for specific fields
    if (['simNumber', 'iccid', 'imei'].includes(name)) {
        if (value && !/^\d+$/.test(value)) return;
    }

    setFormData((prev) => {
      const newFormData = { ...prev, [name]: value };

      // Auto-complete ICCID when simNumber is entered and valid
      if (name === 'simNumber' && value && /^62\d{7}$/.test(value)) {
        const currentIccidPrefix = prev.iccid.slice(0, Math.max(0, 19 - value.length));
        const completedIccid = (currentIccidPrefix + value).slice(0, 19);
        newFormData.iccid = completedIccid;
      }

      return newFormData;
    });

    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    // La validation côté client avant soumission
    if (!validateForm()) {
      e.preventDefault();
      setErrorMessage(t.simActivation.errors.required || 'Veuillez corriger les erreurs');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleBack = () => {
    navigate("/customers/search");
  };

  const getCustomerName = () => {
    if (!customer) return "Unknown Customer";
    if (customer.firstName && customer.lastName) return `${customer.firstName} ${customer.lastName}`;
    return customer.full_name  || "Unknown Customer";
  };

  // --- ÉCRAN D'ERREUR : AUCUN CLIENT ---
  if (showNoCustomerError) {
    return (
      <Layout>
        <div className="flex min-h-[80vh] items-center justify-center p-4">
          <Card className="w-full max-w-lg border-orange-200 bg-orange-50/50 p-8 text-center backdrop-blur-xl dark:border-orange-900/50 dark:bg-orange-900/10">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-orange-100 p-4 dark:bg-orange-900/30">
                <User className="h-12 w-12 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
              Client manquant
            </h2>
            <p className="mb-8 text-gray-600 dark:text-gray-400">
              Aucun client n'a été sélectionné pour l'activation. Veuillez d'abord rechercher et sélectionner un client.
            </p>

            <div className="space-y-3">
              <Button
                onClick={() => navigate('/customers/search')}
                className="w-full bg-linear-to-r from-orange-600 to-orange-600 hover:from-orange-700 hover:to-orange-700"
              >
                <User className="w-4 h-4 mr-2" />
                Aller à la recherche client
              </Button>

              <Button
                onClick={() => navigate('/')}
                variant="ghost"
                className="w-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                Retour à l'accueil
              </Button>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  // --- ÉCRAN DE SUCCÈS ---
  if (showSuccess) {
    return (
      <Layout>
        <div className="flex min-h-[80vh] items-center justify-center p-4">
          <Card className="w-full max-w-lg border-green-200 bg-green-50/50 p-8 text-center backdrop-blur-xl dark:border-green-900/50 dark:bg-green-900/10">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/30">
                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t.common.success}
            </h2>
            <p className="mb-8 text-gray-600 dark:text-gray-400">
              {t.simActivation.success}
            </p>

            <div className="space-y-3">
              <Button
                onClick={() => navigate('/customers/search')}
                className="w-full bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <User className="w-4 h-4 mr-2" />
                {t.simActivation.backToSearch}
              </Button>

              <Button
                onClick={() => {
                  // Reset form and stay on page for another activation
                  setShowSuccess(false);
                  setFormData({
                    simNumber: "",
                    iccid: "62405010000",
                    imei: "",
                    ba_notes: "",
                  });
                  setErrors({});
                }}
                variant="outline"
                className="w-full border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/20"
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Nouvelle activation
              </Button>

              <Button
                onClick={() => navigate('/')}
                variant="ghost"
                className="w-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                {t.actions.back}
              </Button>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  // --- ÉCRAN D'ERREUR API ---
  if (showApiError && errorMessage) {
    return (
      <Layout>
        <div className="flex min-h-[80vh] items-center justify-center p-4">
          <Card className="w-full max-w-lg border-red-200 bg-red-50/50 p-8 text-center backdrop-blur-xl dark:border-red-900/50 dark:bg-red-900/10">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/30">
                <Sparkles className="h-12 w-12 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
              Erreur d'activation
            </h2>
            <p className="mb-8 text-gray-600 dark:text-gray-400">
              {errorMessage}
            </p>

            <div className="space-y-3">
              <Button
                onClick={() => {
                  // Reset error state and allow retry
                  setShowApiError(false);
                  setErrorMessage('');
                }}
                className="w-full bg-linear-to-r from-red-600 to-red-600 hover:from-red-700 hover:to-red-700"
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Réessayer l'activation
              </Button>

              <Button
                onClick={() => navigate('/customers/search')}
                variant="outline"
                className="w-full border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <User className="w-4 h-4 mr-2" />
                Retour à la recherche
              </Button>

              <Button
                onClick={() => navigate('/')}
                variant="ghost"
                className="w-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                Retour à l'accueil
              </Button>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  // --- ÉTATS D'AFFICHAGE ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isAuthenticated && !hasAccess) {
    return (
      <Layout>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-md border-red-200 bg-red-50/50 p-8 text-center backdrop-blur-xl dark:border-red-900/50 dark:bg-red-900/10">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/30">
                <Sparkles className="h-12 w-12 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t.common.accessDenied}
            </h2>
            <p className="mb-8 text-gray-600 dark:text-gray-400">
              {t.common.forbidden}
            </p>
            <Button
              onClick={() => navigate('/')}
              className="w-full bg-linear-to-r from-red-600 to-red-600 hover:from-red-700 hover:to-red-700"
            >
              {t.actions.back}
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-4xl space-y-8 p-4 md:p-8">
        {/* Header */}
        <div className="space-y-2">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-4 pl-0 text-gray-500 hover:bg-transparent hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.simActivation.backToSearch}
          </Button>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                {t.simActivation.title}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                {t.simActivation.subtitle}
              </p>
            </div>
            {/* Show Customer Badge/Info if available */}
            {customer && (
               <Badge variant="outline" className="flex w-fit gap-2 border-orange-200 bg-orange-50 px-4 py-2 text-base font-normal text-orange-800 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-900">
                  <User className="h-4 w-4" />
                  <span>{getCustomerName()}</span>
                  <span className="opacity-60">|</span>
                  <span className="font-mono">{customer.phone}</span>
               </Badge>
            )}
          </div>
        </div>

        {/* Message de succès */}
        {successMessage && (
          <div className="mb-6 bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle className="h-6 w-6 text-green-600 shrink-0" />
            <p className="text-green-700 dark:text-green-400 font-medium">{successMessage}</p>
          </div>
        )}

        {/* Message d'erreur de validation (pas d'erreur API) */}
        {errorMessage && !showApiError && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <Sparkles className="h-6 w-6 text-red-600 shrink-0" />
            <p className="text-red-700 dark:text-red-400 font-medium">{errorMessage}</p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
           {/* Form Section */}
          <div className="md:col-span-2">
            <Card className="border-gray-200/50 bg-white/50 backdrop-blur-xl dark:border-gray-800/50 dark:bg-gray-900/50">
              <Form method="post" onSubmit={handleSubmit} className="p-6 md:p-8">
                {/* Hidden inputs pour les données du FormData */}
                <input type="hidden" name="customerId" value={customer?.id || ''} />
                <div className="grid gap-6">
                  
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-2 dark:border-gray-800">
                     <Smartphone className="h-5 w-5 text-orange-500" />
                     <h3 className="font-semibold text-gray-900 dark:text-gray-100">{t.simActivation.simInfo}</h3>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    {/* SIM Number */}
                    <div className="space-y-2">
                      <Label htmlFor="simNumber" className="text-gray-700 dark:text-gray-300">
                        {t.simActivation.fields.simNumber} <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Barcode className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          id="simNumber"
                          name="simNumber"
                          placeholder={t.simActivation.fields.simNumberPlaceholder}
                          value={formData.simNumber}
                          onChange={handleInputChange}
                          className={`pl-9 ${errors.simNumber ? "border-red-500 ring-red-500" : ""}`}
                          required
                        />
                      </div>
                      {errors.simNumber && (
                        <p className="text-xs text-red-500 animate-in slide-in-from-top-1">{errors.simNumber}</p>
                      )}
                    </div>

                    {/* IMEI */}
                    <div className="space-y-2">
                      <Label htmlFor="imei" className="text-gray-700 dark:text-gray-300">
                        {t.simActivation.fields.imei} <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          id="imei"
                          name="imei"
                          placeholder={t.simActivation.fields.imeiPlaceholder}
                          value={formData.imei}
                          onChange={handleInputChange}
                          maxLength={15}
                          className={`pl-9 ${errors.imei ? "border-red-500 ring-red-500" : ""}`}
                          required
                        />
                      </div>
                      {errors.imei && (
                        <p className="text-xs text-red-500 animate-in slide-in-from-top-1">{errors.imei}</p>
                      )}
                    </div>

                    {/* ICCID */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="iccid" className="text-gray-700 dark:text-gray-300">
                        {t.simActivation.fields.iccid} <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          id="iccid"
                          name="iccid"
                          placeholder={t.simActivation.fields.iccidPlaceholder}
                          value={formData.iccid}
                          onChange={handleInputChange}
                          maxLength={19}
                          className={`pl-9 font-mono ${errors.iccid ? "border-red-500 ring-red-500" : ""}`}
                          required
                        />
                      </div>
                      {errors.iccid && (
                        <p className="text-xs text-red-500 animate-in slide-in-from-top-1">{errors.iccid}</p>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-gray-700 dark:text-gray-300">
                      {t.simActivation.fields.notes}
                    </Label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                         <textarea
                            id="notes"
                            name="notes"
                            placeholder={t.simActivation.fields.notesPlaceholder}
                            value={formData.ba_notes}
                            onChange={handleInputChange}
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-9 resize-none"
                         />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                  >
                    {t.actions.cancel}
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="group relative h-12 rounded-xl px-8 font-semibold overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    style={{
                      background: 'linear-gradient(135deg, #F97316 0%, #EC4899 100%)',
                    }}
                  >
                    {/* Effet de brillance */}
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000" />

                    {/* Contenu */}
                    <div className="relative z-10 flex items-center justify-center text-white">
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                          {t.common.loading}
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                          {t.simActivation.activate}
                        </>
                      )}
                    </div>
                  </Button>
                </div>
              </Form>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
