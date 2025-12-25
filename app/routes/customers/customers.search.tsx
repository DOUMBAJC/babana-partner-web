import { useState } from 'react';
import { useNavigate, data, useActionData } from 'react-router';
import { 
  Loader2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  User as UserIcon,
  Badge as BadgeIcon
} from 'lucide-react';
import {
  Card,
  Badge,
  Layout
} from '~/components';
import { useTranslation, usePageTitle } from '~/hooks'; 
import type { Customer, IdCardType } from '~/types/customer.types';
import type { Route } from "./+types/customers.search";
import { createAuthenticatedApi, getCurrentUser } from '~/services/api.server';
import { getLanguage } from '~/services/session.server';
import { getTranslations, type Language } from '~/lib/translations';

// Import des composants et configurations modulaires
import { AUTHORIZED_ROLES, type SearchQuery, type ActivationStatus } from './_search/config';
import { useIdCardValidation } from './_search/hooks/useIdCardValidation';
import {
  AccessDenied,
  CustomerFoundCard,
  CustomerNotFoundCard,
  SearchForm
} from './_search/components';

// --- LOADER ---
export async function loader({ request }: Route.LoaderArgs) {
  try {
    const user = await getCurrentUser(request);
    
    if (!user) {
      return data({ 
        user: null, 
        idCardTypes: [], 
        hasAccess: false,
        error: null 
      });
    }

    const hasAccess = user.roles?.some((role: any) => 
      AUTHORIZED_ROLES.includes(role.slug)
    );

    if (!hasAccess) {
      return data({ 
        user, 
        idCardTypes: [], 
        hasAccess: false,
        error: null 
      });
    }

    const api = await createAuthenticatedApi(request);
    const response = await api.get('/idCardTypes');
    
    const idCardTypes = Array.isArray(response.data) 
      ? response.data 
      : (response.data?.data || []);

    return data({ 
      user, 
      idCardTypes, 
      hasAccess: true,
      error: null 
    });
  } catch (error: any) {
    console.error('Erreur dans le loader:', error?.message);
    
    return data({ 
      user: null, 
      idCardTypes: [], 
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
  const idCardTypeId = formData.get('id_card_type_id') as string;
  const idCardNumber = formData.get('id_card_number') as string;

  if (!idCardTypeId || !idCardNumber) {
    return data({
      success: false,
      error: t.customerSearch.errors.fillAllFields,
      searchStatus: 'idle'
    }, { status: 400 });
  }

  try {
    const api = await createAuthenticatedApi(request);
    
    const response = await api.post('/customers/searchByIdCard', {
      id_card_type_id: parseInt(idCardTypeId),
      id_card_number: idCardNumber
    });

    const responseData = response.data;
    
    if (responseData.found && responseData.data) {
      return data({
        success: true,
        searchStatus: 'found',
        customer: responseData.data,
        activationStatus: responseData.activation_status || null,
        error: null
      });
    } else {
      return data({
        success: false,
        searchStatus: 'not_found',
        customer: null,
        activationStatus: null,
        error: responseData.message || t.customerSearch.results.notFound,
        searchQuery: { id_card_type_id: idCardTypeId, id_card_number: idCardNumber }
      });
    }
  } catch (error: any) {
    console.error('Erreur lors de la recherche:', error);
    return data({
      success: false,
      searchStatus: 'idle',
      customer: null,
      activationStatus: null,
      error: error?.message || 'Une erreur est survenue lors de la recherche'
    }, { status: 500 });
  }
}

// --- COMPOSANT PRINCIPAL ---
export default function CustomerSearchPage({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation();
  usePageTitle(t.pages.customers.search.title);
  
  const navigate = useNavigate();
  const actionData = useActionData<typeof action>();
  
  const { user, idCardTypes, hasAccess, error: loaderError } = loaderData;
  const isAuthenticated = !!user;
  
  const [searchQuery, setSearchQuery] = useState<SearchQuery>({
    id_card_type_id: (actionData as any)?.searchQuery?.id_card_type_id || '',
    id_card_number: (actionData as any)?.searchQuery?.id_card_number || ''
  });

  const searchStatus = (actionData as any)?.searchStatus || 'idle';
  const customer = (actionData as any)?.customer || null;
  const activationStatus = (actionData as any)?.activationStatus || null;
  const errorMessage = (actionData as any)?.error || loaderError || '';

  const selectedCardType = idCardTypes.find(
    (type: IdCardType) => type.id.toString() === searchQuery.id_card_type_id
  );

  const { 
    validationError, 
    validateIdCardNumber, 
    setValidationError 
  } = useIdCardValidation(selectedCardType, t.customerSearch.errors.invalidFormat);

  const handleIdCardNumberChange = (value: string) => {
    setSearchQuery({...searchQuery, id_card_number: value});
    
    if (value.length > 0) {
      validateIdCardNumber(value);
    } else {
      setValidationError('');
    }
  };

  const handleIdCardTypeChange = (value: string) => {
    setSearchQuery({...searchQuery, id_card_type_id: value});
    
    if (searchQuery.id_card_number) {
      setTimeout(() => {
        const newCardType = idCardTypes.find(
          (type: IdCardType) => type.id.toString() === value
        );
        if (newCardType?.validation_pattern) {
          try {
            const regex = new RegExp(newCardType.validation_pattern);
            const isValid = regex.test(searchQuery.id_card_number);
            if (!isValid) {
              setValidationError(
                t.customerSearch.errors.invalidFormat 
                || `Format invalide pour ${newCardType.name}`
              );
            } else {
              setValidationError('');
            }
          } catch (error) {
            setValidationError('');
          }
        } else {
          setValidationError('');
        }
      }, 100);
    }
  };

  const handleReset = () => {
    setSearchQuery({ id_card_type_id: '', id_card_number: '' });
    setValidationError('');
    window.location.reload();
  };

  const handleCreateCustomer = () => {
    navigate('/customers/create', {
      state: {
        idCardTypeId: searchQuery.id_card_type_id,
        idCardNumber: searchQuery.id_card_number
      }
    });
  };

  const handleActivateCustomer = () => {
    if (customer) {
      navigate('/sales/activation', { state: { customer } });
    }
  };

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
        <AccessDenied onBackHome={() => navigate('/')} />
      </Layout>
    );
  }

  const isLocked = searchStatus === 'found';

  return (
    <Layout>
      <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full mix-blend-screen opacity-50 animate-pulse-slow" />
          <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] bg-secondary/20 blur-[100px] rounded-full mix-blend-screen opacity-40 animate-pulse-slow delay-1000" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/60 drop-shadow-sm">
              {t.customerSearch.title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t.customerSearch.subtitleIdCard}
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Badge variant="outline" className="px-4 py-1.5 rounded-full border-primary/20 bg-primary/5 text-primary backdrop-blur-sm">
                <ShieldCheck className="w-3.5 h-3.5 mr-2" />
                {t.customerSearch.securePortal}
              </Badge>
            </div>
          </div>
          
          {/* Carte principale */}
          <Card className="border-0 shadow-2xl bg-card/50 backdrop-blur-xl ring-1 ring-white/10 dark:ring-white/5 overflow-hidden">
            <div className="p-8 md:p-10 space-y-8">
              {/* En-tête de la carte */}
              <div className="flex items-center justify-between border-b border-border/50 pb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary ring-1 ring-primary/20">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">{t.customerSearch.searchCriteria}</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t.customerSearch.searchCriteriaDescription}
                    </p>
                  </div>
                </div>
                {searchStatus === 'found' && (
                  <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20 px-3 py-1 text-sm">
                    <UserIcon className="w-4 h-4 mr-2" />
                    {t.customerSearch.results.found}
                  </Badge>
                )}
              </div>

              {/* Message d'erreur */}
              {errorMessage && searchStatus !== 'found' && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-start gap-4">
                  <div className="p-2 bg-yellow-500/20 rounded-full text-yellow-600 mt-1">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-yellow-700 dark:text-yellow-400">{t.customerSearch.errors.attention}</h4>
                    <p className="text-sm text-yellow-600/90 dark:text-yellow-400/90 mt-1">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Résultat : Client trouvé */}
              {searchStatus === 'found' && customer && (
                <CustomerFoundCard
                  customer={customer}
                  activationStatus={activationStatus}
                  onActivateCustomer={handleActivateCustomer}
                  onReset={handleReset}
                />
              )}

              {/* Formulaire de recherche */}
              <SearchForm
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
                idCardTypes={idCardTypes}
                validationError={validationError}
                onIdCardNumberChange={handleIdCardNumberChange}
                onIdCardTypeChange={handleIdCardTypeChange}
                isLocked={isLocked}
                selectedCardType={selectedCardType}
              />

              {/* Actions : Client non trouvé */}
              {searchStatus === 'not_found' && (
                <CustomerNotFoundCard
                  onCreateCustomer={handleCreateCustomer}
                  onReset={handleReset}
                />
              )}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
